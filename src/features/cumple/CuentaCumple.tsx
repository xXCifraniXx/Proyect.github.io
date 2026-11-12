import { useEffect } from "react";
import { useAhora } from "../../hooks/useAhora.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { ahora as ahoraCumple } from "../../lib/cumple.ts";
import { CuentaRegresiva } from "../../components/ui/index.ts";

interface CuentaCumpleProps {
  /** Día del cumpleaños (00:00). */
  objetivo: Date;
}

/** Antes del cumpleaños: el regalo sellado con la cuenta regresiva. */
export default function CuentaCumple({ objetivo }: CuentaCumpleProps) {
  const ahora = useAhora(1000, ahoraCumple);

  // Al llegar el día se recarga la página para que entre en modo cumpleaños.
  useEffect(() => {
    if (ahora >= objetivo) window.location.reload();
  }, [ahora, objetivo]);

  return (
    <div className="cumple-locked">
      <span className="cumple-gift" aria-hidden="true">
        🎁
      </span>
      <span className="cumple-locked-label">{TEXTOS.cumpleAntesLabel}</span>
      <CuentaRegresiva objetivo={objetivo} ahora={ahora} className="return-grid" />
    </div>
  );
}
