import { useState } from "react";
import Bajadas from "./components/Bajadas.tsx";
import Bienvenida from "./components/Bienvenida.tsx";
import CartaSorpresa from "./components/CartaSorpresa.tsx";
import Fondo from "./components/Fondo.tsx";
import Galeria from "./components/Galeria.tsx";
import Inicio from "./components/Inicio.tsx";
import MensajeDelMes from "./components/MensajeDelMes.tsx";
import type { EnlacesVisibles } from "./components/Menu.tsx";
import ProgresoScroll from "./components/ProgresoScroll.tsx";
import TiempoJuntos from "./components/TiempoJuntos.tsx";
import { estadoCumple } from "./lib/cumple.ts";
import { mensajeMesVigente } from "./lib/mensajeMes.ts";

/*
  PÁGINA PRINCIPAL
  Cada parte del sitio es un componente (un archivo por componente en
  src/components). Durante la migración se van sumando las secciones una a una.
*/
export default function App() {
  // Se calcula una vez al abrir la página.
  const [nota] = useState(mensajeMesVigente);
  const cumple = estadoCumple();
  const visibles: EnlacesVisibles = {
    mes: nota !== null,
    cumple: cumple === "hoy" || cumple === "despues"
  };

  return (
    <>
      <ProgresoScroll />
      <Fondo />
      <Bienvenida />
      <div className="app-shell">
        <Inicio visibles={visibles} />
        <main>
          {nota && <MensajeDelMes nota={nota} />}
          <CartaSorpresa />
          <Galeria />
          <TiempoJuntos />
          <Bajadas />
        </main>
      </div>
    </>
  );
}
