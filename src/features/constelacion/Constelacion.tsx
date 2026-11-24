import { TEXTOS } from "../../lib/contenido.ts";
import { CabeceraSeccion, Seccion } from "../../components/ui/index.ts";
import CieloDecorativo from "./CieloDecorativo.tsx";

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
        {/* Con el "?…" de ahora: la vista previa (?tema=rosa, ?cumple=…) sigue en la página del cielo. */}
        <a className="btn btn-primary" href={"constelacion/index.html" + window.location.search}>
          {TEXTOS.constelacionBtn}
        </a>
      </div>
    </Seccion>
  );
}
