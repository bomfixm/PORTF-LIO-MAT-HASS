/**
 * Carcaça bege do monitor CRT: corpo, rebaixo da tela, grade do alto-falante,
 * botões e pé. É a única "imagem" da televisão; a tela, o conteúdo e o LED
 * são camadas HTML por cima (ver Televisao.tsx).
 *
 * Sistema de coordenadas: 804 × 690. A abertura da tela fica em
 * x 76–728, y 68–514, e o LED em (668, 584) — Televisao.module.css usa esses
 * números em porcentagem.
 */
const GRADE = [557, 566, 575, 584, 593, 602];

function IconeEnergia({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g
      fill="none"
      stroke="#6d5c45"
      strokeWidth={r * 0.32}
      strokeLinecap="round"
    >
      <path
        d={`M${x - r * 0.62} ${y - r * 0.55} A ${r} ${r} 0 1 0 ${x + r * 0.62} ${y - r * 0.55}`}
      />
      <path d={`M${x} ${y - r * 1.05} V${y - r * 0.15}`} />
    </g>
  );
}

/** ↻ sobre o botão do meio, que agora é "Rever intro". */
function IconeRever({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g fill="none" stroke="#6d5c45" strokeWidth={r * 0.32} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${x + r * 0.9} ${y - r * 0.35} A ${r} ${r} 0 1 0 ${x + r * 0.55} ${y + r * 0.8}`} />
      <path d={`M${x + r * 0.95} ${y - r * 1.15} V${y - r * 0.3} H${x + r * 0.1}`} />
    </g>
  );
}

function Botao({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy + 2} r="17" fill="#000" opacity=".22" />
      <circle cx={cx} cy={cy} r="16.5" fill="#7a6750" />
      <circle cx={cx} cy={cy} r="14.5" fill="url(#tv-botao)" />
      <circle
        cx={cx}
        cy={cy}
        r="14.5"
        fill="none"
        stroke="#fff8ea"
        strokeOpacity=".45"
        strokeWidth="1"
      />
    </g>
  );
}

export function Carcaca({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      data-carcaca
      viewBox="0 0 804 690"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="tv-corpo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe0c7" />
          <stop offset=".5" stopColor="#dfcaab" />
          <stop offset="1" stopColor="#cfb894" />
        </linearGradient>
        <linearGradient id="tv-laterais" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2c1a" stopOpacity=".28" />
          <stop offset=".045" stopColor="#3a2c1a" stopOpacity="0" />
          <stop offset=".955" stopColor="#3a2c1a" stopOpacity="0" />
          <stop offset="1" stopColor="#3a2c1a" stopOpacity=".34" />
        </linearGradient>
        <linearGradient id="tv-rebaixo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9c8465" />
          <stop offset=".08" stopColor="#bba383" />
          <stop offset=".85" stopColor="#dccaab" />
          <stop offset="1" stopColor="#f3e5cc" />
        </linearGradient>
        <linearGradient id="tv-rebaixo-lados" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2c1a" stopOpacity=".18" />
          <stop offset=".06" stopColor="#3a2c1a" stopOpacity="0" />
          <stop offset=".94" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".18" />
        </linearGradient>
        <linearGradient id="tv-labio" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfa785" stopOpacity="0" />
          <stop offset=".55" stopColor="#a68d6b" stopOpacity=".55" />
          <stop offset="1" stopColor="#7c674b" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id="tv-pe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9c3a2" />
          <stop offset=".25" stopColor="#c4ab87" />
          <stop offset="1" stopColor="#8f785a" />
        </linearGradient>
        <linearGradient id="tv-pescoco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d4c37" />
          <stop offset="1" stopColor="#9a8262" />
        </linearGradient>
        <radialGradient id="tv-botao" cx=".38" cy=".32" r=".75">
          <stop offset="0" stopColor="#f3e7d2" />
          <stop offset=".55" stopColor="#d2bc99" />
          <stop offset="1" stopColor="#a58c6b" />
        </radialGradient>
        <linearGradient id="tv-liga" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2cfb1" />
          <stop offset="1" stopColor="#c3aa86" />
        </linearGradient>
        <radialGradient id="tv-chao" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#000" stopOpacity=".75" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Grão do plástico: pontinhos finos + manchas largas de uso. */}
        <filter
          id="tv-grao"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".85"
            numOctaves="2"
            seed="11"
            result="fino"
          />
          <feColorMatrix
            in="fino"
            type="matrix"
            values="0 0 0 0 .3  0 0 0 0 .24  0 0 0 0 .16  1.7 0 0 0 -1.02"
            result="pontos"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".011 .018"
            numOctaves="4"
            seed="5"
            result="largo"
          />
          <feColorMatrix
            in="largo"
            type="matrix"
            values="0 0 0 0 .42  0 0 0 0 .34  0 0 0 0 .22  .8 0 0 0 -.44"
            result="manchas"
          />
          <feMerge result="textura">
            <feMergeNode in="manchas" />
            <feMergeNode in="pontos" />
          </feMerge>
          <feComposite in="textura" in2="SourceAlpha" operator="in" result="aplicada" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="aplicada" />
          </feMerge>
        </filter>
      </defs>

      {/* sombra no chão */}
      <ellipse cx="402" cy="684" rx="360" ry="14" fill="url(#tv-chao)" />

      <g filter="url(#tv-grao)">
        {/* pé */}
        <path d="M246 624 H558 L576 656 H228 Z" fill="url(#tv-pescoco)" />
        <rect x="196" y="650" width="412" height="36" rx="9" fill="url(#tv-pe)" />
        <rect x="204" y="652" width="396" height="5" rx="2.5" fill="#f1e2c8" opacity=".75" />

        {/* corpo */}
        <rect x="2" y="2" width="800" height="626" rx="34" fill="url(#tv-corpo)" />
        <rect x="2" y="2" width="800" height="626" rx="34" fill="url(#tv-laterais)" />
        <path
          d="M2 590 H802 V594 A34 34 0 0 1 768 628 H36 A34 34 0 0 1 2 594 Z"
          fill="url(#tv-labio)"
        />
        <rect
          x="4"
          y="4"
          width="796"
          height="622"
          rx="32"
          fill="none"
          stroke="#fff7e8"
          strokeOpacity=".55"
          strokeWidth="2.5"
        />
        <rect
          x="1"
          y="1"
          width="802"
          height="628"
          rx="35"
          fill="none"
          stroke="#4a3b28"
          strokeOpacity=".6"
          strokeWidth="2"
        />

        {/* rebaixo da tela */}
        <rect x="52" y="44" width="700" height="494" rx="36" fill="url(#tv-rebaixo)" />
        <rect x="52" y="44" width="700" height="494" rx="36" fill="url(#tv-rebaixo-lados)" />
        <rect
          x="51"
          y="43"
          width="702"
          height="496"
          rx="37"
          fill="none"
          stroke="#7a664c"
          strokeOpacity=".55"
          strokeWidth="2"
        />
        <rect x="68" y="60" width="668" height="462" rx="30" fill="#14110b" />
        <rect
          x="68"
          y="60"
          width="668"
          height="462"
          rx="30"
          fill="none"
          stroke="#f5e8d0"
          strokeOpacity=".35"
          strokeWidth="1.5"
          transform="translate(0 1.5)"
        />

        {/* grade do alto-falante */}
        {GRADE.map((y) => (
          <g key={y}>
            <rect x="104" y={y} width="198" height="5" rx="2.5" fill="#4d3f2d" />
            <rect x="106" y={y + 4.2} width="194" height="1.4" rx=".7" fill="#fff6e4" opacity=".55" />
          </g>
        ))}

        {/* controles: brilho, energia, LED (camada HTML) e liga/desliga */}
        <g stroke="#6d5c45" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <circle cx="520" cy="584" r="4.6" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <path
              key={a}
              d="M520 575.2 V572.6"
              transform={`rotate(${a} 520 584)`}
            />
          ))}
        </g>
        <Botao cx={558} cy={584} />
        <IconeRever x={626} y={556} r={5.6} />
        <Botao cx={626} cy={584} />
        <circle cx="668" cy="584" r="8.5" fill="#3b3123" opacity=".55" />

        <rect x="694" y="566" width="72" height="38" rx="5" fill="#5a4936" />
        <rect x="697" y="568" width="66" height="32" rx="4" fill="url(#tv-liga)" />
        <rect
          x="697"
          y="568"
          width="66"
          height="32"
          rx="4"
          fill="none"
          stroke="#fff7e6"
          strokeOpacity=".5"
          strokeWidth="1"
        />
        <IconeEnergia x={730} y={586} r={6.6} />
      </g>
    </svg>
  );
}
