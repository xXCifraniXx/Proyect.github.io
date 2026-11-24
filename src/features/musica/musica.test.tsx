import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BotonMusica from "./BotonMusica.tsx";
import BotonSiguiente from "./BotonSiguiente.tsx";
import { conArchivo, siguienteIndice, type CancionConArchivo } from "./musica.ts";
import ProveedorMusica from "./ProveedorMusica.tsx";

// React necesita saber que está corriendo dentro de pruebas para usar act().
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("siguienteIndice", () => {
  it("pasa a la que sigue y, después de la última, vuelve a la primera", () => {
    expect(siguienteIndice(0, 3)).toBe(1);
    expect(siguienteIndice(2, 3)).toBe(0);
    expect(siguienteIndice(0, 1)).toBe(0);
    expect(siguienteIndice(0, 0)).toBe(0);
  });
});

describe("conArchivo", () => {
  it("deja solo las canciones con archivo, en su orden", () => {
    const lista = conArchivo([{ titulo: "A", src: "a.mp3" }, { titulo: "Sin archivo" }, { titulo: "B", src: "b.mp3" }]);
    expect(lista.map((cancion) => cancion.titulo)).toEqual(["A", "B"]);
    expect(conArchivo(undefined)).toEqual([]);
  });
});

describe("ProveedorMusica", () => {
  const A: CancionConArchivo = { titulo: "A", artista: "Uno", src: "assets/audio/a.mp3" };
  const B: CancionConArchivo = { titulo: "B", artista: "Dos", src: "assets/audio/b.mp3" };
  let caja: HTMLDivElement;
  let raiz: Root;
  let tocar: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // El navegador de pruebas no suena: play() solo avisa que empezó.
    tocar = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    });
  });

  afterEach(() => {
    act(() => raiz.unmount());
    vi.restoreAllMocks();
  });

  const dibujar = (canciones: CancionConArchivo[]) => {
    caja = document.createElement("div");
    raiz = createRoot(caja);
    act(() =>
      raiz.render(
        <ProveedorMusica canciones={canciones}>
          <BotonMusica />
          <BotonSiguiente />
        </ProveedorMusica>
      )
    );
  };
  const audio = () => caja.querySelector("audio") as HTMLAudioElement;
  const botonMusica = () => caja.querySelector(".boton-musica") as HTMLButtonElement;
  const botonSiguiente = () => caja.querySelector(".boton-siguiente");

  it("con una sola canción no hay ⏭, y nada se baja antes de tocar ▶", () => {
    dibujar([A]);
    expect(botonSiguiente()).toBeNull();
    expect(botonMusica().getAttribute("aria-label")).toBe("Reproducir «A»");
    expect(audio().getAttribute("src")).toBeNull();
    expect(audio().preload).toBe("none");

    act(() => botonMusica().click());
    expect(audio().getAttribute("src")).toBe(A.src);
    expect(tocar).toHaveBeenCalledTimes(1);
    expect(botonMusica().getAttribute("aria-label")).toBe("Pausar «A»");
  });

  it("⏭ pasa a la siguiente, la hace sonar y dice cuál sigue", () => {
    dibujar([A, B]);
    expect(botonSiguiente()?.getAttribute("aria-label")).toBe("Pasar a «B»");

    act(() => (botonSiguiente() as HTMLButtonElement).click());
    expect(audio().getAttribute("src")).toBe(B.src);
    expect(tocar).toHaveBeenCalledTimes(1);
    expect(botonMusica().getAttribute("aria-label")).toBe("Pausar «B»");
    // Después de la última vuelve a la primera.
    expect(botonSiguiente()?.getAttribute("aria-label")).toBe("Pasar a «A»");
  });

  it("al terminar una canción empieza la siguiente", () => {
    dibujar([A, B]);
    act(() => botonMusica().click());
    expect(audio().getAttribute("src")).toBe(A.src);

    act(() => {
      audio().dispatchEvent(new Event("pause"));
      audio().dispatchEvent(new Event("ended"));
    });
    expect(audio().getAttribute("src")).toBe(B.src);
    expect(tocar).toHaveBeenCalledTimes(2);
    expect(botonMusica().getAttribute("aria-label")).toBe("Pausar «B»");
  });
});
