import { startTransition, useEffect, useState } from "react";
import { rutaActual, suscribir } from "./historial.ts";

/**
 * La ruta de la página que se está viendo. Cambia como una transición: si
 * la página nueva todavía se está descargando, se sigue viendo la anterior
 * en vez de un hueco vacío.
 */
export function useRuta(): string {
  const [ruta, setRuta] = useState(rutaActual);

  useEffect(() => {
    const alCambiar = () => startTransition(() => setRuta(rutaActual()));
    const dejar = suscribir(alCambiar);
    // Por si cambió entre el primer dibujo y este momento.
    alCambiar();
    return dejar;
  }, []);

  return ruta;
}
