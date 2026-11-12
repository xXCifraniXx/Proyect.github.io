import { TEXTOS } from "../lib/contenido.ts";
import { partirCuenta } from "../lib/fechas.ts";

interface CuentaRegresivaProps {
  objetivo: Date;
  ahora: Date;
  /** Clase de la grilla según dónde se use ("return-grid", "roster-countdown-grid"…). */
  className: string;
}

/** Días, horas, minutos y segundos que faltan para "objetivo". */
export default function CuentaRegresiva({ objetivo, ahora, className }: CuentaRegresivaProps) {
  const partes = partirCuenta(objetivo, ahora);
  return (
    <div className={className}>
      <div>
        <strong>{partes.days}</strong>
        <span>{TEXTOS.labelCountdownDays}</span>
      </div>
      <div>
        <strong>{partes.hours}</strong>
        <span>{TEXTOS.labelCountdownHours}</span>
      </div>
      <div>
        <strong>{partes.minutes}</strong>
        <span>{TEXTOS.labelCountdownMinutes}</span>
      </div>
      <div>
        <strong>{partes.seconds}</strong>
        <span>{TEXTOS.labelCountdownSeconds}</span>
      </div>
    </div>
  );
}
