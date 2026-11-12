/*
  CUMPLEAÑOS: cálculos
  --------------------
  Todo sale de config.cumpleanos. Desde la fecha de nacimiento se calcula el
  cumpleaños de cada año y la edad ({edad} en cualquier texto). Cada año hay
  tres momentos y el resto del tiempo no hay nada:

    antes    desde "diasAntes" días antes: regalo sellado y cuenta regresiva
    hoy      el día del cumpleaños: modo cumpleaños
    despues  durante "diasDespues" días: queda de recuerdo

  Vista previa sin cambiar el reloj: ?cumple=antes | hoy | despues
  Este archivo solo calcula; la sección con el pastel es un componente aparte.
*/
import { CONFIG } from "../config/index.ts";
import type { Carta, Cumpleanos, Textos } from "../types/config.ts";
import { crearReloj } from "./reloj.ts";

export type EstadoCumple = "antes" | "hoy" | "despues" | "off";

export interface Ocurrencia {
  date: Date;
  edad: number;
  estado: Exclude<EstadoCumple, "off">;
}

/** Carta de cumpleaños ya armada para La Bóveda. */
export interface CartaCumple extends Carta {
  id: "cumple";
  edad: number;
}

const HOUR = 3600000;
const DAY = 24 * HOUR;

const pad2 = (value: number) => String(value).padStart(2, "0");
export const dayKey = (date: Date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const config = (): Cumpleanos | null => CONFIG.cumpleanos ?? null;

function birth(): { year: number; month: number; day: number } | null {
  const cfg = config();
  if (!cfg || cfg.activo === false) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(cfg.nacimiento ?? ""));
  return match ? { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) } : null;
}

// Cumpleaños relevante en el instante "current": el de este momento (hoy o
// recuerdo) o el próximo si ya está cerca.
function occurrenceAt(current: Date): Ocurrencia | null {
  const b = birth();
  const cfg = config();
  if (!b || !cfg) return null;
  const daysBefore = Number(cfg.diasAntes ?? 45);
  const daysAfter = Number(cfg.diasDespues ?? 60);

  const year = current.getFullYear();
  const all = [year - 1, year, year + 1].map((y) => ({ year: y, date: new Date(y, b.month, b.day) }));
  const past = all.filter((o) => o.date <= current).pop();
  const next = all.find((o) => o.date > current);
  const make = (o: { year: number; date: Date }, estado: Ocurrencia["estado"]): Ocurrencia => ({
    date: o.date,
    edad: o.year - b.year,
    estado
  });

  if (past) {
    const endOfDay = new Date(past.date.getFullYear(), past.date.getMonth(), past.date.getDate() + 1);
    if (current < endOfDay) return make(past, "hoy");
    if (current.getTime() < endOfDay.getTime() + daysAfter * DAY) return make(past, "despues");
  }
  if (next && next.date.getTime() - current.getTime() <= daysBefore * DAY) return make(next, "antes");
  return null;
}

// Vista previa: desplaza el "reloj" solo para lo relacionado con el cumpleaños.
export const PREVIEW = new URLSearchParams(window.location.search).get("cumple");

const clockOffset = ((): number => {
  const b = birth();
  const cfg = config();
  if (!b || !cfg || !PREVIEW) return 0;
  const reference = new Date(new Date().getFullYear(), b.month, b.day).getTime();
  const at: Record<string, number> = {
    antes: reference - Math.min(5, Number(cfg.diasAntes ?? 45)) * DAY,
    hoy: reference + 9 * HOUR,
    despues: reference + Math.min(3, Number(cfg.diasDespues ?? 60)) * DAY
  };
  return PREVIEW in at ? at[PREVIEW] - Date.now() : 0;
})();

/** "Ahora" para todo lo que depende de fechas (con la vista previa aplicada). */
export const ahora = (): Date => new Date(Date.now() + clockOffset);
/** Reloj compartido con la vista previa aplicada (para useAhora / useDia). */
export const RELOJ_CUMPLE = crearReloj(ahora);
/** El cumpleaños que corresponde en un momento dado (antes, hoy o después). */
export const ocurrenciaEn = (momento: Date): Ocurrencia | null => occurrenceAt(momento);
export const ocurrencia = (): Ocurrencia | null => occurrenceAt(ahora());
export const estadoCumple = (): EstadoCumple => ocurrencia()?.estado ?? "off";

// {edad} en cualquier texto se reemplaza por la edad que cumple.
const fill = (text: string, occ: Ocurrencia) => String(text).split("{edad}").join(String(occ.edad));

/** El día del cumpleaños, config.cumpleanos.textosHoy reemplaza a config.textos. */
export function textosConCumple(base: Textos): Textos {
  const occ = ocurrencia();
  if (!occ) return base;
  const merged = occ.estado === "hoy" ? { ...base, ...(config()?.textosHoy ?? {}) } : base;
  return Object.fromEntries(Object.entries(merged).map(([key, value]) => [key, fill(value, occ)]));
}

/** Carta que se suma a La Bóveda, con la fecha del cumpleaños de este año. */
export function cartaDeCumple(): CartaCumple | null {
  const occ = ocurrencia();
  const cfg = config();
  if (!occ || !cfg?.carta) return null;
  return {
    ...cfg.carta,
    titulo: fill(cfg.carta.titulo ?? "", occ),
    mensaje: fill(cfg.carta.mensaje ?? "", occ),
    id: "cumple",
    edad: occ.edad,
    fecha: occ.date.toISOString(),
    accion: { destino: "cumple", etiqueta: CONFIG.textos?.cumpleIrVelas || "Ir a soplar mis velas 🎂" }
  };
}
