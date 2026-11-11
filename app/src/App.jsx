import Bienvenida from "./componentes/Bienvenida.jsx";
import { Fondo, ProgresoScroll } from "./componentes/Fondo.jsx";
import Inicio from "./componentes/Inicio.jsx";
import { estadoCumple } from "./lib/cumple.js";
import { mensajeMesVigente } from "./lib/mensajeMes.js";

/*
  PÁGINA PRINCIPAL
  Cada parte del sitio es un componente. Durante la migración se van sumando
  las secciones una a una (fase 1: bienvenida, menú y carta).
*/
export default function App() {
  const cumple = estadoCumple();
  const visibles = {
    mes: !!mensajeMesVigente(),
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
