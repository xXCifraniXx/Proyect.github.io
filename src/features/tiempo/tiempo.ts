import { TEXTOS } from "../../lib/contenido.ts";
import { rellenar } from "../../lib/rellenar.ts";

/** Años, meses y días completos juntos (lo que da tiempoEntre). */
export interface TiempoJuntos {
  years: number;
  months: number;
  days: number;
}

/**
 * "8 meses y 16 días", "1 año, 2 meses y 3 días", "1 día"… Lo que vale 0 no
 * se nombra, salvo los días cuando todo es 0 ("0 días", el mismo día).
 */
export function textoJuntos({ years, months, days }: TiempoJuntos): string {
  const parte = (n: number, uno: string, varios: string) => rellenar(n === 1 ? uno : varios, { n });
  const partes = [
    years > 0 && parte(years, TEXTOS.tiempoAnio, TEXTOS.tiempoAnios),
    months > 0 && parte(months, TEXTOS.tiempoMes, TEXTOS.tiempoMeses),
    (days > 0 || (years === 0 && months === 0)) && parte(days, TEXTOS.tiempoDia, TEXTOS.tiempoDias)
  ].filter((p): p is string => typeof p === "string");
  if (partes.length === 1) return partes[0];
  return `${partes.slice(0, -1).join(", ")}${TEXTOS.tiempoY}${partes[partes.length - 1]}`;
}
