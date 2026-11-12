import { TEXTOS } from "../lib/contenido.ts";
import Seccion from "./Seccion.tsx";

/** Última tarjeta de la página: la frase final y la firma. */
export default function Cierre() {
  return (
    <Seccion id="final" className="final-section">
      <div className="final-card glass">
        <span className="eyebrow">{TEXTOS.finalEyebrow}</span>
        <h2>{TEXTOS.finalPhrase}</h2>
        <p>{TEXTOS.finalSign}</p>
      </div>
    </Seccion>
  );
}
