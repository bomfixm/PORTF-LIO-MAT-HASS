"use client";
import { escolherMovimento, movimentoAtual } from "@/lib/movimento";
import s from "./BotaoMovimento.module.css";

/**
 * Botão global das animações (intro, recortes, falhas da TV, órbita dos
 * projetos, virada animada dos cards). O texto diz a AÇÃO: "Desativar
 * animações" quando estão ligadas, "Ativar animações" quando desligadas;
 * a chavinha ao lado mostra o estado. A escolha fica salva e vale na Home e
 * nos cases. Sem escolha salva, as animações começam ligadas.
 *
 * Texto e chavinha seguem `<html data-movimento>` pelo CSS — já certos
 * antes da hidratação, sem trocar de texto na frente de quem desligou.
 */
export function BotaoMovimento({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={`${s.botao} ${className ?? ""}`}
      data-botao-animacoes
      onClick={() => escolherMovimento(movimentoAtual() === "completo" ? "calmo" : "completo")}
      data-entra
    >
      <span className={s.trilho} aria-hidden="true">
        <span className={s.bolinha} />
      </span>
      <span className={s.quandoLigado}>Desativar animações</span>
      <span className={s.quandoDesligado}>Ativar animações</span>
    </button>
  );
}
