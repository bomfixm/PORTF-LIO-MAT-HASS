import Link from "next/link";
import Image from "next/image";
import {
  ROTULO_STATUS,
  dominio,
  eDestaque,
  projetos,
  rotaDoCase,
  vizinhos,
  type Projeto,
} from "@/data/projetos";
import { Botao, IconeExterno } from "@/components/botao/Botao";
import { Moldura } from "@/components/projetos/Moldura";
import { Rasgo } from "@/components/papel/Rasgo";
import { DecalqzinhoAdesivo } from "@/components/marca/Decalqzinho";
import { EstrelaPixel, Tiques } from "@/components/colagem/Objetos";
import { GaleriaProvider, Ampliar } from "./Galeria";
import { Voltar } from "./Voltar";
import papel from "@/components/papel/Papel.module.css";
import s from "./Case.module.css";

/**
 * Template único dos cases, alimentado pelo catálogo. Cada bloco só aparece
 * se o projeto tiver o material: sem texto de enchimento, sem métrica,
 * depoimento ou resultado que não esteja no catálogo.
 *
 * Topo escuro (continuação da abertura) → imagem principal sobre o rasgo →
 * corpo em papel claro com o trabalho, ficha, percurso, recursos, galeria
 * e a navegação entre cases.
 */
export function Case({ projeto: p }: { projeto: Projeto }) {
  const galeria = [p.imagens.capa, p.imagens.secao, p.imagens.celular];
  const { anterior, proximo } = vizinhos(p.slug);
  const total = String(projetos.length).padStart(2, "0");
  const site = dominio(p.url);
  const destaque = eDestaque(p.slug);

  return (
    <GaleriaProvider imagens={galeria}>
      <article className={s.case} data-case={p.slug} data-cor={p.cor}>
        {/* ——— topo escuro ——— */}
        <header className={s.topo}>
          <div className={s.barra}>
            <Voltar slug={p.slug} destaque={destaque} />
            <p className={s.contador}>
              Case <span className={s.contadorLed}>{p.id}</span>
              <span aria-hidden="true">/</span>
              <span className="sr-only"> de </span>
              {total}
            </p>
          </div>

          <div className={s.cabeca}>
            <p className={s.etiquetas}>
              <span className={s.categoria}>{p.categoria}</span>
              {p.status && <span className={s.situacao}>{ROTULO_STATUS[p.status]}</span>}
              <span>{p.rotulo}</span>
              {p.ano && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{p.ano}</span>
                </>
              )}
            </p>
            <h1 className={s.nome}>{p.nome}</h1>
            <p className={s.chamada}>{p.chamada}</p>
            <div className={s.acoesTopo}>
              <Botao href={p.url} variante="principal" externo icone={<IconeExterno />}>
                Visitar site
              </Botao>
              <span className={s.endereco}>{site}</span>
            </div>
          </div>
          <EstrelaPixel className={s.estrela} />
          <Tiques className={s.tiques} cor="var(--lima)" />
        </header>

        {/* ——— imagem principal, metade no breu, metade no papel ——— */}
        <div className={s.destaque}>
          <div className={s.destaqueFundo} aria-hidden="true">
            <Rasgo />
            <div className={`${papel.papel} ${s.destaquePapel}`} />
          </div>
          <div className={s.destaqueTela}>
            <span className={s.fita} aria-hidden="true" />
            <Ampliar indice={0} rotulo={p.imagens.capa.alt}>
              <Moldura
                imagem={p.imagens.capa}
                dominio={site}
                sizes="(min-width: 1200px) 1100px, 94vw"
                prioridade
                className={s.molduraPrincipal}
              />
            </Ampliar>
          </div>
        </div>

        {/* ——— corpo em papel ——— */}
        <div className={`${papel.papel} ${s.corpo}`}>
          <div className={s.conteudo}>
            <div className={s.trabalho}>
              <section aria-labelledby="sobre" className={s.texto}>
                <h2 id="sobre" className={s.secaoTitulo}>
                  O trabalho
                </h2>
                <p className={s.lead}>{p.descricao}</p>
                <p>{p.solucao}</p>
              </section>

              <aside className={s.ficha} aria-label="Ficha do projeto">
                <DecalqzinhoAdesivo className={s.fichaDecalq} prefixo={`decalq-${p.slug}`} />
                <dl>
                  <div>
                    <dt>Serviços</dt>
                    <dd>
                      <ul className={s.chips}>
                        {p.servicos.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>Tecnologias</dt>
                    <dd>
                      <ul className={s.chips} data-tipo="tec">
                        {p.tecnologias.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>Segmento</dt>
                    <dd>{p.rotulo}</dd>
                  </div>
                  <div>
                    <dt>Site</dt>
                    <dd>
                      <a className={s.linkSite} href={p.url} target="_blank" rel="noopener noreferrer">
                        {site}
                        <span className="sr-only"> (abre em nova aba)</span>
                        <IconeExterno />
                      </a>
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>

            {p.percurso.length > 0 && (
              <section aria-labelledby="percurso" className={s.bloco}>
                <h2 id="percurso" className={s.secaoTitulo}>
                  O caminho no site
                </h2>
                <ol className={s.percurso}>
                  {p.percurso.map((e, i) => (
                    <li key={e.titulo}>
                      <span className={s.passoNumero} aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3>{e.titulo}</h3>
                      <p>{e.descricao}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {p.recursos.length > 0 && (
              <section aria-labelledby="recursos" className={s.bloco}>
                <h2 id="recursos" className={s.secaoTitulo}>
                  O que tem no site
                </h2>
                <ul className={s.recursos}>
                  {p.recursos.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="telas" className={s.bloco}>
              <h2 id="telas" className={s.secaoTitulo}>
                Telas
              </h2>
              <p className={s.galeriaDica}>Toque ou clique numa tela para ampliar.</p>
              <ul className={s.galeria}>
                {galeria.map((img, i) => (
                  <li key={img.src} data-formato={img.formato}>
                    <figure>
                      <Ampliar indice={i} rotulo={img.alt}>
                        <Moldura
                          imagem={img}
                          dominio={site}
                          className={s.molduraGaleria}
                          sizes={img.formato === "celular" ? "(min-width: 900px) 22vw, 60vw" : "(min-width: 900px) 40vw, 94vw"}
                        />
                      </Ampliar>
                      <figcaption>
                        {img.formato === "celular"
                          ? "Celular · primeira tela"
                          : i === 0
                            ? "Desktop · primeira tela"
                            : "Desktop · seção interna"}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </section>

            {/* ——— fim: ações e navegação entre cases ——— */}
            <div className={s.fim}>
              <div className={s.fimAcoes}>
                <Voltar slug={p.slug} destaque={destaque} variante="principal" tom="papel" />
                <Botao href={p.url} variante="contorno" tom="papel" externo icone={<IconeExterno />}>
                  Visitar site
                </Botao>
              </div>

              <nav className={s.vizinhos} aria-label="Outros cases">
                {[
                  { rel: "Case anterior", q: anterior, dir: "anterior" },
                  { rel: "Próximo case", q: proximo, dir: "proximo" },
                ].map(({ rel, q, dir }) => (
                  <Link key={dir} href={rotaDoCase(q.slug)} className={s.vizinho} data-dir={dir}>
                    <Image
                      src={q.imagens.capa.src}
                      alt=""
                      width={q.imagens.capa.largura}
                      height={q.imagens.capa.altura}
                      sizes="160px"
                      className={s.vizinhoImagem}
                    />
                    <span className={s.vizinhoTexto}>
                      <span className={s.vizinhoRel}>
                        {dir === "anterior" ? "← " : ""}
                        {rel}
                        {dir === "proximo" ? " →" : ""}
                      </span>
                      <span className={s.vizinhoNome}>{q.nome}</span>
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </article>
    </GaleriaProvider>
  );
}
