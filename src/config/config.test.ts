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
import { puertas } from "./puertas.ts";

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

describe("calendario de adviento (adviento.ts y puertas.ts)", () => {
  const adviento = CONFIG.adviento;

  it("las fechas están bien escritas y cubren del 1 al 24 de diciembre", () => {
    expect(adviento?.desde).toMatch(FECHA_HORA);
    expect(adviento?.hasta).toMatch(FECHA_HORA);
    const desde = new Date(adviento?.desde ?? "");
    const hasta = new Date(adviento?.hasta ?? "");
    expect(desde.getTime()).toBeLessThanOrEqual(new Date(adviento?.anio ?? 0, 11, 1).getTime());
    expect(hasta.getTime()).toBeGreaterThan(new Date(adviento?.anio ?? 0, 11, 24).getTime());
  });

  it("una puerta por día, del 1 al 24, sin repetir", () => {
    const dias = puertas.map((p) => p.dia);
    for (const dia of dias) expect(Number.isInteger(dia) && dia >= 1 && dia <= 24, String(dia)).toBe(true);
    expect(new Set(dias).size).toBe(dias.length);
  });

  it("las que no son borrador van selladas, y nunca con el texto a la vista", () => {
    for (const puerta of puertas) {
      expect(puerta.mensaje ?? "", `día ${puerta.dia}`).toBe("");
      if (!puerta.borrador) expect(puerta.mensajeSellado, `día ${puerta.dia}`).toMatch(/^v1\./);
    }
  });

  it("las fotos existen en public/", () => {
    for (const puerta of puertas) if (puerta.foto) expect(enPublic(puerta.foto), puerta.foto).toBe(true);
  });
});

describe("música", () => {
  it("hay al menos una canción y todas existen en public/", () => {
    const canciones = CONFIG.musica?.canciones ?? [];
    expect(canciones.length).toBeGreaterThan(0);
    for (const cancion of canciones) {
      expect(cancion.src, cancion.titulo).toBeTruthy();
      expect(enPublic(cancion.src ?? ""), cancion.src).toBe(true);
    }
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
