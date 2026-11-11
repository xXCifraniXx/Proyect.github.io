import { cpSync, createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/*
  CONFIGURACIÓN DE VITE
  ---------------------
  Durante la migración, la versión React usa los mismos archivos que el sitio
  actual (no se duplica nada):
    - el contenido: ../assets/js/config.js
    - los estilos:  ../assets/css/styles.css
    - las fotos y la canción: ../assets/images y ../assets/audio
  "base" es la carpeta en la que GitHub Pages publica el sitio.
*/
const raiz = resolve(import.meta.dirname, "..");
const BASE = "/Proyect.github.io/";
const MEDIOS = ["images", "audio"];

const TIPOS = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg"
};

// En desarrollo sirve assets/images y assets/audio del sitio actual; al
// compilar los copia dentro de dist/assets.
function mediosDelSitio() {
  return {
    name: "medios-del-sitio",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const ruta = decodeURIComponent((req.url || "").split("?")[0]);
        const prefijo = `${BASE}assets/`;
        if (!ruta.startsWith(prefijo)) return next();
        const relativa = ruta.slice(prefijo.length);
        const carpeta = relativa.split("/")[0];
        if (!MEDIOS.includes(carpeta)) return next();
        const archivo = resolve(raiz, "assets", relativa);
        if (!archivo.startsWith(join(raiz, "assets")) || !existsSync(archivo) || !statSync(archivo).isFile()) return next();
        res.setHeader("Content-Type", TIPOS[extname(archivo).toLowerCase()] || "application/octet-stream");
        createReadStream(archivo).pipe(res);
      });
    },
    closeBundle() {
      for (const carpeta of MEDIOS) {
        cpSync(resolve(raiz, "assets", carpeta), resolve(import.meta.dirname, "dist", "assets", carpeta), { recursive: true });
      }
    }
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), mediosDelSitio()],
  server: {
    port: 5173,
    // Permite importar config.js y styles.css desde la carpeta del sitio actual.
    fs: { allow: [raiz] }
  }
});
