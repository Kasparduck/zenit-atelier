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
  const RAD = Math.PI / 180, calmo = matchMedia('(prefers-reduced-motion: reduce)').matches, TEL = matchMedia('(max-width: 860px)');
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

  // ---------- la costruzione ----------
  radice.setAttribute('aria-label', 'Otto meridiani: gli orologi della collezione e le loro città, dall’alba al tramonto');
  radice.textContent = '';
  const palco = el('div', 'ot-palco', radice);
  // (16/11: le cifre grandi sotto il quadrato, «08:00 · l'alba», non ci sono più: Franco non le capiva. L'ora adesso sta DENTRO il filmato, vedi oraFilm.)
  const colonna = el('div', 'ot-colonna', palco), ruota = el('div', 'ot-ruota', colonna);
  const lato = el('div', 'ot-lato', palco), scena = el('div', 'ot-scena', lato);
  let cv = el('canvas', 'ot-carta', scena);
  const video = el('video', 'ot-film', scena); video.muted = true; video.playsInline = true; video.preload = 'auto'; video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
  const oraBox = el('div', 'ot-ora', scena);   // l'ora dentro il filmato: sta esattamente sopra il filmato e si accende e si spegne con lui
  oraBox.setAttribute('aria-hidden', 'true');
  const etMer = el('div', 'ot-meridiano', scena), etich = el('div', 'ot-etichetta', scena, '<b></b><span></span>');
  const sotto = el('div', 'ot-sotto', lato), grandeBox = el('div', 'ot-grande', sotto), dida = el('div', 'ot-didascalia', sotto);
  const dN = el('span', 'ot-n', dida), dCitta = el('h2', 'ot-citta', dida), dAdesso = el('p', '', dida), dAllora = el('p', '', dida), dTempi = el('div', 'ot-tempi', dida), evento = el('div', 'ot-evento', dida);

  // TEL-FLUIDO 6 — cache dei valori emessi: nessuna lettura di stile calcolato.
  const ultimiStili = new WeakMap();
  function stile(nodo, campo, valore) {
    if (TEL.matches) {
      let ultimi = ultimiStili.get(nodo);
      if (!ultimi) ultimiStili.set(nodo, ultimi = {});
      if (ultimi[campo] === valore) return;
      ultimi[campo] = valore;
    } else ultimiStili.delete(nodo);
    nodo.style[campo] = valore;
  }
  // TEL-FLUIDO 1 — due strisce di cifre già dipinte, mosse sulla stessa ora delle lancette.
  const cifre = new WeakMap();
  function oraScritta(nodo, testo) {
    if (!TEL.matches) {
      cifre.delete(nodo);
      nodo.textContent = testo;
      return;
    }
    let parti = cifre.get(nodo);
    if (!parti) {
      nodo.textContent = '';
      const riga = el('span', 'ot-cifre', nodo);
      riga.setAttribute('aria-hidden', 'true');
      parti = [24, 60].map((quante, i) => {
        if (i) riga.append(':');
        const lista = el('span', 'ot-lista', el('span', 'ot-finestra', riga));
        lista.textContent = Array.from({ length: quante }, (_, n) => String(n).padStart(2, '0')).join('\n');
        return lista;
      });
      cifre.set(nodo, parti);
    }
    testo.split(':').forEach((valore, i) => {
      const lista = parti[i];
      if (lista.ultimo !== valore) {
        lista.ultimo = valore;
        lista.style.transform = 'translateY(-' + Number(valore) + 'lh)';
      }
    });
  }

  // TEL-FLUIDO 2 — rettangoli alpha dei WebP originali (x,y,w,h da ffmpeg alphaextract,bbox).
  // L'ordine è ore, minuti, secondi. Il margine protegge l'interpolazione al bordo.
  const ritagli = {
    bianco: [[306,644,161,109],[462,568,221,185],[475,879,85,19]],
    blu: [[636,383,127,97],[771,354,178,125]],
    cuoio: [[343,600,209,164],[435,548,300,246]],
    grafite: [[638,368,125,100],[776,339,177,126]],
    rubino: [[293,564,204,148],[424,500,275,218],[247,638,270,277]],
    subacqueo: [[644,383,117,85],[775,351,165,116],[621,412,200,213]],
    tigre: [[329,566,189,137],[502,532,248,171]],
    verde: [[629,358,130,96],[775,327,180,126]]
  };
  function manoPiccola(img, taglio, O, perno) {
    const [W, H] = O.f, x = taglio[0] - 4, y = taglio[1] - 4, w = taglio[2] + 8, h = taglio[3] + 8;
    const mano = el('span', 'ot-mano zenit-tieni');
    Object.assign(mano.style, { left: 100*x/W+'%', top: 100*y/H+'%', width: 100*w/W+'%', height: 100*h/H+'%',
      backgroundImage: 'url("' + img.src + '")', backgroundSize: 100*W/w+'% '+100*H/h+'%',
      backgroundPosition: 100*x/(W-w)+'% '+100*y/(H-h)+'%',
      transformOrigin: (perno[0]*W/100-x)*100/w+'% '+(perno[1]*H/100-y)*100/h+'%' });
    img.replaceWith(mano);
    return mano;
  }
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
    const originali = { ...L };
    let piccole = false;
    function formatoMani() {
      if (piccole === TEL.matches) return;
      piccole = TEL.matches;
      Object.keys(L).forEach((k, i) => {
        const img = originali[k], prima = L[k];
        if (piccole) {
          L[k] = manoPiccola(img, ritagli[nome][i], O, k === 'sec' && O.secO || O.perno);
          if (k === 'sec') L[k].classList.add('ot-secondi');
        }
        else { prima.replaceWith(img); L[k] = img; }
        L[k].style.transform = prima.style.transform;
      });
    }
    formatoMani();
    const o = { box, tela, foto, vetro: conVetro ? el('div', 'ot-vetro', tela) : null, O, luce: -1 };
    function formatoLuce(diametro) {
      if (!o.vetro) return;
      if (TEL.matches) {
        if (!o.chiara) {
          foto.style.filter = '';
          foto.classList.add('ot-foto-scura');
          // TEL-FLUIDO 7 — lo sfondo opaco comune conserva l'alpha del bordo.
          // La foto originale è il punto esatto a brightness(1), prima dei riflessi.
          o.chiara = el('div', 'ot-esposizione');
          foto.after(o.chiara);
          const normale = el('img', '', o.chiara); normale.alt = ''; normale.src = foto.src;
          o.alta = el('div', 'ot-esposizione ot-alta', o.chiara);
          const riflessi = el('img', '', o.alta); riflessi.alt = ''; riflessi.src = foto.src;
          o.vetro.style.background = ''; o.luce = -1;
        }
        preparaVetri(o.vetro, diametro);
      } else if (o.chiara) {
        o.chiara.remove(); o.chiara = null; foto.classList.remove('ot-foto-scura');
        o.vetro.replaceChildren(); o.luce = -1;
      }
    }
    o.misura = () => { formatoMani(); const W = box.clientWidth, H = box.clientHeight; if (!W || !H) return;
      const k = Math.min(W / O.f[0], H / O.f[1]), w = O.f[0] * k, h = O.f[1] * k;
      tela.style.width = w + 'px'; tela.style.height = h + 'px';
      if (o.vetro) { const r = O.r * w, cx = O.perno[0] / 100 * w, cy = O.perno[1] / 100 * h;
        Object.assign(o.vetro.style, { left: (cx - r) + 'px', top: (cy - r) + 'px', width: (2 * r) + 'px', height: (2 * r) + 'px' }); formatoLuce(2 * r); } };
    // locale = minuti dalla mezzanotte del suo luogo
    o.secondi = () => {
      if (L.sec) stile(L.sec, 'transform', `rotate(${(((Date.now() / 1000) % 60) * 6 - O.sec).toFixed(2)}deg)`);
    };
    o.segna = locale => { if (O.fisso) return;
      stile(L.ore, 'transform', `rotate(${(((locale / 60) % 12) * 30 - O.ore).toFixed(2)}deg)`);
      stile(L.min, 'transform', `rotate(${((locale % 60) * 6 - O.min).toFixed(2)}deg)`);
      o.secondi(); };
    return o;
  }

  // le caselle: A = 3×3, lo scheletrato al centro, la città di adesso a destra (verso il filmato), le altre in giro
  const celle = {};
  CITTA.forEach(c => { const d = el('div', 'ot-cella' + (c.fisso ? ' ot-fissa' : ''), ruota);
    // TEL-FLUIDO 9 — il bordo sfuma separatamente dalle lancette per gli stessi .6 s.
    const interno = el('div', 'ot-interno', d);
    const luce = el('div', 'ot-luce', interno), o = orologio(c.orologio, interno, false);
    const nm = el('div', 'ot-nome', interno, `<b>${c.nome}</b><span>${c.titolo}</span><i></i>`), bollo = el('div', 'ot-bollo', interno);
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
        if (v !== vis) {
          if (TEL.matches && ((vis === 0) !== (v === 0))) lan.classList.toggle('ot-sotto-orizzonte', v === 0);
          vis = v; lan.style.opacity = v;
        }
        const t = hhmm(tau); if (t !== testo || TEL.matches !== cifre.has(tondo)) { testo = t; oraScritta(tondo, t); } },
      // per le prove: che cosa segna adesso
      stato: () => ({ ora: testo, lancetta: px, visibile: vis, luogo: luogo.textContent }) };
  })();
  OTTO.oraFilm = () => oraFilm.stato();   // per le prove: OTTO.vaiA('venezia', 8).then(() => OTTO.oraFilm())

  // ---------- la carta: un globo visto da fuori, linee che si disegnano ----------
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
    // Anche prima del primo gruppo il controllo misura il CSS reale, senza caricare un JPEG.
    const presente = scena.querySelector('.ot-fermo'), campione = presente || el('img', 'ot-fermo', scena);
    const lw = campione.offsetWidth / W * 100, lh = campione.offsetHeight / H * 100;
    if (!presente) campione.remove();
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
  // TEL-FLUIDO 4 — il quartetto in riserva si decodifica fuori dal DOM.
  // Il riferimento all'oggetto invalida anche decode() lenti dopo un cambio città.
  let telefonoFoto = false, sceltaFoto, riservaFoto = null, richiesto = -1;
  function congedaFoto(foto, subito) {
    foto.forEach(im => {
      if (subito || calmo || !im.classList.contains('ot-si')) { im.remove(); return; }
      im.classList.remove('ot-si');
      if (im.entrata && im.entrata.playState === 'running') {
        im.entrata.reverse();
        im.entrata.finished.then(() => im.remove(), () => im.remove());
        return;
      }
      const fine = ev => { if (ev.propertyName === 'opacity') im.remove(); };
      im.addEventListener('transitionend', fine);
      setTimeout(() => im.remove(), 1850);
    });
  }
  function preparaFermi(c, subito) {
    richiesto = -1; riservaFoto = null;
    if (TEL.matches) {
      telefonoFoto = true;
      congedaFoto(fermi, subito);
      fermi = []; gruppoOra = -1; sceltaFoto = sceltaFermi(c);
      return;
    }
    telefonoFoto = false;
    const vecchi = fermi; vecchi.forEach(f => f.classList.remove('ot-si'));
    if (subito) vecchi.forEach(f => f.remove()); else setTimeout(() => vecchi.forEach(f => f.remove()), 2200);
    fermi = []; gruppoOra = -1;
    const scelta = sceltaFermi(c);
    for (let i = 0; i < 16; i++) { const im = el('img', 'ot-fermo'); im.alt = ''; im.decoding = 'async';
      im.src = OTTO_DIR + scelta[i].k + '/' + String(scelta[i].n).padStart(2, '0') + '.jpg';
      const [x, y] = POSTI[i >> 2][i & 3]; im.style.left = x + '%'; im.style.top = y + '%'; im.dataset.gruppo = i >> 2;
      scena.insertBefore(im, cv); fermi.push(im); }
  }
  function riservaGruppo(gr) {
    if (riservaFoto && riservaFoto.gr === gr) return;
    const gruppo = { gr, foto: [], pronto: false };
    riservaFoto = gruppo;
    const decodifiche = sceltaFoto.slice(gr * 4, gr * 4 + 4).map(({k, n}, i) => {
      const im = el('img', 'ot-fermo'), [x, y] = POSTI[gr][i];
      im.alt = ''; im.decoding = 'async'; im.dataset.gruppo = gr;
      im.style.left = x + '%'; im.style.top = y + '%';
      gruppo.foto.push(im);
      const carica = new Promise(ok => { im.onload = () => ok(true); im.onerror = () => ok(false); });
      im.src = OTTO_DIR + k + '/' + String(n).padStart(2, '0') + '.jpg';
      return im.decode ? im.decode().then(() => true, () => carica) : carica;
    });
    gruppo.attesa = Promise.all(decodifiche).then(esiti => {
      if (riservaFoto !== gruppo || !esiti.every(Boolean)) return;
      gruppo.pronto = true;
      if (richiesto === gr) entraGruppo(gruppo);
    });
  }
  function entraGruppo(gruppo) {
    congedaFoto(fermi, fermo);
    fermi = gruppo.foto; gruppoOra = gruppo.gr; riservaFoto = null;
    for (const im of fermi) {
      scena.insertBefore(im, cv);
      im.classList.add('ot-si');
      if (!fermo && !calmo) im.entrata = im.animate([
        { opacity: 0, transform: 'translateY(10px)' }, { opacity: .46, transform: 'none' }
      ], { duration: 1800, easing: 'ease' });
    }
  }
  function mostraGruppo(gr, u) {
    if (telefonoFoto !== TEL.matches) preparaFermi(att, true);
    if (telefonoFoto) {
      richiesto = gr;
      if (gr >= 0 && gr !== gruppoOra) {
        riservaGruppo(gr);
        if (riservaFoto && riservaFoto.pronto) entraGruppo(riservaFoto);
      } else if (!fermo) {
        // Anticipo di due secondi sul tempo del filmato; solo il gruppo immediatamente successivo.
        if (gr < 0) riservaGruppo(0);
        else if (gr < 3 && ((gr + 1) / 4 - u) * att.dur <= 2) riservaGruppo(gr + 1);
      }
      return;
    }
    if (gr === gruppoOra) return; gruppoOra = gr;
    fermi.forEach(f => f.classList.toggle('ot-si', +f.dataset.gruppo === gr));
  }

  // ---------- la sequenza di una città: notte (la carta), giorno (il filmato), sosta ----------
  // IL TEMPO DELLA CARTA (Franco, 20/11: «Ma dai tempo di vedere sta cazzo di mappa»): la carta si disegna una volta e mezza più piano (LENTA)
  // e, finita, resta ferma SOSTA_CARTA ms prima che arrivi il filmato. A0 = quando il filmato comincia ad arrivare (prima 5900 ms).
  const LENTA = calmo ? 1 : 1.5, SOSTA_CARTA = calmo ? 0 : 2500, A0 = Math.round(5900 * LENTA + SOSTA_CARTA), FINE_CARTA = A0 + 1500;
  const NOTTE = calmo ? 1200 : A0 + 1300, SOSTA = 2200, SPEGNI = 1200;
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
    invalidaCarta(); etichetteCarta = null;
    prima = att === c ? null : att; att = c;
    if (!prima || prima.cont !== c.cont) contDisegnato = false;
    if (!TEL.matches || !grande || grande.citta !== c) {
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
      grande.citta = c;
    }
    ultimoTempo = NaN; sostaFilm(false);
    video.pause(); partito = false; tFine = null;
    // il filmato di prima si spegne piano sopra la carta, poi si cambia
    if (subito || !opacPrima) { cambiaFilmato(c); opacPrima = 0; } else srcAttesa = c;
    preparaFermi(c, subito);
    preparaCiclo(t);
    disponi();
    programmaMisuraEtichette();
  }
  function cambiaFilmato(c) {
    srcAttesa = null;
    if (!TEL.matches || video.src !== c.video) {
      video.poster = OTTO_DIR + c.k + '.jpg'; video.src = c.video; oraFilm.prepara(c);
    }
    try { video.currentTime = 0; } catch (e) {}
  }

  // ---------- un fotogramma ----------
  function cielo(h) {
    const T = [[-12, [14, 20, 32]], [-4, [52, 50, 72]], [0, [150, 112, 118]], [5, [205, 160, 132]], [14, [160, 182, 204]], [30, [172, 196, 220]]];
    for (let i = 1; i < T.length; i++) if (h <= T[i][0]) { const u = lim((h - T[i - 1][0]) / (T[i][0] - T[i - 1][0])); return T[i - 1][1].map((v, j) => Math.round(v + (T[i][1][j] - v) * u)); }
    return T[T.length - 1][1];
  }
  // TEL-FLUIDO 5 — il vetro ha già 101 gradini di luce. Li dipingiamo una volta
  // alla risoluzione del piccolo quadrante; la finestra sceglie la posa con transform.
  // Le caselle aggiuntive conservano le tinte prima dell'alba e in pieno sole.
  let tavolaVetri, latoVetro = 0;
  function preparaVetri(vetro, diametro) {
    const lato = Math.ceil(diametro * Math.min(2, devicePixelRatio || 1));
    if (!tavolaVetri) tavolaVetri = el('canvas', 'ot-vetri');
    if (lato > latoVetro) {
      latoVetro = lato;
      const foglio = tavolaVetri;
      foglio.width = foglio.height = 11 * lato;
      const ctx = foglio.getContext('2d');
      for (let i = 0; i < 115; i++) {
        const L = i <= 100 ? i / 100 : i < 110 ? 0 : 1;
        const h = i <= 100 ? 30 * L - 4 : i < 110 ? i - 113 : i - 84;
        ctx.save();
        ctx.translate(i % 11 * lato, Math.floor(i / 11) * lato);
        ctx.scale(lato, lato);
        const fondo = ctx.createRadialGradient(.5,.5,0,.5,.5,Math.SQRT1_2);
        fondo.addColorStop(0, 'rgba(' + cielo(h) + ',' + (.10 + .10 * L) + ')');
        fondo.addColorStop(1, 'rgba(8,8,10,' + (.12 + .5 * (1-L)) + ')');
        ctx.fillStyle = fondo; ctx.fillRect(0,0,1,1);
        ctx.translate(.34,.26); ctx.scale(.60,.46);
        const riflesso = ctx.createRadialGradient(0,0,0,0,0,.62);
        riflesso.addColorStop(0, 'rgba(255,250,238,' + (.06 + .34 * L) + ')');
        riflesso.addColorStop(1, 'rgba(255,250,238,0)');
        ctx.fillStyle = riflesso; ctx.fillRect(-.34/.60,-.26/.46,1/.60,1/.46);
        ctx.restore();
      }
    }
    if (tavolaVetri.parentNode !== vetro) vetro.appendChild(tavolaVetri);
  }
  function posaVetro(o, h, L) {
    const i = L === 0 ? 113 + Math.round(lim(h,-12,-4)) :
      L === 1 ? 84 + Math.round(lim(h,26,30)) : Math.round(100 * L);
    tavolaVetri.style.transform = 'translate(' + (-100*(i%11)/11) + '%, ' + (-100*Math.floor(i/11)/11) + '%)';
    const luminosita = .7 + .36 * L;
    stile(o.chiara, 'opacity', lim((luminosita - .7) / .3));
    stile(o.alta, 'opacity', lim((luminosita - 1) / .06));
    const parte = luminosita <= .7 ? 'buio' : luminosita < 1 ? 'sale' : luminosita < 1.06 ? 'riflessi' : 'piena';
    if (o.chiara.dataset.luce !== parte) o.chiara.dataset.luce = parte;
    const varia = L > 0 && L < 1;
    if (o.vetro.varia !== varia) { o.vetro.varia = varia; o.vetro.classList.toggle('ot-varia', varia); }
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
    const telefono = TEL.matches && !fermo;
    const vediRuota = !telefono || !lontani.has(ruota), vediGrande = !telefono || !lontani.has(grandeBox);
    const vediScena = !telefono || !lontani.has(scena);
    if (telefono && e >= Math.max(FINE_CARTA, NOTTE + 300) && ultimoTempo === eEff) {
      if (vediRuota) for (const ce of Object.values(celle)) {
        if (!ce.nome || t - ce.cambio < 900) ce.o.secondi();
      }
      if (vediGrande && grande) grande.secondi();
      return;
    }
    ultimoTempo = e >= Math.max(FINE_CARTA, NOTTE + 300) ? eEff : NaN;
    const tau = tauDi(eEff), T = tau - c.off, h = c.s.alt(T);
    // l'ora dentro il filmato: prima che il filmato parta segna l'ora del suo primo fotogramma; mentre il filmato di prima si spegne non si tocca
    if (!srcAttesa && vediScena) { const to = e >= NOTTE ? tau : ciclo.P; oraFilm.segna(to, arcoDi(to)); }
    // gli orologi: ognuno segna l'ora del suo luogo
    // (16/11: le scritte si riscrivono solo quando cambiano; riscriverle uguali a ogni fotogramma faceva rifare i conti a tutta la pagina)
    // le caselle: alternate, e si scambiano una alla volta durante il giorno (in giro, come una lancetta)
    // (18/11/2026, fluidità) lo scambio si decide PRIMA di scrivere ore e lancette: una casella mostra o l'orologio o il nome con l'ora, e ciò che è
    // nascosto non si riscrive (misurato sul telefono lento: nove ore riscritte a fotogramma erano nove pezzi ridisegnati a fotogramma). Ciò che
    // sta svanendo (0,9 s) si aggiorna ancora per un secondo; ciò che ricompare è aggiornato nello stesso fotogramma in cui comincia a comparire.
    const n = GIRO.length;
    for (const x of GIRO) { const ce = celle[x.k], passo = +ce.d.dataset.passo, base = passo % 2 === 1;
      const scambiata = passo > 0 && e >= NOTTE && u >= (passo - .5) / n, nome = passo > 0 && (base !== scambiata);
      if (ce.attiva !== (passo === 0)) {
        ce.attiva = passo === 0; ce.d.classList.toggle('ot-attiva', ce.attiva);
      }
      if (nome !== ce.nome) {
        ce.nome = nome; ce.cambio = t; ce.d.classList.toggle('ot-solo-nome', nome);
      } }
    if (vediRuota) for (const k in celle) { const ce = celle[k], loc = T + ce.c.off, fresco = ce.cambio == null || Math.abs(t - ce.cambio) < 1000;
      if (!ce.nome || fresco) ce.o.segna(loc);
      if (ce.nome || (fresco && !ce.c.fisso)) { const s = hhmm(loc); if (s !== ce.scritta || TEL.matches !== cifre.has(ce.ora)) { ce.scritta = s; oraScritta(ce.ora, s); } } }
    if (grande && vediGrande) { grande.segna(tau);
      // il vetro: più scuro all'alba e al tramonto, più chiaro a mezzogiorno (la luce del giorno di oggi)
      const L = Math.round(lim((h + 4) / 30) * 100) / 100;
      if (TEL.matches && grande.chiara) {
        if (L !== grande.luce) { grande.luce = L; posaVetro(grande, h, L); }
      } else if (!TEL.matches && L !== grande.luce && grande.vetro) { grande.luce = L; const col = cielo(h);
        grande.vetro.style.background = `radial-gradient(ellipse 60% 46% at 34% 26%, rgba(255,250,238,${(.06 + .34 * L).toFixed(3)}) 0%, rgba(255,250,238,0) 62%),` +
          `radial-gradient(circle at 50% 50%, rgba(${col.join(',')},${(.10 + .10 * L).toFixed(3)}) 0%, rgba(8,8,10,${(.12 + .5 * (1 - L)).toFixed(3)}) 100%)`;
        grande.foto.style.filter = `brightness(${(.7 + .36 * L).toFixed(3)})`; } }
    // le ore che coincidono: la casella si accende un attimo, e una riga lo dice
    let ultimo = null; const accese = new Set();
    for (const ev of ciclo.eventi) { const x = eEff - ev.e;
      const fo = x < 0 ? 0 : x < 300 ? x / 300 : x < 1500 ? 1 : x < 2900 ? 1 - (x - 1500) / 1400 : 0;
      if (fo > 0) { const ce = celle[ev.o.k]; if (ce) {
        accese.add(ev.o.k);
        if (!TEL.matches || !ce.sfondo) { ce.luce.style.background = luceDi(ev); ce.sfondo = true; }
        const parola = FRASE(ev.tipo);
        if (!TEL.matches || ce.parola !== parola) { ce.parola = parola; ce.bollo.textContent = parola; }
        if (!TEL.matches || ce.fo !== fo) {
          if (TEL.matches && !ce.fo) ce.d.classList.add('ot-incontro');
          ce.fo = fo; ce.luce.style.opacity = (.85 * fo).toFixed(3); ce.bollo.style.opacity = fo;
        }
      } }
      if (x >= 0 && x < 3600) ultimo = ev; }
    for (const k in celle) if (!accese.has(k)) {
      const ce = celle[k];
      if (!TEL.matches || ce.fo) {
        ce.fo = 0; ce.luce.style.opacity = 0; ce.bollo.style.opacity = 0;
        if (TEL.matches) ce.d.classList.remove('ot-incontro');
      }
    }
    if (ultimo) { const riga = ultimo.tipo === 'sole' ? `Qui tramonta; al Polo Sud il sole non tramonta.<small>sono le ${hhmm(ultimo.tau)} a ${c.nome}</small>` :
        `A ${ultimo.o.nome} ${ultimo.tipo === 'alba' ? 'sorge il sole' : ultimo.tipo === 'tramonto' ? 'tramonta il sole' : 'è mezzogiorno vero'}.<small>qui sono le ${hhmm(ultimo.tau)}</small>`;
      if (riga !== evento.dataset.riga) { evento.dataset.riga = riga; evento.innerHTML = riga; } }
    if (!TEL.matches || evento.acceso !== !!ultimo) {
      evento.acceso = !!ultimo; evento.classList.toggle('ot-si', !!ultimo);
    }
    // i fermo immagine: un gruppo per ogni quarto del filmato
    mostraGruppo(e >= NOTTE + 300 ? Math.min(3, Math.floor(u * 4)) : -1, u);
    if (!vediScena && e > 3100 * LENTA && window.MONDO) contDisegnato = true;
    if (vediScena || e >= FINE_CARTA) carta(e);
  }

  // ---------- la carta: che cosa si vede a ogni istante della notte; poi il filmato al centro ----------
  // TEL-FLUIDO 1 — misura dopo impaginazione e traduzione, fuori da giro().
  const larghe = { e: 0, m: 0 };
  let misuraEtichette = 0;
  function programmaMisuraEtichette() {
    if (!TEL.matches || misuraEtichette) return;
    misuraEtichette = requestAnimationFrame(() => {
      misuraEtichette = 0;
      larghe.e = etich.offsetWidth;
      larghe.m = etMer.offsetWidth;
    });
  }
  document.addEventListener('lingua', programmaMisuraEtichette);
  if (document.fonts) document.fonts.ready.then(programmaMisuraEtichette);

  // TEL-FLUIDO 3 — lo stesso disegno alimenta la tela desktop e la tela del worker.
  // Il modulo è autosufficiente anche quando il sito è aperto dal disco.
  function incisore(cv, lim, fase, dolce, esce) {
    const RAD = Math.PI / 180, g = cv.getContext('2d');
    const anelli = a => a.map(r => { const f = new Float32Array(r.length), w = new Float64Array(r.length / 2 * 3); let sx = 0, sy = 0, sz = 0;
      for (let i = 0; i < r.length; i += 2) { f[i] = r[i] / 100; f[i + 1] = r[i + 1] / 100; const l = f[i] * RAD, p = f[i + 1] * RAD, j = i / 2 * 3;
        w[j] = Math.cos(p) * Math.cos(l); w[j + 1] = Math.cos(p) * Math.sin(l); w[j + 2] = Math.sin(p); sx += w[j]; sy += w[j + 1]; sz += w[j + 2]; }
      const n = Math.hypot(sx, sy, sz) || 1; f.c = [sx / n, sy / n, sz / n]; f.v = w; return f; });
    let TERRA = [], PAESI = {};
    const RETE = [];
    for (let lo = -180; lo < 180; lo += 15) { const r = []; for (let la = -88; la <= 88; la += 2) r.push(lo * 100, la * 100); RETE.push(r); }
    for (let la = -75; la <= 75; la += 15) { const r = []; for (let lo = -180; lo <= 180; lo += 3) r.push(lo * 100, la * 100); RETE.push(r); }
    const GRIGLIA = anelli(RETE);
    let mondoPronto = false;
    function mondo(dati) {
      if (!dati || mondoPronto) return;
      TERRA = anelli(dati.terra);
      for (const k in dati.paesi) PAESI[k] = anelli(dati.paesi[k]);
      mondoPronto = true; viste.clear();
    }
    const vett = (lon, lat) => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD)];
    const lonlat = v => [Math.atan2(v[1], v[0]) / RAD, Math.asin(lim(v[2], -1, 1)) / RAD];
    function slerp(a, b, s) { const d = lim(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1), w = Math.acos(d);
      if (w < 1e-4) return a.slice(); const sa = Math.sin((1 - s) * w) / Math.sin(w), sb = Math.sin(s * w) / Math.sin(w);
      return [a[0] * sa + b[0] * sb, a[1] * sa + b[1] * sb, a[2] * sa + b[2] * sb]; }


    let CW = 0, CH = 0, DPR = 1;
    const viste = new Map();
    function proietta(lon, lat, v, out) {
      const l = (lon - v.lon0) * RAD, p = lat * RAD, cp = Math.cos(p), sp = Math.sin(p), cl = Math.cos(l);
      out[0] = v.cx + v.R * cp * Math.sin(l); out[1] = v.cy - v.R * (v.c0 * sp - v.s0 * cp * cl); out[2] = v.s0 * sp + v.c0 * cp * cl; }
    const vista = (lon0, lat0, R) => ({ lon0, lat0, R, s0: Math.sin(lat0 * RAD), c0: Math.cos(lat0 * RAD), cx: CW / 2, cy: CH / 2 });
    const P = [0, 0, 0];
    function disegna(lista, v, prog, stile, ritardo) {
      if (prog <= 0 || !lista) return;
      const cx = vett(v.lon0, v.lat0);
      // (18/11/2026, fluidità: misurato sul telefono lento, la carta teneva occupati pagina e scheda grafica per sette secondi a ogni città)
      // 1. la proiezione di proietta() scritta con i vettori già pronti dei punti (f.v): est, nord e profondità della vista, due somme per punto;
      // 2. un tratto con tutti e due i capi fuori dalla tela DALLA STESSA PARTE non si vede e non si manda alla scheda grafica (con la carta
      //    stretta su un paese quasi tutte le coste del mondo sono fuori). Il margine (32 punti veri) è più largo di ogni spessore e di ogni punta.
      // Ciò che si vede è lo stesso: stessi punti, stessi tratti dentro la tela.
      const l0 = v.lon0 * RAD, sl = Math.sin(l0), cl = Math.cos(l0), nx = -v.s0 * cl, ny = -v.s0 * sl, nz = v.c0, zx = v.c0 * cl, zy = v.c0 * sl, zz = v.s0;
      const R = v.R, ox = v.cx, oy = v.cy, M = 32, XM = cv.width + M, YM = cv.height + M;
      g.beginPath();
      for (let a = 0; a < lista.length; a++) { const f = lista[a], w = f.v;
        if (f.c && f.c[0] * cx[0] + f.c[1] * cx[1] + f.c[2] * cx[2] < -0.25) continue;
        const n = f.length / 2, q = ritardo ? lim((prog - (a % 7) * .03) / .82) : prog, m = Math.floor(n * q);
        if (m < 2) continue;
        let c = false, aperto = false, lx = 0, ly = 0, prec = 0;   // c'è un punto prima; il tratto fino a lui è nel disegno; dov'era; da che parte era fuori
        for (let i = 0, j = 0; i < m; i++, j += 3) { const X = w[j], Y = w[j + 1], Z = w[j + 2];
          if (zx * X + zy * Y + zz * Z < 0) { c = false; aperto = false; continue; }
          const px = ox + R * (cl * Y - sl * X), py = oy - R * (nx * X + ny * Y + nz * Z), fuori = (px < -M ? 1 : px > XM ? 2 : 0) | (py < -M ? 4 : py > YM ? 8 : 0);
          if (c && !(fuori & prec)) { if (!aperto) g.moveTo(lx, ly); g.lineTo(px, py); aperto = true; } else aperto = false;
          c = true; lx = px; ly = py; prec = fuori; } }
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

    // TEL-FLUIDO 10 — una sola copia della vista ferma. Prima conserva le coste,
    // poi anche i meridiani completi. Il puntino e l'onda restano sopra.
    let fondo = null, versioneFondo, conRotta, meridianiFiniti, cimaFerma;
    function salvaFondo() {
      if (!fondo) fondo = new OffscreenCanvas(cv.width, cv.height);
      const ctx = fondo.getContext('2d');
      ctx.globalCompositeOperation = 'copy'; ctx.drawImage(cv, 0, 0);
    }
    function disegnaVista(stato) {
      const { c, prima } = stato, e = stato.e / (stato.lenta || 1), polo = c.k === 'polo';   // il tempo della carta, rallentato (LENTA)
      let contDisegnato = stato.contDisegnato;
      if (CW !== stato.W || CH !== stato.H || DPR !== stato.dpr) {
        CW = stato.W; CH = stato.H; DPR = stato.dpr; viste.clear();
      }
      const LW = Math.round(CW * DPR), LH = Math.round(CH * DPR); if (cv.width !== LW || cv.height !== LH) { cv.width = LW; cv.height = LH; }
      const fin = vistaPaese(c), nuovoCont = !contDisegnato || !prima || prima.cont !== c.cont;
      const cont = vistaContinente(c);
      // IL MONDO INTERO PRIMA (Franco, 20/11: «il mondo puoi anche ingrandirlo dopo e tagliarlo per inquadrare lo stato, ma all'inizio è intero
      // e poi fai lo zoom»): alla prima città il disco parte intero dentro la tela (0,48 del lato corto), centrato sul continente; le coste si
      // disegnano sul mondo intero, poi lo zoom va dritto sul continente e sullo stato. Il resto della carta è quello di prima («all'inizio era
      // più bella, volevo la correggessi, non che la deturpassi»): solo più lenta (LENTA) e ferma più a lungo prima del filmato (SOSTA_CARTA).
      const primo = !prima;
      const da = prima && prima !== c ? vistaPaese(prima) : { lon: cont.lon, lat: cont.lat, R: Math.min(CW, CH) * .48 };
      let lon, lat, R;
      const s1 = dolce(primo ? fase(e, 1800, 3200) : fase(e, 0, 2800)), s2 = dolce(primo ? fase(e, 3100, 4600) : fase(e, 2600, 4600));
      if (nuovoCont) { const v = slerp(vett(da.lon, da.lat), vett(cont.lon, cont.lat), s1), m = slerp(v, vett(fin.lon, fin.lat), s2); [lon, lat] = lonlat(m);
        const Ra = Math.exp(Math.log(da.R) + (Math.log(cont.R) - Math.log(da.R)) * s1 - (primo ? 0 : .5) * Math.sin(Math.PI * s1)); R = Math.exp(Math.log(Ra) + (Math.log(fin.R) - Math.log(Ra)) * s2); }
      else { const s = dolce(fase(e, 200, 3600)), v = slerp(vett(da.lon, da.lat), vett(fin.lon, fin.lat), s); [lon, lat] = lonlat(v);
        R = Math.exp(Math.log(da.R) + (Math.log(fin.R) - Math.log(da.R)) * s - .9 * Math.sin(Math.PI * s)); }
      if (polo) lat = Math.max(-89.999, lat);
      const v = vista(lon, lat, R * DPR); v.cx *= DPR; v.cy *= DPR;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
      const conserva = stato.copia != null && typeof OffscreenCanvas !== 'undefined' && e >= (nuovoCont ? 4700 : 4000);
      if (!conserva || versioneFondo !== stato.copia || conRotta !== !nuovoCont) fondo = null;
      if (fondo) {
        g.drawImage(fondo, 0, 0);
        if (mondoPronto) contDisegnato = true;
      } else {
        // il bordo della terra e la rete delle ore (un meridiano ogni 15°, un'ora di sole)
        g.globalAlpha = Math.max(.15, fase(e, 0, 800)); g.beginPath(); g.arc(v.cx, v.cy, v.R, 0, Math.PI * 2); g.strokeStyle = 'rgba(236,229,216,.12)'; g.lineWidth = DPR; g.stroke();
        disegna(GRIGLIA, v, 1, { colore: 'rgba(236,229,216,.055)', spessore: 1 });
        g.globalAlpha = 1;
        // il continente: le coste, linea dopo linea
        const pc = nuovoCont ? esce(primo ? fase(e, 200, 1600) : fase(e, 300, 3100)) : 1;
        disegna(TERRA, v, pc, { colore: 'rgba(236,229,216,.5)', spessore: .9 }, nuovoCont);
        if (pc >= 1 && e > 3100 && mondoPronto) contDisegnato = true;
        // la rotta a puntini dalla città di prima
        if (prima && prima !== c && !nuovoCont) { const a = vett(prima.lon, prima.lat), b = vett(c.lon, c.lat), pr = esce(fase(e, 600, 3400));
          g.setLineDash([2 * DPR, 6 * DPR]); g.beginPath(); let su = false;
          for (let i = 0; i <= 60 * pr; i++) { const [lo, la] = lonlat(slerp(a, b, i / 60)); proietta(lo, la, v, P); if (P[2] < 0) { su = false; continue; } if (!su) { g.moveTo(P[0], P[1]); su = true; } else g.lineTo(P[0], P[1]); }
          g.strokeStyle = 'rgba(217,176,140,.7)'; g.lineWidth = 1.2 * DPR; g.stroke(); g.setLineDash([]); }
        // lo stato
        disegna(PAESI[c.paese], v, esce(fase(e, nuovoCont ? 2900 : 2200, nuovoCont ? 4700 : 4000)), { colore: 'rgba(217,176,140,.95)', spessore: 1.6 });
        meridianiFiniti = false;
        if (conserva) { versioneFondo = stato.copia; conRotta = !nuovoCont; salvaFondo(); }
      }
      // il meridiano: da nord a sud (al Polo, tutti)
      const pm = esce(fase(e, 4300, 5400));
      const merid = polo ? Array.from({ length: 24 }, (_, i) => i * 15 - 180) : [c.lon];
      let cima = meridianiFiniti ? cimaFerma : null;
      if (!meridianiFiniti) merid.forEach((lo, j) => { const q = polo ? lim((fase(e, 3900, 5800) - j * .02) / .55) : pm; if (q <= 0) return;
        g.beginPath(); let su = false; const da2 = polo ? -2 : 89, a2 = -89.99, passi = 90;
        for (let i = 0; i <= passi * q; i++) { const la = da2 + (a2 - da2) * (i / passi); proietta(lo, la, v, P); if (P[2] < 0) { su = false; continue; }
          if (!su) { g.moveTo(P[0], P[1]); su = true; if (!cima && j === 0) cima = [P[0] / DPR, P[1] / DPR]; } else g.lineTo(P[0], P[1]); }
        g.strokeStyle = polo ? 'rgba(217,176,140,.55)' : 'rgba(217,176,140,.9)'; g.lineWidth = (polo ? 1 : 1.3) * DPR; g.shadowColor = 'rgba(217,176,140,.6)'; g.shadowBlur = polo ? 0 : 6 * DPR; g.stroke(); g.shadowBlur = 0; });
      if (conserva && !meridianiFiniti && e >= (polo ? 5800 : 5400)) {
        salvaFondo(); meridianiFiniti = true; cimaFerma = cima;
      }
      // il puntino e il nome
      proietta(c.lon, polo ? -90 : c.lat, v, P); const px = P[0] / DPR, py = P[1] / DPR, pd = esce(fase(e, 5000, 5700));
      if (pd > 0 && P[2] >= 0) { g.beginPath(); g.arc(P[0], P[1], 4.2 * DPR * pd, 0, Math.PI * 2); g.fillStyle = '#ece5d8'; g.fill();
        const onda = fase(e, 5100, 6600); if (onda > 0 && onda < 1) { g.beginPath(); g.arc(P[0], P[1], (6 + 26 * onda) * DPR, 0, Math.PI * 2); g.strokeStyle = `rgba(217,176,140,${(.7 * (1 - onda)).toFixed(3)})`; g.lineWidth = DPR; g.stroke(); } }

      return { px, py, cima, contDisegnato };
    }
    return { mondo, disegna: disegnaVista, riposa() { fondo = null; cv.width = cv.height = 2; } };
  }

  // TEL-FLUIDO 7 — la grande ombra del video è un bitmap alla misura della scena.
  // La decodifica dei fotogrammi non coinvolge il pennello sfocato.
  let ombraFilm = null;
  function misuraOmbra(w, h, dpr) {
    if (!TEL.matches) { if (ombraFilm) ombraFilm.remove(); ombraFilm = null; return; }
    if (!w || !h) return;
    if (!ombraFilm) {
      ombraFilm = el('canvas', 'ot-ombra-film');
      ombraFilm.setAttribute('aria-hidden', 'true'); scena.insertBefore(ombraFilm, video);
    }
    ombraFilm.width = Math.round(w * dpr); ombraFilm.height = Math.round(h * dpr);
    const ctx = ombraFilm.getContext('2d');
    // Stesso riquadro (24% + 52%) e stessa ombra esterna del CSS desktop.
    const x = ombraFilm.width * .24, y = ombraFilm.height * .24, fw = ombraFilm.width * .52, fh = ombraFilm.height * .52;
    ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 46 * dpr; ctx.shadowOffsetY = 18 * dpr;
    ctx.fillRect(x, y, fw, fh); ctx.clearRect(x, y, fw, fh);
  }
  let CW = 0, CH = 0, DPR = 1, versioneCarta = 0, ultimaPosa = -1;
  let penna = null, operaio = null, occupato = false, guastoWorker = false;
  let etichetteCarta = null, attesaDisegno = Promise.resolve(), chiudiDisegno = null;
  function misuraCarta() {
    const w = scena.clientWidth, h = scena.clientHeight, d = Math.min(2, devicePixelRatio || 1);
    if (CW !== w || CH !== h || DPR !== d || TEL.matches !== !!ombraFilm) {
      CW = w; CH = h; DPR = d; misuraOmbra(w, h, d); invalidaCarta();
    }
  }
  function invalidaCarta() { versioneCarta++; ultimaPosa = -1; }
  function prendiMondo() {
    if (!TEL.matches && !penna) preparaPenna();
    if (operaio) operaio.postMessage({ mondo: window.MONDO });
    if (penna) penna.mondo(window.MONDO);
    invalidaCarta();
  }
  function messaggiCarta(ev) {
    const m = ev.data;
    if (m.tela) self.penna = incisore(m.tela, lim, fase, dolce, esce);
    if (m.mondo) self.penna.mondo(m.mondo);
    if (m.riposa) self.penna.riposa();
    if (m.vista) self.postMessage({ versione: m.versione, punti: self.penna.disegna(m.vista) });
  }
  function nuovaTela() {
    const nuova = el('canvas', 'ot-carta');
    nuova.style.cssText = cv.style.cssText;
    cv.replaceWith(nuova); cv = nuova; penna = null;
    invalidaCarta();
  }
  function terminaOperaio() {
    if (operaio) operaio.terminate();
    operaio = null; occupato = false;
    if (chiudiDisegno) chiudiDisegno();
    chiudiDisegno = null;
    nuovaTela();
  }
  function preparaPenna() {
    if (operaio && !TEL.matches) terminaOperaio();
    if (TEL.matches && !guastoWorker && !operaio && window.Worker && cv.transferControlToOffscreen) {
      let url;
      try {
        if (penna) nuovaTela();
        const codice = 'const lim=' + lim + ', fase=' + fase + ', dolce=' + dolce + ', esce=' + esce + ';\n'
          + incisore.toString() + '\nself.onmessage=' + messaggiCarta + ';';
        url = URL.createObjectURL(new Blob([codice], { type: 'text/javascript' }));
        operaio = new Worker(url);
        const tela = cv.transferControlToOffscreen();
        operaio.postMessage({ tela, mondo: window.MONDO }, [tela]);
        operaio.onmessage = ({data}) => {
          occupato = false;
          if (data.versione === versioneCarta) {
            etichetteCarta = data.punti; contDisegnato = data.punti.contDisegnato;
          }
          if (chiudiDisegno) chiudiDisegno();
          chiudiDisegno = null;
        };
        operaio.onerror = () => { guastoWorker = true; terminaOperaio(); };
      } catch { guastoWorker = true; terminaOperaio(); }
      finally { if (url) URL.revokeObjectURL(url); }
    }
    if (!operaio && !penna) { penna = incisore(cv, lim, fase, dolce, esce); penna.mondo(window.MONDO); }
  }
  const luogoCarta = c => c && ({ k: c.k, lon: c.lon, lat: c.lat, paese: c.paese, cont: c.cont });
  function posaCarta(e) {
    preparaPenna();
    // Dall'ultima onda (6,6 s) cambia soltanto l'opacità della tela già pronta.
    const posa = TEL.matches ? Math.min(e, 6600 * LENTA) : e;
    if (!CW || !CH || (TEL.matches && posa === ultimaPosa) || occupato) return;
    ultimaPosa = posa;
    const vista = { c: luogoCarta(att), prima: luogoCarta(prima), e: posa, lenta: LENTA, W: CW, H: CH, dpr: DPR, contDisegnato,
      copia: TEL.matches ? versioneCarta : null };
    if (operaio) {
      occupato = true;
      if (fermo) attesaDisegno = new Promise(ok => { chiudiDisegno = ok; });
      operaio.postMessage({ vista, versione: versioneCarta });
    } else {
      etichetteCarta = penna.disegna(vista);
      contDisegnato = etichetteCarta.contDisegnato;
    }
  }

  function carta(e) {
    const arriva = fase(e, A0, A0 + 1200), va = fase(e, A0 + 600, A0 + 1500);
    // il filmato: quello di prima si spegne, quello nuovo arriva quando la carta se ne va
    const film = srcAttesa ? opacPrima * (1 - fase(e, 0, SPEGNI)) : arriva;
    if (TEL.matches) {
      const faseScena = (va < 1 ? ' ot-con-carta' : '') + (film > 0 ? ' ot-con-film' : '') +
        (film > 0 && film < 1 ? ' ot-dissolve' : '') +
        (e >= 4250 * LENTA && e < NOTTE ? ' ot-con-etichette' : '');
      if (scena.fase !== faseScena) { scena.fase = faseScena; scena.className = 'ot-scena' + faseScena; }
    }
    stile(video, 'opacity', film.toFixed(3)); stile(oraBox, 'opacity', film.toFixed(3));
    if (ombraFilm) stile(ombraFilm, 'opacity', film.toFixed(3));
    stile(cv, 'opacity', (1 - va).toFixed(3));
    stile(cv, 'visibility', va >= 1 ? 'hidden' : 'visible');
    // di giorno la carta non si disegna: la tela si nasconde e si stringe (una tela grande e vuota il controllo la ferma)
    if (va >= 1) {
      stile(etich, 'opacity', 0); stile(etMer, 'opacity', 0);
      if (ultimaPosa !== Infinity) {
        if (operaio) operaio.postMessage({ riposa: true });
        else if (penna) penna.riposa();
        ultimaPosa = Infinity; etichetteCarta = null; versioneCarta++;
      }
      return;
    }
    posaCarta(e);
    if (!etichetteCarta) return;
    const { px, py, cima } = etichetteCarta, pd = esce(fase(e, 5000 * LENTA, 5700 * LENTA)), pm = esce(fase(e, 4300 * LENTA, 5400 * LENTA));
    // (18/11/2026, sul telefono) il nome della città e quello del meridiano stanno a destra del loro punto; se lì non ci stanno (a 360 px la carta è
    // larga 328 punti) passano a sinistra del punto, così non escono tagliati dalla carta. Sul computer la carta è larga e restano sempre a destra.
    let ex = px + 14, mx = cima ? cima[0] + 8 : 0;
    if (TEL.matches) {
      // (18/11/2026, fluidità) le due larghezze si misurano quando cambiano le scritte o la carta, non a ogni fotogramma: chiederle alla pagina
      // dopo aver scritto ore e lancette le faceva rifare i conti dell'impaginazione a ogni fotogramma della notte
      // Le misure appartengono alla città, lingua e larghezza correnti.
      const ew = larghe.e, mw = larghe.m;
      if (ex + ew > CW - 6) ex = Math.max(6, px - 14 - ew);
      if (cima && mx + mw > CW - 6) mx = Math.max(6, cima[0] - 8 - mw); }
    stile(etich, 'transform', `translate(${ex.toFixed(1)}px, ${(py - 12).toFixed(1)}px)`);
    stile(etich, 'opacity', pd * (1 - fase(e, A0 + 500, A0 + 1300)));
    if (cima) stile(etMer, 'transform', `translate(${mx.toFixed(1)}px, ${(Math.max(6, cima[1]) + 4).toFixed(1)}px)`);
    stile(etMer, 'opacity', pm * (1 - fase(e, A0 + 500, A0 + 1300)));
  }

  // ---------- il motore: parte quando la sezione si vede, si ferma quando esce ----------
  // TEL-FLUIDO 8 — tra l'ultimo frame e la ripartenza solo i secondi reali si muovono.
  function sostaFilm(fermoVideo) {
    if (TEL.matches) radice.classList.toggle('ot-sosta', fermoVideo);
  }
  let corre = false, fermo = false, idGiro = 0, ultimoTempo = NaN;
  const lontani = new Set();
  let osservaSezione, osservaPezzi, osservaCarta, dentro = false, piena = false;
  function visibilita() {
    const attivo = dentro && (!TEL.matches || !document.hidden);
    if (TEL.matches) radice.classList.toggle('ot-riposo', !attivo);
    // parte solo quando la carta è quasi tutta nello schermo (Franco, 20/11: «il mondo viene tagliato scorrendo in basso… Non si fa in tempo»)
    if (attivo && !corre && piena) avvia();
    else if (!attivo && corre) ferma();
  }
  function osservatori() {
    if (osservaSezione) osservaSezione.disconnect();
    if (osservaPezzi) osservaPezzi.disconnect();
    lontani.clear(); ultimoTempo = NaN;
    for (const nodo of [ruota, grandeBox, scena]) nodo.toggleAttribute('data-ot-lontano', false);
    if (TEL.matches) {
      osservaPezzi = new IntersectionObserver(voci => {
        for (const v of voci) {
          if (v.isIntersecting) lontani.delete(v.target); else lontani.add(v.target);
          v.target.toggleAttribute('data-ot-lontano', !v.isIntersecting);
        }
        ultimoTempo = NaN;
      }, { rootMargin: '96px' });
      [ruota, grandeBox, scena].forEach(nodo => osservaPezzi.observe(nodo));
    }
    osservaSezione = new IntersectionObserver(voci => {
      const voce = voci[voci.length - 1];
      dentro = voce.isIntersecting && (!TEL.matches || voce.intersectionRatio > 0); visibilita();
    }, { threshold: TEL.matches ? [0, .000001] : .3 });
    osservaSezione.observe(radice);
    if (osservaCarta) osservaCarta.disconnect();
    osservaCarta = new IntersectionObserver(voci => {
      const v = voci[voci.length - 1];
      piena = v.isIntersecting && (v.intersectionRatio >= .6 || v.intersectionRect.height >= innerHeight * .6); visibilita();
    }, { threshold: [0, .3, .6, .9, 1] });
    osservaCarta.observe(scena);
  }
  function giro(now) { if (!corre || fermo) return; fotogramma(now); idGiro = requestAnimationFrame(giro); }
  function avvia() {
    if (fermo) return;
    if (TEL.matches) preparaPenna();
    avviato = true; vai(att, false, performance.now(), true);
    prima = null; contDisegnato = false; corre = true;
    cancelAnimationFrame(idGiro); idGiro = requestAnimationFrame(giro);
  }
  function ferma() { corre = false; cancelAnimationFrame(idGiro); video.pause(); }
  osservatori();
  TEL.addEventListener('change', osservatori);
  document.addEventListener('visibilitychange', () => { if (TEL.matches) visibilita(); });
  document.addEventListener('lingua', () => { ultimoTempo = NaN; });
  video.addEventListener('ended', () => { video.pause(); sostaFilm(true); });
  video.addEventListener('waiting', () => { if (partito) sostaFilm(true); });
  video.addEventListener('playing', () => sostaFilm(false));
  let larghezzaTelefono = innerWidth, densitaTelefono = devicePixelRatio;
  addEventListener('resize', () => {
    if (TEL.matches && larghezzaTelefono === innerWidth && densitaTelefono === devicePixelRatio) return;
    larghezzaTelefono = innerWidth; densitaTelefono = devicePixelRatio;
    misuraTutto(); programmaMisuraEtichette(); ultimoTempo = NaN;
  });

  // per le prove: ferma tutto a «secondi» del filmato di una città (negativi = la carta, prima del filmato)
  OTTO.vaiA = (k, secondi = 0) => new Promise(ok => {
    const c = CITTA.find(x => x.k === k || x.nome === k) || att;
    fermo = true; corre = false; avviato = true; cancelAnimationFrame(idGiro); radice.classList.add('ot-fermo-tutto');
    prima = null; contDisegnato = false; att = null;
    const t0 = performance.now(); vai(c, false, t0, true); prima = null;
    const e = NOTTE + secondi * 1000, u = secondi >= 0 ? lim(secondi / c.dur) : 0;
    const finisci = async () => {
      // Un cambio città può aver trovato ancora in volo l'ultima posa della precedente.
      if (operaio && occupato) await new Promise(r => {
        const precedente = chiudiDisegno;
        chiudiDisegno = () => { if (precedente) precedente(); r(); };
      });
      fotogramma(t0 + e, secondi >= 0 ? u : null);
      await attesaDisegno;
      if (telefonoFoto && riservaFoto && riservaFoto.gr === richiesto) await riservaFoto.attesa;
      requestAnimationFrame(() => { fotogramma(t0 + e, secondi >= 0 ? u : null); setTimeout(ok, 120); });
    };
    if (secondi < 0) { video.pause(); finisci(); return; }
    const vai2 = () => { video.pause(); video.addEventListener('seeked', finisci, { once: true }); try { video.currentTime = Math.min(secondi, (video.duration || c.dur) - .05); } catch (er) { finisci(); } };
    if (video.readyState >= 1) vai2(); else video.addEventListener('loadedmetadata', vai2, { once: true });
  });

  // prima di partire: tutto al suo posto, senza movimenti, sulla prima città all'alba (la carta nascosta finché non si disegna)
  cv.style.visibility = 'hidden'; cv.width = cv.height = 2; radice.classList.add('ot-fermo-tutto');
  misuraTutto();
  vai(att, false, performance.now(), true);
  for (const k in celle) { const ce = celle[k], loc = ciclo.A - att.off + ce.c.off; ce.o.segna(loc); oraScritta(ce.ora, hhmm(loc)); }
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
