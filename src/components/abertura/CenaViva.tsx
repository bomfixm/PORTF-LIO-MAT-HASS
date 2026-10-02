"use client";
import { useEffect, useRef } from "react";
import { criarControleTV } from "@/components/televisao/controle";
import { tv, useTV } from "@/components/televisao/estado-tv";
import s from "./CenaViva.module.css";

/**
 * Liga a abertura ao controlador da TV (televisao/controle.ts) e mostra o
 * "Pular intro" enquanto a intro automática ou o "Rever intro" tocam.
 *
 * React só renderiza o botão; animação, tempos, travas e pausas vivem no
 * controlador, fora do ciclo de renderização.
 */
export function CenaViva() {
  const { pulavel } = useTV();
  const tinhaFoco = useRef(false);

  useEffect(() => {
    const cena = document.querySelector<HTMLElement>("[data-cena]");
    if (!cena) {
      document.documentElement.dataset.intro = "pronta";
      return;
    }
    const destruir = criarControleTV(cena);
    return () => {
      destruir();
      // Saiu da Home no meio da intro: não deixar a página no estado escuro.
      // (A remontagem do modo estrito do React mantém a cena e segue tocando.)
      window.setTimeout(() => {
        if (!document.querySelector("[data-cena]")) {
          document.documentElement.dataset.intro = "pronta";
        }
      });
    };
  }, []);

  // Se o botão some com o foco nele (fim natural ou pulo), o foco vai para o
  // conteúdo em vez de cair no <body>.
  useEffect(() => {
    if (pulavel || !tinhaFoco.current) return;
    tinhaFoco.current = false;
    document.getElementById("conteudo")?.focus({ preventScroll: true });
  }, [pulavel]);

  if (!pulavel) return null;
  return (
    <button
      type="button"
      className={s.pular}
      data-pular-intro
      onFocus={() => (tinhaFoco.current = true)}
      onBlur={(e) => {
        // sem destino = o botão saiu da página com o foco nele
        if (e.relatedTarget) tinhaFoco.current = false;
      }}
      onClick={() => tv.pular()}
    >
      Pular intro
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 5l8 7-8 7zM14 5l8 7-8 7z" fill="currentColor" />
      </svg>
    </button>
  );
}
