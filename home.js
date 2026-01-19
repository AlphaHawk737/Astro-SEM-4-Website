const home = document.getElementById("home");
const cta = document.getElementById("cta");
const clickSound = document.getElementById("clickSound");

clickSound.volume = 0.4;

// unlock audio
document.addEventListener("pointerdown", () => {
  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });

// STEP 1: center appear
setTimeout(() => {
  home.classList.remove("state-hidden");
  home.classList.add("state-center");
}, 200);

// STEP 2: fade out
setTimeout(() => {
  home.classList.remove("state-center");
  home.classList.add("state-fadeout");
}, 3000);

// STEP 3: reappear on side
setTimeout(() => {
  home.classList.remove("state-fadeout");
  home.classList.add("state-side");
}, 4000);

// STEP 4: show button AFTER reappear
setTimeout(() => {
  cta.classList.remove("hidden");
  cta.classList.add("show");
}, 4700);

// Navigation
cta.addEventListener("click", () => {
  clickSound.currentTime = 0;
  clickSound.play();

  document.body.classList.add("page-exit");

  setTimeout(() => {
    window.location.href = cta.dataset.link;
  }, 500);
});
