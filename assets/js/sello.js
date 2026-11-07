/*
  SELLO DE CARTAS
  ---------------
  Cifra y descifra el texto de las cartas de La Bóveda (AES-GCM, Web Crypto).
  Así el mensaje no se puede leer a simple vista en config.js ni en el código
  de la página antes de su fecha: app.js solo lo descifra cuando la carta ya
  está desbloqueada.

  Ojo: es un sitio sin servidor, así que la clave tiene que viajar con la
  página. Esto evita que se lea la carta mirando el código, pero alguien con
  conocimientos técnicos podría descifrarla a propósito.

  Para sellar una carta nueva abre herramientas/sellar-carta.html, pega el
  texto y copia el resultado en "mensajeSellado" dentro de config.js.
*/
(() => {
  "use strict";

  const CLAVE = "boveda-anthu-jorge-v1";
  const ITERACIONES = 150000;
  const VERSION = "v1";

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const toB64 = (bytes) => {
    let binary = "";
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary);
  };
  const fromB64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

  const disponible = () => !!(window.crypto && window.crypto.subtle);

  async function derivarClave(salt) {
    const base = await crypto.subtle.importKey("raw", encoder.encode(CLAVE), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: ITERACIONES, hash: "SHA-256" },
      base,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function sellar(texto) {
    if (!disponible()) throw new Error("Este navegador no permite cifrar (abre la página por https o localhost).");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await derivarClave(salt);
    const cifrado = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(String(texto)));
    return [VERSION, toB64(salt), toB64(iv), toB64(new Uint8Array(cifrado))].join(".");
  }

  async function abrir(sello) {
    if (!disponible()) throw new Error("Web Crypto no disponible");
    const [version, salt, iv, datos] = String(sello || "").split(".");
    if (version !== VERSION || !salt || !iv || !datos) throw new Error("Sello con formato desconocido");
    const key = await derivarClave(fromB64(salt));
    const plano = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(iv) }, key, fromB64(datos));
    return decoder.decode(plano);
  }

  window.Sello = { sellar, abrir, disponible };
})();
