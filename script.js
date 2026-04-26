document.addEventListener("DOMContentLoaded", () => {

  // ================= NAVBAR =================
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  // ================= HERO IMAGE =================
  const img = document.querySelector(".hero-img");

  if (!img) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let time = 0;

  // Mouse tracking
  document.addEventListener("mousemove", (e) => {
    mouseX = (window.innerWidth / 2 - e.clientX) / 20;
    mouseY = (window.innerHeight / 2 - e.clientY) / 20;
  });

  // Hover glow effect
  img.addEventListener("mouseenter", () => {
    img.style.boxShadow = "0 30px 80px rgba(255,123,0,0.35)";
  });

  img.addEventListener("mouseleave", () => {
    img.style.boxShadow = "0 20px 60px rgba(255,123,0,0.25)";
  });

  // Animation loop (inertia + float + scroll)
  function animate() {
    // smooth follow (inertia)
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    // floating motion
    time += 0.03;
    const floatY = Math.sin(time) * 12;

    // scroll parallax
    const scrollY = window.scrollY * 0.15;

    // final transform
    img.style.transform = `
      translate3d(${currentX}px, ${currentY + floatY - scrollY}px, 0)
      rotateY(${currentX * 0.5}deg)
      rotateX(${-currentY * 0.5}deg)
      scale(1.05)
    `;

    requestAnimationFrame(animate);
  }

  animate();
});