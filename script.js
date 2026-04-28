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
const canvas = document.getElementById("dustCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 200;

ctx.fillStyle = "white";
ctx.font = "bold 120px Poppins";
ctx.textAlign = "center";
ctx.fillText("Titanium", canvas.width / 2, 130);

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const particles = [];

for (let y = 0; y < imageData.height; y += 3) {
  for (let x = 0; x < imageData.width; x += 3) {
    const i = (y * imageData.width + x) * 4;
    if (imageData.data[i + 3] > 128) {
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y
      });
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    // subtle floating
    p.x += (Math.random() - 0.5) * 0.8;
    p.y += (Math.random() - 0.5) * 0.8;

    ctx.fillRect(p.x, p.y, 1, 1);
  });

  requestAnimationFrame(animate);
}

animate();