(() => {
  const carousel = document.querySelector('.carosello');
  const panels = [...carousel.querySelectorAll('.citta')];
  const marks = [...document.querySelectorAll('.indici a')];
  const count = document.querySelector('output');
  const hint = document.querySelector('.invito');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const en = new URLSearchParams(location.search).get('lang') === 'en';
  if (en) {
    document.documentElement.lang = 'en';
    document.title = 'Eight meridians · Hora Vera';
    document.querySelector('.home').href = 'ora-vera.html?lang=en';
    document.querySelectorAll('[data-en]').forEach(el => { el.textContent = el.dataset.en; });
    document.querySelectorAll('[data-en-label]').forEach(el => el.setAttribute('aria-label', el.dataset.enLabel));
  }

  const clocks = panels.map(panel => ({
    format: new Intl.DateTimeFormat('en-GB', {
      timeZone: panel.dataset.zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }),
    watch: panel.querySelector('.orologio'), time: panel.querySelector('time'),
    season: panel.querySelector('.stagione'), dawn: panel.querySelector('.alba'), sun: panel.querySelector('.sole'),
    lat: Number(panel.dataset.lat), lon: Number(panel.dataset.lon)
  }));
  const seasons = en ? ['winter', 'spring', 'summer', 'autumn'] : ['inverno', 'primavera', 'estate', 'autunno'];
  const solarLabels = en ? ['sunrise', 'true noon', 'sunset'] : ['alba', 'mezzogiorno vero', 'tramonto'];
  let lastDay;

  // Stesse stagioni e stessa approssimazione NOAA del modulo originale, una volta per data UTC.
  function daylight(clock, now, day) {
    const date = (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
    const season = date < 320 || date >= 1221 ? 0 : date < 621 ? 1 : date < 922 ? 2 : 3;
    clock.season.textContent = ' · ' + seasons[(season + (clock.lat < 0 ? 2 : 0)) % 4];
    const yearStart = Date.UTC(now.getUTCFullYear(), 0, 1);
    const g = 2 * Math.PI / 365 * ((day - yearStart) / 86400000);
    const equation = 229.18 * (.000075 + .001868 * Math.cos(g) - .032077 * Math.sin(g)
      - .014615 * Math.cos(2 * g) - .040849 * Math.sin(2 * g));
    const dec = .006918 - .399912 * Math.cos(g) + .070257 * Math.sin(g) - .006758 * Math.cos(2 * g)
      + .000907 * Math.sin(2 * g) - .002697 * Math.cos(3 * g) + .00148 * Math.sin(3 * g);
    const rad = Math.PI / 180, lat = clock.lat * rad;
    const cosAngle = Math.cos(90.833 * rad) / (Math.cos(lat) * Math.cos(dec)) - Math.tan(lat) * Math.tan(dec);
    if (Math.abs(cosAngle) > 1) {
      const phrase = cosAngle < 0 ? (en ? 'the sun does not set' : 'il sole non tramonta')
        : (en ? 'the sun does not rise' : 'il sole non sorge');
      clock.dawn.textContent = (en ? 'here ' : 'qui ') + phrase;
      clock.sun.textContent = phrase;
      return;
    }
    const noon = 720 - 4 * clock.lon - equation;
    const halfDay = 4 * Math.acos(cosAngle) / rad;
    const times = [noon - halfDay, noon, noon + halfDay].map(m => clock.format.format(day + Math.round(m) * 60000));
    clock.dawn.textContent = (en ? 'sunrise today at ' : 'oggi l’alba alle ') + times[0];
    clock.sun.replaceChildren(...times.map((value, i) => {
      const label = document.createElement('span');
      label.textContent = solarLabels[i] + ' ' + value;
      return label;
    }));
  }

  function refresh() {
    const now = new Date(), day = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    for (const clock of clocks) {
      const value = clock.format.format(now);
      const [hour, minute] = value.split(':').map(Number);
      clock.time.textContent = value;
      clock.time.dateTime = value;
      clock.time.hidden = false;
      clock.watch.style.setProperty('--angolo-ore', ((hour % 12) * 30 + minute / 2 - clock.watch.dataset.ore) + 'deg');
      clock.watch.style.setProperty('--angolo-minuti', (minute * 6 - clock.watch.dataset.minuti) + 'deg');
      if (day !== lastDay) daylight(clock, now, day);
    }
    lastDay = day;
  }
  refresh();
  setTimeout(() => {
    refresh();
    setInterval(refresh, 60000);
  }, 60000 - Date.now() % 60000);

  let visible = null;
  const videos = panels.map(panel => panel.querySelector('video'));
  const canPlay = video => visible === video && !motion.matches && !document.hidden;
  function playback() {
    for (const video of videos) {
      if (canPlay(video)) continue;
      if (!video.paused) video.pause();
      video.classList.remove('in-onda');
    }
    if (visible && canPlay(visible)) visible.play().catch(() => {});
  }
  for (const video of videos) {
    video.addEventListener('playing', () => {
      if (canPlay(video) && !video.paused) video.classList.add('in-onda');
    });
    video.addEventListener('error', () => video.classList.remove('in-onda'));
  }
  const observer = new IntersectionObserver(entries => {
    let next = visible;
    for (const entry of entries) {
      const video = videos[panels.indexOf(entry.target)];
      if (entry.isIntersecting && entry.intersectionRatio >= .6) next = video;
      else if (next === video) next = null;
    }
    if (next === visible) return;
    visible = next;
    if (visible) {
      const i = videos.indexOf(visible);
      marks.forEach((mark, index) => {
        if (index === i) mark.setAttribute('aria-current', 'true');
        else mark.removeAttribute('aria-current');
      });
      count.textContent = (i + 1) + ' / ' + panels.length;
      count.hidden = false;
      if (i > 0) hint.hidden = true;
    }
    playback();
  }, { root: carousel, threshold: .6 });
  panels.forEach(panel => observer.observe(panel));
  motion.addEventListener('change', playback);
  document.addEventListener('visibilitychange', playback);
  marks.forEach((mark, i) => mark.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    panels[i].scrollIntoView({ inline: 'center', block: 'nearest', behavior: motion.matches ? 'instant' : 'smooth' });
  }));
})();
