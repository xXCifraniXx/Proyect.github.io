/*
  CONFETI
  -------
  Efecto de confeti en canvas, sin dependencias. Crea su propio <canvas>
  (encima de todo, sin bloquear los clics) la primera vez que se usa.

    Confetti.celebrate()                      dos cañones laterales + lluvia
    Confetti.launch({ x, y, count, spread })  ráfaga desde un punto (0..1)
*/
(() => {
  "use strict";

  const COLORS = ["#ff9eb8", "#ff6f9a", "#c99bff", "#f3d99f", "#9ef0c6", "#fff8fb"];
  const GRAVITY = 900;
  const DRAG = 0.992;

  let canvas = null;
  let ctx = null;
  let width = 0;
  let height = 0;
  let pieces = [];
  let raf = 0;
  let last = 0;

  const prefersReducedMotion = () =>
    !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "95"
    });
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }

  function makePiece(x, y, angle, speed) {
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      round: Math.random() < 0.25,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 10,
      tilt: Math.random() * Math.PI * 2,
      vtilt: 4 + Math.random() * 6,
      age: 0,
      life: 3.2 + Math.random() * 2.2
    };
  }

  function frame(time) {
    const dt = Math.min(0.033, (time - last) / 1000 || 0.016);
    last = time;
    ctx.clearRect(0, 0, width, height);

    pieces = pieces.filter((p) => {
      p.age += dt;
      p.vx *= DRAG;
      p.vy = p.vy * DRAG + GRAVITY * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vrot * dt;
      p.tilt += p.vtilt * dt;

      if (p.y > height + 30 || p.age > p.life) return false;

      const fade = p.age > p.life - 0.6 ? Math.max(0, (p.life - p.age) / 0.6) : 1;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.scale(1, Math.cos(p.tilt));
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
      return true;
    });

    if (pieces.length) {
      raf = requestAnimationFrame(frame);
    } else {
      raf = 0;
      ctx.clearRect(0, 0, width, height);
    }
  }

  function start() {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  function launch({ x = 0.5, y = 1, count = 120, spread = 70, angle = -90, power = 900 } = {}) {
    if (prefersReducedMotion()) return;
    ensureCanvas();
    const base = (angle * Math.PI) / 180;
    const half = (spread * Math.PI) / 360;
    for (let i = 0; i < count; i += 1) {
      const a = base + (Math.random() * 2 - 1) * half;
      const speed = power * (0.45 + Math.random() * 0.55);
      pieces.push(makePiece(x * window.innerWidth, y * window.innerHeight, a, speed));
    }
    start();
  }

  function celebrate() {
    if (prefersReducedMotion()) return;
    launch({ x: 0.08, y: 1, count: 110, angle: -60, spread: 55 });
    launch({ x: 0.92, y: 1, count: 110, angle: -120, spread: 55 });
    setTimeout(() => launch({ x: 0.5, y: 1, count: 90, angle: -90, spread: 80, power: 1000 }), 350);
    // Lluvia suave desde arriba.
    for (let i = 0; i < 70; i += 1) {
      setTimeout(() => {
        ensureCanvas();
        const p = makePiece(Math.random() * window.innerWidth, -10, Math.PI / 2, 60 + Math.random() * 120);
        pieces.push(p);
        start();
      }, 400 + i * 22);
    }
  }

  window.Confetti = { launch, celebrate };
})();
