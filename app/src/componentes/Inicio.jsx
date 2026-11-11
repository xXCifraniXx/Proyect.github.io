import { TEXTOS } from "../contenido.js";
import { useRevelar } from "../hooks/useRevelar.js";
import { estadoCumple } from "../lib/cumple.js";
import Menu from "./Menu.jsx";
import Sobre from "./Sobre.jsx";

// Portada: menú, saludo, botones y el sobre con la carta.
export default function Inicio({ visibles }) {
  const ref = useRevelar();
  // El día del cumpleaños el segundo botón lleva directo a las velas.
  const destinoSecundario = estadoCumple() === "hoy" ? "#cumple" : "#boveda";

  return (
    <header ref={ref} className="hero glass reveal" id="inicio">
      <Menu visibles={visibles} />
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{TEXTOS.heroEyebrow}</span>
          <h1>{TEXTOS.heroTitle}</h1>
          <p className="lead">{TEXTOS.heroIntro}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#carta">{TEXTOS.heroCtaCarta}</a>
            <a className="btn btn-secondary" href={destinoSecundario}>{TEXTOS.heroCtaBoveda}</a>
          </div>
        </div>
        <Sobre />
      </div>
    </header>
  );
}
