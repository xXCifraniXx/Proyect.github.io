import { useAhora } from "../hooks/useAhora.ts";
import { CARTAS_BOVEDA, type CartaBoveda } from "../lib/boveda.ts";
import { TEXTOS } from "../lib/contenido.ts";
import { ahora as ahoraCumple } from "../lib/cumple.ts";
import CabeceraSeccion from "./CabeceraSeccion.tsx";
import Seccion from "./Seccion.tsx";
import TarjetaBoveda from "./TarjetaBoveda.tsx";

interface BovedaProps {
  onAbrir: (item: CartaBoveda, texto: string) => void;
}

/*
  LA BÓVEDA
  Cartas que se abren solas en su fecha. Antes se ven selladas con lo que
  falta; después se pueden abrir y leer. Revisa cada minuto por si una carta
  se desbloquea con la página abierta.
*/
export default function Boveda({ onAbrir }: BovedaProps) {
  const ahora = useAhora(60000, ahoraCumple);

  return (
    <Seccion id="boveda">
      <CabeceraSeccion etiqueta={TEXTOS.bovedaEyebrow} titulo={TEXTOS.bovedaTitle} intro={TEXTOS.bovedaIntro} />
      <div className="boveda-grid">
        {CARTAS_BOVEDA.length === 0 ? (
          <p className="boveda-empty">{TEXTOS.bovedaEmpty || "Pronto habrá cartas esperándote aquí 💌"}</p>
        ) : (
          CARTAS_BOVEDA.map((item, i) => (
            <TarjetaBoveda key={item.id} item={item} ahora={ahora} indice={i} onAbrir={onAbrir} />
          ))
        )}
      </div>
    </Seccion>
  );
}
