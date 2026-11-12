import { memo } from "react";
import { claveDia, mesYAnio } from "../../lib/fechas.ts";
import { tipoDeDia, type Rotacion } from "./rotacion.ts";

interface MesCalendarioProps {
  /** Cualquier día del mes que se dibuja (se usa el año y el mes). */
  mes: Date;
  rotacion: Rotacion;
  /** "AAAA-MM-DD" de hoy, para marcarlo. */
  hoy: string;
}

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

/*
  Un mes del calendario con cada día marcado como Sube / Mina / Bajada /
  Descanso. memo(): la sección se vuelve a dibujar cada segundo por la cuenta
  regresiva, pero el mes solo cambia si cambian el mes, la rotación o el día.
*/
function MesCalendario({ mes, rotacion, hoy }: MesCalendarioProps) {
  const anio = mes.getFullYear();
  const m = mes.getMonth();
  const diasDelMes = new Date(anio, m + 1, 0).getDate();
  // La semana empieza el lunes.
  const huecos = (new Date(anio, m, 1).getDay() + 6) % 7;

  return (
    <article className="calendar-month glass-soft">
      <h3>{mesYAnio(mes)}</h3>
      <div className="weekdays" aria-hidden="true">
        {DIAS_SEMANA.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {Array.from({ length: huecos }, (_, i) => (
          <div key={`h${i}`} className="calendar-day empty" aria-hidden="true" />
        ))}
        {Array.from({ length: diasDelMes }, (_, i) => {
          const dia = new Date(anio, m, i + 1);
          const info = tipoDeDia(rotacion, dia);
          const clases = ["calendar-day", info.tipo, claveDia(dia) === hoy && "today"].filter(Boolean).join(" ");
          return (
            <div key={i} className={clases} title={info.etiqueta}>
              <strong>{i + 1}</strong>
              {info.etiqueta && <span>{info.etiqueta}</span>}
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default memo(MesCalendario);
