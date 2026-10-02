# BRIEF — Portfólio criativo WEB DECALQ

Portfólio autoral de **Mateus e Guilherme**: retrô, divertido, experimental — recortes, adesivos, pixels, texturas e uma TV CRT como protagonista. Quem chega precisa ler **PORTFÓLIO** de imediato.

Referências: `docs/referencias/abertura-escura.webp` (abertura), `docs/referencias/decalqzinho-pixel.webp` (Decalqzinho pixelado, etapa 2), `docs/referencias/creative-studio-pass.webp` (cards da dupla, enviada em 01/10/2026) e `docs/direcao-visual.md` (direção aprovada em 01/10/2026; versão atualizada recebida com a etapa 5, com as calibrações da etapa 2 e as seções “Continuação — etapa 3, 4 e 5”). As referências das telas curvas da etapa 4 não vieram como arquivo.

## Andamento

| Etapa | Escopo | Estado |
|---|---|---|
| 1 | Fundação e abertura estática | **concluída em 01/10/2026** |
| 2 | Animações da abertura + ajustes (movimento próprio, 4 falhas, controles da TV) | **concluída em 01/10/2026** |
| 3 | Dados, grade e páginas dos cases | **concluída em 01/10/2026** |
| 4 | Cena giratória guiada pelo scroll | **concluída em 01/10/2026** |
| 5 | Serviços, a dupla, contato e rodapé | **concluída em 01/10/2026** |
| 6 | Acabamento, acessibilidade, desempenho | **concluída em 01/10/2026** (publicação fica para o próximo pedido) |
| 6b | Ajuste: nova ordem da Home e falhas da TV mais frequentes | **concluído em 01/10/2026** (ver "Ajuste de 01/10/2026") |
| 6c | Ajuste: telas nítidas na órbita e fade tardio de PROJETOS | **concluído em 01/10/2026** (ver "Ajuste 6c") |
| 7 | Catálogo completo em página própria (`/projetos/`), Home com os 7 destaques | **concluído em 02/10/2026** (ver "Catálogo completo") |

Uma etapa por rodada. Nenhuma etapa antecipa a seguinte.

**Ordem da Home (vigente desde o ajuste 6b):** 1. entrada com a TV → 2. projetos giratórios + grade (`#projetos`) → 3. A dupla (`#a-dupla`) → 4. O que a gente cria (`#servicos`) → 5. Contato (`#contato`) → 6. rodapé. Substitui a ordem da etapa 5 e a "Estrutura da Home" de `docs/direcao-visual.md` (serviços antes da dupla), que não foi editado.

## Decisões da etapa 1

- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, export estático (`out/`). CSS Modules por componente + `src/styles/tokens.css`. Dependências: só `next`, `react`, `react-dom` (+ TypeScript e ESLint no dev).
- **Lettering WEB DECALQ:** vetorizado do próprio desenho da referência (`marca/Lettering.tsx`), não é fonte — preserva traço, peso e borda de marcador.
- **PORTFÓLIO:** texto real (`h1`) em Jersey 10 esticada 1,42× na vertical, com grade de LEDs por máscara e brilho de fósforo (`abertura/TelaPortfolio.module.css`). Menu, botões e legendas em IBM Plex Mono.
- **TV:** a carcaça é a única "imagem" (SVG, `televisao/Carcaca.tsx`); tela, conteúdo, varredura, vidro e LED são camadas HTML separadas.
- **Decalqzinho:** geometria do arquivo original (`public/brand/decalqzinho.png`), cores originais, como adesivo recortado no canto da moldura (`marca/Decalqzinho.tsx`).
- **Colagem:** cada objeto é um SVG próprio (`colagem/Objetos.tsx`) com filtros compartilhados (papel, papel amassado, giz, adesivo). Posições de desktop e celular ficam em **uma tabela só**: `PECAS` em `colagem/Colagem.tsx`, em `cqw` da composição.
- **Fundo:** camada fixa própria (`abertura/Fundo.tsx`): breu esverdeado, brilho atrás da TV, vinheta e grão.
- **Encaixe:** desktop ≥ 900 × 500 → a abertura ocupa a janela abaixo do cabeçalho; a TV é dimensionada pela altura livre e TV + botões ficam centralizados. Celular, janela baixa e zoom → altura livre, conteúdo cresce na vertical.
- "Feito por Mateus & Guilherme" **removido**; botões logo abaixo da TV.
- Menu sempre visível (sem hambúrguer): uma linha a partir de 380 px, grade 2 × 2 abaixo disso.

## Decisões da etapa 2 — movimento e TV

> Os ajustes da etapa 2 (01/10/2026) **substituem** as calibrações anteriores (flutuação de 3–6 px; falhas de 80–150 ms a cada 10–18 s).

**Uma fonte de estado, sem `@media` espalhado.** Atributos em `<html>`; os iniciais são escritos antes da primeira pintura por `lib/movimento-inicial.ts` (script inline do layout):
- `data-movimento="completo|calmo"` — **mudou na etapa 6** (ver Decisões da etapa 6): padrão sempre "completo"; "calmo" só pelo botão "Desativar animações", salvo em `decalq:animacoes`. `data-suave="sim|nao"` segue `prefers-reduced-motion` e só atenua os efeitos.
- `data-intro="tocando|pronta"` — intro automática só na Home, com movimento completo, 1ª vez na sessão (`sessionStorage` `decalq:intro`).
- `data-tv="ligada|desligada"`, `data-brilho="1|2|3"` (salvo em `decalq:brilho`) e `data-tv-ocupada="<sequência>"` durante intro, rever, ligar e desligar.
- `[data-ambiente="ativo|pausado"]` na abertura — pausa fora de vista ou com a aba oculta.
- CSS de movimento em `styles/movimento.css`; estados estáveis da TV em `televisao/Televisao.module.css` (luz do fundo em `abertura/Fundo.module.css`).

**Arquivos:** `televisao/controle.ts` (máquina de estados, trava, agendador de falhas, pausas) · `sequencias.ts` (fases e sequências em Web Animations; tempos em `TEMPO`) · `falhas.ts` (quatro tipos e ordem) · `estado-tv.ts` (estado lido pelos botões) · `ControlesTV.tsx` (botões físicos) · `abertura/CenaViva.tsx` (monta o controlador e o "Pular intro").

**Objetos com movimento próprio** (`colagem/Colagem.tsx`, campo `mov` de cada peça): três osciladores independentes — horizontal, vertical e giro —, vai-e-volta em ease-in-out (fecha o ciclo sem salto), cada um com ciclo e fase próprios. A trajetória sai da relação entre eles: `diagonal`, `diagonal-inversa`, `arco` (U), `arco-invertido` (∩), `laco` (elipse), `oito`, `livre` (balanço).
- Intensidade: os valores de `Colagem.tsx` são a base; `--esc-mov`/`--esc-giro` em `styles/movimento.css` escalam tudo. Hoje 0,8 (pedido de 01/10/2026: "um pouco mais sutil").
- Desktop medido (com 0,8): percurso X 4,8–12,8 px, Y 9,6–20,8 px, giro ±2,4–6,4°, ciclos 4,2–9 s. Papéis grandes balançam devagar, cursores andam mais rápido, tubos fazem arcos, estrelas giram.
- O ângulo original de cada recorte fica preservado; celular usa 0,5 da base no percurso. Nenhuma peça sai da composição nem cobre menu ou botões (medido em 360–1920 px). Moldura, menu e botões parados.
- Estrutura: `.peca` (posição + entrada da intro) › `[data-mov=a]` (X + giro) › `[data-mov=b]` (Y + sombra).

**Quatro falhas, só dentro da tela** (`televisao/falhas.ts`) — durações e ritmo **atualizados no ajuste 6b** (ver "Ajuste de 01/10/2026"):

| Tipo | Duração | Efeito |
|---|---|---|
| leve | 120–220 ms | tremor horizontal, chuvisco, varredura e linhas finas mexem |
| moderada | 250–450 ms | faixas horizontais deslocadas + duplicação discreta da imagem |
| forte | 350–600 ms | perde o sincronismo vertical: a imagem rola com a faixa do retraço e estabiliza |
| pesada | **1650–1900 ms** (antes 600–900) | tranco → quadro travado e distorcido que se sustenta, faixas deslocadas que pulam de lugar, fantasma e chuvisco andando → solta e recupera |

- Ritmo (ajuste 6b): 1–3 s de imagem normal entre o fim de uma e o começo da próxima; pesada a cada 10,5–14,5 s de execução ativa, a primeira 6–10 s depois da intro; menores intercaladas, uma por vez. (Antes: pausas de 2,5–6 s e sorteio com pesos.)
- Três cópias da imagem da tela (criadas uma vez, escondidas, inertes) fazem as faixas, a duplicação e a rolagem. Nenhuma animação tem preenchimento: no fim tudo volta ao normal. Brilho contido.
- Suspensas durante intro, rever, ligar e desligar; nunca com a TV apagada.

**Controles físicos** (`televisao/ControlesTV.tsx`, sobre os botões da moldura; botão de 24 px no celular a 46 px no desktop e, com toque (`pointer: coarse`), área invisível de 44 px de altura que vai até o vizinho — etapa 6; rótulo próprio, dica visível no foco/hover, status anunciado a leitores de tela):
- **Tecla ⏻ — Desligar/Ligar TV:** desligar contrai a imagem numa linha, num ponto, e apaga; LED e luz do fundo acompanham. Ligar: linha verde, interferência, Decalqzinho pixelado piscando, PORTFÓLIO (~1,7 s).
- **Botão do sol — Alterar brilho:** três níveis legíveis (camadas por cima da imagem e das cópias), o entalhe gira; só com a TV ligada e estável; preservado depois de falhas e religamentos.
- **Botão do meio (↻) — Rever intro:** apaga e refaz a sequência da TV e do personagem (~2,9 s), mesmo depois da intro automática; menu e botões da página seguem disponíveis; "Pular intro" e Esc encerram.

**Trava contra cliques repetidos:** uma sequência por vez. Com `data-tv-ocupada`, energia, brilho e rever são **descartados no controlador** (nada entra em fila) — mouse, toque e teclado; os botões ficam `aria-disabled`, escurecidos e com a dica "Aguarde…". A trava sai quando as animações terminam de verdade, ou na interrupção (pular, desligar o movimento), sempre num estado estável.

**Intro automática** (`sequenciaIntro`, ~2,65 s após a 1ª pintura): TV surge apagada (CSS) → linha de energia → interferência → Decalqzinho pixelado de olhos fechados → piscadinha → pousa na moldura como adesivo azul → PORTFÓLIO letra a letra → recortes, marca, menu e botões. Pular: botão (2º Tab), Esc, rolar ou focar algo ainda invisível. Sem JS: estado final; se o JS não chegar, liberado em 4 s. Decalqzinho pixelado: `marca/DecalqzinhoPixel.tsx` (grade 54 × 36 da geometria original).

**Pausas e movimento reduzido:** fora de vista ou com a aba oculta, a sequência congela (só o que ela congelou volta a tocar), as falhas param e os osciladores pausam; ao voltar, um único temporizador é recriado. Com as animações desligadas pelo visitante: nada automático; energia e brilho trocam direto; "Rever intro" mostra o Decalqzinho parado por 1,4 s e volta ao PORTFÓLIO. (Até a etapa 5 isso valia também para `prefers-reduced-motion`; desde a etapa 6 o reduzido mantém tudo ligado, em versão atenuada.)

**Armadilhas registradas:** o atalho `animation` redefine `animation-play-state` — a regra de pausa precisa pesar mais; `play()` numa animação já terminada a reinicia do começo — por isso só se retoma o que a pausa congelou.

## Decisões da etapa 3 — projetos e cases

**Catálogo único:** `src/data/projetos.ts`. Grade, cases e (etapa 4) a cena giratória leem só daqui. (Desde 02/10/2026 são 14 projetos, e a Home usa só os 7 `DESTAQUES`; ver "Catálogo completo".) **7 projetos** importados do `decalq-portfolio-novo` (que não foi alterado): id, slug, nome, rótulo do segmento, chamada, descrição curta e completa, categoria, ano, serviços, tecnologias, URL, solução, percurso do visitante (3 passos), recursos do site, três telas e uma cor de adesivo (`cor`). Não vieram do catálogo antigo: `challenge`, `objective` e `analysis` (enquadramento narrativo, não material confirmado) nem `iframe`/`panel`. Helpers: `projetoPorSlug`, `categorias` (derivadas dos dados), `rotaDoCase`, `dominio`, `vizinhos`.

**Imagens:** `public/telas/<slug>/{capa,secao,celular}.webp` — fora de `/projetos/`, que são as rotas. Os `preview-1/2` antigos eram cópias reduzidas da capa e da seção e ficaram de fora. Todas entram inteiras, na proporção original (`Moldura`: janela de navegador com o domínio real na barra, ou aparelho para o celular), sem corte.

**Home — seção `#projetos`** (`components/projetos/`), logo após a abertura, que segue cabendo na primeira tela (medido em 1366×768, 1280×720, 1440×900 e 1920×1080).
- Passagem escuro → papel: `papel/Rasgo.tsx` — borda de papel rasgado com fibra branca e pixels soltos (papel, lima, azul) subindo para o breu, abaixo da dobra. Superfície clara em `papel/Papel.module.css` (grão discreto, foco azul via `--foco`).
- Topo: selo “07 cases no ar” com número em LED verde, **PROJETOS** em pixel esticado com marca-texto lima e sombra de impressão azul, estrela pixel, tiques e Decalqzinho adesivo.
- Busca por nome, segmento e descrições (sem acento e sem caixa), estado vazio com Decalqzinho e “Limpar busca” (ou “Limpar busca e filtro”), status anunciado (`role=status`). Filtros porque há duas categorias reais: **Sites (6)** e **Sistemas (1)**.
- Card: tela com sombra dura na cor do projeto e fita adesiva no canto; número, categoria, segmento, nome em pixel, descrição curta e “Ver case” no mesmo papel lima rasgado do botão da abertura. O link do nome cobre o card inteiro. Hover/foco: tela sobe, sombra cresce, nome sublinha, botão clareia; foco por teclado = contorno tracejado azul no card; toque = tela afunda. Com movimento calmo os estados aparecem sem deslocamento animado.
- Duas colunas (≥ 760 px), uma abaixo; com número ímpar, o último card fica centralizado na largura de uma coluna. Fitas e adesivos nunca passam da página (`overflow-x: clip` na seção e no case).

**Cases — `/projetos/[slug]/`** (`app/projetos/[slug]/page.tsx` + `components/case/Case.tsx`): `generateStaticParams` + `dynamicParams = false` → 7 páginas estáticas, acesso direto funcionando, slug inexistente = 404. Topo escuro (Voltar, “Case 02/07” em LED, categoria/segmento/ano, nome em pixel grande, chamada, **Visitar site**) → imagem principal metade no breu, metade no papel → “O trabalho” (descrição + solução) e ficha (serviços, tecnologias, segmento, site) → “O caminho no site” → “O que tem no site” → “Telas” → Voltar/Visitar site e case anterior/próximo.
- Galeria (`case/Galeria.tsx`): um `<dialog>` modal por página; a imagem principal e as três telas abrem nele. Fechar por botão, Esc ou clique fora; ← → trocam, Home/End vão às pontas; foco inicial em Fechar e, ao fechar, de volta ao botão que abriu. Imagem sempre inteira na janela.

**Navegação:** `secoes.projetos.pronta = true`; `ancora()` devolve `/#projetos` (funciona na Home e nos cases). Menu interno usa `next/link` (sem recarregar). Rolagem suave só com `data-movimento="completo"` e sem `data-suave="sim"` (`styles/movimento.css`), salto direto no calmo e com movimento reduzido no sistema; `data-scroll-behavior="smooth"` no `<html>` faz o Next não animar trocas de rota. O cabeçalho não é fixo: a compensação é `scroll-padding-top: 12px` (`globals.css`) — somar `--cabecalho-h` se ele ficar fixo.
- **Intro:** o script inicial não toca a intro quando a Home abre com âncora (`/#projetos`); voltar de um case é navegação do Next, sem recarregar, então a intro da sessão não repete.
- **Voltar ao portfólio** (`case/Voltar.tsx`) grava em `sessionStorage` (`decalq:grade`, `lib/grade-estado.ts`) o case de origem; a grade restaura busca e filtro e, só depois do render já filtrado, centraliza e foca o card de origem.

**Ganchos para a etapa 4:** lista `data-grade`; cada item `data-projeto` (slug) e `data-ordem` (posição no catálogo); a tela de cada card `data-painel`; seção `data-secao="projetos"`. A cena pode medir cada item e entregar o painel girando até ele; a passagem escuro → papel pode animar `Rasgo`/`Fundo`. A grade funciona sozinha, sem a cena.

**Export no Windows:** o Next 16 grava os arquivos de prefetch de segmento em subpastas quando o build roda no Windows (troca só `/` por `.`, não a barra invertida) e o navegador recebia 404 no prefetch de cada card. `scripts/corrigir-export-windows.mjs` roda como `postbuild` e dá a eles o nome esperado; em Linux/macOS não encontra nada e não faz nada.

## Decisões da etapa 4 — órbita e passagem para a grade

**Uma seção só** (`#projetos`): trilho com palco preso (órbita) → saída das telas → folha de papel com a grade da etapa 3. Arquivos em `components/orbita/`: `Orbita.tsx` (controlador), `Cena.tsx` (React Three Fiber, carregado sob demanda), `montagem.ts` (cena em Three.js puro), `layout.ts` (anéis e telas), `material.ts` (shader), `estado.ts` (progresso). Estados em `styles/orbita.css`.

**Stack:** `three` 0.186, `@react-three/fiber` 9.8.1 (aceita React 19.0–19.3), `gsap` 3.15 (ScrollTrigger).

**Geometria:** trilho = 100svh + 300svh no desktop (4 janelas) e 100svh + 200svh no celular (3), com o palco `position: sticky` (z 2, transparente, `pointer-events: none`). A folha vem depois do trilho com `margin-top: -100svh` (z 1): no fim da sequência ela está exatamente sob o palco e a página segue dali, sem salto (CLS medido 0).

**Fonte única de progresso:** um ScrollTrigger (`start: top bottom`, `end: bottom bottom`, `scrub: 0.45`) escreve `estado.p`. Dele saem câmera, giro, saída, voo das capas, as variáveis CSS da seção (`--p`, `--chegada`, `--entrada`, `--folha`), `data-fase` (antes | orbita | grade | fim) e o pedido de quadro da cena. Nada de setState por quadro.

| Faixa (desktop) | O que acontece |
|---|---|
| 0–25% | o palco sobe enquanto a abertura sai; as telas aparecem em fade, cada uma no seu tempo (até a etapa 6b: em blocos de pixel); PROJETOS + “07 cases no ar” + “role para girar” |
| 25–58% | palco preso: giro em fundo escuro (anel do meio ~1,15 volta, os outros em sentidos e velocidades próprios) |
| 58–75% | telas secundárias se afastam e somem em fade (até a 6b: pixelavam); as capas por último, só por um instante; PROJETOS sai de 68% a 79% (6c) |
| 72–100% | a folha de papel com a grade sobe pelo rasgo; as 7 capas voam e pousam planas nas imagens dos cards (`--chegada` acende as imagens em 95,5–98,5%) |

Entrada = altura do palco ÷ trilho; subida da folha = 1 − entrada (medidos, então valem também no celular). Subir a página reverte tudo, porque tudo é função de `p`.

**Telas:** 18 no desktop (7 capas no anel do meio, 7 seções internas e 4 celulares em dois anéis inclinados acima e abaixo) e 14 no celular (quatro anéis empilhados; as capas se dividem 4 + 3). Câmera dentro dos anéis, um pouco atrás do eixo: as da frente ficam inteiras, as dos lados passam perto e saem pela borda. Cada tela tem bisel de tinta e sombra dura na cor do projeto, como os cards. Curvatura no shader (raio = raio do anel × 0,62); entrada e saída por opacidade, sempre com o screenshot inteiro e nítido (os blocos de pixel saíram no ajuste 6c); telas de lado e mais longe escurecem. Órbitas tracejadas em lima e pixels soltos (lima, azul, rosa, creme) giram junto. Texturas sem conversão de cor nem tone mapping (iguais ao card), uma por imagem, com mipmaps e anisotropia 8.

**Desempenho:** `frameloop="demand"` (só desenha quando o progresso muda ou uma textura chega); DPR até 1,75× no desktop e 1,5× no celular; camada 3D com `visibility: hidden` antes e depois da sequência. GSAP e a cena 3D só são pedidos **depois da abertura** (intro pronta, pulada ou ausente + página ociosa); a checagem de WebGL roda no primeiro momento ocioso. Com as animações desligadas nada disso é baixado; com movimento reduzido no sistema a órbita existe, com 0,9 volta no anel do meio em vez de 1,15 (etapa 6).

**Navegação:** “Projetos” e “Explorar projetos” → `/#projetos`, o começo da órbita. **Ir direto aos projetos** (atalho no palco, real e focável) → grade, sem rodar a sequência, com foco no título da grade. **Voltar ao portfólio** → `/#projetos-grade` (`ancoraDaGrade` em `config/site.ts`): grade direto, mesmo card focado e centralizado, sem replay nem intro. Saltos programáticos disparam `decalq:salto`, e a suavização é concluída na hora. Teclado: focar qualquer item da grade durante a órbita leva à grade. A cena é `aria-hidden`; os projetos só existem uma vez para leitores de tela (na grade).

**Fallback e trocas:** sem a órbita (animações desligadas pelo visitante, sem JavaScript, sem WebGL, 3D que não carregou; `prefers-reduced-motion` deixou de desligá-la na etapa 6) o trilho some por CSS e a grade vem logo após a abertura, com o topo grande da etapa 3. Com a órbita, o topo da folha fica compacto (título + selo) e PROJETOS grande aparece no palco. Trocar o Movimento, mudar a preferência do sistema, falhar o 3D ou mudar a largura recoloca a rolagem: na grade, o mesmo card no mesmo ponto da janela; no meio da órbita, o mesmo ponto da sequência (ou o começo da grade, se a órbita saiu). A barra de endereço do celular (só altura) não dispara correção.

## Decisões da etapa 5 — serviços, dupla, contato e rodapé

**Ordem da Home (etapa 5, substituída no ajuste 6b):** abertura → `#projetos` (órbita + grade) → `#servicos` (papel) → `#a-dupla` (papel, aberta por uma linha de recorte tracejada com tesoura em pixel) → `#contato` (o papel acaba num rasgo invertido e o breu volta) → rodapé escuro. O rodapé também está nos cases. **Hoje a dupla vem antes dos serviços** (ver "Ajuste de 01/10/2026").

**Dados:** `src/data/servicos.ts` (6 frentes confirmadas, texto curto a partir das descrições-base, `assunto` para a mensagem do WhatsApp) e `src/data/dupla.ts` (só nome, funções e "Software Engineering Student @ FIAP"; apresentação e habilidades reescritas desses mesmos dados). Contatos e mensagens em `config/site.ts`: `contato` (URLs + `whatsappExibido`/`instagramExibido`), `whatsappCom(mensagem)` (codifica com `encodeURIComponent`) e `mensagemContato`.

**Título das seções:** `components/titulo/TituloSecao.tsx` — a assinatura do PROJETOS (pixel esticado, sombra de impressão azul, faixa de marca-texto colorida), em tom papel ou escuro.

**O que a gente cria** (`components/servicos/`): etiquetas de papel com canto cortado, ilhós e barbante, número em LED verde, ícone em pixel colado como adesivo (`IconeServico.tsx`, 11 × 11) e "Conversar sobre isso" → WhatsApp com "Oi, WEB DECALQ! Vi o portfólio e quero conversar sobre …". 3 colunas ≥ 1024 px, 2 ≥ 620, 1 abaixo. A sombra dura fica no item, não na etiqueta (o `clip-path` recortaria um `filter` aplicado nela).

**Ajuste das aberturas (01/10/2026, depois da entrega):** o `TituloSecao` ganhou `fluxo="linha"` (os trechos ficam lado a lado e só quebram entre si — sem corte de palavra nem de faixa) e os tamanhos `faixa` (`clamp(50px, 11.2vw, 164px)`) e `compacto` (`clamp(48px, 6.2vw, 100px)`). Serviços: "O QUE A GENTE CRIA" numa linha que ocupa 84–94% da largura, descrição logo abaixo, enfeites na altura da etiqueta, menos padding (o fim da grade de projetos também ficou mais curto). A dupla: abertura em duas colunas no desktop (etiqueta + título compacto à esquerda, apresentação à direita, centrada na altura do título), empilhada abaixo de 900 px. Altura da abertura até os cards em 1366 × 768: Serviços 433 → 322 px, A dupla 469 → 261 px (1920: 468 → 340 e 507 → 289; 390: 309 → 207 e 321 → 259). No passe, o nome completo não quebra mais (célula com folga de subpixel em 1366/1920). Capturas em `capturas/ajuste-aberturas/`.

**A dupla** (`components/dupla/`): "Duas cabeças, muitas ideias". **Ajuste de 01/10/2026:** os cards copiam a referência CREATIVE STUDIO PASS (`docs/referencias/creative-studio-pass.webp`), a pedido do usuário — passe horizontal, sem rosa, nas cores do portfólio em tom pastel. Substitui o crachá azul vertical da primeira versão da etapa.
- Frente: foto em polaroide com fita (hoje o recorte com as iniciais MN / GF e "foto em breve"), carimbo "coffee creative fuel", adesivo de rotuladora ("frame by frame" / "pixel pusher"), oval "Authorised for swag" (reg: FIAP · studio: web decalq), etiqueta "Lorem ipsum", gema, código de barras + "webdecalq"; "CREATIVE / STUDIO PASS" em Archivo condensada, frase empilhada saída das funções ("code. edit. design." / "think. code. design."), "code: #01/#02"; ficha com full name, roles, assinatura (primeiro nome em Yellowtail), studio WEB DECALQ e instagram @webdecalq; carimbo redondo "WEB DECALQ • APPROVED • STUDIO" com 01/01 ou 02/02; Decalqzinho; "Software Engineering Student @ FIAP" três vezes em cores diferentes (as duas primeiras escondidas do leitor de tela); estrelas grandes em pastel, estrelinhas lima e o primeiro nome em cursiva ao fundo.
- Verso: frase entre parênteses ("turning IDEAS INTO CODE, CUTS & VISUALS" / "… CODE & VISUALS"), **QR do WhatsApp de cada um** (link também, para quem está no celular), "whatsapp" + número, habilidades em linha ("development—video editing—design" / "development—design"), Decalqzinho e estrelinhas. Os campos da referência que não temos (nascimento, nacionalidade, e-mail, apelido) viraram dados confirmados.
- QR: Mateus → `wa.me/5519994813740` (o número do site); Guilherme → `wa.me/5511976538835` (passado em 01/10/2026 como "o número dele"). Gerado no build por `lib/qr.ts` (`qrcode-generator`, componente de servidor: nada vai ao navegador), em quadradinhos SVG, correção M e zona de silêncio de 4 módulos. Conferido com leitor (jsQR) no desktop e no celular.
- Variações entre os dois (para não parecer copiar e colar): base manteiga × menta, cor de destaque azul-forte × lilás escuro, estrelas grandes, nome ao fundo (azul→lima × lilás→azul), adesivo, gema, posições do oval, "lorem ipsum", café, carimbo redondo, Decalqzinho e estrelinhas.
- Fontes só dos cards (`lib/fontes-cartao.ts`, sem pré-carga): Archivo (eixo wdth, itálico) e Yellowtail.
- Medidas em `cqw` com o `<li>` como container `cartao`: a composição escala como uma peça impressa (base 680 × 410). Lado a lado ≥ 1200 px (≈ 600 px cada); um embaixo do outro até 720 px no tablet; abaixo de 540 px de card, `@container` reorganiza o mesmo passe em pé (título → foto → campos → linhas → código de barras), com textos em px.
- Virada (`CardDupla.tsx`): um botão explícito embaixo de cada passe — "Virar card" / "Voltar à frente" (o foco fica nele); estado por card; 450 ms em CSS (`preserve-3d`, perspectiva no `<li>`); trava em `data-virando` descarta cliques e teclas até `transitionend`/`transitioncancel` (ou 900 ms); face escondida `inert` + `aria-hidden`; aviso `aria-live` diz qual lado está à mostra. Inclinação de até ~4° com mouse (ponteiro fino) e movimento completo. Movimento calmo: troca direta, sem trava nem inclinação.
- Fotos: salvar em `public/dupla/<id>.webp` (vertical, ~4:5) e preencher `foto` em `data/dupla.ts`.

**Contato** (`components/contato/`): "Bora trocar uma ideia?" em pixel creme sobre o breu; WhatsApp e Instagram em telinhas CRT com o endereço aceso em fósforo verde, botões da abertura ("Chamar no WhatsApp" com `mensagemContato`, "Abrir o Instagram"); colagem da abertura parada em volta.

**Rodapé** (`components/rodape/`): marca, Decalqzinho, os mesmos destinos do menu, WhatsApp e Instagram, "Voltar ao topo" (`#topo` = cabeçalho; segue o modo de movimento) e ©.

**Menu e integração:** `secoes` ganhou `servicos` (`#servicos`) e `contato` (`#contato`); todas prontas. Um único "Contato" no cabeçalho, agora para `/#contato`; "Trocar uma ideia" (abertura) segue direto no WhatsApp. Nos cases, os itens levam às seções da Home (navegação do Next, sem recarregar nem intro). O menu do celular é sempre visível (decisão da etapa 1, sem hambúrguer) — não há menu para fechar. A âncora de leitura da órbita (troca de Movimento, redimensionamento) agora considera também serviços, dupla, contato e rodapé, e o ScrollTrigger mede de novo quando as fontes terminam de carregar.

## Decisões da etapa 6 — acabamento, acessibilidade e desempenho

**Animações ligadas por padrão.** Sem escolha salva, o site abre com `data-movimento="completo"`: intro, recortes, falhas da TV, órbita e virada animada dos cards. Botão global no cabeçalho, na Home e nos cases (`movimento/BotaoMovimento.tsx`): um `<button>` real de 44 px de altura, para teclado e toque, que diz a ação ("Desativar animações" / "Ativar animações") com uma chavinha mostrando o estado. Texto e chavinha seguem `<html data-movimento>` pelo CSS, então já aparecem certos antes da hidratação. Só a escolha explícita é salva: `localStorage` `decalq:animacoes` = `desligadas | ligadas`, restaurada ao navegar, ao recarregar e entre abas (evento `storage`). Fonte: `lib/movimento.ts`.

**Migração da chave antiga.** Auditoria: `decalq:movimento` só era escrita pelo interruptor antigo, nunca pelo sistema. "calmo" vira `desligadas` (escolha explícita preservada); "completo" é descartado, porque agora é o padrão; a chave antiga é removida. Só a preferência de movimento migra.

**Resolvido antes da intro:** o script inline de `lib/movimento-inicial.ts` escreve `data-movimento`, `data-suave` e `data-intro` antes da primeira pintura. A intro toca só na Home sem hash, com animações ligadas, na 1ª vez da sessão.

**Desligar** encerra a sequência em curso num estado estável, para falhas e recortes e tira a órbita; a grade vem logo após a abertura, com a rolagem recolocada. **Religar** retoma recortes, falhas e órbita sem tocar a intro de novo, com um temporizador de falhas só (sempre limpo antes). Medido em 6 trocas seguidas: 54 → 54 animações, falhas no ritmo normal.

**Movimento reduzido no sistema** (`data-suave="sim"`, atualizado ao vivo): tudo segue ligado, em versão atenuada. O botão continua desligando tudo.
- Recortes: `--esc-mov: 0.35` (0,22 no celular) e giro 0,3.
- Intro sem flashes: o chuvisco vira um véu leve, LED e pixel acendem sem piscar, o voo gira −8° em vez de −15° e o título não cintila.
- Falhas: amplitude ×0,4, sem varredura, faixa nem fantasma. Os quatro tipos continuam. Desde o ajuste 6b, **no mesmo ritmo do modo normal** (antes: pausas de 4,5–9 s); a pesada fica parada, sem pular de lugar, com um véu de chuvisco que sobe, fica e desce.
- Órbita com 0,9 volta, inclinação dos cards pela metade e âncoras sem rolagem animada.

**Correções da etapa 6:**
- **Falhas da TV não começavam depois da intro** (defeito desde a etapa 4). A limpeza da órbita chamava `clearTimeout` com o id de um `requestIdleCallback`. As duas sequências de ids são separadas, então isso cancelava o temporizador da TV. Agora `quandoOcioso` (`orbita/Orbita.tsx`) cancela só o que agendou. Prova: `capturas/etapa-6/corrigido/falha-automatica-*.png`.
- **Controles da TV difíceis de tocar no celular:** botões de 24 × 24 px, e o adesivo do Decalqzinho (decorativo) cobria parte de Rever e ⏻. Com `pointer: coarse`, uma área invisível de 44 px de altura vai até o vizinho, e o adesivo ganhou `pointer-events: none`. Área que aciona cada botão em 390 px: brilho 497 → 1170 px², rever 456 → 1215 px², energia 694 → 2205 px² (mapa em `corrigido/tv-toque-390-*.png`).
- **Passe da dupla:** o `<dl>` tinha `div` dentro de `div` em volta de `dt`/`dd`, marcação inválida que o axe classifica como "serious". As células de estúdio e instagram viraram filhas diretas do `<dl>`, num grid de 2 colunas. O visual é o mesmo; só o divisor se desloca 3–4 px.

**Composição revisada** em 1366×768, 1920×1080, 768×1024, 390×844 e 360×780, na Home e num case:
- sem rolagem lateral, medida em 25 alturas da página com a órbita ativa;
- cabeçalho sem sobreposição e o botão com rótulo longo sem quebrar;
- abertura cabe na 1ª tela no desktop: os botões terminam em 739 de 768 px e em 1017 de 1080 px;
- nenhuma imagem quebrada.

Em 360 px o menu fica na grade 2 × 2 (decisão da etapa 1).

## Ajuste de 01/10/2026 — ordem da Home e ritmo das falhas (6b)

**Ordem.** Em `app/page.tsx`, `SecaoDupla` vem antes de `SecaoServicos` no DOM, então Tab e leitor de tela seguem a ordem visual. A seção da dupla mudou de lugar inteira: a linha de recorte com a tesoura agora separa a grade da dupla, e da dupla para os serviços o papel continua sem divisória. Cards, conteúdos e virada não mudaram. O menu do cabeçalho e do rodapé já estava na ordem Projetos · A dupla · O que a gente cria · Contato desde a etapa 1 e agora acompanha a página. IDs e destinos das âncoras não mudaram (`/#a-dupla`, `/#servicos`, `/#contato`, também a partir dos cases). Fundos: grade, dupla e serviços em papel claro; contato no breu.

**Órbita e rolagem.** As medidas da órbita são relativas ao próprio trilho (`start: top bottom`, `end: bottom bottom`, entrada = palco ÷ trilho), e tudo o que mudou de lugar fica abaixo dele. Por isso nenhum número da órbita precisou mudar. A âncora de leitura usada na troca de Movimento e no redimensionamento já considerava qualquer seção depois da grade; só o comentário foi atualizado. Ida, reversão, passagem para a grade, rolagem rápida, saltos e âncoras foram conferidos de novo.

**Falhas da TV: ritmo** (`falhas.ts` → `criarRitmo`; `controle.ts`):
- **Relógio de execução ativa** no controlador. Ele só anda enquanto as falhas podem acontecer: TV ligada e estável, intro pronta, animações ligadas, cena à vista e aba visível.
- **Pausa:** 1–3 s sorteados entre o fim de uma falha e o começo da próxima (`PAUSA_MS`).
- **Pesada marcada no relógio ativo:** a primeira 6–10 s depois da intro (`PRIMEIRA_PESADA_MS`); as seguintes 10,5–14,5 s depois do começo da anterior (`ENTRE_PESADAS_MS`). A pausa antes dela é calculada para cair no ponto marcado, nunca abaixo de 1 s. A pausa de uma falha menor é limitada para sobrar pelo menos 1 s antes da pesada.
- **Falhas menores** saem de sacos embaralhados. O primeiro tem leve, moderada e forte, então os quatro tipos aparecem nos primeiros 15 s. Os seguintes têm duas leves, uma moderada e uma forte. O mesmo tipo nunca aparece duas vezes seguidas.
- **Pesada de 1650–1900 ms**, com defeito do primeiro ao último quadro:
  - tranco nos primeiros 90 ms;
  - depois o quadro trava distorcido. Sem o suave, ele escorrega duas vezes, as faixas copiadas pulam de lugar, o fantasma muda e uma faixa de luz (opacidade 0,5–0,6) troca de altura;
  - nos últimos 120 ms sobra só um resto de deslocamento.

  O chuvisco vai do começo ao fim, entre 0,18 e 0,42 de opacidade, andando cerca de 14 passos por segundo.
- **Uma falha por vez**, com um temporizador só. Sair de vista, ocultar a aba, mexer na energia ou desligar o Movimento chama `pararFalhas`. Ela cancela as animações (nenhuma tem preenchimento, então a imagem volta no mesmo quadro), apaga o temporizador e para o relógio.
- **Página aberta já em segundo plano:** o controlador agora grava `data-ambiente="pausado"` já na largada. Antes o atributo ficava "ativo" até a primeira troca; as falhas não rodavam, mas os recortes seguiam animados pelo CSS. Visto no painel de preview, que fica oculto de verdade.

**Movimento reduzido:** mesmo ritmo e mesma duração da pesada, na versão atenuada: deslocamentos a 40%, sem faixa de luz, fantasma nem cintilação; quadro da pesada parado; chuvisco num véu de 0,13 que sobe, fica e desce.
- **Decisão desta rodada:** antes, o reduzido também espaçava as falhas (4,5–9 s). Agora não, porque o pedido de frequência não abriu exceção e a máquina do usuário roda em reduzido.
- Para voltar a espaçar, basta mudar a pausa em `criarRitmo` quando `suave`.

**Medido** (build de produção, Chrome headless, página parada; teste em 1366 × 768, vídeos em 1280 × 720):

| Medida | Normal | Movimento reduzido |
|---|---|---|
| Pausa entre falhas | teste 1,10–2,82 s (16 pausas) · vídeo 1,17–2,85 s | teste 1,12–2,47 s (12) · vídeo 1,30–3,00 s |
| Pesada (estado da TV, `data-falha`) | teste 1,69–1,82 s (4) · vídeo 1,83 e 1,67 s | teste 1,77 e 1,85 s · vídeo 1,72 e 1,75 s |
| **Pesada visível no vídeo** | **1,84 s e 1,68 s** | **1,72 s e 1,72 s** |
| Entre pesadas (começo a começo) | teste 10,62–14,02 s · vídeo 13,04 s | teste 13,29 s · vídeo 12,44 s |
| 1ª pesada após a intro | teste 6,93 s · vídeo 7,92 s | vídeo 8,05 s |
| Falhas nos 30 s de vídeo | 11: 4 leves, 3 moderadas, 2 fortes, 2 pesadas | 11: 4 leves, 2 moderadas, 3 fortes, 2 pesadas |

Tempo ativo: com a cena fora de vista por 6,43 s, a pesada seguinte veio 19,48 s depois no relógio, ou seja, 13,05 s de execução ativa.

A "pesada visível" vem do próprio vídeo. Cada quadro da área da tela é comparado com a imagem normal (mediana dos 750 quadros). As 11 falhas de cada gravação aparecem no vídeo, e nenhum trecho alterado do vídeo fica sem falha correspondente.

## Ajuste 6c (01/10/2026) — telas nítidas na órbita e fade tardio de PROJETOS

**Causa das telas fragmentadas.** Era um efeito acrescentado na etapa 4, não falha de carregamento. O shader (`orbita/material.ts`) tinha dois recursos:
- `uRevela` descartava os blocos de uma grade 16 × N em ordem aleatória: eram as áreas vazias;
- `uBlocos` reduzia a imagem a 12–18 blocos por linha: eram os mosaicos.

A montagem (`orbita/montagem.ts`) usava os dois na entrada (0–25%), na saída das telas e na volta das capas antes do voo.

Havia também um caso de carregamento: enquanto a imagem não chegava, a tela era desenhada com cor lisa e moldura, um quadro vazio.

**Correção:**
- Os dois recursos saíram do shader. Entrada, saída e volta das capas agora são só opacidade (`uOpacidade`), com o screenshot sempre inteiro e nítido.
- A ordem de desenho deixa o fade limpo: telas de trás para a frente (`renderOrder` do grupo, recalculado a cada quadro) e, em cada tela, imagem → bisel → sombra. Bisel e sombra ficam um pouco atrás e tudo grava profundidade, então eles só aparecem em volta da imagem. Órbitas e pixels são desenhados depois e somem atrás das telas.
- Uma tela sem imagem não é desenhada. Quando a imagem chega, entra num fade de 280 ms; a Cena pede quadros só durante esse fade.
- Não mudaram: telas curvas, perspectiva, profundidade, quantidade (18 no desktop, 14 no celular), voo das capas e pouso nos cards. Os pixels decorativos e as órbitas tracejadas seguem; as falhas de TV continuam só na TV da abertura.

**Título PROJETOS do palco.** Antes, `opacity: clamp(0, (entrada + 0,03 − p) × 12, 1)` fazia o título sumir entre p = 0,197 e 0,28, logo que o palco prendia, e o giro inteiro ficava sem identificação.
- **Régua nova** (`orbita/estado.ts`): o trecho orbital vai do começo do trilho até o fim do giro dos anéis (`fimDoGiro` = folha + 0,05); é a mesma faixa que move a órbita. `TITULO = [0,85, 0,99]` desse trecho, com curva suave (smoothstep).
- **Conta:** o controlador (`Orbita.tsx`) calcula `--titulo` no mesmo `aplicar()` que escreve `--p`, a partir do mesmo ScrollTrigger. O CSS só lê o valor. Subir a página faz o caminho inverso.
- **Limites efetivos em p** (progresso do trilho):

| | Trecho orbital | Inteiro até | Zero em | Folha começa a subir |
|---|---|---|---|---|
| Desktop | 0 → 0,800 | 0,680 | 0,792 | 0,750 |
| Celular | 0 → 0,717 | 0,609 | 0,710 | 0,667 |

- **Por que essa régua:** com 85–99% do trilho inteiro (p 0,85–0,99), o título ficaria sobre a busca e os filtros da folha, que já sobe desde 0,75. Medindo pelo trecho orbital, ele acompanha todo o giro e a saída das telas e some quando as capas começam a voar. Nesse momento a folha ainda está na parte de baixo da janela.
- **Preservados:** tamanho, posição e a subida de 90 px ao longo do trilho; a distância total de rolagem não mudou; o título continua sem receber ponteiro. Com a sequência concluída (`data-fase="fim"`), ele fica `visibility: hidden`. Nenhum ancestral (palco, trilho, seção) tem opacidade própria; conferido em 101 pontos.

## Catálogo completo (02/10/2026)

**Separação.** Um catálogo só (`src/data/projetos.ts`, 14 projetos) e uma seleção explícita para a Home:
- `DESTAQUES` lista os slugs, em ordem: Helios, Reis Lazer, ProspectLife, Nativa, Vai de Smash, The One Bistrô e APS.
- `destaques` é a lista pronta; `eDestaque(slug)` responde se um projeto está nela.
- Órbita (`orbita/layout.ts`) e grade da Home usam só os destaques. Um projeto novo entra no catálogo sem mudar a Home, então a órbita, o trilho e a cena não mudaram de tamanho.
- A página `/projetos/` usa o catálogo inteiro.

**Contadores:**
- **Home:** o selo da grade e o do palco dizem "07 destaques" (antes "cases no ar"). O status da busca diz "7 destaques" ou "3 de 7 destaques", e os filtros mostram Todos 7 · Sites 6 · Sistemas 1.
- **Catálogo:** "14 projetos · 7 em destaque na Home" no topo e "14 projetos" na busca. Filtros Todos 14 · Sites 12 · Sistemas 2, derivados da lista (`categoriasDe`).
- **Cases:** numerados de 01 a 14 ("Case 10/14").

**Home, última linha:** a APS fica na coluna esquerda; a chamada `projetos/ChamadaCatalogo.tsx` é o último item da grade, na coluna direita.
- Recado de papel com fita, sombra dura lima como as telas dos cards e um maço com três telas reais de projetos que não estão nos destaques.
- Selo LED "14 projetos no catálogo", "Tem mais por aqui." em pixel, "Explore todos os nossos projetos." e o botão principal "Ver todos os projetos →" para `/projetos/`.
- Medido: no desktop, a mesma linha e a mesma altura da APS (597 px em 1366, 613 px em 1920). No celular fica empilhada sob a APS, com a altura do conteúdo. O "Ver case" da APS segue no case dela.
- Busca sem resultado na Home oferece "Procurar em todos os projetos" (`/projetos/?busca=…`), e o catálogo abre já filtrado.

**Página `/projetos/`** (`app/projetos/page.tsx` + `catalogo/Catalogo.tsx`):
- Topo no breu, como o dos cases: "Voltar ao início", contador LED, título "Todos os projetos" (`TituloSecao`) e apresentação.
- Depois, o rasgo e a folha de papel com a mesma `GradeProjetos` (busca, filtros, estado vazio, cards) e o Decalqzinho colado.
- Cabeçalho e rodapé do site; os itens do menu levam às seções da Home.
- Imagens preguiçosas (`loading="lazy"`), em 1200 px.
- Convive com `/projetos/[slug]/` na mesma pasta: o export gera `projetos/index.html` e `projetos/<slug>/index.html`.

**Volta à origem** (`lib/grade-estado.ts`):
- Cada grade guarda o próprio contexto na sessão: `decalq:grade` na Home e `decalq:catalogo` no catálogo (busca, filtro, case de origem).
- Abrir um card grava de qual grade saiu (`decalq:case-origem`), e isso vale também ao seguir para o case anterior ou o próximo.
- O botão do case diz "Voltar ao portfólio" (→ `/#projetos-grade`) ou "Voltar a todos os projetos" (→ `/projetos/`), conforme a origem.
- Sem registro (acesso direto), destaques voltam à Home e os demais ao catálogo; esse padrão já vem no HTML estático.
- Na volta, a grade restaura busca e filtro e foca o card de origem.

**Projetos adicionados** (08–14). Conferidos nos sites publicados em `<slug>.vercel.app`: nome, conteúdo e tecnologia lidos da própria página. Screenshots tirados do site real (1440 × 936 e 430 × 820, a 2×). Nenhum site traz crédito da WEB DECALQ. O status vem do que cada site mostra:

| # | Projeto | Endereço | Status no catálogo | Por quê |
|---|---|---|---|---|
| 08 | Van Escolar do Tio Robert | van-tio-robert | — (no ar) | contato real, (11) 97434-9515 |
| 09 | Pâmela Hanara | portfolio-pamela | — (no ar) | psicóloga, CRP 06/195036, WhatsApp e Instagram reais |
| 10 | Aninha Costura Afetiva | aninha-proposta | Proposta | o site diz "Proposta de site · demonstração" |
| 11 | Amora Pet Care | amora-pet-care | Conceito | telefones em sequência (99999-4545, 3232-4545), equipe e avaliações de exemplo |
| 12 | Alba Enxovais | alba-enxovais | Conceito | (11) 3000-0000, "desde 1987", fundadora e loja sem confirmação; mesma base do Aninha |
| 13 | Instituto Batutinhas | os-batutinhas | Em desenvolvimento | contatos de exemplo, (00) 90000-0000 |
| 14 | Florescer | florescer | Protótipo | painel gerado no v0.app |

As descrições não repetem métricas, avaliações nem depoimentos dos sites. Ano só quando o rodapé mostra (Pâmela e Florescer, sem ano).

**Duplicatas e versões:**
- Vai de Smash continua com uma entrada só.
- As versões do portfólio da WEB DECALQ são o mesmo projeto (o portfólio da dupla) e não entraram como case: `portf-lio-decalqwebdev.vercel.app` (v1), `portf-lio2webdecalq.vercel.app` (v2), este projeto e o `decalq-portfolio-novo`. Também ficou de fora `portfolio-decalq.vercel.app`, que pede login da Vercel.
- `decalq.vercel.app` é um "Create Next App" sem conteúdo.

## Destinos dos links

| Link | Hoje | Quando a seção existir |
|---|---|---|
| Trocar uma ideia | WhatsApp `wa.me/5519994813740`, nova aba | — |
| Contato (menu, cases, rodapé) | `/#contato` (etapa 5) | — |
| Chamar no WhatsApp (contato) | WhatsApp com mensagem pronta, nova aba | — |
| Conversar sobre isso (serviços) | WhatsApp com a mensagem do serviço, nova aba | — |
| Abrir o Instagram (contato, rodapé) | `instagram.com/webdecalq`, nova aba | — |
| Voltar ao topo (rodapé) | `#topo` | — |
| Projetos / Explorar projetos | `/#projetos` — começo da órbita (etapa 4) | — |
| Ir direto aos projetos (palco) | `#projetos-grade` — grade, sem a sequência | — |
| Voltar ao portfólio (cases abertos pela Home; destaques sem origem) | `/#projetos-grade` — grade, card de origem focado | — |
| Voltar a todos os projetos (cases abertos pelo catálogo; demais sem origem) | `/projetos/` — catálogo, busca, filtro e card de origem | — |
| Ver todos os projetos (chamada na Home) | `/projetos/` | — |
| Procurar em todos os projetos (busca vazia da Home) | `/projetos/?busca=…` | — |
| Voltar ao início (catálogo) | `/` | — |
| A dupla | `/#a-dupla` (etapa 5) | — |
| O que a gente cria | `/#servicos` (etapa 5) | — |

Ativar = trocar `pronta: false` → `true` em `secoes` (`src/config/site.ts`) na etapa que cria a seção, com o `id` na seção. Enquanto `false`, o item aparece sem `href` (`role="link"`, `aria-disabled`), nunca como âncora para lugar nenhum. Todos os links e textos fixos moram em `src/config/site.ts`.

## Próximas etapas — conteúdo definido

- **Projetos (3–4):** concluídos. Ordem da Home (ajuste 6b): abertura → projetos giratórios → grade → dupla → serviços → contato; escuro na abertura e no contato, papel claro na grade, na dupla e nos serviços.
- **Serviços:** websites/landing pages, sistemas/back-end, IA, social media (design e edição de vídeo), automação, dados/dashboards.
- **Dupla:** Mateus Bomfim Nascimento — Developer · Video Editor · Designer. Guilherme Hass Ferreira — Developer · Designer. Ambos: Software Engineering Student @ FIAP.
- **Contato:** WhatsApp `https://wa.me/5519994813740` · Instagram `https://www.instagram.com/webdecalq/`.

### Etapa 5 — cards "A dupla" (direção registrada; implementada, ver Decisões da etapa 5)

- Dois cards de credencial criativa, mesmo destaque para os dois; lado a lado no desktop, empilhados no celular.
- Base de composição: referência azul **PORTFOLIO ID CARD**; detalhes de colagem, adesivos e carimbos: **CREATIVE STUDIO PASS**. Adaptar à identidade WEB DECALQ (paleta do site nos cards, fundo de papel claro na seção).
- Frente: foto em destaque, nome, funções, "Software Engineering Student @ FIAP". Verso: apresentação curta e habilidades — só informações fornecidas. Decalqzinho e grafismos da abertura.
- Botão "Virar card" (teclado e toque), animação curta; com movimento reduzido, troca direta das faces.
- Fotos chegam depois: reservar e identificar o espaço de cada uma.

## Pendências e assets faltantes

- **Fotos de Mateus e Guilherme:** recebidas em 01/10/2026 (Mateus em HEIC, convertido; Guilherme em JPEG) e aplicadas: `public/dupla/mateus.webp` e `guilherme.webp`, recortes 4:5 de 800 × 1000. Os originais não foram copiados para o projeto. Para trocar, substituir os arquivos (mesmo formato).
- A referência CREATIVE STUDIO PASS chegou em 01/10/2026 e os cards a seguem. A PORTFOLIO ID CARD (azul) não chegou e deixou de ser necessária.
- Confirmar com o usuário se o QR de cada card deve mesmo ser o WhatsApp de cada um (Mateus = número do site; Guilherme = (11) 97653-8835). Trocar é um campo em `src/data/dupla.ts`.
- As referências das telas curvas (etapa 4) não vieram como arquivo: a órbita seguiu os critérios do texto (curvatura, círculos e arcos, profundidade, estar cercado). Se chegarem, ajustar `orbita/layout.ts` (anéis, câmera) e `montagem.ts`.
- Aviso no console com a órbita: `THREE.Clock: This module has been deprecated` vem de dentro do @react-three/fiber 9.8 com three 0.186; some quando o R3F atualizar.
- Celular: numa tela em pé cada anel mostra uma tela por vez; há instantes do giro com 1–2 telas visíveis (de 1 a 3 no geral).
- A "imagem clara" de referência não veio nem na etapa 3: grade e cases seguiram a descrição do prompt (papel claro com textura discreta, títulos grandes, screenshots protagonistas). Se chegar, ajustar `papel/` e os títulos.
- Cases (etapa 3): cada projeto tem só três telas reais (primeira dobra e uma seção interna no desktop, primeira dobra no celular). Faltam telas adicionais, logos dos clientes e confirmação de que os clientes autorizam a exibição.
- Serviços por projeto: só o que os dados sustentam — "Website" nos seis sites, "Sistema web" e "IA" no ProspectLife. A divisão de design, desenvolvimento, conteúdo ou social media em cada projeto não está confirmada.
- Os objetos da colagem são desenhados em código; se houver arte final (PNG/SVG), basta trocar o componente correspondente em `Objetos.tsx`.
- **Desempenho no celular (medido na etapa 6, não resolvido):** a Home é pesada em celular lento. Os três custos, medidos com CPU 4× mais lenta:
  - **Primeira pintura:** as texturas de papel e a carcaça da TV são filtros SVG `feTurbulence` desenhados ao vivo, cerca de 2,6 s de estilo, layout e pintura no primeiro quadro. Saída sugerida: pré-renderizar as texturas em imagens.
  - **Hidratação do React:** cerca de 2,4 s.
  - **3D da órbita:** three.js leva cerca de 1,4 s para avaliar, mais a montagem da cena. Carrega depois da intro por decisão da etapa 4.

  Nesse cenário a trava de segurança de 4 s libera a abertura antes da hidratação, e o celular lento vê o estado final sem a intro. É o fallback previsto, mas a abertura fica escondida até cerca de 7 s.
- Confirmar com o usuário (ajuste 6b): no movimento reduzido do sistema, as falhas agora seguem o mesmo ritmo do modo normal (1–3 s, pesada a cada 10–15 s), só que atenuadas. Antes, eram espaçadas (4,5–9 s).
- `docs/direcao-visual.md` ainda descreve serviços antes da dupla; a ordem vigente está no topo deste brief.
- **Catálogo completo (02/10/2026):**
  - Os dois prints do painel citados no pedido não chegaram; os oito endereços vieram da lista do texto.
  - `barbershop-premium.vercel.app` mostra outro projeto: "Barbershop Gold – Member Portal", em indonésio. Não entrou no catálogo; falta o endereço real desse projeto no painel.
  - `florescer.vercel.app` tem nome genérico: confirmar que é o deploy do painel (o conteúdo, um painel agrícola em português feito no v0, combina).
  - Confirmar os status: Amora e Alba como conceito, Batutinhas em desenvolvimento, Florescer protótipo.
  - Confirmar se os clientes de 08–14 autorizam a exibição (mesma pendência dos 7 cases).
  - Ano de Pâmela e Florescer: os sites não mostram.
  - Se as versões do portfólio da WEB DECALQ devem virar um case próprio, é uma entrada a mais no catálogo.
- Publicação: fora da etapa 6, fica para o próximo pedido.

## Rodar e verificar

```bash
npm install
npm run dev          # http://localhost:3200
npm run lint && npm run typecheck && npm run build   # gera out/
```

Para ver o build: config `decalq-criativo-build` no `.claude/launch.json` da raiz (serve `out/` em http://localhost:3211).

Catálogo completo (etapa 7) em `capturas/catalogo-completo/`:
- **Home, última linha** (APS + chamada) em 1366×768, 1920×1080, 768×1024 e 390×844.
- **Catálogo:** topo e página inteira nos mesmos tamanhos; case novo (Aninha) no desktop e no celular.
- **Resumos:** `resumo-home-ultima-linha-desktop.png`, `resumo-celular.png` e `resumo-catalogo-inteiro-*.png`.
- **Testes** sobre o build final: 233 checagens, 0 falhas.
  - Novo: catálogo, 41 checagens (`testes-catalogo.txt`): Home com 7 destaques e chamada, contadores, 14 projetos sem duplicatas, status, imagens preguiçosas e nítidas, busca, filtros, estado vazio, volta à origem (catálogo, Home e próximo case), menu e "Voltar ao início" a partir do catálogo, acesso direto aos 7 cases novos, 404 e celular.
  - Reaproveitados: navegação 48, órbita 26, etapa 5 32, título e telas 24, movimento 21, vazamento 8, ordem 33. Na ordem, o Tab agora parte do botão da chamada, que vem logo depois da APS.

Ajuste 6c em `capturas/orbita-telas-titulo/`:
- **Gravações reais**, rolando com a roda do mouse: entrada → giro → saída → capas pousando na grade → reversão até a entrada. São três: `orbita-ida-volta-1280x720.webm`, `orbita-ida-volta-movimento-reduzido-1280x720.webm` e `orbita-ida-volta-celular-390x844.webm`. A legenda no canto (progresso da órbita, do trecho orbital e opacidade de PROJETOS) é sobreposição só da gravação; ela lê `--p` e `--titulo`.
- **Antes e depois** nas mesmas posições: `antes-depois-desktop-1366x768.png` e `antes-depois-celular-390x844.png` (em cima, antes; embaixo, depois). Os quadros soltos estão em `antes/` e `depois/`, de p = 0,08 a 0,93, com as medidas em `posicoes.txt`.
- **Testes** sobre o build final: 192 checagens, 0 falhas.
  - Novo: título e telas, 24 checagens (`testes-titulo-e-telas.txt`).
    - shader sem blocos, pixelização nem `discard`;
    - régua do título em 101 pontos, no desktop e no celular;
    - nenhum ancestral apaga o título, e ele nunca cobre busca, filtros ou cards;
    - rolagem lenta de ida e volta, rolagem rápida, "Ir direto aos projetos" e retorno do case;
    - imagens atrasadas 6 s: nenhuma moldura vazia.
  - Reaproveitados: órbita 26, navegação 48, etapa 5 32, movimento 21, vazamento 8, ordem 33.

Ajuste 6b em `capturas/ordem-e-falhas/`:
- **Gravações reais de 30 s da TV parada**, contadas do fim da intro, sem nenhuma interação: `tv-parada-30s-1280x720.webm` (normal) e `tv-parada-30s-movimento-reduzido-1280x720.webm`. A legenda no canto (tempo desde a intro e tipo da falha) é sobreposição só da gravação; ela lê o `data-falha` da tela.
- **Medida quadro a quadro:** `tv-medida-normal.txt` e `tv-medida-movimento-reduzido.txt`. Quadros da pesada tirados dos vídeos: `tv-pesada-quadros-do-video.png`.
- **Ordem** em 1366×768, 1920×1080, 768×1024 e 390×844:
  - `home-<tamanho>-0-abertura` … `5-servicos-para-contato` (abertura, grade → dupla, dupla, dupla → serviços, serviços, serviços → contato);
  - `mapa-home-*-animacoes-desativadas.png`: página inteira, sem a órbita, para caber numa imagem.
- **Testes**, rodada final sobre o build final: 225 checagens, 0 falhas.
  - Novos: falhas da TV 35 e ordem 33 (`testes-falhas-e-ordem.txt`).
  - Reaproveitados: órbita 26, etapa 5 32, navegação 48, movimento 21, TV 22, vazamento 8.
  - Ajustes nos reaproveitados: só os limites de tempo das falhas, e a contagem de animações agora desconta a falha em curso. Com falhas a cada 1–3 s, a contagem "antes" pegou uma leve no meio (59 = 54 fixas + 5 da falha).

Etapa 6 em `capturas/etapa-6/`:
- **Gravações reais do Chrome:** primeira visita sem cliques, a mesma com movimento reduzido, desativar → recarregar → ativar, controles da TV, órbita ida e volta, virada dos cards.
- **Capturas:** `revisao/` (Home e case nos 5 tamanhos) e `corrigido/` (antes e depois).
- **Testes:** movimento 21, TV 22, navegação 48, órbita 26, etapa 5 32 e vazamento 8, todos passando na rodada completa sobre o build final (157 checagens, 0 falhas).
- **Acessibilidade:** axe-core 4.13 (WCAG 2.2 AA) dá 0 violações em 14 estados. O contraste que o axe não decide foi medido por imagem em 216 textos: todo texto informativo passa.
- **Desempenho:** Lighthouse 13.5, só desempenho, servidor com brotli, mediana de 3 rodadas.

| Página | Nota | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|
| Case, desktop | 100 | 0,30 s | 0,80 s | 25 ms | 0 |
| Case, celular simulado (4× CPU, 4G lento) | 81 | 1,65 s | 3,90 s | 251 ms | 0 |
| Home, desktop | 75 | 0,30 s | 0,90 s | 609 ms | 0,016 |
| Home, celular simulado | 34 | 2,57 s | 6,86 s | 12 s | 0 |

Na Home pesa o carregamento do 3D dentro da janela de medição; detalhes em Pendências.

Capturas da etapa 1 em `capturas/etapa-1/` (build estático, Chrome headless): 1366×768, 1366×657, 1920×1080, 1280×720, 1024×768, 768×1024, 390×844, 360×740 e zoom de 200%.

Etapa 2 em `capturas/etapa-2/`: estado final nos mesmos tamanhos e gravações reais do Chrome (`.webm`) — intro + flutuação + falha no desktop, movimento reduzido → ativar, celular, pular intro, e falha e intro em câmera lenta.

Etapa 5 em `capturas/etapa-5/`: serviços, dupla (frente e verso), contato e rodapé em 1440×900, dupla em 768×1024, celular 390×844 e 360×740; gravação `cards-dupla-1280x720.webm` (passes CREATIVE STUDIO PASS) (inclinação, virada, cliques repetidos descartados, teclado, troca direta com movimento desligado — cursor e legendas são sobreposições só da gravação). Testes da etapa 5 (32 checagens): duração da virada, trava, independência dos cards, face escondida inerte e fora da leitura, foco, Tab, Enter/Espaço, inclinação e repouso, movimento reduzido, toque, 11 links de WhatsApp (10 no número do site + o QR do Guilherme no número dele; nova aba; mensagens decodificadas e codificadas), QR codes lidos com jsQR, Instagram, menu na Home e a partir dos cases, voltar ao topo, órbita + âncora para o contato, troca de movimento lendo a dupla. Órbita (26) e etapa 3 (48) seguem passando.

Etapa 4 em `capturas/etapa-4/`: gravações reais do Chrome — `orbita-desktop-1280x800.webm` (abre no modo calmo com a grade direto, liga Movimento, desce pela órbita até a grade e sobe revertendo) e `orbita-celular-390x844.webm`; fases em desktop 1440×900 e celular 390×844 (entrada, giro, telas somem, capas pousam, grade) e movimento reduzido (grade direto). Testes da órbita (26 checagens): ida e volta monotônicas, CLS 0, rolagem rápida e interrupção, Explorar/Ir direto/Voltar/menu do case, Tab para a grade, preferência mudando no meio e na grade, redimensionar no meio, movimento reduzido, sem WebGL, toque no celular. Os 48 testes da etapa 3 seguem passando com a órbita ativa. Medido no Chrome desta máquina (AMD Radeon via ANGLE): 57–60 fps rolando pela órbita, p95 ~17 ms; JS da Home na carga 515 KB (156 KB gzip); GSAP + Three/R3F depois da abertura 1015 KB (284 KB gzip).

Etapa 3 em `capturas/etapa-3/` (build estático, Chrome real, movimento reduzido): grade e case em 1440×900, 768×1024 e 390×844 (tela e página inteira), primeira tela em 1366×768, hover + foco do card, estado vazio, filtro e galeria ampliada no desktop e no celular. Teste de navegação ponta a ponta (48 checagens): âncoras, busca, filtros, estado vazio, card → case, galeria por teclado, próximo case, Voltar com contexto, menu a partir do case, acesso direto aos 7 cases, 404, intro sem repetir, rolagem no modo calmo.

Ajustes da etapa 2 em `capturas/etapa-2b/`: gravação real de ~42 s no desktop (movimento próprio, quatro falhas, brilho, desligar/ligar e "Rever intro" com cliques repetidos — cursor e legendas são sobreposições só da gravação), trecho de 16 s no celular (toques repetidos na energia) e estados finais.

**Para rever a intro:** botão ↻ na moldura da TV ("Rever intro"). A automática toca uma vez por sessão (também com movimento reduzido no sistema, em versão atenuada); se as animações foram desativadas, "Ativar animações" no cabeçalho.
