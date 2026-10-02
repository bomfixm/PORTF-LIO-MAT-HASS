import { ancora, contato } from "@/config/site";
import { Televisao } from "@/components/televisao/Televisao";
import { DecalqzinhoAdesivo } from "@/components/marca/Decalqzinho";
import { DecalqzinhoPixel } from "@/components/marca/DecalqzinhoPixel";
import { FiltrosColagem } from "@/components/colagem/Filtros";
import { Colagem } from "@/components/colagem/Colagem";
import { Tiques } from "@/components/colagem/Objetos";
import { Botao, IconeBalao, IconeSeta } from "@/components/botao/Botao";
import { TelaPortfolio } from "./TelaPortfolio";
import s from "./Abertura.module.css";

/**
 * Abertura da Home. A marcação é o estado final; a intro e os efeitos
 * (CenaViva) só animam estas camadas.
 *
 * Camadas, de trás para a frente, dentro da caixa da composição:
 *   colagem "atras" (z 1) → TV, adesivo e Decalqzinho pixelado (z 2) →
 *   colagem "frente" (z 3)
 * e, fora dela, as ações. O fundo é uma camada própria (Fundo) e o
 * cabeçalho vem antes, na página.
 *
 * O Decalqzinho pixelado fica na caixa da TV, por cima da tela, para poder
 * sair dela e pousar na moldura; fora da intro está sempre invisível.
 */
export function Abertura() {
  return (
    <section className={s.abertura} data-cena data-ambiente="ativo">
      <div className={s.palco}>
        <div className={s.composicao}>
          <FiltrosColagem />
          <Colagem />
          <div className={s.tv} data-camada="tv">
            <Televisao>
              <TelaPortfolio />
            </Televisao>
            <div className={s.adesivo} data-adesivo>
              <DecalqzinhoAdesivo />
            </div>
            <div className={s.pixel} data-decalq-pixel>
              <DecalqzinhoPixel />
            </div>
          </div>
        </div>
      </div>

      <div className={s.acoes}>
        <span className={s.tiqueEsq} data-entra>
          <Tiques cor="var(--lima)" />
        </span>
        <Botao
          href={ancora("projetos")}
          variante="principal"
          icone={<IconeSeta />}
          data-entra=""
        >
          Explorar projetos
        </Botao>
        <Botao
          href={contato.whatsapp}
          variante="contorno"
          externo
          icone={<IconeBalao />}
          data-entra=""
        >
          Trocar uma ideia
        </Botao>
        <span className={s.tiqueDir} data-entra>
          <Tiques cor="var(--lima)" />
        </span>
      </div>
    </section>
  );
}
