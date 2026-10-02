import { destaques, projetos } from "@/data/projetos";
import { Botao, IconeVolta } from "@/components/botao/Botao";
import { Rasgo } from "@/components/papel/Rasgo";
import { TituloSecao } from "@/components/titulo/TituloSecao";
import { DecalqzinhoAdesivo } from "@/components/marca/Decalqzinho";
import { EstrelaPixel, Tiques } from "@/components/colagem/Objetos";
import { GradeProjetos } from "@/components/projetos/GradeProjetos";
import papel from "@/components/papel/Papel.module.css";
import s from "./Catalogo.module.css";

/**
 * Catálogo completo (/projetos/): todos os projetos, os destaques da Home
 * e os demais, com a mesma grade, busca, filtros e cards. Topo escuro, como
 * o dos cases, e a folha de papel entrando pelo rasgo.
 */
export function Catalogo() {
  const total = String(projetos.length).padStart(2, "0");
  return (
    <section className={s.catalogo} aria-labelledby="catalogo-titulo">
      <header className={s.topo}>
        <div className={s.barra}>
          <Botao href="/" interno variante="contorno" iconeAntes={<IconeVolta />}>
            Voltar ao início
          </Botao>
          <p className={s.contador}>
            <span className={s.contadorLed}>{total}</span>
            projetos · {destaques.length} em destaque na Home
          </p>
        </div>
        <div className={s.cabeca}>
          <TituloSecao
            id="catalogo-titulo"
            linhas={["Todos os", "projetos"]}
            tom="escuro"
            marcador="lima"
            tamanho="compacto"
            fluxo="linha"
          />
          <p className={s.intro}>
            Sites, sistemas, propostas e conceitos da WEB DECALQ, com as telas
            de verdade. Os destaques da Home estão aqui também: abra um card
            para ver o case.
          </p>
        </div>
        <EstrelaPixel className={s.estrela} />
        <Tiques className={s.tiques} cor="var(--lima)" />
      </header>

      <div id="catalogo-grade" className={s.folha}>
        <Rasgo />
        <div className={`${papel.papel} ${s.papel}`}>
          <div className={s.conteudo}>
            <DecalqzinhoAdesivo className={s.decalq} prefixo="decalq-catalogo" />
            <GradeProjetos lista={projetos} lugar="catalogo" idGrade="catalogo-grade" unidade={["projeto", "projetos"]} />
          </div>
        </div>
      </div>
    </section>
  );
}
