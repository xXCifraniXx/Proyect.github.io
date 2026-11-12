/*
  TIPOS DEL CONTENIDO (assets/js/config.js)
  Describen la forma de window.APP_CONFIG. Si agregas una clave nueva en
  config.js y la usas en un componente, súmala aquí para que TypeScript la
  conozca.
*/

/** Todas las frases del sitio, por clave (welcomeTitle, navCarta…). */
export type Textos = Record<string, string>;

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
  textosHoy?: Textos;
}

export interface Opciones {
  corazones?: number;
  calendarioDesdeHoy?: boolean;
}

export interface Config {
  nombres?: Nombres;
  fechas?: Fechas;
  rotacionMina?: RotacionMina;
  textos?: Textos;
  lineaTiempo?: FotoDelMes[];
  mensajesMes?: Carta[];
  musica?: Musica;
  boveda?: { cartas?: Carta[] };
  juego?: { parejas?: string[] };
  cumpleanos?: Cumpleanos;
  opciones?: Opciones;
}

/** Configuración de Firebase (assets/js/nube-config.js). */
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

declare global {
  interface Window {
    /** Lo define assets/js/config.js al cargarse. */
    APP_CONFIG?: Config;
    /** Lo define assets/js/nube-config.js al cargarse. */
    CIELO_CONFIG?: NubeConfig;
  }
}
