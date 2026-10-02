/**
 * Fonte única do progresso da órbita. Um objeto mutável, fora do React:
 * o ScrollTrigger (com scrub) escreve `p`; a cena 3D, as variáveis CSS do
 * palco e a entrada dos cards só leem. Nada aqui dispara renderização React.
 *
 * Faixas (medidas no navegador, em fração do trilho):
 *   0 … entrada        o palco sobe na janela e as telas se montam
 *   entrada … folha    palco preso: giro em fundo escuro, depois as telas
 *                      se afastam e somem
 *   folha … 1          a folha de papel com a grade sobe sobre o palco e as
 *                      capas voam até os cards
 * `entrada` = altura do palco / altura do trilho; `folha` = 1 − entrada
 * (a folha começa a subir quando falta uma janela para o fim).
 */
export interface EstadoOrbita {
  p: number;
  entrada: number;
  folha: number;
}

export const criarEstado = (): EstadoOrbita => ({ p: 0, entrada: 0.25, folha: 0.75 });

export const limitar = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Posição de `p` dentro da faixa [a, b], de 0 a 1. */
export const faixa = (p: number, a: number, b: number) => limitar((p - a) / (b - a));

export const suave = (t: number) => t * t * (3 - 2 * t);

export const suaveCubica = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const misturar = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Trecho orbital: do começo do trilho até o giro dos anéis terminar
 * (folha + 0,05). É a faixa que move a órbita (montagem.ts) e a régua do
 * título PROJETOS no palco.
 */
export const fimDoGiro = (e: EstadoOrbita) => e.folha + 0.05;

/**
 * Título PROJETOS do palco, em fração do trecho orbital: inteiro até 85%,
 * some suavemente até 99% — acompanha o giro e sai na passagem para a
 * grade, antes de a folha (busca, filtros, cards) chegar à altura dele.
 */
export const TITULO = [0.85, 0.99] as const;

export const opacidadeTitulo = (e: EstadoOrbita) =>
  1 - suave(faixa(e.p / fimDoGiro(e), TITULO[0], TITULO[1]));

/** Os cards da grade recebem a imagem quando a capa voadora chega. */
export const CHEGADA = [0.955, 0.985] as const;

/** Evento para saltos programáticos (Ir direto, Voltar): sem suavização. */
export const EVENTO_SALTO = "decalq:salto";

export function avisarSalto() {
  window.dispatchEvent(new Event(EVENTO_SALTO));
}
