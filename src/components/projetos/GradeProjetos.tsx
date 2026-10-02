"use client";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ROTULO_STATUS,
  categoriasDe,
  dominio,
  projetos,
  rotaDoCase,
  type Categoria,
  type Projeto,
} from "@/data/projetos";
import { rotaDoCatalogo } from "@/config/site";
import { lerEstadoGrade, marcarOrigemDoCase, salvarEstadoGrade, type Lugar } from "@/lib/grade-estado";
import { avisarSalto } from "@/components/orbita/estado";
import { PapelRasgado } from "@/components/botao/Botao";
import { DecalqzinhoAdesivo } from "@/components/marca/Decalqzinho";
import { Moldura } from "./Moldura";
import s from "./GradeProjetos.module.css";

/** minúsculas e sem acento: "bistrô" acha "Bistro" e vice-versa */
const normalizar = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const textoBuscavel = new Map(
  projetos.map((p) => [
    p.slug,
    normalizar([p.nome, p.rotulo, p.descricaoCurta, p.descricao, p.status ? ROTULO_STATUS[p.status] : ""].join(" ")),
  ]),
);

/**
 * Grade de projetos, nas duas páginas: na Home, os destaques (com a órbita
 * por cima e a chamada para o catálogo no fim); em /projetos/, o catálogo
 * inteiro. Busca por nome e descrição, filtro por categoria (só com mais de
 * uma categoria real na lista) e um card por projeto. Cada grade guarda o
 * próprio contexto na sessão (`lugar`) para a volta dos cases.
 *
 * Ganchos da cena giratória: a lista tem `data-grade`; cada item,
 * `data-projeto` (slug) e `data-ordem` (posição no catálogo); a tela de cada
 * card, `data-painel`. A grade funciona sozinha, sem a cena.
 */
export function GradeProjetos({
  lista: base,
  lugar,
  idGrade,
  unidade,
  fim,
}: {
  lista: Projeto[];
  lugar: Lugar;
  /** contêiner da grade: destino da volta quando o card não está à vista */
  idGrade: string;
  /** como contar a lista: ["destaque", "destaques"] ou ["projeto", "projetos"] */
  unidade: [string, string];
  /** último item da grade (a chamada para o catálogo, na Home) */
  fim?: ReactNode;
}) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const campo = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const idBusca = useId();
  const idStatus = useId();
  const categorias = useMemo(() => categoriasDe(base), [base]);
  const contagem = (c: Categoria) => base.filter((p) => p.categoria === c).length;
  const conta = (n: number) => (n === 1 ? unidade[0] : unidade[1]);

  const visiveis = useMemo(() => {
    const termo = normalizar(busca);
    return base.filter(
      (p) =>
        (!categoria || p.categoria === categoria) &&
        (!termo || textoBuscavel.get(p.slug)!.includes(termo)),
    );
  }, [base, busca, categoria]);

  // Volta de um case ("Voltar"): restaura busca, filtro e o card de origem
  // num mesmo render. No catálogo, `?busca=` (vindo da busca vazia da Home)
  // também preenche o campo. Estado da sessão, lido só no navegador.
  const [retorno, setRetorno] = useState<{ slug: string | null } | null>(null);
  useEffect(() => {
    const salvo = lerEstadoGrade(lugar);
    /* eslint-disable react-hooks/set-state-in-effect -- sessionStorage e a
       URL não existem no build estático; restaurar só pode ser após montar */
    if (!salvo.voltando) {
      const pedido = lugar === "catalogo" ? new URLSearchParams(location.search).get("busca") : null;
      if (pedido) {
        setBusca(pedido);
        salvarEstadoGrade(lugar, { busca: pedido, categoria: null });
      }
      return;
    }
    salvarEstadoGrade(lugar, { voltando: false });
    setBusca(salvo.busca);
    setCategoria(salvo.categoria);
    setRetorno({ slug: salvo.origem });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [lugar]);

  // Só depois do render JÁ filtrado (o card muda de lugar com o filtro):
  // card de origem no centro da janela, com foco. Sem rolagem suave — é
  // retorno, não passeio. Card fora do filtro: começo da grade.
  useEffect(() => {
    if (!retorno) return;
    const item = retorno.slug
      ? lista.current?.querySelector<HTMLElement>(`[data-projeto="${retorno.slug}"]`)
      : null;
    if (!item) {
      document.getElementById(idGrade)?.scrollIntoView({ behavior: "instant" });
    } else {
      item.scrollIntoView({ block: "center", behavior: "instant" });
      item.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    }
    // a órbita (se houver) vai direto ao fim, sem refazer a sequência
    avisarSalto();
  }, [retorno, idGrade]);

  const mudarBusca = (v: string) => {
    setBusca(v);
    salvarEstadoGrade(lugar, { busca: v });
  };
  const mudarCategoria = (c: Categoria | null) => {
    setCategoria(c);
    salvarEstadoGrade(lugar, { categoria: c });
  };
  const limpar = () => {
    mudarBusca("");
    mudarCategoria(null);
    campo.current?.focus();
  };

  const filtrando = busca.trim() !== "" || categoria !== null;

  return (
    <div className={s.grade}>
      <div className={s.ferramentas} role="search">
        <div className={s.busca}>
          <label htmlFor={idBusca} className={s.rotulo}>
            Buscar projeto
          </label>
          <div className={s.campo}>
            <svg className={s.lupa} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
              <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
            <input
              ref={campo}
              id={idBusca}
              type="search"
              value={busca}
              onChange={(e) => mudarBusca(e.target.value)}
              placeholder="Nome ou descrição"
              autoComplete="off"
              spellCheck={false}
              aria-describedby={idStatus}
            />
            {busca && (
              <button
                type="button"
                className={s.limparCampo}
                onClick={() => {
                  mudarBusca("");
                  campo.current?.focus();
                }}
                aria-label="Limpar busca"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {categorias.length > 1 && (
          <div className={s.filtros} role="group" aria-label="Filtrar por categoria">
            <button
              type="button"
              className={s.filtro}
              aria-pressed={categoria === null}
              onClick={() => mudarCategoria(null)}
            >
              Todos <span className={s.qtd}>{base.length}</span>
            </button>
            {categorias.map((c) => (
              <button
                key={c}
                type="button"
                className={s.filtro}
                aria-pressed={categoria === c}
                onClick={() => mudarCategoria(categoria === c ? null : c)}
              >
                {c} <span className={s.qtd}>{contagem(c)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p id={idStatus} className={s.status} role="status">
        {filtrando
          ? `${visiveis.length} de ${base.length} ${conta(base.length)}`
          : `${base.length} ${conta(base.length)}`}
      </p>

      {visiveis.length > 0 ? (
        <ul ref={lista} className={s.lista} data-grade>
          {visiveis.map((p) => (
            <li
              key={p.slug}
              className={s.item}
              data-projeto={p.slug}
              data-ordem={projetos.indexOf(p)}
            >
              <Card projeto={p} lugar={lugar} />
            </li>
          ))}
          {fim && (
            <li className={s.item} data-chamada>
              {fim}
            </li>
          )}
        </ul>
      ) : (
        <div className={s.vazio}>
          <DecalqzinhoAdesivo className={s.vazioDecalq} prefixo="decalq-vazio" />
          <p className={s.vazioTitulo}>
            Nenhum projeto
            {busca.trim() && <> com “{busca.trim()}”</>}
            {categoria && <> em {categoria}</>}.
          </p>
          <p className={s.vazioTexto}>Tente outro nome ou uma palavra da descrição.</p>
          <div className={s.vazioAcoes}>
            <button type="button" className={s.vazioAcao} onClick={limpar}>
              {categoria && busca.trim() ? "Limpar busca e filtro" : "Limpar busca"}
            </button>
            {/* a Home só tem os destaques: a mesma busca no catálogo inteiro */}
            {lugar === "home" && (
              <Link
                className={s.vazioCatalogo}
                href={busca.trim() ? `${rotaDoCatalogo}?busca=${encodeURIComponent(busca.trim())}` : rotaDoCatalogo}
              >
                Procurar em todos os projetos
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ projeto: p, lugar }: { projeto: Projeto; lugar: Lugar }) {
  return (
    <article className={s.card} data-cor={p.cor}>
      <span className={s.fita} aria-hidden="true" />
      <Moldura
        imagem={p.imagens.capa}
        dominio={dominio(p.url)}
        sizes="(min-width: 900px) 45vw, 92vw"
        className={s.tela}
      />
      <div className={s.info}>
        <div className={s.meta}>
          <span className={s.numero} aria-hidden="true">
            {p.id}
          </span>
          <span className={s.categoria}>{p.categoria}</span>
          {p.status && <span className={s.situacao}>{ROTULO_STATUS[p.status]}</span>}
          <span className={s.segmento}>{p.rotulo}</span>
        </div>
        <h3 className={s.nome}>
          <Link
            href={rotaDoCase(p.slug)}
            className={s.link}
            onClick={() => marcarOrigemDoCase(lugar, p.slug)}
          >
            {p.nome}
          </Link>
        </h3>
        <p className={s.descricao}>{p.descricaoCurta}</p>
        <span className={s.acao} aria-hidden="true">
          <PapelRasgado className={s.acaoPapel} />
          <span className={s.acaoRotulo}>Ver case</span>
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M3.5 12h16M13 5.5l6.5 6.5-6.5 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </article>
  );
}
