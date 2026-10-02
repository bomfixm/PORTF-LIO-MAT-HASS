import { pixels } from "@/lib/desenho";
import type { IconeServico as Tipo } from "@/data/servicos";

/**
 * Ícones dos serviços em pixel, desenhados na mesma grade da colagem
 * (lib/desenho.ts): "#" = tinta, "o" = cor do adesivo. 11 × 11.
 */
const ICONES: Record<Tipo, string[]> = {
  site: [
    "###########",
    "#o.o.o....#",
    "###########",
    "#.........#",
    "#.ooo.###.#",
    "#.ooo.....#",
    "#.ooo.###.#",
    "#.........#",
    "###########",
    "....###....",
    "..#######..",
  ],
  backend: [
    "...........",
    "..##....##.",
    ".##......##",
    ".#...o....#",
    "##..oo....#",
    "#...o.o...#",
    "##....oo..#",
    ".#.....o..#",
    ".##......##",
    "..##....##.",
    "...........",
  ],
  ia: [
    ".....#.....",
    ".....#.....",
    "....###....",
    "...#ooo#...",
    "####ooo####",
    "...#ooo#...",
    "....###....",
    ".....#..#..",
    ".....#.###.",
    "........#..",
    "...........",
  ],
  social: [
    "###########",
    "#.........#",
    "#...#.....#",
    "#...##....#",
    "#...#o#...#",
    "#...#oo#..#",
    "#...#o#...#",
    "#...##....#",
    "#...#.....#",
    "#.........#",
    "###########",
  ],
  automacao: [
    "...#####...",
    "..#.....##.",
    ".#......###",
    ".#.....####",
    "#..........",
    "#...ooo...#",
    "..........#",
    "####.....#.",
    "###......#.",
    ".##.....#..",
    "...#####...",
  ],
  dados: [
    "#..........",
    "#.......oo.",
    "#.......oo.",
    "#....oo.oo.",
    "#....oo.oo.",
    "#.oo.oo.oo.",
    "#.oo.oo.oo.",
    "#.oo.oo.oo.",
    "#.oo.oo.oo.",
    "#..........",
    "###########",
  ],
};

export function IconeServico({ tipo, className }: { tipo: Tipo; className?: string }) {
  const grade = ICONES[tipo];
  return (
    <svg
      className={className}
      viewBox="0 0 110 110"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path d={pixels(grade, "o")} fill="var(--cor-icone, var(--lima))" />
      <path d={pixels(grade, "#")} fill="var(--tinta)" />
    </svg>
  );
}
