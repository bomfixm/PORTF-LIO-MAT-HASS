import s from "./Fundo.module.css";

/**
 * Camada de fundo da abertura: breu levemente esverdeado, vinheta e grão,
 * e por cima a luz verde que a tela projeta (`data-fundo-luz`) — apagada no
 * começo da intro, acende quando a TV liga. Fixa na janela e atrás de tudo;
 * as seções claras das próximas etapas cobrem com fundo próprio, e a
 * passagem escuro → papel da etapa 4 pode atuar só aqui.
 */
export function Fundo() {
  return (
    <div className={s.fundo} aria-hidden="true">
      <div className={s.luz} data-fundo-luz />
    </div>
  );
}
