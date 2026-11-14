import { useLayoutEffect, useRef } from "react";

/**
 * Barra fina arriba que se llena a medida que se baja por la página.
 * El ancho se cambia directo en el elemento, una vez por cuadro: así React
 * no vuelve a dibujar nada con cada movimiento del scroll.
 */
export default function ProgresoScroll() {
  const barra = useRef<HTMLDivElement>(null);

  // useLayoutEffect: el primer ancho se pone antes de pintar.
  useLayoutEffect(() => {
    let cuadro = 0;
    const medir = () => {
      const el = barra.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    };
    const alMover = () => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
    };
  }, []);

  return <div ref={barra} className="scroll-progress" aria-hidden="true" />;
}
