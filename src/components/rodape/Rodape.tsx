import Link from "next/link";
import { contato, destinoDoItem, navegacao, site } from "@/config/site";
import { Lettering } from "@/components/marca/Lettering";
import { Decalqzinho } from "@/components/marca/Decalqzinho";
import s from "./Rodape.module.css";

/**
 * Rodapé simples, no breu: marca, Decalqzinho, os mesmos destinos do menu
 * (config/site.ts), os dois canais reais e a volta ao topo (#topo é o
 * cabeçalho — a rolagem segue o modo de movimento, como as outras âncoras).
 * Na Home e nos cases.
 */
export function Rodape() {
  return (
    <footer className={s.rodape}>
      <div className={s.conteudo}>
        <div className={s.marca}>
          <Link href="/" className={s.lettering} aria-label={`${site.marca}, início`}>
            <Lettering />
          </Link>
          <Decalqzinho className={s.decalq} prefixo="decalq-rodape" />
          <p className={s.frase}>Portfólio criativo de Mateus e Guilherme.</p>
        </div>

        <nav className={s.nav} aria-label="Rodapé">
          <p className={s.rotulo}>Pelo site</p>
          <ul>
            {navegacao.map((item) => {
              const href = destinoDoItem(item);
              return href ? (
                <li key={item.rotulo}>
                  <Link href={href}>{item.rotulo}</Link>
                </li>
              ) : null;
            })}
          </ul>
        </nav>

        <div className={s.nav}>
          <p className={s.rotulo}>Fala com a gente</p>
          <ul>
            <li>
              <a href={contato.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp {contato.whatsappExibido}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a href={contato.instagram} target="_blank" rel="noopener noreferrer">
                Instagram {contato.instagramExibido}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </div>

        <a className={s.topo} href="#topo">
          Voltar ao topo
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 20V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <p className={s.final}>
        © {new Date().getFullYear()} {site.marca}
      </p>
    </footer>
  );
}
