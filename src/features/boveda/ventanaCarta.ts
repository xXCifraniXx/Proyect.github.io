import { createContext, useContext } from "react";
import type { CartaAbierta } from "./boveda.ts";

/*
  VENTANA DE CARTA COMPARTIDA
  Una sola ventana para toda la página (La Bóveda y el pastel de cumpleaños).
  Cualquier componente dentro de ProveedorVentanaCarta la abre con:
    const { abrir } = useVentanaCarta();
*/
export interface VentanaCartaApi {
  abrir: (carta: CartaAbierta) => void;
}

export const ContextoVentanaCarta = createContext<VentanaCartaApi | null>(null);

export function useVentanaCarta(): VentanaCartaApi {
  const api = useContext(ContextoVentanaCarta);
  if (!api) throw new Error("useVentanaCarta tiene que usarse dentro de ProveedorVentanaCarta");
  return api;
}

/** Una carta nunca se abre antes de su fecha, venga de donde venga (SPEC.md, criterio 4). */
export const puedeAbrirse = (carta: Pick<CartaAbierta, "fecha">, ahora: Date): boolean => carta.fecha <= ahora;
