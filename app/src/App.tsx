import { useState } from "react";
import Bajadas from "./components/Bajadas.tsx";
import Bienvenida from "./components/Bienvenida.tsx";
import CartaSorpresa from "./components/CartaSorpresa.tsx";
import Cumpleanos from "./components/Cumpleanos.tsx";
import Fondo from "./components/Fondo.tsx";
import Galeria from "./components/Galeria.tsx";
import Inicio from "./components/Inicio.tsx";
import MensajeDelMes from "./components/MensajeDelMes.tsx";
import type { EnlacesVisibles } from "./components/Menu.tsx";
import Musica from "./components/Musica.tsx";
import ProgresoScroll from "./components/ProgresoScroll.tsx";
import TiempoJuntos from "./components/TiempoJuntos.tsx";
import { celebrar } from "./lib/confeti.ts";
import { ocurrencia } from "./lib/cumple.ts";
import { mensajeMesVigente } from "./lib/mensajeMes.ts";

/*
  PÁGINA PRINCIPAL
  Cada parte del sitio es un componente (un archivo por componente en
  src/components). Durante la migración se van sumando las secciones una a una.
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

  const seccionCumple = cumple && <Cumpleanos ocurrencia={cumple} />;

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
          {!esHoy && seccionCumple}
        </main>
      </div>
    </>
  );
}
