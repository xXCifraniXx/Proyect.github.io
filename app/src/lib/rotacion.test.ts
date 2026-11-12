import { describe, expect, it } from "vitest";
import type { RotacionMina } from "../types/config.ts";
import { armarRotacion, ciclo, esAjusteValido, faseActual, proximaBajada, tipoDeDia } from "./rotacion.ts";

// Lo mismo que config.rotacionMina: sube el 27 de agosto a las 8:00, 14 x 7, baja a las 21:00.
const FUENTE: RotacionMina = {
  activa: true,
  salidaBase: "2026-08-27T08:00:00",
  diasMina: 14,
  diasDescanso: 7,
  horaRegreso: "21:00",
  mesesAMostrar: 1
};
const rot = armarRotacion(FUENTE, null);
const dia = (texto: string) => new Date(`${texto}T12:00:00`);

describe("armarRotacion", () => {
  it("toma config.rotacionMina tal cual", () => {
    expect(rot.activa).toBe(true);
    expect(rot.diasCiclo).toBe(21);
    expect(rot.horaRegreso).toEqual({ hour: 21, minute: 0 });
    expect(rot.editada).toBe(false);
  });

  it("con un ajuste recalcula la salida 14 días antes de la bajada", () => {
    const ajustada = armarRotacion(FUENTE, {
      proximaBajada: "2026-11-14",
      diasMina: 14,
      diasDescanso: 7,
      horaRegreso: "20:30"
    });
    expect(ajustada.editada).toBe(true);
    expect(ajustada.base).toEqual(new Date("2026-10-31T08:00:00"));
    expect(ajustada.horaRegreso).toEqual({ hour: 20, minute: 30 });
    expect(proximaBajada(ajustada, new Date("2026-11-12T10:00:00"))).toEqual(new Date("2026-11-14T20:30:00"));
  });

  it("desactivada no calcula nada", () => {
    const apagada = armarRotacion({ ...FUENTE, activa: false }, null);
    expect(proximaBajada(apagada, new Date())).toBeNull();
    expect(faseActual(apagada, new Date())).toBeNull();
  });
});

describe("ciclo", () => {
  it("el primero sube el 27 de agosto y baja el 10 de septiembre por la noche", () => {
    const c = ciclo(rot, 0);
    expect(c.inicio).toEqual(new Date("2026-08-27T08:00:00"));
    expect(c.bajada).toEqual(new Date("2026-09-10T21:00:00"));
    expect(c.siguienteInicio).toEqual(new Date("2026-09-17T08:00:00"));
  });

  it("cada ciclo dura 21 días", () => {
    expect(ciclo(rot, 3).inicio).toEqual(new Date("2026-10-29T08:00:00"));
    expect(ciclo(rot, 3).bajada).toEqual(new Date("2026-11-12T21:00:00"));
  });
});

describe("proximaBajada", () => {
  it("el mismo día de la bajada, antes de las 21:00, es esa noche", () => {
    expect(proximaBajada(rot, new Date("2026-11-12T10:00:00"))).toEqual(new Date("2026-11-12T21:00:00"));
  });

  it("pasada la bajada, es la del ciclo siguiente", () => {
    expect(proximaBajada(rot, new Date("2026-11-12T22:00:00"))).toEqual(new Date("2026-12-03T21:00:00"));
  });
});

describe("faseActual", () => {
  it("antes de la primera subida", () => {
    const fase = faseActual(rot, new Date("2026-08-20T10:00:00"));
    expect(fase?.titulo).toBe("Próxima subida programada");
    expect(fase?.objetivo).toEqual(new Date("2026-08-27T08:00:00"));
  });

  it("en mina cuenta hasta la bajada", () => {
    const fase = faseActual(rot, new Date("2026-11-05T10:00:00"));
    expect(fase?.etiqueta).toBe("Próxima bajada");
    expect(fase?.objetivo).toEqual(new Date("2026-11-12T21:00:00"));
  });

  it("de descanso cuenta hasta la siguiente subida", () => {
    const fase = faseActual(rot, new Date("2026-11-15T10:00:00"));
    expect(fase?.etiqueta).toBe("Próxima subida");
    expect(fase?.objetivo).toEqual(new Date("2026-11-19T08:00:00"));
  });
});

describe("tipoDeDia", () => {
  it.each([
    ["2026-08-26", "none"],
    ["2026-10-29", "departure mine"],
    ["2026-10-30", "mine"],
    ["2026-11-11", "mine"],
    ["2026-11-12", "return"],
    ["2026-11-13", "rest"],
    ["2026-11-18", "rest"],
    ["2026-11-19", "departure mine"]
  ])("%s es %s", (fecha, tipo) => {
    expect(tipoDeDia(rot, dia(fecha)).tipo).toBe(tipo);
  });
});

describe("esAjusteValido", () => {
  it("solo acepta un objeto con proximaBajada", () => {
    expect(esAjusteValido(null)).toBe(false);
    expect(esAjusteValido({})).toBe(false);
    expect(esAjusteValido({ proximaBajada: "" })).toBe(false);
    expect(esAjusteValido({ proximaBajada: "2026-11-14", diasMina: 14, diasDescanso: 7, horaRegreso: "21:00" })).toBe(
      true
    );
  });
});
