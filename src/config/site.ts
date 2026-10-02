/**
 * Identidade, navegação e contatos: o único lugar onde moram links e textos
 * fixos da marca. Nenhum componente escreve número ou URL por conta própria.
 */
export const site = {
  marca: "WEB DECALQ",
  titulo: "Portfólio",
  descricao:
    "Portfólio criativo da WEB DECALQ, de Mateus e Guilherme: sites, sistemas, IA, social media, automação e dados.",
} as const;

export const contato = {
  whatsapp: "https://wa.me/5519994813740",
  whatsappExibido: "(19) 99481-3740",
  instagram: "https://www.instagram.com/webdecalq/",
  instagramExibido: "@webdecalq",
} as const;

/**
 * WhatsApp com mensagem pronta. O texto vai codificado (acentos, "&", "/"
 * e espaços), então qualquer frase de serviço chega inteira na conversa.
 */
export const whatsappCom = (mensagem: string) =>
  `${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;

/** Mensagem pronta do contato geral (seção Contato). */
export const mensagemContato = "Oi, WEB DECALQ! Vim pelo portfólio e quero trocar uma ideia.";

/**
 * Seções da Home. Cada uma vira `pronta: true` na etapa que a cria; até lá,
 * os acessos a ela aparecem sem link e marcados "em breve" — nada de âncora
 * para um id inexistente nem de link que só pula para o topo.
 */
export const secoes = {
  projetos: { id: "projetos", pronta: true, etapa: 3 },
  servicos: { id: "servicos", pronta: true, etapa: 5 },
  dupla: { id: "a-dupla", pronta: true, etapa: 5 },
  contato: { id: "contato", pronta: true, etapa: 5 },
} satisfies Record<string, { id: string; pronta: boolean; etapa: number }>;

export type Secao = keyof typeof secoes;

/**
 * Âncora da seção, ou null enquanto ela não existe. Sempre a partir da Home
 * ("/#projetos"): funciona igual na Home (rolagem na mesma página) e nas
 * páginas de case (volta à Home já na seção).
 */
export function ancora(secao: Secao): string | null {
  const s: { id: string; pronta: boolean } = secoes[secao];
  return s.pronta ? `/#${s.id}` : null;
}

/**
 * A grade de projetos, depois da órbita. "Voltar ao portfólio" vem para cá:
 * direto aos cards, sem refazer a sequência.
 */
export const ancoraDaGrade = "/#projetos-grade";

/**
 * Catálogo completo: todos os projetos (a Home mostra só os destaques).
 * Mesma pasta dos cases, sem colisão: /projetos/ é a lista, e
 * /projetos/<slug>/ é cada case.
 */
export const rotaDoCatalogo = "/projetos/";

export interface ItemNav {
  rotulo: string;
  /** leva a uma seção da Home (ativa quando a seção existir) */
  secao?: Secao;
  /** ou a um destino fixo */
  href?: string;
  /** abre fora do site (WhatsApp) */
  externo?: boolean;
}

/**
 * Menu do cabeçalho (e do rodapé), na ordem das seções da Home: projetos,
 * dupla, serviços, contato. Um único "Contato", que leva à seção de
 * contato; os botões que abrem o WhatsApp direto continuam nele.
 */
export const navegacao: ItemNav[] = [
  { rotulo: "Projetos", secao: "projetos" },
  { rotulo: "A dupla", secao: "dupla" },
  { rotulo: "O que a gente cria", secao: "servicos" },
  { rotulo: "Contato", secao: "contato" },
];

export const destinoDoItem = (item: ItemNav) =>
  item.secao ? ancora(item.secao) : (item.href ?? null);
