/* L'INGLESE CON UN CLIC in Hora Vera, il motore (18/11/2026, passo 5.2 «Le lingue sui tre siti»). Un file solo per le tre pagine (ora-vera.html, che è
   la HOME, index.html «Visioni», atelier.html «L'atelier»): niente pagina doppia, l'italiano resta com'è. Il metodo è quello dello Studio Angelicata
   (progetti/esempi/avvocata-angelicata/sito/lingua.js) e della vetrina, adattato a un sito che è un film.

   LE PAROLE DI FRANCO, alla lettera (da spuntare sugli scatti):
   1. «vorrei che uno vedesse ad esempio la scritta deutsch o english già su un lato del sito»
   2. «e che cliccandovi sopra immediatamente il sito viene tradotto»
   3. le scritte stanno SOLO NELLA HOME, su un lato
   4. «scelgo la 1»: una linguetta in piedi sul bordo destro, a metà altezza
   5. «ENGLISH lo voglio contornato in amaranto metallico che si veda bene» (4 px, fondo scuro, con il mouse sopra l'interno d'argento)

   COME FUNZIONA. Il vocabolario sta in lingua-en.js (window.LINGUA_EN): «frasi» (la frase italiana esatta → la frase inglese), «qui» (la stessa parola
   che in un posto preciso si dice in un altro modo), «regole» (le scritte che il codice compone con ore, numeri o nomi dentro), «uguali» (nomi che
   restano come sono), «titoli» (il titolo della scheda), «prima» (i pezzi che la pagina poi spezza in righe: si traducono una volta sola, prima),
   «stile» (gli aggiustamenti di impaginazione che servono solo in inglese: valgono solo con <html lang="en">).
   I due file stanno in <head>: LA LINGUA SI DECIDE PRIMA DI DISEGNARE, e se è l'inglese la pagina resta coperta finché le scritte ferme non sono
   tradotte (un attimo di italiano non si vede mai). Subito prima del codice della pagina c'è <script>LINGUA.parti()</script>: una passata sui testi
   e sugli attributi che si leggono (aria-label, placeholder, title, alt); ogni scritta ricorda il suo italiano, così si torna indietro. Le scritte
   che il codice della pagina crea dopo (le città e le ore di Otto meridiani, i Quattro tempi, i commenti di L'atelier) le prende un osservatore: il
   codice continua a scrivere in italiano e non sa niente della lingua. Solo i pezzi che la pagina spezza in lettere o riscrive a ogni fotogramma
   (data-lingua="pagina": le voci della presentazione, il finale, i commenti con il filo) se li scrive lei, chiedendo la frase a LINGUA.t() e
   ascoltando l'evento «lingua».
   DOVE IL CAMBIO RICARICA. Nella HOME il clic cambia le scritte sul posto, senza ricaricare e senza toccare il filmato. Dove ci sono pezzi «prima»
   (L'atelier: i testi sono già spezzati in righe e salgono a tempo) un cambio di lingua RICARICA la pagina nella lingua nuova.
   LA SCELTA: ?lang=en (o ?lang=it) nell'indirizzo, se no quella ricordata (localStorage, chiave «webretold-lingua», la stessa della vetrina); tutto
   dentro try/catch, perché dentro la cornice della vetrina o aperta dal disco la memoria può mancare. Si ricorda solo la scelta fatta con la
   linguetta; la lingua data dall'indirizzo vale per quella pagina e viaggia nei collegamenti alle altre pagine del sito (?lang=en). La vetrina può
   anche cambiare lingua con un messaggio: postMessage({ lingua: 'en' }).
   ATTENZIONE NELLE PROVE: la memoria è una sola per tutte le pagine aperte dal disco: per avere di sicuro l'italiano, ?lang=it.
   LA LINGUETTA: la crea questo file solo dove lo script ha data-linguetta (la home). Sta sullo strato della presentazione: il contenuto che sale le
   passa sopra, come passa sopra il filmato e le voci; per cambiare lingua da più giù si torna con HOME. Dentro una cornice (la vetrina) non compare:
   ?linguetta=1 la mostra lo stesso, ?linguetta=0 la toglie sempre.
   IL CONTROLLO: window.LINGUA.mancanti() dice le scritte rimaste senza inglese; deve dare un elenco vuoto. Una frase nuova nella pagina = una riga
   nuova in lingua-en.js. In italiano, se nessuno ha scelto l'inglese, questo file non tocca niente della pagina (a parte la linguetta nella home). */
(() => {
  const IO = document.currentScript, V = window.LINGUA_EN || {}, CHIAVE = 'webretold-lingua', H = document.documentElement;
  const FRASI = new Map(Object.entries(V.frasi || {})), QUI = V.qui || [], REGOLE = V.regole || [], UGUALI = new Set(V.uguali || []), TITOLI = V.titoli || {};
  const ATTR = ['aria-label', 'placeholder', 'title', 'alt'], SALTA = 'script, style, noscript, [data-lingua], #lingua', FUORI = V.fuori || '', PRIMA = V.prima || '';
  const CHIAVI_QUI = new Set(); QUI.forEach(([, m]) => Object.keys(m).forEach(k => CHIAVI_QUI.add(k)));
  const q = new URLSearchParams(location.search), mancate = new Set(), TITOLO = document.title, LINGUETTA = !!(IO && IO.hasAttribute('data-linguetta'));
  let lingua = 'it', chiesta = null, linguetta = null, avviato = false, coperta = null;

  const netta = s => s.trim().replace(/\s+/g, ' ');
  const scritta = s => /[A-Za-zÀ-ÿ]/.test(s) || /\d[.,]\d/.test(s);       // c'è qualcosa da tradurre: lettere, o un numero con la virgola (in inglese ha il punto)
  // l'inglese di una scritta italiana (già «netta») nel posto dove sta; undefined se non c'è
  function inglese(s, el) {
    if (el && CHIAVI_QUI.has(s)) for (const [dove, m] of QUI) if (Object.prototype.hasOwnProperty.call(m, s) && el.closest(dove)) return m[s];
    if (FRASI.has(s)) return FRASI.get(s);
    for (const [re, fa] of REGOLE) { const m = re.exec(s); if (m) { const r = fa(m); if (r !== undefined) return r; } }
    return undefined;
  }
  const veste = (v, en) => { const s = v.trim(), i = v.indexOf(s); return v.slice(0, i) + en + v.slice(i + s.length); };   // gli spazi intorno restano quelli
  // una scritta (v = com'è adesso, it = l'italiano che ricordava): dice l'italiano da ricordare e come deve essere adesso
  function volta(v, it, el) {
    let en;
    if (it !== undefined && (en = inglese(netta(it), el)) !== undefined && v === veste(it, en)) { /* è l'inglese scritto da me: l'italiano lo ricordo già */ }
    else if ((en = inglese(netta(v), el)) !== undefined) it = v;       // è italiano che conosco (nuovo, o cambiato dal codice della pagina)
    else return [undefined, v];                                         // non la conosco: resta com'è
    return [it, lingua === 'en' ? veste(it, en) : it];
  }
  // (le ore e le percentuali che il codice riscrive di continuo non hanno niente da tradurre: si lasciano subito)
  function testo(n) { const v = n.nodeValue; if (!scritta(v)) return; const [it, come] = volta(v, n._it, n.parentElement); n._it = it; if (v !== come) n.nodeValue = come; }
  function attributi(n) { for (const a of ATTR) { const v = n.getAttribute(a); if (!v) continue; const m = n._ita || (n._ita = {}), [it, come] = volta(v, m[a], n); m[a] = it; if (v !== come) n.setAttribute(a, come); } }
  const giro = radice => document.createTreeWalker(radice, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: n => n.nodeType === 1 && n.matches(SALTA) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  function passa(radice) {
    if (radice.nodeType === 3) { const p = radice.parentElement; if (p && !p.closest(SALTA)) testo(radice); return; }
    if (radice.nodeType !== 1 || radice.closest(SALTA)) return;
    const g = giro(radice); let n = radice;
    do { if (n.nodeType === 3) testo(n); else attributi(n); } while ((n = g.nextNode()));
  }
  const daTradurre = (s, el) => /[A-Za-zÀ-ÿ]{2}/.test(s) && !UGUALI.has(s) && !(V.uguale && V.uguale(s)) && inglese(s, el) === undefined;
  // I PEZZI «PRIMA»: il codice della pagina li spezza in parole e in righe e poi li rifà da una copia (L'atelier). Si traducono una volta sola, qui,
  // prima che il codice parta, e da lì non si toccano più; ciò che resta senza inglese si segna subito, perché dopo non si riconosce più.
  function zonePrima() {
    if (!PRIMA) return;
    document.querySelectorAll(PRIMA).forEach(z => {
      if (z.closest(SALTA)) return;
      passa(z);
      const g = giro(z); let n = z;
      do { if (n.nodeType === 3) { const s = netta(n.nodeValue); if (n._it === undefined && daTradurre(s, n.parentElement)) mancate.add(s); }
        else for (const a of ATTR) { const v = n.getAttribute(a); if (v && !(n._ita && n._ita[a] !== undefined) && daTradurre(netta(v), n)) mancate.add(netta(v)); } } while ((n = g.nextNode()));
      z.setAttribute('data-lingua', 'prima');
    });
  }
  const ricarica = () => !!(PRIMA && document.querySelector(PRIMA));

  // i collegamenti alle altre pagine del sito portano con sé la lingua: ?lang=en in inglese; in italiano restano come sono scritti
  // (solo se l'italiano l'ha chiesto l'indirizzo con ?lang=it lo portano anche loro, se no la pagina dopo seguirebbe la scelta ricordata)
  const PAGINA = /^([\w-]+\.html)(\?[^#]*)?(#.*)?$/;
  const porta = () => lingua === 'en' ? 'en' : chiesta === 'it' ? 'it' : null;
  function collega(a) {
    const h = a.getAttribute('href'), m = h && PAGINA.exec(h); if (!m) return;
    const p = new URLSearchParams(m[2] || ''); if (porta()) p.set('lang', porta()); else p.delete('lang');
    const s = p.toString(), nuovo = m[1] + (s ? '?' + s : '') + (m[3] || ''); if (nuovo !== h) a.setAttribute('href', nuovo);
  }
  const collegaTutti = () => document.querySelectorAll('a[href]').forEach(collega);
  const scriviLinguetta = () => { if (!linguetta) return; const en = lingua === 'en'; linguetta.textContent = en ? 'Italiano' : 'English'; linguetta.lang = en ? 'it' : 'en'; linguetta.setAttribute('aria-label', en ? 'Leggi il sito in italiano' : 'Read this site in English'); };

  // ricorda = true solo quando la sceglie chi guarda (la linguetta): la lingua data dall'indirizzo o dalla vetrina vale per quella pagina e non si ricorda
  function metti(l, ricorda) {
    l = l === 'en' ? 'en' : 'it';
    if (ricorda) { try { localStorage.setItem(CHIAVE, l); } catch (e) {} }
    if (!avviato) { lingua = l; return; }
    if (l !== lingua && ricarica()) {   // qui i testi sono già spezzati in righe e si muovono: la pagina si riapre nella lingua nuova
      try { const u = new URL(location.href); u.searchParams.set('lang', l); location.replace(u.href); } catch (e) { location.search = '?lang=' + l; }
      return;
    }
    lingua = l;
    H.lang = lingua;
    document.title = (lingua === 'en' && TITOLI[TITOLO]) || TITOLO;
    passa(document.body);
    osserva();
    collegaTutti();
    scriviLinguetta();
    try { const u = new URL(location.href); if (u.searchParams.has('lang')) { if (porta()) u.searchParams.set('lang', porta()); else u.searchParams.delete('lang'); if (u.href !== location.href) history.replaceState(history.state, '', u.href); } } catch (e) {}
    document.dispatchEvent(new CustomEvent('lingua', { detail: lingua }));   // i pezzi spezzati in lettere se li riscrive la pagina
  }
  // la frase per i pezzi che la pagina scrive da sé: in inglese se la lingua è l'inglese e la frase c'è, se no com'è
  function t(it) { const en = inglese(netta(it)); if (en === undefined) { mancate.add(netta(it)); return it; } return lingua === 'en' ? en : it; }

  const osservatore = new MutationObserver(cambi => {
    if (lingua !== 'en') return;
    for (const c of cambi) {
      if (c.type === 'characterData') passa(c.target);
      else if (c.type === 'attributes') { if (!c.target.closest(SALTA)) attributi(c.target); }
      else c.addedNodes.forEach(n => { passa(n); if (n.nodeType === 1) { if (n.matches('a[href]')) collega(n); n.querySelectorAll('a[href]').forEach(collega); } });
    }
  });
  // l'osservatore lavora solo finché la lingua è l'inglese: in italiano è staccato, e la pagina gira esattamente come prima
  let osservo = false;
  function osserva() {
    const serve = lingua === 'en';
    if (serve && !osservo) osservatore.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTR });
    else if (!serve && osservo) osservatore.disconnect();
    osservo = serve;
  }
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href]'); if (a) collega(a); }, true);
  addEventListener('message', e => { const d = e.data; if (d && (d.lingua === 'en' || d.lingua === 'it') && d.lingua !== lingua) metti(d.lingua); });   // la vetrina cambia lingua

  // le scritte rimaste senza inglese, testi e attributi (per il controllo: deve tornare un elenco vuoto)
  function mancanti() {
    const fuori = new Set(mancate), conta = (v, el) => { const s = netta(v); if (daTradurre(s, el)) fuori.add(s); };
    const g = giro(document.body); let n;
    while ((n = g.nextNode())) {
      if (n.nodeType === 3) { if (n._it === undefined && !(FUORI && n.parentElement.closest(FUORI))) conta(n.nodeValue, n.parentElement); }
      else if (!(FUORI && n.closest(FUORI))) for (const a of ATTR) { const v = n.getAttribute(a); if (v && !(n._ita && n._ita[a] !== undefined)) conta(v, n); }
    }
    if (!TITOLI[TITOLO]) fuori.add('titolo: ' + TITOLO);
    return [...fuori];
  }

  /* LA LINGUETTA (solo nella home). Lo stile è quello della vetrina (#lingua): in piedi sul bordo destro, a metà altezza, 4 px di amaranto con i
     riflessi del metallo, fondo scuro, con il mouse sopra l'interno d'argento; niente bagliore. C'è dall'inizio, ferma. Sta sullo strato della
     presentazione (sopra il filmato e le voci, sotto il contenuto che sale): più giù non copre né gli orologi né i Quattro tempi né il finale. */
  function faLinguetta() {
    const inCornice = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
    if (!(q.get('linguetta') === '1' || (!inCornice && q.get('linguetta') !== '0'))) return;
    const AMARANTO = 'linear-gradient(172deg, #8a1535, #c2284f 16%, #f3a1b3 33%, #c2284f 50%, #8a1535 68%, #d85173 85%, #8a1535)';
    const stile = document.createElement('style');
    // due strati: sopra l'interno (scuro, o d'argento con il mouse sopra), sotto l'amaranto che si vede solo nel bordo; il colore di fondo pieno è lo stesso scuro
    stile.textContent = '#lingua{position:fixed;z-index:6;right:0;top:50%;transform:translateY(-50%);margin:0;cursor:pointer;writing-mode:vertical-rl;padding:24px 12px 24px 13px;border:4px solid transparent;border-right:0;border-radius:11px 0 0 11px;color:#fff;font:600 14px/1 Manrope,"Segoe UI",sans-serif;letter-spacing:.3em;text-transform:uppercase;white-space:nowrap;background-color:#090d13;background-image:linear-gradient(#090d13,#090d13),' + AMARANTO + ';background-origin:padding-box,border-box;background-clip:padding-box,border-box;box-shadow:0 0 22px rgb(0 0 0 / .55);transition:color .3s}'
      + '@media (hover:hover){#lingua:hover{background-image:linear-gradient(90deg,#80858a,#d8dce0 22%,#fbfcfd 50%,#ced2d6 78%,#7c8186),' + AMARANTO + ';color:#141210}}'
      + '@media (max-width:1023px){#lingua{font-size:12px;padding:16px 6px 16px 7px}}'      // schermi stretti: linguetta più stretta (29 px)
      + '@media (max-width:720px){#lingua{top:70%}}'                                        // sul telefono a metà altezza c'è la mano del disegno: sta più giù, tra la mano e la scritta grande
      + '@media print{#lingua{display:none}}';
    document.head.appendChild(stile);
    linguetta = document.body.appendChild(Object.assign(document.createElement('button'), { id: 'lingua', type: 'button' }));
    scriviLinguetta();
    linguetta.addEventListener('click', () => { chiesta = null; metti(lingua === 'en' ? 'it' : 'en', true); });
  }

  // LA PARTENZA: la chiama la pagina subito prima del suo codice (di riserva parte a pagina letta). In inglese traduce le scritte ferme e scopre la pagina.
  function parti() {
    if (avviato || !document.body) return; avviato = true;
    try {
      if (lingua === 'en') { zonePrima(); passa(document.body); collegaTutti(); }
      else if (chiesta === 'it') collegaTutti();                          // italiano chiesto dall'indirizzo: lo portano anche i collegamenti
      osserva();
      if (LINGUETTA) faLinguetta();
    } finally { if (coperta) { coperta.remove(); coperta = null; } }
  }
  window.LINGUA = { metti, adesso: () => lingua, mancanti, t, parti };
  // gli aggiustamenti di impaginazione solo per l'inglese stanno nel vocabolario («stile»): le sue regole cominciano con html[lang="en"], in italiano non valgono
  if (V.stile) document.head.appendChild(Object.assign(document.createElement('style'), { textContent: V.stile }));

  // la lingua con cui si apre, decisa PRIMA di disegnare: l'indirizzo comanda (e non si ricorda), se no la scelta ricordata
  let scelta = q.get('lang');
  if (scelta === 'en' || scelta === 'it') chiesta = scelta;
  else { scelta = null; try { scelta = localStorage.getItem(CHIAVE); } catch (e) {} }
  if (scelta === 'en') {
    lingua = 'en'; H.lang = 'en'; if (TITOLI[TITOLO]) document.title = TITOLI[TITOLO];
    coperta = document.createElement('style'); coperta.textContent = 'body{visibility:hidden}'; document.head.appendChild(coperta);   // finché le scritte ferme non sono in inglese
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', parti); else parti();
})();
