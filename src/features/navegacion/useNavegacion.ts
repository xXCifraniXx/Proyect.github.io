import { useEffect, useState } from "react";
import { ordenDePagina } from "./enlaces.ts";

// Una franja fina a un tercio de la pantalla: la sección que la cruza es la
// que se está viendo. Entre dos secciones (donde no cruza ninguna) se queda
// la anterior.
const FRANJA = "-35% 0px -64% 0px";

export interface Navegacion {
  /** true cuando la portada ya quedó arriba: ahí aparece la barra. */
  visible: boolean;
  /** Ids de las secciones que existen, en el orden de la página. */
  presentes: string[];
  /** Id de la sección que se está viendo, o null antes de llegar a la primera. */
  actual: string | null;
}

/**
 * Sigue por dónde va la página sin escuchar cada movimiento del scroll:
 * dos IntersectionObserver, uno para la portada y otro para las secciones.
 *
 * "ids" tiene que ser estable (useMemo): si cambia, se vuelven a buscar las
 * secciones (por ejemplo, cuando aparece el mensaje del mes a medianoche).
 */
export function useNavegacion(ids: readonly string[]): Navegacion {
  const [visible, setVisible] = useState(false);
  const [presentes, setPresentes] = useState<string[]>([]);
  const [actual, setActual] = useState<string | null>(null);

  useEffect(() => {
    const portada = document.getElementById("inicio");
    if (!portada) return undefined;
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada) setVisible(!entrada.isIntersecting && entrada.boundingClientRect.top < 0);
    });
    observador.observe(portada);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    // El orden sale de la página ya dibujada (el día del cumpleaños su
    // sección sube), así que se busca acá y no al dibujar.
    const orden = ordenDePagina(ids);
    const observador = new IntersectionObserver(
      (entradas) => {
        // El observador avisa apenas empieza: ahí se guarda el orden. Es el
        // mismo arreglo cada vez, así que React no vuelve a dibujar por eso.
        setPresentes(orden);
        const cruza = entradas.find((entrada) => entrada.isIntersecting);
        if (cruza) setActual(cruza.target.id);
      },
      { rootMargin: FRANJA }
    );
    for (const id of orden) {
      const seccion = document.getElementById(id);
      if (seccion) observador.observe(seccion);
    }
    return () => observador.disconnect();
  }, [ids]);

  return { visible, presentes, actual };
}
