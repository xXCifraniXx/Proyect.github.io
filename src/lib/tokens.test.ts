import { afterEach, describe, expect, it } from "vitest";
import { conAlfa, leerTokens } from "./tokens.ts";

afterEach(() => {
  document.documentElement.removeAttribute("style");
});

describe("leerTokens", () => {
  it("lee los tokens definidos en el documento", () => {
    document.documentElement.style.setProperty("--rose-rgb", " 230 176 126 ");
    expect(leerTokens({ "rose-rgb": "255 158 184" })).toEqual({ "rose-rgb": "230 176 126" });
  });

  it("deja el valor por defecto (el del tema rosa) si el token no está", () => {
    document.documentElement.style.setProperty("--rose-rgb", "230 176 126");
    expect(leerTokens({ "rose-rgb": "255 158 184", text: "#fff8fb" })).toEqual({
      "rose-rgb": "230 176 126",
      text: "#fff8fb"
    });
  });
});

describe("conAlfa", () => {
  it("arma un color con transparencia", () => {
    expect(conAlfa("255 158 184", 0.16)).toBe("rgb(255 158 184 / 0.16)");
  });
});
