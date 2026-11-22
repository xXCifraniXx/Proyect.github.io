import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

/**
 * Lo que pasa al cambiar de página: el título de la pestaña cambia, la
 * página nueva empieza arriba y el foco va a su contenido (así un lector de
 * pantalla lee la página nueva y el teclado sigue desde ahí). Al abrir el
 * sitio no se mueve nada.
 */
export function useCambioDePagina(ruta: string, titulo: string, contenido: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    document.title = titulo;
  }, [titulo]);

  // Con la ruta anterior y no con "es la primera vez": en desarrollo, React
  // corre los efectos dos veces al abrir y eso no es un cambio de página.
  const anterior = useRef(ruta);
  // useLayoutEffect: sube antes de pintar, sin que se vea el salto.
  useLayoutEffect(() => {
    if (anterior.current === ruta) return;
    anterior.current = ruta;
    // "instant": la página tiene scroll suave (base.css) y acá no corresponde.
    window.scrollTo({ top: 0, behavior: "instant" });
    contenido.current?.focus({ preventScroll: true });
  }, [ruta, contenido]);
}
