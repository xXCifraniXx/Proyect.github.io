import type { Adviento } from "../types/config.ts";
import { CONFIG } from "./contenido.ts";

/*
  CALENDARIO DE ADVIENTO: lo que se sabe sin abrir su página (cuándo existe
  y qué día se abre cada puerta). Las puertas y su pantalla están en
  features/adviento, que se descarga aparte.
*/

/** Si la página del calendario existe en ese momento (entre "desde" y "hasta" de config/adviento.ts). */
export function advientoVisible(ahora: Date, config: Adviento | null = CONFIG.adviento ?? null): boolean {
  if (!config) return false;
  // Con una fecha mal escrita, las comparaciones dan false y la página no se ve.
  return ahora >= new Date(config.desde) && ahora < new Date(config.hasta);
}

/** Cuándo se abre la puerta de un día: a las 00:00 de ese día de diciembre, hora del celular. */
export const fechaDePuerta = (anio: number, dia: number): Date => new Date(anio, 11, dia);
