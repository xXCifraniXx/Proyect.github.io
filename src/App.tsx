import { useMemo } from "react";
import { Bajadas } from "./features/bajadas/index.ts";
import { Bienvenida, type EnlacesVisibles, Inicio } from "./features/inicio/index.ts";
import { Boveda, ProveedorVentanaCarta } from "./features/boveda/index.ts";
import { CartaSorpresa } from "./features/carta/index.ts";
import { Cierre } from "./features/cierre/index.ts";
import { Constelacion } from "./features/constelacion/index.ts";
import { Cumpleanos } from "./features/cumple/index.ts";
import { Fondo, LimiteDeError, ProgresoScroll } from "./components/ui/index.ts";
import { Galeria } from "./features/galeria/index.ts";
import { MensajeDelMes, mensajeMesVigente } from "./features/mensaje-mes/index.ts";
import { Minijuego } from "./features/juego/index.ts";
import { Musica } from "./features/musica/index.ts";
import { TiempoJuntos } from "./features/tiempo/index.ts";
import { celebrar } from "./lib/confeti.ts";
import { useDia } from "./hooks/useAhora.ts";
import { ocurrenciaEn, RELOJ_CUMPLE } from "./lib/cumple.ts";

/*
  PÁGINA PRINCIPAL
  Cada sección vive en su carpeta de src/features y se junta aquí, en el
  mismo orden que la página.
*/
export default function App() {
  // Dependen del día: si la página queda abierta, cambian a medianoche
  // (por ejemplo, el mensaje del mes aparece solo el día 8).
  const dia = useDia(RELOJ_CUMPLE);
  const nota = useMemo(() => mensajeMesVigente(undefined, dia), [dia]);
  const cumple = useMemo(() => ocurrenciaEn(dia), [dia]);
  const esHoy = cumple?.estado === "hoy";

  const visibles: EnlacesVisibles = {
    mes: nota !== null,
    cumple: cumple?.estado === "hoy" || cumple?.estado === "despues"
  };

  // El día del cumpleaños, al entrar hay confeti.
  const alEntrar = () => {
    if (esHoy) setTimeout(celebrar, 300);
  };

  const seccionCumple = cumple && <Cumpleanos ocurrencia={cumple} />;

  // Una sola ventana de carta para La Bóveda y el pastel (ver features/boveda/ventanaCarta.ts).
  // Cada sección va dentro de un LimiteDeError: si una falla, las demás se siguen viendo.
  return (
    <ProveedorVentanaCarta>
      <ProgresoScroll />
      <Fondo />
      <LimiteDeError nombre="bienvenida">
        <Bienvenida onEntrar={alEntrar} />
      </LimiteDeError>
      <div className="app-shell">
        <LimiteDeError nombre="inicio">
          <Inicio visibles={visibles} />
        </LimiteDeError>
        <main>
          <LimiteDeError nombre="mensaje del mes">{nota && <MensajeDelMes nota={nota} />}</LimiteDeError>
          {/* El día del cumpleaños, lo primero que ve es su sorpresa. */}
          <LimiteDeError nombre="cumpleaños">{esHoy && seccionCumple}</LimiteDeError>
          <LimiteDeError nombre="carta">
            <CartaSorpresa />
          </LimiteDeError>
          <LimiteDeError nombre="galería">
            <Galeria />
          </LimiteDeError>
          <LimiteDeError nombre="tiempo">
            <TiempoJuntos />
          </LimiteDeError>
          <LimiteDeError nombre="bajadas">
            <Bajadas />
          </LimiteDeError>
          <LimiteDeError nombre="música">
            <Musica />
          </LimiteDeError>
          <LimiteDeError nombre="bóveda">
            <Boveda />
          </LimiteDeError>
          <LimiteDeError nombre="cumpleaños">{!esHoy && seccionCumple}</LimiteDeError>
          <LimiteDeError nombre="constelación">
            <Constelacion />
          </LimiteDeError>
          <LimiteDeError nombre="juego">
            <Minijuego />
          </LimiteDeError>
          <LimiteDeError nombre="cierre">
            <Cierre />
          </LimiteDeError>
        </main>
      </div>
    </ProveedorVentanaCarta>
  );
}
