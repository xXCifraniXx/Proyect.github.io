import { puertas as PUERTAS_CONFIG } from "../../config/puertas.ts";
import { fechaDePuerta } from "../../lib/adviento.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { claveDia } from "../../lib/fechas.ts";
import { rellenar } from "../../lib/rellenar.ts";
import type { PuertaAdviento } from "../../types/config.ts";
import { puedeAbrirse, type CartaBoveda } from "../boveda/index.ts";

/** Cuántas puertas tiene el calendario: del 1 al 24 de diciembre. */
export const TOTAL_PUERTAS = 24;

/** Una puerta lista para mostrar: su día y la carta que se abre (con su fecha ya calculada). */
export interface Puerta {
  dia: number;
  item: CartaBoveda;
}

/**
 * cerrada     todavía no es su día (su texto no se descifra);
 * pronto      ya es su día, pero sigue en borrador (no se abre);
 * disponible  se puede abrir y todavía no se abrió en este celular;
 * abierta     ya se abrió en este celular: se puede volver a leer.
 */
export type EstadoPuerta = "cerrada" | "pronto" | "disponible" | "abierta";

/**
 * Las 24 puertas, del 1 al 24, con lo que diga config/puertas.ts. Un día que
 * falta (o repetido) queda como borrador: el calendario siempre tiene sus 24.
 */
export function armarPuertas(anio: number, lista: readonly PuertaAdviento[] = PUERTAS_CONFIG): Puerta[] {
  return Array.from({ length: TOTAL_PUERTAS }, (_, i) => {
    const dia = i + 1;
    const delConfig = lista.filter((puerta) => puerta.dia === dia);
    const puerta: PuertaAdviento = delConfig.length === 1 ? delConfig[0] : { dia, borrador: true };
    const fecha = fechaDePuerta(anio, dia);
    return {
      dia,
      item: {
        id: `adviento-${dia}`,
        fecha,
        carta: {
          ...puerta,
          titulo: puerta.titulo || rellenar(TEXTOS.advientoPuertaTitulo, { dia }),
          fecha: `${claveDia(fecha)}T00:00:00`
        }
      }
    };
  });
}

/** Cómo se ve una puerta. Nunca se abre antes de su día, diga lo que diga el celular. */
export function estadoPuerta(puerta: Puerta, ahora: Date, abiertas: ReadonlySet<number>): EstadoPuerta {
  if (!puedeAbrirse(puerta.item, ahora)) return "cerrada";
  if (puerta.item.carta.borrador) return "pronto";
  return abiertas.has(puerta.dia) ? "abierta" : "disponible";
}

/** La puerta que se abre hoy, o null fuera del 1 al 24 de diciembre de ese año. */
export function puertaDeHoy(anio: number, ahora: Date): number | null {
  const esDiciembre = ahora.getFullYear() === anio && ahora.getMonth() === 11;
  return esDiciembre && ahora.getDate() <= TOTAL_PUERTAS ? ahora.getDate() : null;
}

// Las puertas que ya se abrieron, por año, en este celular.
const claveAbiertas = (anio: number) => `adviento-abiertas-${anio}`;

/** Las puertas que ya se abrieron en este celular (si no se puede leer, ninguna). */
export function leerAbiertas(anio: number): Set<number> {
  try {
    const guardado: unknown = JSON.parse(localStorage.getItem(claveAbiertas(anio)) ?? "[]");
    return new Set(Array.isArray(guardado) ? guardado.filter((dia): dia is number => Number.isInteger(dia)) : []);
  } catch {
    return new Set();
  }
}

/** Guarda que se abrió una puerta. Si el navegador no deja guardar, solo se pierde ese recuerdo. */
export function guardarAbiertas(anio: number, abiertas: ReadonlySet<number>): void {
  try {
    localStorage.setItem(claveAbiertas(anio), JSON.stringify([...abiertas].sort((a, b) => a - b)));
  } catch {
    // Modo privado o sin espacio: la puerta se abre igual.
  }
}
