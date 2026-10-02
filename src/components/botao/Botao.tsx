import Link from "next/link";
import { contornoRasgado } from "@/lib/desenho";
import s from "./Botao.module.css";

/* Recorte de papel rasgado do botão principal (300 × 72, esticado). */
const RASGO = contornoRasgado(
  [
    [3, 4],
    [297, 2],
    [298, 69],
    [2, 70],
  ],
  { semente: 23, onda: 2.2, fibra: 1.3 },
);

export function IconeSeta() {
  return (
    <svg className={s.icone} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M3.5 12h16M13 5.5l6.5 6.5-6.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconeBalao() {
  return (
    <svg className={s.icone} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 3.2c5 0 8.8 3.4 8.8 7.9s-3.8 7.9-8.8 7.9c-1.2 0-2.3-.2-3.4-.5L3.6 20.6l1.6-4.1C3.9 15.1 3.2 13.2 3.2 11.1 3.2 6.6 7 3.2 12 3.2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconeVolta() {
  return (
    <svg className={s.icone} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M20.5 12h-16M11 5.5L4.5 12l6.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconeExterno() {
  return (
    <svg className={s.icone} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M9 5H5v14h14v-4M13 4h7v7M20 4l-9.5 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Papel lima rasgado do botão principal, para quem imita o botão (cards). */
export function PapelRasgado({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 72"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={RASGO} />
    </svg>
  );
}

/**
 * Botões do site (abertura, grade e cases). São links: seções e cases,
 * WhatsApp, sites publicados.
 * `externo` abre em nova aba e avisa isso a quem usa leitor de tela;
 * `interno` navega pelo Next (sem recarregar: a intro não volta).
 * `tom="papel"` adapta o contorno às áreas claras.
 *
 * `href` null = destino ainda não existe (seção de uma etapa futura): o
 * botão mantém o visual, mas não é link — fica marcado "em breve" e
 * indisponível para tecnologias assistivas.
 */
export function Botao({
  href,
  variante,
  externo,
  interno,
  tom = "escuro",
  icone,
  iconeAntes,
  onClick,
  children,
  ...resto
}: {
  href: string | null;
  variante: "principal" | "contorno";
  externo?: boolean;
  interno?: boolean;
  tom?: "escuro" | "papel";
  icone?: React.ReactNode;
  /** ícone à esquerda do rótulo (voltar) */
  iconeAntes?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
} & Record<`data-${string}`, string>) {
  const pendente = href === null;
  const conteudo = (
    <>
      {variante === "principal" && <PapelRasgado className={s.papel} />}
      {iconeAntes}
      <span className={s.rotulo}>{children}</span>
      {icone}
      {externo && !pendente && (
        <span className="sr-only"> (abre em nova aba)</span>
      )}
      {pendente && (
        <span className={s.emBreve}>
          <span className="sr-only"> — </span>em breve
        </span>
      )}
    </>
  );
  const comum = {
    ...resto,
    className: s.botao,
    "data-variante": variante,
    "data-tom": tom,
    onClick,
  };
  if (interno && href) {
    return (
      <Link {...comum} href={href}>
        {conteudo}
      </Link>
    );
  }
  return (
    <a
      {...comum}
      {...(pendente
        ? { role: "link", "aria-disabled": true }
        : { href })}
      data-pendente={pendente || undefined}
      {...(externo && !pendente
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {conteudo}
    </a>
  );
}
