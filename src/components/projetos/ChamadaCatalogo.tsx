import Image from "next/image";
import { rotaDoCatalogo } from "@/config/site";
import { eDestaque, projetos } from "@/data/projetos";
import { Botao, IconeSeta } from "@/components/botao/Botao";
import { EstrelaPixel, Tiques } from "@/components/colagem/Objetos";
import s from "./ChamadaCatalogo.module.css";

/**
 * Chamada para o catálogo completo, no fim da grade da Home — na última
 * linha, ao lado da APS. Recado de papel com fita e sombra dura (como as
 * telas dos cards), um maço de telas reais de projetos que não estão nos
 * destaques, o total do catálogo em LED e o botão principal do site.
 */
export function ChamadaCatalogo() {
  const extras = projetos.filter((p) => !eDestaque(p.slug)).slice(0, 3);
  const total = String(projetos.length).padStart(2, "0");
  return (
    <article className={s.chamada} aria-labelledby="chamada-catalogo">
      <span className={s.fita} aria-hidden="true" />
      <div className={s.maco} aria-hidden="true">
        {extras.map((p) => (
          <span key={p.slug} className={s.folha}>
            <Image
              src={p.imagens.capa.src}
              alt=""
              width={p.imagens.capa.largura}
              height={p.imagens.capa.altura}
              sizes="(min-width: 760px) 20vw, 46vw"
            />
          </span>
        ))}
      </div>
      <div className={s.texto}>
        <p className={s.selo}>
          <span className={s.seloNumero}>{total}</span>
          projetos no catálogo
        </p>
        <h3 id="chamada-catalogo" className={s.titulo}>
          Tem mais por aqui.
        </h3>
        <p className={s.frase}>Explore todos os nossos projetos.</p>
        <Botao href={rotaDoCatalogo} interno variante="principal" tom="papel" icone={<IconeSeta />}>
          Ver todos os projetos
        </Botao>
      </div>
      <EstrelaPixel className={s.estrela} />
      <Tiques className={s.tiques} cor="var(--tinta)" />
    </article>
  );
}
