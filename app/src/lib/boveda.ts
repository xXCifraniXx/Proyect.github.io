import type { CartaConEdad } from "./cartas.ts";
import { CONFIG } from "./contenido.ts";
import { cartaDeCumple } from "./cumple.ts";

/** Carta de La Bóveda lista para mostrar, con su fecha ya convertida. */
export interface CartaBoveda {
  /** Para la key de React: "cumple" o la fecha. */
  id: string;
  carta: CartaConEdad;
  fecha: Date;
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
