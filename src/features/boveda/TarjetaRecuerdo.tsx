import type { CSSProperties } from "react";
import { EnlacePagina } from "../navegacion/index.ts";
import type { Recuerdo } from "./boveda.ts";

interface TarjetaRecuerdoProps {
  recuerdo: Recuerdo;
  estilo: CSSProperties;
}

/** Un recuerdo de La Bóveda (el cumpleaños, el adviento que ya pasó): un link a su página. */
export default function TarjetaRecuerdo({ recuerdo, estilo }: TarjetaRecuerdoProps) {
  return (
    <EnlacePagina className="boveda-card boveda-recuerdo glass-soft" ruta={recuerdo.ruta} style={estilo}>
      <span className="boveda-icon" aria-hidden="true">
        {recuerdo.icono}
      </span>
      <span className="boveda-recuerdo-titulo">{recuerdo.titulo}</span>
      <span className="boveda-recuerdo-detalle">{recuerdo.detalle}</span>
    </EnlacePagina>
  );
}
