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
}

export interface Cancion {
  titulo?: string;
  artista?: string;
  src?: string;
}

export interface Musica {
  volumenInicial?: number;
  cancion?: Cancion;
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
