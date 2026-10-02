/**
 * O Decalqzinho, a partir do arquivo original da marca
 * (public/brand/decalqzinho.png, 239 × 160). A geometria é a mesma medida no
 * projeto anterior: janela girada -9°, olhos em arco, contorno do cursor
 * traçado do PNG e as duas cores do degradê do próprio arquivo. O desenho não
 * recebe brilho nem cor nova.
 *
 * Os olhos são paths separados (`data-olho`) para a piscadinha da etapa 2.
 *
 * `prefixo` mantém únicos os ids de degradê e máscara quando houver mais de
 * um Decalqzinho na mesma página.
 */
const CURSOR =
  "M151 76 L217 109 L215 117 L198 124 L211 141 L211 150 L200 157 L182 139 L171 158 L162 158 L148 90 L147 80 L150 77 Z";
const GIRO = "translate(86 77) rotate(-9)";
const JANELA = { x: -79.65, y: -68.51, width: 165.28, height: 137.3, rx: 16 };
const TIQUES = ["M200.25 40.75 L192.75 62.25", "M211.75 78.25 L231.25 65.75"];

function Simbolo({ prefixo }: { prefixo: string }) {
  const grad = `${prefixo}-grad`;
  const mask = `${prefixo}-mask`;
  return (
    <>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8cbaff" />
          <stop offset="1" stopColor="#5697f8" />
        </linearGradient>
        {/* buracos da janela (corpo + três bolinhas) e o vão do cursor */}
        <mask
          id={mask}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="239"
          height="160"
        >
          <rect width="239" height="160" fill="#fff" />
          <g transform={GIRO} fill="#000">
            <rect x="-64.84" y="-31" width="138.61" height="84" rx="9" />
            <circle cx="-50.8" cy="-49.75" r="6.5" />
            <circle cx="-28.45" cy="-49.75" r="6.5" />
            <circle cx="-6.5" cy="-49.75" r="6.5" />
          </g>
          <path
            d={CURSOR}
            fill="#000"
            stroke="#000"
            strokeWidth="18"
            strokeLinejoin="round"
          />
        </mask>
      </defs>

      <g fill={`url(#${grad})`}>
        <g mask={`url(#${mask})`}>
          <rect transform={GIRO} {...JANELA} />
        </g>
        <g
          transform={GIRO}
          fill="none"
          stroke={`url(#${grad})`}
          strokeWidth="11"
          strokeLinecap="round"
        >
          <path data-olho="esquerdo" d="M-38.4 10.75 A 14 14 0 0 1 -10.68 10.75" />
          <path data-olho="direito" d="M17.6 9.95 A 14 14 0 0 1 45.32 9.95" />
        </g>
        <path
          d={CURSOR}
          stroke={`url(#${grad})`}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <g stroke={`url(#${grad})`} strokeWidth="13.5" strokeLinecap="round">
          {TIQUES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
    </>
  );
}

export function Decalqzinho({
  className,
  prefixo = "decalq",
}: {
  className?: string;
  prefixo?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 239 160"
      aria-hidden="true"
      focusable="false"
    >
      <Simbolo prefixo={prefixo} />
    </svg>
  );
}

/**
 * Versão adesivo: o mesmo desenho sobre um recorte de papel branco que
 * acompanha o contorno (janela inteira, cursor e tiques), com sombra curta de
 * papel colado. O miolo da janela mostra o papel, como no adesivo da
 * referência.
 */
export function DecalqzinhoAdesivo({
  className,
  prefixo = "decalq-adesivo",
}: {
  className?: string;
  prefixo?: string;
}) {
  const sombra = `${prefixo}-sombra`;
  const recorte = (
    <g
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="22"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <rect transform={GIRO} {...JANELA} />
      <path d={CURSOR} />
      {TIQUES.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
  return (
    <svg
      className={className}
      viewBox="-16 -16 271 192"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={sombra} x="-10%" y="-10%" width="125%" height="130%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <g color="#000" opacity="0.5" transform="translate(4 7)" filter={`url(#${sombra})`}>
        {recorte}
      </g>
      <g color="#f7f4ee">{recorte}</g>
      <Simbolo prefixo={prefixo} />
    </svg>
  );
}
