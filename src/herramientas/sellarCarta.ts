/*
  HERRAMIENTA PARA SELLAR CARTAS (herramientas/sellar-carta.html)
  Sella un texto con el mismo cifrado que usa la página (lib/sello.ts) y abre
  un sello existente para leerlo o corregirlo. Nada sale del navegador.
*/
import { abrirSello, sellar } from "../lib/sello.ts";

const porId = <T extends HTMLElement>(id: string): T => {
  const elemento = document.getElementById(id);
  if (!elemento) throw new Error(`Falta #${id} en sellar-carta.html`);
  return elemento as T;
};

const entrada = porId<HTMLTextAreaElement>("entrada");
const salida = porId<HTMLTextAreaElement>("salida");
const estado = porId<HTMLParagraphElement>("estado");

porId("sellar").addEventListener("click", async () => {
  const texto = entrada.value;
  if (!texto.trim()) {
    estado.textContent = "Primero escribe la carta.";
    return;
  }
  try {
    const sello = await sellar(texto);
    // Comprobación: el sello se vuelve a abrir antes de dártelo.
    if ((await abrirSello(sello)) !== texto) throw new Error("La comprobación falló.");
    salida.value = sello;
    estado.textContent = "Listo. Copia el resultado en src/config/.";
  } catch (error) {
    estado.textContent = `No se pudo sellar: ${error instanceof Error ? error.message : String(error)}`;
  }
});

porId("abrir").addEventListener("click", async () => {
  const sello = salida.value.trim().replace(/^"|"$/g, "");
  if (!sello) {
    estado.textContent = "Pega primero el mensajeSellado en el cuadro de resultado.";
    return;
  }
  try {
    entrada.value = await abrirSello(sello);
    estado.textContent = "Sello abierto. Edita el texto y vuelve a sellarlo.";
  } catch {
    estado.textContent = "Ese texto no es un sello válido.";
  }
});

porId("copiar").addEventListener("click", async () => {
  if (!salida.value) return;
  try {
    await navigator.clipboard.writeText(salida.value);
    estado.textContent = "Copiado.";
  } catch {
    salida.select();
    estado.textContent = "Selecciona el texto y cópialo con Ctrl+C.";
  }
});
