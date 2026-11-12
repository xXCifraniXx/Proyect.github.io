import { describe, expect, it } from "vitest";
import "../../../assets/js/config.js";
import { abrirSello, sellar } from "./sello.ts";

// Junta todos los "mensajeSellado" del contenido real (Bóveda, mensajes del mes, cumpleaños).
function sellosDe(valor: unknown, ruta = "config"): [string, string][] {
  if (!valor || typeof valor !== "object") return [];
  return Object.entries(valor).flatMap(([clave, hijo]): [string, string][] =>
    clave === "mensajeSellado" && typeof hijo === "string" ? [[ruta, hijo]] : sellosDe(hijo, `${ruta}.${clave}`)
  );
}

describe("sello", () => {
  it("sella y abre el mismo texto, con salt distinto cada vez", async () => {
    const texto = "Hola unu, con tildes y emojis 💜";
    const a = await sellar(texto);
    const b = await sellar(texto);
    expect(a).toMatch(/^v1\.[^.]+\.[^.]+\.[^.]+$/);
    expect(a).not.toBe(b);
    expect(await abrirSello(a)).toBe(texto);
  });

  it("rechaza formatos desconocidos y sellos alterados", async () => {
    await expect(abrirSello("v2.a.b.c")).rejects.toThrow("formato");
    const sello = await sellar("texto");
    const partes = sello.split(".");
    partes[3] = btoa("otra cosa cualquiera");
    await expect(abrirSello(partes.join("."))).rejects.toThrow();
  });

  // Comprueba que las cartas reales se pueden abrir, sin guardar ni mostrar su texto.
  it("abre todas las cartas selladas de config.js", { timeout: 30000 }, async () => {
    const sellos = sellosDe(window.APP_CONFIG);
    expect(sellos.length).toBeGreaterThan(0);
    for (const [ruta, sello] of sellos) {
      const texto = await abrirSello(sello).catch(() => "");
      expect(texto.length, `no se pudo abrir ${ruta}`).toBeGreaterThan(0);
    }
  });

  it("ninguna carta de config.js está en texto plano", () => {
    const cfg = window.APP_CONFIG;
    const cartas = [...(cfg?.boveda?.cartas ?? []), ...(cfg?.mensajesMes ?? []), cfg?.cumpleanos?.carta];
    for (const carta of cartas) expect(carta?.mensaje ?? "").toBe("");
  });
});
