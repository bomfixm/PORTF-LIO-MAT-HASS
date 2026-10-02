# Web Decalq — direção visual registrada

Decisões aprovadas por Mateus em 1 de outubro de 2026.

## Identidade e distribuição dos fundos

Portfólio criativo e pessoal de Mateus e Guilherme, com estética de monitor retrô, pixels, recortes, adesivos e textura.

- Fundo escuro na intro e na abertura da Home. Esta é a versão preferida para a tela inicial.
- Papel claro na grade dos projetos, na seção de serviços e nos cards da dupla.
- Fundo escuro no contato, retomando o clima da entrada.
- Paleta, texturas, adesivos e tipografia compartilhados entre as áreas claras e escuras.
- Passagem suave do fundo escuro para o claro quando os projetos se organizarem na grade.

A abertura tem um monitor CRT como elemento central, a palavra PORTFÓLIO em verde pixelado e colagem colorida ao redor. Usar o arquivo original do Decalqzinho na implementação.

Manter o estilo de lettering expressivo de WEB DECALQ e os dois botões da referência escura. Retirar a frase “Feito por Mateus & Guilherme.” abaixo da TV e ajustar o espaço até os botões.

## Estrutura da Home

Abertura; projetos que se movimentam em órbita conforme o scroll e depois se organizam em uma grade; seção “O que a gente cria”; apresentação da dupla; contato.

A seção de serviços fica logo abaixo dos projetos.

A estrutura escolhida é uma Home completa com páginas individuais dos projetos. A profundidade de cada case varia conforme o material real disponível.

## Intro — proposta de movimento

A ideia de a TV ligar e mostrar o Decalqzinho antes de revelar os outros elementos foi escolhida pelo usuário. A coreografia abaixo é a proposta para execução; a duração final será ajustada no navegador.

1. A cena começa escura, com o monitor visível e sua tela apagada.
2. A tela ganha um brilho verde suave. O Decalqzinho aparece centralizado em pixels verdes e dá uma piscada.
3. O Decalqzinho se desloca da tela até a moldura, assumindo sua versão azul como adesivo. A palavra PORTFÓLIO aparece dentro da tela em verde pixelado.
4. Recortes, adesivos, menu e botões surgem em uma sequência curta, formando a composição final do hero.

O mesmo monitor permanece do início ao fim da sequência. A intro termina no próprio hero.

Duração sugerida: aproximadamente dois segundos, a ajustar conforme a leitura e o carregamento. Incluir controle de pular e apresentar diretamente o estado final para movimento reduzido. Texto, botões e elementos da cena serão camadas reais do site, com animação por programação.

## Movimento após a intro

Atualização solicitada pelo usuário após acompanhar a etapa 2: o movimento anterior ficou imperceptível e as falhas ocorreram poucas vezes. As calibrações abaixo substituem a proposta anterior.

- Os recortes devem se movimentar automaticamente, mesmo com a página e o cursor parados. Cada objeto terá trajetória, velocidade, amplitude, inclinação e fase próprias, sem oscilação uniforme de todo o conjunto.
- Calibração inicial ajustável no desktop: deslocamento vertical de 12 a 28 pixels, horizontal de 6 a 16 pixels, rotação de 3 a 8 graus e ciclos de 4 a 9 segundos. Variar esses valores por objeto e adaptar ao celular, mantendo o movimento perceptível.
- Manter a composição equilibrada, com movimentos contínuos e sem saltos. Moldura, menu e botões permanecem estáveis.
- Pelo menos quatro falhas visuais diferentes no interior da tela: tremor/ruído leve; faixas deslocadas com imagem duplicada; perda de sincronismo vertical; travamento visual mais pesado com distorção e recuperação.
- Calibração inicial ajustável: pausas irregulares de 2,5 a 6 segundos entre falhas; duração de 120 a 220 ms para a leve, 250 a 450 ms para a moderada, 350 a 600 ms para a forte e 600 a 900 ms para a pesada.
- Garantir que os quatro tipos apareçam nos primeiros 40 segundos de execução ativa e evitar falhas pesadas consecutivas. Usar distorção e ruído com brilho controlado, recuperando a imagem normal ao final.
- O travamento é visual e fica restrito à tela. Navegação, controles e o restante do site continuam respondendo. Pausar falhas com a TV desligada e durante a intro ou mudanças de energia.
- Respeitar o controle Movimento, a preferência de movimento reduzido e a visibilidade da cena/aba.

## Controles físicos da televisão

- Botão de energia: apagar a tela com contração até um ponto, desligar o LED e, ao ligar, reproduzir uma sequência curta com brilho verde e Decalqzinho. Manter menu e ações disponíveis.
- Botão de brilho: alternar três intensidades legíveis somente na tela, preservando a intensidade escolhida após falhas ou religamento.
- Outro botão: rever a sequência da TV e do personagem por ação explícita, inclusive após a intro automática já ter ocorrido na sessão.
- Usar as posições dos controles na moldura com acesso por toque e teclado e rótulos claros.
- Bloquear imediatamente energia e repetição da intro durante ligar/desligar/reprodução, com indicação de indisponibilidade. Ignorar cliques repetidos de mouse, toque e teclado; não enfileirar comandos.
- Liberar os controles ao concluir ou cancelar a transição, recuperando um estado estável em caso de interrupção. Pular intro permanece disponível.

## Conteúdo do hero

- Título: PORTFÓLIO
- Marca: WEB DECALQ
- Ação principal: Explorar projetos
- Ação secundária: Trocar uma ideia

## Produção em etapas

1. Novo projeto separado, base técnica e abertura estática responsiva, seguindo a imagem escura. Preparar camadas independentes e retirar a frase abaixo da TV.
2. Intro da TV ligando, Decalqzinho verde pixelado piscando, entrada dos elementos, movimento visível e independente dos recortes, quatro tipos de falha e controles físicos funcionais com bloqueio durante transições.
3. Dados dos sete projetos existentes, grade e páginas individuais dos cases, com profundidade conforme o material disponível.
4. Cena orbital guiada pelo scroll: giro, saída dos painéis, reaparição em grade, reversão ao subir e passagem do fundo escuro para papel claro.
5. Serviços, apresentação da dupla em dois cards de credencial criativa e contato, com a mesma identidade visual.
6. Acabamento das interações, responsividade, verificação final e publicação quando solicitada.

Executar uma etapa por vez. O primeiro prompt de implementação deve executar apenas a etapa 1 e registrar as seguintes como planejadas.

## Continuação — etapa 3 no projeto novo

O usuário autorizou avançar para os projetos após a revisão dos efeitos da televisão. A gravação compartilhada mostrou movimento dos recortes e distorção da tela; não mostrou a intro nem interações com os controles, que não foram verificadas aqui.

- Continuar no projeto novo existente, decalq-portfolio-criativo. O projeto anterior, decalq-portfolio-novo, pode servir como fonte de dados e assets, sem receber alterações.
- Criar a seção #projetos na Home, com fundo de papel claro e identidade criativa conectada à abertura.
- Usar um catálogo único dos projetos reais para a grade, as páginas dos cases e a futura cena orbital.
- Mostrar screenshots em destaque, títulos legíveis e links para cases. Usar duas colunas no desktop e uma no celular, ajustando à largura disponível.
- Criar páginas individuais com descrição e imagens reais, serviços confirmados e link do site quando disponível. A profundidade depende do material existente.
- Disponibilizar busca, estado vazio e filtros apenas para categorias presentes nos dados reais. Galerias permitem ampliar as imagens com controles acessíveis.
- Explorar projetos e o menu Projetos levam à seção da Home. Os cases têm Voltar ao portfólio, retornando aos projetos sem repetir a intro automática.
- Preparar a grade para receber, na etapa 4, a transição da cena orbital, evitando catálogos duplicados.
- Verificar navegação, acesso direto aos cases, imagens e responsividade; entregar capturas e relato curto dos checks realizados.

## Continuação — etapa 4: órbita e passagem para a grade

O usuário autorizou avançar para a cena giratória. Continuar no projeto novo existente, decalq-portfolio-criativo, usando o catálogo e a grade da etapa 3. A implementação dessa etapa não foi executada nem verificada neste ambiente.

- A Home terá uma única seção de projetos: cena orbital, saída das telas e organização na grade existente. O giro acompanha o scroll vertical e se reverte ao subir.
- As referências originais mostram telas curvas em órbitas com diferentes alturas, profundidades e inclinações. Adaptar a geometria à identidade Web Decalq, com screenshots reais dos projetos.
- Direção inicial de densidade: aproximadamente 14 a 18 painéis visuais no desktop, representando os mesmos projetos únicos. Usar várias imagens reais de cada case quando disponíveis; eventuais instâncias decorativas repetidas não criam projetos novos nem duplicam itens na grade.
- Mostrar vários painéis completos e legíveis à frente ao longo do giro, evitando telas gigantes cortadas ou uma cena esvaziada.
- Coreografia inicial ajustável: entrada e giro em fundo escuro; recuo e desaparecimento breve dos painéis; reaparição organizada na grade, com passagem para papel claro e liberação do fluxo normal da página. A região de rolagem pode começar com cerca de 3 a 4 alturas de viewport no desktop.
- Escolha técnica proposta: Three.js/React Three Fiber para a geometria curva e GSAP ScrollTrigger para uma timeline guiada pelo scroll. Verificar compatibilidade com React instalado, carregar a cena no cliente e preservar o build estático.
- Manter uma única fonte de progresso para câmera, telas, fundo e passagem para o DOM. Reutilizar o mecanismo de scroll do projeto, sem renderizações React por quadro nem controladores concorrentes.
- A grade final permanece HTML acessível e clicável, com busca, filtros, galerias e rotas reais. A camada 3D não deve interceptar seus controles ao final.
- Projetos e Explorar projetos levam ao início da sequência. Ir direto aos projetos e Voltar ao portfólio levam à grade final, sem exigir repetir o percurso.
- No celular, simplificar densidade e duração preservando a ideia de órbita. Com Movimento desligado, movimento reduzido, falha de WebGL ou carregamento, exibir diretamente a grade sem espaços vazios artificiais.
- Verificar ida e volta, rolagem rápida, redimensionamento, entrada por âncora, retorno dos cases e acesso por teclado. Demonstrar a sequência real em vídeo, inclusive a reversão.

## Continuação — etapa 5: serviços, dupla e contato

O usuário autorizou preparar a etapa 5 no projeto novo existente, decalq-portfolio-criativo. Este registro é o briefing de implementação; as seções não foram implementadas nem verificadas aqui.

- Ordem das novas seções: O que a gente cria, A dupla, Contato e rodapé. Os serviços ficam após a grade organizada dos projetos.
- Serviços e dupla usam fundo de papel claro, tipografia expressiva, recortes e adesivos conectados à abertura. O contato retorna ao fundo escuro.
- Apresentar as seis categorias confirmadas: Websites/Landing Pages, Sistemas/Back-End, IA, Social Media (design e edição de vídeo), Automação e Dados/Dashboards. Usar descrições curtas e claras.
- Dar destaque igual a Mateus e Guilherme em dois cards de credencial, seguindo a referência azul PORTFOLIO ID CARD e detalhes de CREATIVE STUDIO PASS.
- Frente dos cards: área da foto, nome completo, funções confirmadas e Software Engineering Student @ FIAP. Verso: apresentação curta baseada nos mesmos dados e habilidades confirmadas.
- Fotos ainda não foram fornecidas. Usar temporariamente um recorte gráfico com iniciais, preparado para substituição, sem inventar retratos ou biografias.
- Virar card funciona por botão, toque e teclado, com estado independente para cada pessoa. A face oculta não recebe foco nem interação. Bloquear repetição durante a virada e liberar ao concluir ou cancelar.
- Inclinação discreta apenas no desktop, quando movimento estiver ativo. Com movimento reduzido ou controle Movimento desligado, trocar diretamente as faces.
- Contato com chamada informal, WhatsApp real e Instagram @webdecalq. Reutilizar a configuração atual de contatos e tratar corretamente eventuais mensagens pré-preenchidas por serviço.
- Menu O que a gente cria leva a #servicos; A dupla a #a-dupla; Contato a #contato. Nos cases, usar os destinos correspondentes na Home. Os CTAs diretos de WhatsApp continuam com esse destino.
- Rodapé simples, com marca, links reais e retorno ao topo. Manter um único acesso Contato no cabeçalho.
- Reutilizar o mecanismo de rolagem e atualizar as medidas da cena orbital ao integrar as novas seções, sem bloquear o acesso por âncoras.
- Verificar responsividade, virada dos cards, cliques repetidos, teclado, movimento reduzido, menu mobile e URLs de contato. Entregar capturas, uma gravação curta dos cards e relatório proporcional à etapa.

## Cards da dupla

O usuário escolheu apresentar Mateus e Guilherme em cards inspirados em credenciais criativas, conforme as três novas referências anexadas. Implementar na etapa 5.

- Um card por pessoa, com o mesmo destaque. Lado a lado no desktop e empilhados no celular.
- Direção proposta: usar a referência azul de PORTFOLIO ID CARD como base e a referência CREATIVE STUDIO PASS para recortes, carimbos e adesivos. Adaptar às cores, ao lettering e aos elementos da Web Decalq.
- Frente: foto em destaque, nome, funções e Software Engineering Student @ FIAP. Verso: apresentação curta aprovada e habilidades, com colagem e Decalqzinho.
- Proposta de interação: leve inclinação no desktop e botão explícito de virar, também utilizável no celular e por teclado. Com movimento reduzido, troca direta das faces.
- Fotos serão fornecidas pelo usuário. Até lá, reservar espaço identificado para cada foto; usar apenas dados pessoais e textos confirmados.
- Fundo de papel claro, mantendo os vínculos visuais com o hero escuro.

Para o primeiro prompt, enviar a imagem escura da abertura e a marca original como referências principais. A imagem clara e as referências dos cards podem acompanhar como contexto das etapas futuras; reapresentar os cards no prompt específico da etapa 5.

## Conteúdo definido para as próximas etapas

- Mateus Bomfim Nascimento: Developer · Video Editor · Designer.
- Guilherme Hass Ferreira: Developer · Designer.
- Ambos: Software Engineering Student @ FIAP. Fotos serão enviadas depois.
- Serviços: websites/landing pages, sistemas/back-end, IA, social media (design e edição de vídeo), automação e dados/dashboards.
- WhatsApp: (19) 99481-3740. Destino: https://wa.me/5519994813740
- Instagram: @webdecalq. Destino: https://www.instagram.com/webdecalq/

Este registro documenta as escolhas e a proposta. Não representa uma implementação já concluída.
