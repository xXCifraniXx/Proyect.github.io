import { useAhora } from "../hooks/useAhora.ts";
import { leerAjusteLocal } from "../lib/ajusteLocal.ts";
import { CONFIG, TEXTOS } from "../lib/contenido.ts";
import { tiempoEntre } from "../lib/fechas.ts";
import { armarRotacion } from "../lib/rotacion.ts";
import CabeceraSeccion from "./CabeceraSeccion.tsx";
import CuentaRegresiva from "./CuentaRegresiva.tsx";
import Seccion from "./Seccion.tsx";

const INICIO = new Date(CONFIG.fechas?.inicioRelacion ?? Date.now());

// Con la rotación de mina activa, la cuenta regresiva vive en la sección
// Bajada; esta tarjeta solo se usa si no hay rotación y hay una fecha fija.
const REGRESO = CONFIG.fechas?.regreso ? new Date(CONFIG.fechas.regreso) : null;
const MOSTRAR_REGRESO =
  !armarRotacion(CONFIG.rotacionMina ?? {}, leerAjusteLocal()).activa && !!REGRESO && !Number.isNaN(REGRESO.getTime());

/** Sección "Tiempo": años, meses y días juntos, que se actualizan solos. */
export default function TiempoJuntos() {
  const ahora = useAhora();
  const juntos = tiempoEntre(INICIO, ahora);

  const contadores = [
    { valor: juntos.years, etiqueta: TEXTOS.labelYears },
    { valor: juntos.months, etiqueta: TEXTOS.labelMonths },
    { valor: juntos.days, etiqueta: TEXTOS.labelDays },
    { valor: juntos.totalDays, etiqueta: TEXTOS.labelTotalDays }
  ];

  return (
    <Seccion id="tiempo">
      <CabeceraSeccion etiqueta={TEXTOS.tiempoEyebrow} titulo={TEXTOS.tiempoTitle} intro={TEXTOS.timeIntro} />
      <div className="counter-grid">
        {contadores.map((c) => (
          <article key={c.etiqueta} className="counter-card glass-soft">
            <strong>{c.valor}</strong>
            <span>{c.etiqueta}</span>
          </article>
        ))}
      </div>

      {MOSTRAR_REGRESO && REGRESO && (
        <div className="return-card glass-soft">
          <div>
            <span className="eyebrow small">{TEXTOS.countdownEyebrow}</span>
            <h3>{TEXTOS.returnTitle || "Para volver a verte"}</h3>
            <p>{TEXTOS.returnText}</p>
          </div>
          <CuentaRegresiva objetivo={REGRESO} ahora={ahora} className="return-grid" />
        </div>
      )}
    </Seccion>
  );
}
