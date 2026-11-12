import { useEffect, useRef, type PointerEvent, type RefObject } from "react";
import { crearPolvo, dibujarConstelacion, dibujarFondo, dibujarPolvo, type Polvo } from "../../lib/cielo/dibujo.ts";
import type { Estrella } from "../../lib/cielo/estrellas.ts";

const RADIO_TOQUE = 26; // px de tolerancia para tocar una estrella existente
const MOVIMIENTO_MAX = 10; // px: si el dedo se mueve más que esto, no es un toque

interface LienzoCieloProps {
  estrellas: Estrella[];
  /** Hasta cuándo (Date.now) se ve la etiqueta de la última estrella creada. */
  etiquetaHasta: number;
  /** Estrella con la burbuja abierta (la burbuja la sigue al moverse el cielo). */
  activaId: string | null;
  burbuja: RefObject<HTMLDivElement | null>;
  /** true mientras se escribe un recuerdo: los toques no hacen nada. */
  pausado: boolean;
  onTocarVacio: (pos: { x: number; y: number }) => void;
  onTocarEstrella: (estrella: Estrella) => void;
}

/*
  LIENZO DEL CIELO
  Dibuja el cielo en un bucle de animación (requestAnimationFrame) con un
  leve movimiento según el mouse o la inclinación del celular. El dibujo vive
  fuera de React: el bucle lee los datos más recientes desde refs, así no se
  reinicia cada vez que cambia una estrella.
*/
export default function LienzoCielo({
  estrellas,
  etiquetaHasta,
  activaId,
  burbuja,
  pausado,
  onTocarVacio,
  onTocarEstrella
}: LienzoCieloProps) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  // Datos que lee el bucle de dibujo.
  const datos = useRef({ estrellas, etiquetaHasta, activaId });
  useEffect(() => {
    datos.current = { estrellas, etiquetaHasta, activaId };
  }, [estrellas, etiquetaHasta, activaId]);

  // Tamaño, polvo y desplazamiento (parallax), también fuera de React.
  const vista = useRef({
    w: 0,
    h: 0,
    px: 0,
    py: 0,
    objetivoX: 0,
    objetivoY: 0,
    polvo: [] as Polvo[],
    encima: null as string | null
  });

  useEffect(() => {
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;
    const v = vista.current;

    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      v.w = window.innerWidth;
      v.h = window.innerHeight;
      canvas.width = Math.round(v.w * dpr);
      canvas.height = Math.round(v.h * dpr);
      canvas.style.width = `${v.w}px`;
      canvas.style.height = `${v.h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      v.polvo = crearPolvo(v.w, v.h);
    };

    const alInclinar = (e: DeviceOrientationEvent) => {
      if (e.gamma == null) return;
      v.objetivoX = Math.max(-30, Math.min(30, e.gamma)) * -1;
      v.objetivoY = Math.max(-30, Math.min(30, (e.beta ?? 0) - 45)) * -0.5;
    };

    let cuadro = 0;
    const dibujar = (t: number) => {
      v.px += (v.objetivoX - v.px) * 0.06;
      v.py += (v.objetivoY - v.py) * 0.06;
      const { estrellas: lista, etiquetaHasta: hasta, activaId: activa } = datos.current;
      const ultima = lista.length - 1;
      const verUltima = Date.now() < hasta;

      ctx.clearRect(0, 0, v.w, v.h);
      dibujarFondo(ctx, v.w, v.h);
      dibujarPolvo(ctx, v.polvo, v.w, v.h, v.px, v.py, t);
      dibujarConstelacion(
        ctx,
        lista,
        v.w,
        v.h,
        v.px,
        v.py,
        t,
        (s, i) => (verUltima && i === ultima) || s.id === v.encima
      );

      // La burbuja sigue a su estrella mientras el cielo se mueve.
      const estrella = activa ? lista.find((s) => s.id === activa) : undefined;
      if (estrella && burbuja.current) {
        burbuja.current.style.left = `${estrella.x * v.w + v.px}px`;
        burbuja.current.style.top = `${estrella.y * v.h + v.py}px`;
      }
      cuadro = requestAnimationFrame(dibujar);
    };

    ajustar();
    window.addEventListener("resize", ajustar);
    window.addEventListener("deviceorientation", alInclinar);
    cuadro = requestAnimationFrame(dibujar);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("resize", ajustar);
      window.removeEventListener("deviceorientation", alInclinar);
    };
  }, [burbuja]);

  const estrellaEn = (x: number, y: number): Estrella | null => {
    const v = vista.current;
    const lista = datos.current.estrellas;
    for (let i = lista.length - 1; i >= 0; i -= 1) {
      const s = lista[i];
      if (Math.hypot(s.x * v.w + v.px - x, s.y * v.h + v.py - y) <= RADIO_TOQUE) return s;
    }
    return null;
  };

  const toque = useRef<{ x: number; y: number; movido: boolean } | null>(null);

  const alBajar = (e: PointerEvent<HTMLCanvasElement>) => {
    toque.current = { x: e.clientX, y: e.clientY, movido: false };
  };

  const alMover = (e: PointerEvent<HTMLCanvasElement>) => {
    const v = vista.current;
    v.objetivoX = (e.clientX / v.w - 0.5) * -30;
    v.objetivoY = (e.clientY / v.h - 0.5) * -30;
    const t = toque.current;
    if (t && Math.hypot(e.clientX - t.x, e.clientY - t.y) > MOVIMIENTO_MAX) t.movido = true;
    // En escritorio, la etiqueta aparece al pasar el mouse.
    const encima = estrellaEn(e.clientX, e.clientY);
    v.encima = encima?.id ?? null;
    e.currentTarget.style.cursor = encima ? "pointer" : "crosshair";
  };

  const alSoltar = (e: PointerEvent<HTMLCanvasElement>) => {
    const t = toque.current;
    toque.current = null;
    if (!t || t.movido || pausado) return;
    const tocada = estrellaEn(e.clientX, e.clientY);
    if (tocada) {
      onTocarEstrella(tocada);
      return;
    }
    const v = vista.current;
    onTocarVacio({ x: (e.clientX - v.px) / v.w, y: (e.clientY - v.py) / v.h });
  };

  return (
    <canvas
      ref={lienzo}
      id="sky"
      aria-label="Lienzo de la constelación"
      onPointerDown={alBajar}
      onPointerMove={alMover}
      onPointerUp={alSoltar}
      onPointerCancel={() => {
        toque.current = null;
      }}
    />
  );
}
