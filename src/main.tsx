import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Nunito, la letra del sitio, guardada aquí (@fontsource-variable/nunito,
// licencia OFL): no se pide nada a Google. Con ?tema=rosa no se usa y no se descarga.
import "@fontsource-variable/nunito/wght.css";
import "@fontsource-variable/nunito/wght-italic.css";
import "./styles/index.css";
import App from "./App.tsx";
import { LimiteDeError, PaginaConError } from "./components/ui/index.ts";
import { ahora, estadoCumple } from "./lib/cumple.ts";
import { esNavidad } from "./lib/navidad.ts";
import { corregirLink } from "./features/navegacion/index.ts";

// Antes de dibujar: un link viejo (/#boveda) pasa a su página (/boveda).
corregirLink();
if (estadoCumple() === "hoy") document.body.classList.add("is-birthday");
// En diciembre, el fondo navideño (lib/navidad.ts): el día del cumpleaños gana el suyo.
else if (esNavidad(ahora())) document.body.classList.add("is-navidad");

const raiz = document.getElementById("root");
if (!raiz) throw new Error('Falta <div id="root"> en index.html');

createRoot(raiz).render(
  <StrictMode>
    <LimiteDeError nombre="página" respaldo={<PaginaConError />}>
      <App />
    </LimiteDeError>
  </StrictMode>
);
