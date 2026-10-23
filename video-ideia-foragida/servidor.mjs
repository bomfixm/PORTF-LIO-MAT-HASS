// Servidor local do vídeo: entrega o build do portfólio (../out, gerado por npm run build na raiz)
// na raiz e os arquivos do vídeo em /video/ — mesma origem, então o palco usa o CSS,
// as fontes, os filtros SVG e as imagens reais do site.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(aqui, "../out");
const gsap = path.resolve(aqui, "../node_modules/gsap/dist");
const porta = Number(process.argv[2]) || 3230;

const tipos = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".woff2": "font/woff2", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".txt": "text/plain", ".json": "application/json", ".mp3": "audio/mpeg",
};

http
  .createServer((q, r) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    let arq;
    if (p.startsWith("/video/gsap/")) arq = path.join(gsap, p.slice("/video/gsap/".length));
    else if (p.startsWith("/video/")) arq = path.join(aqui, p.slice("/video/".length));
    else {
      if (p.endsWith("/")) p += "index.html";
      arq = path.join(site, p);
    }
    fs.readFile(arq, (e, d) => {
      if (e) {
        r.writeHead(404);
        return r.end("404");
      }
      r.writeHead(200, { "content-type": tipos[path.extname(arq)] || "application/octet-stream", "cache-control": "no-store" });
      r.end(d);
    });
  })
  .listen(porta, () => console.log(`vídeo: http://localhost:${porta}/  (site em ${site})`));
