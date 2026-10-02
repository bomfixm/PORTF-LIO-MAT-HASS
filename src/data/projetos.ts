/**
 * Catálogo único dos projetos. Todos os projetos moram aqui; a Home usa só
 * a seleção explícita de destaques (DESTAQUES, abaixo) — na órbita e na
 * grade —, e a página /projetos/ usa o catálogo inteiro. Cases, contadores
 * e filtros leem daqui; nenhum componente guarda dado de projeto.
 *
 * Fontes:
 * - 01–07: os cases do projeto anterior (`decalq-portfolio-novo`),
 *   importados em 01/10/2026, com as imagens de lá (cover → capa,
 *   screenshot-01 → secao, mobile → celular).
 * - 08–14: projetos do painel da Vercel informados em 02/10/2026,
 *   conferidos nos sites publicados (`<slug>.vercel.app`): nome, conteúdo e
 *   tecnologia lidos da própria página; screenshots tirados do site real
 *   (1440 × 936 e 430 × 820, a 2×, reduzidos para 1200 × 780 e 430 × 820).
 *
 * Imagens em `public/telas/<slug>/` (fora de `/projetos/`, que são rotas).
 *
 * Regras: nada inventado — sem cliente, depoimento, métrica ou resultado que
 * não esteja confirmado. Campos sem material ficam de fora (o ano, por
 * exemplo, só quando o site mostra). Propostas, conceitos e protótipos
 * levam `status`, exibido no card e no case.
 */

export type Categoria = "Sites" | "Sistemas";

/**
 * Situação de um trabalho que não é um site final publicado (sem `status`:
 * no ar). Classificado pelo que o próprio site mostra.
 */
export type Status = "proposta" | "conceito" | "em-desenvolvimento" | "prototipo";

export const ROTULO_STATUS: Record<Status, string> = {
  proposta: "Proposta",
  conceito: "Conceito",
  "em-desenvolvimento": "Em desenvolvimento",
  prototipo: "Protótipo",
};

export interface Imagem {
  src: string;
  alt: string;
  largura: number;
  altura: number;
  /** tipo de tela: muda a moldura e a proporção na galeria */
  formato: "desktop" | "celular";
}

export interface Etapa {
  titulo: string;
  descricao: string;
}

export interface Projeto {
  /** número do case, "01"…"14" — a ordem no catálogo */
  id: string;
  slug: string;
  nome: string;
  /** rótulo curto do segmento ("Energia solar") */
  rotulo: string;
  /** frase de abertura do case */
  chamada: string;
  descricaoCurta: string;
  descricao: string;
  categoria: Categoria;
  /** só quando o site mostra (© do rodapé) */
  ano?: number;
  /** proposta, conceito, em desenvolvimento ou protótipo; sem: no ar */
  status?: Status;
  /** o que a dupla entregou, só o que está confirmado */
  servicos: string[];
  tecnologias: string[];
  /** site publicado */
  url: string;
  /** como o trabalho foi resolvido */
  solucao: string;
  /** percurso que o site propõe ao visitante */
  percurso: Etapa[];
  /** recursos presentes no site publicado */
  recursos: string[];
  imagens: {
    capa: Imagem;
    secao: Imagem;
    celular: Imagem;
  };
  /** cor do adesivo/fita do projeto (grade e cena giratória) */
  cor: "lima" | "rosa" | "amarelo" | "azul-claro" | "lilas";
}

const telas = (slug: string, nome: string): Projeto["imagens"] => ({
  capa: {
    src: `/telas/${slug}/capa.webp`,
    alt: `${nome}: primeira tela do site no desktop`,
    largura: 1200,
    altura: 780,
    formato: "desktop",
  },
  secao: {
    src: `/telas/${slug}/secao.webp`,
    alt: `${nome}: seção interna do site no desktop`,
    largura: 1200,
    altura: 780,
    formato: "desktop",
  },
  celular: {
    src: `/telas/${slug}/celular.webp`,
    alt: `${nome}: primeira tela do site no celular`,
    largura: 430,
    altura: 820,
    formato: "celular",
  },
});

export const projetos: Projeto[] = [
  {
    id: "01",
    slug: "helios-solar-beige",
    nome: "Helios Energia Solar",
    rotulo: "Energia solar",
    chamada: "Energia solar, do simulador ao contato.",
    descricaoCurta: "Energia solar de alto padrão com simulador de projeto.",
    descricao:
      "Site da HELIOS, engenharia solar fotovoltaica para residências, comércios, indústrias e usinas no Rio Grande do Sul e em Santa Catarina: soluções por segmento, tecnologia, simulador de projeto, vitrine de projetos e contato com orçamento rápido.",
    categoria: "Sites",
    ano: 2026,
    servicos: ["Website"],
    tecnologias: ["Next.js", "React", "Tailwind"],
    url: "https://helios-solar-beige.vercel.app/",
    solucao:
      "Aplicação Next.js com intro cinematográfica, seções guiadas por scroll, simulador de projeto, vitrine de projetos e canais de contato sempre visíveis (WhatsApp e orçamento rápido).",
    percurso: [
      { titulo: "Entender", descricao: "Soluções apresentadas por segmento, do residencial às usinas." },
      { titulo: "Simular", descricao: "O visitante estima o próprio projeto antes de falar com alguém." },
      { titulo: "Contatar", descricao: "Orçamento rápido e WhatsApp a um clique em qualquer ponto da página." },
    ],
    recursos: [
      "Simulador de projeto solar",
      "Soluções por segmento (residencial, comercial, industrial, usinas)",
      "Indicadores técnicos em destaque",
      "Vitrine de projetos",
      "Orçamento rápido e WhatsApp",
      "Intro animada e revelações por scroll",
    ],
    imagens: telas("helios-solar-beige", "Helios Energia Solar"),
    cor: "lima",
  },
  {
    id: "02",
    slug: "reis-lazer",
    nome: "Reis Lazer & Cia",
    rotulo: "Churrasqueiras",
    chamada: "Churrasqueiras sob medida, agora online.",
    descricaoCurta: "Churrasqueiras sob medida em Itatiba, desde 2003.",
    descricao:
      "Site da Reis Lazer & Cia, loja de churrasqueiras em Itatiba (SP): churrasqueiras de tijolinho à vista, fornos caipiras, fogões a lenha, lareiras, coifas e projetos de espaço gourmet, com obras, galeria, avaliações, localização e orçamento pelo WhatsApp.",
    categoria: "Sites",
    ano: 2026,
    servicos: ["Website"],
    tecnologias: ["Next.js", "React", "Tailwind"],
    url: "https://reis-lazer.vercel.app/",
    solucao:
      "Next.js com identidade escura e dourada, tipografia serifada, seções de modelos, obras, galeria e avaliações, menu com âncoras numeradas e chamada de orçamento sempre visível.",
    percurso: [
      { titulo: "Inspirar", descricao: "Obras realizadas e galeria mostram o resultado final." },
      { titulo: "Escolher", descricao: "Churrasqueiras, fornos, fogões, lareiras e coifas por tipo." },
      { titulo: "Orçar", descricao: "Pedido de orçamento direto pelo WhatsApp." },
    ],
    recursos: [
      "Catálogo de churrasqueiras e modelos",
      "Galeria de obras realizadas",
      "Avaliações de clientes",
      "Localização do showroom",
      "Orçamento pelo WhatsApp",
      "Menu com âncoras numeradas",
    ],
    imagens: telas("reis-lazer", "Reis Lazer & Cia"),
    cor: "amarelo",
  },
  {
    id: "03",
    slug: "prospectlife",
    nome: "ProspectLife",
    rotulo: "Prospecção com IA",
    chamada: "Prospecção com IA, sem cadastro.",
    descricaoCurta: "Ferramenta gratuita de prospecção de clientes com IA.",
    descricao:
      "Aplicação web que encontra empresas sem site por cidade e nicho, entrega nome, WhatsApp e Instagram, audita sites fracos e organiza a conversa em um funil escrito pelo próprio usuário. Gratuita, sem cadastro, para o Brasil e mais de 60 países.",
    categoria: "Sistemas",
    ano: 2026,
    servicos: ["Sistema web", "IA"],
    tecnologias: ["Next.js", "React", "IA"],
    url: "https://prospectlife.vercel.app/",
    solucao:
      "Aplicação Next.js com busca por cidade e nicho (várias combinações de uma vez), contatos prontos, auditoria de sites, funil de vendas por etapas e exportação em CSV.",
    percurso: [
      { titulo: "Buscar", descricao: "País, cidades e nichos definem a lista de empresas." },
      { titulo: "Auditar", descricao: "Sites fracos ou inexistentes viram oportunidade de abordagem." },
      { titulo: "Conversar", descricao: "WhatsApp e Instagram prontos, com etapas de funil escritas pelo usuário." },
    ],
    recursos: [
      "Busca por cidade e nicho, em lote",
      "Contatos prontos: WhatsApp e Instagram",
      "Auditoria de sites",
      "Funil de vendas com etapas personalizadas",
      "Exportação em CSV",
      "Sem cadastro; Brasil e mais de 60 países",
    ],
    imagens: telas("prospectlife", "ProspectLife"),
    cor: "lilas",
  },
  {
    id: "04",
    slug: "nativa-arquitetura",
    nome: "Nativa Arquitetura & Paisagismo",
    rotulo: "Arquitetura",
    chamada: "Arquitetura que respira, em grande formato.",
    descricaoCurta: "Estúdio de arquitetura biofílica com portfólio editorial.",
    descricao:
      "Site do estúdio Nativa, de São Paulo: manifesto, projetos em destaque, filosofia, serviços, depoimentos e agendamento de reunião, com linguagem editorial e fotografias em grande escala.",
    categoria: "Sites",
    ano: 2026,
    servicos: ["Website"],
    tecnologias: ["Next.js", "React", "Framer Motion", "Lenis"],
    url: "https://nativa-arquitetura.vercel.app/",
    solucao:
      "Next.js com Framer Motion e scroll suave (Lenis): projeto em destaque logo na abertura, portfólio, manifesto, serviços, depoimentos e um convite claro para agendar reunião.",
    percurso: [
      { titulo: "Conhecer", descricao: "Manifesto e filosofia apresentam a forma de projetar do estúdio." },
      { titulo: "Explorar", descricao: "Projetos residenciais, comerciais e de paisagismo em grande formato." },
      { titulo: "Agendar", descricao: "Reunião marcada direto pelo site." },
    ],
    recursos: [
      "Projeto em destaque na abertura",
      "Portfólio de projetos",
      "Manifesto e filosofia do estúdio",
      "Seção de serviços",
      "Depoimentos",
      "Agendamento de reunião",
    ],
    imagens: telas("nativa-arquitetura", "Nativa Arquitetura & Paisagismo"),
    cor: "azul-claro",
  },
  {
    id: "05",
    slug: "vai-de-smash",
    nome: "Vai de Smash",
    rotulo: "Hamburgueria",
    chamada: "Do primeiro toque ao pedido, sem desvio.",
    descricaoCurta: "Hamburgueria artesanal com cardápio e pedido online.",
    descricao:
      "Site da Vai de Smash, hamburgueria artesanal em Louveira (SP): apresentação da marca, cardápio, história, localização, contato e botão de pedido sempre à mão.",
    categoria: "Sites",
    ano: 2026,
    servicos: ["Website"],
    tecnologias: ["React", "Vite", "Tailwind", "Framer Motion"],
    url: "https://vai-de-smash.vercel.app/",
    solucao:
      "Single-page em React com navegação por âncoras (Início, Cardápio, Sobre, Localização, Contato), identidade escura com vermelho e laranja, animações de entrada e layout pensado primeiro para o celular.",
    percurso: [
      { titulo: "Descobrir", descricao: "Marca e proposta na primeira dobra." },
      { titulo: "Escolher", descricao: "Cardápio organizado por seções." },
      { titulo: "Pedir", descricao: "Botão de pedido fixo no topo e no herói." },
    ],
    recursos: [
      "Cardápio online",
      "Botão de pedido fixo no topo",
      "Seção sobre a marca",
      "Localização e contato",
      "Layout pensado primeiro para o celular",
      "Animações de entrada",
    ],
    imagens: telas("vai-de-smash", "Vai de Smash"),
    cor: "rosa",
  },
  {
    id: "06",
    slug: "the-one-bistro",
    nome: "The One Bistrô",
    rotulo: "Cafeteria e bistrô",
    chamada: "Aberto, cardápio e rota, na primeira dobra.",
    descricaoCurta: "Cafeteria e bistrô em Jundiaí, com cardápio e avaliações.",
    descricao:
      "Site do The One Bistrô, cafeteria e bistrô no The One Office Tower, em Jundiaí (SP): destaques, cardápio, avaliações do Google, horários, formas de atendimento (no local, drive-thru e delivery) e contato.",
    categoria: "Sites",
    ano: 2026,
    servicos: ["Website"],
    tecnologias: ["React", "Vite", "Tailwind", "Framer Motion"],
    url: "https://the-one-bistro.vercel.app/",
    solucao:
      "Single-page em React com herói fotográfico, cartão de avaliações, cardápio, destaques, horários e rota, em identidade quente com dourado.",
    percurso: [
      { titulo: "Conferir", descricao: "Aberto ou fechado, horário e avaliações na abertura." },
      { titulo: "Escolher", descricao: "Destaques e cardápio completo." },
      { titulo: "Chegar", descricao: "Rota, drive-thru ou delivery." },
    ],
    recursos: [
      "Status de aberto/fechado em tempo real",
      "Avaliações do Google em destaque",
      "Cardápio e destaques",
      "Formas de atendimento: local, drive-thru e delivery",
      "Rota e contato",
      "Layout responsivo",
    ],
    imagens: telas("the-one-bistro", "The One Bistrô"),
    cor: "amarelo",
  },
  {
    id: "07",
    slug: "aps-engenharia",
    nome: "APS Engenharia e Construção",
    rotulo: "Engenharia",
    chamada: "Responsabilidade técnica à vista.",
    descricaoCurta: "Obras, reformas, projetos e laudos técnicos.",
    descricao:
      "Site da APS Engenharia e Construção, do Eng. Anderson Paiva: execução de obras e reformas, projetos e laudos técnicos, gerenciamento e acompanhamento de obras, com método, depoimentos e pedido de orçamento.",
    categoria: "Sites",
    ano: 2026,
    servicos: ["Website"],
    tecnologias: ["React", "Vite", "Tailwind", "Framer Motion"],
    url: "https://aps-engenharia.vercel.app/",
    solucao:
      "Single-page em React com tipografia serifada, seções de serviços, método, depoimentos e orçamento pelo WhatsApp fixo na tela.",
    percurso: [
      { titulo: "Apresentar", descricao: "Frentes de serviço e método de trabalho." },
      { titulo: "Comprovar", descricao: "Responsável técnico, obras e depoimentos." },
      { titulo: "Contatar", descricao: "Solicitação de orçamento e WhatsApp." },
    ],
    recursos: [
      "Frentes de serviço detalhadas",
      "Apresentação do engenheiro responsável",
      "Método de trabalho",
      "Obras e depoimentos",
      "Orçamento pelo WhatsApp",
      "Layout responsivo",
    ],
    imagens: telas("aps-engenharia", "APS Engenharia e Construção"),
    cor: "lima",
  },
  {
    id: "08",
    slug: "van-tio-robert",
    nome: "Van Escolar do Tio Robert",
    rotulo: "Transporte escolar",
    chamada: "Da porta de casa até a escola, com o WhatsApp à mão.",
    descricaoCurta: "Transporte escolar com consulta de vagas pelo WhatsApp.",
    descricao:
      "Site da Van Escolar do Tio Robert, transporte escolar: apresentação do motorista e do serviço, diferenciais (segurança, pontualidade, atendimento próximo e conforto) e consulta de vagas, rotas e horários pelo WhatsApp.",
    categoria: "Sites",
    ano: 2026,
    servicos: ["Website"],
    tecnologias: ["HTML", "CSS", "JavaScript"],
    url: "https://van-tio-robert.vercel.app/",
    solucao:
      "Página estática em HTML, CSS e JavaScript, com uma abertura guiada pela rolagem em que a van abre a porta antes do site (pulada com movimento reduzido), cabeçalho fixo e mensagens prontas para o WhatsApp.",
    percurso: [
      { titulo: "Conhecer", descricao: "O Tio Robert se apresenta e conta como cuida de cada aluno." },
      { titulo: "Confiar", descricao: "Segurança, pontualidade, atendimento próximo e conforto." },
      { titulo: "Consultar", descricao: "Vagas, rotas e horários pelo WhatsApp, com a mensagem pronta." },
    ],
    recursos: [
      "Abertura animada guiada pela rolagem",
      "Apresentação do motorista",
      "Diferenciais do serviço",
      "Consulta de vagas pelo WhatsApp",
      "Botão de WhatsApp fixo",
      "Layout responsivo",
    ],
    imagens: telas("van-tio-robert", "Van Escolar do Tio Robert"),
    cor: "amarelo",
  },
  {
    id: "09",
    slug: "portfolio-pamela",
    nome: "Pâmela Hanara",
    rotulo: "Psicologia e carreira",
    chamada: "Psicologia e carreira, num site pessoal.",
    descricaoCurta: "Site pessoal de psicóloga e consultora de carreira.",
    descricao:
      "Site pessoal de Pâmela Hanara, psicóloga (CRP 06/195036): apresentação, atendimento psicológico, consultoria de currículo e LinkedIn e palestras e treinamentos, com formulário de contato por serviço, WhatsApp e Instagram.",
    categoria: "Sites",
    servicos: ["Website"],
    tecnologias: ["Next.js", "React"],
    url: "https://portfolio-pamela.vercel.app/",
    solucao:
      "Página única em Next.js: apresentação com foto, os três serviços em cartões e um formulário de contato em que a pessoa escolhe o serviço.",
    percurso: [
      { titulo: "Conhecer", descricao: "Apresentação e foto da Pâmela." },
      { titulo: "Escolher", descricao: "Atendimento psicológico, consultoria de currículo e LinkedIn ou palestras." },
      { titulo: "Conversar", descricao: "Formulário com o serviço escolhido, WhatsApp e Instagram." },
    ],
    recursos: [
      "Apresentação pessoal",
      "Serviços em cartões",
      "Formulário de contato por serviço",
      "WhatsApp e Instagram",
      "Layout responsivo",
    ],
    imagens: telas("portfolio-pamela", "Pâmela Hanara"),
    cor: "lilas",
  },
  {
    id: "10",
    slug: "aninha-proposta",
    nome: "Aninha Costura Afetiva",
    rotulo: "Enxoval personalizado",
    chamada: "Enxoval bordado com o nome, peça por peça.",
    descricaoCurta: "Proposta de site para enxoval de bebê bordado à mão.",
    descricao:
      "Proposta de site para a Aninha Costura Afetiva, de Itupeva (SP): enxoval de uso diário do bebê, personalizado e bordado com o nome — fraldas, cueiros, mantas, organizadores, necessaires e kits maternidade —, com o processo de cada peça, vitrine e montagem de kit.",
    categoria: "Sites",
    ano: 2026,
    status: "proposta",
    servicos: ["Website"],
    tecnologias: ["HTML", "CSS", "JavaScript", "GSAP", "Lenis"],
    url: "https://aninha-proposta.vercel.app/",
    solucao:
      "Página estática com GSAP e ScrollTrigger nas revelações e Lenis na rolagem suave: vitrine filtrável por linha de produto, prévia do bordado e montagem do kit do bebê.",
    percurso: [
      { titulo: "Conhecer", descricao: "O ateliê e o bordado com o nome do bebê." },
      { titulo: "Escolher", descricao: "Peças por linha: fraldas, cueiros e mantas, organizadores, necessaires e kits." },
      { titulo: "Montar", descricao: "O kit montado no site, com atendimento pelo WhatsApp." },
    ],
    recursos: [
      "Vitrine com filtro por linha de produto",
      "Montagem de kit",
      "Prévia do bordado",
      "Processo de cada peça em quatro etapas",
      "Atendimento pelo WhatsApp",
      "Revelações e rolagem suave",
    ],
    imagens: telas("aninha-proposta", "Aninha Costura Afetiva"),
    cor: "rosa",
  },
  {
    id: "11",
    slug: "amora-pet-care",
    nome: "Amora Pet Care",
    rotulo: "Pet shop",
    chamada: "Banho, tosa e loja, com agendamento em passos.",
    descricaoCurta: "Conceito de site para pet shop com agendamento online.",
    descricao:
      "Conceito de site para a Amora Pet Care, pet shop de banho e tosa em Campinas (SP): serviços com preço de referência, agendamento em cinco passos, perfil do pet, planos mensais por porte, loja de produtos, perguntas frequentes e contato.",
    categoria: "Sites",
    ano: 2026,
    status: "conceito",
    servicos: ["Website"],
    tecnologias: ["Next.js", "React"],
    url: "https://amora-pet-care.vercel.app/",
    solucao:
      "Aplicação Next.js com agendamento em cinco passos (serviço, pet, data e horário, dados e confirmação) e total estimado, perfil do pet com alergias e histórico, planos por porte e mensagens prontas para o WhatsApp.",
    percurso: [
      { titulo: "Conhecer", descricao: "Banho, tosa e cuidados, com preço de referência." },
      { titulo: "Agendar", descricao: "Cinco passos até a confirmação, com o total estimado." },
      { titulo: "Voltar", descricao: "Perfil do pet, planos mensais e loja." },
    ],
    recursos: [
      "Agendamento em cinco passos",
      "Perfil do pet",
      "Planos mensais por porte",
      "Loja de produtos",
      "Perguntas frequentes",
      "Contato pelo WhatsApp com mensagem pronta",
    ],
    imagens: telas("amora-pet-care", "Amora Pet Care"),
    cor: "lima",
  },
  {
    id: "12",
    slug: "alba-enxovais",
    nome: "Alba Enxovais",
    rotulo: "Enxovais",
    chamada: "Enxovais em fibras naturais, em ritmo editorial.",
    descricaoCurta: "Conceito de loja de enxovais em fibras naturais.",
    descricao:
      "Conceito de site para a Alba, marca de enxovais de cama, mesa, banho, bebê e infantil em fibras naturais: coleções, ateliê, processo, lookbook, vitrine com compra rápida, serviço de enxoval completo e journal.",
    categoria: "Sites",
    ano: 2026,
    status: "conceito",
    servicos: ["Website"],
    tecnologias: ["HTML", "CSS", "JavaScript", "GSAP", "Lenis"],
    url: "https://alba-enxovais.vercel.app/",
    solucao:
      "Página estática com GSAP e ScrollTrigger e rolagem suave com Lenis: tipografia serifada, lookbook em carrossel, vitrine filtrável com compra rápida e um montador de enxoval por ocasião, cama, tecido, tom e monograma.",
    percurso: [
      { titulo: "Inspirar", descricao: "Coleção da estação e lookbook." },
      { titulo: "Escolher", descricao: "Vitrine por categoria, com compra rápida." },
      { titulo: "Montar", descricao: "Enxoval completo por ocasião, cama, tecido, tom e monograma." },
    ],
    recursos: [
      "Coleções por categoria",
      "Lookbook em carrossel",
      "Vitrine filtrável com compra rápida",
      "Montador de enxoval completo",
      "Processo do ateliê",
      "Journal",
    ],
    imagens: telas("alba-enxovais", "Alba Enxovais"),
    cor: "azul-claro",
  },
  {
    id: "13",
    slug: "os-batutinhas",
    nome: "Instituto Batutinhas",
    rotulo: "Projeto social",
    chamada: "Brincadeira, datas e apoiadores num lugar só.",
    descricaoCurta: "Site de projeto social para crianças, em desenvolvimento.",
    descricao:
      "Site do Instituto Batutinhas, projeto social de brincadeira e convivência para crianças de 3 a 12 anos: quem somos, calendário das próximas datas, apoiadores e contato. Os contatos do site ainda estão como exemplo.",
    categoria: "Sites",
    ano: 2026,
    status: "em-desenvolvimento",
    servicos: ["Website"],
    tecnologias: ["React", "Vite"],
    url: "https://os-batutinhas.vercel.app/",
    solucao:
      "Single-page em React com Vite: carrossel de abertura, números do projeto, calendário de datas, carrossel de apoiadores e chamada para novos apoiadores.",
    percurso: [
      { titulo: "Conhecer", descricao: "O propósito do instituto." },
      { titulo: "Acompanhar", descricao: "Próximas datas no calendário." },
      { titulo: "Apoiar", descricao: "Apoiadores e chamada para participar." },
    ],
    recursos: [
      "Carrossel de abertura",
      "Calendário de próximas datas",
      "Carrossel de apoiadores",
      "Chamada para novos apoiadores",
      "Contato e redes",
    ],
    imagens: telas("os-batutinhas", "Instituto Batutinhas"),
    cor: "amarelo",
  },
  {
    id: "14",
    slug: "florescer",
    nome: "Florescer",
    rotulo: "Monitoramento agrícola",
    chamada: "Safras, floração e polinizadores num painel.",
    descricaoCurta: "Protótipo de painel de monitoramento agrícola.",
    descricao:
      "Protótipo de sistema de monitoramento de safras e polinização: painel com safras em floração, floração média, área e alertas, cartões por cultura e recomendações, além de seções de mapa, polinizadores, saúde, solo e um assistente de IA.",
    categoria: "Sistemas",
    status: "prototipo",
    servicos: ["Sistema web"],
    tecnologias: ["Next.js", "v0"],
    url: "https://florescer.vercel.app/",
    solucao:
      "Aplicação Next.js criada com o v0: menu lateral (dashboard, mapa, safras, floração, polinizadores, saúde, alertas, solo e assistente de IA), indicadores por cultura e modo escuro.",
    percurso: [
      { titulo: "Ver", descricao: "Indicadores gerais e safras ativas no painel." },
      { titulo: "Detalhar", descricao: "Floração, produtividade e saúde por cultura." },
      { titulo: "Agir", descricao: "Recomendações de irrigação, aplicação e adubação." },
    ],
    recursos: [
      "Painel com indicadores gerais",
      "Cartões por cultura",
      "Recomendações de manejo",
      "Seções de mapa, polinizadores, saúde, alertas e solo",
      "Assistente de IA",
      "Modo escuro",
    ],
    imagens: telas("florescer", "Florescer"),
    cor: "lima",
  },
];

export const projetoPorSlug = (slug: string) => projetos.find((p) => p.slug === slug);

/**
 * Destaques da Home, na ordem da órbita e da grade inicial. Seleção
 * explícita: um projeto novo entra no catálogo sem mudar a Home.
 */
export const DESTAQUES = [
  "helios-solar-beige",
  "reis-lazer",
  "prospectlife",
  "nativa-arquitetura",
  "vai-de-smash",
  "the-one-bistro",
  "aps-engenharia",
] as const;

export const destaques: Projeto[] = DESTAQUES.map((slug) => {
  const p = projetoPorSlug(slug);
  if (!p) throw new Error(`destaque sem projeto no catálogo: ${slug}`);
  return p;
});

export const eDestaque = (slug: string) => (DESTAQUES as readonly string[]).includes(slug);

/** Categorias que existem de fato numa lista, na ordem em que aparecem. */
export const categoriasDe = (lista: Projeto[]): Categoria[] => [...new Set(lista.map((p) => p.categoria))];

/** Categorias do catálogo inteiro. */
export const categorias: Categoria[] = categoriasDe(projetos);

/** Endereço do case (com barra final, como o export estático gera). */
export const rotaDoCase = (slug: string) => `/projetos/${slug}/`;

/** Domínio exibido na barra da moldura ("reis-lazer.vercel.app"). */
export const dominio = (url: string) => new URL(url).host;

/** Vizinhos na ordem do catálogo (o último volta ao primeiro). */
export function vizinhos(slug: string) {
  const i = projetos.findIndex((p) => p.slug === slug);
  const n = projetos.length;
  return {
    anterior: projetos[(i - 1 + n) % n],
    proximo: projetos[(i + 1) % n],
  };
}
