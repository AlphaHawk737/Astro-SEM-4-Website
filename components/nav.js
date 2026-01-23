// Navigation Bar Component

function initNav() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navbar-toggle");
  const navClose = document.getElementById("navbar-close");
  const navLinks = document.querySelectorAll(".navbar-link");
  const clickSound = document.getElementById("clickSound");

  if (!navbar || !navToggle) {
    console.error("Nav elements not found");
    return;
  }

  // Show nav after animations complete (4.7 seconds)
  setTimeout(() => {
    navbar.classList.remove("hidden");
    navbar.classList.add("show");
    navToggle.classList.remove("hidden");
    navToggle.classList.add("show");
  }, 4700);

  // Toggle navbar open/close
  navToggle.addEventListener("click", () => {
    navbar.classList.toggle("show");
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  });

  navClose.addEventListener("click", () => {
    navbar.classList.remove("show");
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  });

  // Close navbar when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (link.href && !link.href.includes("#")) {
        navbar.classList.remove("show");
        if (clickSound) {
          clickSound.currentTime = 0;
          clickSound.play().catch(() => {});
        }
      }
    });
  });

  // Close navbar when clicking outside
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && !navToggle.contains(e.target)) {
      if (navbar.classList.contains("show")) {
        navbar.classList.remove("show");
      }
    }
  });
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNav);
} else {
  initNav();
}
