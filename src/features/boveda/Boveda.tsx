import { useAhora } from "../../hooks/useAhora.ts";
import { CARTAS_BOVEDA, type Recuerdo } from "./boveda.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { RELOJ_CUMPLE } from "../../lib/cumple.ts";
import { CabeceraSeccion, Seccion } from "../../components/ui/index.ts";
import TarjetaBoveda from "./TarjetaBoveda.tsx";
import TarjetaRecuerdo from "./TarjetaRecuerdo.tsx";

interface BovedaProps {
  /** Lo que ya pasó y se puede volver a ver (lo arma App según la fecha). */
  recuerdos?: Recuerdo[];
}

/*
  LA BÓVEDA
  Cartas que se abren solas en su fecha. Antes se ven selladas con lo que
  falta; después se pueden abrir y leer. Revisa cada minuto por si una carta
  se desbloquea con la página abierta (reloj compartido, ver lib/reloj.ts).
  Debajo, los recuerdos: el cumpleaños y el adviento cuando ya pasaron.
*/
export default function Boveda({ recuerdos = [] }: BovedaProps) {
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
      {recuerdos.length > 0 && (
        <>
          <h3 className="boveda-subtitulo">{TEXTOS.bovedaRecuerdos}</h3>
          <div className="boveda-grid">
            {recuerdos.map((recuerdo, i) => (
              <TarjetaRecuerdo key={recuerdo.id} recuerdo={recuerdo} estilo={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        </>
      )}
    </Seccion>
  );
}
