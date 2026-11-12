/*
  PESO DE LA CARGA INICIAL (SPEC.md, criterio 6)
  ----------------------------------------------
  Después de `npm run build`, suma el JavaScript que cada página descarga al
  abrirse (el script principal y sus modulepreload), comprimido con gzip, y
  falla si pasa del límite. Firebase no cuenta: se carga aparte, solo cuando
  una sección lo usa.

  Uso: node scripts/revisar-peso.mjs
*/
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const LIMITE_KB = 100;
const BASE = "/Proyect.github.io/";
const dist = resolve(import.meta.dirname, "..", "dist");
const paginas = ["index.html", "constelacion/index.html"];

let falla = false;
for (const pagina of paginas) {
  const ruta = resolve(dist, pagina);
  if (!existsSync(ruta)) {
    console.error(`Falta ${pagina}: corre primero "npm run build".`);
    process.exit(1);
  }
  const html = readFileSync(ruta, "utf8");
  const scripts = [...html.matchAll(/(?:src|href)="([^"]+\.js)"/g)].map((m) => m[1]);
  const kb = scripts.reduce((total, src) => {
    const archivo = resolve(dist, src.startsWith(BASE) ? src.slice(BASE.length) : src);
    return total + gzipSync(readFileSync(archivo)).length / 1024;
  }, 0);
  const ok = kb <= LIMITE_KB;
  falla ||= !ok;
  console.log(`${ok ? "✓" : "✗"} ${pagina}: ${kb.toFixed(1)} KB comprimidos (límite ${LIMITE_KB} KB)`);
}
process.exit(falla ? 1 : 0);
