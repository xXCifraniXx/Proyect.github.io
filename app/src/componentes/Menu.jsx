import { useEffect, useRef, useState } from "react";
import { NOMBRES, TEXTOS } from "../contenido.js";

/*
  MENÚ
  En pantallas grandes son botones en una fila; en medianas y móviles se
  esconden en un menú de tres líneas (lo decide el CSS). Se cierra al elegir
  una opción, con Escape o tocando fuera.
  "visibles" dice qué enlaces opcionales se muestran: { mes, cumple }.
*/
export default function Menu({ visibles = {} }) {
  const [abierto, setAbierto] = useState(false);
  const panel = useRef(null);
  const boton = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const alTocarFuera = (event) => {
      if (!panel.current?.contains(event.target) && !boton.current?.contains(event.target)) setAbierto(false);
    };
    const alPulsarTecla = (event) => {
      if (event.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    document.addEventListener("click", alTocarFuera);
    document.addEventListener("keydown", alPulsarTecla);
    return () => {
      document.removeEventListener("click", alTocarFuera);
      document.removeEventListener("keydown", alPulsarTecla);
    };
  }, [abierto]);

  const enlaces = [
    { href: "#mensaje-mes", texto: TEXTOS.navMes, visible: !!visibles.mes },
    { href: "#carta", texto: TEXTOS.navCarta },
    { href: "#linea-tiempo", texto: TEXTOS.navMeses },
    { href: "#tiempo", texto: TEXTOS.navTiempo },
    { href: "#calendario", texto: TEXTOS.navBajada },
    { href: "#musica", texto: TEXTOS.navMusica },
    { href: "#cumple", texto: TEXTOS.navCumple, visible: !!visibles.cumple },
    { href: "#boveda", texto: TEXTOS.navBoveda },
    { href: "#constelacion", texto: TEXTOS.navConstelacion },
    { href: "#juego", texto: TEXTOS.navJuego }
  ].filter((enlace) => enlace.visible !== false);

  return (
    <nav className="topbar" aria-label="Navegación principal">
      <a href="#inicio" className="brand">Para {NOMBRES.novia}</a>
      <button
        ref={boton}
        className="menu-toggle"
        type="button"
        aria-expanded={abierto}
        aria-controls="navLinks"
        onClick={() => setAbierto((valor) => !valor)}
      >
        <span className="menu-toggle-icon" aria-hidden="true"><span /><span /><span /></span>
        <span>Menú</span>
      </button>
      <div ref={panel} className={`nav-links${abierto ? " is-open" : ""}`} id="navLinks">
        {enlaces.map((enlace) => (
          <a key={enlace.href} href={enlace.href} onClick={() => setAbierto(false)}>{enlace.texto}</a>
        ))}
      </div>
    </nav>
  );
}
