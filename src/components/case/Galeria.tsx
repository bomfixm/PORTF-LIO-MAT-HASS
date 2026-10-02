"use client";
import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import type { Imagem } from "@/data/projetos";
import s from "./Galeria.module.css";

/**
 * Ampliação das telas de um case. Um único <dialog> por página (modal
 * nativo: prende o foco, Esc fecha, fundo inerte); qualquer `Ampliar` da
 * página abre nele a imagem do seu índice.
 *
 * Teclado: ← → trocam de imagem, Home/End vão às pontas, Esc fecha. Ao
 * fechar, o foco volta ao botão que abriu.
 */
const Contexto = createContext<(indice: number, origem: HTMLElement) => void>(() => {});

export function GaleriaProvider({
  imagens,
  children,
}: {
  imagens: Imagem[];
  children: React.ReactNode;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const origem = useRef<HTMLElement | null>(null);
  const [atual, setAtual] = useState(0);
  const idLegenda = useId();
  const total = imagens.length;
  const imagem = imagens[atual];

  const abrir = useCallback((indice: number, de: HTMLElement) => {
    origem.current = de;
    setAtual(indice);
    dialogo.current?.showModal();
  }, []);

  const ir = (passo: number) => setAtual((i) => (i + passo + total) % total);

  const fechar = () => dialogo.current?.close();

  // Fechou (botão, Esc ou clique fora): o foco volta a quem abriu.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    const aoFechar = () => {
      origem.current?.focus();
      origem.current = null;
    };
    d.addEventListener("close", aoFechar);
    return () => d.removeEventListener("close", aoFechar);
  }, []);

  const teclas = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") ir(1);
    else if (e.key === "ArrowLeft") ir(-1);
    else if (e.key === "Home") setAtual(0);
    else if (e.key === "End") setAtual(total - 1);
    else return;
    e.preventDefault();
  };

  return (
    <Contexto.Provider value={abrir}>
      {children}
      <dialog
        ref={dialogo}
        className={s.dialogo}
        aria-labelledby={idLegenda}
        onKeyDown={teclas}
        // clique no fundo escurecido (fora do quadro) fecha
        onClick={(e) => {
          if (e.target === e.currentTarget) fechar();
        }}
      >
        <div className={s.quadro}>
          <div className={s.topo}>
            <p id={idLegenda} className={s.legenda}>
              <span className={s.contador}>
                {atual + 1}/{total}
              </span>
              {imagem.alt}
            </p>
            <button type="button" className={s.fechar} onClick={fechar} autoFocus>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
              <span>Fechar</span>
            </button>
          </div>

          <figure className={s.figura} data-formato={imagem.formato}>
            <Image
              key={imagem.src}
              src={imagem.src}
              alt={imagem.alt}
              width={imagem.largura}
              height={imagem.altura}
              sizes="96vw"
              className={s.imagem}
            />
          </figure>

          {total > 1 && (
            <div className={s.navegacao}>
              <button type="button" className={s.passo} onClick={() => ir(-1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Anterior
              </button>
              <p className={s.dica} aria-hidden="true">
                ← → para trocar · Esc para fechar
              </p>
              <button type="button" className={s.passo} onClick={() => ir(1)}>
                Próxima
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </dialog>
    </Contexto.Provider>
  );
}

/** Envolve uma tela e a torna ampliável (abre o dialog no índice dado). */
export function Ampliar({
  indice,
  rotulo,
  className,
  children,
}: {
  indice: number;
  rotulo: string;
  className?: string;
  children: React.ReactNode;
}) {
  const abrir = useContext(Contexto);
  return (
    <button
      type="button"
      className={`${s.ampliar} ${className ?? ""}`}
      onClick={(e) => abrir(indice, e.currentTarget)}
      aria-haspopup="dialog"
      aria-label={`Ampliar: ${rotulo}`}
    >
      {children}
      <span className={s.lupa} aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <path d="M15 15l5.5 5.5M10.5 7.5v6M7.5 10.5h6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  );
}
