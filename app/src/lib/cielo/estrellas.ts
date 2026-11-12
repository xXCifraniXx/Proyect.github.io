/*
  ESTRELLAS DE LA CONSTELACIÓN
  Datos y guardado en el dispositivo. Usa las mismas claves de localStorage
  que el sitio actual, así un cielo guardado en una versión se ve en la otra.
*/

/** Una estrella como se guarda (en el dispositivo y en Firestore). */
export interface EstrellaGuardada {
  id: string;
  /** Posición de 0 a 1 respecto del ancho y alto de la pantalla. */
  x: number;
  y: number;
  label: string;
  /** Cuándo se creó (ms). Las líneas unen las estrellas en este orden. */
  born: number;
}

/** Una estrella lista para dibujar: con su "seed", que da su ritmo de brillo. */
export interface Estrella extends EstrellaGuardada {
  seed: number;
}

export const CLAVE_LOCAL = "constelacion-nosotros-v1";
export const MAX_ETIQUETA = 60;

export const nuevoId = (born: number): string =>
  `s${Math.round(born).toString(36)}${Math.random().toString(36).slice(2, 8)}`;

// Brillo estable a partir del id (siempre el mismo para la misma estrella),
// así no hay que guardarlo ni sortearlo en cada render.
function semilla(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0) % 1000;
}

const esEstrella = (s: unknown): s is Partial<EstrellaGuardada> & { x: number; y: number } =>
  !!s && typeof (s as EstrellaGuardada).x === "number" && typeof (s as EstrellaGuardada).y === "number";

/** Limpia una lista que viene de afuera (localStorage o Firestore). */
export function normalizar(lista: unknown[], ordenar = false): Estrella[] {
  const estrellas = lista.filter(esEstrella).map((s) => {
    const born = Number(s.born) || 0;
    const id = typeof s.id === "string" && s.id ? s.id : nuevoId(born || Date.now());
    return { id, x: s.x, y: s.y, label: String(s.label ?? "").slice(0, MAX_ETIQUETA), born, seed: semilla(id) };
  });
  return ordenar ? estrellas.sort((a, b) => a.born - b.born) : estrellas;
}

export const paraGuardar = (s: EstrellaGuardada): EstrellaGuardada => ({ id: s.id, x: s.x, y: s.y, label: s.label, born: s.born });

export function leerLocales(): Estrella[] {
  try {
    const crudo = localStorage.getItem(CLAVE_LOCAL);
    const datos: unknown = crudo ? JSON.parse(crudo) : [];
    return Array.isArray(datos) ? normalizar(datos) : [];
  } catch {
    return [];
  }
}

export function guardarLocales(estrellas: EstrellaGuardada[]): void {
  try {
    localStorage.setItem(CLAVE_LOCAL, JSON.stringify(estrellas.map(paraGuardar)));
  } catch { /* modo privado */ }
}

/** Crea una estrella en una posición (0..1), sin pegarla a los bordes. */
export function crearEstrella(pos: { x: number; y: number }, etiqueta: string): Estrella {
  const born = Date.now();
  const id = nuevoId(born);
  return {
    id,
    x: Math.max(0.02, Math.min(0.98, pos.x)),
    y: Math.max(0.06, Math.min(0.96, pos.y)),
    label: etiqueta.trim().slice(0, MAX_ETIQUETA),
    born,
    seed: semilla(id)
  };
}
