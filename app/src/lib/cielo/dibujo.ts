/*
  DIBUJO DEL CIELO (canvas 2D)
  Fondo con nebulosas, polvo de estrellas, la constelación (líneas en el
  orden en que nacieron las estrellas) y las etiquetas. Lo usan el lienzo
  animado y la imagen que se descarga.
*/
import type { Estrella } from "./estrellas.ts";

/** Estrellitas de fondo (no se guardan). */
export interface Polvo {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
}

export function crearPolvo(ancho: number, alto: number): Polvo[] {
  return Array.from({ length: Math.round((ancho * alto) / 6000) }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.1 + 0.2,
    a: Math.random() * 0.5 + 0.15,
    tw: Math.random() * Math.PI * 2
  }));
}

function nebulosa(ctx: CanvasRenderingContext2D, x: number, y: number, radio: number, color: string) {
  const rg = ctx.createRadialGradient(x, y, 0, x, y, radio);
  rg.addColorStop(0, color);
  rg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function dibujarFondo(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#120817");
  g.addColorStop(0.5, "#231027");
  g.addColorStop(1, "#421b3f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const m = Math.max(w, h);
  nebulosa(ctx, w * 0.18, h * 0.22, m * 0.5, "rgba(255,158,184,0.16)");
  nebulosa(ctx, w * 0.85, h * 0.3, m * 0.45, "rgba(201,155,255,0.16)");
  nebulosa(ctx, w * 0.55, h * 0.9, m * 0.55, "rgba(243,217,159,0.10)");
}

export function dibujarPolvo(
  ctx: CanvasRenderingContext2D,
  polvo: Polvo[],
  w: number,
  h: number,
  offX: number,
  offY: number,
  t: number
) {
  for (const d of polvo) {
    const brillo = 0.6 + 0.4 * Math.sin(t * 0.001 + d.tw);
    ctx.beginPath();
    ctx.arc(d.x * w + offX * 0.25, d.y * h + offY * 0.25, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${(d.a * brillo).toFixed(3)})`;
    ctx.fill();
  }
}

function rectanguloRedondeado(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function dibujarEtiqueta(ctx: CanvasRenderingContext2D, x: number, y: number, texto: string) {
  ctx.font = "13px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const anchoCaja = ctx.measureText(texto).width + 16;
  ctx.fillStyle = "rgba(18,8,23,0.72)";
  rectanguloRedondeado(ctx, x - anchoCaja / 2, y, anchoCaja, 20, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(255,248,251,0.92)";
  ctx.fillText(texto, x, y + 4);
}

/**
 * Dibuja la constelación. "conEtiqueta" decide qué estrellas muestran su
 * recuerdo (la última recién creada, la que tiene el mouse encima, o todas
 * al exportar).
 */
export function dibujarConstelacion(
  ctx: CanvasRenderingContext2D,
  estrellas: Estrella[],
  w: number,
  h: number,
  offX: number,
  offY: number,
  t: number,
  conEtiqueta: (estrella: Estrella, indice: number) => boolean
) {
  if (estrellas.length === 0) return;

  ctx.lineWidth = 1;
  for (let i = 0; i < estrellas.length - 1; i += 1) {
    const a = estrellas[i];
    const b = estrellas[i + 1];
    const ax = a.x * w + offX;
    const ay = a.y * h + offY;
    const bx = b.x * w + offX;
    const by = b.y * h + offY;
    const lg = ctx.createLinearGradient(ax, ay, bx, by);
    lg.addColorStop(0, "rgba(255,158,184,0.45)");
    lg.addColorStop(1, "rgba(201,155,255,0.45)");
    ctx.strokeStyle = lg;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  estrellas.forEach((s, j) => {
    const x = s.x * w + offX;
    const y = s.y * h + offY;
    const titileo = 0.75 + 0.25 * Math.sin(t * 0.002 + s.seed);
    const nucleo = 2.2 + 1.3 * titileo;
    const halo = 22 * titileo;

    const rg = ctx.createRadialGradient(x, y, 0, x, y, halo);
    rg.addColorStop(0, "rgba(255,249,251,0.9)");
    rg.addColorStop(0.25, "rgba(255,158,184,0.5)");
    rg.addColorStop(1, "rgba(255,158,184,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, halo, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff9fb";
    ctx.beginPath();
    ctx.arc(x, y, nucleo, 0, Math.PI * 2);
    ctx.fill();

    // destello en cruz
    ctx.strokeStyle = `rgba(255,249,251,${(0.35 * titileo).toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - halo * 0.6, y);
    ctx.lineTo(x + halo * 0.6, y);
    ctx.moveTo(x, y - halo * 0.6);
    ctx.lineTo(x, y + halo * 0.6);
    ctx.stroke();

    if (s.label && conEtiqueta(s, j)) dibujarEtiqueta(ctx, x, y + halo + 4, s.label);
  });
}

/** Descarga el cielo como imagen PNG (con todas las etiquetas). */
export function descargarImagen(estrellas: Estrella[], ancho: number, alto: number) {
  const escala = 2;
  const lienzo = document.createElement("canvas");
  lienzo.width = ancho * escala;
  lienzo.height = alto * escala;
  const ctx = lienzo.getContext("2d");
  if (!ctx) return;
  ctx.scale(escala, escala);
  const t = performance.now();
  dibujarFondo(ctx, ancho, alto);
  dibujarPolvo(ctx, crearPolvo(ancho, alto), ancho, alto, 0, 0, t);
  dibujarConstelacion(ctx, estrellas, ancho, alto, 0, 0, t, () => true);

  ctx.font = "600 16px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,248,251,0.85)";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Constelación de nosotros", 20, alto - 20);

  const enlace = document.createElement("a");
  enlace.download = "constelacion-de-nosotros.png";
  enlace.href = lienzo.toDataURL("image/png");
  enlace.click();
}
