import type { NubeConfig } from "../types/config.ts";

/*
  FIREBASE DEL SITIO (plan gratuito Spark)
  ----------------------------------------
  Lo usan dos partes:
    - la página del cielo (src/features/cielo): las estrellas compartidas;
    - las bajadas de mina (src/features/bajadas): el ajuste del calendario.
  Si "firebase" fuera null, las dos funcionan solo en cada dispositivo.
  Firebase se carga aparte (src/lib/firebase.ts), solo cuando se usa.

  Pasos (una sola vez), en https://console.firebase.google.com :
    1. Crear proyecto (Analytics no hace falta).
    2. Compilación → Firestore Database → Crear base de datos (modo producción).
    3. Pestaña "Reglas": pega el contenido de firestore.rules (raíz del repo) y publica.
    4. Authentication → Método de acceso → Google → Habilitar; y en
       Configuración → Dominios autorizados, agrega xxcifranixx.github.io.
    5. Configuración del proyecto → Tus apps → Web (</>) → registrar app.
       Copia el objeto firebaseConfig y pégalo abajo, en "firebase".

  Estos datos NO son secretos: Firebase está pensado para que vayan en la
  página. Lo que protege los datos son las reglas de firestore.rules.

  "cieloId" es el id de los dos (cielo y ajustes). Si lo cambias, cámbialo
  también en firestore.rules.

  QUIÉN PUEDE CAMBIAR LAS COSAS
  Cualquiera con el link puede mirar; poner o quitar estrellas y guardar las
  bajadas solo pueden las cuentas de Google cuyo UID esté en "miembros" (y en
  firestore.rules). Para sumar a alguien: que entre una vez con "Iniciar
  sesión", copia su UID de Firebase → Authentication → Usuarios y pégalo en
  los dos sitios.
*/
export const NUBE: NubeConfig = {
  cieloId: "nosotros-7f3k9q2m",
  // UID de las cuentas que pueden poner y quitar estrellas (iguales que en firestore.rules).
  miembros: [
    "Wi4gXbDEYTgsft4wiuhOvDLWhjo1", // Jorge
    "YDRuDgow9kck52TJY4P6ie8sbpe2" // Anthuanete
  ],
  // Proyecto de Firebase "Anthuanete" (app web "jya08").
  firebase: {
    apiKey: "AIzaSyCNP0nIW55Q6bMlBfB4l24V3atesR_N5gI",
    authDomain: "anthuanete-6d629.firebaseapp.com",
    projectId: "anthuanete-6d629",
    storageBucket: "anthuanete-6d629.firebasestorage.app",
    messagingSenderId: "1094632300755",
    appId: "1:1094632300755:web:b6f15a9a7ed6e4a6343426"
  }
};
