import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Config } from "../types/config.ts";
import { cartaDeCumple, estadoCumple, ocurrencia, textosConCumple } from "./cumple.ts";

// Mismos datos que config.cumpleanos (sin la carta real, que va sellada).
const CONFIG_PRUEBA: Config = {
  textos: { cumpleIrVelas: "Ir a soplar mis velas 🎂" },
  cumpleanos: {
    activo: true,
    nacimiento: "1999-10-11",
    diasAntes: 45,
    diasDespues: 60,
    carta: { fecha: "", titulo: "Tus {edad} años", mensajeSellado: "v1.a.b.c" },
    textosHoy: { welcomeTitle: "¡Feliz cumpleaños! Cumples {edad}" }
  }
} as Config;

const en = (fecha: string) => vi.setSystemTime(new Date(fecha));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  window.APP_CONFIG = CONFIG_PRUEBA;
});
afterEach(() => vi.useRealTimers());

describe("estadoCumple", () => {
  it.each([
    ["2026-08-26T23:00:00", "off"], // un poco más de 45 días antes
    ["2026-08-27T00:00:00", "antes"], // justo 45 días antes
    ["2026-10-10T12:00:00", "antes"],
    ["2026-10-11T00:00:00", "hoy"],
    ["2026-10-11T23:59:00", "hoy"],
    ["2026-10-12T00:00:00", "despues"],
    ["2026-12-10T23:00:00", "despues"], // último día de recuerdo
    ["2026-12-11T00:00:00", "off"],
    ["2027-01-05T12:00:00", "off"]
  ])("el %s está en %s", (fecha, estado) => {
    en(fecha);
    expect(estadoCumple()).toBe(estado);
  });

  it("sin cumpleaños activo no hay nada", () => {
    window.APP_CONFIG = { cumpleanos: { ...CONFIG_PRUEBA.cumpleanos, activo: false } } as Config;
    en("2026-10-11T10:00:00");
    expect(estadoCumple()).toBe("off");
  });
});

describe("ocurrencia", () => {
  it("calcula la edad que cumple ese año", () => {
    en("2026-10-11T10:00:00");
    expect(ocurrencia()?.edad).toBe(27);
    expect(ocurrencia()?.date).toEqual(new Date(2026, 9, 11));
  });

  it("en los días de recuerdo sigue siendo el cumpleaños que ya pasó", () => {
    en("2026-11-20T10:00:00");
    expect(ocurrencia()?.edad).toBe(27);
  });
});

describe("textosConCumple", () => {
  it("el día del cumpleaños usa textosHoy y reemplaza {edad}", () => {
    en("2026-10-11T10:00:00");
    expect(textosConCumple({ welcomeTitle: "Hola" }).welcomeTitle).toBe("¡Feliz cumpleaños! Cumples 27");
  });

  it("fuera del cumpleaños deja los textos como están", () => {
    en("2027-02-01T10:00:00");
    const base = { welcomeTitle: "Hola {edad}" };
    expect(textosConCumple(base)).toBe(base);
  });
});

describe("cartaDeCumple", () => {
  it("se arma con la fecha de este año y el botón a las velas", () => {
    en("2026-10-01T10:00:00");
    const carta = cartaDeCumple();
    expect(carta?.id).toBe("cumple");
    expect(carta?.titulo).toBe("Tus 27 años");
    expect(new Date(carta?.fecha ?? "")).toEqual(new Date(2026, 9, 11));
    expect(carta?.accion).toEqual({ destino: "cumple", etiqueta: "Ir a soplar mis velas 🎂" });
  });

  it("no existe fuera de la ventana del cumpleaños", () => {
    en("2027-02-01T10:00:00");
    expect(cartaDeCumple()).toBeNull();
  });
});
