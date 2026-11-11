import Bienvenida from "./components/Bienvenida.tsx";
import Fondo from "./components/Fondo.tsx";
import Inicio from "./components/Inicio.tsx";
import type { EnlacesVisibles } from "./components/Menu.tsx";
import ProgresoScroll from "./components/ProgresoScroll.tsx";
import { estadoCumple } from "./lib/cumple.ts";
import { mensajeMesVigente } from "./lib/mensajeMes.ts";

/*
  PÁGINA PRINCIPAL
  Cada parte del sitio es un componente (un archivo por componente en
  src/components). Durante la migración se van sumando las secciones una a una.
*/
export default function App() {
  const cumple = estadoCumple();
  const visibles: EnlacesVisibles = {
    mes: mensajeMesVigente() !== null,
    cumple: cumple === "hoy" || cumple === "despues"
  };

  return (
    <>
      <ProgresoScroll />
      <Fondo />
      <Bienvenida />
      <div className="app-shell">
        <Inicio visibles={visibles} />
        <main />
      </div>
    </>
  );
}
