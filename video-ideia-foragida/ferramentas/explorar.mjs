// Inspeção do DOM do site para escolher as peças do vídeo (ferramenta de apoio).
import { chromium } from "playwright-core";

const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const c = await b.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1 });
await c.addInitScript(() => { try { localStorage.setItem("decalq:animacoes", "desligadas"); } catch {} });
const p = await c.newPage();
await p.goto("http://localhost:3230/", { waitUntil: "networkidle" });
const r = await p.evaluate(() => {
  const curto = (el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") +
    (typeof el.className === "string" && el.className ? "." + el.className.split(" ").map((c) => c.replace(/-module__\w+__/, "::")).join(".") : "") +
    [...el.attributes].filter((a) => a.name.startsWith("data-") || a.name === "aria-label").map((a) => `[${a.name}=${a.value.slice(0, 30)}]`).join("");
  const arvore = (el, prof = 0, max = 5, linhas = []) => {
    if (!el || prof > max) return linhas;
    const r = el.getBoundingClientRect();
    const txt = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").slice(0, 40);
    linhas.push("  ".repeat(prof) + curto(el) + ` ${Math.round(r.width)}×${Math.round(r.height)}` + (txt ? ` "${txt}"` : ""));
    if (el.tagName.toLowerCase() !== "svg") for (const f of el.children) arvore(f, prof + 1, max, linhas);
    return linhas;
  };
  const q = (s) => document.querySelector(s);
  const cs = (el, props) => { const s = getComputedStyle(el); return Object.fromEntries(props.map((k) => [k, s.getPropertyValue(k)])); };
  return {
    tela: arvore(q("[data-tela-imagem]"), 0, 6).join("\n"),
    composicao: cs(q("[class*=Abertura-module__][class*=composicao]"), ["container-type", "width", "height", "aspect-ratio"]),
    tvBox: cs(q("[data-tv]"), ["container-type", "width"]),
    adesivo: arvore(q("[data-adesivo]"), 0, 2).join("\n"),
    dupla: arvore(q("#a-dupla"), 0, 5).join("\n"),
    card: arvore(q("[data-pessoa]"), 0, 4).join("\n"),
    projeto: arvore(q("[data-grade] [data-projeto]"), 0, 6).join("\n"),
    rasgo: arvore(q("[class*=Rasgo-module__][class*=rasgo]"), 0, 2).join("\n"),
    titulo: arvore(q("#servicos h2"), 0, 4).join("\n"),
    rodape: arvore(q("footer"), 0, 4).join("\n"),
    filtros: [...document.querySelectorAll("svg defs filter")].map((f) => f.id + " em " + curto(f.closest("svg").parentElement)).join("\n"),
    contato: arvore(q("#contato"), 0, 4).join("\n"),
    papel: cs(q("#servicos"), ["background-image", "background-color"]),
    raizVars: ["--breu", "--creme", "--lima", "--azul-forte", "--papel", "--tinta", "--fonte-mono", "--fonte-pixel", "--rosa", "--amarelo"].map((v) => v + ": " + getComputedStyle(document.documentElement).getPropertyValue(v)).join("\n"),
  };
});
for (const [k, v] of Object.entries(r)) console.log(`\n===== ${k}\n${typeof v === "string" ? v : JSON.stringify(v)}`);
await b.close();
