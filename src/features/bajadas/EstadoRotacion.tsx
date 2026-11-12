import { TEXTOS } from "../../lib/contenido.ts";
import type { Fase } from "./rotacion.ts";
import { CuentaRegresiva } from "../../components/ui/index.ts";

interface EstadoRotacionProps {
  fase: Fase;
  ahora: Date;
}

/** Panel "Estado actual": si está en mina o de descanso, y cuánto falta. */
export default function EstadoRotacion({ fase, ahora }: EstadoRotacionProps) {
  return (
    <div className="roster-panel glass-soft">
      <article className="roster-status">
        <span className="eyebrow small">{TEXTOS.rosterEyebrow}</span>
        <h3>{fase.titulo}</h3>
        <p>{fase.texto}</p>
      </article>
      <div className="roster-countdown">
        <span>{fase.etiqueta}</span>
        <CuentaRegresiva objetivo={fase.objetivo} ahora={ahora} className="roster-countdown-grid" />
      </div>
    </div>
  );
}
