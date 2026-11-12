import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ahora } from "../../lib/cumple.ts";
import type { CartaAbierta } from "./boveda.ts";
import { ContextoVentanaCarta, puedeAbrirse, type VentanaCartaApi } from "./ventanaCarta.ts";
import VentanaCarta from "./VentanaCarta.tsx";

interface ProveedorVentanaCartaProps {
  children: ReactNode;
}

/**
 * Guarda qué carta está abierta y dibuja la ventana después del contenido
 * (en el mismo lugar de la página que antes). Ver ventanaCarta.ts.
 */
export default function ProveedorVentanaCarta({ children }: ProveedorVentanaCartaProps) {
  const [abierta, setAbierta] = useState<CartaAbierta | null>(null);

  // "ahora" con la vista previa del cumpleaños, igual que La Bóveda.
  const abrir = useCallback((carta: CartaAbierta) => {
    if (puedeAbrirse(carta, ahora())) setAbierta(carta);
  }, []);
  const cerrar = useCallback(() => setAbierta(null), []);
  const api = useMemo<VentanaCartaApi>(() => ({ abrir }), [abrir]);

  return (
    <ContextoVentanaCarta.Provider value={api}>
      {children}
      <VentanaCarta abierta={abierta} onCerrar={cerrar} />
    </ContextoVentanaCarta.Provider>
  );
}
