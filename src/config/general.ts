import type { Fechas, Juego, Musica, Nombres, Opciones, RotacionMina } from "../types/config.ts";

export const nombres: Nombres = {
  novia: "Anthuanete",
  autor: "Jorge"
};

export const fechas: Fechas = {
  // Fecha real desde la que están juntos.
  inicioRelacion: "2026-03-08T00:00:00",
  // Fecha de regreso. Deja null si no quieres cuenta regresiva.
  regreso: null
};

// Turno 14 x 7 (sección "Bajada"). Deja activa: false para ocultarla.
//
// salidaBase = un día en que subió a mina (día 1 del ciclo). El patrón 14x7
// se recalcula desde ahí. Para reprogramar rápido está el editor de la propia
// página ("Ajustar bajadas de mina"), pero ese ajuste vive solo en el
// navegador donde se hace; para dejarlo fijo en el link, cambia salidaBase.
//
// Actual: bajó el jueves 27/08, así la bajada cae el jueves 10/09 y luego
// sigue el 14x7 normal (01/10, 22/10, ...).
export const rotacionMina: RotacionMina = {
  activa: true,
  salidaBase: "2026-08-27T08:00:00",
  diasMina: 14,
  diasDescanso: 7,
  horaRegreso: "21:00",
  mesesAMostrar: 1
};

/* -------------------------------------------------------------------------
   MÚSICA
   Las canciones, en orden: la primera suena al tocar ▶ y, al terminar una,
   empieza la siguiente (después de la última, otra vez la primera). Con más
   de una, en la barra sale ⏭ para pasar a la que sigue.
   Cada canción se baja recién cuando le toca sonar, así que sumar más no
   hace más pesada la página. Para agregar una: copia el archivo (.mp3 o
   .m4a; mejor si pesa unos 2 MB) a public/assets/audio y suma aquí su
   titulo, artista y src.
------------------------------------------------------------------------- */
export const musica: Musica = {
  volumenInicial: 0.24,
  canciones: [
    {
      titulo: "The First Time",
      artista: "Damiano David",
      src: "assets/audio/the-first-time.mp3"
    }
  ]
};

/* -------------------------------------------------------------------------
   MINIJUEGO (Memory Match)
   "parejas": lista de emojis; cada uno se duplica para formar un par.
   Usa entre 4 y 8 para un tablero cómodo.
------------------------------------------------------------------------- */
export const juego: Juego = {
  parejas: ["💌", "🌙", "🌟", "🎧", "🌻", "🪐"]
};

export const opciones: Opciones = {
  // Cuántos corazones flotan en el fondo (en diciembre, cuántos copos de nieve caen).
  corazones: 18,
  // true = el calendario abre en el mes actual.
  calendarioDesdeHoy: true,
  // true = todo diciembre el fondo es navideño: nieve y luces de Navidad.
  // Para verlo antes: ?fondo=navidad en el link.
  fondoNavidad: true
};
