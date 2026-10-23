// Gravador do vídeo: abre o site no Chrome headless (animações do site desligadas), injeta o
// palco e o diretor e avança a linha do tempo quadro a quadro.
//
//   node render.mjs --previa 0.5,2.4,7.6      quadros soltos → saida/previa/q-<t>.png
//   node render.mjs --folha [passo]            folha de contato (padrão: 1 quadro por s) → saida/previa/folha.png
//   node render.mjs                            30 fps, 1080 × 1920 → saida/video-mudo.mp4 + saida/sons.json
//
// CHROME_PATH aponta o executável do Chrome/Chromium.
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(aqui, "saida");
const previa = path.join(saida, "previa");
fs.mkdirSync(previa, { recursive: true });

const args = process.argv.slice(2);
const modo = args[0] === "--previa" ? "previa" : args[0] === "--folha" ? "folha" : "video";
const porta = 3230 + Math.floor(Math.random() * 500);
const FPS = 30;

const servidor = spawn(process.execPath, [path.join(aqui, "servidor.mjs"), String(porta)], { stdio: ["ignore", "pipe", "inherit"] });
await new Promise((ok) => servidor.stdout.once("data", ok));

const navegador = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--font-render-hinting=none", "--disable-lcd-text", "--hide-scrollbars"],
});

try {
  const contexto = await navegador.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  await contexto.addInitScript(() => {
    try {
      localStorage.setItem("decalq:animacoes", "desligadas");
    } catch {}
  });
  const pagina = await contexto.newPage();
  pagina.on("pageerror", (e) => console.error("[página]", e.message));
  await pagina.goto(`http://localhost:${porta}/`, { waitUntil: "networkidle" });
  // as imagens da grade são lazy: forçar o carregamento de todas antes de copiar
  await pagina.evaluate(async () => {
    for (const i of document.querySelectorAll("img")) i.loading = "eager";
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((ok) => (i.onload = i.onerror = ok)))));
  });
  await pagina.addStyleTag({ url: "/video/diretor/palco.css" });
  await pagina.addScriptTag({ url: "/video/gsap/gsap.min.js" });
  await pagina.addScriptTag({ url: "/video/diretor/diretor.js" });
  const info = await pagina.evaluate(async () => {
    try {
      const d = await window.__diretor.pronto;
      return { duracao: d.duracao, sons: d.sons };
    } catch (e) {
      return { erro: String(e && e.stack ? e.stack : e) };
    }
  });
  if (info.erro) throw new Error(info.erro);

  const quadro = async (t, tipo = "png") => {
    await pagina.evaluate((t) => window.__diretor.seek(t), t);
    return pagina.screenshot({ type: tipo, clip: { x: 0, y: 0, width: 540, height: 960 }, ...(tipo === "jpeg" ? { quality: 90 } : {}) });
  };

  if (modo === "previa") {
    const tempos = (args[1] || "0.5,2.5,5,7.6,9,11,12.8,15,20,22.5,26,28.8,32.5").split(",").map(Number);
    for (const t of tempos) {
      const arq = path.join(previa, `q-${t.toFixed(2)}.png`);
      fs.writeFileSync(arq, await quadro(t));
      console.log(arq);
    }
  } else if (modo === "folha") {
    const passo = Number(args[1]) || 1;
    const dir = path.join(previa, "folha");
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    let n = 0;
    for (let t = 0.5; t < info.duracao; t += passo) fs.writeFileSync(path.join(dir, `${String(n++).padStart(3, "0")}.jpg`), await quadro(t, "jpeg"));
    const colunas = 6;
    const linhas = Math.ceil(n / colunas);
    const arq = path.join(previa, "folha.jpg");
    await new Promise((ok, erro) =>
      spawn("ffmpeg", ["-y", "-v", "error", "-i", path.join(dir, "%03d.jpg"), "-vf", `scale=270:480,tile=${colunas}x${linhas}:padding=6:margin=6:color=white`, "-frames:v", "1", "-q:v", "3", arq], { stdio: "inherit" })
        .on("exit", (c) => (c ? erro(new Error("ffmpeg " + c)) : ok())),
    );
    console.log(arq, `(${n} quadros, a cada ${passo} s a partir de 0,5 s)`);
  } else {
    fs.writeFileSync(path.join(saida, "sons.json"), JSON.stringify({ duracao: info.duracao, sons: info.sons }, null, 2));
    const total = Math.round(info.duracao * FPS);
    const destino = path.join(saida, "video-mudo.mp4");
    const ff = spawn(
      "ffmpeg",
      ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
        "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-r", String(FPS), destino],
      { stdio: ["pipe", "inherit", "inherit"] },
    );
    const fim = new Promise((ok, erro) => ff.on("exit", (c) => (c ? erro(new Error("ffmpeg " + c)) : ok())));
    const inicio = Date.now();
    for (let i = 0; i < total; i++) {
      const png = await quadro(i / FPS);
      if (!ff.stdin.write(png)) await new Promise((ok) => ff.stdin.once("drain", ok));
      if (i % 60 === 0) console.log(`quadro ${i}/${total}  (${((Date.now() - inicio) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end();
    await fim;
    console.log(destino, `${total} quadros`);
  }
} finally {
  await navegador.close();
  servidor.kill();
}
