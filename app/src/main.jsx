import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Los mismos estilos que el sitio actual.
import "../../assets/css/styles.css";
import { NOMBRES } from "./contenido.js";
import { estadoCumple } from "./lib/cumple.js";
import App from "./App.jsx";

document.title = `Para ${NOMBRES.novia} | Una carta de ${NOMBRES.autor}`;
if (estadoCumple() === "hoy") document.body.classList.add("is-birthday");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
