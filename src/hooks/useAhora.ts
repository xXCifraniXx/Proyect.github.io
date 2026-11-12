import { useSyncExternalStore } from "react";
import { RELOJ, type Reloj } from "../lib/reloj.ts";

/**
 * La fecha y hora actual, una vez por segundo. Todas las secciones comparten
 * el mismo temporizador (ver lib/reloj.ts). Para lo del cumpleaños, pasa
 * RELOJ_CUMPLE (respeta la vista previa ?cumple=…).
 */
export function useAhora(reloj: Reloj = RELOJ): Date {
  return useSyncExternalStore(reloj.suscribir, reloj.actual);
}

/**
 * La fecha de hoy: solo cambia al pasar la medianoche. Para lo que depende
 * del día y no necesita redibujarse cada segundo.
 */
export function useDia(reloj: Reloj = RELOJ): Date {
  return useSyncExternalStore(reloj.suscribir, reloj.delDia);
}
