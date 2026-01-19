const title = document.getElementById("introTitle");
const clickSound = document.getElementById("clickSound");

clickSound.volume = 0.4;

// unlock audio
document.addEventListener("pointerdown", () => {
  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });

// title animation
const text = title.textContent;
title.textContent = "";

[...text].forEach((char, i) => {
  const span = document.createElement("span");
  span.textContent = char === " " ? "\u00A0" : char;
  span.style.display = "inline-block";
  span.style.opacity = "0";
  span.style.transform = "scale(1.5)";
  span.style.transition = "all 0.25s ease";
  title.appendChild(span);

  setTimeout(() => {
    span.style.opacity = "1";
    span.style.transform = "scale(1)";
  }, i * 45);
});

// scroll reveal
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach(el => observer.observe(el));

// navigation buttons
document.querySelectorAll(".cta-button[data-link]").forEach(btn => {
  btn.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    document.body.classList.add("page-exit");

    setTimeout(() => {
      window.location.href = btn.dataset.link;
    }, 500);
  });
});
