import type { Adviento } from "../types/config.ts";
import { CONFIG } from "./contenido.ts";

/*
  CALENDARIO DE ADVIENTO: lo que se sabe sin abrir su página (cuándo existe
  y qué día se abre cada puerta). Las puertas y su pantalla están en
  features/adviento, que se descarga aparte.
*/

/** Si el calendario está en su época (entre "desde" y "hasta" de config/adviento.ts): entonces va en el menú. */
export function advientoVisible(ahora: Date, config: Adviento | null = CONFIG.adviento ?? null): boolean {
  if (!config) return false;
  // Con una fecha mal escrita, las comparaciones dan false y la página no se ve.
  return ahora >= new Date(config.desde) && ahora < new Date(config.hasta);
}

/**
 * La época del calendario: "vigente" (entre "desde" y "hasta", en el menú),
 * "pasado" (desde "hasta": queda de recuerdo en La Bóveda) o null (todavía no
 * empieza, o no hay calendario).
 */
export function estadoAdviento(
  ahora: Date,
  config: Adviento | null = CONFIG.adviento ?? null
): "vigente" | "pasado" | null {
  if (!config) return null;
  if (advientoVisible(ahora, config)) return "vigente";
  return ahora >= new Date(config.hasta) ? "pasado" : null;
}

/** Cuándo se abre la puerta de un día: a las 00:00 de ese día de diciembre, hora del celular. */
export const fechaDePuerta = (anio: number, dia: number): Date => new Date(anio, 11, dia);
