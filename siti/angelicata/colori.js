/* PROVE DEI COLORI (16/11/2026, vedi colori.css). Senza ?colori= nell'indirizzo qui non succede niente: il sito resta com'è.
   Con ?colori=1…4 la pagina prende una delle quattro tavolozze; ?colori=0 lascia i colori di adesso ma mostra i pulsanti della prova.
   ?blu=petrolio sposta il blu verso il petrolio; ?barra=0 nasconde i pulsanti (per le foto).
   La scelta passa nei collegamenti alle altre pagine del sito, e il titolo della finestra dice quale prova si sta guardando. */
(() => {
  const NOMI = { 1: 'Inchiostro', 2: 'Velluto', 3: 'Notte', 4: 'Due codici' };
  const q = new URLSearchParams(location.search);
  // 16/11/2026, Franco: «Petrolio, due codici». Da qui è il colore del sito: senza niente nell'indirizzo vale la 4 con il petrolio, senza pulsanti.
  if (!q.has('colori')) {
    const h = document.documentElement; h.dataset.colori = '4'; h.dataset.blu = 'petrolio';
    addEventListener('DOMContentLoaded', () => {
      const leggiArea = () => { const b = document.querySelector('.filtri button[aria-pressed="true"]'); let a = b ? b.dataset.area : null;
        if (!a) { try { a = localStorage.getItem('avv-area'); } catch (e) {} } h.dataset.area = a === 'civile' || a === 'penale' ? a : 'tutto'; };
      leggiArea();
      document.querySelectorAll('.filtri button').forEach(b => new MutationObserver(leggiArea).observe(b, { attributes: true, attributeFilter: ['aria-pressed'] }));
    });
    return;
  }
  // ?area=civile o penale: la pagina si apre con quella scelta già fatta (la legge lo script del sito, che parte dopo)
  if (['tutto', 'civile', 'penale'].includes(q.get('area'))) { try { localStorage.setItem('avv-area', q.get('area')); } catch (e) {} }
  const h = document.documentElement, titolo = document.title, conBarra = q.get('barra') !== '0';
  let n = NOMI[q.get('colori')] ? q.get('colori') : '0', blu = q.get('blu') === 'petrolio' ? 'petrolio' : 'navy';
  const coda = () => '?colori=' + n + (blu === 'petrolio' ? '&blu=petrolio' : '') + (conBarra ? '' : '&barra=0');
  function vesti() {
    if (n === '0') h.removeAttribute('data-colori'); else h.dataset.colori = n;
    if (blu === 'petrolio') h.dataset.blu = 'petrolio'; else h.removeAttribute('data-blu');
    document.title = (n === '0' ? 'Colori di adesso' : 'Colori ' + n + ' «' + NOMI[n] + '»' + (blu === 'petrolio' ? ' con il petrolio' : '')) + ' · ' + titolo;
    try { history.replaceState(null, '', location.pathname + coda() + location.hash); } catch (e) {}
    document.querySelectorAll('a[data-pagina]').forEach(a => { a.href = a.dataset.pagina + coda() + a.dataset.ancora; });
    document.querySelectorAll('.prova-colori button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.n ? b.dataset.n === n : b.dataset.blu === blu)));
  }
  vesti();
  addEventListener('DOMContentLoaded', () => {
    // i collegamenti alle altre pagine del sito portano con sé la prova
    document.querySelectorAll('a[href]').forEach(a => { const m = /^(index|chi-sono|per-capire)\.html(#.*)?$/.exec(a.getAttribute('href')); if (m) { a.dataset.pagina = m[1] + '.html'; a.dataset.ancora = m[2] || ''; } });
    // «Due codici»: la pagina sa se chi guarda ha scelto Tutto, Civile o Penale (anche in «Chi sono», dove il filtro non c'è)
    const leggiArea = () => { const b = document.querySelector('.filtri button[aria-pressed="true"]'); let a = b ? b.dataset.area : null;
      if (!a) { try { a = localStorage.getItem('avv-area'); } catch (e) {} } h.dataset.area = a === 'civile' || a === 'penale' ? a : 'tutto'; };
    leggiArea();
    document.querySelectorAll('.filtri button').forEach(b => new MutationObserver(leggiArea).observe(b, { attributes: true, attributeFilter: ['aria-pressed'] }));
    if (conBarra) {
      const barra = document.createElement('div'); barra.className = 'prova-colori'; barra.setAttribute('role', 'group'); barra.setAttribute('aria-label', 'Prova dei colori');
      barra.innerHTML = '<span>Colori</span><button type="button" data-n="0">com\'è adesso</button>' + Object.keys(NOMI).map(k => `<button type="button" data-n="${k}">${k} · ${NOMI[k]}</button>`).join('')
        + '<i></i><button type="button" data-blu="navy">blu navy</button><button type="button" data-blu="petrolio">petrolio</button>';
      barra.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.n) n = b.dataset.n; else blu = b.dataset.blu; vesti(); });
      document.body.appendChild(barra);
    }
    vesti();
  });
})();
