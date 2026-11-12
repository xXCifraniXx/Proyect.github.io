/*
  FIREBASE (plan gratuito Spark)
  ------------------------------
  La configuración sigue en assets/js/nube-config.js (la misma que el sitio
  actual). Firebase se carga recién cuando una sección lo pide (import()
  dinámico), así no pesa en la primera carga de la página.
*/
import "../../../assets/js/nube-config.js";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

export const NUBE = window.CIELO_CONFIG ?? null;

/** true si nube-config.js tiene un proyecto de Firebase configurado. */
export const nubeActiva = !!(NUBE?.firebase?.apiKey && NUBE.cieloId);

export const esMiembro = (uid: string | null | undefined): boolean => !!uid && (NUBE?.miembros ?? []).includes(uid);

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
