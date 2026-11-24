import { useAhora } from "../../hooks/useAhora.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { CuentaRegresiva } from "../../components/ui/index.ts";

/** Cuenta regresiva para volver a verse (solo sin rotación de mina y con una fecha fija). Cambia cada segundo. */
export default function TarjetaRegreso({ objetivo }: { objetivo: Date }) {
  const ahora = useAhora();
  return (
    <div className="return-card">
      <div>
        <span className="eyebrow small">{TEXTOS.countdownEyebrow}</span>
        <h3>{TEXTOS.returnTitle}</h3>
        <p>{TEXTOS.returnText}</p>
      </div>
      <CuentaRegresiva objetivo={objetivo} ahora={ahora} className="return-grid" />
    </div>
  );
}
