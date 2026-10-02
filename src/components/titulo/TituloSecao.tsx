import s from "./TituloSecao.module.css";

/**
 * Título grande das seções, com a assinatura do PROJETOS: pixel esticado
 * como o PORTFÓLIO da TV, sombra de impressão azul desencontrada e faixa de
 * marca-texto. `tom` escolhe a tinta (papel claro ou breu); `marcador`, a
 * cor da faixa.
 *
 * `fluxo` decide como os trechos de `linhas` se arrumam:
 * - "blocos" (padrão): cada trecho é uma linha, sempre;
 * - "linha": os trechos ficam lado a lado e só quebram entre si quando
 *   falta largura — numa tela larga o título inteiro cabe numa linha; no
 *   celular quebra sem cortar palavra nem faixa.
 */
export function TituloSecao({
  id,
  linhas,
  tom = "papel",
  marcador = "lima",
  tamanho = "grande",
  fluxo = "blocos",
  className,
}: {
  id: string;
  linhas: string[];
  tom?: "papel" | "escuro";
  marcador?: "lima" | "rosa" | "amarelo" | "azul-claro" | "lilas";
  tamanho?: "grande" | "medio" | "compacto" | "faixa";
  fluxo?: "blocos" | "linha";
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={`${s.titulo} ${className ?? ""}`}
      data-tom={tom}
      data-marcador={marcador}
      data-tamanho={tamanho}
      data-fluxo={fluxo}
      tabIndex={-1}
    >
      {linhas.map((l, i) => (
        <span key={i} className={s.linha}>
          {/* espaço entre trechos: no modo "linha" é onde a quebra acontece */}
          {fluxo === "linha" && i > 0 && " "}
          <span className={s.texto}>{l}</span>
        </span>
      ))}
    </h2>
  );
}
