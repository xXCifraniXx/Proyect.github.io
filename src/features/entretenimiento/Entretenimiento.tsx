import { LimiteDeError } from "../../components/ui/index.ts";
import { Constelacion } from "../constelacion/index.ts";
import { Minijuego } from "../juego/index.ts";

/*
  ENTRETENIMIENTO
  La constelación y el minijuego en una sola página (antes tenían una cada
  uno). Cada parte va en su LimiteDeError: si una falla, la otra se sigue
  viendo. Los links viejos /cielo y /juego llegan aquí, a su parte.
*/
export default function Entretenimiento() {
  return (
    <>
      <LimiteDeError nombre="constelación">
        <Constelacion />
      </LimiteDeError>
      <LimiteDeError nombre="juego">
        <Minijuego />
      </LimiteDeError>
    </>
  );
}
