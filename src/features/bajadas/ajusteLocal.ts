import { esAjusteValido, type AjusteBajadas } from "./rotacion.ts";

/*
  Ajuste de bajadas guardado solo en este dispositivo (cuando no hay sesión).
  La clave es la misma que usaba el sitio estático: no se cambia, para que
  no se pierdan los ajustes ya guardados en los celulares.
*/
const CLAVE = "roster-override-v1";

export function leerAjusteLocal(): AjusteBajadas | null {
  try {
    const crudo = localStorage.getItem(CLAVE);
    const dato: unknown = crudo ? JSON.parse(crudo) : null;
    return esAjusteValido(dato) ? dato : null;
  } catch {
    return null;
  }
}

export function guardarAjusteLocal(ajuste: AjusteBajadas): boolean {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(ajuste));
    return true;
  } catch {
    return false;
  }
}

export function borrarAjusteLocal(): void {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    /* modo privado */
  }
}
