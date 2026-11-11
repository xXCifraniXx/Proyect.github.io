/*
  SERVIDOR LOCAL PARA VER EL SITIO
  Uso:  node herramientas/servidor-local.js        (abre http://localhost:4173)
        node herramientas/servidor-local.js 5000   (otro puerto)
  No instala nada: solo usa Node. Avisa en la consola de los archivos que no
  existen (404), para detectar rutas mal escritas.
*/
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.argv[2] || process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".rules": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8"
};

http.createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  const file = path.join(root, pathname);
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end();
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      console.log(`404  ${pathname}`);
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("No encontrado");
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}).listen(port, () => {
  console.log(`Sitio en http://localhost:${port}  (Ctrl+C para parar)`);
});
