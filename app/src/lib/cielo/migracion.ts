import { NUBE } from "../firebase.ts";
import { leerLocales, paraGuardar, type EstrellaGuardada } from "./estrellas.ts";

/*
  ESTRELLAS DE ANTES DE LA NUBE
  La primera vez que uno de los dos entra desde un dispositivo, se suben las
  estrellas que ese dispositivo tenía guardadas antes de compartir el cielo.
  Hasta entonces se guardan aparte, porque el cielo compartido reemplaza al
  local al conectarse. Mismas claves que el sitio actual.
*/
const id = NUBE?.cieloId ?? "";
const CLAVE_MIGRADA = `constelacion-migrada-${id}`;
const CLAVE_PENDIENTES = `constelacion-pendientes-${id}`;

function leer(clave: string): string | null {
  try { return localStorage.getItem(clave); } catch { return null; }
}
function escribir(clave: string, valor: string | null) {
  try {
    if (valor === null) localStorage.removeItem(clave);
    else localStorage.setItem(clave, valor);
  } catch { /* modo privado */ }
}

export const yaMigrado = (): boolean => leer(CLAVE_MIGRADA) === "1";

/** Se llama al abrir la página, antes de conectarse: aparta las estrellas locales. */
export function apartarPendientes(): void {
  if (yaMigrado() || leer(CLAVE_PENDIENTES) !== null) return;
  escribir(CLAVE_PENDIENTES, JSON.stringify(leerLocales().map(paraGuardar)));
}

/** Las estrellas apartadas que todavía no están en el cielo compartido. */
export function pendientesQueFaltan(idsRemotos: Set<string>): EstrellaGuardada[] {
  try {
    const lista: unknown = JSON.parse(leer(CLAVE_PENDIENTES) ?? "[]");
    if (!Array.isArray(lista)) return [];
    return (lista as EstrellaGuardada[]).filter((s) => s && typeof s.id === "string" && !idsRemotos.has(s.id));
  } catch {
    return [];
  }
}

export function marcarMigrado(): void {
  escribir(CLAVE_MIGRADA, "1");
  escribir(CLAVE_PENDIENTES, null);
}
