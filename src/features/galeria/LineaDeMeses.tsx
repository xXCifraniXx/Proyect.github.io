import type { CSSProperties } from "react";
import { nombreMes, nombreMesCorto } from "../../lib/fechas.ts";
import { TEXTOS } from "../../lib/contenido.ts";

interface LineaDeMesesProps {
  meses: string[];
  activo: number;
  onElegir: (indice: number) => void;
}

/*
  Línea con un punto por mes debajo de la galería: se llena de rosa hasta el
  mes que se está viendo y tocar un punto lleva a ese mes.
*/
export default function LineaDeMeses({ meses, activo, onElegir }: LineaDeMesesProps) {
  const progreso = meses.length > 1 ? activo / (meses.length - 1) : 1;
  // "--progress" es una variable del CSS; se le dice a TypeScript que es válida.
  const estilo = { "--progress": progreso } as CSSProperties;

  return (
    <ol className="timeline-rail" aria-label={TEXTOS.ariaElegirMes} style={estilo}>
      {meses.map((clave, i) => (
        <li key={clave}>
          <button
            type="button"
            className={i < activo ? "is-past" : undefined}
            aria-label={nombreMes(clave)}
            aria-current={i === activo ? "true" : undefined}
            onClick={() => onElegir(i)}
          >
            <span>{nombreMesCorto(clave)}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
