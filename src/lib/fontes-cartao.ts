import { Archivo, Yellowtail } from "next/font/google";

/**
 * Fontes só dos cards da dupla (CREATIVE STUDIO PASS): sem pré-carga, para
 * não disputar com a abertura — o arquivo só é baixado quando o texto
 * dos cards aparece.
 *
 * - Archivo, condensada (eixo wdth) e itálica: "CREATIVE / STUDIO PASS" e
 *   os valores dos campos, como na referência;
 * - Yellowtail: o nome cursivo ao fundo e a assinatura.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
  preload: false,
});

export const cursiva = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cursiva",
  display: "swap",
  preload: false,
});
