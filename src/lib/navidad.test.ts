import { describe, expect, it } from "vitest";
import { esNavidad } from "./navidad.ts";

describe("esNavidad (el fondo de diciembre)", () => {
  it("es navideño todo diciembre, desde el 1 a las 00:00 hasta el 31 a medianoche", () => {
    expect(esNavidad(new Date(2026, 10, 30, 23, 59), true)).toBe(false);
    expect(esNavidad(new Date(2026, 11, 1, 0, 0), true)).toBe(true);
    expect(esNavidad(new Date(2026, 11, 31, 23, 59), true)).toBe(true);
    expect(esNavidad(new Date(2027, 0, 1, 0, 0), true)).toBe(false);
  });

  it("vale para cualquier año, sin tocar la configuración", () => {
    expect(esNavidad(new Date(2030, 11, 15), true)).toBe(true);
  });

  it("apagado en config, nunca es navideño", () => {
    expect(esNavidad(new Date(2026, 11, 24), false)).toBe(false);
  });
});
