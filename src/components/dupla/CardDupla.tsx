"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Pessoa } from "@/data/dupla";
import { contato } from "@/config/site";
import { movimentoAtual, ouvirMovimento, suaveAtual } from "@/lib/movimento";
import { DecalqzinhoAdesivo } from "@/components/marca/Decalqzinho";
import s from "./CardDupla.module.css";

/**
 * Card da dupla no formato CREATIVE STUDIO PASS (referência enviada em
 * 01/10/2026), nas cores do portfólio em tom pastel e sem rosa.
 * Frente: foto com adesivos, código de barras, título, campos com
 * assinatura, carimbos. Verso: frase, QR do WhatsApp da pessoa, número e
 * habilidades. Os dois cards variam base, estrelas, adesivos e carimbos.
 *
 * Virada:
 * - um botão explícito embaixo do card ("Virar card" / "Voltar à frente"),
 *   por mouse, toque e teclado; cada card tem o próprio estado;
 * - com movimento completo, 450 ms em CSS; enquanto vira, novos comandos
 *   deste card são descartados (nada entra em fila). A trava sai no
 *   transitionend/transitioncancel — ou num prazo de segurança;
 * - com as animações desligadas pelo visitante, as faces trocam direto,
 *   sem trava nem inclinação;
 * - a face escondida fica `inert` + `aria-hidden` (sem clique, foco nem
 *   leitura); um aviso discreto diz ao leitor de tela qual lado está à mostra.
 *
 * Inclinação: só com mouse (ponteiro fino) e animações ligadas — pela
 * metade com movimento reduzido no sistema —, escrita direto no estilo (sem
 * setState por movimento do mouse).
 */
type Face = "frente" | "verso";

const SEGURANCA_MS = 900;

/** código de barras decorativo, sempre igual para o mesmo nome */
function barras(texto: string) {
  const out: number[] = [];
  for (let i = 0; i < 46; i++) out.push(((texto.charCodeAt(i % texto.length) * (i + 5)) % 3) + 1);
  return out;
}

/** estrela de cinco pontas */
function pontos(cx: number, cy: number, r: number, miolo = 0.45) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * miolo : r;
    return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

function Estrelinha({ className, giro = 0 }: { className?: string; giro?: number }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false" style={{ rotate: `${giro}deg` }}>
      <polygon points={pontos(20, 21, 18)} />
    </svg>
  );
}

/** fundo de cada face: estrelas grandes em pastel e o primeiro nome em cursiva */
function Fundo({ nome, lado }: { nome: string; lado: Face }) {
  return (
    <div className={s.fundo} data-lado={lado} aria-hidden="true">
      <svg className={s.estrelaGrande} viewBox="0 0 200 200" focusable="false">
        <polygon points={pontos(100, 106, 98, 0.5)} />
      </svg>
      <svg className={s.estrelaGrande2} viewBox="0 0 200 200" focusable="false">
        <polygon points={pontos(100, 106, 98, 0.5)} />
      </svg>
      <span className={s.marcaDagua}>{nome}</span>
    </div>
  );
}

export function CardDupla({ pessoa: p, qr }: { pessoa: Pessoa; qr: { d: string; lado: number } }) {
  const [face, setFace] = useState<Face>("frente");
  const [aviso, setAviso] = useState("");
  const card = useRef<HTMLDivElement>(null);
  const faces = useRef<HTMLDivElement>(null);
  const virando = useRef(false);
  const faceAtual = useRef<Face>("frente");

  const virar = () => {
    if (virando.current) return; // descartado: a virada anterior não acabou
    const nova: Face = faceAtual.current === "frente" ? "verso" : "frente";
    const el = faces.current;
    const raiz = card.current;
    if (movimentoAtual() === "completo" && el && raiz) {
      virando.current = true;
      raiz.dataset.virando = "";
      let prazo = 0;
      const liberar = () => {
        virando.current = false;
        delete raiz.dataset.virando;
        el.removeEventListener("transitionend", aoTerminar);
        el.removeEventListener("transitioncancel", aoTerminar);
        window.clearTimeout(prazo);
      };
      const aoTerminar = (e: TransitionEvent) => {
        if (e.target === el && e.propertyName === "transform") liberar();
      };
      el.addEventListener("transitionend", aoTerminar);
      el.addEventListener("transitioncancel", aoTerminar);
      prazo = window.setTimeout(liberar, SEGURANCA_MS);
    }
    faceAtual.current = nova;
    setFace(nova);
    setAviso(
      nova === "verso"
        ? `Verso do card de ${p.primeiroNome}: QR do WhatsApp e habilidades.`
        : `Frente do card de ${p.primeiroNome}.`,
    );
  };

  // inclinação discreta com o mouse
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)");
    let quadro = 0;
    let x = 0;
    let y = 0;
    const repousar = () => {
      window.cancelAnimationFrame(quadro);
      quadro = 0;
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
      delete el.dataset.inclinado;
    };
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fino.matches || movimentoAtual() !== "completo") return;
      const r = el.getBoundingClientRect();
      x = (e.clientX - r.left) / r.width - 0.5;
      y = (e.clientY - r.top) / r.height - 0.5;
      if (quadro) return;
      quadro = window.requestAnimationFrame(() => {
        quadro = 0;
        const k = suaveAtual() ? 0.5 : 1; // movimento reduzido: metade
        el.style.setProperty("--ry", `${(x * 8 * k).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-y * 6 * k).toFixed(2)}deg`);
        el.dataset.inclinado = "";
      });
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", repousar);
    const parar = ouvirMovimento(() => {
      if (movimentoAtual() !== "completo") repousar();
    });
    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", repousar);
      parar();
      repousar();
    };
  }, []);

  const codigo = barras(p.nomeCompleto);
  const n = p.numero;

  return (
    <>
      <h3 className="sr-only">{p.nomeCompleto}</h3>
      <div ref={card} className={s.card} data-face={face} data-tema={p.tema} data-pessoa={p.id}>
        <div ref={faces} className={s.faces}>
          {/* ——————————— frente ——————————— */}
          <div
            className={`${s.face} ${s.frente}`}
            inert={face !== "frente"}
            aria-hidden={face !== "frente" || undefined}
            role="group"
            aria-label={`Card de ${p.primeiroNome}, frente`}
          >
            <Fundo nome={p.primeiroNome} lado="frente" />

            <div className={s.blocoFoto}>
              <figure className={s.foto} data-foto={p.id} data-foto-pendente={p.foto ? undefined : ""}>
                {p.foto ? (
                  <Image src={p.foto.src} alt={p.foto.alt} fill sizes="(min-width: 1200px) 160px, 40vw" className={s.fotoImg} />
                ) : (
                  <>
                    <span className={s.iniciais} aria-hidden="true">
                      {p.iniciais}
                    </span>
                    <figcaption className={s.fotoAviso}>foto em breve</figcaption>
                  </>
                )}
                <span className={s.fita} aria-hidden="true" />
              </figure>
              <span className={s.cafe} aria-hidden="true">
                <span>coffee</span>
                <span className={s.cafeCursiva}>creative</span>
                <span>fuel</span>
              </span>
              <span className={s.adesivoTexto} aria-hidden="true">
                {p.adesivo}
              </span>
              <span className={s.oval} aria-hidden="true">
                <b>Authorised</b>
                <b>for swag</b>
                <span>reg: FIAP · {n}</span>
                <span>studio: web decalq</span>
              </span>
              <span className={s.lorem} aria-hidden="true">
                Lorem ipsum
              </span>
              <svg className={s.gema} viewBox="0 0 40 34" aria-hidden="true" focusable="false">
                <polygon points="8,2 32,2 40,12 20,34 0,12" className={s.gemaCorpo} />
                <polygon points="8,2 32,2 26,12 14,12" className={s.gemaBrilho} />
              </svg>
            </div>

            <div className={s.blocoBarras} aria-hidden="true">
              <svg viewBox={`0 0 ${codigo.length * 4} 30`} preserveAspectRatio="none" focusable="false">
                {codigo.map((w, i) => (
                  <rect key={i} x={i * 4} y="0" width={w} height="30" />
                ))}
              </svg>
              <span>{contato.instagramExibido.slice(1)}</span>
            </div>

            <div className={s.blocoTitulo} aria-hidden="true">
              <p className={s.creative}>Creative</p>
              <p className={s.studio}>Studio pass</p>
              <p className={s.bordao}>
                {p.bordao.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </p>
              <p className={s.code}>
                code:
                <span>#{n}</span>
              </p>
            </div>

            <dl className={s.campos}>
              <div className={s.linha}>
                <dt>full name:</dt>
                <dd className={s.nomeCompleto}>{p.nomeCompleto}</dd>
              </div>
              <div className={s.linha}>
                <dt>roles:</dt>
                <dd>{p.funcoes.join(" · ")}</dd>
              </div>
              <div className={s.linha}>
                <dt>signature ( authorised only )</dt>
                <dd className={s.assinatura}>{p.primeiroNome}</dd>
              </div>
              {/* a última linha tem duas células: cada uma é filha direta do
                  <dl> (um só nível de div em volta de dt/dd) */}
              <div className={`${s.linha} ${s.metade}`}>
                <dt>studio:</dt>
                <dd>WEB DECALQ</dd>
              </div>
              <div className={`${s.linha} ${s.metade}`}>
                <dt>instagram:</dt>
                <dd>{contato.instagramExibido}</dd>
              </div>
            </dl>

            <svg className={s.carimbo} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
              <defs>
                <path id={`carimbo-${p.id}`} d="M60 60 m-42 0 a42 42 0 1 1 84 0 a42 42 0 1 1 -84 0" />
              </defs>
              <circle cx="60" cy="60" r="56" />
              <circle cx="60" cy="60" r="30" />
              <text fontSize="13" fontWeight="700" letterSpacing="1.4">
                <textPath href={`#carimbo-${p.id}`}>WEB DECALQ • APPROVED • STUDIO •</textPath>
              </text>
              <text x="60" y="67" textAnchor="middle" fontSize="20" fontWeight="700">
                {n}/{n}
              </text>
            </svg>
            <DecalqzinhoAdesivo className={s.decalq} prefixo={`decalq-pass-${p.id}`} />

            <p className={s.repete}>
              <span aria-hidden="true">{p.estudo}</span>
              <span aria-hidden="true">{p.estudo}</span>
              <span>{p.estudo}</span>
            </p>

            <Estrelinha className={`${s.estrelinha} ${s.e1}`} giro={-12} />
            <Estrelinha className={`${s.estrelinha} ${s.e2}`} giro={8} />
            <Estrelinha className={`${s.estrelinha} ${s.e3}`} giro={20} />
            <Estrelinha className={`${s.estrelinha} ${s.e4}`} giro={-6} />
            <Estrelinha className={`${s.estrelinha} ${s.e5}`} giro={14} />
          </div>

          {/* ——————————— verso ——————————— */}
          <div
            className={`${s.face} ${s.verso}`}
            inert={face !== "verso"}
            aria-hidden={face !== "verso" || undefined}
            role="group"
            aria-label={`Card de ${p.primeiroNome}, verso`}
          >
            <Fundo nome={p.primeiroNome} lado="verso" />
            <p className={s.versoFrase}>({p.versoFrase})</p>
            <a
              className={s.qr}
              href={p.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Falar com ${p.primeiroNome} no WhatsApp, ${p.whatsapp.exibido} (QR code; abre em nova aba)`}
            >
              <svg viewBox={`0 0 ${qr.lado} ${qr.lado}`} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
                <path d={qr.d} />
              </svg>
            </a>
            <p className={s.whats}>
              <span className={s.whatsRotulo}>whatsapp</span>
              {p.whatsapp.exibido}
            </p>
            <p className={s.habilidades}>{p.habilidades.join("—")}</p>
            <DecalqzinhoAdesivo className={s.decalqVerso} prefixo={`decalq-pass-verso-${p.id}`} />
            <Estrelinha className={`${s.estrelinha} ${s.v1}`} giro={10} />
            <Estrelinha className={`${s.estrelinha} ${s.v2}`} giro={-14} />
            <Estrelinha className={`${s.estrelinha} ${s.v3}`} giro={4} />
            <Estrelinha className={`${s.estrelinha} ${s.v4}`} giro={-20} />
          </div>
        </div>
      </div>

      <button type="button" className={s.virar} onClick={virar} data-pessoa-botao={p.id}>
        <IconeVirar />
        {face === "frente" ? "Virar card" : "Voltar à frente"}
        <span className="sr-only"> de {p.primeiroNome}</span>
      </button>
      <p className="sr-only" aria-live="polite">
        {aviso}
      </p>
    </>
  );
}

function IconeVirar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6M17.5 2.8v4h-4M6.5 21.2v-4h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
