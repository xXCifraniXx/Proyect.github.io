import { useEffect } from "react";
import type { Firestore } from "firebase/firestore";
import { cargarFirebase, nubeActiva, type ModuloFirestore } from "../lib/firebase.ts";

/**
 * Escucha algo de Firestore en vivo mientras el componente está en pantalla.
 * Se encarga de lo que repetían las bajadas y el cielo: cargar Firebase
 * aparte, no suscribirse si el componente ya se fue, cortar la escucha al
 * salir y avisar si no hay nube.
 *
 * "suscribir" y "alFallar" deben ser funciones estables (useCallback o
 * definidas fuera del componente); si cambian, la escucha se reinicia.
 * Sin Firebase configurado no hace nada.
 */
export function useSuscripcionFirestore(
  suscribir: (db: Firestore, firestore: ModuloFirestore) => () => void,
  alFallar: (error: unknown) => void
): void {
  useEffect(() => {
    if (!nubeActiva) return undefined;
    let cancelar: (() => void) | undefined;
    let vigente = true;
    void cargarFirebase()
      .then(async ({ db }) => {
        const firestore = await import("firebase/firestore");
        if (vigente) cancelar = suscribir(db, firestore);
      })
      .catch((error: unknown) => {
        if (vigente) alFallar(error);
      });
    return () => {
      vigente = false;
      cancelar?.();
    };
  }, [suscribir, alFallar]);
}
