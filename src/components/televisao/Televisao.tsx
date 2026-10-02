import { Carcaca } from "./Carcaca";
import { ControlesTV } from "./ControlesTV";
import s from "./Televisao.module.css";

/**
 * Monitor CRT em camadas independentes, de trás para a frente:
 *
 *   carcaça (SVG)
 *   tela: imagem (fundo verde + conteúdo) → [cópias para falhas, criadas
 *         pelo controlador] → faixa → chuvisco → brilho (escuro/claro) →
 *         vidro apagado → linha de energia → ponto → varredura → vidro
 *   LED, controles físicos (energia, brilho, rever intro)
 *
 * O conteúdo da tela chega por `children`. Nada aqui anima sozinho: o
 * controlador (controle.ts) anima estas camadas pelos atributos `data-*`; os
 * estados estáveis (ligada/desligada, brilho) estão no CSS, lidos de <html>.
 */
export function Televisao({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${s.tv} ${className ?? ""}`} data-tv>
      <Carcaca className={s.carcaca} />
      <div className={s.tela} data-tela>
        <div className={s.imagem} data-tela-imagem>
          <div className={s.fundo} aria-hidden="true" />
          <div className={s.conteudo} data-tela-conteudo>
            {children}
          </div>
        </div>
        <div className={s.faixa} data-tela-faixa aria-hidden="true" />
        <div className={s.chuvisco} data-tela-ruido aria-hidden="true" />
        <div className={s.escuro} aria-hidden="true" />
        <div className={s.claro} aria-hidden="true" />
        <div className={s.apagada} data-tela-desligada aria-hidden="true" />
        <div className={s.linha} data-tela-linha aria-hidden="true" />
        <div className={s.ponto} data-tela-ponto aria-hidden="true" />
        <div className={s.varredura} data-tela-varredura aria-hidden="true" />
        <div className={s.vidro} aria-hidden="true" />
      </div>
      <span className={s.led} data-led aria-hidden="true" />
      <ControlesTV />
    </div>
  );
}
