"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import type * as THREE from "three";
import type { EstadoOrbita } from "./estado";
import { composicaoPara } from "./layout";
import { criarTexturas, montarCena, type Texturas } from "./montagem";

/**
 * Camada 3D da órbita (carregada só perto da seção, ver Orbita.tsx).
 *
 * `frameloop="demand"`: nada renderiza sozinho. Um quadro só é pedido
 * quando o progresso muda (Orbita chama `invalidar`) ou quando uma textura
 * chega (e durante os 280 ms do fade dela) — parado ou fora de vista, a GPU
 * fica livre. Resolução limitada
 * (até 1,75× no desktop, 1,5× no celular).
 */
export default function Cena({
  estado,
  registrar,
}: {
  estado: EstadoOrbita;
  /** entrega ao controlador a função que pede um quadro */
  registrar: (invalidar: (() => void) | null) => void;
}) {
  const celular = typeof window !== "undefined" && window.innerWidth < 760;
  return (
    <Canvas
      frameloop="demand"
      flat
      dpr={[1, celular ? 1.5 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 44, near: 0.1, far: 90, position: [0, 1.8, 12.5] }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Telas estado={estado} registrar={registrar} />
    </Canvas>
  );
}

function Telas({
  estado,
  registrar,
}: {
  estado: EstadoOrbita;
  registrar: (invalidar: (() => void) | null) => void;
}) {
  const { gl, size, invalidate } = useThree();
  const comp = composicaoPara(size.width);

  // texturas: uma por imagem, reaproveitadas ao trocar desktop ↔ celular
  const texturas: Texturas = useMemo(
    () => criarTexturas(gl.capabilities.getMaxAnisotropy(), () => invalidate()),
    [gl, invalidate],
  );
  useEffect(() => () => texturas.descartar(), [texturas]);

  const cena = useMemo(() => montarCena(comp, texturas), [comp, texturas]);
  useEffect(() => {
    invalidate();
    return () => cena.descartar();
  }, [cena, invalidate]);

  useEffect(() => {
    registrar(invalidate);
    return () => registrar(null);
  }, [registrar, invalidate]);

  useFrame(({ camera }) => {
    // true = uma imagem acabou de chegar e está entrando: mais um quadro
    if (cena.atualizar(estado, camera as THREE.PerspectiveCamera, gl.domElement)) invalidate();
  });

  return <primitive object={cena.grupo} />;
}
