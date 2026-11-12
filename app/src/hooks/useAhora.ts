import { useEffect, useState } from "react";

/** La fecha y hora actual, actualizada cada "cadaMs" (por defecto, cada segundo). */
export function useAhora(cadaMs = 1000): Date {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), cadaMs);
    return () => clearInterval(id);
  }, [cadaMs]);
  return ahora;
}
