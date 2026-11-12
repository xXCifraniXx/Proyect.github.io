/*
  CONTENIDO DEL SITIO
  -------------------
  Todo el texto, las fechas y las fotos salen de src/config/. Aquí se arman
  los textos vigentes (con los del cumpleaños, si toca) y los nombres.
*/
import { CONFIG } from "../config/index.ts";
import type { Textos } from "../types/config.ts";
import { textosConCumple } from "./cumple.ts";

export { CONFIG };

// Textos vigentes: el día del cumpleaños algunos se reemplazan (ver cumple.ts).
export const TEXTOS: Textos = textosConCumple(CONFIG.textos ?? {});

export const NOMBRES = {
  novia: CONFIG.nombres?.novia || "Anthuanete",
  autor: CONFIG.nombres?.autor || "Jorge"
};
