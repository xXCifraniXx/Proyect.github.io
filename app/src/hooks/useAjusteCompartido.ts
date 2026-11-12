import { useCallback, useEffect, useState } from "react";
import { cargarFirebase, NUBE, nubeActiva } from "../lib/firebase.ts";
import { esAjusteValido, type AjusteBajadas } from "../lib/rotacion.ts";

export interface AjusteCompartido {
  /** undefined mientras carga; null si no hay ajuste guardado para los dos. */
  ajuste: AjusteBajadas | null | undefined;
  guardar: (ajuste: AjusteBajadas) => Promise<void>;
  borrar: () => Promise<void>;
}

const RUTA = ["parejas", NUBE?.cieloId ?? "", "ajustes", "bajadas"] as const;

/**
 * Ajuste de bajadas guardado en Firestore (parejas/{id}/ajustes/bajadas).
 * Se actualiza en vivo: si uno lo cambia, al otro le llega al instante.
 * Las reglas de firestore.rules solo dejan escribir a los dos miembros.
 */
export function useAjusteCompartido(): AjusteCompartido {
  const [ajuste, setAjuste] = useState<AjusteBajadas | null | undefined>(nubeActiva ? undefined : null);

  useEffect(() => {
    if (!nubeActiva) return undefined;
    let cancelar: (() => void) | undefined;
    let vigente = true;
    void cargarFirebase().then(async ({ db }) => {
      const { doc, onSnapshot } = await import("firebase/firestore");
      if (!vigente) return;
      cancelar = onSnapshot(doc(db, ...RUTA), (snap) => {
        const dato: unknown = snap.exists() ? snap.data() : null;
        setAjuste(esAjusteValido(dato) ? dato : null);
      }, (error) => {
        console.warn("[bajadas] sin nube:", error);
        setAjuste(null);
      });
    }).catch((error: unknown) => {
      console.warn("[bajadas] sin nube:", error);
      setAjuste(null);
    });
    return () => {
      vigente = false;
      cancelar?.();
    };
  }, []);

  const guardar = useCallback(async (nuevo: AjusteBajadas) => {
    const { db } = await cargarFirebase();
    const { doc, setDoc } = await import("firebase/firestore");
    await setDoc(doc(db, ...RUTA), {
      proximaBajada: nuevo.proximaBajada,
      diasMina: Math.round(nuevo.diasMina),
      diasDescanso: Math.round(nuevo.diasDescanso),
      horaRegreso: nuevo.horaRegreso.slice(0, 5),
      actualizado: Date.now()
    });
  }, []);

  const borrar = useCallback(async () => {
    const { db } = await cargarFirebase();
    const { deleteDoc, doc } = await import("firebase/firestore");
    await deleteDoc(doc(db, ...RUTA));
  }, []);

  return { ajuste, guardar, borrar };
}
