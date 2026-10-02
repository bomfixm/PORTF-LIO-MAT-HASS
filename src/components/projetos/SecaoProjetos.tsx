import { secoes } from "@/config/site";
import { destaques } from "@/data/projetos";
import { Rasgo } from "@/components/papel/Rasgo";
import { DecalqzinhoAdesivo } from "@/components/marca/Decalqzinho";
import { EstrelaPixel, Tiques } from "@/components/colagem/Objetos";
import { Orbita } from "@/components/orbita/Orbita";
import { GradeProjetos } from "./GradeProjetos";
import { ChamadaCatalogo } from "./ChamadaCatalogo";
import papel from "@/components/papel/Papel.module.css";
import s from "./SecaoProjetos.module.css";

/**
 * Seção de projetos da Home, logo depois da abertura: uma seção só, com a
 * órbita (Orbita: trilho + palco preso), a passagem e a grade.
 *
 * A grade mora na "folha" (#projetos-grade): papel claro que entra por um
 * rasgo com pixels soltos. Com a órbita, a folha sobe sobre o palco no fim
 * da sequência e as capas pousam nos cards; sem ela (movimento calmo, sem
 * JavaScript ou WebGL) a folha é o começo da seção, como na etapa 3.
 *
 * A Home mostra só os destaques (DESTAQUES, no catálogo); a grade termina
 * com a chamada para /projetos/, onde está o catálogo inteiro.
 */
export function SecaoProjetos() {
  const total = String(destaques.length).padStart(2, "0");
  return (
    <section
      id={secoes.projetos.id}
      className={s.secao}
      aria-labelledby="projetos-titulo"
      data-secao="projetos"
      data-orbita="espera"
    >
      <Orbita />
      <div id="projetos-grade" className={s.folha} data-folha>
      <Rasgo />
      <div className={`${papel.papel} ${s.papel}`}>
        <div className={s.conteudo}>
          <header className={s.topo}>
            <p className={s.selo}>
              <span className={s.seloNumero}>{total}</span>
              <span>destaques</span>
            </p>
            <h2 id="projetos-titulo" className={s.titulo} tabIndex={-1}>
              <span className={s.tituloTexto}>Projetos</span>
              <EstrelaPixel className={s.estrela} />
              <Tiques className={s.tiques} cor="var(--tinta)" />
            </h2>
            <p className={s.intro}>
              Sites e sistemas publicados, com as telas de verdade. Abra um
              case para ver o que foi feito, a galeria e o endereço do site.
            </p>
            <DecalqzinhoAdesivo className={s.decalq} prefixo="decalq-projetos" />
          </header>

          <GradeProjetos
            lista={destaques}
            lugar="home"
            idGrade="projetos-grade"
            unidade={["destaque", "destaques"]}
            fim={<ChamadaCatalogo />}
          />
        </div>
      </div>
      </div>
    </section>
  );
}
