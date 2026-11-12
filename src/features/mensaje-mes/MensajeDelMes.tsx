import { useTextoCarta } from "../../hooks/useTextoCarta.ts";
import { enParrafos } from "../../lib/cartas.ts";
import { CONFIG, NOMBRES, TEXTOS } from "../../lib/contenido.ts";
import { formatoFechaLarga, mesesEntre } from "../../lib/fechas.ts";
import type { NotaDelMes } from "./mensajeMes.ts";
import { Seccion } from "../../components/ui/index.ts";

const NUMEROS_MESES = [
  "",
  "Un mes",
  "Dos meses",
  "Tres meses",
  "Cuatro meses",
  "Cinco meses",
  "Seis meses",
  "Siete meses",
  "Ocho meses",
  "Nueve meses",
  "Diez meses",
  "Once meses",
  "Un año"
];

interface MensajeDelMesProps {
  /** El mensaje que toca hoy (lo elige App con mensajeMesVigente). */
  nota: NotaDelMes;
}

/*
  MENSAJE DEL MES
  Bloque con aspecto de hoja de papel para cada mesiversario: fecha, título
  ("Ocho meses", calculado desde el inicio de la relación), el texto
  (descifrado si viene sellado) y la firma.
*/
export default function MensajeDelMes({ nota }: MensajeDelMesProps) {
  const texto = useTextoCarta(nota);

  const inicioRelacion = new Date(CONFIG.fechas?.inicioRelacion ?? nota.inicio);
  const meses = mesesEntre(inicioRelacion, nota.inicio);
  const titulo = nota.titulo || NUMEROS_MESES[meses] || `${meses} meses`;

  return (
    <Seccion id="mensaje-mes" className="month-note-section" ariaLabelledby="mesTitulo">
      <article className="month-note">
        <p className="month-note-date">{formatoFechaLarga(nota.inicio)}</p>
        <h2 className="month-note-title" id="mesTitulo">
          {titulo}
        </h2>
        <div className="month-note-body">
          {texto && enParrafos(texto).map((parrafo, i) => <p key={i}>{parrafo}</p>)}
        </div>
        <p className="month-note-sign">{TEXTOS.mesFirma || NOMBRES.autor}</p>
      </article>
    </Seccion>
  );
}
