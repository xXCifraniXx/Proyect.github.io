import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { CONFIG, TEXTOS } from "../../lib/contenido.ts";
import { rafagaCorazones } from "../../lib/corazones.ts";
import { crearMazo, type CartaMemoria as Carta } from "./memoria.ts";
import { CabeceraSeccion, Seccion } from "../../components/ui/index.ts";
import CartaMemoria from "./CartaMemoria.tsx";

const SIMBOLOS = CONFIG.juego?.parejas?.length ? CONFIG.juego.parejas : ["💌", "🌙", "✦", "🎧"];
const PAREJAS = Math.min(8, SIMBOLOS.length);
const ESPERA_MS = 750;

/*
  MINIJUEGO: memoria con los emojis de config.juego.parejas
  Se dan vuelta dos cartas por turno; si son iguales quedan arriba, si no,
  se vuelven a tapar. Al encontrar todas las parejas, corazones y "otra vez".
*/
export default function Minijuego() {
  const [mazo, setMazo] = useState<Carta[]>(() => crearMazo(SIMBOLOS));
  const [volteadas, setVolteadas] = useState<number[]>([]);
  const [emparejadas, setEmparejadas] = useState<Set<number>>(() => new Set());
  const [movimientos, setMovimientos] = useState(0);
  // Mientras se ven dos cartas distintas, no se puede tocar otra.
  const bloqueado = useRef(false);
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(espera.current), []);

  const encontradas = emparejadas.size / 2;
  const gano = encontradas === PAREJAS;

  const voltear = (carta: Carta) => {
    if (bloqueado.current || volteadas.includes(carta.id) || emparejadas.has(carta.id)) return;

    // Primera carta del turno.
    if (volteadas.length === 0) {
      setVolteadas([carta.id]);
      return;
    }

    // Segunda carta: se cuenta el movimiento y se comparan.
    const primera = mazo.find((c) => c.id === volteadas[0]);
    setMovimientos((m) => m + 1);
    if (primera && primera.simbolo === carta.simbolo) {
      const siguientes = new Set(emparejadas).add(primera.id).add(carta.id);
      setEmparejadas(siguientes);
      setVolteadas([]);
      if (siguientes.size / 2 === PAREJAS) rafagaCorazones(26);
      return;
    }
    setVolteadas([volteadas[0], carta.id]);
    bloqueado.current = true;
    espera.current = setTimeout(() => {
      setVolteadas([]);
      bloqueado.current = false;
    }, ESPERA_MS);
  };

  const reiniciar = () => {
    clearTimeout(espera.current);
    bloqueado.current = false;
    setMazo(crearMazo(SIMBOLOS));
    setVolteadas([]);
    setEmparejadas(new Set());
    setMovimientos(0);
  };

  return (
    <Seccion id="juego">
      <CabeceraSeccion etiqueta={TEXTOS.juegoEyebrow} titulo={TEXTOS.juegoTitle} intro={TEXTOS.juegoIntro} />
      <div className="game-panel glass-soft">
        <div className="game-stats">
          <span>
            <strong>{movimientos}</strong> <span>{TEXTOS.juegoMovesLabel}</span>
          </span>
          <span>
            <strong>
              {encontradas}/{PAREJAS}
            </strong>{" "}
            <span>{TEXTOS.juegoPairsLabel}</span>
          </span>
          <button className="btn btn-ghost" type="button" onClick={reiniciar}>
            {TEXTOS.juegoRestart}
          </button>
        </div>
        <div className={clsx("memory-board", gano && "is-won")}>
          {mazo.map((carta) => (
            <CartaMemoria
              key={carta.id}
              simbolo={carta.simbolo}
              volteada={volteadas.includes(carta.id) || emparejadas.has(carta.id)}
              emparejada={emparejadas.has(carta.id)}
              onVoltear={() => voltear(carta)}
            />
          ))}
        </div>
        {gano && (
          <div className="game-win">
            <span className="game-win-icon">🎉</span>
            <p>{TEXTOS.juegoWin}</p>
            <button className="btn btn-primary" type="button" onClick={reiniciar}>
              {TEXTOS.juegoPlayAgain}
            </button>
          </div>
        )}
      </div>
    </Seccion>
  );
}
