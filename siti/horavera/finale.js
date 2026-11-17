/* IL FINALE di HORA VERA — il testo sul tempo che si compone (16/11/2026).
   Il testo è la versione B scelta da Franco («ok, bella»), dalla voce «la mappa delle pulsar», scritta con il metodo GARIMPO
   (progetti/vetrina/orologi/voce/finale-testi.md e finale-canone.md). NON si cambia una parola senza ripassare da strumenti/collaudo-testo.js e da lui.

   COME SI COMPONE (Franco, 16/11, alla lettera) — spuntata sugli scatti:
   [x] 1. «Mettiamola in fondo alla pagina che stiamo facendo.»
   [x] 2. «Il testo deve comporsi con frasi orfane che trovano pian piano la loro collocazione muovendosi»
   [x] 3. «(vedi tu le traiettorie migliori)»
   [x] 4. «Il testo è bianco.»
   [x] 5. «Tutte le parole che rientrano nella sfera semantica dell'argomento tempo in senso più stretto sono grigio.»
   [x] 6. «Testo grande e non piccolo.»
   Prima (15/11 notte, scheda della vetrina): «frasi e parole per un attimo naufraghe (non sbagliate) che trovano poi la loro collocazione»;
   una alla volta, un solo movimento lento, non in ordine di lettura; alla fine il testo è composto e fermo.

   LE TRAIETTORIE (Franco, 16/11 sera, dopo aver visto la prima versione, che le teneva appena storte e le faceva viaggiare in curva) — alla lettera:
   [x] 7. «Le parole del testo che si muovono alla fine per trovare la loro giusta collocazione nel testo non devono essere posizionate
          obliquamente, ovvero inclinate.»
   [x] 8. «Sono sempre dritte, non importa in quale posizione tu le metta.»
   [x] 9. «Possono fare due movimenti solo sostanzialmente: muoversi in orizzontale nei due versi e muoversi in verticale nei due versi.»
   Quindi: NESSUNA rotazione, mai; e ogni frase fa due tratti staccati, mai uno obliquo. Lo misura `node strumenti/controlla-dritte.js` (vedi in fondo).

   SCELTE MIE, da far confermare a Franco:
   - le frasi orfane sono le quindici righe;
   - all'inizio stanno sparse per lo schermo a mezza luce, dritte, ognuna NELLA RIGA DI UN'ALTRA (una riga è vuota: è il posto della prima che parte, e ognuna partendo libera il posto alla successiva; così non si accavallano mai da ferme e si
     leggono: la prima versione le spargeva a caso e a metà strada erano illeggibili), spinte verso il bordo sinistro o destro, fuori dal loro
     ordine; mentre aspettano galleggiano appena (su e giù di cinque punti);
   - partono UNA ALLA VOLTA, ogni 0,9 secondi, non nell'ordine di lettura; ognuna fa DUE TRATTI: prima sale o scende, dritta, fino all'altezza della
     sua riga; si ferma un attimo; poi scivola di lato lungo la sua riga (che è vuota) fino al suo posto, e lì si accende. In tutto 4,2 secondi;
     la prima parte dopo 1,8 secondi, l'ultima (la chiusa) approda a 18,3;
   - va DA SOLO quando la sezione è nello schermo; uscendo del tutto e rientrando riparte da capo;
   - le parole in grigio: ore, orologio, ritmo, rallentato, rallentano, tempo.

   Si innesta con tre righe: <link rel="stylesheet" href="finale.css">, <section id="finale" class="finale"></section>, <script src="finale.js"></script>.
   Per le prove: ?vai=finale porta lì; &fermo=6000 ferma tutto a 6 secondi e mette «posato» sul body; FINALE.vaiA(ms) fa lo stesso da codice.
   Dopo OGNI modifica al viaggio (dritte, un movimento alla volta; deve dire OK):
     node strumenti/controlla-dritte.js "progetti/vetrina/orologi/sito/ora-vera.html?vai=finale&fermo=0" ".fi-y" "FINALE.vaiA" 19000 */
(() => {
  const radice = document.getElementById('finale');
  if (!radice) return;
  // {così} = una parola del tempo in senso stretto: va in grigio
  const TESTO = [
    ['Tu che hai trovato la sonda, là fuori,', 'non hai le nostre parole.', 'E le nostre {ore} sono i giri del nostro pianeta:', 'tu vieni da un altro.'],
    ['Un {orologio} in comune però c’è.', 'È l’atomo più semplice, quello di cui è fatto quasi tutto:', 'ha un {ritmo} suo, lo stesso da te come da noi.', 'Sulla lastra è disegnato: è la nostra unità di misura.'],
    ['Con quella abbiamo scritto il {ritmo} di quattordici stelle morte,', 'che girano su se stesse e a ogni giro mandano un lampo.', 'Non ce ne sono due uguali.', 'Risali le quattordici righe: dove si incontrano, lì siamo noi.'],
    ['Poi conta di quanto hanno {rallentato}.', '{Rallentano} tutte, di pochissimo.', 'Saprai quanto {tempo} fa eravamo lì.'] ];
  const ORDINE = [1, 5, 11, 3, 9, 14, 2, 7, 12, 6, 4, 10, 13, 8, 15];   // in che ordine approdano le righe (non è l'ordine di lettura); l'ultima è la chiusa
  // (da quale riga parte ognuna non è una tabella: lo decide ORDINE, vedi «DA DOVE PARTE» in parti)
  const PARTE = 1800, OGNI = 880, VIAGGIO = 4200;                       // millisecondi: quando parte la prima, ogni quanto ne parte una, quanto dura un viaggio (due tratti)
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- la costruzione: le righe stanno già al loro posto, nell'ordine di lettura (così le legge anche chi non vede il movimento) ----------
  radice.setAttribute('aria-label', 'Il messaggio');
  radice.textContent = '';
  const blocco = document.createElement('div'); blocco.className = 'fi-testo'; radice.appendChild(blocco);
  const righe = [];
  for (const strofa of TESTO) { const p = document.createElement('p'); blocco.appendChild(p);
    for (const r of strofa) { const riga = document.createElement('span'), x = document.createElement('span'), y = document.createElement('span');
      riga.className = 'fi-riga'; x.className = 'fi-x'; y.className = 'fi-y';
      y.innerHTML = r.replace(/\{([^}]+)\}/g, '<i class="fi-t">$1</i>');
      x.appendChild(y); riga.appendChild(x); p.appendChild(riga); righe.push({ riga, x, y }); } }
  const DURATA = PARTE + (righe.length - 1) * OGNI + VIAGGIO;

  // ---------- il viaggio ----------
  // SEMPRE DRITTE, UN MOVIMENTO ALLA VOLTA (Franco, 16/11): nessuna rotazione, e due tratti staccati. Il guscio di dentro (.fi-y) porta in altezza nel
  // PRIMO tratto (dalla riga dove la frase aspetta fino alla sua); una breve sosta; il guscio di fuori (.fi-x) porta di lato nel SECONDO, lungo la sua
  // riga, che a quel punto è vuota. Quanta parte del viaggio va all'uno e all'altro dipende da quanta strada c'è (tra un terzo e due terzi).
  // La riga porta la luce e, mentre aspetta, un galleggiare di pochi punti (solo su e giù) che finisce a zero nell'istante in cui parte.
  // Si muovono solo transform e opacity. `tappe` è l'unico posto dove si scrive il viaggio: la guardia qui sotto la controlla a ogni avvio.
  const SOSTA = .06, MORBIDO = 'cubic-bezier(.45, 0, .2, 1)';           // la sosta tra i due tratti (parte del viaggio: un quarto di secondo) e l'andamento di ogni tratto
  function tappe(dx, dy) {
    const strada = Math.abs(dx) + Math.abs(dy), q = strada ? Math.min(.66, Math.max(.34, Math.abs(dy) / strada)) : .5, a = q - SOSTA / 2, b = q + SOSTA / 2;
    const su = `translateY(${dy.toFixed(1)}px)`, lato = `translateX(${dx.toFixed(1)}px)`;
    return { a, b,
      y: [{ transform: su, easing: MORBIDO }, { transform: 'translateY(0px)', offset: a }, { transform: 'translateY(0px)' }],
      x: [{ transform: lato }, { transform: lato, offset: b, easing: MORBIDO }, { transform: 'translateX(0px)' }] };
  }
  // LA GUARDIA (lezione del 16/11): se nel viaggio torna una rotazione, o i due tratti si toccano, la pagina lancia un errore (foto-pagina.js la ferma)
  { const t = tappe(300, -200), scritto = JSON.stringify([t.x, t.y]);
    if (/rotate|skew|matrix|scale/.test(scritto) || !(t.a < t.b) || t.x[0].transform !== t.x[1].transform || t.y[1].transform !== t.y[2].transform)
      setTimeout(() => { throw new Error('FINALE: le frasi devono restare dritte e muoversi solo in orizzontale o in verticale, un tratto alla volta'); }); }
  const caso = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  let anim = [], partito = false, fermo = false;
  function parti() {
    if (partito || calmo) return; partito = true; radice.classList.remove('fi-composto');
    const R = radice.getBoundingClientRect(), W = R.width, H = Math.min(R.height, innerHeight), rnd = caso(7);
    // dove deve arrivare ogni riga (il centro del suo riquadro), misurato prima di muovere niente
    const posto = righe.map(o => { const q = o.x.getBoundingClientRect(); return { x: q.left - R.left + q.width / 2, y: q.top - R.top + q.height / 2, w: q.width, h: q.height }; });
    const n = righe.length, ultima = posto[n - 1], cima = posto[0], interlinea = ultima.y - posto[n - 2].y;
    // DA DOVE PARTE: ogni frase sta nella riga di quella che approda subito dopo di lei, così partendo le libera il posto e due frasi non stanno
    // mai ferme una sull'altra (la versione con le fasce a caso lasciava per secondi le frasi in attesa sopra quelle già arrivate). La riga della
    // prima che approda è vuota fin dall'inizio; l'ultima, la chiusa, aspetta in una riga in più: sotto il testo se c'è posto, se no sopra.
    const yInPiu = H - (ultima.y + ultima.h / 2) >= cima.y - cima.h / 2 ? ultima.y + interlinea : cima.y - interlinea;
    righe.forEach((o, i) => {
      const b = { width: posto[i].w, height: posto[i].h }, fx = posto[i].x, fy = posto[i].y, k = ORDINE.indexOf(i + 1);   // dove deve arrivare (il suo centro)
      const mezzo = b.width / 2 + 14, u = rnd() < .5 ? rnd() * .3 : 1 - rnd() * .3;                                    // verso un bordo, o l'altro
      const sx = W > 2 * mezzo ? mezzo + (W - 2 * mezzo) * u : W / 2, sy = k < n - 1 ? posto[ORDINE[k + 1] - 1].y : yInPiu;         // da dove parte: tutta dentro lo schermo
      rnd(); rnd();   // (i due numeri a caso che prima davano l'inclinazione: si consumano lo stesso, così le frasi aspettano dove Franco le ha già viste)
      const dx = sx - fx, dy = sy - fy, quando = PARTE + k * OGNI, fine = quando + VIAGGIO, su = (i % 2 ? 1 : -1) * 5;
      const t = tappe(dx, dy), viaggio = { duration: VIAGGIO, delay: quando, easing: 'linear', fill: 'both' };
      anim.push(
        o.x.animate(t.x, viaggio),
        o.y.animate(t.y, viaggio),
        o.riga.animate([{ opacity: 0 }, { opacity: .5, offset: 1400 / fine }, { opacity: .5, offset: (quando + VIAGGIO * .68) / fine }, { opacity: 1 }], { duration: fine, easing: 'linear', fill: 'both' }),
        o.riga.animate([{ transform: 'translateY(0px)' }, { transform: `translateY(${su}px)`, offset: .3 }, { transform: `translateY(${-su}px)`, offset: .72 }, { transform: 'translateY(0px)' }], { duration: quando, easing: 'ease-in-out' }));
    });
    Promise.all(anim.map(a => a.finished)).then(() => { if (partito) radice.classList.add('fi-composto'); }).catch(() => {});
  }
  function azzera() { const vecchie = anim; anim = []; partito = false; vecchie.forEach(a => a.cancel()); radice.classList.remove('fi-composto'); }

  // ---------- va da solo: parte quando metà della sezione è nello schermo; uscita del tutto, torna alle frasi sparse e rientrando riparte ----------
  if (calmo) radice.classList.add('fi-composto');
  else new IntersectionObserver(voci => { for (const v of voci) { if (fermo) return;
    if (v.isIntersecting && v.intersectionRatio >= .5) parti(); else if (!v.isIntersecting) azzera(); } }, { threshold: [0, .5] }).observe(radice);

  // ---------- per le prove ----------
  const FINALE = window.FINALE = { pronta: true, durata: DURATA,
    vaiA(ms) { fermo = true; if (!partito) parti();
      anim.forEach(a => { a.pause(); a.currentTime = Math.max(0, Math.min(ms, a.effect.getComputedTiming().endTime)); });
      radice.classList.toggle('fi-composto', ms >= DURATA);
      return new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok))); } };
  const Q = new URLSearchParams(location.search);
  if (Q.get('vai') === 'finale') {
    const carica = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }));
    Promise.all([carica, document.fonts ? document.fonts.ready : 0]).then(() => setTimeout(() => {
      document.body.classList.add('scorre');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        scrollTo(0, radice.getBoundingClientRect().top + scrollY);
        const posato = () => requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('posato')));
        if (Q.has('fermo')) FINALE.vaiA(+Q.get('fermo') || 0).then(posato); else posato();
      }));
    }, 400));
  }
})();
