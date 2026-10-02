import { secoes, whatsappCom } from "@/config/site";
import { mensagemServico, servicos } from "@/data/servicos";
import { TituloSecao } from "@/components/titulo/TituloSecao";
import { EstrelaPixel, Tiques } from "@/components/colagem/Objetos";
import { IconeServico } from "./IconeServico";
import papel from "@/components/papel/Papel.module.css";
import s from "./SecaoServicos.module.css";

/**
 * "O que a gente cria" — depois da dupla, no mesmo papel claro, antes de
 * o papel acabar no contato.
 * Cada serviço é uma etiqueta de papel (canto cortado, ilhós, barbante),
 * com número em LED, ícone em pixel colado como adesivo e um atalho para
 * conversar sobre ele no WhatsApp, com a mensagem já escrita.
 */
export function SecaoServicos() {
  return (
    <section
      id={secoes.servicos.id}
      className={`${papel.papel} ${s.secao}`}
      aria-labelledby="servicos-titulo"
    >
      <div className={s.conteudo}>
        <header className={s.topo}>
          <p className={s.selo}>
            <span className={s.seloNumero}>{String(servicos.length).padStart(2, "0")}</span>
            frentes, uma dupla
          </p>
          <TituloSecao id="servicos-titulo" linhas={["O que a", "gente cria"]} marcador="rosa" tamanho="faixa" fluxo="linha" />
          <p className={s.intro}>
            Do site ao vídeo, do sistema ao painel de dados. Escolhe uma frente
            e chama a gente pra conversar.
          </p>
          <EstrelaPixel className={s.estrela} />
          <Tiques className={s.tiques} cor="var(--tinta)" />
        </header>

        <ol className={s.lista}>
          {servicos.map((sv) => (
            <li key={sv.id} className={s.item} data-cor={sv.cor} data-servico={sv.id}>
              <article className={s.etiqueta} aria-labelledby={`servico-${sv.id}`}>
                <span className={s.barbante} aria-hidden="true" />
                <span className={s.ilhos} aria-hidden="true" />
                <div className={s.cabeca}>
                  <span className={s.numero} aria-hidden="true">
                    {sv.numero}
                  </span>
                  <span className={s.adesivo}>
                    <IconeServico tipo={sv.icone} className={s.icone} />
                  </span>
                </div>
                <h3 id={`servico-${sv.id}`} className={s.nome}>
                  {sv.titulo}
                </h3>
                <p className={s.descricao}>{sv.descricao}</p>
                <a
                  className={s.acao}
                  href={whatsappCom(mensagemServico(sv))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M12 3.2c5 0 8.8 3.4 8.8 7.9s-3.8 7.9-8.8 7.9c-1.2 0-2.3-.2-3.4-.5L3.6 20.6l1.6-4.1C3.9 15.1 3.2 13.2 3.2 11.1 3.2 6.6 7 3.2 12 3.2z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Conversar sobre isso
                  <span className="sr-only">: {sv.titulo} (WhatsApp, abre em nova aba)</span>
                </a>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
