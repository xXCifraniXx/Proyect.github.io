import { CONFIG } from "../../config/index.ts";
import type { Carta } from "../../types/config.ts";
import { ahora } from "../../lib/cumple.ts";

/** Mensaje del mes con su fecha de inicio ya convertida. */
export interface NotaDelMes extends Carta {
  inicio: Date;
}

/*
  MENSAJE DEL MES: cuál toca mostrar
  De config.mensajesMes se toma el último cuya fecha ya llegó; se ve desde esa
  fecha hasta el mismo día del mes siguiente. El texto se descifra en el
  componente.
*/
export function mensajeMesVigente(lista: Carta[] = CONFIG.mensajesMes ?? []): NotaDelMes | null {
  const now = ahora();
  const nota = lista
    .filter((item) => !item.borrador && item.fecha && (item.mensaje || item.mensajeSellado))
    .map((item) => ({ ...item, inicio: new Date(item.fecha) }))
    .filter((item) => !Number.isNaN(item.inicio.getTime()) && item.inicio <= now)
    .sort((a, b) => b.inicio.getTime() - a.inicio.getTime())[0];
  if (!nota) return null;

  const fin = new Date(nota.inicio);
  fin.setMonth(fin.getMonth() + 1);
  return now < fin ? nota : null;
}
