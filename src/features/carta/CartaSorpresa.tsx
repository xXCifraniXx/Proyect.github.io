import { useState } from "react";
import { TEXTOS } from "../../lib/contenido.ts";
import { CabeceraSeccion, Seccion } from "../../components/ui/index.ts";

/** Sección "Carta": un botón que muestra u oculta el mensaje sorpresa. */
export default function CartaSorpresa() {
  const [visible, setVisible] = useState(false);

  return (
    <Seccion id="carta">
      <CabeceraSeccion etiqueta={TEXTOS.cartaEyebrow} titulo={TEXTOS.cartaTitle} intro={TEXTOS.cartaIntro} />
      <div className="surprise-card glass-soft">
        <button className="btn btn-primary" type="button" aria-expanded={visible} onClick={() => setVisible((v) => !v)}>
          {visible ? TEXTOS.surpriseClose || "Ocultar mensaje 💌" : TEXTOS.surpriseOpen || "Ver mensaje sorpresa 💗"}
        </button>
        <p className={`surprise-message${visible ? " show" : ""}`}>{TEXTOS.surpriseMessage}</p>
      </div>
    </Seccion>
  );
}
