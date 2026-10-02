/**
 * Geradores dos desenhos da colagem. Tudo é determinístico (semente fixa):
 * o mesmo contorno sai no build e em qualquer renderização, sem diferença
 * entre servidor e cliente.
 */

type Ponto = readonly [number, number];

/** PRNG mulberry32: rápido, pequeno e repetível a partir da semente. */
export function aleatorio(semente: number) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function quebrar(
  base: readonly Ponto[],
  rnd: () => number,
  passo: number,
  amplitude: number,
): Ponto[] {
  const pts: Ponto[] = [];
  for (let i = 0; i < base.length; i++) {
    const [x0, y0] = base[i];
    const [x1, y1] = base[(i + 1) % base.length];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const n = Math.max(1, Math.round(len / passo));
    const nx = -dy / len;
    const ny = dx / len;
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const j = (rnd() - 0.5) * 2 * amplitude;
      pts.push([x0 + dx * t + nx * j, y0 + dy * t + ny * j]);
    }
  }
  return pts;
}

const caminho = (pts: readonly Ponto[]) =>
  "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";

/**
 * Contorno de papel rasgado a partir de um polígono base: uma passada larga
 * (ondulação do rasgo) e outra fina (fibras). Amplitudes em unidades do
 * viewBox de quem desenha.
 */
export function contornoRasgado(
  base: readonly Ponto[],
  {
    semente,
    onda = 5,
    fibra = 1.4,
  }: { semente: number; onda?: number; fibra?: number },
): string {
  const rnd = aleatorio(semente);
  const largo = quebrar(base, rnd, 22, onda);
  return caminho(quebrar(largo, rnd, 4.5, fibra));
}

/**
 * Pixel art em um único `path` por cor. Cada linha do desenho é uma string;
 * cada caractere, um pixel. Corridas horizontais da mesma cor viram um só
 * retângulo, o que mantém o SVG curto.
 */
export function pixels(linhas: readonly string[], cor: string, tam = 10): string {
  let d = "";
  linhas.forEach((linha, y) => {
    let x = 0;
    while (x < linha.length) {
      if (linha[x] !== cor) {
        x++;
        continue;
      }
      let fim = x;
      while (linha[fim] === cor) fim++;
      d += `M${x * tam} ${y * tam}h${(fim - x) * tam}v${tam}h${-(fim - x) * tam}z`;
      x = fim;
    }
  });
  return d;
}
