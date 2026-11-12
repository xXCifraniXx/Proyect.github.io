import { clsx } from "clsx";
interface CartaMemoriaProps {
  simbolo: string;
  volteada: boolean;
  emparejada: boolean;
  onVoltear: () => void;
}

/** Una carta del minijuego: boca abajo (✦) o mostrando su símbolo. */
export default function CartaMemoria({ simbolo, volteada, emparejada, onVoltear }: CartaMemoriaProps) {
  const clases = clsx("memory-card", volteada && "is-flipped", emparejada && "is-matched");
  return (
    <button className={clases} type="button" aria-label={volteada ? simbolo : "Carta oculta"} onClick={onVoltear}>
      <span className="memory-card-inner">
        <span className="memory-face memory-front">✦</span>
        <span className="memory-face memory-back">{simbolo}</span>
      </span>
    </button>
  );
}
