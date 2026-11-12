import { useCallback, useRef, useState } from "react";
import type { Firestore } from "firebase/firestore";
import type { EstrellaGuardada } from "./estrellas.ts";
import { useSuscripcionFirestore } from "../../hooks/useSuscripcionFirestore.ts";
import { conFirestore, NUBE, nubeActiva, type ModuloFirestore } from "../../lib/firebase.ts";

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

  // Mientras no haya respondido el servidor, no se toca el cielo local.
  const respondioServidor = useRef(false);

  const sinNube = useCallback((error: unknown) => {
    console.warn("[constelación] sin nube:", error);
    setEstado("error");
  }, []);

  const suscribir = useCallback(
    (db: Firestore, { collection, onSnapshot }: ModuloFirestore) =>
      onSnapshot(
        collection(db, ...RUTA),
        { includeMetadataChanges: true },
        (snap) => {
          if (!snap.metadata.fromCache) respondioServidor.current = true;
          if (!respondioServidor.current) return;
          setRemotas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EstrellaGuardada, "id">) })));
          setEstado(snap.metadata.fromCache ? "offline" : "online");
        },
        sinNube
      ),
    [sinNube]
  );
  useSuscripcionFirestore(suscribir, sinNube);

  const agregar = useCallback(
    (s: EstrellaGuardada) =>
      conFirestore((db, { doc, setDoc }) =>
        setDoc(doc(db, ...RUTA, s.id), { x: s.x, y: s.y, label: s.label, born: Math.round(s.born) })
      ),
    []
  );

  const quitar = useCallback(
    (s: EstrellaGuardada) => conFirestore((db, { deleteDoc, doc }) => deleteDoc(doc(db, ...RUTA, s.id))),
    []
  );

  const vaciar = useCallback(
    (lista: EstrellaGuardada[]) =>
      conFirestore((db, { doc, writeBatch }) => {
        const lote = writeBatch(db);
        lista.forEach((s) => lote.delete(doc(db, ...RUTA, s.id)));
        return lote.commit();
      }),
    []
  );

  return { estado, remotas, agregar, quitar, vaciar };
}
