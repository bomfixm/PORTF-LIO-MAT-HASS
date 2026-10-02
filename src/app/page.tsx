import { Cabecalho } from "@/components/cabecalho/Cabecalho";
import { Fundo } from "@/components/abertura/Fundo";
import { Abertura } from "@/components/abertura/Abertura";
import { CenaViva } from "@/components/abertura/CenaViva";
import { SecaoProjetos } from "@/components/projetos/SecaoProjetos";
import { SecaoDupla } from "@/components/dupla/SecaoDupla";
import { SecaoServicos } from "@/components/servicos/SecaoServicos";
import { SecaoContato } from "@/components/contato/SecaoContato";
import { Rodape } from "@/components/rodape/Rodape";

export default function Home() {
  return (
    <>
      <Fundo />
      {/* antes do cabeçalho: "Pular intro" é o primeiro destino do Tab */}
      <CenaViva />
      <Cabecalho />
      <main id="conteudo" tabIndex={-1}>
        <Abertura />
        <SecaoProjetos />
        <SecaoDupla />
        <SecaoServicos />
        <SecaoContato />
      </main>
      <Rodape />
    </>
  );
}
