"use client";
import { useSyncExternalStore } from "react";

/**
 * Estado da TV compartilhado entre o controlador (controle.ts), os botões
 * físicos (ControlesTV) e o "Pular intro" (CenaViva).
 *
 * Quem escreve é só o controlador; os componentes leem para rótulos e
 * indisponibilidade. A trava contra cliques repetidos é a própria
 * `sequencia`: enquanto não for null, os comandos de energia, brilho e
 * repetição são descartados na lógica do controlador — não ficam na fila.
 */
export type Sequencia = "intro" | "rever" | "ligar" | "desligar";

export interface EstadoTV {
  energia: "ligada" | "desligada";
  brilho: 1 | 2 | 3;
  sequencia: Sequencia | null;
  /** a sequência em curso aceita "Pular intro" */
  pulavel: boolean;
}

const INICIAL: EstadoTV = {
  energia: "ligada",
  brilho: 2,
  sequencia: null,
  pulavel: false,
};

let estado = INICIAL;
const ouvintes = new Set<() => void>();

export const lerTV = () => estado;

export function mudarTV(parte: Partial<EstadoTV>) {
  estado = { ...estado, ...parte };
  ouvintes.forEach((f) => f());
}

export function ouvirTV(f: () => void) {
  ouvintes.add(f);
  return () => {
    ouvintes.delete(f);
  };
}

export const useTV = () => useSyncExternalStore(ouvirTV, lerTV, () => INICIAL);

/* ---------- comandos: implementados pelo controlador ativo ---------- */

export interface ComandosTV {
  energia(): void;
  brilho(): void;
  rever(): void;
  pular(): void;
}

let ativo: ComandosTV | null = null;

export function registrarComandos(c: ComandosTV) {
  ativo = c;
  return () => {
    if (ativo === c) ativo = null;
  };
}

/** Sem controlador montado (antes da hidratação), nada acontece. */
export const tv: ComandosTV = {
  energia: () => ativo?.energia(),
  brilho: () => ativo?.brilho(),
  rever: () => ativo?.rever(),
  pular: () => ativo?.pular(),
};
