import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Los mismos estilos que la constelación actual.
import "../../../constelacion/estrellas.css";
import PaginaCielo from "../components/cielo/PaginaCielo.tsx";
import { apartarPendientes } from "../lib/cielo/migracion.ts";
import { nubeActiva } from "../lib/firebase.ts";

/*
  ARRANQUE DE LA PÁGINA DEL CIELO (constelacion/index.html)
  Antes de conectarse a Firebase se apartan las estrellas que este
  dispositivo tenía guardadas, para subirlas cuando entre uno de los dos.
*/
if (nubeActiva) apartarPendientes();

const raiz = document.getElementById("cielo");
if (!raiz) throw new Error('Falta <div id="cielo"> en constelacion/index.html');

createRoot(raiz).render(
  <StrictMode>
    <PaginaCielo />
  </StrictMode>
);
