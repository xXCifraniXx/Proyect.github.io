import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../features/cielo/cielo.css";
import { apartarPendientes, PaginaCielo } from "../features/cielo/index.ts";
import { nubeActiva } from "../lib/firebase.ts";
// Directo y no desde components/ui/index.ts: ese índice también trae piezas
// que cargan todo el contenido de la página principal (cartas incluidas), y
// el cielo no lo necesita.
import LimiteDeError from "../components/ui/LimiteDeError.tsx";
import PaginaConError from "../components/ui/PaginaConError.tsx";

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
    <LimiteDeError nombre="cielo" respaldo={<PaginaConError />}>
      <PaginaCielo />
    </LimiteDeError>
  </StrictMode>
);
