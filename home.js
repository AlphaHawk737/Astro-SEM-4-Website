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

//center appear
setTimeout(() => {
  home.classList.remove("state-hidden");
  home.classList.add("state-center");
}, 200);

//fade out
setTimeout(() => {
  home.classList.remove("state-center");
  home.classList.add("state-fadeout");
}, 3000);

//reappear on side
setTimeout(() => {
  home.classList.remove("state-fadeout");
  home.classList.add("state-side");
}, 4000);

//show button
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

// Fix back-button black screen
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    document.body.classList.remove("page-exit");
  }
});