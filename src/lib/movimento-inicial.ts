/**
 * Decisão de animações e de intro ANTES da primeira pintura, sem React.
 * Roda como script inline no layout e publica atributos em <html>, de onde
 * todo o CSS de movimento depende (src/styles/movimento.css):
 *
 *   data-movimento = completo | calmo
 *     "calmo" SÓ quando o visitante desligou pelo botão (escolha explícita,
 *     salva em `decalq:animacoes`). Sem escolha salva: animações ligadas —
 *     inclusive para quem tem movimento reduzido no sistema (etapa 6).
 *
 *   data-suave = sim | nao
 *     Reflete prefers-reduced-motion. Não desliga nada: atenua os efeitos
 *     (menos amplitude e distorção, sem clarões rápidos).
 *
 *   data-intro = tocando | pronta
 *     "tocando" só na Home aberta pelo topo (sem âncora: quem chega em
 *     "/#projetos" vai direto à seção), com animações ligadas e se a intro
 *     ainda não tocou nesta sessão (sessionStorage). Um temporizador libera
 *     a página em 4 s mesmo que o JavaScript nunca chegue.
 *
 * Migração (auditoria de 01/10/2026): a chave antiga `decalq:movimento` só
 * era gravada pelo botão (nunca automaticamente). "calmo" nela é escolha
 * real de desligar → vira `desligadas`; "completo" é descartado (o padrão
 * agora já é ligado). Nenhuma outra chave é tocada.
 *
 * Sem JavaScript nenhum atributo é escrito e o CSS mostra o estado final.
 */
export const CHAVE_ANIMACOES = "decalq:animacoes";
export const CHAVE_MOVIMENTO_ANTIGA = "decalq:movimento";
export const CHAVE_INTRO = "decalq:intro";
export const CHAVE_BRILHO = "decalq:brilho";
export const TEMPO_SEGURANCA_MS = 4000;

/*
 * Também publica o estado inicial da TV: data-tv="ligada" e o brilho salvo
 * (data-brilho 1|2|3), para a tela já nascer com a intensidade escolhida.
 */
export const SCRIPT_MOVIMENTO = `(function(){var d=document.documentElement;try{
d.dataset.tv="ligada";
var b=null;try{b=localStorage.getItem("${CHAVE_BRILHO}")}catch(x){}
d.dataset.brilho=(b==="1"||b==="3")?b:"2";
var e=null;try{e=localStorage.getItem("${CHAVE_ANIMACOES}");
if(e!=="ligadas"&&e!=="desligadas"){e=null;var v=localStorage.getItem("${CHAVE_MOVIMENTO_ANTIGA}");
if(v==="calmo"){e="desligadas";localStorage.setItem("${CHAVE_ANIMACOES}",e)}
if(v!==null)localStorage.removeItem("${CHAVE_MOVIMENTO_ANTIGA}")}}catch(x){}
var calmo=e==="desligadas";
d.dataset.movimento=calmo?"calmo":"completo";
d.dataset.suave=matchMedia("(prefers-reduced-motion: reduce)").matches?"sim":"nao";
var vista=null;try{vista=sessionStorage.getItem("${CHAVE_INTRO}")}catch(x){}
var home=(location.pathname.replace(/\\/+$/,"")||"/")==="/"&&!location.hash;
if(home&&!calmo&&!vista){d.dataset.intro="tocando";
window.__decalqIntroSeguranca=setTimeout(function(){d.dataset.intro="pronta"},${TEMPO_SEGURANCA_MS})}
else d.dataset.intro="pronta";
}catch(x){d.dataset.intro="pronta"}})()`;
