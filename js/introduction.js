/* TITLE ANIMATION */



document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("introTitle");

  // Trigger title animation slightly after load
  setTimeout(() => {
    title.classList.add("show");
  }, 300);
});

const clickSound = document.getElementById("clickSound");
clickSound.volume = 0.4;

// Unlock audio on first interaction
document.addEventListener("pointerdown", () => {
  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });


/* SCROLL REVEAL ANIMATION */


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
  {
    threshold: 0.15
  }
);

// Initial hidden state
revealElements.forEach(section => {
  section.style.opacity = "0";
  section.style.transform = "translateY(40px)";
  section.style.filter = "blur(6px)";
  section.style.transition = "all 0.8s ease";

  revealObserver.observe(section);
});


/* NAVIGATION WITH PAGE EXIT TRANSITION */


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


// Fix back-button black screen
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    document.body.classList.remove("page-exit");
  }
});