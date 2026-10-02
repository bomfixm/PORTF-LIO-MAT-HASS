import { site } from "@/config/site";
import s from "./TelaPortfolio.module.css";

/**
 * O que a tela mostra no estado final: PORTFÓLIO em verde pixelado e a
 * assinatura WEB DECALQ. Texto real (h1 e p), com a grade de LEDs aplicada
 * por máscara — continua selecionável, traduzível e lido por leitores de tela.
 *
 * Camadas, de fora para dentro: `.titulo` (brilho do fósforo) → `.led` (grade
 * de LEDs) → `.forma` (letra esticada na vertical). A grade fica fora do
 * esticamento para as células continuarem quadradas.
 */
export function TelaPortfolio() {
  return (
    <div className={s.bloco}>
      <h1 className={s.titulo} data-titulo>
        <span className={s.led} data-titulo-led>
          <span className={s.forma}>{site.titulo}</span>
        </span>
      </h1>
      <p className={s.assinatura} data-assinatura>
        {site.marca}
      </p>
    </div>
  );
}
