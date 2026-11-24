import type { CartaConEdad } from "../../lib/cartas.ts";
import { CONFIG } from "../../lib/contenido.ts";
import { cartaDeCumple } from "../../lib/cumple.ts";

/** Carta de La Bóveda lista para mostrar, con su fecha ya convertida. */
export interface CartaBoveda {
  /** Para la key de React: "cumple" o la fecha. */
  id: string;
  carta: CartaConEdad;
  fecha: Date;
}

/** El matasellos del sobre: "8 MAR" y "2026" (el mes, en tres letras). */
export function matasellos(fecha: Date): { diaMes: string; anio: string } {
  const mes = new Intl.DateTimeFormat("es", { month: "short" }).format(fecha).replace(".", "").slice(0, 3);
  return { diaMes: `${fecha.getDate()} ${mes.toUpperCase()}`, anio: String(fecha.getFullYear()) };
}

/**
 * Un recuerdo de La Bóveda: algo que ya pasó y se puede volver a ver en su
 * página (el cumpleaños en sus días de después, el adviento cuando terminó).
 * Lo arma App, que sabe en qué fecha estamos.
 */
export interface Recuerdo {
  id: string;
  icono: string;
  titulo: string;
  detalle: string;
  /** Ruta de su página (no está en el menú). */
  ruta: string;
}

/** Lo que necesita la ventana para mostrar una carta abierta. */
export interface CartaAbierta extends CartaBoveda {
  /** Texto ya descifrado (si se tiene); si no, la ventana lo descifra. */
  texto?: string;
  /** Sin el botón "ir a…" (p. ej. al abrirla desde el pastel). */
  sinAccion?: boolean;
}

/*
  Cartas de config.boveda más la de cumpleaños (que trae su propia fecha),
  ordenadas por fecha. Las marcadas como borrador no se muestran.
  Se arma una vez al cargar la página: así cada carta es siempre el mismo
  objeto y no se vuelve a descifrar en cada render.
*/
function armarCartas(): CartaBoveda[] {
  const delConfig = (CONFIG.boveda?.cartas ?? [])
    .filter((carta) => !carta.borrador && carta.fecha)
    .map((carta): CartaBoveda => ({ id: carta.fecha, carta, fecha: new Date(carta.fecha) }));
  const cumple = cartaDeCumple();
  const todas = cumple ? [...delConfig, { id: "cumple", carta: cumple, fecha: new Date(cumple.fecha) }] : delConfig;
  return todas.filter((c) => !Number.isNaN(c.fecha.getTime())).sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
}

export const CARTAS_BOVEDA = armarCartas();

/** La carta de cumpleaños de este año, si está en La Bóveda. */
export const CARTA_CUMPLE = CARTAS_BOVEDA.find((c) => c.id === "cumple") ?? null;
