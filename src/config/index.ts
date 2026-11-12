/*
  CONTENIDO DEL SITIO
  -------------------
  Todo lo que se puede editar sin tocar el código vive en esta carpeta:

    textos.ts      todas las frases de la página
    meses.ts       la foto de cada mes y el mensaje de cada mesiversario
    boveda.ts      las cartas de La Bóveda
    cumpleanos.ts  fecha de nacimiento, carta y textos del día del cumpleaños
    general.ts     nombres, fechas, rotación de mina, canción, juego y opciones
    firebase.ts    proyecto de Firebase y cuentas que pueden cambiar cosas

  Las fotos y la canción van en public/assets/images y public/assets/audio,
  y aquí se escriben como "assets/images/…" y "assets/audio/…".
*/
import type { Config } from "../types/config.ts";
import { boveda } from "./boveda.ts";
import { cumpleanos } from "./cumpleanos.ts";
import { fechas, juego, musica, nombres, opciones, rotacionMina } from "./general.ts";
import { lineaTiempo, mensajesMes } from "./meses.ts";
import { textos } from "./textos.ts";

export const CONFIG: Config = {
  nombres,
  fechas,
  rotacionMina,
  textos,
  lineaTiempo,
  mensajesMes,
  musica,
  boveda,
  juego,
  cumpleanos,
  opciones
};
