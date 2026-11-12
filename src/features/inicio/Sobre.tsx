import { clsx } from "clsx";
import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { TEXTOS } from "../../lib/contenido.ts";

/*
  SOBRE CON LA CARTA
  Se abre tocando el sobre o con el botón. Al abrirse, la solapa y la carta
  suben por encima del sobre; en pantallas angostas el CSS deja ese espacio
  arriba (--lift), que se calcula con la altura real de la carta para que no
  tape el menú aunque el texto sea largo.
*/
export default function Sobre() {
  const [abierto, setAbierto] = useState(false);
  const sobre = useRef<HTMLDivElement>(null);
  const papel = useRef<HTMLElement>(null);

  const medir = useCallback(() => {
    const env = sobre.current;
    const paper = papel.current;
    if (!env || !paper) return;
    const h = paper.offsetHeight;
    const paperTop = paper.offsetTop - h * 0.43;
    const flapTop = -env.offsetHeight * 0.58;
    const lift = Math.ceil(Math.max(-paperTop, -flapTop, 0)) + 16;
    env.style.setProperty("--lift", `${lift}px`);
  }, []);

  // useLayoutEffect mide antes de pintar, así no se ve un salto.
  useLayoutEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    void document.fonts?.ready.then(medir);
    return () => window.removeEventListener("resize", medir);
  }, [medir]);

  const alternar = () => setAbierto((valor) => !valor);

  const alPulsarTecla = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      alternar();
    }
  };

  const desdeBoton = () => {
    alternar();
    sobre.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="letter-stage" aria-label={TEXTOS.ariaSobre}>
      <div
        ref={sobre}
        className={clsx("envelope", abierto && "open")}
        id="envelope"
        role="button"
        tabIndex={0}
        aria-pressed={abierto}
        aria-label={TEXTOS.ariaSobreBoton}
        onClick={alternar}
        onKeyDown={alPulsarTecla}
      >
        <div className="envelope-back" />
        <article ref={papel} className="letter-paper">
          <h2>{TEXTOS.letterTitle}</h2>
          <p>{TEXTOS.letterMessage}</p>
          <strong>{TEXTOS.letterSignature}</strong>
        </article>
        <div className="envelope-front" />
        <div className="envelope-flap" />
        <div className="seal">❤</div>
      </div>
      <p className="hint">{abierto ? TEXTOS.letterHintOpen : TEXTOS.letterHintClosed}</p>
      <button className="btn btn-ghost" type="button" onClick={desdeBoton}>
        {abierto ? TEXTOS.letterClose : TEXTOS.letterOpen}
      </button>
    </div>
  );
}
