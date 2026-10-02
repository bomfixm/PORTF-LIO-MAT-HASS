import type { Metadata } from "next";
import { site } from "@/config/site";
import { Fundo } from "@/components/abertura/Fundo";
import { Cabecalho } from "@/components/cabecalho/Cabecalho";
import { Catalogo } from "@/components/catalogo/Catalogo";
import { Rodape } from "@/components/rodape/Rodape";

/*
 * /projetos/ — o catálogo completo. Convive com /projetos/[slug]/ (os
 * cases): segmento estático e dinâmico na mesma pasta, sem colisão — o
 * export gera projetos/index.html e projetos/<slug>/index.html.
 */
const titulo = `Todos os projetos | ${site.marca}`;
const descricao = "Todos os projetos da WEB DECALQ: sites, sistemas, propostas e conceitos, com as telas reais.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  openGraph: { type: "website", locale: "pt_BR", siteName: site.marca, title: titulo, description: descricao },
};

export default function PaginaCatalogo() {
  return (
    <>
      <Fundo />
      <Cabecalho />
      <main id="conteudo" tabIndex={-1}>
        <Catalogo />
      </main>
      <Rodape />
    </>
  );
}
