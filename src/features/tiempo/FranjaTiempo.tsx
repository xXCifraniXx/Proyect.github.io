import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { useDia } from "../../hooks/useAhora.ts";
import { CONFIG, TEXTOS } from "../../lib/contenido.ts";
import { tiempoEntre } from "../../lib/fechas.ts";
import { rellenar } from "../../lib/rellenar.ts";
import TarjetaRegreso from "./TarjetaRegreso.tsx";
import { textoJuntos } from "./tiempo.ts";

const INICIO = new Date(CONFIG.fechas?.inicioRelacion ?? Date.now());
// Con la rotación de mina activa, la cuenta regresiva vive en la página
// Bajada; esta tarjeta solo se usa si la rotación está apagada en config y hay
// una fecha fija. (Con la rotación apagada no hay página Bajada, así que
// tampoco puede haber un ajuste guardado en el celular.) No se importa nada de
// features/bajadas: arrastraría toda esa página a la carga inicial.
const REGRESO = CONFIG.fechas?.regreso ? new Date(CONFIG.fechas.regreso) : null;
const MOSTRAR_REGRESO = CONFIG.rotacionMina?.activa === false && !!REGRESO && !Number.isNaN(REGRESO.getTime());

/*
  FRANJA DEL TIEMPO JUNTOS
  Arriba en todas las páginas: "Juntos: 8 meses y 16 días". Al tocarla se ven
  años, meses, días y el total (y la cuenta para volver a verse, si no hay
  rotación de mina). Se cierra con el mismo botón, con Escape o tocando fuera.
  Cambia sola a medianoche (useDia).
*/
export default function FranjaTiempo() {
  const dia = useDia();
  const [abierta, setAbierta] = useState(false);
  const franja = useRef<HTMLDivElement>(null);
  const juntos = tiempoEntre(INICIO, dia);

  // Abierta, un toque fuera o Escape la cierran.
  useEffect(() => {
    if (!abierta) return undefined;
    const alTocar = (e: PointerEvent) => {
      if (franja.current && !franja.current.contains(e.target as Node)) setAbierta(false);
    };
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierta(false);
    };
    document.addEventListener("pointerdown", alTocar);
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("pointerdown", alTocar);
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierta]);

  const contadores = [
    { valor: juntos.years, etiqueta: TEXTOS.labelYears },
    { valor: juntos.months, etiqueta: TEXTOS.labelMonths },
    { valor: juntos.days, etiqueta: TEXTOS.labelDays },
    { valor: juntos.totalDays, etiqueta: TEXTOS.labelTotalDays }
  ];

  return (
    <div ref={franja} className={clsx("franja-tiempo", abierta && "is-abierta")}>
      <button
        className="franja-tiempo-boton"
        type="button"
        aria-expanded={abierta}
        aria-controls="franjaTiempoDetalle"
        onClick={() => setAbierta((a) => !a)}
      >
        <span className="franja-tiempo-corazon" aria-hidden="true">
          ♡
        </span>
        {rellenar(TEXTOS.franjaJuntos, { tiempo: textoJuntos(juntos) })}
        <span className="franja-tiempo-flecha" aria-hidden="true">
          ▾
        </span>
      </button>
      <div id="franjaTiempoDetalle" className="franja-tiempo-detalle" hidden={!abierta}>
        <p className="franja-tiempo-titulo">{TEXTOS.tiempoTitle}</p>
        <div className="counter-grid">
          {contadores.map((c) => (
            <article key={c.etiqueta} className="counter-card">
              <strong>{c.valor}</strong>
              <span>{c.etiqueta}</span>
            </article>
          ))}
        </div>
        {MOSTRAR_REGRESO && REGRESO && abierta && <TarjetaRegreso objetivo={REGRESO} />}
      </div>
    </div>
  );
}
