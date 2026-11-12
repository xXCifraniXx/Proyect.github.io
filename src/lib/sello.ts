/*
  SELLO DE CARTAS
  ---------------
  Cifra y descifra el texto de las cartas (AES-GCM con Web Crypto). Es el
  formato que usa herramientas/sellar-carta.html (que importa este archivo):
  "v1.<salt>.<iv>.<datos>" en base64.

  Es un sitio sin servidor, así que la clave viaja con la página: esto evita
  que la carta se lea mirando el código, no a alguien que quiera descifrarla.
*/
const CLAVE = "boveda-anthu-jorge-v1";
const ITERACIONES = 150000;
const VERSION = "v1";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toB64 = (bytes: Uint8Array): string => {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
};
const fromB64 = (text: string): Uint8Array<ArrayBuffer> => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

export const selloDisponible = (): boolean => !!globalThis.crypto?.subtle;

async function derivarClave(salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", encoder.encode(CLAVE), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERACIONES, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function sellar(texto: string): Promise<string> {
  if (!selloDisponible()) throw new Error("Este navegador no permite cifrar (abre la página por https o localhost).");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await derivarClave(salt);
  const cifrado = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(texto));
  return [VERSION, toB64(salt), toB64(iv), toB64(new Uint8Array(cifrado))].join(".");
}

export async function abrirSello(sello: string): Promise<string> {
  if (!selloDisponible()) throw new Error("Web Crypto no disponible");
  const [version, salt, iv, datos] = sello.split(".");
  if (version !== VERSION || !salt || !iv || !datos) throw new Error("Sello con formato desconocido");
  const key = await derivarClave(fromB64(salt));
  const plano = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(iv) }, key, fromB64(datos));
  return decoder.decode(plano);
}
