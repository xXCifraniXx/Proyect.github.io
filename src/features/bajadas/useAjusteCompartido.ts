import { useCallback, useState } from "react";
import type { Firestore } from "firebase/firestore";
import { useSuscripcionFirestore } from "../../hooks/useSuscripcionFirestore.ts";
import { conFirestore, NUBE, nubeActiva, type ModuloFirestore } from "../../lib/firebase.ts";
import { esAjusteValido, type AjusteBajadas } from "./rotacion.ts";

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

  const sinNube = useCallback((error: unknown) => {
    console.warn("[bajadas] sin nube:", error);
    setAjuste(null);
  }, []);

  const suscribir = useCallback(
    (db: Firestore, { doc, onSnapshot }: ModuloFirestore) =>
      onSnapshot(
        doc(db, ...RUTA),
        (snap) => {
          const dato: unknown = snap.exists() ? snap.data() : null;
          setAjuste(esAjusteValido(dato) ? dato : null);
        },
        sinNube
      ),
    [sinNube]
  );
  useSuscripcionFirestore(suscribir, sinNube);

  const guardar = useCallback(
    (nuevo: AjusteBajadas) =>
      conFirestore((db, { doc, setDoc }) =>
        setDoc(doc(db, ...RUTA), {
          proximaBajada: nuevo.proximaBajada,
          diasMina: Math.round(nuevo.diasMina),
          diasDescanso: Math.round(nuevo.diasDescanso),
          horaRegreso: nuevo.horaRegreso.slice(0, 5),
          actualizado: Date.now()
        })
      ),
    []
  );

  const borrar = useCallback(() => conFirestore((db, { deleteDoc, doc }) => deleteDoc(doc(db, ...RUTA))), []);

  return { ajuste, guardar, borrar };
}
