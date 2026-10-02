/**
 * Sequências da TV em Web Animations sobre as camadas reais do site
 * (`transform`/`opacity`, mais o recorte do título). O navegador anima
 * sozinho; nenhum estado React muda por quadro.
 *
 * Cada sequência é montada com fases reutilizáveis — apagar, ligar,
 * personagem, título e entradas — e termina exatamente no estado estável do
 * CSS (TV ligada ou desligada). Por isso encerrar, no fim ou por "Pular
 * intro", é só gravar o estado final em <html> e cancelar as animações.
 *
 * Preenchimento: as animações de entrada usam `forwards` (seguram o fim até
 * o encerramento) e partem do estado em que a camada já está — o CSS da cena
 * escura, o CSS da TV desligada ou o fim da fase anterior. Trechos em que
 * algo precisa ficar escondido usam `segurar` (sem preenchimento).
 *
 * Tempos em ms a partir do início de cada sequência.
 *
 * `suave` (movimento reduzido no sistema): a mesma coreografia, atenuada —
 * sem cintilação de LED, título e personagem, chuvisco fraco e sem saltos,
 * sem a faixa de luz rolando, entradas com menos escala e giro.
 */
type Lista = Animation[];

export const TEMPO = {
  intro: { liga: 300, personagem: 820, titulo: 1760, entradas: 1840 },
  rever: { apaga: 0, liga: 900, personagem: 1420, titulo: 2360 },
  ligar: { liga: 0, personagem: 520, titulo: 1150 },
  personagem: { abreEsquerdo: 270, abreDireito: 440, voo: 600, duracaoVoo: 540 },
  passoObjeto: 22,
  passoEntrada: 36,
  /** opacidade da luz verde do fundo com a TV desligada (CSS em Fundo) */
  luzApagada: 0.25,
};

/** Fração da largura do adesivo ocupada pela arte (viewBox -16…255 de 271). */
const ARTE_NO_ADESIVO = 243 / 271;

const visivel = (el: Element) => getComputedStyle(el).display !== "none";
const centro = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

function alvos(cena: HTMLElement) {
  const q = <T extends Element = HTMLElement>(sel: string, raiz: ParentNode = cena) =>
    raiz.querySelector<T>(sel);
  return {
    cena,
    carcaca: q<SVGElement>("[data-carcaca]"),
    led: q("[data-led]"),
    imagem: q("[data-tela-imagem]"),
    apagada: q("[data-tela-desligada]"),
    linha: q("[data-tela-linha]"),
    ponto: q("[data-tela-ponto]"),
    chuvisco: q("[data-tela-ruido]"),
    faixa: q("[data-tela-faixa]"),
    pixel: q("[data-decalq-pixel]"),
    adesivo: q("[data-adesivo]"),
    titulo: q("[data-titulo]"),
    tituloLed: q("[data-titulo-led]"),
    assinatura: q("[data-assinatura]"),
    luz: q("[data-fundo-luz]", document),
    olho: (nome: string) => q(`[data-olho-pixel='${nome}']`),
  };
}
type Alvos = ReturnType<typeof alvos>;

function animar(L: Lista, el: Element | null, quadros: Keyframe[], op: KeyframeAnimationOptions) {
  if (el) L.push(el.animate(quadros, { fill: "forwards", ...op, delay: Math.max(0, Number(op.delay ?? 0)) }));
}

/** Mantém um estilo entre `de` e `ate`; fora disso valem as outras camadas. */
function segurar(L: Lista, el: Element | null, estilo: Keyframe, de: number, ate: number) {
  if (el && ate > de) L.push(el.animate([estilo, estilo], { delay: de, duration: ate - de }));
}

/* ———————————————————— fases ———————————————————— */

/** Linha de energia, a imagem estica na vertical, LED, luz e interferência. */
function ligar(L: Lista, a: Alvos, t0: number, luzDe: number, carcacaDe = 1, suave = false) {
  if (carcacaDe < 1) {
    animar(L, a.carcaca, [{ opacity: carcacaDe }, { opacity: 1 }], {
      delay: t0,
      duration: 700,
      easing: "ease-out",
    });
  }
  animar(
    L,
    a.led,
    suave
      ? [{ opacity: 0 }, { opacity: 1 }]
      : [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 0.35, offset: 0.55 }, { opacity: 1 }],
    { delay: t0 - 40, duration: 280 },
  );
  animar(
    L,
    a.linha,
    [
      { opacity: 0, transform: "scaleX(0)" },
      { opacity: 1, transform: "scaleX(1)", offset: 0.25 },
      { opacity: 0.9, transform: "scaleX(1) scaleY(1)", offset: 0.42 },
      { opacity: 0, transform: "scaleX(1) scaleY(16)" },
    ],
    { delay: t0, duration: 460, easing: "ease-out" },
  );
  animar(L, a.apagada, [{ opacity: 1 }, { opacity: 0 }], { delay: t0 + 140, duration: 260 });
  animar(
    L,
    a.imagem,
    [
      { opacity: 0, transform: "scaleY(0.012)" },
      { opacity: 1, transform: "scaleY(0.012)", offset: 0.08 },
      { opacity: 1, transform: "scaleY(1.03)", offset: 0.72 },
      { opacity: 1, transform: "none" },
    ],
    { delay: t0 + 110, duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" },
  );
  animar(L, a.luz, [{ opacity: luzDe }, { opacity: 1 }], {
    delay: t0 + 120,
    duration: 1000,
    easing: "ease-out",
  });
  // interferência de TV antiga: chuvisco e uma faixa rolando
  const t = t0 + 340;
  if (suave) {
    // só um véu de chuvisco, sem saltos nem faixa de luz
    animar(L, a.chuvisco, [{ opacity: 0 }, { opacity: 0.1, offset: 0.4 }, { opacity: 0 }], {
      delay: t,
      duration: 420,
      easing: "ease-in-out",
    });
    return;
  }
  animar(
    L,
    a.chuvisco,
    [{ opacity: 0 }, { opacity: 0.42, offset: 0.15 }, { opacity: 0.12, offset: 0.4 }, { opacity: 0.3, offset: 0.62 }, { opacity: 0 }],
    { delay: t, duration: 380 },
  );
  animar(
    L,
    a.chuvisco,
    [
      { transform: "translate(0, 0)" },
      { transform: "translate(-7%, 4%)" },
      { transform: "translate(5%, -6%)" },
      { transform: "translate(-3%, 3%)" },
    ],
    { delay: t, duration: 380, easing: "steps(4, end)", fill: "none" },
  );
  animar(
    L,
    a.faixa,
    [
      { opacity: 0, transform: "translateY(-320%)" },
      { opacity: 1, offset: 0.15 },
      { opacity: 1, offset: 0.85 },
      { opacity: 0, transform: "translateY(640%)" },
    ],
    { delay: t + 20, duration: 440, easing: "ease-in" },
  );
}

/**
 * Decalqzinho pixelado: aparece de olhos fechados, dá a piscadinha (um olho,
 * depois o outro) e então voa até a moldura virando o adesivo azul (`voo`)
 * ou se desfaz na própria tela.
 */
function personagem(L: Lista, a: Alvos, t0: number, voo: boolean, suave = false) {
  const { pixel, adesivo } = a;
  const P = TEMPO.personagem;
  // medidas antes de qualquer animação do personagem
  const geo =
    voo && pixel && adesivo
      ? (() => {
          const p = centro(pixel.getBoundingClientRect());
          const d = centro(adesivo.getBoundingClientRect());
          return {
            dx: d.x - p.x,
            dy: d.y - p.y,
            alto: pixel.offsetHeight,
            escala: (adesivo.offsetWidth * ARTE_NO_ADESIVO) / pixel.offsetWidth,
          };
        })()
      : null;

  animar(
    L,
    pixel,
    suave
      ? [{ opacity: 0, transform: "scale(0.97)" }, { opacity: 1, transform: "none" }]
      : [
          { opacity: 0, transform: "scale(0.94)" },
          { opacity: 0.8, offset: 0.3 },
          { opacity: 0.25, offset: 0.5 },
          { opacity: 1, transform: "none" },
        ],
    { delay: t0, duration: 260 },
  );
  const troca = (nome: string, de: number, ate: number, quando: number) =>
    animar(L, a.olho(nome), [{ opacity: de }, { opacity: ate }], {
      duration: t0 + quando,
      easing: "steps(1, end)",
      fill: "both",
    });
  troca("e-fechado", 1, 0, P.abreEsquerdo);
  troca("e-aberto", 0, 1, P.abreEsquerdo);
  troca("d-fechado", 1, 0, P.abreDireito);
  troca("d-aberto", 0, 1, P.abreDireito);

  if (geo && pixel) {
    const destino = `translate(${geo.dx}px, ${geo.dy}px) scale(${geo.escala}) rotate(-6deg)`;
    animar(
      L,
      pixel,
      [
        { transform: "none", opacity: 1, color: "#b4f79c" },
        {
          transform: `translate(${geo.dx * 0.4}px, ${geo.dy * 0.1 - geo.alto * (suave ? 0.15 : 0.4)}px) scale(${(1 + geo.escala) / 2}) rotate(${suave ? -8 : -15}deg)`,
          offset: 0.45,
        },
        { transform: destino, opacity: 1, color: "#8cbaff", offset: 0.8 },
        { transform: destino, opacity: 0, color: "#8cbaff" },
      ],
      { delay: t0 + P.voo, duration: P.duracaoVoo, easing: "cubic-bezier(.5,0,.3,1)" },
    );
    animar(
      L,
      adesivo,
      suave
        ? [{ opacity: 0, transform: "scale(0.9)" }, { opacity: 1, transform: "none" }]
        : [
            { opacity: 0, transform: "scale(0.7)" },
            { opacity: 1, transform: "scale(1.14)", offset: 0.45 },
            { opacity: 1, transform: "scale(0.95)", offset: 0.72 },
            { opacity: 1, transform: "none" },
          ],
      { delay: t0 + P.voo + P.duracaoVoo * 0.74, duration: 440, easing: "ease-out" },
    );
  } else {
    animar(
      L,
      pixel,
      suave
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [{ opacity: 1 }, { opacity: 0.3, offset: 0.3 }, { opacity: 0.8, offset: 0.55 }, { opacity: 0 }],
      { delay: t0 + P.voo, duration: 260 },
    );
  }
}

/** PORTFÓLIO acende letra a letra; depois a assinatura. */
function titulo(L: Lista, a: Alvos, t0: number, esconderDesde?: number, suave = false) {
  if (esconderDesde !== undefined) {
    segurar(L, a.titulo, { opacity: 0 }, esconderDesde, t0);
    segurar(L, a.assinatura, { opacity: 0 }, esconderDesde, t0 + 320);
  }
  // largura zero no início (esquerda 0, direita 100%): sem lasca de brilho
  animar(
    L,
    a.titulo,
    [
      { opacity: 1, clipPath: "inset(-40% 100% -40% 0%)" },
      { opacity: 1, clipPath: "inset(-40% -10% -40% -10%)" },
    ],
    { delay: t0, duration: 360, easing: "steps(9, end)" },
  );
  if (!suave) {
    animar(
      L,
      a.tituloLed,
      [{ opacity: 1 }, { opacity: 0.5, offset: 0.25 }, { opacity: 1, offset: 0.5 }, { opacity: 0.75, offset: 0.7 }, { opacity: 1 }],
      { delay: t0 + 360, duration: 240 },
    );
  }
  animar(
    L,
    a.assinatura,
    [
      { opacity: 0, transform: "translateY(0.4em)" },
      { opacity: 1, transform: "none" },
    ],
    { delay: t0 + 320, duration: 300, easing: "ease-out" },
  );
}

/** Recortes do centro para fora; depois marca, menu e botões (só na intro). */
function entradas(L: Lista, a: Alvos, t0: number, suave = false) {
  const tv = a.cena.querySelector("[data-camada='tv']")?.getBoundingClientRect();
  const meio = tv ? centro(tv) : { x: innerWidth / 2, y: innerHeight / 2 };
  [...a.cena.querySelectorAll<HTMLElement>("[data-objeto]")]
    .filter(visivel)
    .map((el) => ({ el, d: Math.hypot(centro(el.getBoundingClientRect()).x - meio.x, centro(el.getBoundingClientRect()).y - meio.y) }))
    .sort((x, y) => x.d - y.d)
    .forEach(({ el }, i) => {
      const giro = i % 2 ? 9 : -9;
      animar(
        L,
        el,
        suave
          ? [
              { opacity: 0, transform: `scale(0.9) rotate(${giro / 3}deg)` },
              { opacity: 1, transform: "none" },
            ]
          : [
              { opacity: 0, transform: `scale(0.45) rotate(${giro}deg)` },
              { opacity: 1, transform: `scale(1.07) rotate(${-giro / 4}deg)`, offset: 0.6 },
              { opacity: 1, transform: "none" },
            ],
        { delay: t0 + i * TEMPO.passoObjeto, duration: 440, easing: "cubic-bezier(.2,.8,.3,1)" },
      );
    });
  [...document.querySelectorAll<HTMLElement>("[data-entra]")]
    .filter(visivel)
    .forEach((el, i) => {
      const deCima = el.closest("header") !== null;
      animar(
        L,
        el,
        [
          { opacity: 0, transform: `translateY(${(deCima ? -10 : 14) * (suave ? 0.4 : 1)}px)` },
          { opacity: 1, transform: "none" },
        ],
        { delay: t0 + 60 + i * TEMPO.passoEntrada, duration: 360, easing: "cubic-bezier(.2,.8,.3,1)" },
      );
    });
}

/** Desligar: a imagem se contrai numa linha, vira um ponto e apaga. */
function apagar(L: Lista, a: Alvos, t0: number) {
  animar(
    L,
    a.imagem,
    [
      { transform: "none", opacity: 1 },
      { transform: "scale(1, 0.006)", opacity: 1, offset: 0.42, easing: "cubic-bezier(.6,0,.9,.6)" },
      { transform: "scale(0.004, 0.006)", opacity: 1, offset: 0.72 },
      { transform: "scale(0.004, 0.006)", opacity: 0 },
    ],
    { delay: t0, duration: 520, easing: "ease-in" },
  );
  animar(
    L,
    a.linha,
    [
      { opacity: 0, transform: "scaleX(1)" },
      { opacity: 1, transform: "scaleX(1)", offset: 0.4 },
      { opacity: 1, transform: "scaleX(0.01)", offset: 0.72 },
      { opacity: 0, transform: "scaleX(0.01)" },
    ],
    { delay: t0, duration: 520 },
  );
  animar(
    L,
    a.ponto,
    [
      { opacity: 0, transform: "scale(0.3)" },
      { opacity: 0, transform: "scale(0.3)", offset: 0.4 },
      { opacity: 1, transform: "scale(1)", offset: 0.6 },
      { opacity: 0.7, transform: "scale(0.7)", offset: 0.8 },
      { opacity: 0, transform: "scale(0.2)" },
    ],
    { delay: t0, duration: 900 },
  );
  animar(L, a.apagada, [{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1 }], {
    delay: t0,
    duration: 700,
  });
  animar(L, a.led, [{ opacity: 1 }, { opacity: 0 }], { delay: t0 + 380, duration: 160 });
  animar(L, a.luz, [{ opacity: 1 }, { opacity: TEMPO.luzApagada }], {
    delay: t0 + 200,
    duration: 600,
  });
}

/* ———————————————————— sequências ———————————————————— */

/** Intro automática: parte da cena escura do CSS (`data-intro="tocando"`). */
export function sequenciaIntro(cena: HTMLElement, suave = false): Lista {
  const a = alvos(cena);
  const T = TEMPO.intro;
  const L: Lista = [];
  ligar(L, a, T.liga, 0, 0.55, suave);
  personagem(L, a, T.personagem, true, suave);
  titulo(L, a, T.titulo, undefined, suave);
  entradas(L, a, T.entradas, suave);
  return L;
}

/** "Rever intro": a TV apaga e refaz a sequência; menu e botões seguem ativos. */
export function sequenciaRever(cena: HTMLElement, suave = false): Lista {
  const a = alvos(cena);
  const T = TEMPO.rever;
  const P = TEMPO.personagem;
  const L: Lista = [];
  apagar(L, a, T.apaga);
  // o adesivo some quando a tela apaga e só volta quando o personagem pousa
  const pouso = T.personagem + P.voo + P.duracaoVoo * 0.74;
  segurar(L, a.adesivo, { opacity: 0 }, T.apaga + 300, pouso);
  ligar(L, a, T.liga, TEMPO.luzApagada, 1, suave);
  personagem(L, a, T.personagem, true, suave);
  titulo(L, a, T.titulo, T.apaga + 520, suave);
  return L;
}

/** Religar a partir da TV desligada (estado do CSS). */
export function sequenciaLigar(cena: HTMLElement, suave = false): Lista {
  const a = alvos(cena);
  const T = TEMPO.ligar;
  const L: Lista = [];
  ligar(L, a, T.liga, TEMPO.luzApagada, 1, suave);
  personagem(L, a, T.personagem, false, suave);
  titulo(L, a, T.titulo, 0, suave);
  return L;
}

export function sequenciaDesligar(cena: HTMLElement): Lista {
  const L: Lista = [];
  apagar(L, alvos(cena), 0);
  return L;
}

/**
 * "Rever intro" com as animações desligadas pelo visitante: trocas
 * diretas, sem deslocamento —
 * o Decalqzinho parado na tela por um instante e depois o PORTFÓLIO.
 */
export function sequenciaReverCalma(cena: HTMLElement): Lista {
  const a = alvos(cena);
  const L: Lista = [];
  segurar(L, a.pixel, { opacity: 1 }, 0, 1400);
  segurar(L, a.titulo, { opacity: 0 }, 0, 1400);
  segurar(L, a.assinatura, { opacity: 0 }, 0, 1400);
  return L;
}
