import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { puedeAbrirse } from "../../features/boveda/ventanaCarta.ts";
import LimiteDeError from "./LimiteDeError.tsx";

// React necesita saber que está corriendo dentro de pruebas para usar act().
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const Falla = () => {
  throw new Error("dato mal escrito");
};

const dibujar = (elemento: ReturnType<typeof createElement>) => {
  const caja = document.createElement("div");
  const raiz = createRoot(caja);
  act(() => raiz.render(elemento));
  return { caja, raiz };
};

afterEach(() => vi.restoreAllMocks());

describe("LimiteDeError", () => {
  it("si una sección falla, muestra el respaldo y deja el error en la consola", () => {
    const consola = vi.spyOn(console, "error").mockImplementation(() => {});
    const { caja, raiz } = dibujar(
      createElement(LimiteDeError, {
        nombre: "prueba",
        respaldo: createElement("p", null, "respaldo"),
        children: createElement(Falla)
      })
    );
    expect(caja.textContent).toBe("respaldo");
    expect(consola.mock.calls.some((c) => String(c[0]).includes("[prueba]"))).toBe(true);
    act(() => raiz.unmount());
  });

  it("sin respaldo, la sección simplemente no aparece", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { caja, raiz } = dibujar(createElement(LimiteDeError, { nombre: "prueba", children: createElement(Falla) }));
    expect(caja.innerHTML).toBe("");
    act(() => raiz.unmount());
  });

  it("si no falla, muestra lo de adentro tal cual", () => {
    const { caja, raiz } = dibujar(
      createElement(LimiteDeError, { nombre: "prueba", children: createElement("p", null, "hola") })
    );
    expect(caja.innerHTML).toBe("<p>hola</p>");
    act(() => raiz.unmount());
  });
});

describe("puedeAbrirse (ventana de carta)", () => {
  const ahora = new Date("2026-12-08T10:00:00");
  it("una carta se abre desde su fecha, nunca antes", () => {
    expect(puedeAbrirse({ fecha: new Date("2026-12-08T00:00:00") }, ahora)).toBe(true);
    expect(puedeAbrirse({ fecha: new Date("2026-12-24T00:00:00") }, ahora)).toBe(false);
  });
});
