// Diretor do vídeo "Ideia foragida": monta o palco (540 × 960) por cima do site com cópias
// das peças reais e descreve as 5 cenas numa linha do tempo GSAP pausada. O gravador chama
// window.__diretor.seek(t) quadro a quadro — nada anda sozinho, então cada quadro é sempre
// igual para o mesmo t. Os tempos das falas vêm de voz/tempos.json; os efeitos sonoros que a
// cena pede ficam em window.__diretor.sons (o gravador salva para a mixagem).
(() => {
  const gsap = window.gsap;
  const W = 540;
  const H = 960;
  const DURACAO = 33.5;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  // CSS Modules: Modulo-module__hash__nome
  const mod = (m, n) => `[class*="${m}-module__"][class*="__${n}"]`;

  // aleatório com semente: o mesmo vídeo a cada gravação
  function semente(a) {
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function novo(tag, cls, pai, estilo) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (estilo) Object.assign(e.style, estilo);
    if (pai) pai.appendChild(e);
    return e;
  }

  function copia(el) {
    const c = el.cloneNode(true);
    c.removeAttribute("id");
    $$("[data-tela-copia]", c).forEach((e) => e.remove());
    $$("img", c).forEach((i) => {
      i.loading = "eager";
      i.decoding = "sync";
    });
    return c;
  }

  // peça solta: só o desenho, numa caixa com a proporção do original
  function peca(fonte, largura, pai) {
    const r = fonte.getBoundingClientRect();
    const svg = fonte.matches("svg") ? fonte : $("svg", fonte);
    const caixa = novo("div", "v-abs v-peca", pai, { width: largura + "px", height: (largura * r.height) / r.width + "px" });
    caixa.appendChild(copia(svg));
    return caixa;
  }

  // título do site com outro texto (mesmas classes, marcador e tom)
  function titulo(fonte, linhas, marcador, pai) {
    const h = copia(fonte);
    h.classList.add("v-titulo", "v-abs");
    if (marcador) h.dataset.marcador = marcador;
    const modelo = $(mod("TituloSecao", "linha"), h);
    $$(mod("TituloSecao", "linha"), h).forEach((l) => l.remove());
    for (const texto of linhas) {
      const l = modelo.cloneNode(true);
      $(mod("TituloSecao", "texto"), l).textContent = texto;
      h.appendChild(l);
    }
    pai.appendChild(h);
    return h;
  }

  // contorno serrilhado (rasgo): offsets em y para x de 0 a W
  function serra(passo, amp, sem) {
    const r = semente(sem);
    const pts = [];
    for (let x = -10; x <= W + 10; x += passo) pts.push([x, (r() - 0.5) * 2 * amp]);
    return pts;
  }

  const ICONE_INSTA =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="17.2" cy="6.8" r="1.35" fill="currentColor"/></svg>';

  async function montar() {
    await document.fonts.ready;
    const tempos = await (await fetch("/video/voz/tempos.json")).json();
    const F = Object.fromEntries(tempos.falas.map((f) => [f.id, { ...f, fim: f.inicio + f.duracao }]));

    window.scrollTo(0, 0);
    const palco = novo("div", "", document.body);
    palco.id = "palco";
    const mundo = novo("div", "v-mundo", palco);

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
    const porQuadro = []; // funções f(t) para o que é contínuo (flutuar, tremer, rasgos)
    const sons = [];
    const som = (t, tipo, extra = {}) => sons.push({ t: +t.toFixed(3), tipo, ...extra });
    const P = { abre: 0, sobe: 0, digita: 0, tremorFuga: 0, olhar: 1 };

    // tremores do palco: [início, força]
    const tremores = [];
    porQuadro.push((t) => {
      let x = 0;
      let y = 0;
      let r = 0;
      for (const [t0, f] of tremores) {
        const d = t - t0;
        if (d < 0 || d > 0.5) continue;
        const a = f * Math.exp(-d * 9);
        x += a * Math.sin(d * 73);
        y += a * Math.cos(d * 61) * 0.8;
        r += a * 0.06 * Math.sin(d * 47);
      }
      mundo.style.transform = x || y ? `translate(${x}px, ${y}px) rotate(${r}deg)` : "";
    });
    const tremer = (t, f = 9) => tremores.push([t, f]);

    // flutuação contínua (senoides próprias, sem CSS)
    let nFlutua = 0;
    function flutuar(el, amp = 5, giro = 2) {
      const r = semente(101 + nFlutua++);
      const fx = 0.35 + r() * 0.4;
      const fy = 0.3 + r() * 0.4;
      const fr = 0.25 + r() * 0.35;
      const px = r() * 6.3;
      const py = r() * 6.3;
      const pr = r() * 6.3;
      porQuadro.push((t) => {
        const tau = Math.PI * 2;
        el.style.transform = `translate(${amp * Math.sin(t * fx * tau + px)}px, ${amp * 1.3 * Math.sin(t * fy * tau + py)}px) rotate(${giro * Math.sin(t * fr * tau + pr)}deg)`;
      });
    }

    // ——— peças originais do site
    const compOrig = $(mod("Abertura", "composicao"));
    const sorrisoOrig = $('[data-objeto="papel-sorriso"]', compOrig);
    const adesivoOrig = $("[data-adesivo]", compOrig);
    const objeto = (id) => $(`[data-objeto="${id}"]`, compOrig);

    function composicao(y, textoTela) {
      const caixa = novo("div", "v-abs v-comp", null, { top: y + "px" });
      const c = copia(compOrig);
      caixa.appendChild(c);
      $$("[data-objeto]", c).forEach((p) => {
        if (getComputedStyle(objeto(p.dataset.objeto)).display === "none") return;
        const alvo = p.firstElementChild || p;
        flutuar(alvo, 3, 1.5);
      });
      if (textoTela) {
        const forma = $(mod("TelaPortfolio", "forma"), c);
        forma.innerHTML = textoTela;
      }
      return { caixa, c };
    }

    // ——— camadas, de trás para a frente
    const escuro = novo("div", "v-camada v-escuro", mundo);

    // CENA 1 — TV
    const { caixa: comp1, c: c1 } = composicao(78, "Ideia<br>Foragida");
    mundo.appendChild(comp1);
    $('[data-objeto="papel-sorriso"]', c1).style.opacity = "0";
    const titulo1 = $(mod("TelaPortfolio", "titulo"), c1);
    titulo1.style.fontSize = "17.5cqw";
    Object.assign($(mod("TelaPortfolio", "forma"), c1).style, { lineHeight: "0.86", textAlign: "center" });
    const tela = $("[data-tela]", c1);
    const camada = (n) => $(mod("Televisao", n), tela);
    const imagem = camada("imagem");
    const apagada = camada("apagada");
    const linha = camada("linha");
    const chuvisco = camada("chuvisco");
    const led = $("[data-led]", c1);

    const T = tela.getBoundingClientRect(); // palco começa em (0,0)
    const olhos = $$("path[data-olho]", c1);
    const adesivo1 = $("[data-adesivo]", c1).getBoundingClientRect();

    // o recorte que foge: tamanho base (escala 1)
    const sr = sorrisoOrig.getBoundingClientRect();
    const FW = 160;
    const FH = (FW * sr.height) / sr.width;
    function recorte(pai, cls) {
      const fora = novo("div", "v-abs", pai, { width: FW + "px", height: FH + "px", opacity: 0 });
      const dentro = novo("div", "v-peca " + (cls || ""), fora, { width: "100%", height: "100%" });
      dentro.appendChild(copia($("svg", sorrisoOrig)));
      return { fora, dentro };
    }

    // dentro da tela: cópia esverdeada, recortada pelo vidro
    const camadaDentro = novo("div", "v-camada", mundo, {
      clipPath: `inset(${T.top}px ${W - T.right}px ${H - T.bottom}px ${T.left}px round 18px)`,
    });
    const fugaVerde = recorte(camadaDentro, "v-tela-verde");

    // CENA 2 — janela do template (fica atrás do recorte; o recorte é que é cortado no vão)
    const JW = 320;
    const VH = 220;
    const camadaJanela = novo("div", "v-camada", mundo);
    const molduraOrig = $(`[data-grade] [data-projeto="helios-solar-beige"] ${mod("Moldura", "moldura")}`);

    // CENA 3 — papel claro que abre num rasgo
    const papel = novo("div", "v-camada v-papel", mundo, { visibility: "hidden" });
    const camadaPixels = novo("div", "v-camada", mundo);
    const conteudo3 = novo("div", "v-camada", mundo);
    const conteudo4 = novo("div", "v-camada", mundo);

    // o recorte colorido (fora da tela na cena 1, protagonista na 2 e 3)
    const camadaRecorte = novo("div", "v-camada", mundo, {
      clipPath: `path(evenodd, "M-50 -50H${W + 50}V${H + 50}H-50Z M${T.left} ${T.top}H${T.right}V${T.bottom}H${T.left}Z")`,
    });
    const fugaCor = recorte(camadaRecorte);

    function janelaNova(pai, comFundo) {
      const j = copia(molduraOrig);
      j.classList.add("v-abs");
      Object.assign(j.style, { width: JW + "px" });
      $(mod("Moldura", "imagem"), j)?.remove();
      $(mod("Moldura", "dominio"), j).textContent = "template-pronto.com";
      const vidro = $(mod("Moldura", "vidro"), j);
      Object.assign(vidro.style, { height: VH + "px", background: comFundo ? fundoTemplate : "transparent" });
      pai.appendChild(j);
      return j;
    }
    const fundoTemplate = [
      "linear-gradient(#b9b4a9,#b9b4a9) 18px 18px / 110px 13px no-repeat",
      "linear-gradient(#b9b4a9,#b9b4a9) 236px 18px / 56px 13px no-repeat",
      "linear-gradient(#d2cdc3,#d2cdc3) 18px 46px / 274px 78px no-repeat",
      "linear-gradient(#d2cdc3,#d2cdc3) 18px 138px / 210px 10px no-repeat",
      "linear-gradient(#d2cdc3,#d2cdc3) 18px 156px / 240px 10px no-repeat",
      "linear-gradient(#b9b4a9,#b9b4a9) 18px 180px / 92px 24px no-repeat",
      "#e6e2da",
    ].join(",");
    const janela = janelaNova(camadaJanela, true);
    gsap.set(janela, { opacity: 0 });
    const vidroJ = $(mod("Moldura", "vidro"), janela);
    const barraJ = $(mod("Moldura", "barra"), janela);
    const dominioJ = $(mod("Moldura", "dominio"), janela);
    // metades para o rasgo, por cima de tudo
    const camadaMetades = novo("div", "v-camada", mundo);
    const metades = [0, 1].map(() => {
      const m = janelaNova(camadaMetades, true);
      gsap.set(m, { opacity: 0 });
      return m;
    });

    const carimbo1 = novo("div", "v-abs v-carimbo", mundo, { color: "#bcfa46", opacity: 0, filter: "url(#cg-impresso)" });
    carimbo1.innerHTML = '<span class="grande">Aprovado</span><span class="pequeno">por ninguém</span>';

    // CENA 5 — o breu volta
    const final = novo("div", "v-camada", mundo, { visibility: "hidden" });
    novo("div", "v-camada v-escuro", final);

    const legendas = novo("div", "v-camada", palco);
    const preto = novo("div", "v-camada v-preto", palco);

    // ——— helpers de posição (centro)
    const centro = (el, x, y, extra = {}) => ({ x, y, xPercent: -50, yPercent: -50, ...extra });
    const fugas = [fugaVerde.fora, fugaCor.fora];

    // tremor do recorte
    porQuadro.push((t) => {
      const a = P.tremorFuga;
      const v = a ? `translate(${a * 3.2 * Math.sin(t * 97)}px, ${a * 2.2 * Math.sin(t * 83 + 1)}px) rotate(${a * 2.5 * Math.sin(t * 71)}deg)` : "";
      fugaVerde.dentro.style.transform = v;
      fugaCor.dentro.style.transform = v;
    });

    // ===================== CENA 1 · 0–3,15 · gancho =====================
    gsap.set(preto, { opacity: 1 });
    tl.to(preto, { opacity: 0, duration: 0.3, ease: "none" }, 0);
    gsap.set(imagem, { opacity: 0, scaleY: 0.02, filter: "brightness(3)" });
    gsap.set(apagada, { opacity: 1 });
    gsap.set(led, { opacity: 0 });
    gsap.set(linha, { opacity: 0, scaleX: 0 });
    gsap.set(chuvisco, { opacity: 0 });
    tl.set(led, { opacity: 1 }, 0.3);
    som(0.3, "tv");
    tl.set(linha, { opacity: 1 }, 0.32);
    tl.to(linha, { scaleX: 1, duration: 0.1, ease: "power2.out" }, 0.32);
    tl.set(imagem, { opacity: 1 }, 0.42);
    tl.set(chuvisco, { opacity: 0.75 }, 0.42);
    tl.to(imagem, { scaleY: 1, duration: 0.3, ease: "power3.out" }, 0.42);
    tl.to(imagem, { filter: "brightness(1)", duration: 0.55, ease: "power1.out" }, 0.48);
    tl.to(apagada, { opacity: 0, duration: 0.2 }, 0.42);
    tl.to(linha, { opacity: 0, duration: 0.18 }, 0.5);
    tl.to(chuvisco, { opacity: 0, duration: 0.6, ease: "power1.in" }, 0.5);

    // o recorte nasce dentro da tela
    const s0 = 0.42;
    const yF = T.top + T.height * 0.64;
    const xBorda = T.right - (FW * s0) / 2 - 3;
    gsap.set(fugas, centro(null, T.left + T.width * 0.24, yF, { scale: 0.08, rotation: -14 }));
    tl.to(fugas, { opacity: 1, scale: s0, rotation: -6, duration: 0.25, ease: "back.out(2.5)" }, 0.95);
    tl.to(fugas, { x: xBorda, duration: 0.5, ease: "power2.in" }, 1.08);
    tl.to(fugas, { y: yF - 14, duration: 0.25, ease: "sine.out" }, 1.08);
    tl.to(fugas, { y: yF, duration: 0.25, ease: "sine.in" }, 1.33);
    // bate na borda
    som(1.58, "bate");
    tl.to(fugas, { scaleX: s0 * 0.8, scaleY: s0 * 1.12, duration: 0.06, ease: "power2.out" }, 1.58);
    tl.to(fugas, { scaleX: s0, scaleY: s0, x: xBorda - 18, rotation: -12, duration: 0.2, ease: "power2.out" }, 1.64);
    // força
    tl.to(fugas, { x: xBorda + 4, scaleX: s0 * 0.86, scaleY: s0 * 1.08, rotation: 4, duration: 0.2, ease: "power2.in" }, 1.86);
    tl.to(P, { tremorFuga: 0.6, duration: 0.2 }, 1.86);
    // atravessa, ganhando cor: metade para fora da TV
    som(2.08, "rompe");
    tl.to(fugas, { x: T.right + 6, y: yF - 6, scale: 0.62, rotation: 9, duration: 0.3, ease: "back.out(1.8)" }, 2.08);
    tl.to(P, { tremorFuga: 1, duration: 0.15 }, 2.3);
    tremer(2.1, 4);

    // olhos do Decalqzinho seguem o recorte
    const olhoC = { x: adesivo1.left + adesivo1.width * 0.4, y: adesivo1.top + adesivo1.height * 0.4 };
    porQuadro.push(() => {
      const fx = gsap.getProperty(fugaCor.fora, "x");
      const fy = gsap.getProperty(fugaCor.fora, "y");
      let dx = fx - olhoC.x;
      let dy = fy - olhoC.y;
      const d = Math.hypot(dx, dy) || 1;
      dx = (dx / d) * 7 * P.olhar;
      dy = (dy / d) * 6 * P.olhar;
      olhos.forEach((o) => (o.style.transform = `translate(${dx}px, ${dy}px)`));
    });

    // legendas f01–f13
    for (const f of tempos.falas.slice(0, 13)) {
      const l = novo("div", "v-legenda", legendas);
      l.textContent = f.legenda;
      gsap.set(l, { xPercent: -50, yPercent: -50, scale: 0.92 });
      const ini = Math.max(0, f.inicio - 0.06);
      tl.to(l, { opacity: 1, scale: 1, duration: 0.12, ease: "back.out(2)" }, ini);
      tl.to(l, { opacity: 0, duration: 0.12, ease: "none" }, F[f.id].fim + 0.22);
    }

    // ===================== CENA 2 · 3,15–8,3 · problema =====================
    const t2 = F.f02.inicio;
    tl.to(P, { tremorFuga: 0, olhar: 0.5, duration: 0.2 }, t2);
    tl.set(fugaVerde.fora, { opacity: 0 }, t2);
    tl.set(camadaRecorte, { clipPath: "none" }, t2);
    tl.to(comp1, { opacity: 0.16, scale: 0.94, duration: 0.45, ease: "power2.inOut" }, t2);
    tl.to(fugaCor.fora, { x: 270, y: 410, scale: 2, rotation: 0, duration: 0.42, ease: "power3.inOut" }, t2);
    som(t2, "whoosh", { v: 0.6 });

    // janela: posições (canto superior esquerdo) e o vão correspondente
    const vao = (jx, jy) => {
      const vx = jx + 5;
      const vy = jy + 26;
      return `inset(${vy}px ${W - (vx + JW - 10)}px ${H - (vy + VH)}px ${vx}px round 4px)`;
    };
    const tentativas = [
      { x: 110, y: 284, t: t2 + 0.28, barra: "#bcfa46", tinta: "#0d0f0c", filtro: "hue-rotate(0deg) saturate(1)" },
      { x: 52, y: 228, t: F.f03.inicio, barra: "#2746dd", tinta: "#ede8de", filtro: "hue-rotate(150deg) saturate(1.25)" },
      { x: 176, y: 336, t: F.f04.inicio, barra: "#f6c537", tinta: "#0d0f0c", filtro: "hue-rotate(255deg) saturate(1.2)" },
    ];
    gsap.set(janela, { x: tentativas[0].x, y: -330 });
    gsap.set(fugaCor.dentro, { filter: "hue-rotate(0deg) saturate(1)" });
    gsap.set(barraJ, { backgroundColor: "#bcfa46" });
    gsap.set(dominioJ, { color: "#0d0f0c" });
    tentativas.forEach((a, i) => {
      const bate = a.t + (i === 0 ? 0.26 : 0.17);
      if (i === 0) {
        tl.set(janela, { opacity: 1 }, a.t);
        tl.to(janela, { y: a.y, duration: 0.26, ease: "power3.in" }, a.t);
        tl.set(camadaRecorte, { clipPath: vao(a.x, a.y) }, bate);
      } else {
        tl.to(janela, { x: a.x, y: a.y - 40, duration: 0.1, ease: "power2.out" }, a.t);
        tl.to(janela, { y: a.y, duration: 0.07, ease: "power3.in" }, a.t + 0.1);
        tl.to(camadaRecorte, { clipPath: vao(a.x, a.y - 40), duration: 0.1, ease: "power2.out" }, a.t);
        tl.to(camadaRecorte, { clipPath: vao(a.x, a.y), duration: 0.07, ease: "power3.in" }, a.t + 0.1);
        tl.set(barraJ, { backgroundColor: a.barra }, bate);
        tl.set(dominioJ, { color: a.tinta }, bate);
        tl.set(fugaCor.dentro, { filter: a.filtro }, bate);
      }
      // a batida: janela achata, recorte encolhe um tiquinho
      tl.to(janela, { scaleY: 0.96, scaleX: 1.02, duration: 0.05, ease: "power2.out" }, bate);
      tl.to(janela, { scaleY: 1, scaleX: 1, duration: 0.2, ease: "back.out(3)" }, bate + 0.05);
      som(bate, "batida");
      tremer(bate, 5);
    });

    // carimbo torto
    const tc = F.f04.fim + 0.06;
    gsap.set(carimbo1, centro(null, 270, 440, { rotation: -13, scale: 2.6 }));
    tl.to(carimbo1, { opacity: 1, scale: 1, duration: 0.11, ease: "power4.in" }, tc - 0.11);
    som(tc, "carimbo");
    tremer(tc, 11);

    // ===================== CENA 3 · 8,3–18,3 · solução =====================
    // o recorte força e rasga a janela
    const tr = 8.1;
    tl.to(P, { tremorFuga: 1.4, duration: 0.25 }, tr - 0.38);
    tl.to(fugaCor.fora, { scale: 2.08, duration: 0.38, ease: "power1.in" }, tr - 0.38);
    tl.set(camadaRecorte, { clipPath: "none" }, tr);
    tl.set(fugaCor.dentro, { filter: "hue-rotate(0deg) saturate(1)" }, tr);
    tl.set(P, { tremorFuga: 0 }, tr);
    tl.set(janela, { opacity: 0 }, tr);
    const jf = tentativas[2];
    const corte = serra(14, 9, 7).map(([x, d]) => [d, x]); // serra vertical: [dx, y]
    const meio = JW / 2 + 6;
    const ladoE = ["0px 0px"]
      .concat(corte.filter(([, y]) => y >= 0 && y <= 260).map(([dx, y]) => `${meio + dx}px ${y}px`))
      .concat(["0px 260px"]);
    const ladoD = [`${JW}px 0px`]
      .concat(corte.filter(([, y]) => y >= 0 && y <= 260).map(([dx, y]) => `${meio + dx}px ${y}px`))
      .concat([`${JW}px 260px`]);
    gsap.set(metades[0], { x: jf.x, y: jf.y, clipPath: `polygon(${ladoE.join(",")})` });
    gsap.set(metades[1], { x: jf.x, y: jf.y, clipPath: `polygon(${ladoD.join(",")})` });
    metades.forEach((m) => ($(mod("Moldura", "barra"), m).style.backgroundColor = jf.barra));
    tl.set(metades, { opacity: 1 }, tr);
    tl.to(metades[0], { x: jf.x - 520, y: jf.y + 520, rotation: -38, duration: 0.8, ease: "power2.in" }, tr);
    tl.to(metades[1], { x: jf.x + 480, y: jf.y + 560, rotation: 32, duration: 0.8, ease: "power2.in" }, tr);
    tl.set(metades, { visibility: "hidden" }, tr + 0.85);
    tl.to(carimbo1, { y: 1150, rotation: 20, duration: 0.7, ease: "power2.in" }, tr + 0.04);
    tl.to(fugaCor.fora, { scale: 2.3, duration: 0.1, ease: "power2.out" }, tr);
    tl.to(fugaCor.fora, { scale: 1.9, duration: 0.4, ease: "back.out(2)" }, tr + 0.1);
    som(tr, "rasgo");
    tremer(tr, 8);

    // papel claro abre num rasgo horizontal
    const ta = 8.36;
    tl.set(papel, { visibility: "visible" }, ta);
    tl.to(P, { abre: 1, duration: 0.85, ease: "power3.inOut" }, ta);
    tl.set([escuro, comp1], { visibility: "hidden" }, ta + 0.9);
    som(ta, "papel");
    const bordaCima = serra(16, 7, 31);
    const bordaBaixo = serra(16, 7, 47);
    const rp = semente(9);
    const pixels = Array.from({ length: 46 }, (_, i) => {
      const lado = i % 2;
      const tam = 6 + Math.floor(rp() * 5) * 2;
      const cor = rp() < 0.32 ? "#bcfa46" : rp() < 0.5 ? "#2746dd" : "#efe9dc";
      const e = novo("i", "v-px", camadaPixels, { width: tam + "px", height: tam + "px", background: cor });
      return { e, x: rp() * W, off: 6 + rp() * 34, lado };
    });
    porQuadro.push(() => {
      const a = P.abre;
      if (a <= 0 || a >= 1) {
        papel.style.clipPath = a >= 1 ? "none" : "inset(50%)";
        camadaPixels.style.display = "none";
        return;
      }
      const d = a * 560;
      const cima = bordaCima.map(([x, o]) => `${x}px ${480 - d + o}px`);
      const baixo = bordaBaixo.map(([x, o]) => `${x}px ${480 + d + o}px`).reverse();
      papel.style.clipPath = `polygon(${cima.concat(baixo).join(",")})`;
      camadaPixels.style.display = "";
      camadaPixels.style.opacity = String(Math.min(1, (1 - a) * 4));
      for (const p of pixels) {
        const y = p.lado ? 480 + d + p.off * (0.4 + a) : 480 - d - p.off * (0.4 + a);
        p.e.style.transform = `translate(${p.x}px, ${y}px)`;
      }
    });

    // o recorte vira adesivo no canto
    tl.to(fugaCor.fora, { x: 462, y: 652, scale: 0.62, rotation: 11, duration: 0.6, ease: "power3.inOut" }, 9.05);
    tl.to(fugaCor.dentro, { filter: "hue-rotate(0deg) saturate(1) drop-shadow(0px 5px 4px rgba(0,0,0,0.35))", duration: 0.3 }, 9.3);
    som(9.05, "whoosh", { v: 0.5 });

    // adesivos da colagem pelas bordas
    const adesivos3 = [
      ["papel-estrela", 92, 16, 150, -10],
      ["tubo-rosa", 52, 6, 440, 8],
      ["estrela-lima", 104, 36, 610, -6],
      ["papel-xadrez", 92, 440, 168, 7],
      ["brilho-pixel", 30, 478, 340, 0],
      ["estrela-pixel", 36, 26, 330, 0],
      ["rabisco-azul", 70, 400, 470, -12],
    ];
    const grupo3 = [];
    adesivos3.forEach(([id, w, x, y, r], i) => {
      const fonte = objeto(id);
      if (!fonte) return;
      const casca = novo("div", "v-abs", conteudo3, { left: x + "px", top: y + "px" });
      const p = peca($("svg", fonte), w, casca);
      p.style.position = "relative";
      p.style.filter = "drop-shadow(0 3px 3px rgba(0,0,0,0.28))";
      flutuar(p, 3, 3);
      gsap.set(casca, { scale: 0, rotation: r - 25, opacity: 0 });
      const ti = 9.05 + i * 0.12;
      tl.to(casca, { scale: 1, rotation: r, opacity: 1, duration: 0.32, ease: "back.out(2.4)" }, ti);
      if (i % 2 === 0) som(ti, "pop", { v: 0.45 });
      grupo3.push(casca);
    });

    // rótulos dos verbos (estilo dos títulos do site)
    const tituloPapel = $("#servicos-titulo");
    const rotulos = [
      ["Abriu espaço", "rosa", F.f05.inicio + 0.05, F.f06.inicio - 0.05],
      ["Desenhou", "amarelo", F.f06.inicio, F.f07.inicio - 0.05],
      ["Escreveu código", "azul-claro", F.f07.inicio, F.f08.inicio - 0.05],
      ["Pra funcionar", "lilas", F.f08.inicio, 18.25],
    ];
    rotulos.forEach(([texto, cor, ti, tf]) => {
      const h = titulo(tituloPapel, [texto], cor, conteudo3);
      h.dataset.fluxo = "linha";
      gsap.set(h, centro(null, 270, 112, { scale: 0.4, opacity: 0, rotation: -6 }));
      tl.to(h, { scale: 1.12, opacity: 1, rotation: -2, duration: 0.3, ease: "back.out(2.2)" }, ti);
      tl.to(h, { scale: 0.7, opacity: 0, rotation: 3, duration: 0.14, ease: "power2.in" }, tf - 0.14);
      som(ti, "pop", { v: 0.7 });
    });

    // f06 — esboço de site desenhado à mão
    const esboco = novo("div", "v-abs", conteudo3, { width: "380px", height: "300px" });
    esboco.innerHTML = `<svg class="v-esboco" viewBox="0 0 380 300" width="380" height="300" style="overflow:visible">
      <path pathLength="1" d="M14 18 Q12 150 16 284 Q190 288 366 282 Q369 150 364 16 Q190 12 14 18 Z"/>
      <path pathLength="1" d="M16 52 Q190 49 364 54"/>
      <path pathLength="1" d="M34 34 a5 5 0 1 0 0.1 0 M54 34 a5 5 0 1 0 0.1 0 M74 34 a5 5 0 1 0 0.1 0"/>
      <path pathLength="1" d="M40 84 Q110 80 182 86"/>
      <path pathLength="1" d="M40 112 Q100 108 160 113 M40 132 Q92 129 140 133"/>
      <path pathLength="1" d="M40 164 Q80 160 120 164 Q123 180 120 194 Q80 197 40 194 Q37 180 40 164 Z"/>
      <path pathLength="1" d="M206 80 Q280 76 344 82 Q347 140 342 196 Q276 199 208 194 Q204 140 206 80 Z M210 84 L340 192 M340 84 L212 192"/>
      <path pathLength="1" d="M40 226 Q120 222 196 227 M40 248 Q100 245 160 249"/>
      <path pathLength="1" d="M226 222 Q290 218 344 224 Q346 246 343 264 Q286 267 228 263 Q225 244 226 222 Z"/>
    </svg>`;
    const tracos = $$("path", esboco);
    tracos.forEach((p) => gsap.set(p, { strokeDasharray: 1, strokeDashoffset: 1 }));
    gsap.set(esboco, centro(null, 270, 420, { rotation: -2 }));
    const td = F.f06.inicio - 0.05;
    tracos.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, duration: 0.3, ease: "power1.inOut" }, td + i * 0.09));
    som(td, "risco", { d: 1.05 });
    // blocos coloridos colados no esboço
    const blocos = [
      [36, 74, 152, 70, "#bcfa46", -3],
      [202, 76, 146, 124, "#2746dd", 2],
      [36, 160, 88, 38, "#fa80a5", -4],
      [222, 218, 126, 50, "#f6c537", 3],
    ].map(([x, y, w, h, cor, r], i) => {
      const b = novo("div", "v-abs", esboco, {
        left: x + "px",
        top: y + "px",
        width: w + "px",
        height: h + "px",
        background: cor,
        mixBlendMode: "multiply",
        clipPath: "polygon(2% 6%, 98% 0, 100% 92%, 4% 100%)",
      });
      gsap.set(b, { scale: 0, rotation: r * 3 });
      tl.to(b, { scale: 1, rotation: r, duration: 0.24, ease: "back.out(2.5)" }, td + 0.75 + i * 0.1);
      return b;
    });
    som(td + 0.75, "pop", { v: 0.5 });
    som(td + 0.95, "pop", { v: 0.5 });

    // f07 — código digitado numa janela escura
    const tcod = F.f07.inicio;
    const janelaCodigo = novo("div", "v-abs", conteudo3, {
      width: "410px",
      background: "#0d0f0c",
      borderRadius: "12px",
      boxShadow: "9px 9px 0 #2746dd, 9px 9px 0 2px #0d0f0c",
    });
    janelaCodigo.innerHTML = `<div style="display:flex;gap:6px;padding:10px 12px 0"><i style="width:9px;height:9px;background:#fa80a5"></i><i style="width:9px;height:9px;background:#f6c537"></i><i style="width:9px;height:9px;background:#bcfa46"></i><span style="margin-left:10px;font:500 12px/1 'IBM Plex Mono',monospace;color:#bdb6a6;transform:translateY(-1px)">ideia-foragida.html</span></div>`;
    const pre = novo("pre", "v-codigo", janelaCodigo, { fontSize: "17px", minHeight: "232px" });
    const codigo = [
      ["k", "<section"], ["", " class="], ["s", '"ideia"'], ["k", ">"], ["", "\n  "],
      ["k", "<h1>"], ["", "Foragida"], ["k", "</h1>"], ["", "\n  "],
      ["k", "<a"], ["", " href="], ["s", '"#contato"'], ["k", ">"], ["", "\n    Chama no direct\n  "],
      ["k", "</a>"], ["", "\n"], ["k", "</section>"], ["", "\n\n"],
      ["", ".ideia { "], ["k", "template"], ["", ": "], ["s", "none"], ["", "; }"],
    ];
    const totalChars = codigo.reduce((n, [, s]) => n + s.length, 0);
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let ultimoN = -1;
    porQuadro.push((t) => {
      const n = Math.round(P.digita * totalChars);
      const pisca = P.digita >= 1 ? Math.floor(t * 2.6) % 2 === 0 : true;
      const chave = n * 2 + (pisca ? 1 : 0);
      if (chave === ultimoN) return;
      ultimoN = chave;
      let resto = n;
      let html = "";
      for (const [c, s] of codigo) {
        if (resto <= 0) break;
        const parte = s.slice(0, resto);
        resto -= parte.length;
        html += c ? `<span class="${c}">${esc(parte)}</span>` : esc(parte);
      }
      pre.innerHTML = html + (pisca ? '<span class="c"></span>' : "");
    });
    gsap.set(janelaCodigo, centro(null, 760, 450, { rotation: 4 }));
    tl.to(esboco, { x: 222, y: 360, scale: 0.8, rotation: -6, duration: 0.4, ease: "power3.inOut" }, tcod - 0.05);
    tl.to(janelaCodigo, { x: 290, y: 470, rotation: 1.5, duration: 0.42, ease: "back.out(1.4)" }, tcod - 0.05);
    som(tcod - 0.05, "whoosh", { v: 0.6 });
    tl.to(P, { digita: 1, duration: 1.3, ease: "none" }, tcod + 0.12);
    som(tcod + 0.12, "teclas", { d: 1.3 });

    // f08 — sites reais no ar
    const t8 = F.f08.inicio;
    tl.to(esboco, { x: -260, rotation: -20, duration: 0.4, ease: "power2.in" }, t8 - 0.1);
    tl.to(janelaCodigo, { x: 820, rotation: 16, duration: 0.4, ease: "power2.in" }, t8 - 0.1);
    som(t8 - 0.1, "whoosh", { v: 0.7 });
    const noar = novo("div", "v-abs v-noar", conteudo3);
    noar.innerHTML = "<i></i>no ar";
    gsap.set(noar, centro(null, 270, 176, { scale: 0, rotation: -4 }));
    tl.to(noar, { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, t8 + 0.3);
    tl.to(noar, { scale: 0, duration: 0.15, ease: "power2.in" }, 18.15);
    const slugs = ["reis-lazer", "helios-solar-beige", "the-one-bistro", "vai-de-smash", "nativa-arquitetura", "prospectlife"];
    const pilha = novo("div", "v-abs", conteudo3);
    const rc = semente(77);
    const cards = slugs.map((slug, i) => {
      const art = $(`[data-grade] [data-projeto="${slug}"] article`);
      const casca = novo("div", "v-abs", pilha, { width: "430px" });
      const a = copia(art);
      $(mod("GradeProjetos", "info"), a)?.remove();
      a.style.height = "auto";
      casca.appendChild(a);
      const r = (rc() - 0.5) * 6;
      const dx = (rc() - 0.5) * 22;
      const dy = (rc() - 0.5) * 16;
      gsap.set(casca, centro(null, 270 + (i % 2 ? 260 : -260), 1220, { rotation: (i % 2 ? 1 : -1) * 22 }));
      const ti = t8 + 0.25 + i * 0.7;
      tl.to(casca, { x: 264 + dx, y: 448 + dy, rotation: r, duration: 0.5, ease: "back.out(1.15)" }, ti);
      som(ti, "whoosh", { v: 0.5 });
      som(ti + 0.42, "baque", { v: 0.35 });
      return casca;
    });
    tl.fromTo(pilha, { y: 14 }, { y: -10, duration: 18.2 - t8, ease: "none" }, t8);

    // saída da cena 3
    const t4 = 18.3;
    tl.to(pilha, { y: 980, rotation: 9, duration: 0.45, ease: "power2.in" }, t4 - 0.12);
    tl.to(grupo3, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in", stagger: 0.02 }, t4 - 0.1);
    tl.to(fugaCor.fora, { x: 640, y: 560, rotation: 40, duration: 0.4, ease: "power2.in" }, t4 - 0.1);
    som(t4 - 0.12, "whoosh", { v: 0.9 });

    // ===================== CENA 4 · 18,3–27,2 · quem somos =====================
    const tDupla = $("#dupla-titulo");
    const tit4 = titulo(tDupla, ["Dois envolvidos", "identificados."], "amarelo", conteudo4);
    gsap.set(tit4, centro(null, 270, 128, { scale: 0.4, opacity: 0, rotation: -5 }));
    tl.to(tit4, { scale: 1.08, opacity: 1, rotation: -1.5, duration: 0.34, ease: "back.out(2)" }, t4 + 0.15);
    som(t4 + 0.15, "pop", { v: 0.8 });

    const passes = ["mateus", "guilherme"].map((pessoa, i) => {
      const orig = $(`[data-pessoa="${pessoa}"]`);
      const casca = novo("div", "v-abs", conteudo4, { width: "505px", containerType: "inline-size", containerName: "cartao" });
      const c = copia(orig);
      casca.appendChild(c);
      const faces = $(mod("CardDupla", "faces"), c);
      gsap.set(faces, { rotationY: 180, transformPerspective: 1600 });
      const x = i ? 400 : 140;
      const r = i ? 2.5 : -2.5;
      gsap.set(casca, centro(null, x + (i ? 60 : -60), -560, { scale: 0.48, rotation: i ? 50 : -50 }));
      const tq = F.f09.inicio - 0.45 + i * 0.32;
      tl.to(casca, { y: 448, duration: 0.5, ease: "power2.in" }, tq);
      tl.to(casca, { x, rotation: r, duration: 0.5, ease: "power1.out" }, tq);
      tl.to(casca, { scaleY: 0.45, scaleX: 0.5, duration: 0.06, ease: "power2.out" }, tq + 0.5);
      tl.to(casca, { scaleY: 0.48, scaleX: 0.48, duration: 0.25, ease: "back.out(3)" }, tq + 0.56);
      som(tq + 0.5, "baque");
      tremer(tq + 0.5, 3.5);
      // vira para a frente no nome
      const tv = (i ? F.f11 : F.f10).inicio - 0.05;
      tl.to(faces, { rotationY: 0, duration: 0.5, ease: "back.out(1.3)" }, tv);
      tl.to(casca, { scale: 0.52, duration: 0.25, ease: "power2.out" }, tv);
      tl.to(casca, { scale: 0.48, duration: 0.3, ease: "power2.inOut" }, tv + 0.25);
      som(tv, "virada");
      return casca;
    });

    // Decalqzinho carimba
    const decalq = novo("div", "v-abs", conteudo4);
    const decalqArte = peca($("svg", adesivoOrig), 230, decalq);
    decalqArte.style.position = "relative";
    gsap.set(decalqArte, { filter: "drop-shadow(0px 6px 5px rgba(0,0,0,0.3))" });
    const carimbo2 = novo("div", "v-abs v-carimbo", conteudo4, {
      color: "#0a2ae7",
      opacity: 0,
      mixBlendMode: "multiply",
      filter: "url(#cg-impresso)",
    });
    carimbo2.innerHTML = '<span class="grande">Foi esses</span><span class="grande">dois.</span>';
    const tk = F.f12.fim + 0.55;
    gsap.set(decalq, centro(null, 720, 700, { rotation: 20 }));
    gsap.set(carimbo2, centro(null, 270, 470, { rotation: -9, scale: 2.8 }));
    tl.to(decalq, { x: 438, y: 636, rotation: -6, duration: 0.42, ease: "back.out(1.6)" }, tk - 1.2);
    som(tk - 1.2, "whoosh", { v: 0.6 });
    tl.to(decalq, { x: 285, y: 420, scale: 1.25, rotation: -16, duration: 0.42, ease: "power2.inOut" }, tk - 0.6);
    tl.to(decalqArte, { filter: "drop-shadow(0px 34px 18px rgba(0,0,0,0.28))", duration: 0.42 }, tk - 0.6);
    tl.to(decalq, { scale: 0.92, rotation: -8, duration: 0.12, ease: "power4.in" }, tk - 0.12);
    tl.to(decalqArte, { filter: "drop-shadow(0px 3px 2px rgba(0,0,0,0.4))", duration: 0.12, ease: "power4.in" }, tk - 0.12);
    tl.set(carimbo2, { opacity: 1, scale: 1.3 }, tk);
    som(tk, "carimbo");
    tremer(tk, 12);
    tl.to(decalq, { x: 452, y: 712, scale: 0.72, rotation: 9, duration: 0.45, ease: "power3.out" }, tk + 0.12);
    tl.to(decalqArte, { filter: "drop-shadow(0px 6px 5px rgba(0,0,0,0.3))", duration: 0.45 }, tk + 0.12);
    passes.forEach((p) => flutuar(p.firstElementChild, 2, 0.6));

    // ===================== CENA 5 · 27,2–33,5 · convite =====================
    const t5 = 27.0;
    const bordaSobe = serra(16, 8, 63);
    porQuadro.push(() => {
      const s = P.sobe;
      if (s <= 0) {
        final.style.visibility = "hidden";
        return;
      }
      final.style.visibility = "visible";
      if (s >= 1) {
        final.style.clipPath = "none";
        return;
      }
      const y = H + 30 - s * (H + 80);
      final.style.clipPath = `polygon(${bordaSobe.map(([x, o]) => `${x}px ${y + o}px`).join(",")}, ${W + 10}px ${H + 10}px, -10px ${H + 10}px)`;
    });
    tl.to(P, { sobe: 1, duration: 0.6, ease: "power3.inOut" }, t5);
    som(t5, "rasgo", { v: 0.7 });
    tl.set([conteudo4, papel], { visibility: "hidden" }, t5 + 0.65);

    const { caixa: comp2, c: c2 } = composicao(40);
    final.appendChild(comp2);
    const adesivo2 = $("[data-adesivo]", c2);
    const a2 = adesivo2.getBoundingClientRect(); // final está escondido, mas mede igual
    gsap.set(comp2, { y: 120 });
    tl.to(comp2, { y: 0, duration: 0.6, ease: "power3.out" }, t5 + 0.1);

    // adesivo que descola
    const solto = novo("div", "v-abs", final);
    const soltoArte = peca($("svg", adesivoOrig), a2.width, solto);
    soltoArte.style.position = "relative";
    gsap.set(soltoArte, { filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.3))" });
    gsap.set(solto, centro(null, a2.left + a2.width / 2, a2.top + a2.height / 2, { rotation: -6, opacity: 0 }));
    const td5 = F.f13.inicio + 0.25;
    tl.set(solto, { opacity: 1 }, td5);
    tl.set(adesivo2, { opacity: 0 }, td5);
    tl.to(solto, { rotation: -24, scale: 1.25, y: "-=26", x: "-=8", duration: 0.28, ease: "back.out(2)" }, td5);
    tl.to(soltoArte, { filter: "drop-shadow(0px 22px 14px rgba(0,0,0,0.45))", duration: 0.28 }, td5);
    som(td5, "descolar");
    const escalaF = 270 / a2.width;
    tl.to(solto, { x: 270, y: 245, scale: escalaF, rotation: 4, duration: 0.75, ease: "power3.inOut" }, td5 + 0.3);
    som(td5 + 0.3, "whoosh", { v: 0.7 });
    tl.to(comp2, { opacity: 0.22, scale: 0.9, duration: 0.6, ease: "power2.inOut" }, td5 + 0.35);
    flutuar(soltoArte, 2.5, 1.5);

    // marca
    const marca = copia($(mod("Cabecalho", "marca")));
    marca.classList.add("v-abs");
    marca.style.width = "max-content";
    final.appendChild(marca);
    const lettering = $("svg", marca);
    lettering.style.width = "290px";
    lettering.style.height = "auto";
    gsap.set(marca, centro(null, 270, 452, { scale: 0, rotation: -8 }));
    const tm = td5 + 1.0;
    tl.to(marca, { scale: 1, rotation: -2, duration: 0.36, ease: "back.out(2.2)" }, tm);
    som(tm, "pop", { v: 0.7 });

    // título final, uma linha por fala
    const tFim = titulo($("#contato-titulo"), ["Descola do igual.", "Cola na Decalq."], "lima", final);
    const [l14, l15] = $$(mod("TituloSecao", "linha"), tFim);
    gsap.set(tFim, centro(null, 270, 568, { scale: 1.26 }));
    gsap.set([l14, l15], { opacity: 0, scale: 0.5, rotation: -4, transformOrigin: "50% 50%" });
    tl.to(l14, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.4)" }, F.f14.inicio - 0.05);
    tl.to(l15, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.4)" }, F.f15.inicio - 0.05);
    som(F.f14.inicio - 0.05, "pop", { v: 0.8 });
    som(F.f15.inicio - 0.05, "pop", { v: 0.8 });

    // botão lima do Instagram
    const botao = copia($(`${mod("Botao", "botao")}[data-variante="principal"]`));
    botao.classList.add("v-abs");
    botao.removeAttribute("href");
    $(mod("Botao", "rotulo"), botao).textContent = "@webdecalq · Chama no direct";
    const icone = $(mod("Botao", "icone"), botao);
    if (icone) icone.outerHTML = ICONE_INSTA.replace("<svg", `<svg class="${icone.getAttribute("class")}"`);
    botao.style.whiteSpace = "nowrap";
    final.appendChild(botao);
    gsap.set(botao, centro(null, 270, 690, { scale: 0, rotation: 6 }));
    tl.to(botao, { scale: 1.12, rotation: -1.5, duration: 0.36, ease: "back.out(2.2)" }, tm + 0.18);
    som(tm + 0.18, "pop", { v: 0.6 });
    tl.to(botao, { scale: 1.2, duration: 0.16, ease: "power2.out" }, F.f15.fim + 0.15);
    tl.to(botao, { scale: 1.12, duration: 0.3, ease: "back.out(3)" }, F.f15.fim + 0.31);

    tl.set({}, {}, DURACAO);

    // imagens prontas antes de gravar
    await Promise.all(
      $$("img", palco).map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((ok) => (i.onload = i.onerror = ok)))),
    );

    function seek(t) {
      tl.time(Math.min(t, DURACAO), true);
      for (const f of porQuadro) f(t);
    }
    seek(0);
    return { seek, duracao: DURACAO, sons: sons.sort((a, b) => a.t - b.t), fps: 30 };
  }

  const pronto = montar();
  window.__diretor = {
    pronto,
    seek: (t) => pronto.then((d) => d.seek(t)),
  };
  pronto.then((d) => Object.assign(window.__diretor, d)).catch((e) => {
    window.__diretor.erro = String(e && e.stack ? e.stack : e);
  });
})();
