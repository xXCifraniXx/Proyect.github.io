import { describe, expect, it } from "vitest";
import { enlacesVisibles, estadoEstrella, PAGINAS, rutaDeSeccion, siguienteDe } from "./enlaces.ts";

const ids = (lista: { id: string }[]) => lista.map((enlace) => enlace.id);

describe("enlacesVisibles", () => {
  it("sin mensaje del mes ni cumpleaños, quedan las 8 de siempre en el orden del menú", () => {
    expect(ids(enlacesVisibles())).toEqual([
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
    const lista = ids(enlacesVisibles({ mes: true, cumple: "despues" }));
    expect(lista[0]).toBe("mensaje-mes");
    expect(lista.indexOf("cumple")).toBe(lista.indexOf("boveda") - 1);
    expect(lista).toHaveLength(10);
  });

  it("antes del cumpleaños su página también existe (la del regalo con la cuenta regresiva)", () => {
    expect(ids(enlacesVisibles({ cumple: "antes" }))).toContain("cumple");
  });

  it("el día del cumpleaños su página sube: justo después de 'Este mes'", () => {
    expect(ids(enlacesVisibles({ mes: true, cumple: "hoy" })).slice(0, 3)).toEqual(["mensaje-mes", "cumple", "carta"]);
    expect(ids(enlacesVisibles({ cumple: "hoy" }))[0]).toBe("cumple");
  });

  it("cada página tiene su ruta y su texto del menú", () => {
    const carta = enlacesVisibles().find((enlace) => enlace.id === "carta");
    expect(carta).toMatchObject({ ruta: "/carta", texto: "Carta" });
  });

  it("no hay dos páginas con la misma ruta ni el mismo id", () => {
    expect(new Set(PAGINAS.map((p) => p.ruta)).size).toBe(PAGINAS.length);
    expect(new Set(ids([...PAGINAS])).size).toBe(PAGINAS.length);
  });
});

describe("rutaDeSeccion (links viejos y botón de las cartas)", () => {
  it("lleva cada id viejo a su página", () => {
    expect(rutaDeSeccion("boveda")).toBe("/boveda");
    expect(rutaDeSeccion("linea-tiempo")).toBe("/meses");
    expect(rutaDeSeccion("calendario")).toBe("/bajada");
    expect(rutaDeSeccion("mensaje-mes")).toBe("/este-mes");
    // La sección de adorno; la página del cielo sigue en /constelacion/.
    expect(rutaDeSeccion("constelacion")).toBe("/cielo");
  });

  it("la portada, la bienvenida y el cierre llevan al inicio", () => {
    expect(["inicio", "welcome", "final"].map(rutaDeSeccion)).toEqual(["/", "/", "/"]);
  });

  it("un id que no es de ninguna sección no lleva a ningún lado", () => {
    expect(rutaDeSeccion("navLinks")).toBeNull();
  });
});

describe("siguienteDe", () => {
  const lista = enlacesVisibles();

  it("da la página que sigue en el orden del menú", () => {
    expect(siguienteDe(lista, lista[0])?.id).toBe("linea-tiempo");
  });

  it("después de la última, y en la portada, no hay siguiente", () => {
    expect(siguienteDe(lista, lista[lista.length - 1])).toBeNull();
    expect(siguienteDe(lista, null)).toBeNull();
  });
});

describe("estadoEstrella", () => {
  it("las de antes de la actual ya pasaron; las de después, pendientes", () => {
    expect([0, 1, 2, 3].map((i) => estadoEstrella(i, 2))).toEqual(["pasada", "pasada", "actual", "pendiente"]);
  });

  it("en la portada, todas pendientes", () => {
    expect([0, 1].map((i) => estadoEstrella(i, -1))).toEqual(["pendiente", "pendiente"]);
  });
});
