import { aleatorio } from "@/lib/desenho";
import s from "./Rasgo.module.css";

/**
 * Borda de papel rasgado onde o breu da abertura vira papel claro (grade de
 * projetos e cases). Desenho determinístico (semente fixa): sai igual no
 * build e no navegador.
 *
 * Duas camadas: a fibra clara do rasgo, um pouco mais alta e irregular, e o
 * papel por cima. Acima do rasgo, pixels soltos — o papel "se desfaz" em
 * pixels na direção da tela da TV.
 */
const L = 1440;
const A = 80;

function bordaSuperior(semente: number, base: number, onda: number, passo: number) {
  const rnd = aleatorio(semente);
  let d = `M0 ${A}L0 ${base}`;
  let deriva = 0;
  for (let x = passo; x < L; x += passo * (0.6 + rnd() * 0.8)) {
    deriva = deriva * 0.55 + (rnd() - 0.5) * onda;
    d += `L${x.toFixed(1)} ${(base + deriva).toFixed(1)}`;
  }
  return `${d}L${L} ${base}L${L} ${A}Z`;
}

const FIBRA = bordaSuperior(31, 30, 26, 9);
const PAPEL = bordaSuperior(31, 38, 18, 14);

/** Pixels soltos acima do rasgo: posição em % da largura, altura em px. */
function pixelsSoltos(semente: number, quantos: number) {
  const rnd = aleatorio(semente);
  const cores = ["papel", "papel", "papel", "lima", "papel", "azul"] as const;
  return Array.from({ length: quantos }, (_, i) => ({
    x: (i / quantos) * 100 + rnd() * (100 / quantos) * 0.8,
    y: 6 + Math.pow(rnd(), 1.6) * 64,
    t: [6, 8, 10, 12, 14][Math.floor(rnd() * 5)],
    cor: cores[Math.floor(rnd() * cores.length)],
  }));
}

const PIXELS = pixelsSoltos(5, 34);

/**
 * `invertido`: o papel acaba em rasgo e o breu volta por baixo (contato) —
 * o mesmo desenho virado, com os pixels caindo no escuro.
 */
export function Rasgo({ className, invertido }: { className?: string; invertido?: boolean }) {
  return (
    <div
      className={`${s.rasgo} ${className ?? ""}`}
      data-invertido={invertido || undefined}
      aria-hidden="true"
    >
      <div className={s.pixels}>
        {PIXELS.map((p, i) => (
          <span
            key={i}
            data-cor={p.cor}
            style={{
              left: `${p.x}%`,
              bottom: `${p.y}%`,
              width: p.t,
              height: p.t,
            }}
          />
        ))}
      </div>
      <svg className={s.borda} viewBox={`0 0 ${L} ${A}`} preserveAspectRatio="none" focusable="false">
        <path d={FIBRA} className={s.fibra} />
        <path d={PAPEL} className={s.papel} />
      </svg>
    </div>
  );
}
