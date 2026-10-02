"use client";
import { marcarIntro, movimentoAtual, ouvirMovimento, suaveAtual } from "@/lib/movimento";
import { CHAVE_BRILHO } from "@/lib/movimento-inicial";
import { lerTV, mudarTV, registrarComandos, type Sequencia } from "./estado-tv";
import {
  sequenciaDesligar,
  sequenciaIntro,
  sequenciaLigar,
  sequenciaRever,
  sequenciaReverCalma,
} from "./sequencias";
import { criarRitmo, falhar, prepararCamadas } from "./falhas";

declare global {
  interface Window {
    /** temporizador de segurança do script inicial (movimento-inicial.ts) */
    __decalqIntroSeguranca?: number;
  }
}

type Energia = "ligada" | "desligada";

interface EmCurso {
  nome: Sequencia;
  animacoes: Animation[];
  alvo: Energia;
  /** animações que esta pausa congelou (só elas voltam a tocar) */
  pausadas: Animation[];
}

/**
 * Controlador da TV da abertura. Estado em <html> (lido pelo CSS):
 *   data-tv="ligada|desligada", data-brilho="1|2|3",
 *   data-tv-ocupada="<sequência>" enquanto uma sequência roda,
 *   data-intro (intro automática) e data-movimento (lib/movimento).
 *
 * Regras:
 * - Uma sequência por vez. Com uma em curso, energia, brilho e "Rever intro"
 *   são descartados aqui mesmo (não entram em fila). A trava sai quando as
 *   animações terminam de verdade — ou quando são interrompidas (pular,
 *   desligar o movimento), sempre pousando num estado estável.
 * - Falhas só com a TV ligada e estável, movimento completo e cena à vista;
 *   uma por vez e um único temporizador, sempre limpo antes de agendar
 *   outro. O ritmo (falhas.ts) conta só o tempo em que elas podem acontecer.
 * - Fora de vista ou com a aba oculta: sequência congela, falhas param,
 *   flutuação pausa (CSS via data-ambiente). Ao voltar, retoma sem duplicar.
 * - Animações desligadas pelo visitante (data-movimento="calmo"): trocas
 *   diretas, sem animação automática. Religar retoma as falhas sem tocar a
 *   intro de novo.
 * - Movimento reduzido no sistema (data-suave="sim"): tudo continua, em
 *   versão atenuada (sequências e falhas recebem `suave`).
 */
export function criarControleTV(cena: HTMLElement) {
  const raiz = document.documentElement;
  const tela = cena.querySelector<HTMLElement>("[data-tela]");
  const preparo = tela ? prepararCamadas(tela) : null;
  const ritmo = criarRitmo();

  let emCurso: EmCurso | null = null;
  let falhaAtual: Animation[] = [];
  let temporizador = 0;
  let naTela = true;
  let abaVisivel = !document.hidden;
  // relógio de execução ativa: só anda enquanto as falhas podem acontecer
  let ativoAntes = 0;
  let ativoDesde = -1;

  const vivo = () => naTela && abaVisivel;
  const completo = () => movimentoAtual() === "completo";
  const suave = suaveAtual;
  const energia = (): Energia => (raiz.dataset.tv === "desligada" ? "desligada" : "ligada");

  mudarTV({
    energia: energia(),
    brilho: raiz.dataset.brilho === "1" ? 1 : raiz.dataset.brilho === "3" ? 3 : 2,
    sequencia: null,
    pulavel: false,
  });

  /* ———————— falhas ———————— */

  const falhasPodem = () =>
    completo() && !emCurso && raiz.dataset.intro === "pronta" && energia() === "ligada" && vivo();

  const ativo = () => ativoAntes + (ativoDesde < 0 ? 0 : performance.now() - ativoDesde);
  function relogio(andando: boolean) {
    if (andando && ativoDesde < 0) ativoDesde = performance.now();
    else if (!andando && ativoDesde >= 0) {
      ativoAntes += performance.now() - ativoDesde;
      ativoDesde = -1;
    }
  }

  /** Cancela a falha em curso (a imagem volta na hora) e o agendamento. */
  function pararFalhas() {
    window.clearTimeout(temporizador);
    temporizador = 0;
    relogio(false);
    falhaAtual.forEach((a) => a.cancel());
    falhaAtual = [];
    if (tela) delete tela.dataset.falha;
  }

  function agendarFalha() {
    window.clearTimeout(temporizador);
    temporizador = 0;
    const pode = !!preparo && falhasPodem();
    relogio(pode);
    if (!pode || falhaAtual.length) return;
    temporizador = window.setTimeout(executarFalha, ritmo.pausa(ativo()));
  }

  function executarFalha() {
    temporizador = 0;
    if (!preparo || !tela || !falhasPodem()) {
      relogio(false);
      return;
    }
    const tipo = ritmo.tipo(ativo());
    const lote = falhar(tipo, preparo.camadas, suave());
    falhaAtual = lote;
    tela.dataset.falha = tipo;
    Promise.all(lote.map((a) => a.finished)).then(
      () => {
        if (falhaAtual !== lote) return;
        falhaAtual = [];
        delete tela.dataset.falha;
        agendarFalha();
      },
      () => {
        /* cancelada por pararFalhas */
      },
    );
  }

  /* ———————— sequências ———————— */

  function iniciar(nome: Sequencia, animacoes: Animation[], alvo: Energia, pulavel = false) {
    pararFalhas();
    const atual: EmCurso = { nome, animacoes, alvo, pausadas: [] };
    emCurso = atual;
    raiz.dataset.tvOcupada = nome;
    mudarTV({ sequencia: nome, pulavel });
    if (!vivo()) congelar(atual);
    Promise.all(animacoes.map((a) => a.finished)).then(
      () => concluir(atual),
      () => {
        /* interrompida: quem interrompeu chamou concluir */
      },
    );
  }

  /** Pousa no estado estável da sequência e libera os controles. */
  function concluir(alvoDe: EmCurso | null) {
    if (!emCurso || emCurso !== alvoDe) return;
    const { nome, animacoes, alvo } = emCurso;
    emCurso = null;
    if (nome === "intro") raiz.dataset.intro = "pronta";
    raiz.dataset.tv = alvo;
    animacoes.forEach((a) => a.cancel());
    delete raiz.dataset.tvOcupada;
    mudarTV({ sequencia: null, pulavel: false, energia: alvo });
    agendarFalha();
  }

  function congelar(s: EmCurso) {
    s.pausadas = s.animacoes.filter((a) => a.playState === "running");
    s.pausadas.forEach((a) => a.pause());
  }

  function descongelar(s: EmCurso) {
    // só o que esta pausa congelou: tocar uma animação já terminada a
    // reiniciaria do começo
    s.pausadas.forEach((a) => {
      if (a.playState === "paused") a.play();
    });
    s.pausadas = [];
  }

  function tocarIntro() {
    window.clearTimeout(window.__decalqIntroSeguranca);
    marcarIntro();
    raiz.dataset.intro = "tocando";
    let animacoes: Animation[];
    try {
      animacoes = sequenciaIntro(cena, suave());
    } catch {
      raiz.dataset.intro = "pronta"; // sem intro, mas nunca sem conteúdo
      agendarFalha();
      return;
    }
    iniciar("intro", animacoes, "ligada", true);
  }

  /* ———————— comandos (botões físicos e "Pular intro") ———————— */

  const comandos = {
    energia() {
      if (emCurso) return; // trava: descartado, não acumula
      const desligar = energia() === "ligada";
      if (!completo()) {
        raiz.dataset.tv = desligar ? "desligada" : "ligada";
        mudarTV({ energia: desligar ? "desligada" : "ligada" });
        return;
      }
      if (desligar) iniciar("desligar", sequenciaDesligar(cena), "desligada");
      else iniciar("ligar", sequenciaLigar(cena, suave()), "ligada");
    },
    brilho() {
      if (emCurso || energia() !== "ligada") return;
      const nivel = ((lerTV().brilho % 3) + 1) as 1 | 2 | 3;
      raiz.dataset.brilho = String(nivel);
      try {
        localStorage.setItem(CHAVE_BRILHO, String(nivel));
      } catch {
        /* sem armazenamento: vale até recarregar */
      }
      mudarTV({ brilho: nivel });
    },
    rever() {
      if (emCurso || energia() !== "ligada") return;
      const animacoes = completo() ? sequenciaRever(cena, suave()) : sequenciaReverCalma(cena);
      iniciar("rever", animacoes, "ligada", true);
    },
    pular() {
      if (emCurso && lerTV().pulavel) concluir(emCurso);
    },
  };
  const desregistrar = registrarComandos(comandos);

  /* ———————— início ———————— */

  // aberta já em segundo plano: começa pausada (os avisos só vêm nas trocas)
  cena.dataset.ambiente = vivo() ? "ativo" : "pausado";
  if (raiz.dataset.intro === "tocando" && completo()) tocarIntro();
  else {
    raiz.dataset.intro = "pronta";
    agendarFalha();
  }

  /* ———————— movimento, visibilidade e atalhos ———————— */

  // Desligar: encerra a sequência num estado estável e para as falhas.
  // Religar (ou mudar a atenuação do sistema): só reagenda as falhas — um
  // temporizador, sempre limpo antes; a intro não volta sozinha.
  const pararMovimento = ouvirMovimento(() => {
    if (!completo()) {
      if (emCurso) concluir(emCurso);
      pararFalhas();
      return;
    }
    agendarFalha();
  });

  function atualizarAmbiente() {
    cena.dataset.ambiente = vivo() ? "ativo" : "pausado";
    if (emCurso) {
      if (vivo()) descongelar(emCurso);
      else if (!emCurso.pausadas.length) congelar(emCurso);
    }
    if (vivo()) agendarFalha();
    else pararFalhas();
  }

  const visao = new IntersectionObserver(([e]) => {
    if (naTela === e.isIntersecting) return;
    naTela = e.isIntersecting;
    atualizarAmbiente();
  });
  visao.observe(cena);

  const aoMudarAba = () => {
    if (abaVisivel === !document.hidden) return;
    abaVisivel = !document.hidden;
    atualizarAmbiente();
  };
  document.addEventListener("visibilitychange", aoMudarAba);

  // Só na intro automática (marca, menu e botões ainda invisíveis): Esc,
  // rolar a página ou levar o foco a um item escondido encerram a intro.
  // No "Rever intro" a página continua toda disponível; Esc também pula.
  const introAutomatica = () => emCurso?.nome === "intro";
  const porTecla = (e: KeyboardEvent) => {
    if (e.key === "Escape" && emCurso && lerTV().pulavel) concluir(emCurso);
  };
  const porRolagem = () => {
    if (introAutomatica()) concluir(emCurso);
  };
  const porFoco = (e: FocusEvent) => {
    if (introAutomatica() && e.target instanceof Element && e.target.closest("[data-entra]")) {
      concluir(emCurso);
    }
  };
  const passivo = { passive: true } as const;
  window.addEventListener("keydown", porTecla);
  window.addEventListener("wheel", porRolagem, passivo);
  window.addEventListener("touchmove", porRolagem, passivo);
  document.addEventListener("focusin", porFoco);

  return function destruir() {
    pararMovimento();
    visao.disconnect();
    document.removeEventListener("visibilitychange", aoMudarAba);
    window.removeEventListener("keydown", porTecla);
    window.removeEventListener("wheel", porRolagem);
    window.removeEventListener("touchmove", porRolagem);
    document.removeEventListener("focusin", porFoco);
    pararFalhas();
    emCurso?.animacoes.forEach((a) => a.cancel());
    emCurso = null;
    delete raiz.dataset.tvOcupada;
    mudarTV({ sequencia: null, pulavel: false });
    desregistrar();
    preparo?.desfazer();
  };
}
