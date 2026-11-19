import { afterEach, describe, expect, it } from "vitest";
import { enlacesVisibles, estadoEstrella, idDe, ordenDePagina } from "./enlaces.ts";

describe("enlacesVisibles", () => {
  it("sin mensaje del mes ni cumpleaños, quedan los 8 de siempre en el orden del menú", () => {
    expect(enlacesVisibles().map(idDe)).toEqual([
      "carta",
      "linea-tiempo",
      "tiempo",
      "calendario",
      "musica",
      "boveda",
      "constelacion",
      "juego"
    ]);
  });

  it("'Este mes' va primero y 'Cumpleaños' antes de La Bóveda, solo cuando existen", () => {
    const ids = enlacesVisibles({ mes: true, cumple: true }).map(idDe);
    expect(ids[0]).toBe("mensaje-mes");
    expect(ids.indexOf("cumple")).toBe(ids.indexOf("boveda") - 1);
    expect(ids).toHaveLength(10);
  });

  it("cada enlace lleva a su sección con su texto del menú", () => {
    const carta = enlacesVisibles().find((enlace) => enlace.href === "#carta");
    expect(carta?.texto).toBe("Carta");
  });
});

describe("ordenDePagina", () => {
  afterEach(() => document.body.replaceChildren());

  const pagina = (ids: string[]) => {
    document.body.innerHTML = ids.map((id) => `<section id="${id}"></section>`).join("");
  };

  it("ordena según la página, no según el menú", () => {
    // El día del cumpleaños, su sección va antes de la carta.
    pagina(["cumple", "carta", "boveda"]);
    expect(ordenDePagina(["carta", "boveda", "cumple"])).toEqual(["cumple", "carta", "boveda"]);
  });

  it("deja fuera las secciones que no están (por ejemplo, la música sin canción)", () => {
    pagina(["carta", "boveda"]);
    expect(ordenDePagina(["carta", "musica", "boveda"])).toEqual(["carta", "boveda"]);
  });
});

describe("estadoEstrella", () => {
  it("las de antes de la actual ya pasaron; las de después, pendientes", () => {
    expect([0, 1, 2, 3].map((i) => estadoEstrella(i, 2))).toEqual(["pasada", "pasada", "actual", "pendiente"]);
  });

  it("antes de llegar a la primera sección, todas pendientes", () => {
    expect([0, 1].map((i) => estadoEstrella(i, -1))).toEqual(["pendiente", "pendiente"]);
  });
});
