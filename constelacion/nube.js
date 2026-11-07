/*
  SINCRONIZACIÓN DE LA CONSTELACIÓN CON FIREBASE (Firestore)
  Solo se activa si nube-config.js tiene la configuración de Firebase.
  estrellas.js dibuja y guarda en el dispositivo; este archivo:
    - escucha el cielo compartido y se lo pasa a estrellas.js en tiempo real;
    - envía cada estrella nueva o borrada (window.CieloSync);
    - la primera vez sube las estrellas que ya había en este dispositivo.
*/
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const cfg = window.CIELO_CONFIG || {};

function setEstado(value) {
  window.Cielo?.estado(value);
}

function fail(error) {
  console.warn("[constelación] sin nube:", error);
  setEstado("error");
}

async function start() {
  const [{ initializeApp }, fs] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-firestore.js`)
  ]);

  const app = initializeApp(cfg.firebase);
  const db = fs.getFirestore(app);
  const col = fs.collection(db, "cielos", cfg.cieloId, "estrellas");
  const toDoc = (s) => ({ x: s.x, y: s.y, label: s.label || "", born: Math.round(s.born || Date.now()) });

  window.CieloSync = {
    add: (s) => fs.setDoc(fs.doc(col, s.id), toDoc(s)).catch(fail),
    remove: (s) => fs.deleteDoc(fs.doc(col, s.id)).catch(fail),
    clear: (list) => {
      const batch = fs.writeBatch(db);
      list.forEach((s) => batch.delete(fs.doc(col, s.id)));
      return batch.commit().catch(fail);
    }
  };

  // Subida inicial, una sola vez por dispositivo: así no se pierden las
  // estrellas creadas antes de activar la nube (y no reaparecen después
  // las que el otro borre).
  const migratedKey = `constelacion-migrada-${cfg.cieloId}`;
  let migrated = false;
  try { migrated = localStorage.getItem(migratedKey) === "1"; } catch (_) { /* modo privado */ }
  let first = true;

  fs.onSnapshot(col, { includeMetadataChanges: true }, (snap) => {
    const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (first && !snap.metadata.fromCache) {
      first = false;
      if (!migrated) {
        const ids = new Set(remote.map((s) => s.id));
        const missing = (window.Cielo?.locales() || []).filter((s) => !ids.has(s.id));
        missing.forEach((s) => window.CieloSync.add(s));
        remote.push(...missing);
        try { localStorage.setItem(migratedKey, "1"); } catch (_) { /* modo privado */ }
        migrated = true;
      }
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
