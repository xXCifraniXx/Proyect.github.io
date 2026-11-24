import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PAGINAS, RUTAS_VIEJAS } from "./enlaces.ts";
import { corregirLink, navegar, normalizar, rutaActual, suscribir, tomarAncla } from "./historial.ts";

const ir = (link: string) => window.history.replaceState(null, "", link);
const linkActual = () => window.location.pathname + window.location.search + window.location.hash;

afterEach(() => {
  ir("/");
  tomarAncla();
});

describe("normalizar", () => {
  it("quita la / del final y el index.html", () => {
    expect(normalizar("/boveda/")).toBe("/boveda");
    expect(normalizar("/index.html")).toBe("/");
    expect(normalizar("/")).toBe("/");
    expect(normalizar("")).toBe("/");
  });
});

describe("corregirLink (links viejos)", () => {
  it("un link viejo con #sección pasa a su página", () => {
    ir("/#boveda");
    corregirLink();
    expect(linkActual()).toBe("/boveda");
  });

  it("conserva el ?… (la vista previa del cumpleaños) y baja a la sección que ahora va en la portada", () => {
    ir("/?cumple=hoy#carta");
    corregirLink();
    expect(linkActual()).toBe("/?cumple=hoy");
    expect(tomarAncla()).toBe("carta");
  });

  it("las rutas de las páginas que ya no existen llevan a su nuevo lugar, con su sección", () => {
    ir("/juego?tema=rosa");
    corregirLink();
    expect(linkActual()).toBe("/entretenimiento?tema=rosa");
    expect(tomarAncla()).toBe("juego");

    ir("/carta/");
    corregirLink();
    expect(linkActual()).toBe("/");
    expect(tomarAncla()).toBe("carta");

    ir("/tiempo");
    corregirLink();
    expect(linkActual()).toBe("/");
    expect(tomarAncla()).toBeNull();
  });

  it("también desde /index.html, y con los ids que cambiaron de nombre", () => {
    ir("/index.html#linea-tiempo");
    corregirLink();
    expect(linkActual()).toBe("/meses");
  });

  it("#inicio y #final llevan a la portada", () => {
    ir("/#final");
    corregirLink();
    expect(linkActual()).toBe("/");
  });

  it("deja igual un # que no es de una sección y arregla la ruta", () => {
    ir("/boveda/?cumple=antes#algo");
    corregirLink();
    expect(linkActual()).toBe("/boveda?cumple=antes#algo");
    expect(tomarAncla()).toBeNull();
  });

  it("un # mal escrito no rompe nada", () => {
    ir("/#%E0");
    expect(() => corregirLink()).not.toThrow();
  });
});

describe("navegar", () => {
  it("cambia de página, conserva el ?… y avisa", () => {
    ir("/?cumple=hoy");
    const aviso = vi.fn();
    const dejar = suscribir(aviso);
    navegar("/meses");
    expect(linkActual()).toBe("/meses?cumple=hoy");
    expect(rutaActual()).toBe("/meses");
    expect(aviso).toHaveBeenCalledTimes(1);
    dejar();
  });

  it("a la misma página no agrega otra entrada al historial", () => {
    ir("/boveda");
    const largo = window.history.length;
    navegar("/boveda");
    expect(window.history.length).toBe(largo);
  });

  it("con ancla, la página nueva baja hasta esa sección (sin ponerla en el link)", () => {
    navegar("/entretenimiento", false, "juego");
    expect(linkActual()).toBe("/entretenimiento");
    expect(tomarAncla()).toBe("juego");
    expect(tomarAncla()).toBeNull();
  });
});

describe("firebase.json", () => {
  // Firebase solo sirve index.html en las rutas que conoce: sin esto, abrir
  // /boveda desde un link daría 404. Y esas rutas van sin caché, como el
  // HTML: si no, el celular podría quedarse con un index.html viejo.
  const firebase = JSON.parse(readFileSync(resolve(import.meta.dirname, "../../../firebase.json"), "utf8")) as {
    hosting: {
      site: string;
      rewrites?: { source: string; destination: string }[];
      headers?: { source: string; headers: { key: string; value: string }[] }[];
    }[];
  };
  const sitio = firebase.hosting.find((s) => s.site === "para-anthuanete");
  const reescritura = sitio?.rewrites?.find((r) => r.destination === "/index.html");
  // "/@(carta|boveda|…){,/}": esas rutas, con o sin / al final, y nada más
  // (sin comodines: lo demás sigue dando 404 y no toca los archivos ni el cielo).
  const FORMA = /^\/@\(([a-z-]+(?:\|[a-z-]+)*)\)\{,\/\}$/;

  it("sirve index.html justo en las rutas de las páginas y en las viejas (que llevan a su nuevo lugar)", () => {
    const rutas = reescritura?.source.match(FORMA)?.[1].split("|") ?? [];
    expect(rutas.map((r) => `/${r}`).sort()).toEqual([...PAGINAS.map((p) => p.ruta), ...RUTAS_VIEJAS].sort());
  });

  it("esas rutas van sin caché", () => {
    const cabecera = sitio?.headers?.find((h) => h.source === reescritura?.source);
    expect(cabecera?.headers).toContainEqual({ key: "Cache-Control", value: "no-cache" });
  });
});
