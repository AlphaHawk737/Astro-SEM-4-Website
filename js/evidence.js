/* =========================
   GLOBAL UI LOGIC
========================= */

const clickSound = document.getElementById("clickSound");
clickSound.volume = 0.4;

// Unlock audio
document.addEventListener("pointerdown", () => {
  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
  }).catch(() => { });
}, { once: true });

document.addEventListener("DOMContentLoaded", () => {

  const title = document.getElementById("evidenceTitle");

  setTimeout(() => {
    title.classList.add("show");
  }, 300);

  const revealElements = document.querySelectorAll(".content-section");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          entry.target.style.filter = "blur(0)";
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
    section.style.filter = "blur(6px)";
    section.style.transition = "all 0.8s ease";

    revealObserver.observe(section);
  });

  const buttons = document.querySelectorAll(".cta-button[data-link]");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      if (btn.classList.contains("disabled")) return;

      clickSound.currentTime = 0;
      clickSound.play();

      document.body.style.transition = "all 0.5s ease";
      document.body.style.opacity = "0";
      document.body.style.transform = "scale(0.98)";

      setTimeout(() => {
        window.location.href = btn.dataset.link;
      }, 500);
    });
  });

});


/* =========================
   SCROLL + UI
========================= */

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    document.body.classList.remove("page-exit");
  }
});

document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progressBar = document.querySelector(".progress-bar");

  if (!progressBar || documentHeight <= 0) return;

  const scrollPercent = (scrollTop / documentHeight) * 100;
  progressBar.style.width = scrollPercent + "%";
});

const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) scrollBtn.classList.add("show");
  else scrollBtn.classList.remove("show");
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/* =========================
   ROTATION CURVE SIMULATION
========================= */

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

  function generateRadius() {
    let r = [];
    for (let i = 0.5; i <= 20; i += 0.5) r.push(i);
    return r;
  }

  function diskVelocity(r, M_d) {
    let R_d = 3;
    let mass = M_d * (1 - Math.exp(-r / R_d) * (1 + r / R_d));
    return Math.sqrt(G * mass / r);
  }

  function haloVelocity(r, rho0, rs = 10) {
    let x = r / rs;
    let mass = 4 * Math.PI * rho0 * Math.pow(rs, 3) *
      (Math.log(1 + x) - (x / (1 + x)));
    return Math.sqrt(G * mass / r);
  }

  const ctx = canvas.getContext("2d");

  const glowPlugin = {
    id: 'glow',
    beforeDatasetDraw(chart, args) {
      const { ctx } = chart;
      ctx.save();
      ctx.shadowColor = args.meta.dataset.options.borderColor;
      ctx.shadowBlur = 8;
    },
    afterDatasetDraw(chart) {
      chart.ctx.restore();
    }
  };

  let chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Disk",
          data: [],
          borderColor: "#4DA3FF",
          tension: 0.4
        },
        {
          label: "Halo",
          data: [],
          borderColor: "#FF5C8A",
          tension: 0.4
        },
        {
          label: "Total",
          data: [],
          borderColor: "#FFA94D",
          tension: 0.4,
          borderWidth: 3
        },
        {
          label: "Observed",
          data: observedData,
          type: "scatter",
          backgroundColor: "#00E5FF",
          hidden: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      animation: {
        duration: 600
      },

      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      },

      scales: {
        x: {
          ticks: { color: "white" },
          title: { display: true, text: "Radius (kpc)", color: "white" }
        },
        y: {
          ticks: { color: "white" },
          title: { display: true, text: "Velocity (km/s)", color: "white" }
        }
      }
    },
    plugins: [glowPlugin]
  });

  function updateCurve() {

    const radii = generateRadius();

    let M_d = document.getElementById("diskMass").value * 1e10;
    let rho0 = document.getElementById("haloDensity").value * 1e6;
    let useHalo = document.getElementById("toggleHalo").checked;
    let compareMode = document.getElementById("compareMode").checked;

    document.getElementById("diskMassVal").innerText = M_d.toExponential(2);
    document.getElementById("haloDensityVal").innerText = rho0.toExponential(2);

    let disk = [], halo = [], total = [];

    radii.forEach(r => {
      let vd = diskVelocity(r, M_d);
      let vh = haloVelocity(r, rho0);
      let vt = useHalo ? Math.sqrt(vd * vd + vh * vh) : vd;

      disk.push(vd);
      halo.push(vh);
      total.push(vt);
    });

    // ✅ CRITICAL FIX
    chart.data.labels = radii;
    chart.data.datasets[0].data = disk;
    chart.data.datasets[1].data = halo;
    chart.data.datasets[2].data = total;

    // Visibility logic
    chart.data.datasets[0].hidden = compareMode;
    chart.data.datasets[1].hidden = compareMode;
    chart.data.datasets[2].hidden = false;
    chart.data.datasets[3].hidden = !compareMode;

    // Equation
    let r = 10;
    let v = total[Math.floor(r * 2)];
    let M = (v * v * r) / G;

    document.getElementById("equationMain").innerHTML =
      "\\[ v(r) = \\sqrt{\\frac{G M(r)}{r}} \\]";

    document.getElementById("equationMass").innerHTML =
      `\\[ M(${r}) \\approx ${M.toExponential(3)}\\ M_\\odot \\]`;

    document.getElementById("equationVelocity").innerHTML =
      `\\[ v \\approx ${v.toFixed(2)}\\ \\text{km/s} \\]`;

    chart.update();

    if (window.MathJax) MathJax.typesetPromise();
  }

  document.getElementById("diskMass").addEventListener("input", updateCurve);
  document.getElementById("haloDensity").addEventListener("input", updateCurve);
  document.getElementById("toggleHalo").addEventListener("change", updateCurve);
  document.getElementById("compareMode").addEventListener("change", updateCurve);

  updateCurve();
});