/**
 * Corrige o export estático quando o build roda no Windows (postbuild).
 *
 * O Next 16 grava os arquivos de prefetch de cada segmento com o nome
 * "__next" + caminho do segmento com "/" trocado por "."
 * (convertSegmentPathToStaticExportFilename). No Windows o caminho vem com
 * "\", que não é trocado, e o arquivo cai em subpastas:
 *
 *   out/projetos/reis-lazer/__next.projetos/$d$slug/__PAGE__.txt
 *
 * enquanto o navegador pede
 *
 *   out/projetos/reis-lazer/__next.projetos.$d$slug.__PAGE__.txt
 *
 * Resultado: 404 no prefetch de cada card (a navegação ainda funciona, mas
 * sem prefetch e com erro no console). Este passo achata as subpastas no
 * nome esperado. Em build no Linux/macOS não há subpastas e nada acontece.
 */
import { cp, readdir, rm } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const RAIZ = "out";
let corrigidos = 0;

async function arquivos(pasta) {
  const lista = [];
  for (const e of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, e.name);
    if (e.isDirectory()) lista.push(...(await arquivos(caminho)));
    else lista.push(caminho);
  }
  return lista;
}

async function percorrer(pasta) {
  for (const e of await readdir(pasta, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const caminho = join(pasta, e.name);
    if (e.name.startsWith("__next.")) {
      for (const arquivo of await arquivos(caminho)) {
        const achatado = e.name + "." + relative(caminho, arquivo).split(sep).join(".");
        await cp(arquivo, join(pasta, achatado));
        corrigidos++;
      }
      await rm(caminho, { recursive: true });
    } else {
      await percorrer(caminho);
    }
  }
}

await percorrer(RAIZ);
if (corrigidos) console.log(`export: ${corrigidos} arquivos de segmento renomeados (build no Windows)`);
