"use client";
import { useSyncExternalStore } from "react";
import { CHAVE_ANIMACOES, CHAVE_INTRO } from "./movimento-inicial";

/**
 * Fonte única das animações no navegador. O estado mora em `<html>`
 * (escrito antes da pintura por SCRIPT_MOVIMENTO); o CSS só descreve cada
 * estado e os componentes leem daqui. Nenhuma regra
 * `@media (prefers-reduced-motion)` decide nada em outro lugar.
 *
 * - `data-movimento`: "completo" (padrão) ou "calmo" — calmo só por escolha
 *   explícita no botão "Desativar animações", salva e restaurada na Home e
 *   nos cases, ao navegar e ao recarregar.
 * - `data-suave`: "sim" com movimento reduzido no sistema. Os efeitos
 *   continuam ligados, em versão atenuada.
 */
export type Movimento = "completo" | "calmo";

const EVENTO = "decalq:movimento";
const consulta = () => matchMedia("(prefers-reduced-motion: reduce)");

export function movimentoAtual(): Movimento {
  return document.documentElement.dataset.movimento === "calmo"
    ? "calmo"
    : "completo";
}

/** Movimento reduzido no sistema: efeitos ligados, em versão atenuada. */
export function suaveAtual() {
  return document.documentElement.dataset.suave === "sim";
}

/** Escolha explícita do visitante (botão): aplica e salva. */
export function escolherMovimento(modo: Movimento) {
  document.documentElement.dataset.movimento = modo;
  try {
    localStorage.setItem(CHAVE_ANIMACOES, modo === "calmo" ? "desligadas" : "ligadas");
  } catch {
    /* armazenamento bloqueado: vale só para esta página */
  }
  window.dispatchEvent(new Event(EVENTO));
}

/**
 * Avisa quando algo muda: o botão (nesta aba ou em outra) ou a preferência
 * de movimento reduzido do sistema (que só liga/desliga a atenuação).
 */
export function ouvirMovimento(aviso: () => void) {
  const mq = consulta();
  const raiz = document.documentElement;
  const doSistema = () => {
    raiz.dataset.suave = mq.matches ? "sim" : "nao";
    aviso();
  };
  const deOutraAba = (e: StorageEvent) => {
    if (e.key !== CHAVE_ANIMACOES) return;
    raiz.dataset.movimento = e.newValue === "desligadas" ? "calmo" : "completo";
    aviso();
  };
  window.addEventListener(EVENTO, aviso);
  window.addEventListener("storage", deOutraAba);
  mq.addEventListener("change", doSistema);
  return () => {
    window.removeEventListener(EVENTO, aviso);
    window.removeEventListener("storage", deOutraAba);
    mq.removeEventListener("change", doSistema);
  };
}

export function useMovimento(): Movimento {
  return useSyncExternalStore(ouvirMovimento, movimentoAtual, () => "completo");
}

/* ---------- intro: uma vez por sessão ---------- */

export function introJaTocou() {
  try {
    return sessionStorage.getItem(CHAVE_INTRO) === "1";
  } catch {
    return false;
  }
}

export function marcarIntro() {
  try {
    sessionStorage.setItem(CHAVE_INTRO, "1");
  } catch {
    /* sem sessionStorage a intro pode repetir; o conteúdo não depende dela */
  }
}
