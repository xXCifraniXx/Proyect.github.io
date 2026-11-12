import type { CSSProperties } from "react";
import type { CartaBoveda } from "../lib/boveda.ts";
import { TEXTOS } from "../lib/contenido.ts";
import { formatoFechaLarga, tiempoEntre } from "../lib/fechas.ts";
import TarjetaBovedaAbierta from "./TarjetaBovedaAbierta.tsx";

interface TarjetaBovedaProps {
  item: CartaBoveda;
  ahora: Date;
  /** Orden en la grilla, para que aparezcan una tras otra. */
  indice: number;
  onAbrir: (item: CartaBoveda, texto: string) => void;
}

/** Una carta de La Bóveda: sellada con lo que falta, o abierta con un adelanto. */
export default function TarjetaBoveda({ item, ahora, indice, onAbrir }: TarjetaBovedaProps) {
  const estilo: CSSProperties = { animationDelay: `${indice * 60}ms` };

  if (item.fecha <= ahora) return <TarjetaBovedaAbierta item={item} estilo={estilo} onAbrir={onAbrir} />;

  const falta = tiempoEntre(ahora, item.fecha);
  const partes = [falta.years && `${falta.years} a`, falta.months && `${falta.months} m`, `${falta.days} d`].filter(Boolean);
  return (
    <article className="boveda-card glass-soft is-locked" style={estilo}>
      <span className="boveda-icon">🔒</span>
      <h3>{TEXTOS.bovedaLockedTitle || "Carta sellada"}</h3>
      <p className="boveda-lock-note">Se abre el {formatoFechaLarga(item.fecha)}</p>
      <span className="boveda-date">Faltan {partes.join(" ")}</span>
    </article>
  );
}
