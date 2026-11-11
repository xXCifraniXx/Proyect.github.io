/*
  SINCRONIZACIÓN DE LA CONSTELACIÓN CON FIREBASE (Firestore + inicio de sesión)
  Solo se activa si nube-config.js tiene la configuración de Firebase.
  estrellas.js dibuja y guarda en el dispositivo; este archivo:
    - escucha el cielo compartido y se lo pasa a estrellas.js en tiempo real;
    - deja crear y borrar estrellas solo a las cuentas de "miembros"
      (iniciando sesión con Google); cualquiera con el link puede mirarlo;
    - envía cada estrella nueva o borrada (window.CieloSync);
    - la primera vez que un miembro entra desde un dispositivo, sube las
      estrellas que ese dispositivo tenía guardadas antes de la nube.
*/
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const cfg = window.CIELO_CONFIG || {};
const miembros = Array.isArray(cfg.miembros) ? cfg.miembros : [];
const authBtn = document.getElementById("authBtn");

function setEstado(value) {
  window.Cielo?.estado(value);
}

function aviso(texto) {
  window.Cielo?.aviso(texto);
}

function fail(error) {
  console.warn("[constelación] sin nube:", error);
  if (error && error.code === "permission-denied") {
    aviso("Esta cuenta no puede cambiar el cielo. Entra con la cuenta de uno de los dos.");
    return;
  }
  setEstado("error");
}

// ----- estrellas de antes de la nube (se guardan aparte hasta subirlas) -----
const migratedKey = `constelacion-migrada-${cfg.cieloId}`;
const pendingKey = `constelacion-pendientes-${cfg.cieloId}`;

function leer(key) {
  try { return localStorage.getItem(key); } catch (_) { return null; }
}
function escribir(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch (_) { /* modo privado */ }
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
  const col = fs.collection(db, "cielos", cfg.cieloId, "estrellas");
  const toDoc = (s) => ({ x: s.x, y: s.y, label: s.label || "", born: Math.round(s.born || Date.now()) });

  let user = null;
  const puedeEditar = () => !!user && miembros.includes(user.uid);

  window.CieloSync = {
    puedeEditar,
    avisarSesion() {
      if (!user) {
        aviso("Inicia sesión con Google para poner o quitar estrellas ✦");
        authBtn?.classList.add("primary");
      } else if (!puedeEditar()) {
        aviso(`Con ${user.email || "esta cuenta"} puedes mirar el cielo, pero no cambiarlo.`);
      }
    },
    add: (s) => fs.setDoc(fs.doc(col, s.id), toDoc(s)).catch(fail),
    remove: (s) => fs.deleteDoc(fs.doc(col, s.id)).catch(fail),
    clear: (list) => {
      const batch = fs.writeBatch(db);
      list.forEach((s) => batch.delete(fs.doc(col, s.id)));
      return batch.commit().catch(fail);
    }
  };

  // ----- botón de sesión -----
  function pintarBoton() {
    if (!authBtn) return;
    authBtn.hidden = false;
    if (user) {
      const nombre = (user.displayName || user.email || "").split(" ")[0];
      authBtn.textContent = nombre ? `Salir (${nombre})` : "Cerrar sesión";
      authBtn.title = user.email || "";
      authBtn.classList.remove("primary");
    } else {
      authBtn.textContent = "Iniciar sesión";
      authBtn.title = "Entrar con Google para poner estrellas";
    }
  }

  authBtn?.addEventListener("click", async () => {
    if (user) {
      await au.signOut(auth);
      return;
    }
    try {
      await au.signInWithPopup(auth, new au.GoogleAuthProvider());
    } catch (error) {
      const code = error && error.code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      if (code === "auth/popup-blocked") {
        aviso("El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo otra vez.");
        return;
      }
      console.warn("[constelación] no se pudo iniciar sesión:", error);
      aviso("No se pudo iniciar sesión. Inténtalo otra vez en un momento.");
    }
  });

  // ----- subida inicial: una vez por dispositivo y solo para miembros -----
  // Así no se pierden las estrellas creadas antes de activar la nube, y no
  // reaparecen después las que el otro borre. Hasta subirlas se guardan
  // aparte, porque el cielo compartido reemplaza al local al conectarse.
  let migrated = leer(migratedKey) === "1";
  if (!migrated && leer(pendingKey) == null) {
    escribir(pendingKey, JSON.stringify(window.Cielo?.locales() || []));
  }
  let remoteIds = null;

  function migrar() {
    if (migrated || !remoteIds || !puedeEditar()) return;
    let pendientes = [];
    try { pendientes = JSON.parse(leer(pendingKey) || "[]"); } catch (_) { pendientes = []; }
    pendientes.filter((s) => s && s.id && !remoteIds.has(s.id)).forEach((s) => window.CieloSync.add(s));
    escribir(migratedKey, "1");
    escribir(pendingKey, null);
    migrated = true;
  }

  au.onAuthStateChanged(auth, (u) => {
    user = u;
    pintarBoton();
    if (user && !puedeEditar()) window.CieloSync.avisarSesion();
    migrar();
  });

  let first = true;
  fs.onSnapshot(col, { includeMetadataChanges: true }, (snap) => {
    const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (first && !snap.metadata.fromCache) {
      first = false;
      remoteIds = new Set(remote.map((s) => s.id));
      migrar();
    }

    // Mientras no haya respondido el servidor, no se toca el cielo local.
    if (first) return;
    window.Cielo?.reemplazar(remote);
    setEstado(snap.metadata.fromCache ? "offline" : "online");
  }, fail);
}

if (cfg.firebase && cfg.firebase.apiKey && cfg.cieloId && window.Cielo) {
  start().catch(fail);
}
