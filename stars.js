const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const STAR_COUNT = 120;
const SHOOTING_STAR_CHANCE = 0.012;

let stars = [];
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.2 + 0.3,
    alpha: Math.random(),
    delta: (Math.random() * 0.02) + 0.005
  });
}

let shootingStars = [];

function drawStars() {
  for (let star of stars) {
    star.alpha += star.delta;
    if (star.alpha > 1 || star.alpha < 0.2) star.delta *= -1;
    ctx.save();
    ctx.globalAlpha = star.alpha;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }
}

function spawnShootingStar() {
  if (Math.random() < SHOOTING_STAR_CHANCE && shootingStars.length < 2) {
    const startX = Math.random() * window.innerWidth * 0.7 + window.innerWidth * 0.1;
    const startY = Math.random() * window.innerHeight * 0.3 + 20;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // Diagonal
    const speed = (Math.random() * 2 + 1.2); // Más lento y suave
    const len = Math.random() * 80 + 80;
    shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len,
      traveled: 0,
      maxTravel: len,
      alpha: 1
    });
  }
}

function drawShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i];
    // Cola
    for (let j = 0; j < 14; j++) {
      let t = j / 14;
      ctx.save();
      ctx.globalAlpha = s.alpha * (1 - t) * 0.7;
      ctx.beginPath();
      ctx.arc(
        s.x - s.vx * j * 2,
        s.y - s.vy * j * 2,
        2 - t * 1.5,
        0, 2 * Math.PI
      );
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 8 - t * 8;
      ctx.fill();
      ctx.restore();
    }
    // Cabeza brillante
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.restore();

    // Movimiento y desvanecimiento
    s.x += s.vx;
    s.y += s.vy;
    s.traveled += Math.sqrt(s.vx * s.vx + s.vy * s.vy);
    s.alpha -= 0.008; // Más lento el desvanecimiento
    if (s.traveled > s.maxTravel || s.alpha <= 0) shootingStars.splice(i, 1);
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  spawnShootingStar();
  drawShootingStars();
  window.requestAnimationFrame(animate); // Animación fluida
}

animate();
