import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Jersey_10 } from "next/font/google";
import { site } from "@/config/site";
import { SCRIPT_MOVIMENTO } from "@/lib/movimento-inicial";
import { ScriptInline } from "@/components/ScriptInline";
import "./globals.css";

/* Mono de serifa (menu, botões, legendas), como na referência. */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

/* Letras pixeladas do PORTFÓLIO; a grade de LEDs é desenhada por cima
   (TelaPortfolio.module.css). Tem Ó com acento. */
const pixel = Jersey_10({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.titulo} | ${site.marca}`,
  description: site.descricao,
  applicationName: site.marca,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.marca,
    title: `${site.titulo} | ${site.marca}`,
    description: site.descricao,
  },
};

export const viewport: Viewport = {
  themeColor: "#09100c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      // o Next desliga a rolagem suave durante a troca de rota; âncoras na
      // mesma página seguem suaves (styles/movimento.css)
      data-scroll-behavior="smooth"
      className={`${mono.variable} ${pixel.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Antes da primeira pintura: modo de movimento e intro em <html>
            (ver src/lib/movimento-inicial.ts). */}
        <ScriptInline html={SCRIPT_MOVIMENTO} />
        <a href="#conteudo" className="pular-link">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
