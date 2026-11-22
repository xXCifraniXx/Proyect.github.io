import { clsx } from "clsx";
import { useCallback, useState } from "react";
import { TEXTOS } from "../../lib/contenido.ts";
import { estadoEstrella, type Enlace } from "./enlaces.ts";
import PanelSecciones from "./PanelSecciones.tsx";
import { useBarraVisible } from "./useBarraVisible.ts";

interface BarraSeccionesProps {
  /** Las páginas que existen hoy, en su orden. */
  enlaces: Enlace[];
  /** La página que se está viendo, o null en la portada. */
  actual: Enlace | null;
}

/*
  BARRA DE SECCIONES
  Abajo en todas las páginas (en la portada, cuando su menú ya quedó
  arriba). Dice en qué página está y muestra una estrella por página, en
  orden: las de antes, en dorado; la actual, en rosa. El botón ✦ abre el
  panel con todas las páginas.
*/
export default function BarraSecciones({ enlaces, actual }: BarraSeccionesProps) {
  const visible = useBarraVisible(actual === null);
  const [abierto, setAbierto] = useState(false);
  const cerrar = useCallback(() => setAbierto(false), []);
  const indiceActual = actual ? enlaces.findIndex((enlace) => enlace.id === actual.id) : -1;

  return (
    <>
      <nav
        className={clsx("barra-secciones", visible && "is-visible")}
        aria-label={TEXTOS.ariaBarraSecciones}
        // Escondida, no se puede alcanzar con Tab.
        inert={!visible}
      >
        <div className="barra-secciones-donde">
          <span className="barra-secciones-nombre">{actual?.texto ?? TEXTOS.navInicio}</span>
          <ol className="barra-secciones-estrellas" aria-hidden="true">
            {enlaces.map((enlace, i) => (
              <li key={enlace.id} className={`is-${estadoEstrella(i, indiceActual)}`} />
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
      <PanelSecciones abierto={abierto} secciones={enlaces} indiceActual={indiceActual} onCerrar={cerrar} />
    </>
  );
}
