import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { cargarFirebase, esMiembro, nubeActiva } from "../../lib/firebase.ts";

export interface Sesion {
  /** false mientras se pregunta a Firebase si ya hay sesión. */
  lista: boolean;
  usuario: User | null;
  /** true si la cuenta es de uno de los dos (puede cambiar cosas). */
  miembro: boolean;
  /** Mensaje para mostrar si no se pudo iniciar sesión. */
  error: string | null;
  entrar: () => Promise<void>;
  salir: () => Promise<void>;
}

/** Sesión de Google compartida por toda la página (y por la constelación). */
export function useSesion(): Sesion {
  const [lista, setLista] = useState(false);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nubeActiva) return undefined;
    let cancelar: (() => void) | undefined;
    let vigente = true;
    void cargarFirebase().then(async ({ auth }) => {
      const { onAuthStateChanged } = await import("firebase/auth");
      if (!vigente) return;
      cancelar = onAuthStateChanged(auth, (u) => {
        setUsuario(u);
        setLista(true);
      });
    });
    return () => {
      vigente = false;
      cancelar?.();
    };
  }, []);

  const entrar = useCallback(async () => {
    setError(null);
    try {
      const { auth } = await cargarFirebase();
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      setError(
        code === "auth/popup-blocked"
          ? "El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo otra vez."
          : "No se pudo iniciar sesión. Inténtalo otra vez en un momento."
      );
    }
  }, []);

  const salir = useCallback(async () => {
    const { auth } = await cargarFirebase();
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  }, []);

  return { lista, usuario, miembro: esMiembro(usuario?.uid), error, entrar, salir };
}
