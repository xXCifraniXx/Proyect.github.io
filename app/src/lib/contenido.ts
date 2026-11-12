/*
  CONTENIDO DEL SITIO
  -------------------
  Todo el texto, las fechas y las fotos siguen saliendo de assets/js/config.js
  (el mismo archivo que usa el sitio actual). Ese archivo guarda su contenido
  en window.APP_CONFIG; aquí se importa una vez y se reparte a los componentes.
*/
import "../../../assets/js/config.js";
import type { Config, Textos } from "../types/config.ts";
import { textosConCumple } from "./cumple.ts";

export const CONFIG: Config = window.APP_CONFIG ?? {};

// Textos vigentes: el día del cumpleaños algunos se reemplazan (ver cumple.ts).
export const TEXTOS: Textos = textosConCumple(CONFIG.textos ?? {});

export const NOMBRES = {
  novia: CONFIG.nombres?.novia || "Anthuanete",
  autor: CONFIG.nombres?.autor || "Jorge"
};
