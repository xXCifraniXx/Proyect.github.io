/// <reference types="vitest/config" />
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/*
  CONFIGURACIÓN DE VITE
  ---------------------
  - "base" es la carpeta en la que GitHub Pages publica el sitio.
  - public/ se copia tal cual a dist/: ahí van las fotos, la canción y los
    íconos (public/assets/images, public/assets/audio), con la misma ruta de
    siempre en el link (…/assets/images/marzo.webp).
  - Tres páginas: la carta, el cielo y la herramienta para sellar cartas.
*/
export default defineConfig({
  base: "/Proyect.github.io/",
  plugins: [react()],
  build: {
    // Firestore (con actualizaciones en vivo) pesa ~580 kB; se carga aparte y
    // solo cuando una sección lo usa, así que no afecta la primera carga.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: {
        principal: resolve(import.meta.dirname, "index.html"),
        constelacion: resolve(import.meta.dirname, "constelacion/index.html"),
        sellarCarta: resolve(import.meta.dirname, "herramientas/sellar-carta.html")
      }
    }
  },
  server: {
    port: 5173
  },
  // Tests (Vitest): happy-dom da window, localStorage y location como en el
  // navegador. Zona horaria fija para que las fechas den igual en cualquier equipo.
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
    env: { TZ: "America/Lima" }
  }
});
