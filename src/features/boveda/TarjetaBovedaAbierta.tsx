import type { CSSProperties } from "react";
import { useTextoCarta } from "../../hooks/useTextoCarta.ts";
import type { CartaBoveda } from "./boveda.ts";
import { formatoFechaLarga } from "../../lib/fechas.ts";

interface TarjetaBovedaAbiertaProps {
  item: CartaBoveda;
  estilo: CSSProperties;
  onAbrir: (item: CartaBoveda, texto: string) => void;
}

/*
  Carta de La Bóveda que ya se puede leer: muestra un adelanto y se abre al
  tocarla. Va en su propio componente para descifrar el texto solo cuando la
  carta ya está abierta (un hook no puede llamarse dentro de un "if").
*/
export default function TarjetaBovedaAbierta({ item, estilo, onAbrir }: TarjetaBovedaAbiertaProps) {
  const texto = useTextoCarta(item.carta) ?? "";
  const adelanto = texto.length > 90 ? `${texto.slice(0, 90)}…` : texto;

  return (
    <article
      className="boveda-card glass-soft is-unlocked"
      style={estilo}
      role="button"
      tabIndex={0}
      onClick={() => onAbrir(item, texto)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAbrir(item, texto);
        }
      }}
    >
      <span className="boveda-icon">{item.carta.icono || "💌"}</span>
      <h3>{item.carta.titulo || "Una carta para ti"}</h3>
      <p>{adelanto}</p>
      <span className="boveda-date">Desbloqueada el {formatoFechaLarga(item.fecha)}</span>
    </article>
  );
}
