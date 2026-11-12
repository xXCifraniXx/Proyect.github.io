import { useRef, useState, type CSSProperties } from "react";
import { TEXTOS } from "../../lib/contenido.ts";
import { celebrar } from "../../lib/confeti.ts";
import { rafagaCorazones } from "../../lib/corazones.ts";
import { dayKey, PREVIEW } from "../../lib/cumple.ts";

interface PastelProps {
  /** Día del cumpleaños de este año: cada año empieza con las velas encendidas. */
  dia: Date;
  velas: number;
  /** Abre la carta de cumpleaños (si no hay, el botón no aparece). */
  onAbrirCarta?: () => void;
}

// Se acuerda (en este dispositivo) de que ya apagó las velas este año.
// En la vista previa (?cumple=…) no se guarda nada.
function leerHecho(clave: string): boolean {
  if (PREVIEW) return false;
  try {
    return localStorage.getItem(clave) === "1";
  } catch {
    return false;
  }
}
function guardarHecho(clave: string, hecho: boolean) {
  if (PREVIEW) return;
  try {
    if (hecho) localStorage.setItem(clave, "1");
    else localStorage.removeItem(clave);
  } catch {
    /* modo privado */
  }
}

/*
  PASTEL CON VELAS
  Ella toca cada vela o pulsa "Soplar". Al apagarlas todas hay confeti y
  aparece el deseo con el botón para abrir la carta.
*/
export default function Pastel({ dia, velas, onAbrirCarta }: PastelProps) {
  const clave = `cumple-velas-${dayKey(dia)}`;
  const cantidad = Math.min(9, Math.max(1, velas || 5));
  const [yaHecho] = useState(() => leerHecho(clave));

  const [apagadas, setApagadas] = useState<boolean[]>(() => Array.from({ length: cantidad }, () => yaHecho));
  const [terminado, setTerminado] = useState(yaHecho);
  // Si ya las había apagado, el pastel aparece apagado sin animación.
  const [restaurado, setRestaurado] = useState(yaHecho);
  // Copia para leer el estado más reciente dentro de los temporizadores de "Soplar".
  const actuales = useRef(apagadas);

  const terminar = () => {
    setTerminado(true);
    celebrar();
    rafagaCorazones(26);
    guardarHecho(clave, true);
  };

  const apagar = (i: number) => {
    if (actuales.current[i]) return;
    const siguiente = actuales.current.slice();
    siguiente[i] = true;
    actuales.current = siguiente;
    setApagadas(siguiente);
    if (siguiente.every(Boolean)) terminar();
  };

  const soplar = () => {
    actuales.current
      .map((apagada, i) => (apagada ? -1 : i))
      .filter((i) => i >= 0)
      .forEach((i, orden) => setTimeout(() => apagar(i), orden * 140));
  };

  const encender = () => {
    const todas = Array.from({ length: cantidad }, () => false);
    actuales.current = todas;
    setApagadas(todas);
    setTerminado(false);
    setRestaurado(false);
    guardarHecho(clave, false);
  };

  const encendidas = apagadas.filter((a) => !a).length;
  const estilo = { "--lit": String(encendidas / cantidad) } as CSSProperties;

  return (
    <div className="cumple-stage">
      <div
        className={`cake${restaurado ? " is-restored" : ""}`}
        role="group"
        aria-label="Pastel de cumpleaños"
        style={estilo}
      >
        <div className="cake-glow" />
        <div className="cake-candles">
          {apagadas.map((apagada, i) => (
            <button
              key={i}
              className={`candle${apagada ? " is-out" : ""}`}
              type="button"
              aria-label={`Apagar la vela ${i + 1}`}
              onClick={() => apagar(i)}
            >
              <span className="flame" />
              <span className="smoke" />
              <span className="wick" />
            </button>
          ))}
        </div>
        <div className="cake-layer cake-top" />
        <div className="cake-layer cake-mid" />
        <div className="cake-layer cake-base" />
        <div className="cake-plate" />
      </div>

      {!terminado && (
        <button className="btn btn-primary" type="button" onClick={soplar}>
          {TEXTOS.cumpleBtnSoplar}
        </button>
      )}

      {terminado && (
        <div className="cumple-wish">
          <p>{TEXTOS.cumpleDeseo}</p>
          <div className="cumple-wish-actions">
            {onAbrirCarta && (
              <button className="btn btn-primary" type="button" onClick={onAbrirCarta}>
                {TEXTOS.cumpleBtnCarta}
              </button>
            )}
            <button className="btn btn-ghost" type="button" onClick={encender}>
              {TEXTOS.cumpleBtnEncender}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
