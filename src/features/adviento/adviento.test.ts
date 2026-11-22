import { afterEach, describe, expect, it } from "vitest";
import { advientoVisible } from "../../lib/adviento.ts";
import type { PuertaAdviento } from "../../types/config.ts";
import { armarPuertas, estadoPuerta, guardarAbiertas, leerAbiertas, puertaDeHoy } from "./adviento.ts";

const SELLO = "v1.AAAA.BBBB.CCCC";
const lista: PuertaAdviento[] = [
  { dia: 1, titulo: "Primera", mensajeSellado: SELLO },
  { dia: 2, borrador: true, mensaje: "" },
  { dia: 5, mensajeSellado: SELLO },
  { dia: 5, mensajeSellado: SELLO }
];
const puertas = armarPuertas(2026, lista);
const ninguna = new Set<number>();

describe("armarPuertas", () => {
  it("siempre son 24, del 1 al 24, y cada una se abre a las 00:00 de su día de diciembre", () => {
    expect(puertas.map((p) => p.dia)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
    expect(puertas[0].item.fecha).toEqual(new Date("2026-12-01T00:00:00"));
    expect(puertas[23].item.fecha).toEqual(new Date("2026-12-24T00:00:00"));
  });

  it("un día que falta o que está repetido queda en borrador", () => {
    expect(puertas[2].item.carta.borrador).toBe(true); // el 3 no está
    expect(puertas[4].item.carta.borrador).toBe(true); // el 5 está dos veces
    expect(puertas[0].item.carta.borrador).toBeUndefined();
  });

  it("sin título, la puerta se llama por su día", () => {
    expect(puertas[0].item.carta.titulo).toBe("Primera");
    expect(puertas[2].item.carta.titulo).toBe("Día 3");
  });
});

describe("estadoPuerta", () => {
  const primera = puertas[0];

  it("antes de su día está cerrada, aunque el celular diga que ya se abrió", () => {
    const antes = new Date("2026-11-30T23:59:59");
    expect(estadoPuerta(primera, antes, ninguna)).toBe("cerrada");
    expect(estadoPuerta(primera, antes, new Set([1]))).toBe("cerrada");
  });

  it("desde las 00:00 de su día se puede abrir; después de abrirla queda abierta", () => {
    const suDia = new Date("2026-12-01T00:00:00");
    expect(estadoPuerta(primera, suDia, ninguna)).toBe("disponible");
    expect(estadoPuerta(primera, suDia, new Set([1]))).toBe("abierta");
  });

  it("en borrador no se abre nunca, aunque ya sea su día", () => {
    expect(estadoPuerta(puertas[1], new Date("2026-12-25T10:00:00"), ninguna)).toBe("pronto");
  });
});

describe("puertaDeHoy", () => {
  it("del 1 al 24 de diciembre de ese año es el día; fuera de eso, ninguna", () => {
    expect(puertaDeHoy(2026, new Date("2026-12-08T15:00:00"))).toBe(8);
    expect(puertaDeHoy(2026, new Date("2026-12-25T00:00:00"))).toBeNull();
    expect(puertaDeHoy(2026, new Date("2026-11-30T12:00:00"))).toBeNull();
    expect(puertaDeHoy(2026, new Date("2027-12-08T12:00:00"))).toBeNull();
  });
});

describe("puertas abiertas en el celular", () => {
  afterEach(() => localStorage.clear());

  it("se guardan por año y se vuelven a leer", () => {
    guardarAbiertas(2026, new Set([3, 1]));
    expect([...leerAbiertas(2026)]).toEqual([1, 3]);
    expect(localStorage.getItem("adviento-abiertas-2026")).toBe("[1,3]");
    expect(leerAbiertas(2027).size).toBe(0);
  });

  it("si lo guardado está roto, no se cae: ninguna abierta", () => {
    localStorage.setItem("adviento-abiertas-2026", "{no es json");
    expect(leerAbiertas(2026).size).toBe(0);
    localStorage.setItem("adviento-abiertas-2026", '["x", 2]');
    expect([...leerAbiertas(2026)]).toEqual([2]);
  });
});

describe("advientoVisible", () => {
  const config = { anio: 2026, desde: "2026-11-25T00:00:00", hasta: "2027-01-01T00:00:00" };

  it("se ve desde 'desde' hasta antes de 'hasta'", () => {
    expect(advientoVisible(new Date("2026-11-24T23:59:59"), config)).toBe(false);
    expect(advientoVisible(new Date("2026-11-25T00:00:00"), config)).toBe(true);
    expect(advientoVisible(new Date("2026-12-31T23:59:59"), config)).toBe(true);
    expect(advientoVisible(new Date("2027-01-01T00:00:00"), config)).toBe(false);
  });

  it("sin configuración o con una fecha mal escrita, no se ve", () => {
    expect(advientoVisible(new Date("2026-12-10T12:00:00"), null)).toBe(false);
    expect(advientoVisible(new Date("2026-12-10T12:00:00"), { ...config, desde: "diciembre" })).toBe(false);
  });
});
