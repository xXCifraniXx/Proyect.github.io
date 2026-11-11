import { useState } from "react";
import { TEXTOS } from "../lib/contenido.ts";

interface BienvenidaProps {
  /** Se llama cuando ella pulsa el botón para entrar. */
  onEntrar?: () => void;
}

/** Pantalla de bienvenida: se oculta al pulsar el botón. */
export default function Bienvenida({ onEntrar }: BienvenidaProps) {
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
