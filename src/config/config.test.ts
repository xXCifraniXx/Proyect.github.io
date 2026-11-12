/*
  TEST DEL CONTENIDO (src/config)
  Revisa lo que es fácil romper al editar a mano: fechas mal escritas, fotos o
  canción que no están en public/, cartas sin sellar y cuentas de Firebase que
  no coinciden con firestore.rules.
*/
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { NUBE } from "./firebase.ts";
import { CONFIG } from "./index.ts";

const RAIZ = resolve(import.meta.dirname, "..", "..");
const enPublic = (ruta: string) => existsSync(resolve(RAIZ, "public", ruta));
const fechaValida = (texto: string | null | undefined) => !!texto && !Number.isNaN(new Date(texto).getTime());
const FECHA_HORA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

describe("fechas", () => {
  it("inicioRelacion, salidaBase y nacimiento tienen el formato correcto", () => {
    expect(CONFIG.fechas?.inicioRelacion).toMatch(FECHA_HORA);
    expect(CONFIG.rotacionMina?.salidaBase).toMatch(FECHA_HORA);
    expect(CONFIG.rotacionMina?.horaRegreso).toMatch(/^\d{2}:\d{2}$/);
    expect(CONFIG.cumpleanos?.nacimiento).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(fechaValida(CONFIG.fechas?.inicioRelacion)).toBe(true);
    expect(fechaValida(CONFIG.rotacionMina?.salidaBase)).toBe(true);
  });
});

describe("meses (foto de cada mes)", () => {
  const fotos = CONFIG.lineaTiempo ?? [];

  it("cada mes es AAAA-MM, sin repetidos y en orden", () => {
    const meses = fotos.map((f) => f.mes);
    for (const mes of meses) expect(mes).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
    expect(new Set(meses).size).toBe(meses.length);
    expect([...meses].sort()).toEqual(meses);
  });

  it("todas las fotos existen en public/", () => {
    for (const foto of fotos) if (foto.src) expect(enPublic(foto.src), foto.src).toBe(true);
  });
});

describe("cartas (Bóveda, mensajes del mes y cumpleaños)", () => {
  const cartas = [...(CONFIG.boveda?.cartas ?? []), ...(CONFIG.mensajesMes ?? [])];

  it("tienen una fecha válida", () => {
    for (const carta of cartas) expect(fechaValida(carta.fecha), carta.titulo ?? carta.fecha).toBe(true);
  });

  it("las que no son borrador van selladas", () => {
    for (const carta of [...cartas, CONFIG.cumpleanos?.carta]) {
      if (!carta || ("borrador" in carta && carta.borrador)) continue;
      expect(carta.mensajeSellado, carta.titulo).toMatch(/^v1\./);
    }
  });

  it("no hay dos mensajes del mes con la misma fecha", () => {
    const fechas = (CONFIG.mensajesMes ?? []).map((m) => m.fecha);
    expect(new Set(fechas).size).toBe(fechas.length);
  });
});

describe("música", () => {
  it("la canción existe en public/", () => {
    const src = CONFIG.musica?.cancion?.src;
    expect(src).toBeTruthy();
    expect(enPublic(src ?? ""), src).toBe(true);
  });
});

describe("Firebase", () => {
  const reglas = readFileSync(resolve(RAIZ, "firestore.rules"), "utf8");

  it("cieloId y miembros coinciden con firestore.rules", () => {
    expect(reglas).toContain(`"${NUBE.cieloId}"`);
    for (const uid of NUBE.miembros ?? []) expect(reglas, uid).toContain(`"${uid}"`);
  });

  it("los miembros son UID, nunca correos", () => {
    for (const uid of NUBE.miembros ?? []) expect(uid).not.toContain("@");
  });
});
