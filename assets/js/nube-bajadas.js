/*
  BAJADAS DE MINA COMPARTIDAS (Firestore + inicio de sesión)
  Solo se activa si assets/js/nube-config.js tiene la configuración de Firebase.
  - Escucha el ajuste de bajadas guardado en la nube y avisa a app.js con el
    evento "bajadas:nube" (detail: { ajuste }), para que el calendario lo use
    en todos los dispositivos.
  - Expone window.BajadasNube con guardar(), borrar() y puedeGuardar(): solo
    las cuentas de "miembros" (sesión de Google) pueden cambiarlo.
  - Pinta en el panel "Ajustar bajadas de mina" quién inició sesión y el botón
    para entrar o salir.
  La sesión es la misma que en la constelación (mismo sitio).
*/
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const cfg = window.CIELO_CONFIG || {};
const miembros = Array.isArray(cfg.miembros) ? cfg.miembros : [];

const cuenta = document.getElementById("rosterAccount");
const cuentaTexto = document.getElementById("rosterAccountText");
const cuentaBtn = document.getElementById("rosterAccountBtn");

function avisar(ajuste) {
  window.dispatchEvent(new CustomEvent("bajadas:nube", { detail: { ajuste } }));
}

async function start() {
  const [{ initializeApp }, fs, au] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-firestore.js`),
    import(`${SDK}/firebase-auth.js`)
  ]);

  const app = initializeApp(cfg.firebase);
  const db = fs.getFirestore(app);
  const auth = au.getAuth(app);
  const ref = fs.doc(db, "parejas", cfg.cieloId, "ajustes", "bajadas");

  let user = null;
  const puedeGuardar = () => !!user && miembros.includes(user.uid);

  window.BajadasNube = {
    puedeGuardar,
    guardar: (ajuste) => fs.setDoc(ref, {
      proximaBajada: String(ajuste.proximaBajada),
      diasMina: Math.round(Number(ajuste.diasMina)),
      diasDescanso: Math.round(Number(ajuste.diasDescanso)),
      horaRegreso: String(ajuste.horaRegreso).slice(0, 5),
      actualizado: Date.now()
    }),
    borrar: () => fs.deleteDoc(ref)
  };

  function pintarCuenta() {
    if (!cuenta) return;
    cuenta.hidden = false;
    if (!user) {
      cuentaTexto.textContent = "Inicia sesión para que el cambio se vea en los dos celulares.";
      cuentaBtn.textContent = "Iniciar sesión";
    } else if (puedeGuardar()) {
      const nombre = (user.displayName || user.email || "").split(" ")[0];
      cuentaTexto.textContent = `Con sesión de ${nombre}: los cambios se guardan para los dos.`;
      cuentaBtn.textContent = "Salir";
    } else {
      cuentaTexto.textContent = `Con ${user.email || "esta cuenta"} los cambios se guardan solo en este dispositivo.`;
      cuentaBtn.textContent = "Salir";
    }
  }

  cuentaBtn?.addEventListener("click", async () => {
    if (user) {
      await au.signOut(auth);
      return;
    }
    try {
      await au.signInWithPopup(auth, new au.GoogleAuthProvider());
    } catch (error) {
      const code = error && error.code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      cuentaTexto.textContent = code === "auth/popup-blocked"
        ? "El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo otra vez."
        : "No se pudo iniciar sesión. Inténtalo otra vez en un momento.";
      console.warn("[bajadas] no se pudo iniciar sesión:", error);
    }
  });

  au.onAuthStateChanged(auth, (u) => {
    user = u;
    pintarCuenta();
  });

  fs.onSnapshot(ref, (snap) => {
    avisar(snap.exists() ? snap.data() : null);
  }, (error) => {
    console.warn("[bajadas] sin nube:", error);
  });
}

if (cfg.firebase && cfg.firebase.apiKey && cfg.cieloId) {
  start().catch((error) => console.warn("[bajadas] sin nube:", error));
}
