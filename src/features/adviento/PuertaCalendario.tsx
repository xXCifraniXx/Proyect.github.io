import { clsx } from "clsx";
import type { CSSProperties } from "react";
import { TEXTOS } from "../../lib/contenido.ts";
import { formatoFechaLarga } from "../../lib/fechas.ts";
import { rellenar } from "../../lib/rellenar.ts";
import type { EstadoPuerta, Puerta } from "./adviento.ts";

interface PuertaCalendarioProps {
  puerta: Puerta;
  estado: EstadoPuerta;
  /** La puerta de hoy va resaltada. */
  esHoy: boolean;
  onAbrir: (puerta: Puerta) => void;
}

/*
  UNA PUERTA DEL CALENDARIO
  Cerrada (o en borrador): el número con un candado, sin poder tocarla.
  Disponible: brilla hasta que se abre. Abierta: muestra su ícono y se puede
  volver a leer. Las que se pueden tocar son botones (Enter y Espacio).
*/
export default function PuertaCalendario({ puerta, estado, esHoy, onAbrir }: PuertaCalendarioProps) {
  const { dia, item } = puerta;
  const clases = clsx("adviento-puerta", `is-${estado}`, esHoy && "is-hoy");
  // Aparecen una tras otra.
  const estilo: CSSProperties = { animationDelay: `${(dia - 1) * 25}ms` };

  if (estado === "cerrada" || estado === "pronto") {
    const etiqueta =
      estado === "cerrada"
        ? rellenar(TEXTOS.ariaPuertaCerrada, { dia, fecha: formatoFechaLarga(item.fecha) })
        : rellenar(TEXTOS.ariaPuertaPronto, { dia });
    return (
      <div className={clases} style={estilo} role="img" aria-label={etiqueta}>
        <span className="adviento-numero">{dia}</span>
        <span className="adviento-candado" aria-hidden="true">
          🔒
        </span>
      </div>
    );
  }

  const etiqueta =
    estado === "abierta"
      ? rellenar(TEXTOS.ariaPuertaAbierta, { dia, titulo: item.carta.titulo ?? "" })
      : rellenar(TEXTOS.ariaPuertaAbrir, { dia });
  return (
    <button className={clases} style={estilo} type="button" aria-label={etiqueta} onClick={() => onAbrir(puerta)}>
      {estado === "abierta" && (
        <span className="adviento-icono" aria-hidden="true">
          {item.carta.icono || TEXTOS.cartaIcono}
        </span>
      )}
      <span className="adviento-numero">{dia}</span>
    </button>
  );
}
