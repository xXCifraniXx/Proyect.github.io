import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/estrellas.css";
import { apartarPendientes, PaginaCielo } from "../features/cielo/index.ts";
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
