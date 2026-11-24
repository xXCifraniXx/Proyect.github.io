/*
  TIPOS DEL CONTENIDO (src/config/)
  Describen la forma del contenido del sitio. Si agregas una clave nueva en
  src/config/ y la usas en un componente, súmala aquí para que TypeScript la
  conozca.
*/

import type { textos } from "../config/textos.ts";

/** Nombre de cada frase del sitio (welcomeTitle, navCarta…), sacado de src/config/textos.ts. */
export type ClaveTexto = keyof typeof textos;

/** Todas las frases del sitio, por clave. */
export type Textos = Record<ClaveTexto, string>;

export interface Nombres {
  novia?: string;
  autor?: string;
}

export interface Fechas {
  /** Desde cuándo están juntos, "AAAA-MM-DDTHH:MM:SS". */
  inicioRelacion?: string;
  /** Cuenta regresiva fija de regreso, o null. */
  regreso?: string | null;
}

export interface RotacionMina {
  activa?: boolean;
  /** Un día en que subió a mina, "AAAA-MM-DDTHH:MM:SS". */
  salidaBase?: string;
  diasMina?: number;
  diasDescanso?: number;
  /** Hora de bajada, "HH:MM". */
  horaRegreso?: string;
  horaSalida?: string;
  mesesAMostrar?: number;
}

export interface FotoDelMes {
  /** "AAAA-MM". */
  mes: string;
  titulo?: string;
  src?: string;
  texto?: string;
}

/** Botón dentro de una carta que lleva a otra sección. */
export interface AccionCarta {
  destino: string;
  etiqueta: string;
}

/** Carta de La Bóveda (o mensaje del mes): texto normal o sellado. */
export interface Carta {
  fecha: string;
  icono?: string;
  titulo?: string;
  mensaje?: string;
  /** Texto cifrado con herramientas/sellar-carta.html. */
  mensajeSellado?: string;
  /** Oculta la carta hasta que tenga texto. */
  borrador?: boolean;
  accion?: AccionCarta;
  /** Foto que se ve al abrirla, "assets/images/…" (la usan las puertas del adviento). */
  foto?: string;
}

/** Calendario de adviento: de qué año son las puertas y cuándo se ve la página. */
export interface Adviento {
  /** Año de las puertas: se abren del 1 al 24 de diciembre de ese año. */
  anio: number;
  /** Desde cuándo se ve la página (y su enlace), "AAAA-MM-DDTHH:MM:SS". */
  desde: string;
  /** Hasta cuándo, sin incluirlo, "AAAA-MM-DDTHH:MM:SS". */
  hasta: string;
}

/** Una puerta del calendario de adviento: una carta corta (con foto, si quieres) para un día. */
export interface PuertaAdviento extends Omit<Carta, "fecha"> {
  /** Día de diciembre, del 1 al 24: la puerta se abre a las 00:00 de ese día. */
  dia: number;
}

export interface Cancion {
  titulo?: string;
  artista?: string;
  src?: string;
}

export interface Musica {
  volumenInicial?: number;
  /** En orden: la primera suena al tocar ▶; al terminar una, la siguiente. */
  canciones?: Cancion[];
}

export interface Cumpleanos {
  activo?: boolean;
  /** "AAAA-MM-DD". */
  nacimiento?: string;
  diasAntes?: number;
  diasDespues?: number;
  velas?: number;
  carta?: Omit<Carta, "fecha">;
  /** Frases que reemplazan a las normales el día del cumpleaños. */
  textosHoy?: Partial<Textos>;
}

export interface Opciones {
  corazones?: number;
  calendarioDesdeHoy?: boolean;
  /** En diciembre, fondo navideño (nieve y luces de Navidad). Si falta, sí. */
  fondoNavidad?: boolean;
}

export interface Boveda {
  cartas?: Carta[];
}

export interface Juego {
  /** Emojis; cada uno se duplica para formar un par. */
  parejas?: string[];
}

export interface Config {
  nombres?: Nombres;
  fechas?: Fechas;
  rotacionMina?: RotacionMina;
  textos?: Textos;
  lineaTiempo?: FotoDelMes[];
  mensajesMes?: Carta[];
  musica?: Musica;
  boveda?: Boveda;
  juego?: Juego;
  cumpleanos?: Cumpleanos;
  opciones?: Opciones;
  /** Las puertas no van aquí: están en config/puertas.ts y se cargan con su página. */
  adviento?: Adviento;
}

/** Configuración de Firebase (src/config/firebase.ts). */
export interface NubeConfig {
  /** Id de la pareja: el cielo y los ajustes viven bajo este nombre. */
  cieloId: string;
  /** UID de las cuentas de Google que pueden cambiar cosas. */
  miembros?: string[];
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId: string;
  } | null;
}
