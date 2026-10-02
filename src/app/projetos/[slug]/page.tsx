import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { projetoPorSlug, projetos } from "@/data/projetos";
import { Fundo } from "@/components/abertura/Fundo";
import { Cabecalho } from "@/components/cabecalho/Cabecalho";
import { Case } from "@/components/case/Case";
import { Rodape } from "@/components/rodape/Rodape";

/* Uma página estática por projeto do catálogo; nenhuma outra existe. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projetos.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projeto = projetoPorSlug((await params).slug);
  if (!projeto) return {};
  const titulo = `${projeto.nome} | ${site.marca}`;
  return {
    title: titulo,
    description: projeto.descricaoCurta,
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: site.marca,
      title: titulo,
      description: projeto.descricaoCurta,
    },
  };
}

export default async function PaginaCase({ params }: Props) {
  const projeto = projetoPorSlug((await params).slug);
  if (!projeto) notFound();
  return (
    <>
      <Fundo />
      <Cabecalho />
      <main id="conteudo" tabIndex={-1}>
        <Case projeto={projeto} />
      </main>
      <Rodape />
    </>
  );
}
