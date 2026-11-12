import { clsx } from "clsx";
import type { Ref } from "react";
import { TEXTOS } from "../../lib/contenido.ts";
import { nombreMes } from "../../lib/fechas.ts";
import type { FotoDelMes } from "../../types/config.ts";

interface TarjetaMesProps {
  /** Mes "AAAA-MM". */
  clave: string;
  /** La foto de ese mes en config.lineaTiempo, si hay. */
  foto?: FotoDelMes;
  /** Las fotos se inclinan una a cada lado. */
  inclinacion: "tilt-left" | "tilt-right";
  activa: boolean;
  onElegir: () => void;
  // En React 19 "ref" se pasa como una prop más; Galeria la usa para medir.
  ref?: Ref<HTMLElement>;
}

/** Una foto impresa de la galería (o el hueco de un mes sin foto). */
export default function TarjetaMes({ clave, foto, inclinacion, activa, onElegir, ref }: TarjetaMesProps) {
  const clases = clsx("timeline-card", inclinacion, !foto?.src && "is-empty", activa && "is-active");

  return (
    <figure ref={ref} className={clases} onClick={activa ? undefined : onElegir}>
      <div className="timeline-photo">
        {foto?.src ? (
          <img src={foto.src} alt={foto.titulo || nombreMes(clave)} loading="lazy" decoding="async" />
        ) : (
          <>
            <span className="timeline-empty-icon" aria-hidden="true">
              🖼️
            </span>
            <p>{TEXTOS.timelineEmpty || "La foto de este mes está por llegar 💜"}</p>
          </>
        )}
      </div>
      <figcaption className="timeline-body">
        <span className="timeline-month">{nombreMes(clave)}</span>
        {foto?.src && foto.texto && <p>{foto.texto}</p>}
      </figcaption>
    </figure>
  );
}
