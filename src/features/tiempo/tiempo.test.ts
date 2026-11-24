import { describe, expect, it } from "vitest";
import { textoJuntos } from "./tiempo.ts";

describe("textoJuntos (la franja de arriba)", () => {
  it("nombra solo lo que no es 0", () => {
    expect(textoJuntos({ years: 0, months: 8, days: 16 })).toBe("8 meses y 16 días");
    expect(textoJuntos({ years: 0, months: 9, days: 0 })).toBe("9 meses");
    expect(textoJuntos({ years: 1, months: 0, days: 3 })).toBe("1 año y 3 días");
  });

  it("con años, meses y días usa coma e «y»", () => {
    expect(textoJuntos({ years: 2, months: 1, days: 1 })).toBe("2 años, 1 mes y 1 día");
  });

  it("el primer día dice 0 días", () => {
    expect(textoJuntos({ years: 0, months: 0, days: 0 })).toBe("0 días");
  });
});
