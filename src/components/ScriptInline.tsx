"use client";

/**
 * Script inline que roda durante a leitura do HTML, antes da primeira
 * pintura. No cliente vira `text/plain` (não reexecuta e o React não avisa
 * sobre <script> renderizado) — padrão do guia "Preventing flash before
 * hydration" da documentação do Next 16.
 */
export function ScriptInline({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
