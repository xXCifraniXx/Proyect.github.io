import type { CSSProperties } from "react";
import { EnlacePagina } from "../navegacion/index.ts";
import type { Recuerdo } from "./boveda.ts";

interface TarjetaRecuerdoProps {
  recuerdo: Recuerdo;
  estilo: CSSProperties;
}

/**
 * Un recuerdo de La Bóveda (el cumpleaños, el adviento que ya pasó): un
 * sobre más bajo, en otro tono, que lleva a su página.
 */
export default function TarjetaRecuerdo({ recuerdo, estilo }: TarjetaRecuerdoProps) {
  return (
    <EnlacePagina className="boveda-card boveda-sobre boveda-recuerdo" ruta={recuerdo.ruta} style={estilo}>
      <span className="boveda-sobre-solapa" aria-hidden="true" />
      <span className="boveda-sobre-sello" aria-hidden="true">
        {recuerdo.icono}
      </span>
      <span className="boveda-sobre-texto">
        <span className="boveda-recuerdo-titulo">{recuerdo.titulo}</span>
        <span className="boveda-sobre-detalle">{recuerdo.detalle}</span>
      </span>
      <span className="boveda-recuerdo-flecha" aria-hidden="true">
        →
      </span>
    </EnlacePagina>
  );
}
