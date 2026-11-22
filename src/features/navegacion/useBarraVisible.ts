import { useEffect, useState } from "react";

/**
 * Si se ve la barra de secciones. En las páginas, siempre. En la portada,
 * solo cuando su menú ya quedó arriba: así nunca hay dos menús a la vez, y
 * abajo de la portada (el cierre) la barra está a mano.
 * Se sigue con un IntersectionObserver, sin escuchar cada movimiento del scroll.
 */
export function useBarraVisible(enInicio: boolean): boolean {
  const [menuArriba, setMenuArriba] = useState(false);

  useEffect(() => {
    if (!enInicio) return undefined;
    const menu = document.querySelector("#inicio .topbar");
    if (!menu) return undefined;
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada) setMenuArriba(!entrada.isIntersecting && entrada.boundingClientRect.top < 0);
    });
    observador.observe(menu);
    return () => observador.disconnect();
  }, [enInicio]);

  return !enInicio || menuArriba;
}
