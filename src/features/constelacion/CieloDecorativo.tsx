import { useEffect, useRef } from "react";

interface Punto {
  x: number;
  y: number;
  r: number;
  tw: number;
}

/*
  Cielo de adorno de la sección Constelación: estrellas que titilan y unas
  líneas entre las primeras. Con "reducir movimiento" se dibuja quieto.
*/
export default function CieloDecorativo() {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let puntos: Punto[] = [];
    let cuadro = 0;

    const sembrar = () => {
      const w = canvas.clientWidth || 600;
      const h = canvas.clientHeight || 240;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cantidad = Math.max(24, Math.round(w / 14));
      puntos = Array.from({ length: cantidad }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.4 + 0.4,
        tw: Math.random() * Math.PI * 2
      }));
    };

    const dibujar = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255,158,184,0.32)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      puntos.slice(0, 6).forEach((p, i) => {
        if (i) ctx.lineTo(p.x * w, p.y * h);
        else ctx.moveTo(p.x * w, p.y * h);
      });
      ctx.stroke();

      puntos.forEach((p) => {
        const brillo = quieto ? 0.7 : 0.5 + 0.5 * Math.sin(t * 0.002 + p.tw);
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r * (0.7 + brillo * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,248,251,${(0.3 + brillo * 0.5).toFixed(3)})`;
        ctx.fill();
      });

      if (!quieto) cuadro = requestAnimationFrame(dibujar);
    };

    const alCambiarTamano = () => {
      sembrar();
      if (quieto) dibujar(0);
    };

    sembrar();
    dibujar(0);
    window.addEventListener("resize", alCambiarTamano);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("resize", alCambiarTamano);
    };
  }, []);

  return <canvas ref={lienzo} id="constelacionTeaser" aria-hidden="true" />;
}
