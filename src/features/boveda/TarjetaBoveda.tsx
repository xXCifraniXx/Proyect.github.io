import type { CSSProperties } from "react";
import type { CartaBoveda } from "./boveda.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { diaMesYAnio, tiempoEntre } from "../../lib/fechas.ts";
import { rellenar } from "../../lib/rellenar.ts";
import TarjetaBovedaAbierta from "./TarjetaBovedaAbierta.tsx";

interface TarjetaBovedaProps {
  item: CartaBoveda;
  ahora: Date;
  /** Orden en la grilla, para que aparezcan una tras otra. */
  indice: number;
}

/**
 * Una carta de La Bóveda: un sobre atado con un cordel y sellado con un
 * candado, con lo que falta, o el sobre de una carta que ya se puede abrir.
 */
export default function TarjetaBoveda({ item, ahora, indice }: TarjetaBovedaProps) {
  const estilo: CSSProperties = { animationDelay: `${indice * 60}ms` };
  if (item.fecha <= ahora) return <TarjetaBovedaAbierta item={item} estilo={estilo} />;

  const falta = tiempoEntre(ahora, item.fecha);
  const partes = [falta.years && `${falta.years} a`, falta.months && `${falta.months} m`, `${falta.days} d`].filter(
    Boolean
  );
  return (
    <article className="boveda-card boveda-sobre is-locked" style={estilo}>
      <span className="boveda-sobre-solapa" aria-hidden="true" />
      <span className="boveda-sobre-cordel" aria-hidden="true" />
      <span className="boveda-sobre-sello" aria-hidden="true">
        🔒
      </span>
      <div className="boveda-sobre-texto">
        <h3>{TEXTOS.bovedaLockedTitle}</h3>
        <p className="boveda-sobre-detalle">
          {rellenar(TEXTOS.bovedaSobreSellado, { fecha: diaMesYAnio(item.fecha), tiempo: partes.join(" ") })}
        </p>
      </div>
    </article>
  );
}
