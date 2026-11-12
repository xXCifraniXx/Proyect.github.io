import { useAhora } from "../../hooks/useAhora.ts";
import { CARTAS_BOVEDA } from "./boveda.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { RELOJ_CUMPLE } from "../../lib/cumple.ts";
import { CabeceraSeccion, Seccion } from "../../components/ui/index.ts";
import TarjetaBoveda from "./TarjetaBoveda.tsx";

/*
  LA BÓVEDA
  Cartas que se abren solas en su fecha. Antes se ven selladas con lo que
  falta; después se pueden abrir y leer. Revisa cada minuto por si una carta
  se desbloquea con la página abierta (reloj compartido, ver lib/reloj.ts).
*/
export default function Boveda() {
  const ahora = useAhora(RELOJ_CUMPLE);

  return (
    <Seccion id="boveda">
      <CabeceraSeccion etiqueta={TEXTOS.bovedaEyebrow} titulo={TEXTOS.bovedaTitle} intro={TEXTOS.bovedaIntro} />
      <div className="boveda-grid">
        {CARTAS_BOVEDA.length === 0 ? (
          <p className="boveda-empty">{TEXTOS.bovedaEmpty}</p>
        ) : (
          CARTAS_BOVEDA.map((item, i) => <TarjetaBoveda key={item.id} item={item} ahora={ahora} indice={i} />)
        )}
      </div>
    </Seccion>
  );
}
