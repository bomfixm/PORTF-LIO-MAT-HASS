/**
 * Falhas de TV antiga, todas dentro da tela (`overflow: hidden`), em quatro
 * intensidades visualmente diferentes:
 *
 *   leve      120–220 ms    tremor horizontal, chuvisco, linhas da imagem mexem
 *   moderada  250–450 ms    faixas horizontais deslocadas + imagem duplicada
 *   forte     350–600 ms    perde o sincronismo vertical: a imagem rola e para
 *   pesada    1650–1900 ms  o quadro trava distorcido e assim fica: faixas
 *                           deslocadas que pulam de lugar, fantasma e
 *                           chuvisco andando; então solta e se recupera
 *
 * Para deslocar faixas e rolar a imagem são usadas três cópias da imagem da
 * tela (criadas uma vez, escondidas e fora da árvore de acessibilidade).
 * Nenhuma animação tem preenchimento: no fim, cópias, deslocamentos e
 * chuvisco voltam sozinhos ao estado normal.
 *
 * Tudo é Web Animations em `transform`, `opacity` e `clip-path`: o
 * navegador compõe a falha enquanto a página continua respondendo.
 *
 * `suave` (movimento reduzido no sistema): os mesmos quatro tipos, no mesmo
 * ritmo, com deslocamentos e distorções a 40%, chuvisco fraco e contínuo
 * (sem saltos), sem faixa de luz, sem cintilação da varredura e sem o
 * fantasma; a perda de sincronismo vira um escorregão curto em vez de rolar
 * a tela inteira, e o quadro da pesada fica parado, sem pular de lugar.
 */
export type TipoFalha = "leve" | "moderada" | "forte" | "pesada";

export const DURACAO: Record<TipoFalha, [number, number]> = {
  leve: [120, 220],
  moderada: [250, 450],
  forte: [350, 600],
  pesada: [1650, 1900],
};

/** Imagem normal entre o fim de uma falha e o começo da próxima. */
export const PAUSA_MS: [number, number] = [1000, 3000];

/**
 * Pesada, em tempo de execução ativa: a primeira entre 6 e 10 s depois da
 * intro; as seguintes 10,5–14,5 s depois do começo da anterior.
 */
export const PRIMEIRA_PESADA_MS: [number, number] = [6000, 10000];
export const ENTRE_PESADAS_MS: [number, number] = [10500, 14500];

const sorteia = ([min, max]: [number, number]) => min + Math.random() * (max - min);
const lado = () => (Math.random() < 0.5 ? -1 : 1);

function embaralhar<T>(lista: T[]) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

/** Duração máxima de uma falha menor (a forte). */
const MAIOR_MENOR = DURACAO.forte[1];

/**
 * Ritmo das falhas. `ativo` é o tempo de execução ativa em ms: o relógio só
 * anda enquanto as falhas podem acontecer (cena à vista, aba visível, TV
 * ligada e estável, animações ligadas), então pausas e trocas não contam.
 *
 * - Entre o fim de uma falha e o começo da próxima: 1–3 s, sorteados.
 * - A pesada cai no ponto marcado: quando ela está a até 3 s, a pausa é o
 *   que falta; antes disso, a pausa de uma falha menor é limitada para que
 *   sobre pelo menos 1 s de imagem normal antes da pesada.
 * - Entre as pesadas, falhas menores em sacos embaralhados — o primeiro com
 *   leve, moderada e forte; depois duas leves, uma moderada e uma forte —,
 *   nunca o mesmo tipo duas vezes seguidas.
 */
export function criarRitmo() {
  let pesadaEm = sorteia(PRIMEIRA_PESADA_MS);
  let saco = embaralhar<TipoFalha>(["leve", "moderada", "forte"]);
  let anterior: TipoFalha | null = null;

  const menor = () => {
    if (!saco.length) saco = embaralhar<TipoFalha>(["leve", "leve", "moderada", "forte"]);
    const i = Math.max(0, saco.findIndex((t) => t !== anterior));
    return saco.splice(i, 1)[0];
  };

  return {
    /** Espera até a próxima falha, a partir de agora. */
    pausa(ativo: number) {
      const falta = pesadaEm - ativo;
      if (falta <= PAUSA_MS[1]) return Math.max(falta, sorteia([PAUSA_MS[0], PAUSA_MS[0] + 400]));
      return sorteia([PAUSA_MS[0], Math.min(PAUSA_MS[1], falta - MAIOR_MENOR - PAUSA_MS[0])]);
    },
    /** Tipo da falha que começa agora. */
    tipo(ativo: number): TipoFalha {
      const tipo = ativo >= pesadaEm - 60 ? "pesada" : menor();
      if (tipo === "pesada") pesadaEm = ativo + sorteia(ENTRE_PESADAS_MS);
      anterior = tipo;
      return tipo;
    },
  };
}

/* ———————————————— camadas ———————————————— */

export interface CamadasFalha {
  imagem: HTMLElement;
  conteudo: HTMLElement;
  copiaA: HTMLElement;
  copiaB: HTMLElement;
  fantasma: HTMLElement;
  chuvisco: HTMLElement | null;
  faixa: HTMLElement | null;
  varredura: HTMLElement | null;
}

function copiar(imagem: HTMLElement, nome: string) {
  const c = imagem.cloneNode(true) as HTMLElement;
  for (const el of [c, ...c.querySelectorAll<HTMLElement>("*")]) {
    for (const at of [...el.attributes]) {
      if (at.name.startsWith("data-")) el.removeAttribute(at.name);
    }
  }
  c.setAttribute("data-tela-copia", nome);
  c.setAttribute("aria-hidden", "true");
  c.inert = true;
  c.style.visibility = "hidden";
  c.style.pointerEvents = "none";
  return c;
}

/** Cria as cópias ao lado da imagem original; `desfazer` remove tudo. */
export function prepararCamadas(tela: HTMLElement) {
  const imagem = tela.querySelector<HTMLElement>("[data-tela-imagem]");
  const conteudo = tela.querySelector<HTMLElement>("[data-tela-conteudo]");
  if (!imagem || !conteudo) return null;
  const copiaA = copiar(imagem, "a");
  const copiaB = copiar(imagem, "b");
  const fantasma = copiar(imagem, "fantasma");
  // o fantasma é só a imagem, sem o fundo verde, somada por cima
  (fantasma.firstElementChild as HTMLElement | null)?.style.setProperty("display", "none");
  fantasma.style.mixBlendMode = "screen";
  imagem.after(copiaA, copiaB, fantasma);
  const camadas: CamadasFalha = {
    imagem,
    conteudo,
    copiaA,
    copiaB,
    fantasma,
    chuvisco: tela.querySelector("[data-tela-ruido]"),
    faixa: tela.querySelector("[data-tela-faixa]"),
    varredura: tela.querySelector("[data-tela-varredura]"),
  };
  return {
    camadas,
    desfazer: () => [copiaA, copiaB, fantasma].forEach((c) => c.remove()),
  };
}

/* ———————————————— efeitos ———————————————— */

type Q = Keyframe[];
const salto = (k: Keyframe): Keyframe => ({ ...k, easing: "steps(1, end)" });
const visivel = { visibility: "visible" } as const;

/** Faixa horizontal da imagem (recorte), com altura e posição sorteadas. */
function banda(alturaMin: number, alturaMax: number, de = 6, ate = 94) {
  const alt = sorteia([alturaMin, alturaMax]);
  const topo = sorteia([de, Math.max(de, ate - alt)]);
  return `inset(${topo.toFixed(1)}% 0 ${(100 - topo - alt).toFixed(1)}% 0)`;
}

/** Desloca a faixa de luz (top: 40%, altura 9%) para uma altura da tela. */
const alturaDaFaixa = (centroPct: number) => `${((centroPct - 44.5) / 9) * 100}%`;

export function falhar(tipo: TipoFalha, c: CamadasFalha, suave = false): Animation[] {
  const L: Animation[] = [];
  const d = sorteia(DURACAO[tipo]);
  // no modo suave, deslocamentos e distorções a 40%
  const s = lado() * (suave ? 0.4 : 1);
  const anima = (el: Element | null, q: Q, op: KeyframeAnimationOptions = {}) => {
    if (el) L.push(el.animate(q, { duration: d, ...op }));
  };
  const chuvisco = (picos: number[], patamar = false) => {
    // suave: um véu fraco que sobe e desce, sem picos (na pesada, sobe,
    // fica e desce)
    const veu = Math.max(...picos) * 0.3;
    anima(
      c.chuvisco,
      !suave
        ? picos.map((opacity, i) => ({ opacity, offset: i / (picos.length - 1) }))
        : patamar
          ? [{ opacity: 0 }, { opacity: veu, offset: 0.2 }, { opacity: veu, offset: 0.8 }, { opacity: 0 }]
          : [{ opacity: 0 }, { opacity: veu }, { opacity: 0 }],
    );
  };
  const chuviscoAnda = (passos: number) =>
    !suave &&
    anima(
      c.chuvisco,
      Array.from({ length: passos }, () => ({
        transform: `translate(${sorteia([-9, 9]).toFixed(1)}%, ${sorteia([-9, 9]).toFixed(1)}%)`,
      })),
      { easing: `steps(${passos}, end)` },
    );

  if (tipo === "leve") {
    anima(c.conteudo, [
      salto({ transform: "none" }),
      salto({ transform: `translateX(${s * 2.2}%)`, offset: 0.12 }),
      salto({ transform: `translateX(${-s * 1.4}%) skewX(${s * 3}deg)`, offset: 0.34 }),
      salto({ transform: `translateX(${s * 1}%)`, offset: 0.56 }),
      salto({ transform: `translateX(${-s * 0.5}%)`, offset: 0.78 }),
      { transform: "none" },
    ]);
    chuvisco([0, 0.3, 0.12, 0.26, 0]);
    chuviscoAnda(4);
    // linhas da imagem: a varredura pula e duas linhas finas acendem
    if (!suave) anima(c.varredura, [
      salto({ transform: "none", opacity: 1 }),
      salto({ transform: "translateY(1.5px)", opacity: 0.6, offset: 0.25 }),
      salto({ transform: "translateY(-1px)", opacity: 1, offset: 0.55 }),
      { transform: "none", opacity: 1 },
    ]);
    const y = alturaDaFaixa(sorteia([15, 85]));
    if (!suave) anima(c.faixa, [
      salto({ opacity: 0, transform: `translateY(${y}) scaleY(0.25)` }),
      salto({ opacity: 1, transform: `translateY(${y}) scaleY(0.25)`, offset: 0.2 }),
      salto({ opacity: 0.8, transform: `translateY(calc(${y} + 260%)) scaleY(0.2)`, offset: 0.55 }),
      { opacity: 0, transform: `translateY(calc(${y} + 260%)) scaleY(0.2)` },
    ]);
  }

  if (tipo === "moderada") {
    const b1 = banda(9, 16, 6, 50);
    const b1b = banda(9, 16, 20, 70);
    const b2 = banda(8, 14, 52, 94);
    anima(c.copiaA, [
      salto({ ...visivel, clipPath: b1, transform: `translateX(${s * 4}%)` }),
      salto({ ...visivel, clipPath: b1, transform: `translateX(${s * 2.4}%)`, offset: 0.35 }),
      salto({ ...visivel, clipPath: b1b, transform: `translateX(${s * 5}%)`, offset: 0.62 }),
      { ...visivel, clipPath: b1b, transform: `translateX(${s * 1.2}%)` },
    ]);
    anima(
      c.copiaB,
      [
        salto({ ...visivel, clipPath: b2, transform: `translateX(${-s * 3.2}%)` }),
        salto({ ...visivel, clipPath: b2, transform: `translateX(${-s * 1.4}%)`, offset: 0.5 }),
        { ...visivel, clipPath: b2, transform: `translateX(${-s * 2.2}%)` },
      ],
      { delay: d * 0.15, duration: d * 0.7 },
    );
    if (!suave) anima(c.fantasma, [
      { ...visivel, opacity: 0, transform: `translate(${s * 1.8}%, -0.6%)` },
      { ...visivel, opacity: 0.34, transform: `translate(${s * 1.8}%, -0.6%)`, offset: 0.2 },
      { ...visivel, opacity: 0.22, transform: `translate(${s * 2.2}%, -0.6%)`, offset: 0.7 },
      { ...visivel, opacity: 0, transform: `translate(${s * 2.2}%, -0.6%)` },
    ]);
    chuvisco([0, 0.15, 0.06, 0.12, 0]);
    chuviscoAnda(4);
  }

  if (tipo === "forte" && suave) {
    // escorregão vertical curto e suave, sem rolar a tela inteira
    anima(c.imagem, [
      { transform: "none" },
      { transform: `translate(${s * 1}%, -7%)`, offset: 0.45 },
      { transform: "translateY(1.5%)", offset: 0.75 },
      { transform: "none" },
    ], { easing: "ease-in-out" });
    chuvisco([0, 0.28, 0]);
  }

  if (tipo === "forte" && !suave) {
    // a imagem sobe uma tela inteira; a cópia vem logo atrás, separada pela
    // faixa escura do retraço, e para exatamente onde a original estava
    const vao = 7;
    const ys = [0, -58, -100 - vao - 6, -100 - vao + 2, -100 - vao];
    const offs = [0, 0.32, 0.68, 0.85, 1];
    const passo = { easing: "cubic-bezier(.35,0,.45,1)" };
    anima(
      c.imagem,
      ys.map((y, i) => ({ transform: `translate(${i === 2 ? s * 1.5 : 0}%, ${y}%)`, offset: offs[i], ...passo })),
    );
    anima(
      c.copiaA,
      ys.map((y, i) => ({
        ...visivel,
        transform: `translate(${i === 2 ? s * 1.5 : 0}%, ${y + 100 + vao}%)`,
        offset: offs[i],
        ...passo,
      })),
    );
    chuvisco([0, 0.28, 0.14, 0.22, 0]);
    chuviscoAnda(5);
  }

  if (tipo === "pesada") {
    // defeito do primeiro ao último quadro: tranco → trava distorcida (e
    // assim fica) → solta e volta. Marcos em ms, convertidos para a duração.
    const em = (ms: number) => ms / d;
    const ini = em(90); // trava
    const fim = em(d - 120); // destrava: só um resto de deslocamento
    // sem o suave, o quadro escorrega duas vezes e as faixas pulam de lugar
    const trechos = suave ? [ini] : [ini, ini + (fim - ini) * 0.38, ini + (fim - ini) * 0.7];
    const quebras = [
      `translate(${-s * 3.5}%, 2%) skewX(${s * 7}deg) scale(1.03, 1.07)`,
      `translate(${-s * 2.2}%, -1.2%) skewX(${s * 5}deg) scale(1.03, 1.05)`,
      `translate(${-s * 4}%, 1.4%) skewX(${s * 8}deg) scale(1.04, 1.07)`,
    ];
    anima(c.imagem, [
      salto({ transform: `translateX(${s * 2}%) skewX(${-s * 3}deg)` }),
      ...trechos.map((offset, i) => salto({ transform: quebras[i], offset })),
      salto({ transform: `translateX(${s * 1.2}%)`, offset: fim }),
      { transform: "none" },
    ]);
    const travada = (el: HTMLElement, estado: () => [string, string]) =>
      anima(el, [
        salto({ visibility: "hidden" }),
        ...trechos.map((offset) => {
          const [clipPath, transform] = estado();
          return salto({ ...visivel, clipPath, transform, offset });
        }),
        salto({ visibility: "hidden", offset: fim }),
        { visibility: "hidden" },
      ]);
    travada(c.copiaA, () => [banda(10, 17, 8, 42), `translateX(${s * sorteia([8, 12])}%) skewX(${s * 7}deg)`]);
    travada(c.copiaB, () => [banda(9, 15, 52, 92), `translateX(${-s * sorteia([7, 10])}%) skewX(${-s * 5}deg)`]);
    if (!suave) anima(c.fantasma, [
      salto({ visibility: "hidden", opacity: 0 }),
      salto({ ...visivel, opacity: 0.36, transform: `translate(${s * 3}%, 1.5%)`, offset: trechos[0] }),
      salto({ ...visivel, opacity: 0.24, transform: `translate(${-s * 2}%, -1%)`, offset: trechos[1] }),
      salto({ ...visivel, opacity: 0.32, transform: `translate(${s * 2.5}%, 1%)`, offset: trechos[2] }),
      salto({ visibility: "hidden", opacity: 0, offset: fim }),
      { visibility: "hidden", opacity: 0 },
    ]);
    // chuvisco do começo ao fim, oscilando sem estourar o brilho
    chuvisco([0.22, 0.42, 0.3, 0.4, 0.28, 0.38, 0.3, 0.4, 0.26, 0.36, 0.18, 0], true);
    chuviscoAnda(Math.round(d / 70));
    const [y1, y2] = [alturaDaFaixa(sorteia([20, 50])), alturaDaFaixa(sorteia([50, 80]))];
    if (!suave) anima(c.faixa, [
      salto({ opacity: 0 }),
      salto({ opacity: 0.6, transform: `translateY(${y1}) scaleY(1.4)`, offset: trechos[0] }),
      salto({ opacity: 0.5, transform: `translateY(${y2}) scaleY(1.1)`, offset: trechos[1] }),
      salto({ opacity: 0, offset: fim }),
      { opacity: 0 },
    ]);
  }

  return L;
}
