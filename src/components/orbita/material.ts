import * as THREE from "three";

/**
 * Material das telas da órbita. Um ShaderMaterial pequeno, compartilhado
 * por tela, bisel e sombra colorida (com uniforms próprios em cada malha):
 *
 * - curvatura no vértice: o plano dobra num arco de raio 1/uCurva, com as
 *   bordas vindo para a frente (côncavo para quem olha). uCurva = 0 é plano
 *   — é assim que a capa pousa no card;
 * - opacidade (uOpacidade): a tela entra e sai inteira, nítida, sem blocos
 *   nem pixelização — o screenshot é sempre o arquivo, só mais ou menos
 *   transparente. A ordem de desenho que mantém o fade limpo está em
 *   montagem.ts;
 * - luz: telas de lado e mais longe escurecem um pouco (profundidade).
 *
 * As cores saem como estão: textura sem conversão de espaço de cor e sem
 * tone mapping, igual ao screenshot no card.
 */
const vertice = /* glsl */ `
uniform float uCurva;
uniform vec2 uDesloca;
uniform float uRecuo;
varying vec2 vUv;
varying vec3 vPosV;
varying vec3 vNormalV;

void main() {
  vec3 p = position;
  p.xy += uDesloca;
  vec3 n = vec3(0.0, 0.0, 1.0);
  if (abs(uCurva) > 1e-5) {
    float a = p.x * uCurva;
    float r = 1.0 / uCurva;
    p.x = sin(a) * r;
    p.z += (1.0 - cos(a)) * r;
    n = vec3(-sin(a), 0.0, cos(a));
  }
  p -= n * uRecuo;
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vPosV = mv.xyz;
  vNormalV = normalize(normalMatrix * n);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmento = /* glsl */ `
uniform sampler2D uMapa;
uniform float uTemMapa;
uniform vec3 uCor;
uniform float uOpacidade;
uniform float uSombra;
varying vec2 vUv;
varying vec3 vPosV;
varying vec3 vNormalV;

void main() {
  vec3 c = uTemMapa > 0.5 ? texture2D(uMapa, vUv).rgb : uCor;

  float frente = clamp(dot(normalize(vNormalV), normalize(-vPosV)), 0.0, 1.0);
  c *= mix(1.0 - uSombra, 1.0, frente);
  c *= 1.0 - 0.42 * uSombra * smoothstep(13.0, 27.0, -vPosV.z);
  gl_FragColor = vec4(c, uOpacidade);
}
`;

export interface UniformsTela {
  [nome: string]: THREE.IUniform;
  uMapa: THREE.IUniform<THREE.Texture | null>;
  uTemMapa: THREE.IUniform<number>;
  uCor: THREE.IUniform<THREE.Color>;
  uCurva: THREE.IUniform<number>;
  uDesloca: THREE.IUniform<THREE.Vector2>;
  uRecuo: THREE.IUniform<number>;
  uOpacidade: THREE.IUniform<number>;
  uSombra: THREE.IUniform<number>;
}

/** Cor em sRGB, sem conversão (a saída também não converte). */
const corCrua = (hex: string) => {
  const c = new THREE.Color();
  c.setRGB(
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
    THREE.LinearSRGBColorSpace,
  );
  return c;
};

export function criarMaterialTela(opcoes: {
  cor?: string;
  deslocamento?: [number, number];
  recuo?: number;
  sombra?: number;
}) {
  const uniforms: UniformsTela = {
    uMapa: { value: null },
    uTemMapa: { value: 0 },
    uCor: { value: corCrua(opcoes.cor ?? "#0d0f0c") },
    uCurva: { value: 0 },
    uDesloca: { value: new THREE.Vector2(...(opcoes.deslocamento ?? [0, 0])) },
    uRecuo: { value: opcoes.recuo ?? 0 },
    uOpacidade: { value: 0 },
    uSombra: { value: opcoes.sombra ?? 0.5 },
  };
  // sempre transparente, com profundidade: a ordem de desenho (montagem.ts)
  // faz a tela inteira ficar translúcida por igual, sem ver as camadas
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vertice,
    fragmentShader: fragmento,
    side: THREE.FrontSide,
    transparent: true,
  });
  return { material, uniforms };
}

/** Cores da identidade (tokens.css), para as sombras duras das telas. */
export const CORES: Record<string, string> = {
  lima: "#bcfa46",
  rosa: "#fa80a5",
  amarelo: "#f6c537",
  "azul-claro": "#5697f8",
  lilas: "#c983dc",
  tinta: "#0d0f0c",
};
