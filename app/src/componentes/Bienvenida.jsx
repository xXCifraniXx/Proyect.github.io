import { useState } from "react";
import { TEXTOS } from "../contenido.js";

// Pantalla de bienvenida: se oculta al pulsar el botón y avisa con onEntrar.
export default function Bienvenida({ onEntrar }) {
  const [oculta, setOculta] = useState(false);

  const entrar = () => {
    setOculta(true);
    onEntrar?.();
  };

  return (
    <section className={`welcome${oculta ? " hide" : ""}`} id="welcome" aria-label="Pantalla de bienvenida">
      <div className="welcome-card glass reveal-now">
        <span className="eyebrow">{TEXTOS.welcomeEyebrow}</span>
        <h1>{TEXTOS.welcomeTitle}</h1>
        <p>{TEXTOS.welcomeText}</p>
        <button className="btn btn-primary" id="enterBtn" type="button" onClick={entrar}>
          {TEXTOS.welcomeButton}
        </button>
        <p className="tiny-note">{TEXTOS.welcomeNote}</p>
      </div>
    </section>
  );
}
