/*
  CONFETI
  -------
  Efecto de confeti en un <canvas> propio, encima de todo y sin bloquear los
  clics. Se crea la primera vez que se usa. Con "reducir movimiento" activado
  en el dispositivo no hace nada.

    celebrar()                               dos cañones laterales + lluvia
    lanzarConfeti({ x, y, count, spread })   ráfaga desde un punto (0..1)
*/
const COLORES = ["#ff9eb8", "#ff6f9a", "#c99bff", "#f3d99f", "#9ef0c6", "#fff8fb"];
const GRAVEDAD = 900;
const ROCE = 0.992;

interface Pieza {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  round: boolean;
  rot: number;
  vrot: number;
  tilt: number;
  vtilt: number;
  age: number;
  life: number;
}

export interface OpcionesConfeti {
  x?: number;
  y?: number;
  count?: number;
  spread?: number;
  angle?: number;
  power?: number;
}

let lienzo: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let ancho = 0;
let alto = 0;
let piezas: Pieza[] = [];
let cuadro = 0;
let ultimo = 0;

const reducirMovimiento = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function ajustarTamano() {
  if (!lienzo || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  ancho = window.innerWidth;
  alto = window.innerHeight;
  lienzo.width = Math.round(ancho * dpr);
  lienzo.height = Math.round(alto * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function asegurarLienzo(): CanvasRenderingContext2D | null {
  if (ctx) return ctx;
  lienzo = document.createElement("canvas");
  lienzo.setAttribute("aria-hidden", "true");
  Object.assign(lienzo.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "95"
  });
  document.body.appendChild(lienzo);
  ctx = lienzo.getContext("2d");
  ajustarTamano();
  window.addEventListener("resize", ajustarTamano);
  return ctx;
}

function nuevaPieza(x: number, y: number, angulo: number, velocidad: number): Pieza {
  return {
    x,
    y,
    vx: Math.cos(angulo) * velocidad,
    vy: Math.sin(angulo) * velocidad,
    size: 6 + Math.random() * 6,
    color: COLORES[Math.floor(Math.random() * COLORES.length)],
    round: Math.random() < 0.25,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 10,
    tilt: Math.random() * Math.PI * 2,
    vtilt: 4 + Math.random() * 6,
    age: 0,
    life: 3.2 + Math.random() * 2.2
  };
}

function dibujar(tiempo: number) {
  if (!ctx) return;
  const c = ctx;
  const dt = Math.min(0.033, (tiempo - ultimo) / 1000 || 0.016);
  ultimo = tiempo;
  c.clearRect(0, 0, ancho, alto);

  piezas = piezas.filter((p) => {
    p.age += dt;
    p.vx *= ROCE;
    p.vy = p.vy * ROCE + GRAVEDAD * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vrot * dt;
    p.tilt += p.vtilt * dt;
    if (p.y > alto + 30 || p.age > p.life) return false;

    const desvanecer = p.age > p.life - 0.6 ? Math.max(0, (p.life - p.age) / 0.6) : 1;
    c.save();
    c.globalAlpha = desvanecer;
    c.translate(p.x, p.y);
    c.rotate(p.rot);
    c.fillStyle = p.color;
    if (p.round) {
      c.beginPath();
      c.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      c.fill();
    } else {
      c.scale(1, Math.cos(p.tilt));
      c.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    c.restore();
    return true;
  });

  if (piezas.length) {
    cuadro = requestAnimationFrame(dibujar);
  } else {
    cuadro = 0;
    c.clearRect(0, 0, ancho, alto);
  }
}

function arrancar() {
  if (!cuadro) {
    ultimo = performance.now();
    cuadro = requestAnimationFrame(dibujar);
  }
}

export function lanzarConfeti({
  x = 0.5,
  y = 1,
  count = 120,
  spread = 70,
  angle = -90,
  power = 900
}: OpcionesConfeti = {}) {
  if (reducirMovimiento() || !asegurarLienzo()) return;
  const base = (angle * Math.PI) / 180;
  const mitad = (spread * Math.PI) / 360;
  for (let i = 0; i < count; i += 1) {
    const a = base + (Math.random() * 2 - 1) * mitad;
    const velocidad = power * (0.45 + Math.random() * 0.55);
    piezas.push(nuevaPieza(x * window.innerWidth, y * window.innerHeight, a, velocidad));
  }
  arrancar();
}

export function celebrar() {
  if (reducirMovimiento()) return;
  lanzarConfeti({ x: 0.08, y: 1, count: 110, angle: -60, spread: 55 });
  lanzarConfeti({ x: 0.92, y: 1, count: 110, angle: -120, spread: 55 });
  setTimeout(() => lanzarConfeti({ x: 0.5, y: 1, count: 90, angle: -90, spread: 80, power: 1000 }), 350);
  // Lluvia suave desde arriba.
  for (let i = 0; i < 70; i += 1) {
    setTimeout(
      () => {
        if (!asegurarLienzo()) return;
        piezas.push(nuevaPieza(Math.random() * window.innerWidth, -10, Math.PI / 2, 60 + Math.random() * 120));
        arrancar();
      },
      400 + i * 22
    );
  }
}
