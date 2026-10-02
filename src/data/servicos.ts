/**
 * "O que a gente cria": as seis frentes confirmadas (direção visual,
 * 01/10/2026). Texto curto, a partir das descrições-base aprovadas — sem
 * prazo, preço, cliente ou resultado que não tenha sido informado.
 *
 * `assunto` entra na mensagem pronta do WhatsApp ("quero conversar sobre…").
 */
export type IconeServico = "site" | "backend" | "ia" | "social" | "automacao" | "dados";

export interface Servico {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  assunto: string;
  icone: IconeServico;
  cor: "lima" | "rosa" | "amarelo" | "azul-claro" | "lilas";
}

export const servicos: Servico[] = [
  {
    id: "websites",
    numero: "01",
    titulo: "Websites & Landing Pages",
    descricao: "Sites responsivos e páginas pra apresentar ideias, negócios e produtos — bem no celular e no monitor.",
    assunto: "um site ou uma landing page",
    icone: "site",
    cor: "lima",
  },
  {
    id: "sistemas",
    numero: "02",
    titulo: "Sistemas / Back-End",
    descricao: "APIs, integrações e a lógica por trás que faz o sistema funcionar.",
    assunto: "um sistema ou back-end",
    icone: "backend",
    cor: "azul-claro",
  },
  {
    id: "ia",
    numero: "03",
    titulo: "IA",
    descricao: "Assistentes e integrações com inteligência artificial no seu projeto.",
    assunto: "um assistente ou integração com IA",
    icone: "ia",
    cor: "lilas",
  },
  {
    id: "social-media",
    numero: "04",
    titulo: "Social Media",
    descricao: "Design pras redes sociais e edição de vídeo.",
    assunto: "design para redes sociais e edição de vídeo",
    icone: "social",
    cor: "rosa",
  },
  {
    id: "automacao",
    numero: "05",
    titulo: "Automação",
    descricao: "Rotinas e integrações que tiram do caminho as tarefas repetitivas.",
    assunto: "automação de tarefas",
    icone: "automacao",
    cor: "amarelo",
  },
  {
    id: "dados",
    numero: "06",
    titulo: "Dados / Dashboards",
    descricao: "Dados organizados e visíveis em painéis fáceis de ler.",
    assunto: "dados e dashboards",
    icone: "dados",
    cor: "lima",
  },
];

/** Mensagem pronta do WhatsApp para um serviço. */
export const mensagemServico = (s: Servico) =>
  `Oi, WEB DECALQ! Vi o portfólio e quero conversar sobre ${s.assunto}.`;
