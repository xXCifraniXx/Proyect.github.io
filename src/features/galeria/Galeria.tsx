import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useDia } from "../../hooks/useAhora.ts";
import { CONFIG, TEXTOS } from "../../lib/contenido.ts";
import { mesesDesde } from "../../lib/fechas.ts";
import type { FotoDelMes } from "../../types/config.ts";
import { CabeceraSeccion, Seccion } from "../../components/ui/index.ts";
import LineaDeMeses from "./LineaDeMeses.tsx";
import TarjetaMes from "./TarjetaMes.tsx";

// Las fotos se leen una vez; los meses dependen del día (ver más abajo).
const INICIO = new Date(CONFIG.fechas?.inicioRelacion ?? "");
const FOTOS = new Map<string, FotoDelMes>((CONFIG.lineaTiempo ?? []).map((foto) => [foto.mes, foto]));

/*
  GALERÍA: una foto por mes
  Una tarjeta por cada mes desde el inicio de la relación hasta hoy. Se
  recorre deslizando, con las flechas, con ← → o tocando un mes en la línea
  de abajo. Siempre abre en el mes más reciente. Si la página queda abierta
  al empezar un mes nuevo, su tarjeta aparece sola.
*/
export default function Galeria() {
  const dia = useDia();
  const meses = useMemo(() => (Number.isNaN(INICIO.getTime()) ? [] : mesesDesde(INICIO, dia)), [dia]);
  const fotos = FOTOS;

  const visor = useRef<HTMLDivElement>(null);
  const tarjetas = useRef<(HTMLElement | null)[]>([]);
  const [activo, setActivo] = useState(meses.length - 1);
  // Copia de "activo" para leerla dentro de eventos sin volver a crearlos.
  const activoRef = useRef(activo);
  useEffect(() => {
    activoRef.current = activo;
  }, [activo]);

  const reducirMovimiento = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const irA = useCallback(
    (indice: number, suave = true) => {
      const el = visor.current;
      const tarjeta = tarjetas.current[Math.max(0, Math.min(meses.length - 1, indice))];
      if (!el || !tarjeta) return;
      const izquierda = tarjeta.offsetLeft - (el.clientWidth - tarjeta.offsetWidth) / 2;
      el.scrollTo({ left: izquierda, behavior: suave && !reducirMovimiento ? "smooth" : "auto" });
    },
    [meses.length, reducirMovimiento]
  );

  // Al aparecer, sin animación, en el último mes.
  useLayoutEffect(() => {
    irA(meses.length - 1, false);
  }, [irA, meses.length]);

  // Si cambia el tamaño de la pantalla, vuelve a centrar el mes que se ve.
  useEffect(() => {
    const centrar = () => irA(activoRef.current, false);
    window.addEventListener("resize", centrar);
    return () => window.removeEventListener("resize", centrar);
  }, [irA]);

  // Al deslizar, el mes activo es la tarjeta más cerca del centro.
  const cuadro = useRef(0);
  const alDeslizar = () => {
    cancelAnimationFrame(cuadro.current);
    cuadro.current = requestAnimationFrame(() => {
      const el = visor.current;
      if (!el) return;
      const centro = el.scrollLeft + el.clientWidth / 2;
      let mejor = 0;
      let distancia = Infinity;
      tarjetas.current.forEach((tarjeta, i) => {
        if (!tarjeta) return;
        const d = Math.abs(tarjeta.offsetLeft + tarjeta.offsetWidth / 2 - centro);
        if (d < distancia) {
          distancia = d;
          mejor = i;
        }
      });
      setActivo(mejor);
    });
  };

  const alPulsarTecla = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      irA(activo - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      irA(activo + 1);
    }
  };

  return (
    <Seccion id="linea-tiempo">
      <CabeceraSeccion etiqueta={TEXTOS.timelineEyebrow} titulo={TEXTOS.timelineTitle} intro={TEXTOS.timelineIntro} />
      <div className="timeline-wrap glass-soft">
        {/* Una zona que se desliza: tiene que poder enfocarse para moverla con ← →. */}
        {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={visor}
          className="timeline-viewport"
          role="region"
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          aria-label={TEXTOS.ariaGaleria}
          onScroll={alDeslizar}
          onKeyDown={alPulsarTecla}
        >
          <div className="timeline-track">
            {meses.map((clave, i) => (
              <TarjetaMes
                key={clave}
                ref={(el) => {
                  tarjetas.current[i] = el;
                }}
                clave={clave}
                foto={fotos.get(clave)}
                inclinacion={i % 2 === 0 ? "tilt-left" : "tilt-right"}
                activa={i === activo}
                onElegir={() => irA(i)}
              />
            ))}
          </div>
        </div>
        <div className="timeline-nav">
          <button
            className="carousel-btn prev"
            type="button"
            aria-label={TEXTOS.ariaMesAnterior}
            disabled={activo <= 0}
            onClick={() => irA(activo - 1)}
          >
            ‹
          </button>
          <LineaDeMeses meses={meses} activo={activo} onElegir={irA} />
          <button
            className="carousel-btn next"
            type="button"
            aria-label={TEXTOS.ariaMesSiguiente}
            disabled={activo >= meses.length - 1}
            onClick={() => irA(activo + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </Seccion>
  );
}
