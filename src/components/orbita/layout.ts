// só os destaques da Home: o catálogo completo não gira
import { destaques as projetos, type Imagem, type Projeto } from "@/data/projetos";

/**
 * Composição da órbita: anéis (raio, altura, inclinação, sentido) e as
 * telas em cada um. Tudo sai do catálogo — nenhum projeto novo; repetições
 * são outras telas reais do mesmo case.
 *
 * Câmera dentro dos anéis, um pouco atrás do eixo: as telas da frente ficam
 * inteiras e legíveis, as dos lados passam perto e saem pela borda — a
 * sensação de estar cercado. As telas olham para o eixo (côncavas para
 * quem vê).
 *
 * As 7 capas ficam no(s) anel(éis) do meio, que dão mais de uma volta:
 * todos os projetos passam pela frente, e são essas capas que voam até os
 * cards.
 */
export interface Anel {
  raio: number;
  altura: number;
  /** amplitude da ondulação vertical ao longo do anel (anel inclinado) */
  inclina: number;
  faseOnda: number;
  /** multiplica o giro; o sinal é o sentido */
  velocidade: number;
  /** inclinação lateral das telas (rad) */
  rolagem: number;
}

export interface PainelDef {
  anel: number;
  /** posição no anel (rad) */
  angulo: number;
  projeto: Projeto;
  imagem: Imagem;
  /** largura em unidades do mundo; altura sai da proporção da imagem */
  largura: number;
  /** é a capa que voa até o card na grade */
  voa: boolean;
  /** 0–1: atraso na montagem/saída, para não acontecer tudo junto */
  atraso: number;
}

export interface Camera {
  fov: number;
  /** pose durante o giro */
  y: number;
  z: number;
  /** pose no começo da entrada (mais longe) */
  y0: number;
  z0: number;
  /** ponto para onde olha */
  olharY: number;
  olharZ: number;
}

export interface Composicao {
  nome: "desktop" | "celular";
  camera: Camera;
  /** voltas do anel do meio ao longo da sequência */
  voltas: number;
  /** curvatura das telas: raio de curvatura = raio do anel × curva */
  curva: number;
  aneis: Anel[];
  paineis: PainelDef[];
}

const TAU = Math.PI * 2;
const p = (i: number) => projetos[i % projetos.length];

/** atraso determinístico, espalhado (sem Math.random: igual a cada carga) */
const atraso = (i: number) => ((i * 0.618034) % 1 + 1) % 1;

function montar(
  nome: Composicao["nome"],
  camera: Camera,
  aneis: Anel[],
  grupos: { anel: number; deslocamento: number; itens: { projeto: Projeto; imagem: Imagem; largura: number; voa?: boolean }[] }[],
  voltas: number,
  curva: number,
): Composicao {
  const paineis: PainelDef[] = [];
  for (const g of grupos) {
    g.itens.forEach((it, i) => {
      paineis.push({
        anel: g.anel,
        angulo: ((i + g.deslocamento) / g.itens.length) * TAU,
        projeto: it.projeto,
        imagem: it.imagem,
        largura: it.largura,
        voa: !!it.voa,
        atraso: atraso(paineis.length + 1),
      });
    });
  }
  return { nome, camera, voltas, curva, aneis, paineis };
}

/** 18 telas: 7 capas, 7 seções internas, 4 telas de celular. */
export const DESKTOP = montar(
  "desktop",
  { fov: 44, y: 0.25, z: 6, y0: 1.8, z0: 12.5, olharY: 0, olharZ: -10 },
  [
    { raio: 9, altura: 0, inclina: 0.55, faseOnda: 0.6, velocidade: 1, rolagem: 0.035 },
    { raio: 12.5, altura: 4.25, inclina: 0.85, faseOnda: 2.1, velocidade: -0.72, rolagem: 0.07 },
    { raio: 12, altura: -4.15, inclina: 0.7, faseOnda: 4.2, velocidade: 0.86, rolagem: -0.06 },
  ],
  [
    {
      anel: 0,
      deslocamento: 0,
      itens: projetos.map((pr) => ({ projeto: pr, imagem: pr.imagens.capa, largura: 5.4, voa: true })),
    },
    {
      anel: 1,
      deslocamento: 0.5,
      itens: [1, 3, 5, 0, 2, 4].map((i) => ({ projeto: p(i), imagem: p(i).imagens.secao, largura: 4.8 })),
    },
    {
      anel: 2,
      deslocamento: 0.25,
      itens: [
        { projeto: p(6), imagem: p(6).imagens.secao, largura: 4.8 },
        { projeto: p(0), imagem: p(0).imagens.celular, largura: 1.85 },
        { projeto: p(2), imagem: p(2).imagens.celular, largura: 1.85 },
        { projeto: p(4), imagem: p(4).imagens.celular, largura: 1.85 },
        { projeto: p(5), imagem: p(5).imagens.celular, largura: 1.85 },
      ],
    },
  ],
  1.15,
  0.62,
);

/**
 * Celular: 14 telas em quatro anéis empilhados — a tela em pé tem altura de
 * sobra e pouca largura. As capas se dividem entre os dois anéis do meio
 * (4 + 3), maiores; em cada faixa costuma haver uma tela de frente, então
 * ficam 3–4 telas legíveis por vez.
 */
export const CELULAR = montar(
  "celular",
  { fov: 64, y: 0.2, z: 4.4, y0: 1.4, z0: 9.5, olharY: 0, olharZ: -8 },
  [
    { raio: 6.2, altura: 2.55, inclina: 0.3, faseOnda: 0.6, velocidade: 1, rolagem: 0.03 },
    { raio: 6.2, altura: -1.75, inclina: 0.3, faseOnda: 2.4, velocidade: -0.82, rolagem: -0.03 },
    { raio: 8.5, altura: 5.3, inclina: 0.4, faseOnda: 1.1, velocidade: 0.7, rolagem: 0.05 },
    { raio: 8, altura: -5.1, inclina: 0.4, faseOnda: 3.7, velocidade: 1.1, rolagem: -0.05 },
  ],
  [
    {
      anel: 0,
      deslocamento: 0,
      itens: [0, 2, 4, 6].map((i) => ({ projeto: p(i), imagem: p(i).imagens.capa, largura: 3.9, voa: true })),
    },
    {
      anel: 1,
      deslocamento: 0.5,
      itens: [1, 3, 5].map((i) => ({ projeto: p(i), imagem: p(i).imagens.capa, largura: 3.9, voa: true })),
    },
    {
      anel: 2,
      deslocamento: 0.25,
      itens: [4, 1, 6].map((i) => ({ projeto: p(i), imagem: p(i).imagens.secao, largura: 3.3 })),
    },
    {
      anel: 3,
      deslocamento: 0.15,
      itens: [0, 3, 5, 2].map((i) => ({ projeto: p(i), imagem: p(i).imagens.celular, largura: 1.6 })),
    },
  ],
  1.1,
  0.62,
);

export const composicaoPara = (largura: number) => (largura < 760 ? CELULAR : DESKTOP);
