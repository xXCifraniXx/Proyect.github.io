import { useCallback, useState } from "react";
import { Bajadas } from "./features/bajadas/index.ts";
import { Bienvenida, type EnlacesVisibles, Inicio } from "./features/inicio/index.ts";
import { Boveda, CARTA_CUMPLE, type CartaAbierta, type CartaBoveda, VentanaCarta } from "./features/boveda/index.ts";
import { CartaSorpresa } from "./features/carta/index.ts";
import { Cierre } from "./features/cierre/index.ts";
import { Constelacion } from "./features/constelacion/index.ts";
import { Cumpleanos } from "./features/cumple/index.ts";
import { Fondo, ProgresoScroll } from "./components/ui/index.ts";
import { Galeria } from "./features/galeria/index.ts";
import { MensajeDelMes, mensajeMesVigente } from "./features/mensaje-mes/index.ts";
import { Minijuego } from "./features/juego/index.ts";
import { Musica } from "./features/musica/index.ts";
import { TiempoJuntos } from "./features/tiempo/index.ts";
import { celebrar } from "./lib/confeti.ts";
import { ahora, ocurrencia } from "./lib/cumple.ts";

/*
  PÁGINA PRINCIPAL
  Cada sección vive en su carpeta de src/features y se junta aquí, en el
  mismo orden que la página.
*/
export default function App() {
  // Se calculan una vez al abrir la página.
  const [nota] = useState(mensajeMesVigente);
  const [cumple] = useState(ocurrencia);
  const esHoy = cumple?.estado === "hoy";

  const visibles: EnlacesVisibles = {
    mes: nota !== null,
    cumple: cumple?.estado === "hoy" || cumple?.estado === "despues"
  };

  // El día del cumpleaños, al entrar hay confeti.
  const alEntrar = () => {
    if (esHoy) setTimeout(celebrar, 300);
  };

  // Una sola ventana de carta para La Bóveda y el pastel de cumpleaños.
  const [abierta, setAbierta] = useState<CartaAbierta | null>(null);
  const abrirCarta = useCallback((carta: CartaAbierta) => {
    // Nunca se abre una carta antes de su fecha, venga de donde venga.
    if (carta.fecha > ahora()) return;
    setAbierta(carta);
  }, []);
  const cerrarCarta = useCallback(() => setAbierta(null), []);
  const abrirDesdeBoveda = useCallback(
    (item: CartaBoveda, texto: string) => abrirCarta({ ...item, texto }),
    [abrirCarta]
  );
  // Desde el pastel se abre sin el botón "Ir a soplar mis velas", que ya no tendría sentido.
  // (Copia local: así TypeScript sabe que dentro de la función no es null.)
  const cartaCumple = CARTA_CUMPLE;
  const abrirCartaCumple = cartaCumple ? () => abrirCarta({ ...cartaCumple, sinAccion: true }) : undefined;

  const seccionCumple = cumple && <Cumpleanos ocurrencia={cumple} onAbrirCarta={abrirCartaCumple} />;

  return (
    <>
      <ProgresoScroll />
      <Fondo />
      <Bienvenida onEntrar={alEntrar} />
      <div className="app-shell">
        <Inicio visibles={visibles} />
        <main>
          {nota && <MensajeDelMes nota={nota} />}
          {/* El día del cumpleaños, lo primero que ve es su sorpresa. */}
          {esHoy && seccionCumple}
          <CartaSorpresa />
          <Galeria />
          <TiempoJuntos />
          <Bajadas />
          <Musica />
          <Boveda onAbrir={abrirDesdeBoveda} />
          {!esHoy && seccionCumple}
          <Constelacion />
          <Minijuego />
          <Cierre />
        </main>
      </div>
      <VentanaCarta abierta={abierta} onCerrar={cerrarCarta} />
    </>
  );
}
