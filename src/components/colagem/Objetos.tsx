import { contornoRasgado, pixels } from "@/lib/desenho";

/**
 * Objetos da colagem ao redor da TV, um componente por peça. Cada um é um
 * SVG independente (decorativo) para poder ser posicionado, trocado por arte
 * definitiva ou animado sozinho. Filtros em Filtros.tsx.
 */

type P = { className?: string };
const svg = (vb: string, className?: string) => ({
  className,
  viewBox: vb,
  "aria-hidden": true as const,
  focusable: "false" as const,
});

/* ---------- papéis rasgados ---------- */

const ESTRELA_PAPEL = [
  [8, 12],
  [164, 4],
  [168, 272],
  [12, 278],
] as const;

/** Estrela de oito pontas (quatro longas, quatro curtas). */
function pontasEstrela(cx: number, cy: number, longa: number, curta: number, miolo: number, giro: number) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = ((i * 22.5 + giro - 90) * Math.PI) / 180;
    const r = i % 2 ? miolo : i % 4 === 0 ? longa : curta;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function PapelEstrela({ className }: P) {
  return (
    <svg {...svg("0 0 176 284", className)}>
      <path d={contornoRasgado(ESTRELA_PAPEL, { semente: 3, onda: 4, fibra: 1.6 })} fill="#e9e8f1" />
      <g filter="url(#cg-papel)">
        <path
          d={contornoRasgado(
            [
              [14, 18],
              [158, 11],
              [161, 265],
              [18, 271],
            ],
            { semente: 4, onda: 4.5, fibra: 1.5 },
          )}
          fill="#2a48dc"
        />
      </g>
      <polygon
        points={pontasEstrela(92, 124, 76, 54, 21, 6)}
        fill="#ece7dc"
        filter="url(#cg-impresso)"
      />
    </svg>
  );
}

const XADREZ_PAPEL = [
  [10, 18],
  [120, 4],
  [214, 20],
  [228, 120],
  [212, 210],
  [150, 262],
  [40, 268],
  [6, 160],
] as const;

export function PapelXadrez({ className }: P) {
  return (
    <svg {...svg("0 0 236 276", className)}>
      <defs>
        <pattern id="cg-xadrez" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
          <rect width="56" height="56" fill="#dcd8ce" />
          <rect width="28" height="28" fill="#161614" />
          <rect x="28" y="28" width="28" height="28" fill="#161614" />
        </pattern>
      </defs>
      <path d={contornoRasgado(XADREZ_PAPEL, { semente: 7, onda: 5, fibra: 1.6 })} fill="#efece4" />
      <g filter="url(#cg-papel)">
        <path
          d={contornoRasgado(
            XADREZ_PAPEL.map(([x, y]) => [x + (x < 118 ? 5 : -5), y + (y < 136 ? 5 : -5)] as const),
            { semente: 8, onda: 5, fibra: 1.4 },
          )}
          fill="url(#cg-xadrez)"
        />
      </g>
    </svg>
  );
}

const SORRISO_PAPEL = [
  [18, 34],
  [96, 22],
  [168, 6],
  [262, 26],
  [292, 118],
  [268, 196],
  [292, 284],
  [186, 296],
  [72, 278],
  [44, 232],
  [8, 190],
  [26, 112],
] as const;

export function PapelSorriso({ className }: P) {
  return (
    <svg {...svg("0 0 300 304", className)}>
      <path d={contornoRasgado(SORRISO_PAPEL, { semente: 11, onda: 6, fibra: 1.8 })} fill="#e8e7f0" />
      <g filter="url(#cg-papel)">
        <path
          d={contornoRasgado(
            SORRISO_PAPEL.map(([x, y]) => [x + (x < 150 ? 6 : -6), y + (y < 150 ? 6 : -6)] as const),
            { semente: 12, onda: 6, fibra: 1.6 },
          )}
          fill="#1f40d6"
        />
      </g>
      <g
        filter="url(#cg-giz)"
        fill="none"
        stroke="#f1cf3b"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M108 104 C 136 82, 196 86, 214 132 C 232 178, 200 226, 152 230 C 104 234, 76 196, 84 152 C 90 120, 114 98, 146 94" />
        <path d="M130 136 V 158" />
        <path d="M170 132 V 154" />
        <path d="M112 176 C 128 204, 176 210, 196 170" />
      </g>
    </svg>
  );
}

/** Círculo irregular de papel. */
function circuloPapel(cx: number, cy: number, r: number, semente: number) {
  const base: [number, number][] = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    const rr = r * (0.94 + 0.06 * Math.sin(i * 2.3 + semente));
    base.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return contornoRasgado(base, { semente, onda: 2.4, fibra: 1.3 });
}

export function PapelGlobo({ className }: P) {
  return (
    <svg {...svg("0 0 210 210", className)}>
      <g filter="url(#cg-papel)">
        <path d={circuloPapel(105, 105, 99, 21)} fill="#c983dc" filter="url(#cg-amassado)" />
      </g>
      <g
        transform="rotate(-14 105 106)"
        fill="none"
        stroke="#17121b"
        strokeWidth="5.2"
        strokeLinecap="round"
      >
        <circle cx="105" cy="106" r="62" />
        <ellipse cx="105" cy="106" rx="29" ry="62" />
        <path d="M105 44 V168" />
        <path d="M43 106 H167" />
        <path d="M54 74 Q105 88 156 74" />
        <path d="M54 138 Q105 124 156 138" />
      </g>
    </svg>
  );
}

/* ---------- formas lisas ---------- */

export function EstrelaLima({ className }: P) {
  const pontas = 13;
  const pts: string[] = [];
  for (let i = 0; i < pontas * 2; i++) {
    const a = (i / (pontas * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 44 + ((i * 7) % 5) : 74 + ((i * 13) % 19);
    pts.push(`${(103 + r * 1.16 * Math.cos(a)).toFixed(1)},${(92 + r * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <svg {...svg("0 0 206 184", className)}>
      <polygon points={pts.join(" ")} fill="#a9e630" filter="url(#cg-papel)" />
    </svg>
  );
}

/**
 * Tubo de massinha: o mesmo caminho em camadas — sombra, corpo, cor, brilho
 * difuso e reflexo — deslocadas para a luz vir de cima à esquerda.
 */
function Tubo({
  d,
  vb,
  largura,
  cores,
  className,
}: {
  d: string;
  vb: string;
  largura: number;
  cores: { sombra: string; corpo: string; cor: string; brilho: string };
  className?: string;
}) {
  const comum = {
    d,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg {...svg(vb, className)}>
      <path {...comum} stroke={cores.sombra} strokeWidth={largura} transform="translate(2.5 3.5)" />
      <path {...comum} stroke={cores.corpo} strokeWidth={largura} />
      <path {...comum} stroke={cores.cor} strokeWidth={largura * 0.74} transform="translate(-2 -2.6)" />
      <path
        {...comum}
        stroke={cores.brilho}
        strokeWidth={largura * 0.28}
        transform="translate(-5 -6.5)"
        filter="url(#cg-desfoque)"
        opacity=".9"
      />
      <path
        {...comum}
        stroke="#fff"
        strokeWidth={largura * 0.08}
        transform="translate(-6 -7.8)"
        opacity=".55"
        strokeDasharray="34 26 60 30"
      />
    </svg>
  );
}

export function TuboRosa({ className }: P) {
  return (
    <Tubo
      className={className}
      vb="0 0 132 270"
      d="M126 40 C 96 8, 30 12, 30 64 C 30 112, 100 104, 98 160 C 96 206, 38 196, 42 234 C 45 258, 72 256, 76 242"
      largura={28}
      cores={{ sombra: "#8e2f52", corpo: "#d9577f", cor: "#fa82a6", brilho: "#ffd0de" }}
    />
  );
}

export function TuboAmarelo({ className }: P) {
  return (
    <Tubo
      className={className}
      vb="0 0 252 206"
      d="M2 58 C 34 34, 74 30, 88 62 C 102 96, 56 116, 84 148 C 110 176, 150 134, 184 132 C 216 130, 232 156, 228 182"
      largura={30}
      cores={{ sombra: "#8c5c0a", corpo: "#dc9e16", cor: "#f8c935", brilho: "#fff1a8" }}
    />
  );
}

/* ---------- pixel art (adesivos) ---------- */

const MAO = [
  "     XX          ",
  "    X.gX         ",
  "    X.gX         ",
  "    X.gX         ",
  "    X.gXXX       ",
  "    X.gX.gXXX    ",
  "    X.gX.gX.gXX  ",
  "XXX X.gX.gX.gX.X ",
  "X..XX........X.gX",
  "X...X..........gX",
  " X.............gX",
  "  X............gX",
  "  X...........gX ",
  "   X..........gX ",
  "   X.........gX  ",
  "    X........gX  ",
  "    X.......gX   ",
  "     X......gX   ",
  "     XXXXXXXXX   ",
];

const SETA = [
  "X           ",
  "XX          ",
  "X.X         ",
  "X..X        ",
  "X...X       ",
  "X...gX      ",
  "X....gX     ",
  "X.....gX    ",
  "X......gX   ",
  "X.......gX  ",
  "X........gX ",
  "X......XXXXX",
  "X...X.gX    ",
  "X..XX.gX    ",
  "X.X  X.gX   ",
  "XX   X.gX   ",
  "X     X.gX  ",
  "      X.gX  ",
  "       XX   ",
];

function Pixel({ linhas, className }: { linhas: string[]; className?: string }) {
  const w = linhas[0].length * 10;
  const h = linhas.length * 10;
  return (
    <svg {...svg(`-16 -16 ${w + 32} ${h + 32}`, className)}>
      <g filter="url(#cg-adesivo)" shapeRendering="crispEdges">
        <path d={pixels(linhas, ".")} fill="#f6f4ee" />
        <path d={pixels(linhas, "g")} fill="#b9b5ab" />
        <path d={pixels(linhas, "X")} fill="#121210" />
      </g>
    </svg>
  );
}

export const CursorMao = ({ className }: P) => <Pixel linhas={MAO} className={className} />;
export const CursorSeta = ({ className }: P) => <Pixel linhas={SETA} className={className} />;

const BRILHO_PIXEL = ["..#..", ".#.#.", "#...#", ".#.#.", "..#.."];
const BRILHO_PIXEL_MIOLO = [".....", "..#..", ".###.", "..#..", "....."];

export function BrilhoPixel({ className }: P) {
  return (
    <svg {...svg("0 0 50 50", className)} shapeRendering="crispEdges">
      <path d={pixels(BRILHO_PIXEL, "#")} fill="var(--lima)" />
      <path d={pixels(BRILHO_PIXEL_MIOLO, "#")} fill="#6fa62a" />
    </svg>
  );
}

const ESTRELA_PIXEL = [
  "......#......",
  "......#......",
  "......#......",
  ".....###.....",
  ".....###.....",
  "....#####....",
  "..#########..",
  "#############",
  "..#########..",
  "....#####....",
  ".....###.....",
  ".....###.....",
  "......#......",
  "......#......",
  "......#......",
];

export function EstrelaPixel({ className }: P) {
  return (
    <svg {...svg("0 0 130 150", className)} shapeRendering="crispEdges">
      <path d={pixels(ESTRELA_PIXEL, "#")} fill="var(--lima)" />
    </svg>
  );
}

/* ---------- traços à mão ---------- */

function Traco({
  vb,
  caminhos,
  cor,
  largura,
  giz = true,
  className,
}: {
  vb: string;
  caminhos: string[];
  cor: string;
  largura: number;
  giz?: boolean;
  className?: string;
}) {
  return (
    <svg {...svg(vb, className)}>
      <g
        filter={giz ? "url(#cg-giz)" : undefined}
        fill="none"
        stroke={cor}
        strokeWidth={largura}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {caminhos.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

export const RabiscoGiz = ({ className }: P) => (
  <Traco
    className={className}
    vb="0 0 188 100"
    cor="#ebe6da"
    largura={7}
    caminhos={["M8 74 C 26 62, 44 46, 62 30 C 56 46, 48 62, 44 80 C 64 64, 86 48, 108 34 C 102 50, 96 66, 92 86 C 120 74, 150 64, 180 58"]}
  />
);

export const RabiscoAzul = ({ className }: P) => (
  <Traco
    className={className}
    vb="0 0 160 86"
    cor="#3150f2"
    largura={7.5}
    caminhos={["M6 76 L 70 40 L 42 54 L 126 12 L 92 46 L 154 32"]}
  />
);

export const RabiscoAzulCurto = ({ className }: P) => (
  <Traco
    className={className}
    vb="0 0 84 62"
    cor="#3150f2"
    largura={6.5}
    caminhos={["M6 10 C 30 6, 52 4, 76 8 L 14 30 C 36 26, 56 24, 78 28 L 22 52 C 40 50, 58 50, 74 52"]}
  />
);

export const AsteriscoGiz = ({ className }: P) => (
  <Traco
    className={className}
    vb="0 0 56 56"
    cor="#ebe6da"
    largura={4.6}
    caminhos={["M28 6 V50", "M8 16 L48 40", "M8 40 L48 16"]}
  />
);

/** Tiques de clique (riscos curtos irradiando), como os do Decalqzinho. */
export const Tiques = ({ className, cor = "#ebe6da" }: P & { cor?: string }) => (
  <Traco
    className={className}
    vb="0 0 60 60"
    cor={cor}
    largura={4.4}
    giz={false}
    caminhos={["M30 8 L34 26", "M8 22 L24 32", "M10 50 L26 46"]}
  />
);
