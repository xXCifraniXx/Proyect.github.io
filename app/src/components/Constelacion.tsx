import { TEXTOS } from "../lib/contenido.ts";
import CabeceraSeccion from "./CabeceraSeccion.tsx";
import CieloDecorativo from "./CieloDecorativo.tsx";
import Seccion from "./Seccion.tsx";

/** Sección "Constelación": un cielo de adorno y el botón a la página del cielo. */
export default function Constelacion() {
  return (
    <Seccion id="constelacion">
      <CabeceraSeccion
        etiqueta={TEXTOS.constelacionEyebrow}
        titulo={TEXTOS.constelacionTitle}
        intro={TEXTOS.constelacionIntro}
      />
      <div className="constelacion-card glass-soft">
        <CieloDecorativo />
        <a className="btn btn-primary" href="constelacion/index.html">
          {TEXTOS.constelacionBtn}
        </a>
      </div>
    </Seccion>
  );
}
