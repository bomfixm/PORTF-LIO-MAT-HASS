import type { CSSProperties, ComponentType } from "react";
import {
  AsteriscoGiz,
  BrilhoPixel,
  CursorMao,
  CursorSeta,
  EstrelaLima,
  EstrelaPixel,
  PapelEstrela,
  PapelGlobo,
  PapelSorriso,
  PapelXadrez,
  RabiscoAzul,
  RabiscoAzulCurto,
  RabiscoGiz,
  Tiques,
  TuboAmarelo,
  TuboRosa,
} from "./Objetos";
import { aleatorio } from "@/lib/desenho";
import s from "./Colagem.module.css";

/**
 * Posição de cada peça na composição, em `cqw` da caixa da composição
 * (100 = largura inteira): x, y (canto superior esquerdo), w (largura) e
 * r (giro em graus). `d` é o desktop, `m` o celular; sem `m` a peça some no
 * celular para não amontoar.
 *
 * `camada`: "atras" fica sob a TV (z 1), "frente" por cima (z 3). A TV é z 2.
 *
 * Referência do desktop: a caixa da composição corresponde ao trecho
 * x 90–1590, y 85–775 da imagem de referência (1 cqw = 15 px dela).
 *
 * `mov`: movimento próprio de cada peça (styles/movimento.css). Três
 * osciladores independentes — horizontal, vertical e giro — e a trajetória
 * sai da relação entre eles:
 *   diagonal / diagonal-inversa  X e Y juntos (ou opostos): vai e volta inclinado
 *   arco / arco-invertido        Y no dobro do ritmo de X: um U (ou ∩)
 *   laco                         Y um quarto de ciclo atrás de X: elipse
 *   oito                         Y no dobro do ritmo e defasado: um oito
 *   livre                        ciclos independentes: balanço que não se repete
 * dx e dy são o percurso total em px (desktop); rot é o giro para cada lado
 * em graus; cx/cy/cr são ciclos completos em segundos. O giro soma ao
 * ângulo original da peça (`r`), que fica preservado.
 */
type Pos = { x: number; y: number; w: number; r?: number };
type Trajeto =
  | "diagonal"
  | "diagonal-inversa"
  | "arco"
  | "arco-invertido"
  | "laco"
  | "oito"
  | "livre";
interface Mov {
  trajeto: Trajeto;
  dx: number;
  dy: number;
  rot: number;
  cx: number;
  /** só para "livre"; nas demais sai de cx */
  cy?: number;
  cr: number;
}
interface Peca {
  id: string;
  Desenho: ComponentType<{ className?: string }>;
  camada: "atras" | "frente";
  d: Pos;
  m?: Pos;
  mov: Mov;
}

export const PECAS: Peca[] = [
  // ——— lado esquerdo
  { id: "papel-estrela", Desenho: PapelEstrela, camada: "atras", d: { x: 13.2, y: 2, w: 11.4, r: -2 }, m: { x: -3, y: 1, w: 21, r: -4 },
    mov: { trajeto: "livre", dx: 8, dy: 16, rot: 3, cx: 8.6, cy: 7.4, cr: 8.2 } },
  { id: "tiques-mao", Desenho: Tiques, camada: "frente", d: { x: 7, y: 7.6, w: 3.4, r: -12 },
    mov: { trajeto: "livre", dx: 7, dy: 12, rot: 6, cx: 4.4, cy: 5, cr: 4 } },
  { id: "cursor-mao", Desenho: CursorMao, camada: "frente", d: { x: 9.6, y: 9.4, w: 8.4, r: -9 }, m: { x: 3, y: 9, w: 15, r: -9 },
    mov: { trajeto: "diagonal", dx: 14, dy: 20, rot: 5, cx: 4.6, cr: 5.4 } },
  { id: "brilho-pixel", Desenho: BrilhoPixel, camada: "frente", d: { x: 2.8, y: 14.4, w: 2.5 }, m: { x: 26, y: 5, w: 4.6 },
    mov: { trajeto: "laco", dx: 8, dy: 14, rot: 8, cx: 5.2, cr: 4.4 } },
  { id: "tique-papel", Desenho: Tiques, camada: "frente", d: { x: 16.6, y: 20.4, w: 3, r: 150 },
    mov: { trajeto: "livre", dx: 6, dy: 12, rot: 6, cx: 4.8, cy: 4.2, cr: 5.6 } },
  { id: "estrela-lima", Desenho: EstrelaLima, camada: "atras", d: { x: 4.8, y: 28.6, w: 14, r: -4 }, m: { x: 13, y: 91, w: 22, r: -4 },
    mov: { trajeto: "laco", dx: 10, dy: 18, rot: 8, cx: 7.6, cr: 6.4 } },
  { id: "papel-globo", Desenho: PapelGlobo, camada: "atras", d: { x: 1.4, y: 19.4, w: 13.6, r: -6 }, m: { x: -3, y: 79, w: 25, r: -6 },
    mov: { trajeto: "arco", dx: 14, dy: 20, rot: 4, cx: 8, cr: 7.2 } },
  { id: "tubo-rosa", Desenho: TuboRosa, camada: "atras", d: { x: 15.2, y: 24, w: 8.4 }, m: { x: -1, y: 49, w: 11 },
    mov: { trajeto: "arco-invertido", dx: 14, dy: 24, rot: 5, cx: 8.8, cr: 6.6 } },
  { id: "rabisco-giz", Desenho: RabiscoGiz, camada: "atras", d: { x: 0.4, y: 38.6, w: 12.4, r: -4 }, m: { x: 30, y: 102, w: 17, r: -4 },
    mov: { trajeto: "diagonal-inversa", dx: 16, dy: 14, rot: 3, cx: 6.2, cr: 7 } },

  // ——— lado direito
  { id: "papel-xadrez", Desenho: PapelXadrez, camada: "atras", d: { x: 75.4, y: 2.2, w: 15.4, r: 3 }, m: { x: 73, y: 0, w: 26, r: 3 },
    mov: { trajeto: "livre", dx: 9, dy: 18, rot: 3, cx: 8.8, cy: 7.8, cr: 9 } },
  { id: "tubo-amarelo", Desenho: TuboAmarelo, camada: "atras", d: { x: 75.6, y: 7.6, w: 16.6 }, m: { x: 66, y: 5, w: 24, r: -8 },
    mov: { trajeto: "arco", dx: 16, dy: 20, rot: 5, cx: 8.4, cr: 6 } },
  { id: "rabisco-azul", Desenho: RabiscoAzul, camada: "atras", d: { x: 89.6, y: 8.6, w: 10.4 }, m: { x: 46, y: 3, w: 15 },
    mov: { trajeto: "diagonal", dx: 14, dy: 16, rot: 4, cx: 5.6, cr: 6.8 } },
  { id: "estrela-pixel", Desenho: EstrelaPixel, camada: "frente", d: { x: 93.8, y: 16, w: 5.4 }, m: { x: 90, y: 32, w: 8 },
    mov: { trajeto: "laco", dx: 8, dy: 18, rot: 8, cx: 6, cr: 5 } },
  { id: "papel-sorriso", Desenho: PapelSorriso, camada: "atras", d: { x: 75.8, y: 25.2, w: 19.6, r: -2 }, m: { x: 68, y: 79, w: 31, r: -2 },
    mov: { trajeto: "livre", dx: 10, dy: 26, rot: 3, cx: 9, cy: 8, cr: 7.6 } },
  { id: "cursor-seta", Desenho: CursorSeta, camada: "frente", d: { x: 78.6, y: 20.2, w: 7.6, r: -10 },
    mov: { trajeto: "laco", dx: 12, dy: 20, rot: 5, cx: 4.4, cr: 5.2 } },
  { id: "tiques-seta", Desenho: Tiques, camada: "frente", d: { x: 86, y: 20.6, w: 3.8, r: 70 },
    mov: { trajeto: "livre", dx: 8, dy: 14, rot: 7, cx: 4.2, cy: 4.8, cr: 4 } },
  { id: "asterisco-giz", Desenho: AsteriscoGiz, camada: "frente", d: { x: 76.4, y: 40, w: 3.4 }, m: { x: 58, y: 103, w: 6 },
    mov: { trajeto: "laco", dx: 6, dy: 14, rot: 8, cx: 5.4, cr: 4.6 } },
  { id: "rabisco-azul-curto", Desenho: RabiscoAzulCurto, camada: "atras", d: { x: 94.2, y: 39.4, w: 5.2, r: -6 }, m: { x: 89, y: 100, w: 9, r: -6 },
    mov: { trajeto: "oito", dx: 12, dy: 18, rot: 4, cx: 8.6, cr: 6.2 } },
];

/**
 * Ciclo e fase de cada oscilador. Um oscilador vai de -metade a +metade em
 * meio ciclo e volta (CSS `alternate`, ease-in-out: para suave nas pontas e
 * fecha o ciclo sem salto). A fase é um atraso negativo: a peça já começa no
 * meio do caminho, cada uma num ponto diferente (sorteio com semente fixa).
 */
const sorteio = aleatorio(2026);
const fixo = (n: number) => +n.toFixed(2);

function osciladores(m: Mov) {
  const ox = sorteio() * m.cx;
  let cy = m.cx;
  let oy = ox;
  switch (m.trajeto) {
    case "diagonal":
      break;
    case "diagonal-inversa":
      oy = ox + m.cx / 2;
      break;
    case "arco":
      cy = m.cx / 2;
      break;
    case "arco-invertido":
      cy = m.cx / 2;
      oy = ox + cy / 2;
      break;
    case "laco":
      oy = ox + m.cx / 4;
      break;
    case "oito":
      cy = m.cx / 2;
      oy = ox + cy / 4;
      break;
    case "livre":
      cy = m.cy ?? m.cx * 0.87;
      oy = sorteio() * cy;
      break;
  }
  return {
    "--dx": m.dx,
    "--dy": m.dy,
    "--rot": m.rot,
    "--cx": `${fixo(m.cx)}s`,
    "--cy": `${fixo(cy)}s`,
    "--cr": `${fixo(m.cr)}s`,
    "--fx": `${fixo(-ox)}s`,
    "--fy": `${fixo(-(oy % cy))}s`,
    "--fr": `${fixo(-sorteio() * m.cr)}s`,
  };
}

const MOV = new Map(PECAS.map((p) => [p.id, osciladores(p.mov)]));

const vars = (p: Peca) => {
  const v: Record<string, string | number> = {
    ...MOV.get(p.id),
    "--x": p.d.x,
    "--y": p.d.y,
    "--w": p.d.w,
    "--r": `${p.d.r ?? 0}deg`,
  };
  if (p.m) {
    v["--xm"] = p.m.x;
    v["--ym"] = p.m.y;
    v["--wm"] = p.m.w;
    v["--rm"] = `${p.m.r ?? 0}deg`;
  }
  return v as CSSProperties;
};

/**
 * As peças, já posicionadas. Renderiza irmãs da TV dentro da caixa da
 * composição para que "atras" e "frente" se ordenem em relação a ela.
 *
 * Três camadas por peça, cada uma com um papel: `.peca` (posição, ângulo
 * original, entrada na intro — `data-objeto`), `[data-mov="a"]` (horizontal
 * + giro) e `[data-mov="b"]` (vertical + sombra). Assim a entrada da intro e
 * o movimento contínuo nunca disputam a mesma propriedade.
 */
export function Colagem() {
  return PECAS.map((p) => (
    <div
      key={p.id}
      className={s.peca}
      data-objeto={p.id}
      data-trajeto={p.mov.trajeto}
      data-camada={p.camada}
      data-celular={p.m ? "sim" : "nao"}
      style={vars(p)}
    >
      <div className={s.mov} data-mov="a">
        <div className={s.mov} data-mov="b">
          <p.Desenho className={s.desenho} />
        </div>
      </div>
    </div>
  ));
}
