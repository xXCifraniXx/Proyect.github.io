import { useCallback, useState } from "react";
import Bajadas from "./components/Bajadas.tsx";
import Bienvenida from "./components/Bienvenida.tsx";
import Boveda from "./components/Boveda.tsx";
import CartaSorpresa from "./components/CartaSorpresa.tsx";
import Cierre from "./components/Cierre.tsx";
import Constelacion from "./components/Constelacion.tsx";
import Cumpleanos from "./components/Cumpleanos.tsx";
import Fondo from "./components/Fondo.tsx";
import Galeria from "./components/Galeria.tsx";
import Inicio from "./components/Inicio.tsx";
import MensajeDelMes from "./components/MensajeDelMes.tsx";
import Minijuego from "./components/Minijuego.tsx";
import type { EnlacesVisibles } from "./components/Menu.tsx";
import Musica from "./components/Musica.tsx";
import ProgresoScroll from "./components/ProgresoScroll.tsx";
import TiempoJuntos from "./components/TiempoJuntos.tsx";
import VentanaCarta from "./components/VentanaCarta.tsx";
import { CARTA_CUMPLE, type CartaAbierta, type CartaBoveda } from "./lib/boveda.ts";
import { celebrar } from "./lib/confeti.ts";
import { ahora, ocurrencia } from "./lib/cumple.ts";
import { mensajeMesVigente } from "./lib/mensajeMes.ts";

/*
  PÁGINA PRINCIPAL
  Cada parte del sitio es un componente (un archivo por componente en
  src/components), en el mismo orden que la página.
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
  const abrirDesdeBoveda = useCallback((item: CartaBoveda, texto: string) => abrirCarta({ ...item, texto }), [abrirCarta]);
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
