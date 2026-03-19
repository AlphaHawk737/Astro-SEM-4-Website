document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("rotationChart");
  if (!canvas) return;

  const G = 4.302e-6;

  const observedData = [
    { x: 0.5, y: 90 }, { x: 1.5, y: 130 }, { x: 2.5, y: 160 },
    { x: 3.5, y: 180 }, { x: 4.5, y: 200 }, { x: 5.5, y: 210 },
    { x: 6.5, y: 215 }, { x: 7.5, y: 220 }, { x: 8.5, y: 220 },
    { x: 9.5, y: 225 }, { x: 10.5, y: 225 }, { x: 12.5, y: 230 },
    { x: 15.5, y: 230 }, { x: 18.5, y: 235 }
  ];

  function radii() {
    let r = [];
    for (let i = 0.5; i <= 20; i += 0.5) r.push(i);
    return r;
  }

  function diskVelocity(r, M_d) {
    const R_d = 3;
    const mass = M_d * (1 - Math.exp(-r / R_d) * (1 + r / R_d));
    return Math.sqrt(G * mass / r);
  }

  function haloVelocity(r, rho0, rs = 10) {
    const x = r / rs;
    const mass = 4 * Math.PI * rho0 * Math.pow(rs, 3) * (Math.log(1 + x) - x / (1 + x));
    return Math.sqrt(G * mass / r);
  }

  const ctx = canvas.getContext("2d");

  const glowPlugin = {
    id: "glow",
    beforeDatasetDraw(chart, args) {
      chart.ctx.save();
      chart.ctx.shadowColor = args.meta.dataset.options.borderColor;
      chart.ctx.shadowBlur = 10;
    },
    afterDatasetDraw(chart) {
      chart.ctx.restore();
    }
  };

  // Dataset indices:
  // 0 = Disk, 1 = Halo, 2 = Total, 3 = Expected (Model), 4 = Observed
  const DISK = 0;
  const HALO = 1;
  const TOTAL = 2;
  const EXPECTED = 3;
  const OBSERVED = 4;

  const DEFAULT_LABELS = new Set(["Disk", "Halo", "Total"]);
  const COMPARE_LABELS = new Set(["Expected (Model)", "Observed"]);

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        // 0: Disk
        {
          label: "Disk",
          data: [],
          borderColor: "#4DA3FF",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0
        },
        // 1: Halo
        {
          label: "Halo",
          data: [],
          borderColor: "#FF5C8A",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0
        },
        // 2: Total
        {
          label: "Total",
          data: [],
          borderColor: "#FFA94D",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0
        },
        // 3: Expected (Model)
        {
          label: "Expected (Model)",
          data: [],
          borderColor: "#FFA94D",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
          hidden: true
        },
        // 4: Observed
        {
          label: "Observed",
          data: observedData,
          type: "scatter",
          backgroundColor: "#00E5FF",
          borderColor: "#00E5FF",
          pointRadius: 5,
          hidden: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      animation: {
        duration: 700,
        easing: "easeInOutCubic"
      },

      scales: {
        x: {
          type: "linear",
          min: 0,
          max: 20,
          title: { display: true, text: "Radius (kpc)", color: "rgba(255,255,255,0.8)" },
          ticks: { color: "rgba(255,255,255,0.7)" },
          grid: { color: "rgba(255,255,255,0.08)" }
        },
        y: {
          title: { display: true, text: "Velocity (km/s)", color: "rgba(255,255,255,0.8)" },
          ticks: { color: "rgba(255,255,255,0.7)" },
          grid: { color: "rgba(255,255,255,0.08)" }
        }
      },

      plugins: {
        legend: {
          labels: {
            color: "white",
            // Only show labels relevant to the current mode
            filter(item) {
              const el = document.getElementById("compareMode");
              const compareMode = el ? el.checked : false;
              return compareMode
                ? COMPARE_LABELS.has(item.text)
                : DEFAULT_LABELS.has(item.text);
            }
          }
        }
      }
    },
    plugins: [glowPlugin]
  });

  function updateCurve() {
    const M_d = document.getElementById("diskMass").value * 1e10;
    const rho0 = document.getElementById("haloDensity").value * 1e6;
    const useHalo = true
    const compare = false

    document.getElementById("diskMassVal").innerText = M_d.toExponential(2);
    document.getElementById("haloDensityVal").innerText = rho0.toExponential(2);

    const rVals = radii();
    const disk = [], halo = [], total = [];

    rVals.forEach(r => {
      const vd = diskVelocity(r, M_d);
      const vh = haloVelocity(r, rho0);
      const vt = useHalo ? Math.sqrt(vd * vd + vh * vh) : vd;
      disk.push({ x: r, y: vd });
      halo.push({ x: r, y: vh });
      total.push({ x: r, y: vt });
    });

    // Update the data on every dataset in place (no array replacement)
    chart.data.datasets[DISK].data = disk;
    chart.data.datasets[HALO].data = halo;
    chart.data.datasets[TOTAL].data = total;
    chart.data.datasets[EXPECTED].data = total; // same curve, different label

    // Must update BOTH dataset.hidden (config) AND meta.hidden (runtime state)
    // Chart.js uses meta.hidden at runtime, but dataset.hidden is the source of truth for resets
    [[DISK, compare], [HALO, compare], [TOTAL, compare],
    [EXPECTED, !compare], [OBSERVED, !compare]].forEach(([i, h]) => {
      chart.data.datasets[i].hidden = h;
      chart.getDatasetMeta(i).hidden = h;
    });

    // Update with animation - 'reset' mode forces Chart.js to re-read all visibility state
    chart.update('reset');
    chart.update();

    // Equations at r = 10 kpc
    const r = 10;
    const v = total[r * 2].y;
    const M = (v * v * r) / G;

    document.getElementById("equationMain").innerHTML =
      "\\[ v(r) = \\sqrt{\\frac{G M(r)}{r}} \\]";
    document.getElementById("equationMass").innerHTML =
      `\\[ M(${r}) \\approx ${M.toExponential(3)}\\ M_\\odot \\]`;
    document.getElementById("equationVelocity").innerHTML =
      `\\[ v \\approx ${v.toFixed(2)}\\ \\text{km/s} \\]`;

    if (window.MathJax) MathJax.typesetPromise();
  }

  document.getElementById("diskMass").addEventListener("input", updateCurve);
  document.getElementById("haloDensity").addEventListener("input", updateCurve);
  updateCurve();
});