import { secoes } from "@/config/site";
import { dupla } from "@/data/dupla";
import { TituloSecao } from "@/components/titulo/TituloSecao";
import { caminhoQR } from "@/lib/qr";
import { archivo, cursiva } from "@/lib/fontes-cartao";
import { CardDupla } from "./CardDupla";
import papel from "@/components/papel/Papel.module.css";
import s from "./SecaoDupla.module.css";

/** Tesoura em pixel da linha de recorte entre a grade de projetos e A dupla. */
const TESOURA = [
  ".##.......##",
  "#..#.....#..",
  "#..#....#...",
  ".####..#....",
  "....###.....",
  "....###.....",
  ".####..#....",
  "#..#....#...",
  "#..#.....#..",
  ".##.......##",
];

function Tesoura({ className }: { className?: string }) {
  let d = "";
  TESOURA.forEach((linha, y) =>
    [...linha].forEach((c, x) => {
      if (c === "#") d += `M${x * 10} ${y * 10}h10v10h-10z`;
    }),
  );
  return (
    <svg className={className} viewBox="0 0 120 100" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <path d={d} fill="var(--tinta)" />
    </svg>
  );
}

/**
 * A dupla: dois passes no formato CREATIVE STUDIO PASS, com o mesmo
 * destaque — lado a lado quando cabem dois passes horizontais, um embaixo
 * do outro no tablet; no celular cada passe se reorganiza em pé. Vem logo
 * depois dos projetos e abre com uma linha de recorte (o papel continua da
 * grade) e o título "Duas cabeças, muitas ideias". Os serviços vêm depois.
 */
export function SecaoDupla() {
  return (
    <section
      id={secoes.dupla.id}
      className={`${papel.papel} ${s.secao} ${archivo.variable} ${cursiva.variable}`}
      aria-labelledby="dupla-titulo"
    >
      <div className={s.recorte} aria-hidden="true">
        <Tesoura className={s.tesoura} />
      </div>

      <div className={s.conteudo}>
        <header className={s.topo}>
          <p className={s.selo}>A dupla</p>
          <TituloSecao id="dupla-titulo" linhas={["Duas cabeças,", "muitas ideias"]} marcador="amarelo" tamanho="compacto" className={s.titulo} />
          <p className={s.intro}>
            Mateus e Guilherme, os dois por trás da WEB DECALQ. Vira o passe:
            no verso tem o WhatsApp de cada um.
          </p>
        </header>

        <ul className={s.cards}>
          {dupla.map((p) => (
            <li key={p.id} className={s.lugar}>
              {/* QR gerado no build (servidor): a biblioteca não vai ao navegador */}
              <CardDupla pessoa={p} qr={caminhoQR(p.whatsapp.url)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
