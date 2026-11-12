import { useCallback, useEffect, useState } from "react";
import type { EstrellaGuardada } from "../lib/cielo/estrellas.ts";
import { cargarFirebase, NUBE, nubeActiva } from "../lib/firebase.ts";

/**
 * Estado de la conexión del cielo:
 * local (sin Firebase), conectando, online, offline (se enviará al volver)
 * o error (sin nube: se guarda solo en este dispositivo).
 */
export type EstadoNube = "local" | "conectando" | "online" | "offline" | "error";

export interface CieloCompartido {
  estado: EstadoNube;
  /** Estrellas del cielo compartido; null hasta que responde el servidor. */
  remotas: EstrellaGuardada[] | null;
  agregar: (estrella: EstrellaGuardada) => Promise<void>;
  quitar: (estrella: EstrellaGuardada) => Promise<void>;
  vaciar: (estrellas: EstrellaGuardada[]) => Promise<void>;
}

const RUTA = ["cielos", NUBE?.cieloId ?? "", "estrellas"] as const;

/*
  Cielo compartido en Firestore (cielos/{id}/estrellas, una estrella por
  documento). Se escucha en vivo: lo que pone uno le aparece al otro. Las
  reglas solo dejan escribir a los dos miembros.
*/
export function useCieloCompartido(): CieloCompartido {
  const [estado, setEstado] = useState<EstadoNube>(nubeActiva ? "conectando" : "local");
  const [remotas, setRemotas] = useState<EstrellaGuardada[] | null>(null);

  useEffect(() => {
    if (!nubeActiva) return undefined;
    let cancelar: (() => void) | undefined;
    let vigente = true;
    let respondioServidor = false;

    void cargarFirebase().then(async ({ db }) => {
      const { collection, onSnapshot } = await import("firebase/firestore");
      if (!vigente) return;
      cancelar = onSnapshot(collection(db, ...RUTA), { includeMetadataChanges: true }, (snap) => {
        if (!snap.metadata.fromCache) respondioServidor = true;
        // Mientras no haya respondido el servidor, no se toca el cielo local.
        if (!respondioServidor) return;
        setRemotas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EstrellaGuardada, "id">) })));
        setEstado(snap.metadata.fromCache ? "offline" : "online");
      }, (error) => {
        console.warn("[constelación] sin nube:", error);
        setEstado("error");
      });
    }).catch((error: unknown) => {
      console.warn("[constelación] sin nube:", error);
      setEstado("error");
    });

    return () => {
      vigente = false;
      cancelar?.();
    };
  }, []);

  const agregar = useCallback(async (s: EstrellaGuardada) => {
    const { db } = await cargarFirebase();
    const { doc, setDoc } = await import("firebase/firestore");
    await setDoc(doc(db, ...RUTA, s.id), { x: s.x, y: s.y, label: s.label, born: Math.round(s.born) });
  }, []);

  const quitar = useCallback(async (s: EstrellaGuardada) => {
    const { db } = await cargarFirebase();
    const { deleteDoc, doc } = await import("firebase/firestore");
    await deleteDoc(doc(db, ...RUTA, s.id));
  }, []);

  const vaciar = useCallback(async (lista: EstrellaGuardada[]) => {
    const { db } = await cargarFirebase();
    const { doc, writeBatch } = await import("firebase/firestore");
    const lote = writeBatch(db);
    lista.forEach((s) => lote.delete(doc(db, ...RUTA, s.id)));
    await lote.commit();
  }, []);

  return { estado, remotas, agregar, quitar, vaciar };
}
