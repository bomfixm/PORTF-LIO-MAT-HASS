// Estilos das camadas da tela da TV ligada e desligada (ferramenta de apoio).
import { chromium } from "playwright-core";

const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const c = await b.newContext({ viewport: { width: 540, height: 960 } });
await c.addInitScript(() => { try { localStorage.setItem("decalq:animacoes", "desligadas"); } catch {} });
const p = await c.newPage();
await p.goto("http://localhost:3230/", { waitUntil: "networkidle" });
const ler = () => p.evaluate(() => {
  const tela = document.querySelector("[data-tela]");
  const camadas = [...tela.children, document.querySelector("[data-led]"), document.querySelector("[data-titulo-led]"), document.querySelector("[class*=TelaPortfolio-module__][class*=__forma]")];
  return camadas.map((el) => {
    const s = getComputedStyle(el);
    const nome = [...el.classList].map((c) => c.replace(/.*-module__\w+__/, "")).join(".");
    return `${nome.padEnd(12)} display=${s.display} opacity=${s.opacity} transform=${s.transform} filter=${s.filter} bg=${s.backgroundColor} zi=${s.zIndex} font=${s.fontFamily.slice(0, 40)} size=${s.fontSize} tt=${s.textTransform}`;
  }).join("\n");
});
console.log("== ligada\n" + (await ler()));
await p.evaluate(() => { document.documentElement.dataset.tv = "desligada"; });
console.log("== desligada\n" + (await ler()));
console.log(await p.evaluate(() => {
  const f = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).fontFamily : "—"; };
  return [
    "pixel titulo: " + f("[class*=TituloSecao-module__][class*=__texto]"),
    "mono: " + f("header nav a"),
    "archivo: " + f("[class*=CardDupla-module__][class*=__campos] dd"),
    "cursiva: " + f("[class*=CardDupla-module__][class*=__assinatura]"),
    "papel bg: " + getComputedStyle(document.querySelector("#servicos")).backgroundImage.slice(0, 160) + " | " + getComputedStyle(document.querySelector("#servicos")).backgroundColor,
    "fundo escuro: " + getComputedStyle(document.querySelector("[class*=Fundo-module__][class*=__fundo]")).backgroundImage.slice(0, 200),
  ].join("\n");
}));
await b.close();
