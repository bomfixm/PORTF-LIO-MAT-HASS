import { contato } from "@/config/site";

/**
 * A dupla, só com o que foi confirmado: nome, funções, "Software
 * Engineering Student @ FIAP" e o WhatsApp de cada um (o QR do verso).
 * Os cards seguem a referência CREATIVE STUDIO PASS (01/10/2026); os campos
 * dela que não temos (nascimento, nacionalidade, e-mail, apelido) viraram
 * dados reais — nome, funções, estúdio, @webdecalq, FIAP. As frases curtas
 * ("code. edit. design.") saem das funções; nada de biografia inventada.
 *
 * WhatsApp: Mateus usa o número do site (config/site.ts); Guilherme, o
 * número que ele passou em 01/10/2026.
 *
 * Fotos: retratos reais enviados pela dupla em 01/10/2026 (Mateus em HEIC,
 * convertido; Guilherme em JPEG), recortados em 4:5 (800 × 1000, WebP) em
 * `public/dupla/<id>.webp`. Sem `foto`, o card mostra o recorte provisório
 * com as iniciais.
 */
export interface Pessoa {
  id: "mateus" | "guilherme";
  numero: string;
  primeiroNome: string;
  nomeCompleto: string;
  iniciais: string;
  funcoes: string[];
  estudo: string;
  /** frase empilhada ao lado do título, saída das funções */
  bordao: string[];
  /** frase entre parênteses no topo do verso */
  versoFrase: string;
  /** linha de habilidades no pé do verso (das funções) */
  habilidades: string[];
  whatsapp: { url: string; exibido: string };
  foto: { src: string; alt: string } | null;
  /** variações para os dois cards não parecerem cópia um do outro */
  tema: "manteiga" | "menta";
  adesivo: string;
}

const ESTUDO = "Software Engineering Student @ FIAP";

export const dupla: Pessoa[] = [
  {
    id: "mateus",
    numero: "01",
    primeiroNome: "Mateus",
    nomeCompleto: "Mateus Bomfim Nascimento",
    iniciais: "MN",
    funcoes: ["Developer", "Video Editor", "Designer"],
    estudo: ESTUDO,
    bordao: ["code.", "edit.", "design."],
    versoFrase: "turning IDEAS INTO CODE, CUTS & VISUALS",
    habilidades: ["development", "video editing", "design"],
    whatsapp: { url: contato.whatsapp, exibido: contato.whatsappExibido },
    foto: { src: "/dupla/mateus.webp", alt: "Foto de Mateus Bomfim Nascimento" },
    tema: "manteiga",
    adesivo: "frame by frame",
  },
  {
    id: "guilherme",
    numero: "02",
    primeiroNome: "Guilherme",
    nomeCompleto: "Guilherme Hass Ferreira",
    iniciais: "GF",
    funcoes: ["Developer", "Designer"],
    estudo: ESTUDO,
    bordao: ["think.", "code.", "design."],
    versoFrase: "turning IDEAS INTO CODE & VISUALS",
    habilidades: ["development", "design"],
    whatsapp: { url: "https://wa.me/5511976538835", exibido: "(11) 97653-8835" },
    foto: { src: "/dupla/guilherme.webp", alt: "Foto de Guilherme Hass Ferreira" },
    tema: "menta",
    adesivo: "pixel pusher",
  },
];
