import { useState } from "react";
import { CabeceraSeccion, Seccion } from "../../components/ui/index.ts";
import { useDia } from "../../hooks/useAhora.ts";
import { CONFIG, TEXTOS } from "../../lib/contenido.ts";
import { RELOJ_CUMPLE } from "../../lib/cumple.ts";
import { formatoFechaLarga } from "../../lib/fechas.ts";
import { rellenar } from "../../lib/rellenar.ts";
import { useVentanaCarta } from "../boveda/index.ts";
import { armarPuertas, estadoPuerta, guardarAbiertas, leerAbiertas, puertaDeHoy, type Puerta } from "./adviento.ts";
import PuertaCalendario from "./PuertaCalendario.tsx";

// Sin año en config/adviento.ts, el del celular.
const ANIO = CONFIG.adviento?.anio ?? new Date().getFullYear();
// Se arman una vez: cada puerta es siempre el mismo objeto (como las cartas de La Bóveda).
const PUERTAS = armarPuertas(ANIO);

/*
  CALENDARIO DE ADVIENTO (página /adviento)
  24 puertas, del 1 al 24 de diciembre. Cada una se abre desde las 00:00 de
  su día y muestra su sorpresa en la ventana de carta (la de La Bóveda), con
  la misma regla: nunca antes de su fecha. Si la página queda abierta, la
  puerta nueva se habilita sola a medianoche (useDia).
*/
export default function Adviento() {
  const ahora = useDia(RELOJ_CUMPLE);
  const { abrir } = useVentanaCarta();
  const [abiertas, setAbiertas] = useState(() => leerAbiertas(ANIO));
  const hoy = puertaDeHoy(ANIO, ahora);
  const primera = PUERTAS[0].item.fecha;

  const alAbrir = (puerta: Puerta) => {
    abrir(puerta.item);
    if (abiertas.has(puerta.dia)) return;
    const nuevas = new Set(abiertas).add(puerta.dia);
    setAbiertas(nuevas);
    guardarAbiertas(ANIO, nuevas);
  };

  let aviso: string | null = null;
  if (ahora < primera) aviso = rellenar(TEXTOS.advientoPrimera, { fecha: formatoFechaLarga(primera) });
  else if (hoy !== null) aviso = rellenar(TEXTOS.advientoHoy, { dia: hoy });

  return (
    <Seccion id="adviento">
      <CabeceraSeccion etiqueta={TEXTOS.advientoEyebrow} titulo={TEXTOS.advientoTitle} intro={TEXTOS.advientoIntro} />
      <div className="adviento-card glass-soft">
        {aviso && <p className="adviento-aviso">{aviso}</p>}
        <ol className="adviento-puertas" aria-label={TEXTOS.ariaPuertasAdviento}>
          {PUERTAS.map((puerta) => (
            <li key={puerta.dia}>
              <PuertaCalendario
                puerta={puerta}
                estado={estadoPuerta(puerta, ahora, abiertas)}
                esHoy={puerta.dia === hoy}
                onAbrir={alAbrir}
              />
            </li>
          ))}
        </ol>
      </div>
    </Seccion>
  );
}
