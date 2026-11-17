/* OTTO MERIDIANI — il cuore della prima pagina di HORA VERA, come modulo a sé (15/11/2026).
   Dallo schizzo approvato di piani/otto-meridiani.html (disposizione A «nove orologi», vetro «più scuro o più chiaro», sotto l'ora che si compone;
   senza pulsanti, senza testata, senza il racconto a righe finte). Idee di Franco: gli otto orologi accanto a otto città; il filmato della città
   dall'alba al tramonto; le lancette che vanno con le ore del filmato; il vetro più scuro o più chiaro con la luce; gli altri sette esposti, alternati
   (orologio, solo nome…), che si scambiano; clic su un nome: compaiono il suo orologio e il suo filmato.

   COME SI MOSTRANO I FILMATI (Franco, 15/11, alla lettera; confermata: «Penso che hai capito bene») — spuntata sugli scatti:
   [x] 1. Al centro un 16:9 più piccolo: il filmato della città in questione, l'unico che si muove (più piccolo = più definito).
   [x] 2. Quattro fermo immagine di altri posti agli angoli.
   [x] 3. Poi quattro fermo immagine al centro.
   [x] 4. Poi altri quattro ai lati.
   [x] 5. Poi quattro al centro.
   [x] 6. I fermo immagine sono semitrasparenti.
   Lettura confermata: i gruppi arrivano uno dopo l'altro mentre il filmato va; i fermo immagine vengono dai filmati che abbiamo già
   (immagini/otto/<città>/01-16.jpg, fuori dalle dissolvenze). CORRETTA da Franco il 15/11 notte: i «posti» sono ALTRE CITTÀ, mai quella del
   filmato; le quattro foto sempre diverse tra loro; un po' più piccole (20 %); le foto in trasparenza, il filmato no (vedi sceltaFermi).
   Scelte da confermare: «al centro» = quattro foto a cavallo dei quattro angoli del filmato, sotto di lui: BOCCIATO da Franco il 15/11 notte
   («mai le immagini dietro il video come adesso»); adesso i gruppi vanno a turno agli angoli della scena e a metà dei lati, mai dietro il filmato;
   ogni gruppo entra in dissolvenza lenta (1,8 s, sale di 10 px), resta per un quarto del filmato e lascia il posto al gruppo dopo; opacità .46 (era .56: Franco, 15/11 notte, «un po' in trasparenza, il video no»).

   Si innesta con tre righe: <link rel="stylesheet" href="otto.css">, <section id="otto" class="otto"></section>, <script src="otto.js"></script>.
   Parte quando la sezione entra nello schermo; uscendo si ferma; rientrando la città riparte da capo. Funziona anche aperta dal disco.
   Per le prove: OTTO.pronta; OTTO.vaiA('venezia', 5) ferma tutto a 5 secondi del filmato di Venezia (secondi negativi = la carta, prima del filmato). */
/* DAL 16/11/2026 SERA: l'ora sta DENTRO il filmato (idea di Franco, vedi «L'ORA DENTRO IL FILMATO» più sotto): tondino, arco con la lancetta, città e
   stagione; le cifre grandi sotto il quadrato non ci sono più (Franco non le capiva). Il filmato va dal buio di prima dell'alba alla sera, con le albe
   nuove di Kling: «uA» e «uB» di ogni città (dove sorge il sole, dove comincia la sera) stanno nella tabella CITTA e li scrive
   strumenti/albe-nel-sito.js. Per le prove: OTTO.vaiA('venezia', 8).then(() => OTTO.oraFilm()) dice che cosa segnano tondino e lancetta. */
(() => {
  const radice = document.getElementById('otto');
  if (!radice) return;
  const BASE = ((document.currentScript && document.currentScript.src) || location.href).replace(/[^/]*$/, ''), IMG = BASE + 'immagini/', OTTO_DIR = IMG + 'otto/';
  const RAD = Math.PI / 180, calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (tag, classe, padre, html) => { const e = document.createElement(tag); if (classe) e.className = classe; if (html != null) e.innerHTML = html; if (padre) padre.appendChild(e); return e; };
  const lim = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), dolce = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, esce = u => 1 - Math.pow(1 - u, 3);
  const fase = (t, a, b) => lim((t - a) / (b - a));
  const OTTO = window.OTTO = { pronta: false };
  // IN INGLESE (18/11/2026, l'inglese con un clic): questo file continua a scrivere in italiano; le scritte le traduce il motore della lingua (lingua.js)
  // quando compaiono, con il vocabolario di lingua-en.js (città, stagioni, «mezzogiorno vero» → «true noon»). Solo la scritta riscritta a ogni
  // fotogramma (il bollo) chiede qui la sua parola, così in inglese non viene riscritta due volte a fotogramma. Senza lingua.js resta l'italiano.
  const FRASE = s => window.LINGUA ? window.LINGUA.t(s) : s;

  // ---------- il sole di oggi (formule NOAA): minuti dalla mezzanotte UTC di oggi ----------
  const adesso = new Date(), BASE_UTC = Date.UTC(adesso.getUTCFullYear(), adesso.getUTCMonth(), adesso.getUTCDate());
  const doy = Math.round((BASE_UTC - Date.UTC(adesso.getUTCFullYear(), 0, 1)) / 864e5) + 1;
  function sole(lat, lon) {
    const g = 2 * Math.PI / 365 * (doy - 1);
    const eot = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    const dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    const mezzo = 720 - 4 * lon - eot, c = Math.cos(90.833 * RAD) / (Math.cos(lat * RAD) * Math.cos(dec)) - Math.tan(lat * RAD) * Math.tan(dec);
    const polare = c < -1 ? 'giorno' : c > 1 ? 'notte' : null, ha = polare ? 0 : Math.acos(c) / RAD;
    return { mezzo, alba: mezzo - 4 * ha, tramonto: mezzo + 4 * ha, polare,
      alt: T => Math.asin(Math.sin(lat * RAD) * Math.sin(dec) + Math.cos(lat * RAD) * Math.cos(dec) * Math.cos(((T + eot + 4 * lon) / 4 - 180) * RAD)) / RAD };
  }
  const scarto = tz => { const d = new Date(BASE_UTC + 720 * 6e4); return Math.round((new Date(d.toLocaleString('en-US', { timeZone: tz })) - new Date(d.toLocaleString('en-US', { timeZone: 'UTC' }))) / 6e4); };
  const hhmm = m => { m = ((Math.round(m) % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  const gradi = (v, pos, neg) => { const a = Math.abs(v), g = Math.floor(a), p = Math.round((a - g) * 60); return g + '°' + String(p).padStart(2, '0') + '′ ' + (v >= 0 ? pos : neg); };

  // ---------- gli orologi (lancette staccate; angoli delle lancette nella foto, in gradi da mezzogiorno in senso orario) ----------
  const OROLOGI = {
    tigre:     { f: [1024, 1536], perno: [49.76, 44.92], ore: 304.46, min: 56.73, r: .29 },
    rubino:    { f: [938, 1677],  perno: [49.21, 40.94], ore: 305.8,  min: 52.0,  sec: 223.2, r: .31 },
    verde:     { f: [1536, 1024], perno: [49.87, 44.36], ore: 305.2,  min: 55.9,  r: .19 },
    grafite:   { f: [1536, 1024], perno: [50.02, 45.63], ore: 307.3,  min: 55.2,  r: .19 },
    bianco:    { f: [938, 1677],  perno: [49.49, 44.69], ore: 303.0,  min: 50.3,  sec: 90.4, secO: [49.55, 52.81], r: .31 },
    cuoio:     { f: [1024, 1536], perno: [49.41, 47.27], ore: 307.7,  min: 51.9,  r: .29 },
    subacqueo: { f: [1536, 1024], perno: [49.99, 45.7],  ore: 304.5,  min: 55.7,  sec: 223.3, r: .19 },
    blu:       { f: [1536, 1024], perno: [49.87, 46.58], ore: 305.75, min: 56.23, r: .19 },
    scheletrato: { f: [1254, 1254], perno: [50, 50], fisso: true, r: .36, src: 'otto/scheletrato.webp' } };   // lo scheletrato scontornato (da piani/otto, con HORA VERA)

  // ---------- le città, da est a ovest (Greenwich: lo scheletrato al centro del quadrato, senza filmato) ----------
  const CITTA = [
    { k: 'pechino', nome: 'Pechino', lat: 39.9163, lon: 116.3972, tz: 'Asia/Shanghai', cont: 'Asia', paese: 'Cina', orologio: 'tigre', titolo: 'Wanli', n: 'N. 036',
      allora: 'Cina dei Ming, 1580: lo spadaccino', adesso: 'la Città Proibita dei Ming, vista dalla collina di Jingshan', dur: 22.38, uA: .061, uB: .783 },
    { k: 'vienna', nome: 'Vienna', lat: 48.2082, lon: 16.3738, tz: 'Europe/Vienna', cont: 'Europa', paese: 'Austria', orologio: 'rubino', titolo: 'Sobieski', n: 'N. 031',
      allora: 'Vienna, 12 settembre 1683: gli ussari alati', adesso: 'Vienna dal Kahlenberg, la collina da cui scese l’esercito di soccorso', dur: 22.25, uA: .112, uB: .782 },
    { k: 'venezia', nome: 'Venezia', lat: 45.4337, lon: 12.3397, tz: 'Europe/Rome', cont: 'Europa', paese: 'Italia', orologio: 'verde', titolo: 'Patavium', n: 'N. 041',
      allora: 'Padova, gennaio 1610: Galileo e la luna', adesso: 'la Piazzetta: dal Campanile, nell’agosto 1609, Galileo mostrò il cannocchiale ai senatori', dur: 23.00, uA: .060, uB: .800 },
    { k: 'brescia', nome: 'Brescia', lat: 45.5398, lon: 10.2302, tz: 'Europe/Rome', cont: 'Europa', paese: 'Italia', orologio: 'grafite', titolo: 'Brixia', n: 'N. 038',
      allora: 'Brescia, 26 marzo 1927: la prima Mille Miglia', adesso: 'viale Venezia, dove partì la prima Mille Miglia', dur: 21.08, uA: .077, uB: .657 },   // dal 16/11 con l'alba nuova di Kling (dal buio al sole che spunta) al posto della vecchia
    { k: 'parigi', nome: 'Parigi', lat: 48.8638, lon: 2.3135, tz: 'Europe/Paris', cont: 'Europa', paese: 'Francia', orologio: 'bianco', titolo: 'Déco', n: 'N. 052',
      allora: 'Parigi, 1925: l’esposizione dell’Art Déco', adesso: 'il ponte Alexandre III, al centro dell’esposizione del 1925', dur: 21.13, uA: .047, uB: .771 },
    { k: 'dover', nome: 'Dover', lat: 51.1279, lon: 1.3134, tz: 'Europe/London', cont: 'Europa', paese: 'Regno Unito', orologio: 'cuoio', titolo: 'Wright', n: 'N. 044',
      allora: 'La Manica, 2 giugno 1910: Rolls in volo, andata e ritorno', adesso: 'le scogliere bianche sulla Manica', dur: 20.08, uA: .068, uB: .811 },
    { k: 'greenwich', nome: 'Greenwich', lat: 51.4769, lon: -0.0005, tz: 'Europe/London', cont: 'Europa', paese: 'Regno Unito', orologio: 'scheletrato', titolo: 'Lo scheletrato', n: 'Il protagonista', fisso: true },
    { k: 'siviglia', nome: 'Siviglia', lat: 37.3826, lon: -5.9963, tz: 'Europe/Madrid', cont: 'Europa', paese: 'Spagna', orologio: 'subacqueo', titolo: 'Victoria', n: 'N. 049',
      allora: 'Siviglia, 1522: torna la nave del primo giro del mondo', adesso: 'il Guadalquivir e la Torre del Oro: il fiume che la Victoria risalì nel settembre 1522', dur: 21.88, uA: .046, uB: .815 },
    { k: 'polo', nome: 'Polo Sud', lat: -90, lon: 0, tz: 'Pacific/Auckland', cont: 'Antartide', paese: 'Antartide', orologio: 'blu', titolo: 'Polheim', n: 'N. 057',
      allora: 'Polo Sud, 14 dicembre 1911: Amundsen', adesso: 'il Polo Sud, dove si incontrano tutti i meridiani: a novembre il sole non tramonta', dur: 20 } ];
  CITTA.forEach(c => { c.s = sole(c.lat, c.lon); c.off = scarto(c.tz); if (!c.fisso) c.video = OTTO_DIR + c.k + '.mp4'; });
  const GIRO = CITTA.filter(c => !c.fisso);   // le otto città che si alternano, da est a ovest

  // ---------- la carta (coste e confini da Natural Earth, in immagini/otto/mondo.js, caricato a parte) ----------
  const anelli = a => a.map(r => { const f = new Float32Array(r.length); let sx = 0, sy = 0, sz = 0;
    for (let i = 0; i < r.length; i += 2) { f[i] = r[i] / 100; f[i + 1] = r[i + 1] / 100; const l = f[i] * RAD, p = f[i + 1] * RAD; sx += Math.cos(p) * Math.cos(l); sy += Math.cos(p) * Math.sin(l); sz += Math.sin(p); }
    const n = Math.hypot(sx, sy, sz) || 1; f.c = [sx / n, sy / n, sz / n]; return f; });
  let TERRA = [], PAESI = {};
  const RETE = [];
  for (let lo = -180; lo < 180; lo += 15) { const r = []; for (let la = -88; la <= 88; la += 2) r.push(lo * 100, la * 100); RETE.push(r); }
  for (let la = -75; la <= 75; la += 15) { const r = []; for (let lo = -180; lo <= 180; lo += 3) r.push(lo * 100, la * 100); RETE.push(r); }
  const GRIGLIA = anelli(RETE);
  let mondoPronto = false;
  const prendiMondo = () => { if (mondoPronto || !window.MONDO) return; TERRA = anelli(window.MONDO.terra); for (const k in window.MONDO.paesi) PAESI[k] = anelli(window.MONDO.paesi[k]); mondoPronto = true; viste.clear(); };
  const vett = (lon, lat) => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD)];
  const lonlat = v => [Math.atan2(v[1], v[0]) / RAD, Math.asin(lim(v[2], -1, 1)) / RAD];
  function slerp(a, b, s) { const d = lim(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1), w = Math.acos(d);
    if (w < 1e-4) return a.slice(); const sa = Math.sin((1 - s) * w) / Math.sin(w), sb = Math.sin(s * w) / Math.sin(w);
    return [a[0] * sa + b[0] * sb, a[1] * sa + b[1] * sb, a[2] * sa + b[2] * sb]; }

  // ---------- la costruzione ----------
  radice.setAttribute('aria-label', 'Otto meridiani: gli orologi della collezione e le loro città, dall’alba al tramonto');
  radice.textContent = '';
  const palco = el('div', 'ot-palco', radice);
  // (16/11: le cifre grandi sotto il quadrato, «08:00 · l'alba», non ci sono più: Franco non le capiva. L'ora adesso sta DENTRO il filmato, vedi oraFilm.)
  const colonna = el('div', 'ot-colonna', palco), ruota = el('div', 'ot-ruota', colonna);
  const lato = el('div', 'ot-lato', palco), scena = el('div', 'ot-scena', lato);
  const cv = el('canvas', 'ot-carta', scena), g = cv.getContext('2d');
  const video = el('video', 'ot-film', scena); video.muted = true; video.playsInline = true; video.preload = 'auto'; video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
  const oraBox = el('div', 'ot-ora', scena);   // l'ora dentro il filmato: sta esattamente sopra il filmato e si accende e si spegne con lui
  oraBox.setAttribute('aria-hidden', 'true');
  const etMer = el('div', 'ot-meridiano', scena), etich = el('div', 'ot-etichetta', scena, '<b></b><span></span>');
  const sotto = el('div', 'ot-sotto', lato), grandeBox = el('div', 'ot-grande', sotto), dida = el('div', 'ot-didascalia', sotto);
  const dN = el('span', 'ot-n', dida), dCitta = el('h2', 'ot-citta', dida), dAdesso = el('p', '', dida), dAllora = el('p', '', dida), dTempi = el('div', 'ot-tempi', dida), evento = el('div', 'ot-evento', dida);

  // un orologio con le sue lancette
  function orologio(nome, padre, conVetro) {
    const O = OROLOGI[nome], box = el('div', 'ot-orologio', padre), tela = el('div', 'ot-tela', box);
    const foto = el('img', '', tela); foto.src = IMG + (O.src || nome + '.webp'); foto.alt = '';
    const L = {};
    if (!O.fisso) {
      L.ore = el('img', '', tela); L.ore.src = IMG + nome + '-ore.webp';
      L.min = el('img', '', tela); L.min.src = IMG + nome + '-minuti.webp';
      if (O.sec != null) { L.sec = el('img', '', tela); L.sec.src = IMG + nome + '-secondi.webp'; }
      el('img', '', tela).src = IMG + nome + '-perno.webp';
      if (O.secO) el('img', '', tela).src = IMG + nome + '-perno-piccolo.webp';
      // le lancette girano a ogni fotogramma: ognuna sul suo strato, così le gira la scheda grafica e la casella non si ridisegna (16/11)
      for (const k in L) { L[k].alt = ''; L[k].style.transformOrigin = (k === 'sec' && O.secO ? O.secO : O.perno).map(v => v + '%').join(' '); L[k].style.willChange = 'transform'; }
    }
    const o = { box, tela, foto, vetro: conVetro ? el('div', 'ot-vetro', tela) : null, O, luce: -1 };
    o.misura = () => { const W = box.clientWidth, H = box.clientHeight; if (!W || !H) return;
      const k = Math.min(W / O.f[0], H / O.f[1]), w = O.f[0] * k, h = O.f[1] * k;
      tela.style.width = w + 'px'; tela.style.height = h + 'px';
      if (o.vetro) { const r = O.r * w, cx = O.perno[0] / 100 * w, cy = O.perno[1] / 100 * h;
        Object.assign(o.vetro.style, { left: (cx - r) + 'px', top: (cy - r) + 'px', width: (2 * r) + 'px', height: (2 * r) + 'px' }); } };
    // locale = minuti dalla mezzanotte del suo luogo
    o.segna = locale => { if (O.fisso) return;
      L.ore.style.transform = `rotate(${(((locale / 60) % 12) * 30 - O.ore).toFixed(2)}deg)`;
      L.min.style.transform = `rotate(${((locale % 60) * 6 - O.min).toFixed(2)}deg)`;
      if (L.sec) L.sec.style.transform = `rotate(${(((Date.now() / 1000) % 60) * 6 - O.sec).toFixed(2)}deg)`; };
    return o;
  }

  // le caselle: A = 3×3, lo scheletrato al centro, la città di adesso a destra (verso il filmato), le altre in giro
  const celle = {};
  CITTA.forEach(c => { const d = el('div', 'ot-cella' + (c.fisso ? ' ot-fissa' : ''), ruota);
    const luce = el('div', 'ot-luce', d), o = orologio(c.orologio, d, false);
    const nm = el('div', 'ot-nome', d, `<b>${c.nome}</b><span>${c.titolo}</span><i></i>`), bollo = el('div', 'ot-bollo', d);
    bollo.dataset.lingua = 'pagina';   // il bollo si riscrive a ogni fotogramma finché è acceso: la parola la chiede lui a FRASE(), il motore della lingua non lo tocca
    if (!c.fisso) { d.tabIndex = 0; d.setAttribute('role', 'button'); d.setAttribute('aria-label', c.nome + ', ' + c.titolo);
      const scegli = () => { if (c !== att && avviato) vai(c, true); };
      d.addEventListener('click', scegli); d.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); scegli(); } }); }
    celle[c.k] = { d, luce, o, ora: nm.querySelector('i'), bollo, c }; });
  const ANELLO8 = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];   // in senso orario dall'alto a sinistra
  let D = 560;
  function disponi() {
    const S = D / 3, ia = GIRO.indexOf(att);
    ruota.style.setProperty('--S', (S - 2) + 'px');
    GIRO.forEach((c, i) => { const passo = ia < 0 ? i + 1 : (i - ia + GIRO.length) % GIRO.length, [cx, cy] = ANELLO8[(3 + passo) % 8], e = celle[c.k].d;
      e.style.setProperty('--x', (cx * S + 1) + 'px'); e.style.setProperty('--y', (cy * S + 1) + 'px'); e.dataset.passo = passo; });
    const sch = celle.greenwich.d; sch.style.setProperty('--x', (S + 1) + 'px'); sch.style.setProperty('--y', (S + 1) + 'px');
  }
  function misuraTutto() {
    const W = palco.clientWidth || radice.clientWidth, H = innerHeight > 300 ? innerHeight : 800, tel = innerWidth <= 860;
    D = Math.max(240, Math.min(W || 560, tel ? 560 : Math.min(H * .62, W * .42, 860)));
    ruota.style.setProperty('--D', D + 'px');
    disponi();
    requestAnimationFrame(() => { for (const k in celle) celle[k].o.misura(); grande && grande.misura(); misuraCarta(); });
  }

  // ---------- L'ORA DENTRO IL FILMATO (idea di Franco del 16/11; le sue parole, alla lettera, stanno in testa a piani/ora-nel-filmato.html, la prova approvata) ----------
  // «l'ora dovrebbe scorrere all'interno del filmato e non a salti, ma segnando tutte le ore dell'intero arco della giornata»; «dentro un tondino amaranto
  // o bordeaux in cui i numeri per l'orario appaiono dorati», «un centimetro e mezzo», poi: «con il bordo oro più spesso… a contatto con il lato in alto
  // e con quello di destra, senza fuoriuscire dall'immagine»; «un semicerchio sottile ma ben visibile che parte esattamente dall'angolo inferiore sinistro,
  // tocca esattamente il centro del lato superiore e scende finendo esattamente nell'angolo destro»; «una lancetta molto semplice», che «deve muoversi
  // esattamente in sincronia con l'orario numerico nel tondino»; «il nome della città e della stagione nel filmato: in basso al centro (… se bianco meglio)».
  // Il disegno è in 1600 × 900: mezza ellisse per i due angoli bassi e il centro del lato alto, la lancetta dal perno a metà del lato basso. Tondino,
  // lancetta, caselle e lancette degli orologi leggono la STESSA ora (tau, da tauDi): non possono sfasarsi. Le mie aggiunte della prova (tacche, luce,
  // quarti d'ora, lancetta corta) qui non ci sono: Franco non le ha scelte.
  const NS = 'http://www.w3.org/2000/svg', sv = (tag, at, padre) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); padre.appendChild(e); return e; };
  const PX = 800, PY = 900, RX = 798, RY = 898;
  const punta = f => { const phi = Math.PI * f, cx = -Math.cos(phi), sy = -Math.sin(phi), r = 1 / Math.sqrt(cx * cx / (RX * RX) + sy * sy / (RY * RY)); return [PX + r * cx, PY + r * sy]; };
  // la stagione di oggi in quel luogo (cambia il 20/3, il 21/6, il 22/9 e il 21/12; a sud dell'equatore è l'opposta): dice perché alle 17 è già buio
  const stagione = lat => { const n = (adesso.getUTCMonth() + 1) * 100 + adesso.getUTCDate(), k = n < 320 ? 0 : n < 621 ? 1 : n < 922 ? 2 : n < 1221 ? 3 : 0; return ['inverno', 'primavera', 'estate', 'autunno'][lat >= 0 ? k : (k + 2) % 4]; };
  const oraFilm = (() => {
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1600 900'); svg.setAttribute('preserveAspectRatio', 'none'); oraBox.appendChild(svg);
    const ARCO = `M ${PX - RX} ${PY} A ${RX} ${RY} 0 0 1 ${PX + RX} ${PY}`;
    sv('path', { d: ARCO, class: 'ot-ombra' }, svg); sv('path', { d: ARCO, class: 'ot-oro' }, svg);
    // la lancetta è una riga che GIRA e si allunga con transform (la muove la scheda grafica): disegnata nell'SVG, a ogni fotogramma faceva ridisegnare
    // tutto il riquadro sopra il filmato (misurato il 16/11 con cadenza-pagina.js: da 33 a 50 millesimi a fotogramma). Il perno sta a metà del lato basso.
    const lan = el('div', 'ot-lancetta', oraBox);
    const luogo = el('div', 'ot-luogo', oraBox), tondo = el('div', 'ot-tondo', oraBox, '00:00');
    let testo = '', px = '', vis = -1;
    return {
      prepara: c => { luogo.textContent = c.nome + ' · ' + stagione(c.lat); },
      // tau = l'ora del luogo in minuti; f = dove sta il sole sull'arco (0 l'alba, .5 il mezzogiorno vero, 1 il tramonto); fuori da 0-1 la lancetta non c'è
      segna: (tau, f) => { const g = lim(f), [x, y] = punta(g), v = f >= 0 && f <= 1 ? 1 : Math.round(lim(1 - Math.max(-f, f - 1) / .02) * 100) / 100;
        const p = `rotate(${(g * 180 - 90).toFixed(2)}deg) scaleY(${(Math.hypot(x - PX, y - PY) / PY).toFixed(4)})`;
        if (p !== px) { px = p; lan.style.transform = p; }
        if (v !== vis) { vis = v; lan.style.opacity = v; }
        const t = hhmm(tau); if (t !== testo) { testo = t; tondo.textContent = t; } },
      // per le prove: che cosa segna adesso
      stato: () => ({ ora: testo, lancetta: px, visibile: vis, luogo: luogo.textContent }) };
  })();
  OTTO.oraFilm = () => oraFilm.stato();   // per le prove: OTTO.vaiA('venezia', 8).then(() => OTTO.oraFilm())

  // ---------- la carta: un globo visto da fuori, linee che si disegnano ----------
  let CW = 0, CH = 0, DPR = 1;
  const viste = new Map();
  function misuraCarta() { DPR = Math.min(2, devicePixelRatio || 1); CW = scena.clientWidth; CH = scena.clientHeight; viste.clear(); }   // la tela prende la misura quando disegna
  function proietta(lon, lat, v, out) {
    const l = (lon - v.lon0) * RAD, p = lat * RAD, cp = Math.cos(p), sp = Math.sin(p), cl = Math.cos(l);
    out[0] = v.cx + v.R * cp * Math.sin(l); out[1] = v.cy - v.R * (v.c0 * sp - v.s0 * cp * cl); out[2] = v.s0 * sp + v.c0 * cp * cl; }
  const vista = (lon0, lat0, R) => ({ lon0, lat0, R, s0: Math.sin(lat0 * RAD), c0: Math.cos(lat0 * RAD), cx: CW / 2, cy: CH / 2 });
  const P = [0, 0, 0];
  function disegna(lista, v, prog, stile, ritardo) {
    if (prog <= 0 || !lista) return;
    const cx = vett(v.lon0, v.lat0);
    g.beginPath();
    for (let a = 0; a < lista.length; a++) { const f = lista[a];
      if (f.c && f.c[0] * cx[0] + f.c[1] * cx[1] + f.c[2] * cx[2] < -0.25) continue;
      const n = f.length / 2, q = ritardo ? lim((prog - (a % 7) * .03) / .82) : prog, m = Math.floor(n * q);
      if (m < 2) continue;
      let su = false;
      for (let i = 0; i < m; i++) { proietta(f[2 * i], f[2 * i + 1], v, P);
        if (P[2] < 0) { su = false; continue; }
        if (!su) { g.moveTo(P[0], P[1]); su = true; } else g.lineTo(P[0], P[1]); } }
    g.strokeStyle = stile.colore; g.lineWidth = stile.spessore * DPR; g.stroke();
  }
  function vistaPaese(c) {
    if (viste.has(c.k)) return viste.get(c.k);
    let R;
    if (c.k === 'polo') R = Math.min(CW, CH) * .78 / Math.sin(34 * RAD);
    else { const v = vista(c.lon, c.lat, 1); let ext = 0;
      for (const f of PAESI[c.paese] || []) for (let i = 0; i < f.length; i += 2) { proietta(f[i], f[i + 1], v, P); if (P[2] > 0) ext = Math.max(ext, Math.abs(P[0] - v.cx) / (CW / 2), Math.abs(P[1] - v.cy) / (CH / 2)); }
      R = ext ? (c.paese === 'Cina' || c.paese === 'Francia' || c.paese === 'Regno Unito' || c.paese === 'Spagna' ? .74 : .66) / ext : 4 * Math.min(CW, CH);
      if (c.paese === 'Francia') R = Math.max(R, 3.4 * Math.min(CW, CH)); }
    const out = { lon: c.lon, lat: c.k === 'polo' ? -90 : c.lat, R };
    if (mondoPronto) viste.set(c.k, out); return out;
  }
  const vistaContinente = c => c.k === 'polo' ? { lon: 30, lat: -55, R: Math.min(CW, CH) * .5 } : c.cont === 'Asia' ? { lon: c.lon - 8, lat: c.lat - 4, R: Math.min(CW, CH) * 1.05 } : { lon: 12, lat: 47, R: Math.min(CW, CH) * 1.6 };

  // ---------- i fermo immagine: quattro gruppi di quattro mentre il filmato va ----------
  // posti in % della scena (il filmato occupa 26-74 % in larghezza e in altezza; una foto è il 20 %).
  // MAI dietro il filmato (Franco, 15/11 notte: «mai le immagini dietro il video come adesso… quelle agli angoli»): i gruppi vanno a turno
  // agli angoli della scena e a metà dei lati, e nessun posto tocca il riquadro del filmato; OTTO.controllaFermi() lo misura sulla pagina.
  const POSTI = [
    [[2, 2], [78, 2], [2, 78], [78, 78]],          // 2. agli angoli
    [[2, 40], [78, 40], [40, 2], [40, 78]],      // 3. a metà dei lati (prima: a cavallo degli angoli del filmato, sotto di lui; bocciato)
    [[2, 2], [78, 2], [2, 78], [78, 78]],        // 4. di nuovo agli angoli, con altre foto
    [[2, 40], [78, 40], [40, 2], [40, 78]] ];    // 5. di nuovo a metà dei lati
  // (Franco, 15/11 notte, alla lettera) le quattro foto sono sempre diverse tra loro e nessuna è un fotogramma del filmato che sta andando:
  // sono quattro ALTRE città. Per costruzione: mai la città del filmato; in un gruppo quattro città diverse (quattro posti di fila su sette città);
  // ogni gruppo prende i fotogrammi del suo quarto di giornata (gruppo 0 = alba … 3 = sera), così la stessa città non torna mai con la stessa foto
  // e la luce delle foto va con quella del filmato. «Un po' più piccole, appena appena»: il lato dal 22 al 20 %, con lo stesso centro.
  // INQ: per ogni città UNA foto per inquadratura e per quarto di giornata (alba, giorno, tardo pomeriggio, notte), scelte con
  // strumenti/inquadrature-fermi.js e guardate sul foglio: nelle cartelle la stessa veduta torna ogni cinque o sei numeri e ci sono fotogrammi
  // identici (Parigi 14-15-16, Polo Sud 15-16). Il gruppo g prende la foto g: una città non torna mai due volte con la stessa veduta.
  const INQ = { pechino: [7, 3, 5, 14], vienna: [7, 2, 4, 14], venezia: [6, 8, 4, 10], brescia: [6, 7, 9, 10],
    parigi: [1, 6, 7, 11], dover: [9, 6, 11, 8], siviglia: [6, 7, 8, 10], polo: [11, 2, 3, 10] };
  function sceltaFermi(c) { const altre = GIRO.filter(x => x !== c), da = Math.max(0, GIRO.indexOf(c));
    return Array.from({ length: 16 }, (_, i) => { const k = altre[(i + da) % altre.length].k; return { k, n: INQ[k][i >> 2] }; }); }
  // per le prove: per ogni città, gli sbagli della scelta (deve tornare un elenco vuoto)
  // (si possono dare un'altra scelta e altri posti: serve a provare che il controllo veda l'errore vero, cioè la versione di prima)
  OTTO.controllaFermi = (scegli = sceltaFermi, posti = POSTI) => { const sbagli = [], W = scena.clientWidth || 1, H = scena.clientHeight || 1;
    // il riquadro del filmato e il lato di una foto, misurati sulla pagina in % della scena: nessuna foto dietro il filmato, nessuna fuori dalla scena
    const fx = video.offsetLeft / W * 100, fy = video.offsetTop / H * 100, fw = video.offsetWidth / W * 100, fh = video.offsetHeight / H * 100;
    const lw = fermi[0] ? fermi[0].offsetWidth / W * 100 : 20, lh = fermi[0] ? fermi[0].offsetHeight / H * 100 : 20;
    posti.forEach((gruppo, gr) => gruppo.forEach(([x, y], j) => {
      if (x < fx + fw && x + lw > fx && y < fy + fh && y + lh > fy) sbagli.push('posto ' + gr + '.' + j + ': la foto finisce dietro il filmato');
      if (x < 0 || y < 0 || x + lw > 100.5 || y + lh > 100.5) sbagli.push('posto ' + gr + '.' + j + ': la foto esce dalla scena'); }));
    for (const k in INQ) if (new Set(INQ[k]).size < 4) sbagli.push(k + ': nella tavola delle inquadrature una foto torna due volte');
    for (const c of GIRO) { const s = scegli(c), viste = new Set();
      s.forEach((f, i) => { const chi = f.k + '/' + f.n;
        if (f.k === c.k) sbagli.push(c.k + ': la foto ' + i + ' è del suo filmato');
        if (viste.has(chi)) sbagli.push(c.k + ': ' + chi + ' due volte'); viste.add(chi);
        if (!INQ[f.k] || !INQ[f.k].includes(f.n)) sbagli.push(c.k + ': ' + chi + ' non sta nella tavola delle inquadrature'); });
      for (let gr = 0; gr < 4; gr++) if (new Set(s.slice(gr * 4, gr * 4 + 4).map(f => f.k)).size < 4) sbagli.push(c.k + ': nel gruppo ' + gr + ' una città torna due volte'); }
    return sbagli; };
  let fermi = [], gruppoOra = -1;
  function preparaFermi(c, subito) {
    const vecchi = fermi; vecchi.forEach(f => f.classList.remove('ot-si'));
    if (subito) vecchi.forEach(f => f.remove()); else setTimeout(() => vecchi.forEach(f => f.remove()), 2200);
    fermi = []; gruppoOra = -1;
    const scelta = sceltaFermi(c);
    for (let i = 0; i < 16; i++) { const im = el('img', 'ot-fermo'); im.alt = ''; im.decoding = 'async';
      im.src = OTTO_DIR + scelta[i].k + '/' + String(scelta[i].n).padStart(2, '0') + '.jpg';
      const [x, y] = POSTI[i >> 2][i & 3]; im.style.left = x + '%'; im.style.top = y + '%'; im.dataset.gruppo = i >> 2;
      scena.insertBefore(im, cv); fermi.push(im); }
  }
  function mostraGruppo(gr) {
    if (gr === gruppoOra) return; gruppoOra = gr;
    fermi.forEach(f => f.classList.toggle('ot-si', +f.dataset.gruppo === gr));
  }

  // ---------- la sequenza di una città: notte (la carta), giorno (il filmato), sosta ----------
  const NOTTE = calmo ? 1200 : 7200, SOSTA = 2200, SPEGNI = 1200;
  let att = CITTA.find(c => c.k === 'venezia'), prima = null, contDisegnato = false, ciclo = null, grande = null, avviato = false;
  let srcAttesa = null, partito = false, tFine = null, opacPrima = 0;
  // L'ORA DEL FILMATO (16/11, con le albe nuove di Kling): il filmato non va più «dall'alba al tramonto» ma dal buio di prima dell'alba alla sera.
  // Parte PRIMA minuti prima dell'alba; il sole sorge a uA (dove nel filmato la luce comincia a salire), tramonta a uB (dove comincia l'inquadratura
  // della sera) e alla fine sono passati SERA minuti dal tramonto. Tra alba e tramonto l'ora scorre dritta: a metà cade il mezzogiorno VERO del luogo.
  // uA e uB di ogni città stanno nella tabella CITTA e li scrive strumenti/albe-nel-sito.js (uA dalla luce del filmato, uB dalla ricetta di montaggio).
  // Al Polo Sud, dove il sole non tramonta, il filmato è un giro di 24 ore.
  const PRIMA = 24, SERA = 170;
  function preparaCiclo(t) {
    const c = att, polo = c.s.polare === 'giorno';
    const A = polo ? 0 : c.s.alba + c.off, B = polo ? 1440 : c.s.tramonto + c.off, G = c.dur * 1000;
    const uA = polo ? 0 : (c.uA || .045), uB = polo ? 1 : (c.uB || .78), P = polo ? A : A - PRIMA, F = polo ? B : B + SERA, da = polo ? -360 : F - 1440;
    ciclo = { t0: t, A, B, da, G, polo, uA, uB, P, F, eventi: [] };
    // le ore che coincidono: alba, mezzogiorno vero e tramonto delle altre città, viste dall'orologio di qui
    for (const o of GIRO) { if (o === c) continue;
      const pezzi = o.s.polare === 'giorno' ? [] : [['alba', o.s.alba], ['mezzogiorno vero', o.s.mezzo], ['tramonto', o.s.tramonto]];
      for (const [tipo, T] of pezzi) { let tau = T + c.off; while (tau < da) tau += 1440; while (tau > F) tau -= 1440; if (tau < da) continue;
        if (!polo && tau < P && (tau - da < 75 || P - tau < 75)) continue;
        ciclo.eventi.push({ o, tipo, tau, e: eDi(tau) }); }
      if (o.s.polare === 'giorno' && !polo) ciclo.eventi.push({ o, tipo: 'sole', tau: B, e: eDi(B) }); }
    ciclo.eventi.sort((a, b) => a.e - b.e);
  }
  // u = il punto del filmato (da 0 a 1) ↔ tau = l'ora del luogo in minuti
  const tauFilm = u => { const k = ciclo; return u < k.uA ? k.P + (k.A - k.P) * (u / k.uA) : u <= k.uB ? k.A + (k.B - k.A) * (u - k.uA) / (k.uB - k.uA) : k.B + (k.F - k.B) * (u - k.uB) / (1 - k.uB); };
  const uFilm = tau => { const k = ciclo; return tau < k.A ? k.uA * (tau - k.P) / (k.A - k.P) : tau <= k.B ? k.uA + (k.uB - k.uA) * (tau - k.A) / (k.B - k.A) : k.uB + (1 - k.uB) * (tau - k.B) / (k.F - k.B); };
  // e = millisecondi dall'inizio della città (la notte sulla carta da 0 a NOTTE, poi il filmato)
  const eDi = tau => tau <= ciclo.P ? (tau - ciclo.da) / (ciclo.P - ciclo.da) * NOTTE : NOTTE + uFilm(tau) * ciclo.G;
  const tauDi = e => e < NOTTE ? ciclo.da + (ciclo.P - ciclo.da) * (e / NOTTE) : tauFilm(lim((e - NOTTE) / ciclo.G));
  // dove sta il sole sull'arco del filmato a quell'ora: 0 l'alba, 1 il tramonto (al Polo Sud il giro delle 24 ore)
  const arcoDi = tau => ciclo.polo ? tau / 1440 : (tau - ciclo.A) / (ciclo.B - ciclo.A);

  function vai(c, clic, t = performance.now(), subito = false) {
    opacPrima = !subito && att && att !== c ? +video.style.opacity || 0 : 0;
    prima = att === c ? null : att; att = c;
    if (!prima || prima.cont !== c.cont) contDisegnato = false;
    grandeBox.textContent = ''; grande = orologio(c.orologio, grandeBox, true); requestAnimationFrame(() => grande && grande.misura());
    dN.textContent = c.n + ' · ' + c.titolo;
    dCitta.textContent = c.nome;
    dAdesso.innerHTML = '<b>Adesso:</b> ' + c.adesso + '.';
    dAllora.innerHTML = '<b>Allora:</b> ' + c.allora + '.';
    dTempi.innerHTML = c.s.polare === 'giorno' ? '<span style="--c:#f1d9a4">il sole non tramonta</span>' :
      `<span style="--c:#e7a99a">alba ${hhmm(c.s.alba + c.off)}</span><span style="--c:#f1d9a4">mezzogiorno vero ${hhmm(c.s.mezzo + c.off)}</span><span style="--c:#d9925a">tramonto ${hhmm(c.s.tramonto + c.off)}</span>`;
    etich.querySelector('b').textContent = c.nome;
    etich.querySelector('span').textContent = c.s.polare === 'giorno' ? 'qui il sole non tramonta' : 'oggi l’alba alle ' + hhmm(c.s.alba + c.off);
    etMer.textContent = c.k === 'polo' ? 'tutti i meridiani' : 'meridiano ' + gradi(c.lon, 'E', 'O');
    video.pause(); partito = false; tFine = null;
    // il filmato di prima si spegne piano sopra la carta, poi si cambia
    if (subito || !opacPrima) { cambiaFilmato(c); opacPrima = 0; } else srcAttesa = c;
    preparaFermi(c, subito);
    preparaCiclo(t);
    disponi();
  }
  function cambiaFilmato(c) { srcAttesa = null; video.poster = OTTO_DIR + c.k + '.jpg'; video.src = c.video; try { video.currentTime = 0; } catch (e) {} oraFilm.prepara(c); }

  // ---------- un fotogramma ----------
  function cielo(h) {
    const T = [[-12, [14, 20, 32]], [-4, [52, 50, 72]], [0, [150, 112, 118]], [5, [205, 160, 132]], [14, [160, 182, 204]], [30, [172, 196, 220]]];
    for (let i = 1; i < T.length; i++) if (h <= T[i][0]) { const u = lim((h - T[i - 1][0]) / (T[i][0] - T[i - 1][0])); return T[i - 1][1].map((v, j) => Math.round(v + (T[i][1][j] - v) * u)); }
    return T[T.length - 1][1];
  }
  const luceDi = ev => `linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.35)), url("${OTTO_DIR + ev.o.k}/01.jpg") center / cover`;
  function fotogramma(t, uForzato) {
    const c = att, e = t - ciclo.t0;
    if (srcAttesa && e >= SPEGNI) cambiaFilmato(srcAttesa);
    let eEff = e, u = 0;
    if (e >= NOTTE) {
      if (uForzato != null) u = uForzato;
      else { if (!partito) { partito = true; if (video.src) video.play().catch(() => {}); }
        u = video.error ? (e - NOTTE) / ciclo.G : (video.currentTime || 0) / (video.duration || c.dur); }
      u = lim(u); eEff = NOTTE + u * ciclo.G;
      // finito il filmato resta sull'ultimo fotogramma; dopo la sosta tocca alla città più a ovest
      if (uForzato == null && (u >= .999 || video.ended)) { if (tFine == null) tFine = t; if (t - tFine > SOSTA) { vai(GIRO[(GIRO.indexOf(c) + 1) % GIRO.length], false, t); return; } }
    }
    const tau = tauDi(eEff), T = tau - c.off, h = c.s.alt(T);
    // l'ora dentro il filmato: prima che il filmato parta segna l'ora del suo primo fotogramma; mentre il filmato di prima si spegne non si tocca
    if (!srcAttesa) { const to = e >= NOTTE ? tau : ciclo.P; oraFilm.segna(to, arcoDi(to)); }
    // gli orologi: ognuno segna l'ora del suo luogo
    // (16/11: le scritte si riscrivono solo quando cambiano; riscriverle uguali a ogni fotogramma faceva rifare i conti a tutta la pagina)
    for (const k in celle) { const ce = celle[k], loc = T + ce.c.off, s = hhmm(loc); ce.o.segna(loc); if (s !== ce.scritta) { ce.scritta = s; ce.ora.textContent = s; } }
    if (grande) { grande.segna(tau);
      // il vetro: più scuro all'alba e al tramonto, più chiaro a mezzogiorno (la luce del giorno di oggi)
      const L = Math.round(lim((h + 4) / 30) * 100) / 100;
      if (L !== grande.luce && grande.vetro) { grande.luce = L; const col = cielo(h);
        grande.vetro.style.background = `radial-gradient(ellipse 60% 46% at 34% 26%, rgba(255,250,238,${(.06 + .34 * L).toFixed(3)}) 0%, rgba(255,250,238,0) 62%),` +
          `radial-gradient(circle at 50% 50%, rgba(${col.join(',')},${(.10 + .10 * L).toFixed(3)}) 0%, rgba(8,8,10,${(.12 + .5 * (1 - L)).toFixed(3)}) 100%)`;
        grande.foto.style.filter = `brightness(${(.7 + .36 * L).toFixed(3)})`; } }
    // le caselle: alternate, e si scambiano una alla volta durante il giorno (in giro, come una lancetta)
    const n = GIRO.length;
    for (const x of GIRO) { const ce = celle[x.k], passo = +ce.d.dataset.passo, base = passo % 2 === 1;
      const scambiata = passo > 0 && e >= NOTTE && u >= (passo - .5) / n;
      ce.d.classList.toggle('ot-attiva', passo === 0);
      ce.d.classList.toggle('ot-solo-nome', passo > 0 && (base !== scambiata)); }
    // le ore che coincidono: la casella si accende un attimo, e una riga lo dice
    let ultimo = null; const accese = new Set();
    for (const ev of ciclo.eventi) { const x = eEff - ev.e;
      const fo = x < 0 ? 0 : x < 300 ? x / 300 : x < 1500 ? 1 : x < 2900 ? 1 - (x - 1500) / 1400 : 0;
      if (fo > 0) { const ce = celle[ev.o.k]; if (ce) { accese.add(ev.o.k); ce.luce.style.opacity = (.85 * fo).toFixed(3); ce.luce.style.background = luceDi(ev); ce.bollo.textContent = FRASE(ev.tipo === 'sole' ? 'sole' : ev.tipo); ce.bollo.style.opacity = fo; } }
      if (x >= 0 && x < 3600) ultimo = ev; }
    for (const k in celle) if (!accese.has(k)) { celle[k].luce.style.opacity = 0; celle[k].bollo.style.opacity = 0; }
    if (ultimo) { const riga = ultimo.tipo === 'sole' ? `Qui tramonta; al Polo Sud il sole non tramonta.<small>sono le ${hhmm(ultimo.tau)} a ${c.nome}</small>` :
        `A ${ultimo.o.nome} ${ultimo.tipo === 'alba' ? 'sorge il sole' : ultimo.tipo === 'tramonto' ? 'tramonta il sole' : 'è mezzogiorno vero'}.<small>qui sono le ${hhmm(ultimo.tau)}</small>`;
      if (riga !== evento.dataset.riga) { evento.dataset.riga = riga; evento.innerHTML = riga; } evento.classList.add('ot-si'); }
    else evento.classList.remove('ot-si');
    // i fermo immagine: un gruppo per ogni quarto del filmato
    mostraGruppo(e >= NOTTE + 300 ? Math.min(3, Math.floor(u * 4)) : -1);
    carta(e);
  }

  // ---------- la carta: che cosa si vede a ogni istante della notte; poi il filmato al centro ----------
  function carta(e) {
    const c = att, polo = c.k === 'polo';
    const arriva = fase(e, 5900, 7100), va = fase(e, 6500, 7400);
    // il filmato: quello di prima si spegne, quello nuovo arriva quando la carta se ne va
    video.style.opacity = oraBox.style.opacity = (srcAttesa ? opacPrima * (1 - fase(e, 0, SPEGNI)) : arriva).toFixed(3);
    cv.style.opacity = (1 - va).toFixed(3);
    cv.style.visibility = va >= 1 ? 'hidden' : 'visible';
    // di giorno la carta non si disegna: la tela si nasconde e si stringe (una tela grande e vuota il controllo la ferma)
    if (va >= 1) { etich.style.opacity = 0; etMer.style.opacity = 0; if (cv.width > 2) cv.width = cv.height = 2; return; }
    const LW = Math.round(CW * DPR), LH = Math.round(CH * DPR); if (cv.width !== LW || cv.height !== LH) { cv.width = LW; cv.height = LH; }
    const fin = vistaPaese(c), nuovoCont = !contDisegnato || !prima || prima.cont !== c.cont;
    const cont = vistaContinente(c);
    const da = prima && prima !== c ? vistaPaese(prima) : { lon: cont.lon + 40, lat: cont.lat - 10, R: cont.R * .45 };
    let lon, lat, R;
    const s1 = dolce(fase(e, 0, 2800)), s2 = dolce(fase(e, 2600, 4600));
    if (nuovoCont) { const v = slerp(vett(da.lon, da.lat), vett(cont.lon, cont.lat), s1), m = slerp(v, vett(fin.lon, fin.lat), s2); [lon, lat] = lonlat(m);
      const Ra = Math.exp(Math.log(da.R) + (Math.log(cont.R) - Math.log(da.R)) * s1 - .5 * Math.sin(Math.PI * s1)); R = Math.exp(Math.log(Ra) + (Math.log(fin.R) - Math.log(Ra)) * s2); }
    else { const s = dolce(fase(e, 200, 3600)), v = slerp(vett(da.lon, da.lat), vett(fin.lon, fin.lat), s); [lon, lat] = lonlat(v);
      R = Math.exp(Math.log(da.R) + (Math.log(fin.R) - Math.log(da.R)) * s - .9 * Math.sin(Math.PI * s)); }
    if (polo) lat = Math.max(-89.999, lat);
    const v = vista(lon, lat, R * DPR); v.cx *= DPR; v.cy *= DPR;
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
    // il bordo della terra e la rete delle ore (un meridiano ogni 15°, un'ora di sole)
    g.globalAlpha = Math.max(.15, fase(e, 0, 800)); g.beginPath(); g.arc(v.cx, v.cy, v.R, 0, Math.PI * 2); g.strokeStyle = 'rgba(236,229,216,.12)'; g.lineWidth = DPR; g.stroke();
    disegna(GRIGLIA, v, 1, { colore: 'rgba(236,229,216,.055)', spessore: 1 });
    g.globalAlpha = 1;
    // il continente: le coste, linea dopo linea
    const pc = nuovoCont ? esce(fase(e, 300, 3100)) : 1;
    disegna(TERRA, v, pc, { colore: 'rgba(236,229,216,.5)', spessore: .9 }, nuovoCont);
    if (pc >= 1 && e > 3100 && mondoPronto) contDisegnato = true;
    // la rotta a puntini dalla città di prima
    if (prima && prima !== c && !nuovoCont) { const a = vett(prima.lon, prima.lat), b = vett(c.lon, c.lat), pr = esce(fase(e, 600, 3400));
      g.setLineDash([2 * DPR, 6 * DPR]); g.beginPath(); let su = false;
      for (let i = 0; i <= 60 * pr; i++) { const [lo, la] = lonlat(slerp(a, b, i / 60)); proietta(lo, la, v, P); if (P[2] < 0) { su = false; continue; } if (!su) { g.moveTo(P[0], P[1]); su = true; } else g.lineTo(P[0], P[1]); }
      g.strokeStyle = 'rgba(217,176,140,.7)'; g.lineWidth = 1.2 * DPR; g.stroke(); g.setLineDash([]); }
    // lo stato
    disegna(PAESI[c.paese], v, esce(fase(e, nuovoCont ? 2900 : 2200, nuovoCont ? 4700 : 4000)), { colore: 'rgba(217,176,140,.95)', spessore: 1.6 });
    // il meridiano: da nord a sud (al Polo, tutti)
    const pm = esce(fase(e, 4300, 5400));
    const merid = polo ? Array.from({ length: 24 }, (_, i) => i * 15 - 180) : [c.lon];
    let cima = null;
    merid.forEach((lo, j) => { const q = polo ? lim((fase(e, 3900, 5800) - j * .02) / .55) : pm; if (q <= 0) return;
      g.beginPath(); let su = false; const da2 = polo ? -2 : 89, a2 = -89.99, passi = 90;
      for (let i = 0; i <= passi * q; i++) { const la = da2 + (a2 - da2) * (i / passi); proietta(lo, la, v, P); if (P[2] < 0) { su = false; continue; }
        if (!su) { g.moveTo(P[0], P[1]); su = true; if (!cima && j === 0) cima = [P[0] / DPR, P[1] / DPR]; } else g.lineTo(P[0], P[1]); }
      g.strokeStyle = polo ? 'rgba(217,176,140,.55)' : 'rgba(217,176,140,.9)'; g.lineWidth = (polo ? 1 : 1.3) * DPR; g.shadowColor = 'rgba(217,176,140,.6)'; g.shadowBlur = polo ? 0 : 6 * DPR; g.stroke(); g.shadowBlur = 0; });
    // il puntino e il nome
    proietta(c.lon, polo ? -90 : c.lat, v, P); const px = P[0] / DPR, py = P[1] / DPR, pd = esce(fase(e, 5000, 5700));
    if (pd > 0 && P[2] >= 0) { g.beginPath(); g.arc(P[0], P[1], 4.2 * DPR * pd, 0, Math.PI * 2); g.fillStyle = '#ece5d8'; g.fill();
      const onda = fase(e, 5100, 6600); if (onda > 0 && onda < 1) { g.beginPath(); g.arc(P[0], P[1], (6 + 26 * onda) * DPR, 0, Math.PI * 2); g.strokeStyle = `rgba(217,176,140,${(.7 * (1 - onda)).toFixed(3)})`; g.lineWidth = DPR; g.stroke(); } }
    etich.style.transform = `translate(${(px + 14).toFixed(1)}px, ${(py - 12).toFixed(1)}px)`; etich.style.opacity = pd * (1 - fase(e, 6400, 7200));
    if (cima) etMer.style.transform = `translate(${(cima[0] + 8).toFixed(1)}px, ${(Math.max(6, cima[1]) + 4).toFixed(1)}px)`;
    etMer.style.opacity = pm * (1 - fase(e, 6400, 7200));
  }

  // ---------- il motore: parte quando la sezione si vede, si ferma quando esce ----------
  let corre = false, fermo = false, idGiro = 0;
  function giro(now) { if (!corre || fermo) return; fotogramma(now); idGiro = requestAnimationFrame(giro); }
  function avvia() { if (fermo) return; avviato = true; vai(att, false, performance.now(), true); prima = null; contDisegnato = false; corre = true; cancelAnimationFrame(idGiro); idGiro = requestAnimationFrame(giro); }
  function ferma() { corre = false; cancelAnimationFrame(idGiro); video.pause(); }
  new IntersectionObserver(voci => { for (const v of voci) { if (v.isIntersecting) { if (!corre) avvia(); } else if (corre) ferma(); } }, { threshold: .3 }).observe(radice);
  video.addEventListener('ended', () => video.pause());
  addEventListener('resize', () => misuraTutto());

  // per le prove: ferma tutto a «secondi» del filmato di una città (negativi = la carta, prima del filmato)
  OTTO.vaiA = (k, secondi = 0) => new Promise(ok => {
    const c = CITTA.find(x => x.k === k || x.nome === k) || att;
    fermo = true; corre = false; avviato = true; cancelAnimationFrame(idGiro); radice.classList.add('ot-fermo-tutto');
    prima = null; contDisegnato = false; att = null;
    const t0 = performance.now(); vai(c, false, t0, true); prima = null;
    const e = NOTTE + secondi * 1000, u = secondi >= 0 ? lim(secondi / c.dur) : 0;
    const finisci = () => { fotogramma(t0 + e, secondi >= 0 ? u : null); requestAnimationFrame(() => { fotogramma(t0 + e, secondi >= 0 ? u : null); setTimeout(ok, 120); }); };
    if (secondi < 0) { video.pause(); finisci(); return; }
    const vai2 = () => { video.pause(); video.addEventListener('seeked', finisci, { once: true }); try { video.currentTime = Math.min(secondi, (video.duration || c.dur) - .05); } catch (er) { finisci(); } };
    if (video.readyState >= 1) vai2(); else video.addEventListener('loadedmetadata', vai2, { once: true });
  });

  // prima di partire: tutto al suo posto, senza movimenti, sulla prima città all'alba (la carta nascosta finché non si disegna)
  cv.style.visibility = 'hidden'; cv.width = cv.height = 2; radice.classList.add('ot-fermo-tutto');
  misuraTutto();
  vai(att, false, performance.now(), true);
  for (const k in celle) { const ce = celle[k], loc = ciclo.A - att.off + ce.c.off; ce.o.segna(loc); ce.ora.textContent = hhmm(loc); }
  GIRO.forEach(x => { const ce = celle[x.k], passo = +ce.d.dataset.passo; ce.d.classList.toggle('ot-attiva', passo === 0); ce.d.classList.toggle('ot-solo-nome', passo % 2 === 1); });
  requestAnimationFrame(() => requestAnimationFrame(() => { if (!fermo) radice.classList.remove('ot-fermo-tutto'); }));
  // le foto intorno al filmato si controllano da sole a ogni avvio (15/11 notte): se la scelta o i posti sbagliano (una foto del filmato che va,
  // due uguali, una dietro il filmato) parte un errore che strumenti/foto-pagina.js vede, e la pagina non arriva a Franco
  setTimeout(() => { const sb = OTTO.controllaFermi(); if (sb.length) throw new Error('Otto meridiani, foto intorno al filmato: ' + sb.slice(0, 4).join(' | ')); }, 0);
  // la carta arriva da un file a parte (400 kB), così la pagina non aspetta
  const pronto = () => { prendiMondo(); OTTO.pronta = true; };
  if (window.MONDO) pronto();
  else { const s = document.createElement('script'); s.src = OTTO_DIR + 'mondo.js'; s.onload = pronto; s.onerror = () => { OTTO.pronta = true; }; document.head.appendChild(s); }
})();
