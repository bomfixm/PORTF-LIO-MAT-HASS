import Link from "next/link";
import { destinoDoItem, navegacao, site } from "@/config/site";
import { Lettering } from "@/components/marca/Lettering";
import { BotaoMovimento } from "@/components/movimento/BotaoMovimento";
import s from "./Cabecalho.module.css";

/* Asterisco lima desenhado à mão, ao lado do lettering. */
function Asterisco({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="9" strokeLinecap="round">
        <path d="M52 50 L40 7" />
        <path d="M52 50 L82 14" />
        <path d="M52 50 L95 42" />
        <path d="M52 50 L71 91" />
        <path d="M52 50 L30 88" />
        <path d="M52 50 L5 56" />
      </g>
    </svg>
  );
}

/* Três riscos lima no canto direito, como na referência. */
function Faisca({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 64" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <path d="M9 40 L12 18" />
        <path d="M24 44 L38 22" />
        <path d="M36 58 L54 47" />
      </g>
    </svg>
  );
}

export function Cabecalho() {
  return (
    <header id="topo" className={s.cabecalho}>
      <Link
        href="/"
        className={s.marca}
        aria-label={`${site.marca}, início`}
        data-entra
      >
        <Lettering className={s.lettering} />
        <Asterisco className={s.asterisco} />
      </Link>

      <nav className={s.nav} aria-label="Principal">
        <ul className={s.lista}>
          {navegacao.map((item, i) => {
            const href = destinoDoItem(item);
            // ponto azul da referência, no primeiro item
            const ponto = i === 0 && (
              <span className={s.ponto} aria-hidden="true" />
            );
            return (
              <li key={item.rotulo} data-entra>
                {href && !item.externo ? (
                  // seção da Home: navegação do Next, sem recarregar (a
                  // intro não volta) e com rolagem até a âncora
                  <Link className={s.link} href={href}>
                    {ponto}
                    {item.rotulo}
                  </Link>
                ) : href ? (
                  <a
                    className={s.link}
                    href={href}
                    {...(item.externo
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {ponto}
                    {item.rotulo}
                    {item.externo && (
                      <span className="sr-only">
                        {" "}
                        (WhatsApp, abre em nova aba)
                      </span>
                    )}
                  </a>
                ) : (
                  // Seção ainda não existe: sem link, marcado "em breve".
                  <a
                    className={s.link}
                    role="link"
                    aria-disabled="true"
                    title="Em breve"
                  >
                    {ponto}
                    {item.rotulo}
                    <span className="sr-only"> (em breve)</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={s.extras}>
        <BotaoMovimento />
        <span data-entra>
          <Faisca className={s.faisca} />
        </span>
      </div>
    </header>
  );
}
