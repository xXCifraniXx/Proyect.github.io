import { CONFIG } from "./contenido.ts";

/*
  FONDO NAVIDEÑO
  Todo diciembre (del 1 a las 00:00 hasta el 31 a medianoche, hora del
  celular), el fondo del sitio cambia: nieve que cae en lugar de corazones y
  luces en caramelo, verde pino y rojo arándano (Fondo.tsx y base.css). Se
  apaga con opciones.fondoNavidad = false (config/general.ts).
  Vista previa en cualquier fecha: ?fondo=navidad en el link.
*/

/** ?fondo=navidad en el link: el fondo navideño se ve aunque no sea diciembre. */
export const VISTA_PREVIA_NAVIDAD = new URLSearchParams(window.location.search).get("fondo") === "navidad";

/** Si el fondo es navideño en ese momento: en diciembre (o con la vista previa), salvo que esté apagado en config. */
export function esNavidad(ahora: Date, activo: boolean = CONFIG.opciones?.fondoNavidad !== false): boolean {
  if (!activo) return false;
  return VISTA_PREVIA_NAVIDAD || ahora.getMonth() === 11;
}
