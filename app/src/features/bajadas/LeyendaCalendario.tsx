import { TEXTOS } from "../../lib/contenido.ts";

const ITEMS = [
  { clase: "legend-mine", texto: TEXTOS.legendMine },
  { clase: "legend-departure", texto: TEXTOS.legendDeparture },
  { clase: "legend-return", texto: TEXTOS.legendReturn },
  { clase: "legend-rest", texto: TEXTOS.legendRest },
  { clase: "legend-today", texto: TEXTOS.legendToday }
];

/** Qué significa cada color del calendario. */
export default function LeyendaCalendario() {
  return (
    <div className="calendar-legend" aria-label="Leyenda del calendario">
      {ITEMS.map((item) => (
        <span key={item.clase}>
          <i className={`legend-dot ${item.clase}`} /> <span>{item.texto}</span>
        </span>
      ))}
    </div>
  );
}
