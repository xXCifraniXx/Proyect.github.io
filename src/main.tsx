import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { LimiteDeError, PaginaConError } from "./components/ui/index.ts";
import { NOMBRES } from "./lib/contenido.ts";
import { estadoCumple } from "./lib/cumple.ts";

document.title = `Para ${NOMBRES.novia} | Una carta de ${NOMBRES.autor}`;
if (estadoCumple() === "hoy") document.body.classList.add("is-birthday");

const raiz = document.getElementById("root");
if (!raiz) throw new Error('Falta <div id="root"> en index.html');

createRoot(raiz).render(
  <StrictMode>
    <LimiteDeError nombre="página" respaldo={<PaginaConError />}>
      <App />
    </LimiteDeError>
  </StrictMode>
);
