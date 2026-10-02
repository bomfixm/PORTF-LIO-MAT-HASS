import Image from "next/image";
import type { Imagem } from "@/data/projetos";
import s from "./Moldura.module.css";

/**
 * Moldura das telas dos projetos: janela de navegador com o domínio real na
 * barra (desktop) ou aparelho (celular). A imagem entra inteira, na
 * proporção original — nada de corte escondendo o trabalho.
 *
 * Só `span` (com display de bloco no CSS): a moldura pode ficar dentro de
 * um botão (ampliar) sem quebrar o HTML.
 *
 * `data-painel` marca a peça que a cena giratória (etapa 4) vai mover.
 */
export function Moldura({
  imagem,
  dominio,
  sizes,
  prioridade,
  className,
}: {
  imagem: Imagem;
  dominio?: string;
  sizes: string;
  prioridade?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`${s.moldura} ${className ?? ""}`}
      data-formato={imagem.formato}
      data-painel
    >
      {imagem.formato === "desktop" ? (
        <span className={s.barra} aria-hidden="true">
          <span className={s.luzes}>
            <i />
            <i />
            <i />
          </span>
          {dominio && <span className={s.dominio}>{dominio}</span>}
        </span>
      ) : (
        <span className={s.alto} aria-hidden="true" />
      )}
      <span className={s.vidro}>
        <Image
          src={imagem.src}
          alt={imagem.alt}
          width={imagem.largura}
          height={imagem.altura}
          sizes={sizes}
          loading={prioridade ? "eager" : "lazy"}
          fetchPriority={prioridade ? "high" : undefined}
          className={s.imagem}
        />
      </span>
    </span>
  );
}
