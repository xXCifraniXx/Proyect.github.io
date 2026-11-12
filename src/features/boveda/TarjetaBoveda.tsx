import type { CSSProperties } from "react";
import type { CartaBoveda } from "./boveda.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { formatoFechaLarga, tiempoEntre } from "../../lib/fechas.ts";
import { rellenar } from "../../lib/rellenar.ts";
import TarjetaBovedaAbierta from "./TarjetaBovedaAbierta.tsx";

interface TarjetaBovedaProps {
  item: CartaBoveda;
  ahora: Date;
  /** Orden en la grilla, para que aparezcan una tras otra. */
  indice: number;
}

/** Una carta de La Bóveda: sellada con lo que falta, o abierta con un adelanto. */
export default function TarjetaBoveda({ item, ahora, indice }: TarjetaBovedaProps) {
  const estilo: CSSProperties = { animationDelay: `${indice * 60}ms` };

  if (item.fecha <= ahora) return <TarjetaBovedaAbierta item={item} estilo={estilo} />;

  const falta = tiempoEntre(ahora, item.fecha);
  const partes = [falta.years && `${falta.years} a`, falta.months && `${falta.months} m`, `${falta.days} d`].filter(
    Boolean
  );
  return (
    <article className="boveda-card glass-soft is-locked" style={estilo}>
      <span className="boveda-icon">🔒</span>
      <h3>{TEXTOS.bovedaLockedTitle}</h3>
      <p className="boveda-lock-note">{rellenar(TEXTOS.bovedaSeAbre, { fecha: formatoFechaLarga(item.fecha) })}</p>
      <span className="boveda-date">{rellenar(TEXTOS.bovedaFaltan, { tiempo: partes.join(" ") })}</span>
    </article>
  );
}
