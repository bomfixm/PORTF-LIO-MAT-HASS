"use client";
import { useEffect, useState } from "react";
import { ancoraDaGrade, rotaDoCatalogo } from "@/config/site";
import { lugarDeVolta, salvarEstadoGrade, type Lugar } from "@/lib/grade-estado";
import { Botao, IconeVolta } from "@/components/botao/Botao";

const DESTINO: Record<Lugar, { href: string; rotulo: string }> = {
  home: { href: ancoraDaGrade, rotulo: "Voltar ao portfólio" },
  catalogo: { href: rotaDoCatalogo, rotulo: "Voltar a todos os projetos" },
};

/**
 * "Voltar": para a grade de onde a pessoa abriu o case — a da Home
 * (/#projetos-grade, depois da órbita) ou a do catálogo (/projetos/) —, pelo
 * Next, sem recarregar (a intro não toca de novo). Avisa a grade para
 * restaurar a busca e o filtro e devolver o foco ao card deste case.
 *
 * Sem registro (acesso direto), destaques voltam à Home e os demais ao
 * catálogo; é o que o HTML estático já traz, e a sessão só corrige depois.
 */
export function Voltar({
  slug,
  destaque,
  variante = "contorno",
  tom = "escuro",
}: {
  slug: string;
  destaque: boolean;
  variante?: "principal" | "contorno";
  tom?: "escuro" | "papel";
}) {
  const [lugar, setLugar] = useState<Lugar>(destaque ? "home" : "catalogo");
  useEffect(() => {
    // sessionStorage não existe no build estático: só depois de montar
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLugar(lugarDeVolta(destaque));
  }, [destaque]);

  const { href, rotulo } = DESTINO[lugar];
  return (
    <Botao
      href={href}
      interno
      variante={variante}
      tom={tom}
      iconeAntes={<IconeVolta />}
      onClick={() => salvarEstadoGrade(lugar, { origem: slug, voltando: true })}
    >
      {rotulo}
    </Botao>
  );
}
