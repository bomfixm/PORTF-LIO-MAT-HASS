import * as THREE from "three";
import { CHEGADA, faixa, fimDoGiro, misturar, suave, suaveCubica, type EstadoOrbita } from "./estado";
import type { Composicao, PainelDef } from "./layout";
import { CORES, criarMaterialTela, type UniformsTela } from "./material";

/**
 * A cena da órbita em Three.js puro: monta as malhas uma vez e, a cada
 * quadro pedido, calcula a pose de tudo a partir de `estado.p`. Nenhum
 * estado próprio além do que o progresso define — por isso subir a página
 * reverte a sequência exatamente. (A única exceção é a chegada de uma
 * imagem: a tela entra num fade curto, por tempo, em vez de aparecer de
 * repente.)
 *
 * As telas são sempre o screenshot inteiro e nítido: entram, saem e voltam
 * só por opacidade. Para o fade ficar limpo, a ordem de desenho é fixa:
 * telas de trás para a frente (renderOrder do grupo, recalculado a cada
 * quadro) e, dentro de cada uma, imagem → bisel → sombra. Como o bisel e a
 * sombra estão um pouco atrás da imagem e tudo grava profundidade, eles só
 * aparecem em volta dela — nada de camadas vistas umas através das outras.
 */

const BISEL = 0.16;
const SOMBRA_DESLOCA = 0.26;
const SEGMENTOS = 40;
/** distância do plano onde as capas pousam (na frente de tudo) */
const PLANO_POUSO = 7;
/** fade de uma tela quando a imagem dela chega (ms) */
const CHEGADA_MS = 280;
/** abaixo disso a malha nem é desenhada (não grava profundidade à toa) */
const INVISIVEL = 0.002;

interface Tela {
  def: PainelDef;
  grupo: THREE.Group;
  tela: UniformsTela;
  moldura: UniformsTela[];
  /** imagem, bisel, sombra — nessa ordem de desenho */
  malhas: THREE.Mesh[];
  materiais: THREE.ShaderMaterial[];
  altura: number;
}

export interface CenaOrbita {
  grupo: THREE.Group;
  /** devolve true enquanto precisa de mais quadros (fade de imagem chegando) */
  atualizar(estado: EstadoOrbita, camera: THREE.PerspectiveCamera, alvoCanvas: HTMLCanvasElement): boolean;
  descartar(): void;
}

/** Texturas por endereço, compartilhadas entre telas e composições. */
export function criarTexturas(maxAnisotropia: number, aoCarregar: () => void) {
  const loader = new THREE.TextureLoader();
  const cache = new Map<string, THREE.Texture>();
  const chegada = new Map<string, number>();
  return {
    obter(src: string) {
      let t = cache.get(src);
      if (!t) {
        t = loader.load(src, () => {
          chegada.set(src, performance.now());
          aoCarregar();
        });
        // cores exatamente como no arquivo (o shader não converte)
        t.colorSpace = THREE.NoColorSpace;
        t.anisotropy = Math.min(8, maxAnisotropia);
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.generateMipmaps = true;
        cache.set(src, t);
      }
      return t;
    },
    /** ms desde que a imagem chegou, ou -1 se ainda não chegou */
    desde(src: string) {
      const t = chegada.get(src);
      return t === undefined ? -1 : performance.now() - t;
    },
    descartar() {
      cache.forEach((t) => t.dispose());
      cache.clear();
      chegada.clear();
    },
  };
}
export type Texturas = ReturnType<typeof criarTexturas>;

export function montarCena(comp: Composicao, texturas: Texturas): CenaOrbita {
  const grupo = new THREE.Group();
  const geometrias = new Map<string, THREE.PlaneGeometry>();
  const geometria = (l: number, a: number) => {
    const chave = `${l.toFixed(3)}x${a.toFixed(3)}`;
    let g = geometrias.get(chave);
    if (!g) {
      g = new THREE.PlaneGeometry(l, a, SEGMENTOS, 1);
      geometrias.set(chave, g);
    }
    return g;
  };

  /* ——— telas: sombra colorida, bisel de tinta e o screenshot ——— */
  const telas: Tela[] = comp.paineis.map((def) => {
    const aspecto = def.imagem.largura / def.imagem.altura;
    const altura = def.largura / aspecto;
    const g = new THREE.Group();
    g.rotation.order = "YXZ";

    const sombra = criarMaterialTela({
      cor: CORES[def.projeto.cor],
      deslocamento: [SOMBRA_DESLOCA, -SOMBRA_DESLOCA],
      recuo: 0.05,
      sombra: 0.55,
    });
    const bisel = criarMaterialTela({ cor: CORES.tinta, recuo: 0.025, sombra: 0.3 });
    const tela = criarMaterialTela({ sombra: 0.5 });
    tela.uniforms.uMapa.value = texturas.obter(def.imagem.src);

    const gm = geometria(def.largura + BISEL * 2, altura + BISEL * 2);
    const malhas = [
      new THREE.Mesh(geometria(def.largura, altura), tela.material),
      new THREE.Mesh(gm, bisel.material),
      new THREE.Mesh(gm, sombra.material),
    ];
    malhas.forEach((m, ordem) => {
      m.renderOrder = ordem;
      g.add(m);
    });
    grupo.add(g);
    return {
      def,
      grupo: g,
      tela: tela.uniforms,
      moldura: [bisel.uniforms, sombra.uniforms],
      malhas,
      materiais: [tela.material, bisel.material, sombra.material],
      altura,
    };
  });

  // órbitas e pixels depois de todas as telas: testam a profundidade delas
  // (somem atrás de uma tela, aparecem na frente)
  const decoracao = new THREE.Group();
  decoracao.renderOrder = 1000;
  grupo.add(decoracao);

  /* ——— órbitas tracejadas em lima (anéis inclinados) ——— */
  const linhas = comp.aneis.map((anel) => {
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 160; k++) {
      const a = (k / 160) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          anel.raio * Math.sin(a),
          anel.altura + anel.inclina * Math.sin(a + anel.faseOnda),
          -anel.raio * Math.cos(a),
        ),
      );
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineDashedMaterial({
      color: "#bcfa46",
      dashSize: 0.32,
      gapSize: 0.42,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const linha = new THREE.Line(geo, mat);
    linha.computeLineDistances();
    decoracao.add(linha);
    return { linha, mat, anel };
  });

  /* ——— pixels soltos girando junto (lima, azul, rosa, creme) ——— */
  const POR_ANEL = comp.nome === "celular" ? 22 : 40;
  const totalPixels = POR_ANEL * comp.aneis.length;
  const posicoes = new Float32Array(totalPixels * 3);
  const cores = new Float32Array(totalPixels * 3);
  const base: { anel: number; a: number; dr: number; dy: number }[] = [];
  const paleta = ["#bcfa46", "#bcfa46", "#5697f8", "#fa80a5", "#ede8de"].map((h) => new THREE.Color(h));
  let semente = 7;
  const rnd = () => {
    semente = (semente * 16807) % 2147483647;
    return semente / 2147483647;
  };
  for (let i = 0; i < totalPixels; i++) {
    const anel = Math.floor(i / POR_ANEL);
    base.push({ anel, a: rnd() * Math.PI * 2, dr: (rnd() - 0.5) * 2.4, dy: (rnd() - 0.5) * 2.6 });
    paleta[Math.floor(rnd() * paleta.length)].toArray(cores, i * 3);
  }
  const geoPixels = new THREE.BufferGeometry();
  geoPixels.setAttribute("position", new THREE.BufferAttribute(posicoes, 3));
  geoPixels.setAttribute("color", new THREE.BufferAttribute(cores, 3));
  const matPixels = new THREE.PointsMaterial({
    size: comp.nome === "celular" ? 4 : 5,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const pixels = new THREE.Points(geoPixels, matPixels);
  pixels.frustumCulled = false;
  decoracao.add(pixels);

  /* ——— cálculo por quadro ——— */
  const v = new THREE.Vector3();
  const frente = new THREE.Vector3();
  const direita = new THREE.Vector3();
  const cima = new THREE.Vector3();
  const quatOrbita = new THREE.Quaternion();
  const posOrbita = new THREE.Vector3();
  const olhar = new THREE.Vector3();
  const TAU = Math.PI * 2;

  /** voltas do anel do meio: menos com movimento reduzido no sistema */
  const voltas = () => (document.documentElement.dataset.suave === "sim" ? 0.9 : comp.voltas);

  function poseNaOrbita(t: Tela, giro: number, afasta: number, camY: number) {
    const anel = comp.aneis[t.def.anel];
    const a = t.def.angulo + anel.velocidade * voltas() * TAU * giro;
    const raio = anel.raio * (1 + 0.7 * afasta);
    const y = (anel.altura + anel.inclina * Math.sin(a + anel.faseOnda)) * (1 + 0.35 * afasta);
    posOrbita.set(raio * Math.sin(a), y, -raio * Math.cos(a));
    // vira para o eixo; inclina na direção da câmera; rola um pouco
    const inclX = Math.atan2(y - camY, raio) * 0.75;
    t.grupo.rotation.set(inclX, -a, anel.rolagem * Math.cos(a * 2 + anel.faseOnda));
    quatOrbita.setFromEuler(t.grupo.rotation);
    return raio * comp.curva;
  }

  function atualizar(estado: EstadoOrbita, camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    const { p, entrada: E, folha: F } = estado;
    const cam = comp.camera;

    // câmera: chega de longe durante a entrada e para
    const ent = suave(faixa(p, 0, E));
    if (camera.fov !== cam.fov) {
      camera.fov = cam.fov;
      camera.updateProjectionMatrix();
    }
    camera.position.set(0, misturar(cam.y0, cam.y, ent), misturar(cam.z0, cam.z, ent));
    olhar.set(0, cam.olharY, cam.olharZ);
    camera.lookAt(olhar);
    camera.updateMatrixWorld();

    const giro = faixa(p, 0, fimDoGiro(estado));
    const afasta = suave(faixa(p, F - 0.17, F + 0.02));
    // o voo começa um pouco antes da folha aparecer: sem tela vazia
    const VOO = F - 0.03;
    const voo = suaveCubica(faixa(p, VOO, 0.962));
    const r = canvas.getBoundingClientRect();

    // eixos da câmera, para pousar as capas na tela
    camera.getWorldDirection(frente);
    direita.set(1, 0, 0).applyQuaternion(camera.quaternion);
    cima.set(0, 1, 0).applyQuaternion(camera.quaternion);
    const hMundo = 2 * PLANO_POUSO * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const wMundo = hMundo * camera.aspect;

    let continuar = false;
    for (const t of telas) {
      const curvaOrbita = 1 / poseNaOrbita(t, giro, afasta, camera.position.y);
      const d = t.def;

      // entrada: cada tela aparece inteira, no seu tempo
      const ini = d.atraso * E * 0.5;
      let opacidade = suave(faixa(p, ini, ini + E * 0.3));

      // saída: afastam e somem (as capas por último)
      const saiIni = d.voa ? F - 0.09 : F - 0.15 + d.atraso * 0.05;
      opacidade *= 1 - suave(faixa(p, saiIni, saiIni + (d.voa ? 0.055 : 0.08)));

      let curva = curvaOrbita;
      let escala = 1;
      let moldura = 1;
      t.grupo.position.copy(posOrbita);
      t.grupo.quaternion.copy(quatOrbita);
      t.grupo.visible = true;

      if (d.voa && p > VOO) {
        // a capa reaparece e voa até a imagem do card do mesmo projeto
        const img = document.querySelector<HTMLImageElement>(
          `[data-grade] [data-projeto="${d.projeto.slug}"] [data-painel] img`,
        );
        const ri = img?.getBoundingClientRect();
        if (ri && ri.width > 0 && r.width > 0) {
          const cx = ((ri.left + ri.width / 2 - r.left) / r.width) * 2 - 1;
          const cy = -(((ri.top + ri.height / 2 - r.top) / r.height) * 2 - 1);
          v.copy(camera.position)
            .addScaledVector(frente, PLANO_POUSO)
            .addScaledVector(direita, (cx * wMundo) / 2)
            .addScaledVector(cima, (cy * hMundo) / 2);
          t.grupo.position.lerpVectors(posOrbita, v, voo);
          t.grupo.quaternion.slerpQuaternions(quatOrbita, camera.quaternion, voo);
          escala = misturar(1, ((ri.width / r.width) * wMundo) / d.largura, voo);
          curva = misturar(curvaOrbita, 0, voo);
          // somem só por um instante e voltam, já a caminho
          opacidade = suave(faixa(p, VOO, VOO + 0.06));
          // o card já tem moldura e sombra: as da tela somem no caminho
          moldura = 1 - suave(faixa(voo, 0.35, 0.8));
        } else {
          opacidade = 0; // card filtrado ou fora da grade: a capa não volta
        }
        if (p >= CHEGADA[1] + 0.005) t.grupo.visible = false;
      }

      // sem imagem ainda, a tela não aparece (nada de quadro vazio); quando
      // a imagem chega, entra num fade curto
      const chegou = texturas.desde(d.imagem.src);
      if (chegou < 0) opacidade = 0;
      else if (chegou < CHEGADA_MS) {
        opacidade *= chegou / CHEGADA_MS;
        continuar = true;
      }

      t.grupo.scale.setScalar(escala);
      t.grupo.visible &&= opacidade > INVISIVEL;
      t.tela.uOpacidade.value = opacidade;
      t.tela.uCurva.value = curva;
      t.tela.uTemMapa.value = chegou < 0 ? 0 : 1;
      t.tela.uSombra.value = d.voa && p > VOO ? 0.5 * (1 - voo) : 0.5;
      t.moldura.forEach((m, i) => {
        m.uOpacidade.value = opacidade * moldura;
        m.uCurva.value = curva;
        t.malhas[i + 1].visible = opacidade * moldura > INVISIVEL;
      });
    }

    // telas de trás para a frente: um fade nunca apaga a tela de trás
    const visiveis = telas.filter((t) => t.grupo.visible);
    visiveis.sort(
      (a, b) => b.grupo.position.distanceToSquared(camera.position) - a.grupo.position.distanceToSquared(camera.position),
    );
    visiveis.forEach((t, i) => (t.grupo.renderOrder = i + 1));

    // linhas somem com as telas; os pixels ficam até a folha chegar
    const chega = suave(faixa(p, E * 0.15, E * 0.9));
    const presenca = chega * (1 - faixa(p, F - 0.13, F - 0.04));
    const presencaPixels = chega * (1 - faixa(p, F - 0.03, F + 0.06));
    for (const l of linhas) {
      l.mat.opacity = 0.3 * presenca;
      l.linha.visible = presenca > 0.01;
      l.linha.scale.set(1 + 0.7 * afasta, 1 + 0.35 * afasta, 1 + 0.7 * afasta);
    }
    matPixels.opacity = 0.85 * presencaPixels;
    pixels.visible = presencaPixels > 0.01;
    if (pixels.visible) {
      for (let i = 0; i < base.length; i++) {
        const b = base[i];
        const anel = comp.aneis[b.anel];
        const a = b.a + anel.velocidade * voltas() * TAU * giro * 1.25;
        const raio = (anel.raio + b.dr) * (1 + 0.7 * afasta);
        posicoes[i * 3] = raio * Math.sin(a);
        posicoes[i * 3 + 1] = anel.altura + anel.inclina * Math.sin(a + anel.faseOnda) + b.dy;
        posicoes[i * 3 + 2] = -raio * Math.cos(a);
      }
      geoPixels.attributes.position.needsUpdate = true;
    }
    return continuar;
  }

  return {
    grupo,
    atualizar,
    descartar() {
      telas.forEach((t) => t.materiais.forEach((m) => m.dispose()));
      geometrias.forEach((g) => g.dispose());
      linhas.forEach((l) => {
        l.linha.geometry.dispose();
        l.mat.dispose();
      });
      geoPixels.dispose();
      matPixels.dispose();
    },
  };
}

