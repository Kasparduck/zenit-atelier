/* L'INGLESE CON UN CLIC, il motore (17/11/2026, passo 5.2 «Le lingue sui tre siti»). Un file solo per le tre pagine dello Studio Angelicata:
   niente pagina doppia, l'italiano resta com'è. Il metodo è quello provato lo stesso giorno sulla vetrina (LINGUA in progetti/vetrina/telescopio/index.html).

   LE PAROLE DI FRANCO, alla lettera (da spuntare sugli scatti):
   1. «vorrei che uno vedesse ad esempio la scritta deutsch o english già su un lato del sito»
   2. «e che cliccandovi sopra immediatamente il sito viene tradotto»
   3. le scritte stanno SOLO NELLA HOME, su un lato
   4. «scelgo la 1»: una linguetta in piedi sul bordo destro, a metà altezza
   5. «ENGLISH lo voglio contornato in amaranto metallico che si veda bene» (4 px, fondo scuro, con il mouse sopra l'interno d'argento)

   COME FUNZIONA. Il vocabolario sta in lingua-en.js (window.LINGUA_EN): «frasi» (la frase italiana esatta → la frase inglese), «qui» (la stessa parola
   che in un posto preciso si dice in un altro modo), «regole» (le scritte che il codice compone con numeri, date o nomi dentro: un'espressione e una
   funzione), «uguali» (nomi, indirizzi: restano come sono), «titoli» (il titolo della scheda e la descrizione). Una passata sui testi e sugli attributi
   che si leggono (aria-label, placeholder, title, alt): ogni scritta ricorda il suo italiano, così si torna indietro. Le scritte che il codice della
   pagina crea dopo (le risposte, il calcolo, la mappa, gli avvisi) le prende un osservatore: il codice della pagina continua a scrivere in italiano e
   non sa niente della lingua. Solo i pezzi che la pagina spezza in parole o in lettere (data-lingua="pagina") se li riscrive lei, chiedendo la frase
   a LINGUA.t() e ascoltando l'evento «lingua».
   LA SCELTA: ?lang=en (o ?lang=it) nell'indirizzo, se no quella ricordata (localStorage, chiave «webretold-lingua», la stessa della vetrina); tutto
   dentro try/catch, perché dentro la cornice della vetrina o aperta dal disco la memoria può mancare. Si ricorda solo la scelta fatta con la
   linguetta: la lingua data dall'indirizzo vale per quella pagina e viaggia nei collegamenti alle altre pagine del sito (?lang=en), senza
   toccare la memoria. La vetrina può anche cambiare lingua senza ricaricare, con un messaggio: postMessage({ lingua: 'en' }).
   ATTENZIONE NELLE PROVE: la memoria è una sola per tutte le pagine aperte dal disco (e per tutto il sito online): se in quel Chrome qualcuno ha
   scelto l'inglese nella vetrina, anche questo sito si apre in inglese. Per avere di sicuro l'italiano: ?lang=it.
   LA LINGUETTA: la crea questo file solo dove lo script ha data-linguetta (la home). Dentro una cornice (la vetrina) non compare, perché lì la
   lingua la comanda la vetrina: ?linguetta=1 la mostra lo stesso, ?linguetta=0 la toglie sempre.
   IL CONTROLLO: window.LINGUA.mancanti() dice le scritte rimaste senza inglese; deve dare un elenco vuoto. Una frase nuova nella pagina = una riga
   nuova in lingua-en.js. In italiano, se nessuno ha scelto l'inglese, questo file non tocca niente della pagina (a parte la linguetta nella home). */
(() => {
  const IO = document.currentScript, V = window.LINGUA_EN || {}, CHIAVE = 'webretold-lingua';
  const FRASI = new Map(Object.entries(V.frasi || {})), QUI = V.qui || [], REGOLE = V.regole || [], UGUALI = new Set(V.uguali || []), TITOLI = V.titoli || {};
  const ATTR = ['aria-label', 'placeholder', 'title', 'alt'], SALTA = 'script, style, noscript, [data-lingua], #lingua', FUORI = V.fuori || '';
  const CHIAVI_QUI = new Set(); QUI.forEach(([, m]) => Object.keys(m).forEach(k => CHIAVI_QUI.add(k)));
  const q = new URLSearchParams(location.search), mancate = new Set();
  const TITOLO = document.title, DESCR = document.querySelector('meta[name="description"]'), DESCR_IT = DESCR ? DESCR.getAttribute('content') : '';
  let lingua = 'it', linguetta = null, menuLingua = null;

  const netta = s => s.trim().replace(/\s+/g, ' ');
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
  function testo(n) { const v = n.nodeValue; if (!v.trim()) return; const [it, come] = volta(v, n._it, n.parentElement); n._it = it; if (v !== come) n.nodeValue = come; }
  function attributi(n) { for (const a of ATTR) { const v = n.getAttribute(a); if (!v) continue; const m = n._ita || (n._ita = {}), [it, come] = volta(v, m[a], n); m[a] = it; if (v !== come) n.setAttribute(a, come); } }
  const giro = radice => document.createTreeWalker(radice, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: n => n.nodeType === 1 && n.matches(SALTA) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  function passa(radice) {
    if (radice.nodeType === 3) { const p = radice.parentElement; if (p && !p.closest(SALTA)) testo(radice); return; }
    if (radice.nodeType !== 1 || radice.closest(SALTA)) return;
    const g = giro(radice); let n = radice;
    do { if (n.nodeType === 3) testo(n); else attributi(n); } while ((n = g.nextNode()));
  }
  // i collegamenti alle altre pagine del sito portano con sé la lingua: ?lang=en in inglese; in italiano restano come sono scritti
  // (solo se l'italiano l'ha chiesto l'indirizzo con ?lang=it lo portano anche loro, se no la pagina dopo seguirebbe la scelta ricordata)
  const PAGINA = /^([\w-]+\.html)(\?[^#]*)?(#.*)?$/;
  let chiesta = null;                                           // la lingua chiesta dall'indirizzo, finché chi guarda non sceglie con la linguetta
  const porta = () => lingua === 'en' ? 'en' : chiesta === 'it' ? 'it' : null;
  function collega(a) {
    const h = a.getAttribute('href'), m = h && PAGINA.exec(h); if (!m) return;
    const p = new URLSearchParams(m[2] || ''); if (porta()) p.set('lang', porta()); else p.delete('lang');
    const s = p.toString(), nuovo = m[1] + (s ? '?' + s : '') + (m[3] || ''); if (nuovo !== h) a.setAttribute('href', nuovo);
  }

  // ricorda = true solo quando la sceglie chi guarda (la linguetta): la lingua data dall'indirizzo o dalla vetrina vale per quella pagina e non si ricorda
  function metti(l, ricorda) {
    lingua = l === 'en' ? 'en' : 'it';
    document.documentElement.lang = lingua;
    document.title = (lingua === 'en' && TITOLI[TITOLO]) || TITOLO;
    if (DESCR) DESCR.setAttribute('content', (lingua === 'en' && TITOLI[DESCR_IT]) || DESCR_IT);
    passa(document.body);
    document.querySelectorAll('a[href]').forEach(collega);
    if (menuLingua) menuLingua.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === lingua));
    if (linguetta) { const en = lingua === 'en'; linguetta.textContent = en ? 'Italiano' : 'English'; linguetta.lang = en ? 'it' : 'en'; linguetta.setAttribute('aria-label', en ? 'Leggi il sito in italiano' : 'Read this site in English'); }
    if (ricorda) { try { localStorage.setItem(CHIAVE, lingua); } catch (e) {} }
    try { const u = new URL(location.href); if (u.searchParams.has('lang')) { if (porta()) u.searchParams.set('lang', porta()); else u.searchParams.delete('lang'); if (u.href !== location.href) history.replaceState(history.state, '', u.href); } } catch (e) {}
    document.dispatchEvent(new CustomEvent('lingua', { detail: lingua }));   // i pezzi spezzati in parole o lettere se li riscrive la pagina
  }
  // la frase per i pezzi che la pagina riscrive da sé: in inglese se la lingua è l'inglese e la frase c'è, se no com'è
  function t(it) { const en = inglese(netta(it)); if (en === undefined) { mancate.add(netta(it)); return it; } return lingua === 'en' ? en : it; }

  new MutationObserver(cambi => {
    if (lingua !== 'en') return;
    for (const c of cambi) {
      if (c.type === 'characterData') passa(c.target);
      else c.addedNodes.forEach(n => { passa(n); if (n.nodeType === 1) { if (n.matches('a[href]')) collega(n); n.querySelectorAll('a[href]').forEach(collega); } });
    }
  }).observe(document.body, { subtree: true, childList: true, characterData: true });
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href]'); if (a) collega(a); }, true);   // anche i collegamenti riscritti da altri (le prove dei colori)
  addEventListener('message', e => { const d = e.data; if (d && (d.lingua === 'en' || d.lingua === 'it') && d.lingua !== lingua) metti(d.lingua); });   // la vetrina cambia lingua senza ricaricare

  // le scritte rimaste senza inglese, testi e attributi (per il controllo: deve tornare un elenco vuoto)
  function mancanti() {
    const fuori = new Set(mancate), conta = (v, el) => { const s = netta(v); if (/[A-Za-zÀ-ÿ]{2}/.test(s) && !UGUALI.has(s) && !(V.uguale && V.uguale(s)) && inglese(s, el) === undefined) fuori.add(s); };
    const g = giro(document.body); let n;
    while ((n = g.nextNode())) {
      if (n.nodeType === 3) { if (n._it === undefined && !(FUORI && n.parentElement.closest(FUORI))) conta(n.nodeValue, n.parentElement); }
      else if (!(FUORI && n.closest(FUORI))) for (const a of ATTR) { const v = n.getAttribute(a); if (v && !(n._ita && n._ita[a] !== undefined)) conta(v, n); }
    }
    if (!TITOLI[TITOLO]) fuori.add('titolo: ' + TITOLO); if (DESCR && !TITOLI[DESCR_IT]) fuori.add('descrizione: ' + DESCR_IT);
    return [...fuori];
  }
  window.LINGUA = { metti, adesso: () => lingua, mancanti, t };

  /* LA LINGUETTA (solo nella home). Lo stile è quello della vetrina (#lingua): in piedi sul bordo destro, a metà altezza, 4 px di amaranto con i
     riflessi del metallo, fondo scuro, con il mouse sopra l'interno d'argento; niente bagliore. Sta sopra la pagina e sotto il menu del telefono.
     Fino a 720 px (telefono) i margini del sito sono di 16 px e una linguetta fissa coprirebbe la fine delle righe: lì è più stretta, sta nella
     prima schermata all'altezza del titolo grande (dove il bordo destro è libero) e sale via con la pagina. */
  const inCornice = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  if (IO && IO.hasAttribute('data-linguetta') && (q.get('linguetta') === '1' || (!inCornice && q.get('linguetta') !== '0'))) {
    const AMARANTO = 'linear-gradient(172deg, #8a1535, #c2284f 16%, #f3a1b3 33%, #c2284f 50%, #8a1535 68%, #d85173 85%, #8a1535)';
    const stile = document.createElement('style'), telefono = matchMedia('(max-width: 720px)');
    // due strati: sopra l'interno (scuro, o d'argento con il mouse sopra), sotto l'amaranto che si vede solo nel bordo; il colore di fondo pieno è lo stesso scuro
    stile.textContent = '#lingua{position:fixed;z-index:90;right:0;top:50%;transform:translateY(-50%);margin:0;cursor:pointer;writing-mode:vertical-rl;padding:24px 12px 24px 13px;border:4px solid transparent;border-right:0;border-radius:11px 0 0 11px;color:#fff;font:600 14px/1 Manrope,sans-serif;letter-spacing:.3em;text-transform:uppercase;white-space:nowrap;background-color:#090d13;background-image:linear-gradient(#090d13,#090d13),' + AMARANTO + ';background-origin:padding-box,border-box;background-clip:padding-box,border-box;box-shadow:0 0 22px rgb(0 0 0 / .55);transition:color .3s}'
      + '@media (hover:hover){#lingua:hover{background-image:linear-gradient(90deg,#80858a,#d8dce0 22%,#fbfcfd 50%,#ced2d6 78%,#7c8186),' + AMARANTO + ';color:#141210}}'
      + '@media (max-width:1023px){#lingua{font-size:12px;padding:16px 6px 16px 7px}}'      // margini più stretti: linguetta più stretta (29 px), sempre dentro il margine
      + '@media (max-width:720px){#lingua{position:absolute;top:50svh}}'
      + '@media (max-width:1023px){#lingua::before{content:"";position:absolute;top:-4px;bottom:-4px;right:0;left:-19px}}'   // 18/11: la linguetta stretta si tocca su 44 px (area invisibile, l'aspetto non cambia)
      + '@media print{#lingua{display:none}}';
    document.head.appendChild(stile);
    linguetta = document.body.appendChild(Object.assign(document.createElement('button'), { id: 'lingua', type: 'button', textContent: 'English', lang: 'en' }));
    linguetta.setAttribute('aria-label', 'Read this site in English');
    linguetta.addEventListener('click', () => { chiesta = null; metti(lingua === 'en' ? 'it' : 'en', true); });
    // sul telefono sta all'altezza del titolo grande (lì accanto il bordo destro è libero), non a metà schermo dove passa il testo
    const posa = () => { const h = telefono.matches && document.querySelector('h1'); if (!h) { linguetta.style.top = ''; return; } const r = h.getBoundingClientRect(); linguetta.style.top = Math.round(r.top + scrollY + r.height / 2) + 'px'; };
    posa(); addEventListener('resize', posa); addEventListener('load', posa); document.addEventListener('lingua', posa);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(posa);
  }

  /* LA LINGUA NEL MENU (18/11/2026, giudice #27: la linguetta c'era solo nella prima schermata della home; chi-sono e per-capire non l'avevano).
     Dentro il pannello del menu a tre righe, in tutte e tre le pagine, sotto le voci e con il loro stile: Italiano / English; quella scelta è in
     corsivo bronzo come la voce della pagina in cui sei. Stesse regole della linguetta: nella vetrina non compare (lì comanda la vetrina). */
  const pannello = document.getElementById('pannello-menu'), voci = pannello && pannello.querySelector('nav');
  if (voci && (q.get('linguetta') === '1' || (!inCornice && q.get('linguetta') !== '0'))) {
    const st = document.createElement('style');
    st.textContent = '.menu-lingua{display:flex;align-items:center;gap:6px 14px;border-top:1px solid var(--linea);padding-top:10px}'
      + '.menu-lingua button{background:none;border:0;padding:0;min-height:44px;cursor:pointer;font:300 2.2rem/1.25 var(--serif);color:inherit}'
      + '.menu-lingua button[aria-pressed="true"]{font-style:italic;color:var(--voce,var(--bronzo))}'   // lo stesso colore della voce della pagina in cui sei
      + '.menu-lingua span{color:var(--tenue);font:300 1.6rem/1 var(--serif)}';
    document.head.appendChild(st);
    menuLingua = document.createElement('div');
    menuLingua.className = 'menu-lingua'; menuLingua.setAttribute('data-lingua', ''); menuLingua.setAttribute('role', 'group'); menuLingua.setAttribute('aria-label', 'Lingua · Language');
    menuLingua.innerHTML = '<button type="button" data-l="it" lang="it" aria-pressed="true">Italiano</button><span aria-hidden="true">/</span><button type="button" data-l="en" lang="en" aria-pressed="false">English</button>';
    voci.after(menuLingua);
    menuLingua.addEventListener('click', e => { const b = e.target.closest('button[data-l]'); if (!b || b.dataset.l === lingua) return; chiesta = null; metti(b.dataset.l, true); });
  }

  // la lingua con cui si apre: l'indirizzo comanda (e non si ricorda), se no la scelta ricordata
  let scelta = q.get('lang');
  if (scelta === 'en' || scelta === 'it') chiesta = scelta;
  else { scelta = null; try { scelta = localStorage.getItem(CHIAVE); } catch (e) {} }
  if (scelta === 'en') metti('en');
  else if (chiesta === 'it') document.querySelectorAll('a[href]').forEach(collega);   // italiano chiesto dall'indirizzo: lo portano anche i collegamenti
})();
