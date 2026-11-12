/*
  FIREBASE (plan gratuito Spark)
  ------------------------------
  La configuración está en src/config/firebase.ts. Firebase se carga recién
  cuando una sección lo pide (import() dinámico), así no pesa en la primera
  carga de la página.
*/
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { NUBE } from "../config/firebase.ts";

export { NUBE };

/** true si src/config/firebase.ts tiene un proyecto de Firebase configurado. */
export const nubeActiva = !!(NUBE?.firebase?.apiKey && NUBE.cieloId);

export const esMiembro = (uid: string | null | undefined): boolean => !!uid && (NUBE?.miembros ?? []).includes(uid);

/** El módulo "firebase/firestore" (se carga aparte, con import()). */
export type ModuloFirestore = typeof import("firebase/firestore");

export interface Servicios {
  db: Firestore;
  auth: Auth;
}

let servicios: Promise<Servicios> | null = null;

/** Firestore y Auth listos para usar (se inicializan una sola vez). */
export function cargarFirebase(): Promise<Servicios> {
  if (!nubeActiva || !NUBE?.firebase) return Promise.reject(new Error("Firebase no está configurado"));
  const firebaseConfig = NUBE.firebase;
  servicios ??= (async () => {
    const [{ initializeApp }, { getFirestore }, { getAuth }] = await Promise.all([
      import("firebase/app"),
      import("firebase/firestore"),
      import("firebase/auth")
    ]);
    const app = initializeApp(firebaseConfig);
    return { db: getFirestore(app), auth: getAuth(app) };
  })();
  return servicios;
}

/** Para escribir: Firestore listo y el módulo "firebase/firestore" cargado. */
export async function conFirestore<T>(usar: (db: Firestore, firestore: ModuloFirestore) => Promise<T>): Promise<T> {
  const { db } = await cargarFirebase();
  return usar(db, await import("firebase/firestore"));
}
