// Mixagem e MP4 final: sintetiza os efeitos sonoros com ffmpeg (lavfi), põe cada fala e cada
// efeito no seu tempo (adelay), normaliza em ~ −14 LUFS (loudnorm em duas passadas) e junta
// com o vídeo mudo do render.mjs.
//
//   node mixar.mjs   (precisa de saida/video-mudo.mp4 e saida/sons.json)
//   → saida/ideia-foragida-1080x1920.mp4
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(aqui, "saida");
const dirSfx = path.join(saida, "sfx");
fs.rmSync(dirSfx, { recursive: true, force: true });
fs.mkdirSync(dirSfx, { recursive: true });

const { duracao, sons } = JSON.parse(fs.readFileSync(path.join(saida, "sons.json"), "utf8"));
const { falas } = JSON.parse(fs.readFileSync(path.join(aqui, "voz", "tempos.json"), "utf8"));

function ff(args, { capturar = false } = {}) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-y", ...args], { encoding: "utf8", maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error(`ffmpeg falhou:\n${r.stderr.slice(-3000)}`);
  return capturar ? r.stderr : "";
}

// ruído branco dentro do aevalsrc: random(0) é determinístico (semente fixa)
const RUIDO = "(2*random(0)-1)";
const fonte = (expr, d) => `aevalsrc=exprs='${expr}':s=48000:d=${d}`;

// cada receita: grafo lavfi que termina em [s]
const receitas = {
  // TV de tubo ligando: estalo, zumbido que sobe e chiado que some
  tv: () =>
    `${fonte(`0.5*sin(2*PI*(50*t+260*t*t))*min(1,t*40)*exp(-4*t)`, 0.6)}[a];` +
    `${fonte(`${RUIDO}*0.5*exp(-7*t)`, 0.6)},highpass=f=2500[b];` +
    `${fonte(`${RUIDO}*exp(-90*t)`, 0.6)},lowpass=f=1800[c];` +
    `[a][b][c]amix=inputs=3:normalize=0[s]`,
  // recorte batendo na borda da tela (leve)
  bate: () =>
    `${fonte(`0.9*sin(2*PI*150*t)*exp(-22*t)`, 0.25)}[a];${fonte(`${RUIDO}*0.6*exp(-60*t)`, 0.25)},lowpass=f=2200[b];[a][b]amix=inputs=2:normalize=0[s]`,
  // atravessa a tela: estouro com queda de tom
  rompe: () =>
    `${fonte(`0.8*sin(2*PI*(620*t-900*t*t))*exp(-9*t)`, 0.35)}[a];${fonte(`${RUIDO}*0.7*exp(-18*t)`, 0.35)},bandpass=f=1600:t=h:w=1400[b];[a][b]amix=inputs=2:normalize=0[s]`,
  // passagem de ar
  whoosh: ({ d = 0.42 }) =>
    `${fonte(`${RUIDO}*pow(sin(PI*t/${d}),2)`, d)},highpass=f=350,lowpass=f=3800,volume=1.4[s]`,
  // a janela batendo em cima do recorte
  batida: () =>
    `${fonte(`1.0*sin(2*PI*(110*t-60*t*t))*exp(-13*t)`, 0.4)}[a];${fonte(`${RUIDO}*0.8*exp(-45*t)`, 0.4)},lowpass=f=1300[b];[a][b]amix=inputs=2:normalize=0,aecho=0.6:0.3:40:0.25,volume=2.4[s]`,
  // carimbo de borracha: baque grave e seco
  carimbo: () =>
    `${fonte(`1.1*sin(2*PI*(80*t-40*t*t))*exp(-10*t)`, 0.55)}[a];${fonte(`${RUIDO}*1.0*exp(-35*t)`, 0.55)},lowpass=f=1500[b];[a][b]amix=inputs=2:normalize=0,aecho=0.7:0.4:55:0.3,volume=2.2[s]`,
  // papel rasgando: ruído áspero com picos irregulares
  rasgo: ({ d = 0.55 }) =>
    `${fonte(`${RUIDO}*(0.5+0.5*sin(2*PI*31*t)*sin(2*PI*7*t))*min(1,t*30)*exp(-2.5*t)`, d)},bandpass=f=2600:t=h:w=3000,tremolo=f=43:d=0.6,volume=2.2[s]`,
  // o papel abrindo
  papel: () => `${fonte(`${RUIDO}*pow(sin(PI*t/0.85),1.5)`, 0.85)},highpass=f=700,lowpass=f=5000,tremolo=f=22:d=0.5,volume=1.1[s]`,
  // pop de adesivo/rótulo
  pop: () => `${fonte(`sin(2*PI*(950*t-3600*t*t))*exp(-28*t)`, 0.14)},volume=0.9[s]`,
  // canetinha riscando
  risco: ({ d = 1 }) =>
    `${fonte(`${RUIDO}*(0.55+0.45*sin(2*PI*8.5*t))*min(1,t*20)*min(1,(${d}-t)*12)`, d)},bandpass=f=3200:t=h:w=2400,volume=1.1[s]`,
  // teclado digitando
  teclas: ({ d = 1.2 }) =>
    `${fonte(`${RUIDO}*lt(mod(t+0.013*sin(t*37),0.071),0.007)*(0.6+0.4*sin(t*53))`, d)},highpass=f=1200,volume=1.5[s]`,
  // pass pousando
  baque: () =>
    `${fonte(`0.9*sin(2*PI*95*t)*exp(-16*t)`, 0.3)}[a];${fonte(`${RUIDO}*0.5*exp(-40*t)`, 0.3)},lowpass=f=700[b];[a][b]amix=inputs=2:normalize=0[s]`,
  // card virando
  virada: () =>
    `${fonte(`${RUIDO}*pow(sin(PI*t/0.26),2)`, 0.26)},bandpass=f=2400:t=h:w=2000[a];${fonte(`0.5*sin(2*PI*1400*t)*exp(-50*(t-0.24)*(t-0.24)*400)`, 0.3)}[b];[a][b]amix=inputs=2:normalize=0,volume=1.3[s]`,
  // adesivo descolando
  descolar: () =>
    `${fonte(`${RUIDO}*min(1,t*6)*exp(-3*t)`, 0.45)},bandpass=f=4200:t=h:w=3000,tremolo=f=70:d=0.9,volume=2[s]`,
};

// volume de cada tipo na mixagem (a voz fica em 1)
const nivel = { tv: 0.5, bate: 0.45, rompe: 0.5, whoosh: 0.32, batida: 0.6, carimbo: 0.75, rasgo: 0.45, papel: 0.3, pop: 0.3, risco: 0.22, teclas: 0.3, baque: 0.5, virada: 0.35, descolar: 0.4 };

const faixas = falas.map((f) => ({ arq: path.join(aqui, "voz", f.arquivo), t: f.inicio, vol: 1 }));
sons.forEach((s, i) => {
  const r = receitas[s.tipo];
  if (!r) throw new Error("efeito sem receita: " + s.tipo);
  const arq = path.join(dirSfx, `${String(i).padStart(2, "0")}-${s.tipo}.wav`);
  ff(["-v", "error", "-filter_complex", r(s) + ";[s]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=mono[o]", "-map", "[o]", arq]);
  faixas.push({ arq, t: s.t, vol: nivel[s.tipo] * (s.v ?? 1) });
});

// mixagem bruta
const entradas = faixas.flatMap((f) => ["-i", f.arq]);
const grafo =
  faixas
    .map((f, i) => {
      const ms = Math.max(0, Math.round(f.t * 1000));
      return `[${i}:a]aformat=sample_rates=48000:channel_layouts=mono,volume=${f.vol.toFixed(3)},adelay=${ms}:all=1[f${i}]`;
    })
    .join(";") +
  ";" +
  faixas.map((_, i) => `[f${i}]`).join("") +
  `amix=inputs=${faixas.length}:normalize=0:duration=longest,apad,atrim=0:${duracao},alimiter=limit=0.95:level=false[mix]`;
const bruto = path.join(saida, "mix-bruto.wav");
ff(["-v", "error", ...entradas, "-filter_complex", grafo, "-map", "[mix]", "-ac", "2", "-ar", "48000", bruto]);

// loudnorm em duas passadas → −14 LUFS, pico −1,5 dBTP
const alvo = "I=-14:TP=-1.5:LRA=11";
const medida = ff(["-i", bruto, "-af", `loudnorm=${alvo}:print_format=json`, "-f", "null", "-"], { capturar: true });
const m = JSON.parse(medida.slice(medida.lastIndexOf("{"), medida.lastIndexOf("}") + 1));
const norm =
  `loudnorm=${alvo}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}` +
  `:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`;

const video = path.join(saida, "video-mudo.mp4");
const final = path.join(saida, "ideia-foragida-1080x1920.mp4");
ff([
  "-v", "error", "-i", video, "-i", bruto,
  "-map", "0:v", "-map", "1:a",
  "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30",
  "-af", norm, "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
  "-t", String(duracao), "-movflags", "+faststart", final,
]);

// conferência
const conf = ff(["-i", final, "-af", "ebur128=peak=true", "-f", "null", "-"], { capturar: true });
const resumo = conf.slice(conf.lastIndexOf("Summary:"));
console.log(final);
console.log(resumo.trim());
