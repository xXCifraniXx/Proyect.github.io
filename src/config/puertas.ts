import type { PuertaAdviento } from "../types/config.ts";

/* -------------------------------------------------------------------------
   PUERTAS DEL CALENDARIO DE ADVIENTO (ver adviento.ts)
   Una por día, del 1 al 24 de diciembre. Cada puerta es como una carta de
   La Bóveda:

     {
       dia: 1,
       icono: "⭐",
       titulo: "Un título corto",
       mensajeSellado: "v1.…",                      ← el texto, sellado
       foto: "assets/images/adviento/01.webp",      ← opcional
       accion: { destino: "boveda", etiqueta: "Abrir tu carta de Navidad 🎄" }  ← opcional
     }

   - El texto va SIEMPRE sellado: escríbelo en herramientas/sellar-carta.html,
     pulsa "Sellar" y copia el resultado en "mensajeSellado".
   - La foto (opcional) va en public/assets/images/adviento/, mejor en .webp de
     unos 1080 px. No se cifra: no se ve ni se descarga antes del día, pero el
     archivo está publicado.
   - "borrador: true" = la puerta se ve cerrada y no se abre, aunque haya
     llegado su día. Quítalo cuando tenga su texto sellado.
   - Si falta un día, su puerta se ve como borrador.

   Este archivo se descarga solo al abrir la página del calendario: así los
   24 mensajes sellados no pesan en la primera carga del sitio.
------------------------------------------------------------------------- */
export const puertas: PuertaAdviento[] = [
  { dia: 1, icono: "⭐", borrador: true, mensaje: "" },
  { dia: 2, icono: "🎄", borrador: true, mensaje: "" },
  { dia: 3, icono: "❄️", borrador: true, mensaje: "" },
  { dia: 4, icono: "🍪", borrador: true, mensaje: "" },
  { dia: 5, icono: "🎁", borrador: true, mensaje: "" },
  { dia: 6, icono: "🕯️", borrador: true, mensaje: "" },
  { dia: 7, icono: "💌", borrador: true, mensaje: "" },
  { dia: 8, icono: "💜", borrador: true, mensaje: "" },
  { dia: 9, icono: "☕", borrador: true, mensaje: "" },
  { dia: 10, icono: "🌙", borrador: true, mensaje: "" },
  { dia: 11, icono: "🎶", borrador: true, mensaje: "" },
  { dia: 12, icono: "🧣", borrador: true, mensaje: "" },
  { dia: 13, icono: "✨", borrador: true, mensaje: "" },
  { dia: 14, icono: "🦌", borrador: true, mensaje: "" },
  { dia: 15, icono: "🍫", borrador: true, mensaje: "" },
  { dia: 16, icono: "📷", borrador: true, mensaje: "" },
  { dia: 17, icono: "🌟", borrador: true, mensaje: "" },
  { dia: 18, icono: "🎀", borrador: true, mensaje: "" },
  { dia: 19, icono: "🧸", borrador: true, mensaje: "" },
  { dia: 20, icono: "🔔", borrador: true, mensaje: "" },
  { dia: 21, icono: "🌠", borrador: true, mensaje: "" },
  { dia: 22, icono: "💝", borrador: true, mensaje: "" },
  { dia: 23, icono: "🎅", borrador: true, mensaje: "" },
  { dia: 24, icono: "🎄", borrador: true, mensaje: "" }
];
