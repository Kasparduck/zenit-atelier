// LA PROVA DELLA SOSTA (19/11/2026, Franco: «perché si vedano tutte le scene in successione… se il blocco non ci va perché dà fastidio»).
// L'intermezzo del computer (index.html: rotta e acqua) copiato com'è; qui lo guida il dito: l'animazione va avanti e indietro con lo scorrimento.
// A (?modo=a): solo questo. B (?modo=b): in più la pagina si aggancia alla fine di ogni momento (scroll-snap del browser, mai uno scrollTo nostro)
// e la lancetta fa un giro per momento. Sul tocco la pagina non viene MAI riportata indietro da noi (guasto già trovato in Visioni).
(function () {
  const B = new URLSearchParams(location.search).get('modo') === 'b';
  if (B) document.documentElement.classList.add('sosta');
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attr, padre) => { const e = document.createElementNS(NS, tag); for (const k in attr) e.setAttribute(k, attr[k]); if (padre) padre.appendChild(e); return e; };
  const A = (el, tappe, durata, ritardo = 0, andamento = 'ease') => el.animate(tappe, { duration: durata, delay: ritardo, easing: andamento, fill: 'both' });
  // i sigilli: il cerchio e il meridiano sono il segno fisso di Meridiano; ogni orologio ci aggiunge il suo (provvisori, a filo)
  const FISSO = '<circle cx="60" cy="60" r="36" pathLength="1"/><path d="M60 9V111" pathLength="1"/><path d="M60 3l5 7-5 7-5-7z" pathLength="1"/>';
  const SIGILLI = { spada: '<path d="M46 84h28" pathLength="1"/><circle cx="60" cy="114" r="3.2" pathLength="1"/>', ali: '<path d="M27 50h66" pathLength="1"/><path d="M27 68h66" pathLength="1"/><path d="M37 50v18M83 50v18" pathLength="1"/>',
    piume: '<path d="M47 32q-15 28 0 56" pathLength="1"/><path d="M73 32q15 28 0 56" pathLength="1"/>',
    stella: '<path d="M60 41l4.2 14.8L79 60l-14.8 4.2L60 79l-4.2-14.8L41 60l14.8-4.2z" pathLength="1"/>',   // il Polo Sud: la rosa dei venti
    vela: '<path d="M44 39q10 16.5 0 33h32q10-16.5 0-33z" pathLength="1"/><path d="M37 86q5.75 4 11.5 0t11.5 0t11.5 0t11.5 0" pathLength="1"/>',
    luna: '<path d="M70 44a16 16 0 0 0 0 32a22 22 0 0 1 0-32z" pathLength="1"/>',   // Padova: la falce di luna che Galileo disegnò
    ruota: '<circle cx="60" cy="60" r="15" pathLength="1"/><path d="M45 60h30" pathLength="1"/><path d="M49.4 49.4l21.2 21.2M49.4 70.6l21.2-21.2" pathLength="1"/>',   // Brescia: la ruota a raggi
    ventaglio: '<path d="M42 72a18 18 0 0 1 36 0z" pathLength="1"/><path d="M60 72l-9-15.6M60 72l9-15.6M60 72L44.4 63M60 72l15.6-9" pathLength="1"/>' };   // Parigi: il ventaglio Art Déco   // Siviglia: la vela sul meridiano, che fa da albero, e l'onda
  let maschere = 0;
  // A1 · la rotta: ogni lettera arriva da un punto diverso fuori dallo schermo lungo una curva, crescendo, e si lascia dietro la sua rotta a puntini
  function rotta(parte) {
    const q = parte.querySelector('.quadro'), r = q.getBoundingClientRect(), W = r.width, H = r.height, svg = q.querySelector('.tracce');
    svg.replaceChildren(); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const defs = sv('defs', {}, svg), R = Math.hypot(W, H) * .56, N = 26, DUR = 2100, PASSO = 210;
    const L = [...q.querySelectorAll('.scritta span')].map(s => { const b = s.getBoundingClientRect(), sp = parseFloat(getComputedStyle(s).letterSpacing) || 0; return { s, x: b.left - r.left + (b.width - sp) / 2, y: b.top - r.top + b.height / 2, h: b.height }; });
    const n = L.length;
    L.forEach((l, i) => {
      const a = (-205 + i * (230 / Math.max(1, n - 1))) * Math.PI / 180;
      const S = [W / 2 + R * Math.cos(a), H / 2 + R * .82 * Math.sin(a)], E = [l.x, l.y], k = (i % 2 ? -1 : 1) * .34;
      const C = [(S[0] + E[0]) / 2 - (E[1] - S[1]) * k, (S[1] + E[1]) / 2 + (E[0] - S[0]) * k];
      const d = `M${S[0].toFixed(1)} ${S[1].toFixed(1)}Q${C[0].toFixed(1)} ${C[1].toFixed(1)} ${E[0].toFixed(1)} ${E[1].toFixed(1)}`;
      const id = 'rotta-' + (++maschere), maschera = sv('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs);
      const mp = sv('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': 10, pathLength: 1, 'stroke-dasharray': 1 }, maschera);
      const tr = sv('path', { d, class: 'rotta', mask: `url(#${id})` }, svg), lunga = tr.getTotalLength(), fl = [], fm = [];
      for (let j = 0; j <= N; j++) {
        const e = 1 - Math.pow(1 - j / N, 3), pt = tr.getPointAtLength(e * lunga);
        fl.push({ transform: `translate(${(pt.x - E[0]).toFixed(1)}px, ${(pt.y - E[1]).toFixed(1)}px) scale(${(.5 + .5 * e).toFixed(3)})`, opacity: Math.min(1, j / 4) });
        fm.push({ strokeDashoffset: 1 - e });
      }
      const quando = 250 + i * PASSO;
      A(l.s, fl, DUR, quando, 'linear'); A(mp, fm, DUR, quando, 'linear');
      A(tr, [{ opacity: .8 }, { opacity: 0 }], 700, quando + DUR + 100);
      const tacca = sv('path', { d: `M${E[0].toFixed(1)} ${(l.y + l.h * .6).toFixed(1)}v${(l.h * .14).toFixed(1)}`, class: 'tacca' }, svg);
      A(tacca, [{ opacity: 0 }, { opacity: .9, offset: .2 }, { opacity: .9, offset: .7 }, { opacity: 0 }], 1000, quando + DUR - 150);
    });
    A(q.querySelector('.rif'), [{ opacity: 1, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)' }], 800, 250 + (n - 1) * PASSO + DUR - 500, 'steps(18)');
  }
  // B1 · dal nero, come dall'acqua: il coperchio scorre, il sigillo sale sfocato e va a fuoco con due cerchi, una luce ne percorre i tratti, il nome affiora
  // Prima (Franco, 13/11): la scatola chiusa con le scritte stampate; le scritte diventano grigie, poi sempre più trasparenti fino a scomparire;
  // solo dopo il coperchio scorre. Il resto è la sequenza di prima, spostata di T.
  function acqua(parte) {
    const c = sel => parte.querySelector(sel), lettere = [...parte.querySelectorAll('.vivente .battesimo span')], T = 1300;
    // la rotella non gira mai a vuoto (Franco, 20/11/2026): per tutta l'apertura la confezione si avvicina piano, come una macchina da presa, e arriva alla misura approvata (mai oltre: sul telefono il coperchio aperto tocca il bordo)
    A(c('.cassa'), [{ transform: 'translate(-50%, -50%) scale(.955)' }, { transform: 'translate(-50%, -50%) scale(1)' }], 4500 + T + lettere.length * 100 + 900, 0, 'linear');
    A(c('.stampa'), [{ filter: 'grayscale(0) brightness(1)', opacity: 1 }, { filter: 'grayscale(1) brightness(.6)', opacity: 1, offset: .45 }, { filter: 'grayscale(1) brightness(.6)', opacity: 0 }], 1300, 100, 'ease-in-out');
    A(c('.coperchio'), [{ transform: 'translateX(0%)' }, { transform: 'translateX(27%)' }], 1500, 250 + T, 'cubic-bezier(.3,.05,.15,1)');
    A(c('.sigillo'), [{ opacity: 0, filter: 'blur(10px)', transform: 'translateY(22%) scale(.9)' }, { opacity: 1, filter: 'blur(0px)', transform: 'none' }], 1800, 1500 + T, 'cubic-bezier(.2,.7,.2,1)');
    parte.querySelectorAll('.onda').forEach((o, i) => A(o, [{ opacity: 0, transform: 'scale(.35)' }, { opacity: .55, transform: 'scale(.7)', offset: .2 }, { opacity: 0, transform: 'scale(2.3)' }], 1700, 2000 + T + i * 480, 'ease-out'));
    parte.querySelectorAll('.strato.luce *').forEach((t, i) => A(t, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 1100, 3500 + T + i * 110, 'ease-in-out'));
    A(c('.strato.luce'), [{ filter: 'drop-shadow(0 0 0px rgb(255 200 140 / 0))' }, { filter: 'drop-shadow(0 0 14px rgb(255 200 140 / .95))', offset: .6 }, { filter: 'drop-shadow(0 0 6px rgb(255 200 140 / .7))' }], 1900, 3500 + T);
    A(c('.alone'), [{ opacity: 0 }, { opacity: 1 }], 1500, 3700 + T);
    lettere.forEach((s, i) => A(s, [{ opacity: 0, filter: 'blur(8px)', transform: 'translateY(60%)' }, { opacity: 1, filter: 'blur(0px)', transform: 'none' }], 750, 4200 + T + i * 100, 'ease-out'));
    A(c('.vivente .rif'), [{ opacity: 0 }, { opacity: 1 }], 900, 4500 + T + lettere.length * 100);
  }

  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const misura = document.querySelector('.misura');
  const parti = [...document.querySelectorAll('.intermezzo')].flatMap(sez => {
    const nome = sez.dataset.nome, o = 'immagini/' + sez.dataset.orologio, [sh, sx, sy] = sez.dataset.scorcioCqw ? sez.dataset.scorcioCqw.split(' ') : sez.dataset.scorcio.split(' ').map((v, k) => (parseFloat(v) * [.564, .964, .564][k] - [0, .2, .07][k]).toFixed(2)), tratti = FISSO + (SIGILLI[sez.dataset.sigillo] || '');
    const lettere = [...nome.toUpperCase()].map(c => '<span aria-hidden="true">' + c + '</span>').join('');
    sez.innerHTML = `<div class="arrivo"><div class="quadro" style="--lettere: ${nome.length}"><svg class="tracce" aria-hidden="true"></svg><h2 class="scritta" aria-label="${nome}">${lettere}</h2><p class="rif">${sez.dataset.rif}</p></div><i class="aggancio"></i></div>
      <div class="confezione"><div class="quadro"><div class="cassa"><div class="pareti"><div class="dentro"><div class="scorcio" style="--sc-h: ${sh}cqw; --sc-x: ${sx}cqw; --sc-y: ${sy}cqw; aspect-ratio: ${sez.dataset.forma || '1024 / 1536'}"><img src="${o}.webp" alt="">${(sez.dataset.lancette || 'ore minuti').split(' ').map(l => `<img src="${o}-${l}.webp" alt="">`).join('')}<img src="${o}-perno.webp" alt=""></div><div class="bagliore"></div></div></div>
      <div class="coperchio"><div class="alone"></div>
      <div class="incisione stampa" aria-hidden="true"><svg class="segno" viewBox="0 0 120 120">${tratti}</svg><p class="battesimo">${nome.toUpperCase()}</p><p class="rif">${sez.dataset.rif}</p></div>
      <div class="incisione vivente"><div class="sigillo"><i class="onda"></i><i class="onda"></i><svg class="strato base" viewBox="0 0 120 120" aria-hidden="true">${tratti}</svg><svg class="strato luce" viewBox="0 0 120 120" aria-hidden="true">${tratti}</svg></div>
      <p class="battesimo" aria-label="${nome}">${lettere}</p><p class="rif">${sez.dataset.rif}</p></div></div></div></div><i class="aggancio"></i></div>`;
    return [...sez.querySelectorAll('.arrivo, .confezione')].map(el => ({ el, gioca: el.classList.contains('arrivo') ? rotta : acqua, pronta: false, q: -1, anims: [], dura: 0 }));
  });

  // il dito guida: q va da 0 (il quadro arriva) a 1 (il punto dell'aggancio, a 0,8 della strada in cui il quadro resta fermo)
  const lancetta = document.querySelector('.lancetta'), ago = lancetta.firstElementChild;
  let fontiPronte = false;
  function aggiorna() {
    const S = misura.offsetHeight || innerHeight;
    let ferma = null;
    for (const p of parti) {
      const r = p.el.getBoundingClientRect(), corsa = r.height - S;
      if (!p.pronta && fontiPronte && r.top < S * 1.5 && r.bottom > -S) {
        p.pronta = true; p.el.classList.add('vivo');
        if (!calmo) {
          p.gioca(p.el);
          p.anims = p.el.getAnimations({ subtree: true });
          p.dura = Math.max(0, ...p.anims.map(a => a.effect.getComputedTiming().endTime));
          p.anims.forEach(a => a.pause());
        }
      }
      const coda = p.el.classList.contains('arrivo') ? .19 : 0;   // la coda della scritta si compie mentre il quadro sale
      const q = Math.max(0, Math.min(1, (S * .35 - r.top) / (S * .35 + corsa + S * coda)));
      if (p.pronta && q !== p.q) { p.q = q; p.anims.forEach(a => { a.currentTime = q * p.dura; }); }
      if (r.top <= 1 && r.bottom >= S - 1) ferma = q;
    }
    if (B) {
      lancetta.classList.toggle('su', ferma !== null && ferma < .995);
      if (ferma !== null) ago.style.setProperty('--giro', (ferma * 360).toFixed(1) + 'deg');
    }
  }
  let chiesto = false;
  const chiedi = () => { if (!chiesto) { chiesto = true; requestAnimationFrame(() => { chiesto = false; aggiorna(); }); } };
  addEventListener('scroll', chiedi, { passive: true });
  addEventListener('resize', chiedi);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { fontiPronte = true; aggiorna(); });
  aggiorna();

  // la chiusa: quale prova era e il passaggio all'altra
  document.querySelector('.fine-dove').textContent = B ? 'Questa era la B: con la sosta.' : 'Questa era la A: senza sosta.';
  const altra = document.querySelector('.fine-altra');
  altra.textContent = B ? 'Prova la A, senza sosta →' : 'Prova la B, con la sosta →';
  altra.href = location.pathname + '?modo=' + (B ? 'a' : 'b');
  window.SOSTA = { parti, B, aggiorna };
})();
