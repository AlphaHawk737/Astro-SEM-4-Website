window.addEventListener("load", () => {
  const home = document.getElementById("home");
  const cta = document.getElementById("cta");
  const clickSound = document.getElementById("clickSound");

  clickSound.volume = 0.4;

  // 🔓 Unlock audio on first interaction
let audioUnlocked = false;

function unlockAudio() {
  if (!audioUnlocked) {
    clickSound.play().then(() => {
      clickSound.pause();
      clickSound.currentTime = 0;
      audioUnlocked = true;
    }).catch(() => {});
  }
}

document.addEventListener("pointerdown", unlockAudio, { once: true });


  // Entrance animation
  setTimeout(() => {
    home.classList.remove("intro-hidden");
    home.classList.add("intro-visible");
  }, 200);

  // Fade out
  setTimeout(() => {
    home.classList.remove("intro-visible");
    home.classList.add("intro-fadeout");
  }, 3200);

  // Reposition neatly
  setTimeout(() => {
    home.classList.remove("intro-fadeout");
    home.classList.add("intro-side");
  }, 4300);

  // Show button
  setTimeout(() => {
    cta.classList.add("show");
  }, 5200);

  // Button click sound
  cta.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
    // navigation later
  });
});
