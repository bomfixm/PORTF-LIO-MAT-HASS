# Vídeo "Ideia foragida" — Reels 1080 × 1920, ~33 s

Roteiro em `roteiro.md`. O vídeo usa as peças **reais** do portfólio (TV, recortes,
Decalqzinho, passes da dupla, telas dos projetos, títulos, botões): a página do site
(build em `../out`) é aberta no Chrome headless e um palco de 540 × 960 px CSS (DPR 2)
por cima recebe **cópias** dessas peças. Uma linha do tempo GSAP pausada é avançada
quadro a quadro (30 fps), então a gravação é determinística. Nada aqui mexe no site:
o palco só existe dentro do navegador de gravação.

## Estado (23/10/2026)

| Parte | Estado |
|---|---|
| Voz (IA masculina, edge-tts `pt-BR-AntonioNeural`) | **pronta**: `voz/f01–f15.wav` (silêncio aparado) + `voz/tempos.json` (início e duração de cada fala; última termina em 32,21 s) |
| Servidor local (`servidor.mjs`: site na raiz, vídeo em `/video/`, GSAP em `/video/gsap/`) | pronto |
| CSS do palco (`diretor/palco.css`) | pronto |
| Diretor das cenas (`diretor/diretor.js`) | pronto: 5 cenas, legendas f01–f13, lista de efeitos sonoros (`sons`) |
| Gravação dos quadros (`render.mjs`) | pronto: prévia (quadros soltos e folha de contato) e 30 fps → `saida/video-mudo.mp4` |
| Efeitos sonoros + mixagem + MP4 final (`mixar.mjs`) | pronto: efeitos sintetizados, −14 LUFS → `saida/ideia-foragida-1080x1920.mp4` |

## Rodar

```bash
# na raiz do repositório: gerar o build do site (out/)
npm ci && npm run build
# nesta pasta
npm install
node servidor.mjs 3230            # http://localhost:3230/  (site) e /video/... (vídeo)
python voz/gerar_voz.py           # só se precisar refazer a voz (pip install edge-tts; precisa de rede)

# gravar (o render sobe o próprio servidor numa porta livre)
export CHROME_PATH=/caminho/do/chrome   # no Linux da nuvem: /opt/pw-browsers/chromium
node render.mjs --folha 1                 # folha de contato → saida/previa/folha.jpg
node render.mjs --previa 2.5,7.6,26       # quadros soltos → saida/previa/q-<t>.png
node render.mjs                           # 1005 quadros 1080 × 1920 → saida/video-mudo.mp4 + saida/sons.json (~25 min)
node mixar.mjs                            # efeitos + voz + loudnorm → saida/ideia-foragida-1080x1920.mp4
```

Os efeitos sonoros saem da própria linha do tempo: cada `som(t, tipo)` do diretor vai para
`saida/sons.json`, e o `mixar.mjs` tem uma receita lavfi por tipo (tv, bate, rompe, whoosh,
batida, carimbo, rasgo, papel, pop, risco, teclas, baque, virada, descolar).

Chrome: `CHROME_PATH` aponta o executável (no Windows o padrão é o Chrome instalado).
No Linux, `npx playwright install chromium` e usar esse caminho. Para WebGL não é
preciso nada (a órbita 3D não entra no vídeo).

Abrir a página **com as animações do site desligadas** (`localStorage['decalq:animacoes']='desligadas'`
num init script): sem intro, sem falhas da TV e sem flutuação por CSS — tudo que se
move no vídeo vem da linha do tempo. Depois injetar `/video/gsap/gsap.min.js`,
`/video/diretor/palco.css` e `/video/diretor/diretor.js`.

## Peças do site (achar por classe de CSS Module: `Modulo-module__hash__nome`)

- Composição da abertura: `Abertura::composicao` (container `inline-size`, proporção 100/112;
  a 540 px fica 540 × 605). Dentro: recortes `[data-objeto=...]` (papel-sorriso, papel-estrela,
  papel-globo, papel-xadrez, tubo-rosa, tubo-amarelo, estrela-lima, brilho-pixel, rabisco-azul…),
  TV `[data-tv]`, adesivo do Decalqzinho `[data-adesivo]` (olhos: `path[data-olho]`).
- Tela da TV `[data-tela]`: camadas `imagem` (conteúdo), `apagada` (opacidade 1 = desligada),
  `linha` (linha de energia), `chuvisco`, `varredura`, `vidro`; LED `[data-led]`.
  Remover `[data-tela-copia]` dos clones. Texto: `TelaPortfolio::forma` ("Portfólio", Jersey 10,
  scaleY 1,42) e `TelaPortfolio::assinatura` ("WEB DECALQ").
- Passes da dupla: `[data-pessoa=mateus|guilherme]` (no celular ficam em pé, 505 × 975);
  virar = `rotateY` em `CardDupla::faces` (verso = 180°).
- Card de projeto: `[data-grade] [data-projeto=<slug>] article` (moldura com print real,
  fita e sombra colorida); esconder `GradeProjetos::info`.
- Títulos: `#servicos-titulo` (tom papel), `#dupla-titulo`, `#contato-titulo` (tom escuro);
  marcadores `data-marcador` = rosa | amarelo | azul-claro | lilas.
- Botão principal (papel lima rasgado): `Botao::botao[data-variante=principal]`.
- Marca: `Cabecalho::marca` (lettering + asterisco).
- Filtros SVG do site (para textura de carimbo/giz): `#cg-impresso`, `#cg-giz`, `#cg-papel`.
- Cores: breu `#09100c`, creme `#ede8de`, papel `#efe9dc`, tinta `#0d0f0c`, lima `#bcfa46`,
  azul-forte `#0a2ae7`, azul `#2746dd`, rosa `#fa80a5`, amarelo `#f6c537`, lilás `#c983dc`,
  fósforo `#c9f9ae`. Fontes: "Jersey 10", "IBM Plex Mono", Archivo, Yellowtail.

## Plano das cenas (tempos amarrados a `voz/tempos.json`)

Palco 540 × 960. Zona segura do Reels: nada importante acima de y 70 nem abaixo de y 770.
Legenda das falas: pílula escura com borda lima, centro em y 742 (`.v-legenda`), para
f01–f13 (f14 e f15 já viram o texto final na tela).

1. **0–3,15 · Gancho.** Preto → TV (composição clonada, y ≈ 95) liga: LED, linha de energia
   (scaleX 0→1), imagem abre em scaleY com brilho, chuvisco some. Texto da tela trocado para
   "IDEIA / FORAGIDA". O papel-sorriso (escondido na composição) vira um elemento solto: nasce
   pequeno e esverdeado dentro da tela (cópia com `.v-tela-verde`), anda até a borda direita,
   bate, força e atravessa ganhando cor, metade para fora da TV, sacudindo. Olhos do Decalqzinho
   (`path[data-olho]`) acompanham. Recortes flutuam (senoides da própria linha do tempo).
2. **3,15–8,3 · Problema.** TV escurece (opacidade ~0,16); o recorte vai ao centro (escala ~2).
   Uma janela (moldura de card sem imagem, domínio "template-pronto.com") entra e enquadra:
   o recorte fica com `clip-path: inset(...)` do vão da janela. Tentativas em f02, f03, f04:
   a janela pula de posição, a barra troca de cor (lima → azul → amarelo) e o recorte troca de
   matiz, mas o formato é sempre o mesmo retângulo. No fim de f04: carimbo torto lima
   "APROVADO / POR NINGUÉM" (`.v-carimbo`) com tremor do palco.
3. **8,3–18,3 · Solução.** O recorte rasga a janela (duas metades com recorte serrilhado voam),
   volta inteiro e com a cor original; o papel claro abre a partir de um rasgo horizontal
   serrilhado com pixels lima/azul nas bordas (f05). Rótulos no topo no estilo dos títulos do
   site, um por verbo: "Abriu espaço" (f05), "Desenhou" (f06: esboço de site desenhado por
   `stroke-dashoffset` + adesivos coloridos aparecendo), "Escreveu código" (f07: janela escura
   com código digitado em fósforo), "Pra funcionar" (f08: coluna de 6 cards reais — reis-lazer,
   helios-solar-beige, the-one-bistro, vai-de-smash, nativa-arquitetura, prospectlife — a
   ~460 px de largura subindo devagar até 18 s, legível; selo "● no ar"). O recorte fica como
   adesivo no canto.
4. **18,3–27,2 · Quem somos.** Título "Dois envolvidos / identificados." (clone de
   `#dupla-titulo`, marcador amarelo). Os dois passes caem de cima girando (escala 0,5,
   mostrando o verso), pousam lado a lado; viram para a frente em f10 (Mateus) e f11
   (Guilherme). Depois de f12, o Decalqzinho (cópia grande do adesivo) entra, levanta e
   carimba "FOI ESSES DOIS." em azul-forte sobre os dois cards, com tremor.
5. **27,2–33,5 · Convite.** O breu volta subindo com borda serrilhada; uma segunda composição
   da TV (texto "Portfólio") reaparece; o adesivo do Decalqzinho descola do canto da TV
   (gira, cresce, sombra) e vai ao centro, ~3× (f13). Entram o lettering WEB DECALQ, o título
   escuro "Descola do igual." (f14) / "Cola na Decalq." (f15) e o botão lima
   "@webdecalq · Chama no direct" com ícone do Instagram. Segura até 33,5 s.

Efeitos sonoros sintetizados com ffmpeg (lavfi): TV ligando (~0,42 s), três batidas da
janela, carimbo (fim de f04 e ~25,8 s), rasgo (~8,2 s), whooshes (cards entrando/saindo),
baques dos passes, viradas, descolar o adesivo, pops dos rótulos e do botão. Sem música
(o Reels permite pôr música no app).

Saída: H.264 High, yuv420p, 30 fps, CRF 18, AAC 192 kbps 48 kHz, `-movflags +faststart`,
loudness ~ −14 LUFS → `saida/ideia-foragida-1080x1920.mp4`. Revisar com quadros de prévia
(folha de contato) antes do render final.
