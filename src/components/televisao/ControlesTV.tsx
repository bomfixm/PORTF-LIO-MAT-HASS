"use client";
import { tv, useTV } from "./estado-tv";
import s from "./ControlesTV.module.css";

/**
 * Os controles que já existem na moldura, agora funcionando:
 *   botão do sol  → Alterar brilho (três níveis)
 *   botão do meio → Rever intro (ícone ↻ na carcaça)
 *   tecla ⏻       → Ligar / Desligar TV (o LED acompanha)
 *
 * Cada um é um <button> real sobre o desenho, com área de toque maior que o
 * botão desenhado, rótulo próprio e foco visível. Durante uma sequência eles
 * ficam `aria-disabled` e escurecidos; o descarte dos cliques acontece no
 * controlador (controle.ts), não só aqui.
 */
export function ControlesTV() {
  const { energia, brilho, sequencia } = useTV();
  const ligada = energia === "ligada";
  const ocupada = sequencia !== null;
  const aguarde = "Aguarde…";

  const botao = (
    nome: "brilho" | "rever" | "energia",
    rotulo: string,
    dica: string,
    indisponivel: boolean,
    acao: () => void,
    filho: React.ReactNode,
  ) => (
    <button
      type="button"
      className={s.botao}
      data-controle={nome}
      aria-label={rotulo}
      aria-disabled={indisponivel || undefined}
      onClick={() => {
        if (!indisponivel) acao();
      }}
    >
      {filho}
      <span className={s.dica} aria-hidden="true">
        {dica}
      </span>
    </button>
  );

  return (
    <div className={s.controles}>
      {botao(
        "brilho",
        ligada ? `Alterar brilho (nível ${brilho} de 3)` : "Alterar brilho (ligue a TV)",
        ocupada ? aguarde : ligada ? `Brilho ${brilho}/3` : "Ligue a TV",
        ocupada || !ligada,
        tv.brilho,
        <span className={s.tampa}>
          <span className={s.entalhe} data-nivel={brilho} />
        </span>,
      )}
      {botao(
        "rever",
        ligada ? "Rever intro" : "Rever intro (ligue a TV)",
        ocupada ? aguarde : ligada ? "Rever intro" : "Ligue a TV",
        ocupada || !ligada,
        tv.rever,
        <span className={s.tampa}>
          <span className={s.entalhe} data-nivel="rever" />
        </span>,
      )}
      {botao(
        "energia",
        ligada ? "Desligar TV" : "Ligar TV",
        ocupada ? aguarde : ligada ? "Desligar TV" : "Ligar TV",
        ocupada,
        tv.energia,
        <span className={s.tecla} data-ligada={ligada} />,
      )}
      <span className="sr-only" role="status">
        {ocupada ? "" : `TV ${ligada ? "ligada" : "desligada"}, brilho ${brilho} de 3`}
      </span>
    </div>
  );
}
