"use client";
import { Component, useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { destaques } from "@/data/projetos";
import { ouvirMovimento, useMovimento } from "@/lib/movimento";
import { CHEGADA, EVENTO_SALTO, avisarSalto, criarEstado, faixa, opacidadeTitulo, type EstadoOrbita } from "./estado";
import s from "./Orbita.module.css";

/**
 * Órbita dos projetos: o começo da seção #projetos. Um trilho alto com um
 * palco preso (sticky) onde as telas giram; a folha de papel com a grade
 * (SecaoProjetos) sobe sobre o palco no fim e as capas pousam nos cards.
 *
 * Fonte única de progresso: um ScrollTrigger com scrub (GSAP) escreve
 * `estado.p`; daqui saem as variáveis CSS do palco (--p, --chegada,
 * --titulo), o
 * atributo data-fase da seção e o pedido de quadro da cena 3D. Nenhum
 * setState por quadro.
 *
 * Só existe com movimento completo. Calmo, sem JavaScript, sem WebGL ou se
 * o 3D não carregar: o CSS (styles/orbita.css) esconde o trilho e a grade
 * aparece direto, sem espaço reservado; a rolagem é recolocada para a
 * pessoa continuar vendo o mesmo trecho.
 */
type PropsCena = {
  estado: EstadoOrbita;
  registrar: (invalidar: (() => void) | null) => void;
};

class Protecao extends Component<{ aoFalhar: () => void; children: ReactNode }, { erro: boolean }> {
  state = { erro: false };
  static getDerivedStateFromError() {
    return { erro: true };
  }
  componentDidCatch() {
    this.props.aoFalhar();
  }
  render() {
    return this.state.erro ? null : this.props.children;
  }
}

/**
 * Chama `fazer` quando a página estiver ociosa (ou após `reserva` ms, sem
 * requestIdleCallback). Devolve a função que cancela — só o que agendou:
 * ids de idle e de setTimeout são sequências separadas, e um clearTimeout
 * com id de idle cancelaria o temporizador de outro componente.
 */
function quandoOcioso(fazer: () => void, limite: number, reserva: number) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fazer, { timeout: limite });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fazer, reserva);
  return () => window.clearTimeout(id);
}

/**
 * Chama `fazer` só depois da abertura: com a intro da TV pronta (tocou,
 * foi pulada, ou não toca) e a página ociosa. Nada pesado disputa a intro.
 * Devolve a função que cancela.
 */
function depoisDaAbertura(fazer: () => void) {
  const raiz = document.documentElement;
  let cancelar = () => {};
  let cancelado = false;
  const agendar = () => {
    if (cancelado) return;
    cancelar = quandoOcioso(fazer, 1200, 300);
  };
  const vigia = new MutationObserver(() => {
    if (raiz.dataset.intro === "pronta") {
      vigia.disconnect();
      agendar();
    }
  });
  if (raiz.dataset.intro === "pronta") agendar();
  else vigia.observe(raiz, { attributes: true, attributeFilter: ["data-intro"] });
  return () => {
    cancelado = true;
    vigia.disconnect();
    cancelar();
  };
}

function temWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const topoNoDocumento = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

function pecas(trilho: HTMLElement | null) {
  const secao = trilho?.closest<HTMLElement>("[data-secao]");
  const folha = secao?.querySelector<HTMLElement>("[data-folha]");
  return trilho && secao && folha ? { trilho, secao, folha } : null;
}

interface Leitura {
  y: number;
  secao: number;
  folha: number;
  trilhoVisivel: boolean;
  /** progresso bruto, a mesma conta do ScrollTrigger */
  progresso: number;
  ancora: HTMLElement | null;
  ancoraTopo: number;
}

function ler(trilho: HTMLElement, secao: HTMLElement, folha: HTMLElement): Leitura {
  const t = trilho.getBoundingClientRect();
  const vh = window.innerHeight;
  // âncora de leitura: o primeiro card da grade ou seção seguinte (dupla,
  // serviços, contato, rodapé) que aparece na janela
  let ancora: HTMLElement | null = null;
  for (const card of document.querySelectorAll<HTMLElement>(
    "#projetos-grade [data-projeto], main > section:not([data-secao]), body > footer",
  )) {
    const r = card.getBoundingClientRect();
    if (r.bottom > 0 && r.top < vh) {
      ancora = card;
      break;
    }
  }
  return {
    y: window.scrollY,
    secao: topoNoDocumento(secao),
    folha: topoNoDocumento(folha),
    trilhoVisivel: t.height > 0,
    progresso: t.height > 0 ? Math.min(1, Math.max(0, (vh - t.top) / t.height)) : 0,
    ancora,
    ancoraTopo: ancora ? ancora.getBoundingClientRect().top : 0,
  };
}

export function Orbita() {
  const movimento = useMovimento();
  const trilho = useRef<HTMLDivElement>(null);
  const [estado] = useState(criarEstado);
  const invalidar = useRef<(() => void) | null>(null);
  const [Cena, setCena] = useState<ComponentType<PropsCena> | null>(null);
  const [falhou, setFalhou] = useState(false);
  const ativa = movimento === "completo" && !falhou;

  const registrar = useCallback((f: (() => void) | null) => {
    invalidar.current = f;
    f?.();
  }, []);

  /* ——— posição de leitura: o que a pessoa vê não pode pular ———
     A cada rolagem guarda o que está na tela: o card visível mais acima (ou
     a folha) e o progresso bruto da órbita. Quando o trilho aparece, some ou
     muda de altura (Movimento, preferência do sistema, falha do 3D, troca
     de largura), a rolagem é recolocada: na grade, o mesmo card fica no
     mesmo ponto da janela; no meio da órbita, o mesmo ponto da sequência —
     ou, se a órbita saiu, o começo da grade. As correções são relativas ao
     que está na tela, então não somam com a ancoragem do navegador. */
  const ultimo = useRef<Leitura | null>(null);
  const reposicionar = useCallback(() => {
    const partes = pecas(trilho.current);
    const antes = ultimo.current;
    if (!partes || !antes) return;
    const { secao, folha } = partes;
    if (antes.y >= antes.folha - 2) {
      const alvo = antes.ancora?.isConnected ? antes.ancora : folha;
      const era = antes.ancora?.isConnected ? antes.ancoraTopo : antes.folha - antes.y;
      const delta = alvo.getBoundingClientRect().top - era;
      if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "instant" });
    } else if (antes.y > antes.secao + 2 && antes.trilhoVisivel) {
      const t = partes.trilho.getBoundingClientRect();
      const destino =
        t.height > 0
          ? t.top + window.scrollY - window.innerHeight + antes.progresso * t.height
          : topoNoDocumento(folha);
      if (Math.abs(destino - window.scrollY) > 1) window.scrollTo({ top: destino, behavior: "instant" });
    }
    ultimo.current = ler(partes.trilho, secao, folha);
  }, []);

  useEffect(() => {
    const partes = pecas(trilho.current);
    if (!partes) return;
    const medir = () => {
      ultimo.current = ler(partes.trilho, partes.secao, partes.folha);
    };
    medir();
    // largura mudou = layout novo; a barra de endereço do celular (só
    // altura) não conta, para não brigar com a rolagem por toque
    let largura = window.innerWidth;
    const aoRedimensionar = () => {
      if (window.innerWidth === largura) return;
      largura = window.innerWidth;
      reposicionar();
    };
    window.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", aoRedimensionar);
    // o atributo de <html> já mudou quando o aviso chega: compara com a
    // última leitura, feita antes da troca
    const parar = ouvirMovimento(reposicionar);
    return () => {
      window.removeEventListener("scroll", medir);
      window.removeEventListener("resize", aoRedimensionar);
      parar();
    };
  }, [reposicionar]);

  const falhar = useCallback(() => {
    const secao = trilho.current?.closest<HTMLElement>("[data-secao]");
    if (secao) secao.dataset.orbita = "falhou";
    reposicionar();
    setFalhou(true);
  }, [reposicionar]);

  /* ——— progresso: ScrollTrigger com scrub, uma fonte só ——— */
  useEffect(() => {
    const el = trilho.current;
    const secao = el?.closest<HTMLElement>("[data-secao]");
    const palco = el?.querySelector<HTMLElement>("[data-palco]");
    if (!ativa || !el || !secao || !palco) return;

    let vivo = true;
    let desfazer = () => {};

    const aplicar = () => {
      const p = estado.p;
      secao.style.setProperty("--p", p.toFixed(4));
      secao.style.setProperty("--chegada", faixa(p, CHEGADA[0], CHEGADA[1]).toFixed(3));
      secao.style.setProperty("--titulo", opacidadeTitulo(estado).toFixed(3));
      const fase = p <= 0.0005 ? "antes" : p >= 0.9995 ? "fim" : p >= estado.folha ? "grade" : "orbita";
      if (secao.dataset.fase !== fase) secao.dataset.fase = fase;
      invalidar.current?.();
    };

    const medirFaixas = () => {
      estado.entrada = palco.offsetHeight / el.offsetHeight;
      estado.folha = 1 - estado.entrada;
      secao.style.setProperty("--entrada", estado.entrada.toFixed(4));
      secao.style.setProperty("--folha", estado.folha.toFixed(4));
    };

    const iniciar = async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (!vivo) return;
        gsap.registerPlugin(ScrollTrigger);
        medirFaixas();
        // fromTo: ao reativar (Movimento desligado e religado) parte sempre de 0
        const tween = gsap.fromTo(estado, { p: 0 }, {
          p: 1,
          ease: "none",
          onUpdate: aplicar,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom bottom",
            // suavização curta: ao parar de rolar, estabiliza em ~0,45 s
            scrub: 0.45,
            onRefresh: () => {
              medirFaixas();
              aplicar();
            },
          },
        });
        const st = tween.scrollTrigger!;
        // saltos (Ir direto, Voltar, foco por teclado, carga no meio da
        // página): vai direto ao ponto, sem rodar a órbita depressa
        const saltar = () => {
          ScrollTrigger.update();
          st.getTween()?.progress(1);
          tween.progress(st.progress);
          aplicar();
        };
        saltar();
        secao.dataset.orbita = "ativa";
        window.addEventListener(EVENTO_SALTO, saltar);
        // a altura da abertura (e o começo do trilho) depende das fontes no
        // celular: medir de novo quando elas terminam de carregar
        document.fonts?.ready.then(() => vivo && ScrollTrigger.refresh());
        desfazer = () => {
          window.removeEventListener(EVENTO_SALTO, saltar);
          st.kill();
          tween.kill();
        };
      } catch {
        if (vivo) falhar();
      }
    };
    const cancelar = depoisDaAbertura(iniciar);

    return () => {
      vivo = false;
      cancelar();
      desfazer();
      if (secao.dataset.orbita === "ativa") secao.dataset.orbita = "espera";
      delete secao.dataset.fase;
      for (const v of ["--p", "--chegada", "--titulo", "--entrada", "--folha"]) secao.style.removeProperty(v);
    };
  }, [ativa, estado, falhar]);

  /* ——— sem WebGL: grade direto, já no primeiro momento ocioso ———
     (barato; não espera a abertura, para o trilho não ficar reservado à toa) */
  useEffect(() => {
    if (!ativa) return;
    const verificar = () => {
      if (!temWebGL()) falhar();
    };
    return quandoOcioso(verificar, 500, 50);
  }, [ativa, falhar]);

  /* ——— 3D depois da abertura ———
     O trilho começa colado na primeira dobra: "perto da seção" já é a
     carga da página. Então a cena (Three.js + R3F, o maior pacote) só é
     pedida com a intro pronta e a página ociosa — pular a intro ou rolar
     antecipa; quem chega direto em /#projetos carrega na hora. */
  useEffect(() => {
    if (!ativa || Cena) return;
    let vivo = true;
    const cancelar = depoisDaAbertura(() => {
      import("./Cena")
        .then((m) => vivo && setCena(() => m.default))
        .catch(() => vivo && falhar());
    });
    return () => {
      vivo = false;
      cancelar();
    };
  }, [ativa, Cena, falhar]);

  /* ——— teclado: focar algo da grade durante a órbita leva à grade ——— */
  useEffect(() => {
    const secao = trilho.current?.closest<HTMLElement>("[data-secao]");
    const folha = secao?.querySelector<HTMLElement>("[data-folha]");
    if (!ativa || !folha) return;
    const aoFocar = (e: FocusEvent) => {
      const topo = topoNoDocumento(folha);
      if (window.scrollY >= topo - 2) return;
      window.scrollTo({ top: topo, behavior: "instant" });
      (e.target as HTMLElement).scrollIntoView({ block: "nearest", behavior: "instant" });
      avisarSalto();
    };
    folha.addEventListener("focusin", aoFocar);
    return () => folha.removeEventListener("focusin", aoFocar);
  }, [ativa]);

  // "Ir direto aos projetos": pula a sequência e leva o foco ao título da grade
  const irDireto = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const folha = trilho.current?.closest("[data-secao]")?.querySelector<HTMLElement>("[data-folha]");
    if (!folha) return;
    e.preventDefault();
    window.scrollTo({ top: topoNoDocumento(folha), behavior: "instant" });
    avisarSalto();
    document.getElementById("projetos-titulo")?.focus({ preventScroll: true });
  };

  const total = String(destaques.length).padStart(2, "0");

  return (
    <div ref={trilho} className={s.trilho} data-trilho>
      <div className={s.palco} data-palco>
        <div className={s.camada3d}>
          {ativa && Cena && (
            <Protecao aoFalhar={falhar}>
              <Cena estado={estado} registrar={registrar} />
            </Protecao>
          )}
        </div>

        {/* decoração da entrada; o título real da seção está na folha */}
        <div className={s.abertura} aria-hidden="true">
          <p className={s.selo}>
            <span className={s.seloNumero}>{total}</span> destaques
          </p>
          <p className={s.palavra}>Projetos</p>
          <p className={s.dica}>
            role para girar
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </p>
        </div>

        <a className={s.direto} href="#projetos-grade" onClick={irDireto}>
          Ir direto aos projetos
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}
