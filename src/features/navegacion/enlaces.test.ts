import { describe, expect, it } from "vitest";
import {
  destinoDeRutaVieja,
  destinoDeSeccion,
  enlacesVisibles,
  estadoEstrella,
  PAGINAS,
  paginasDeHoy,
  RUTAS_VIEJAS,
  rutaDeSeccion,
  siguienteDe
} from "./enlaces.ts";

const ids = (lista: { id: string }[]) => lista.map((enlace) => enlace.id);

describe("paginasDeHoy (el menú corto)", () => {
  it("sin adviento ni cumpleaños, quedan 4 en el orden del menú", () => {
    expect(ids(enlacesVisibles())).toEqual(["linea-tiempo", "calendario", "boveda", "entretenimiento"]);
  });

  it("el adviento, en su época, va primero en el menú", () => {
    expect(ids(enlacesVisibles({ adviento: "vigente" }))[0]).toBe("adviento");
  });

  it("cuando el adviento pasó, no está en el menú pero su página se sigue abriendo (desde La Bóveda)", () => {
    const { menu, todas } = paginasDeHoy({ adviento: "pasado" });
    expect(ids(menu)).not.toContain("adviento");
    expect(ids(todas)).toContain("adviento");
  });

  it("antes del cumpleaños su página está en el menú, antes de La Bóveda", () => {
    const lista = ids(enlacesVisibles({ cumple: "antes" }));
    expect(lista.indexOf("cumple")).toBe(lista.indexOf("boveda") - 1);
  });

  it("el día del cumpleaños su página va primera", () => {
    expect(ids(enlacesVisibles({ adviento: "vigente", cumple: "hoy" })).slice(0, 2)).toEqual(["cumple", "adviento"]);
  });

  it("en los días de después, el cumpleaños sale del menú y queda de recuerdo en La Bóveda", () => {
    const { menu, todas } = paginasDeHoy({ cumple: "despues" });
    expect(ids(menu)).not.toContain("cumple");
    expect(ids(todas)).toContain("cumple");
  });

  it("fuera de sus fechas, ni el adviento ni el cumpleaños tienen página", () => {
    expect(ids(paginasDeHoy().todas)).toEqual(ids(enlacesVisibles()));
  });

  it("cada página tiene su ruta y su texto del menú", () => {
    const entretenimiento = PAGINAS.find((enlace) => enlace.id === "entretenimiento");
    expect(entretenimiento).toMatchObject({ ruta: "/entretenimiento", texto: "Entretenimiento" });
  });

  it("no hay dos páginas con la misma ruta ni el mismo id, ni una ruta vieja que sea de una página", () => {
    expect(new Set(PAGINAS.map((p) => p.ruta)).size).toBe(PAGINAS.length);
    expect(new Set(ids([...PAGINAS])).size).toBe(PAGINAS.length);
    expect(RUTAS_VIEJAS.filter((ruta) => PAGINAS.some((p) => p.ruta === ruta))).toEqual([]);
  });
});

describe("destinoDeSeccion (links viejos y botón de las cartas)", () => {
  it("lleva cada id a su página", () => {
    expect(rutaDeSeccion("boveda")).toBe("/boveda");
    expect(rutaDeSeccion("linea-tiempo")).toBe("/meses");
    expect(rutaDeSeccion("calendario")).toBe("/bajada");
  });

  it("las secciones que ahora van dentro de otra página llevan a ella y bajan hasta la sección", () => {
    expect(destinoDeSeccion("carta")).toEqual({ ruta: "/", ancla: "carta" });
    expect(destinoDeSeccion("mensaje-mes")).toEqual({ ruta: "/", ancla: "mensaje-mes" });
    expect(destinoDeSeccion("constelacion")).toEqual({ ruta: "/entretenimiento", ancla: "constelacion" });
    expect(destinoDeSeccion("juego")).toEqual({ ruta: "/entretenimiento", ancla: "juego" });
  });

  it("el tiempo y la música ya no son una sección: llevan a la portada", () => {
    expect(destinoDeSeccion("tiempo")).toEqual({ ruta: "/" });
    expect(destinoDeSeccion("musica")).toEqual({ ruta: "/" });
  });

  it("la portada, la bienvenida y el cierre llevan al inicio", () => {
    expect(["inicio", "welcome", "final"].map(rutaDeSeccion)).toEqual(["/", "/", "/"]);
  });

  it("un id que no es de ninguna sección no lleva a ningún lado", () => {
    expect(destinoDeSeccion("navLinks")).toBeNull();
  });
});

describe("destinoDeRutaVieja", () => {
  it("las rutas de las páginas que ya no existen llevan a su nuevo lugar", () => {
    expect(destinoDeRutaVieja("/carta")).toEqual({ ruta: "/", ancla: "carta" });
    expect(destinoDeRutaVieja("/este-mes")).toEqual({ ruta: "/", ancla: "mensaje-mes" });
    expect(destinoDeRutaVieja("/cielo")).toEqual({ ruta: "/entretenimiento", ancla: "constelacion" });
    expect(destinoDeRutaVieja("/juego")).toEqual({ ruta: "/entretenimiento", ancla: "juego" });
    expect(destinoDeRutaVieja("/tiempo")).toEqual({ ruta: "/" });
    expect(destinoDeRutaVieja("/musica")).toEqual({ ruta: "/" });
  });

  it("una ruta de una página que existe no es vieja", () => {
    expect(destinoDeRutaVieja("/boveda")).toBeNull();
    expect(destinoDeRutaVieja("/")).toBeNull();
  });
});

describe("siguienteDe", () => {
  const lista = enlacesVisibles();

  it("da la página que sigue en el orden del menú", () => {
    expect(siguienteDe(lista, lista[0])?.id).toBe("calendario");
  });

  it("después de la última, en la portada y en una página fuera del menú, no hay siguiente", () => {
    expect(siguienteDe(lista, lista[lista.length - 1])).toBeNull();
    expect(siguienteDe(lista, null)).toBeNull();
    const cumple = paginasDeHoy({ cumple: "despues" }).todas.find((e) => e.id === "cumple") ?? null;
    expect(siguienteDe(lista, cumple)).toBeNull();
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
