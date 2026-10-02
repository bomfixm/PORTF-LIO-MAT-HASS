import type { Categoria } from "@/data/projetos";

/**
 * Contexto das grades de projetos durante a sessão. São duas, cada uma com
 * o seu estado: a da Home (destaques) e a do catálogo completo (/projetos/).
 * Quem abre um case grava de qual grade saiu; "Voltar" volta para ela,
 * marca `voltando`, e a grade, ao montar, restaura a busca e o filtro e
 * devolve o foco ao card daquele case.
 */
export type Lugar = "home" | "catalogo";

export interface EstadoGrade {
  busca: string;
  categoria: Categoria | null;
  /** slug do último case aberto */
  origem: string | null;
  /** veio de "Voltar": restaurar e focar o card */
  voltando: boolean;
}

const CHAVES: Record<Lugar, string> = { home: "decalq:grade", catalogo: "decalq:catalogo" };
/** de qual grade saiu o case aberto (vale também ao seguir para o próximo) */
const CHAVE_ORIGEM = "decalq:case-origem";
const VAZIO: EstadoGrade = { busca: "", categoria: null, origem: null, voltando: false };

export function lerEstadoGrade(lugar: Lugar): EstadoGrade {
  try {
    const bruto = sessionStorage.getItem(CHAVES[lugar]);
    return bruto ? { ...VAZIO, ...(JSON.parse(bruto) as Partial<EstadoGrade>) } : VAZIO;
  } catch {
    return VAZIO;
  }
}

export function salvarEstadoGrade(lugar: Lugar, parcial: Partial<EstadoGrade>) {
  try {
    sessionStorage.setItem(CHAVES[lugar], JSON.stringify({ ...lerEstadoGrade(lugar), ...parcial }));
  } catch {
    /* sem sessionStorage: a volta cai no topo da grade, sem filtro */
  }
}

/** Abriu um case a partir de uma grade. */
export function marcarOrigemDoCase(lugar: Lugar, slug: string) {
  salvarEstadoGrade(lugar, { origem: slug });
  try {
    sessionStorage.setItem(CHAVE_ORIGEM, lugar);
  } catch {
    /* sem sessionStorage: a volta segue o padrão do projeto */
  }
}

/**
 * Para onde "Voltar" leva, num case. A grade de onde a pessoa veio — a não
 * ser que seja a da Home e o projeto não esteja nela; sem registro (acesso
 * direto), a Home para destaques e o catálogo para os demais.
 */
export function lugarDeVolta(destaque: boolean): Lugar {
  let origem: string | null = null;
  try {
    origem = sessionStorage.getItem(CHAVE_ORIGEM);
  } catch {
    /* sem sessionStorage */
  }
  if (origem === "catalogo") return "catalogo";
  if (origem === "home" && destaque) return "home";
  return destaque ? "home" : "catalogo";
}
