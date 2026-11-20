import { clsx } from "clsx";
import { useCallback, useMemo, useState } from "react";
import { TEXTOS } from "../../lib/contenido.ts";
import { enlacesVisibles, estadoEstrella, idDe, type Enlace, type EnlacesVisibles } from "./enlaces.ts";
import PanelSecciones from "./PanelSecciones.tsx";
import { useNavegacion } from "./useNavegacion.ts";

interface BarraSeccionesProps {
  visibles: EnlacesVisibles;
}

/*
  BARRA DE SECCIONES
  Aparece abajo cuando la portada ya quedó arriba (el menú de la portada se
  va con ella). Dice en qué sección está y muestra una estrella por sección,
  en el orden de la página: las que ya pasó, en dorado; la actual, en rosa.
  El botón ✦ abre el panel con todas las secciones.
*/
export default function BarraSecciones({ visibles }: BarraSeccionesProps) {
  const { mes, cumple } = visibles;
  const enlaces = useMemo(() => enlacesVisibles({ mes, cumple }), [mes, cumple]);
  const ids = useMemo(() => enlaces.map(idDe), [enlaces]);
  const { visible, presentes, actual } = useNavegacion(ids);
  const [abierto, setAbierto] = useState(false);
  const cerrar = useCallback(() => setAbierto(false), []);

  // En el orden de la página y solo las que existen.
  const porId = new Map(enlaces.map((enlace) => [idDe(enlace), enlace]));
  const secciones = presentes.map((id) => porId.get(id)).filter((enlace): enlace is Enlace => !!enlace);
  const indiceActual = secciones.findIndex((enlace) => idDe(enlace) === actual);

  return (
    <>
      <nav
        className={clsx("barra-secciones", visible && "is-visible")}
        aria-label={TEXTOS.ariaBarraSecciones}
        // Escondida, no se puede alcanzar con Tab.
        inert={!visible}
      >
        <div className="barra-secciones-donde">
          <span className="barra-secciones-nombre">{secciones[indiceActual]?.texto}</span>
          <ol className="barra-secciones-estrellas" aria-hidden="true">
            {secciones.map((enlace, i) => (
              <li key={enlace.href} className={`is-${estadoEstrella(i, indiceActual)}`} />
            ))}
          </ol>
        </div>
        <button
          className="barra-secciones-boton"
          type="button"
          aria-label={TEXTOS.ariaAbrirSecciones}
          aria-haspopup="dialog"
          aria-expanded={abierto}
          onClick={() => setAbierto(true)}
        >
          <span aria-hidden="true">✦</span>
        </button>
      </nav>
      <PanelSecciones abierto={abierto} secciones={secciones} indiceActual={indiceActual} onCerrar={cerrar} />
    </>
  );
}
