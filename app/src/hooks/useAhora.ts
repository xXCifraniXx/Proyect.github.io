import { useEffect, useState } from "react";

// Definido fuera del hook para que sea siempre la misma función (si se
// creara en cada render, el intervalo se reiniciaría a cada rato).
const relojNormal = (): Date => new Date();

/**
 * La fecha y hora actual, actualizada cada "cadaMs" (por defecto, cada segundo).
 * "reloj" permite usar otro "ahora" (por ejemplo, el de la vista previa del
 * cumpleaños); debe ser una función fija, no una creada en cada render.
 */
export function useAhora(cadaMs = 1000, reloj: () => Date = relojNormal): Date {
  const [ahora, setAhora] = useState(reloj);
  useEffect(() => {
    const id = setInterval(() => setAhora(reloj()), cadaMs);
    return () => clearInterval(id);
  }, [cadaMs, reloj]);
  return ahora;
}
