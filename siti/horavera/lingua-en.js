/* IL VOCABOLARIO INGLESE di Hora Vera (18/11/2026, passo 5.2). Lo legge lingua.js; qui non c'è codice che tocca la pagina.
   REGISTRO: inglese britannico, sobrio. Il sito non vende: racconta. Un fatto per frase, nessun aggettivo di pregio, nessun luogo comune.
   LA VOCE (i quattro testi di L'atelier e il finale) è quella di progetti/vetrina/orologi/voce/testi-en.md, approvata da Franco: PAROLA PER PAROLA,
   riga per riga come l'italiano (le barre | del file sono gli stacchi, che nella pagina ci sono già). Non si ritocca qui: si cambia là e si ricopia.
   La firma si mostra come nella pagina italiana (senza la lineetta, che nella pagina è il tratto blu sopra i versi).
   I TERMINI DEL MESTIERE: platina = mainplate; ponti = bridges; bariletto = barrel; bilanciere = balance; ago del regolatore = regulator index;
   marcia = rate; regolare in sei posizioni = to regulate in six positions; rubini = jewels; perni = pivots; viti azzurrate = blued screws;
   spigoli smussati = bevelled edges; satinato = satin-finished; fondello = case back; tornio a rosa = rose engine; punta (del tornio) = cutter;
   solco = cut; quadrante a raggi = sunray dial; contatori = counters; indici = hour markers; lunetta = bezel; secondi piccoli = small seconds;
   cassa = case; bracciale = bracelet; cinturino = strap; subacqueo = diver.
   I NOMI: HORA VERA non si traduce; HOME resta HOME; i nomi degli orologi (Sobieski, Wanli, Patavium…) e i tempi musicali (Largo, Andante…) restano.
   Le città hanno il nome inglese (Venezia → Venice, Siviglia → Seville, Parigi → Paris, Pechino → Beijing, Padova → Padua). «N. 036» → «No. 036».
   I numeri: 21.600 → 21,600; 0,08 → 0.08 (la virgola dei decimali diventa punto). Le ore restano sulle 24 (07:12).
   «frasi»: la frase italiana esatta (un pezzo di testo tra due segni, così com'è nella pagina) → l'inglese. Una frase nuova nella pagina = una riga qui. */
(() => {
  const CITTA = { 'Pechino': 'Beijing', 'Vienna': 'Vienna', 'Venezia': 'Venice', 'Brescia': 'Brescia', 'Parigi': 'Paris', 'Dover': 'Dover', 'Greenwich': 'Greenwich', 'Siviglia': 'Seville', 'Polo Sud': 'South Pole' };
  const NOMI = ['Sobieski', 'Wanli', 'Wright', 'Polheim', 'Victoria', 'Patavium', 'Brixia', 'Déco'];   // i nomi degli orologi: restano
  const F = {
    /* ---------- le tre pagine: voci, HOME, segni ---------- */
    'Le pagine di Hora Vera': 'The pages of Hora Vera',
    "L'ora vera": 'True time', 'Visioni': 'Visions', "L'atelier": 'The atelier',
    'Home: torna alla presentazione': 'Home: back to the opening', 'Home: la presentazione': 'Home: the opening',
    'Scorri': 'Scroll', 'Salta': 'Skip', 'Commissione': 'Commission',

    /* ---------- HOME · la presentazione ---------- */
    'Rivedi · luce nuova': 'Watch again · new light',

    /* ---------- HOME · Otto meridiani ---------- */
    'Otto meridiani': 'Eight meridians',
    'Otto meridiani: gli orologi della collezione e le loro città, dall’alba al tramonto': 'Eight meridians: the watches of the collection and their cities, from sunrise to sunset',
    'Lo scheletrato': 'The skeleton', 'Il protagonista': 'The protagonist',
    'Adesso:': 'Now:', 'Allora:': 'Then:',
    'alba': 'sunrise', 'mezzogiorno vero': 'true noon', 'tramonto': 'sunset', 'sole': 'sun',
    'il sole non tramonta': 'the sun does not set', 'qui il sole non tramonta': 'here the sun does not set', 'tutti i meridiani': 'all the meridians',
    'Qui tramonta; al Polo Sud il sole non tramonta.': 'Here the sun is setting; at the South Pole it does not set.',
    'la Città Proibita dei Ming, vista dalla collina di Jingshan.': 'the Forbidden City of the Ming, seen from Jingshan Hill.',
    'Cina dei Ming, 1580: lo spadaccino.': 'Ming China, 1580: the swordsman.',
    'Vienna dal Kahlenberg, la collina da cui scese l’esercito di soccorso.': 'Vienna from the Kahlenberg, the hill the relief army came down from.',
    'Vienna, 12 settembre 1683: gli ussari alati.': 'Vienna, 12 September 1683: the winged hussars.',
    'la Piazzetta: dal Campanile, nell’agosto 1609, Galileo mostrò il cannocchiale ai senatori.': 'the Piazzetta: from the Campanile, in August 1609, Galileo showed his telescope to the senators.',
    'Padova, gennaio 1610: Galileo e la luna.': 'Padua, January 1610: Galileo and the moon.',
    'viale Venezia, dove partì la prima Mille Miglia.': 'Viale Venezia, where the first Mille Miglia started.',
    'Brescia, 26 marzo 1927: la prima Mille Miglia.': 'Brescia, 26 March 1927: the first Mille Miglia.',
    'il ponte Alexandre III, al centro dell’esposizione del 1925.': 'the Pont Alexandre III, at the centre of the 1925 exhibition.',
    'Parigi, 1925: l’esposizione dell’Art Déco.': 'Paris, 1925: the Art Deco exhibition.',
    'le scogliere bianche sulla Manica.': 'the white cliffs above the Channel.',
    'La Manica, 2 giugno 1910: Rolls in volo, andata e ritorno.': 'The Channel, 2 June 1910: Rolls in the air, there and back.',
    'il Guadalquivir e la Torre del Oro: il fiume che la Victoria risalì nel settembre 1522.': 'the Guadalquivir and the Torre del Oro: the river the Victoria sailed up in September 1522.',
    'Siviglia, 1522: torna la nave del primo giro del mondo.': 'Seville, 1522: the ship of the first voyage round the world comes home.',
    'il Polo Sud, dove si incontrano tutti i meridiani: a novembre il sole non tramonta.': 'the South Pole, where all the meridians meet: in November the sun does not set.',
    'Polo Sud, 14 dicembre 1911: Amundsen.': 'South Pole, 14 December 1911: Amundsen.',

    /* ---------- HOME · Quattro tempi (i dati sono in tempi.js) ---------- */
    'Quattro tempi': 'Four tempi',
    'I giorni': 'Days', 'Le ore': 'Hours', 'I minuti': 'Minutes', 'I secondi': 'Seconds',   // senza articolo: «The minutes» nel cartello andava su due righe
    'cielo': 'sky', 'vita': 'life', 'uomo': 'man',
    'La luna, da nuova a piena': 'The moon, from new to full', '14 giorni e 18 ore': '14 days and 18 hours',
    'Dalla luna nuova alla luna piena passano quattordici giorni e diciotto ore.': 'From new moon to full moon takes fourteen days and eighteen hours.',
    'La crisalide della monarca': 'The monarch’s chrysalis', 'circa due settimane': 'about two weeks',
    'La monarca resta chiusa nella crisalide circa due settimane. Poi il guscio si fa trasparente e si apre dal basso.': 'The monarch stays shut in its chrysalis for about two weeks. Then the shell turns transparent and opens from the bottom.',
    'Undici giorni senza posarsi': 'Eleven days without landing', '13.560 km in 11 giorni': '13,560 km in 11 days',
    'Nell’ottobre 2022 una giovane pittima minore è volata dall’Alaska alla Tasmania senza mai posarsi: 13.560 chilometri in undici giorni.': 'In October 2022 a young bar-tailed godwit flew from Alaska to Tasmania without landing once: 13,560 kilometres in eleven days.',
    'La marea che scende': 'The ebbing tide', 'circa 6 ore e 12 minuti': 'about 6 hours and 12 minutes',
    'Dall’alta alla bassa marea passano circa sei ore e dodici minuti. Poi il mare torna.': 'From high tide to low takes about six hours and twelve minutes. Then the sea comes back.',
    'La regina della notte': 'The queen of the night', 'una notte sola': 'one night only',
    'La regina della notte si apre dopo il tramonto e all’alba si chiude. Non si riapre più.': 'The queen of the night opens after sunset and closes at dawn. It does not open again.',
    'L’ombra della meridiana': 'The shadow on the sundial', '15 gradi ogni ora': '15 degrees every hour',
    'Il Sole avanza di quindici gradi ogni ora: trecentosessanta in un giorno. L’ombra lo segue.': 'The Sun moves fifteen degrees every hour: three hundred and sixty in a day. The shadow follows it.',
    'Il buio dell’eclissi': 'The darkness of the eclipse', '6 minuti e 23 secondi': '6 minutes and 23 seconds',
    'Il 2 agosto 2027, vicino a Luxor, il buio dell’eclissi totale durerà sei minuti e ventitré secondi.': 'On 2 August 2027, near Luxor, the darkness of the total eclipse will last six minutes and twenty-three seconds.',
    'Il cuore della balenottera azzurra': 'The heart of the blue whale', '2 battiti al minuto': '2 beats a minute',
    'In immersione il cuore della balenottera azzurra rallenta fino a due battiti al minuto.': 'On a dive the heart of the blue whale slows to two beats a minute.',
    'Il discorso di Gettysburg': 'The Gettysburg Address', 'due minuti, 272 parole': 'two minutes, 272 words',
    'Il 19 novembre 1863, a Gettysburg, Lincoln parlò per circa due minuti: dieci periodi, duecentosettantadue parole. L’oratore prima di lui aveva parlato due ore.': 'On 19 November 1863, at Gettysburg, Lincoln spoke for about two minutes: ten sentences, two hundred and seventy-two words. The speaker before him had spoken for two hours.',
    'Il raggio verde': 'The green flash', 'un secondo o due': 'a second or two',
    'Al tramonto, con il mare piatto e l’aria limpida, l’ultimo bordo del sole diventa verde per un secondo o due.': 'At sunset, with a flat sea and clear air, the last rim of the sun turns green for a second or two.',
    'Il colibrì': 'The hummingbird', 'circa 53 battiti d’ala al secondo': 'about 53 wingbeats a second',
    'Il colibrì golarossa batte le ali circa cinquantatré volte al secondo.': 'The ruby-throated hummingbird beats its wings about fifty-three times a second.',
    'Il diapason': 'The tuning fork', '440 vibrazioni al secondo': '440 vibrations a second',
    'Il La del diapason vibra quattrocentoquaranta volte al secondo: è la nota su cui si accorda l’orchestra.': 'The A of the tuning fork vibrates four hundred and forty times a second: it is the note the orchestra tunes to.',

    /* ---------- HOME · il finale (voce/testi-en.md, parola per parola; {così} = le parole del tempo, in grigio) ---------- */
    'Il messaggio': 'The message',
    'Tu che hai trovato la sonda, là fuori,': 'You who have found the probe, out there,',
    'non hai le nostre parole.': 'do not have our words.',
    'E le nostre {ore} sono i giri del nostro pianeta:': 'And our {hours} are the turns of our planet:',
    'tu vieni da un altro.': 'you come from another.',
    'Un {orologio} in comune però c’è.': 'There is one {clock} we share, though.',
    'È l’atomo più semplice, quello di cui è fatto quasi tutto:': 'It is the simplest atom, the one almost everything is made of:',
    'ha un {ritmo} suo, lo stesso da te come da noi.': 'it has a {rhythm} of its own, the same with you as with us.',
    'Sulla lastra è disegnato: è la nostra unità di misura.': 'It is drawn on the plate: it is our unit of measure.',
    'Con quella abbiamo scritto il {ritmo} di quattordici stelle morte,': 'With it we wrote the {rhythm} of fourteen dead stars',
    'che girano su se stesse e a ogni giro mandano un lampo.': 'that spin, and at every turn send out a flash.',
    'Non ce ne sono due uguali.': 'No two are alike.',
    'Risali le quattordici righe: dove si incontrano, lì siamo noi.': 'Follow the fourteen lines back: where they meet, there we are.',
    'Poi conta di quanto hanno {rallentato}.': 'Then count how much they have {slowed}.',
    '{Rallentano} tutte, di pochissimo.': 'They all {slow}, by very little.',
    'Saprai quanto {tempo} fa eravamo lì.': 'You will know how {long ago} we were there.',

    /* ---------- VISIONI · la soglia e il registro ---------- */
    'Ora XV · pomeriggio': 'Hour XV · afternoon', 'Il registro': 'The register',
    'Ogni orologio è stato fatto per qualcuno. E porta con sé il tempo da cui quella persona viene.': 'Every watch was made for someone. And it carries with it the time that person comes from.',
    'Rubino e oro': 'Ruby and gold', 'La tigre': 'The tiger', 'Cronografo grafite': 'Graphite chronograph', 'Verde e diamanti': 'Green and diamonds',
    'Cronografo cuoio': 'Leather chronograph', 'Subacqueo blu e oro': 'Blue and gold diver', 'Bianco e acciaio': 'White and steel', 'Cronografo blu': 'Blue chronograph',
    'la tua riga': 'your line',
    'Hora Vera «Rubino e oro»: quadrante rosso rubino a raggi, cassa e bracciale in oro e rubino': 'Hora Vera “Ruby and gold”: ruby-red sunray dial, case and bracelet in gold and ruby',
    'Hora Vera «La tigre»: quadrante nero, numeri romani, oro rosa': 'Hora Vera “The tiger”: black dial, Roman numerals, rose gold',
    'Hora Vera «Cronografo cuoio»: quadrante bruno, tre contatori neri, cinturino in cuoio': 'Hora Vera “Leather chronograph”: brown dial, three black counters, leather strap',
    'Hora Vera «Cronografo blu»: quadrante blu a raggi, tre contatori, cassa e bracciale grafite': 'Hora Vera “Blue chronograph”: blue sunray dial, three counters, graphite case and bracelet',
    'Hora Vera «Subacqueo blu e oro»: quadrante blu petrolio a raggi, lunetta nera con i numeri in oro, bracciale in acciaio e oro': 'Hora Vera “Blue and gold diver”: petrol-blue sunray dial, black bezel with gold numerals, steel and gold bracelet',
    'Hora Vera «Verde e diamanti»: cronografo con il quadrante verde a raggi, tre contatori, indici di diamanti, cassa in oro rosa': 'Hora Vera “Green and diamonds”: chronograph with a green sunray dial, three counters, diamond hour markers, rose gold case',
    'Hora Vera «Cronografo grafite»: quadrante grigio scuro, indici color rame, tre contatori blu, cassa e bracciale grafite': 'Hora Vera “Graphite chronograph”: dark grey dial, copper-coloured hour markers, three blue counters, graphite case and bracelet',
    "Hora Vera «Bianco e acciaio»: quadrante bianco con i secondi piccoli e la data, cassa in acciaio, cinturino d'alligatore nero": 'Hora Vera “White and steel”: white dial with small seconds and date, steel case, black alligator strap',
    // le scene: il luogo e il giorno, e la riga «Per…» (nomi propri e fatti restano veri)
    'Vienna, 12 settembre 1683': 'Vienna, 12 September 1683', 'Cina, dinastia Ming': 'China, Ming dynasty', 'La Manica, 2 giugno 1910': 'The Channel, 2 June 1910',
    'Polo Sud, 14 dicembre 1911': 'South Pole, 14 December 1911', 'Siviglia, 8 settembre 1522': 'Seville, 8 September 1522', 'Padova, gennaio 1610': 'Padua, January 1610',
    'Brescia, 26 marzo 1927': 'Brescia, 26 March 1927', 'Parigi, estate 1925': 'Paris, summer 1925',
    "Per un allevatore di cavalli. Volgeva l'anno 1683, e": 'For a horse breeder. The year was 1683, and', 'la cavalleria scendeva dalla collina': 'the cavalry was coming down the hill',
    "Per un maestro di spada. Volgeva l'anno 1580, e": 'For a master of the sword. The year was 1580, and', 'una lama era ancora una disciplina': 'a blade was still a discipline',
    "Per un pilota di linea. Volgeva l'anno 1910, e": 'For an airline pilot. The year was 1910, and', 'si andava in Francia e si tornava senza posarsi': 'a man flew to France and back without landing',
    "Per una guida alpina. Volgeva l'anno 1911, e": 'For a mountain guide. The year was 1911, and', 'si arrivava dove ogni direzione è nord': 'men reached the place where every direction is north',
    "Per una velista oceanica. Volgeva l'anno 1522, e": 'For an ocean sailor. The year was 1522, and', 'tornava la nave che aveva fatto il giro del mondo': 'the ship that had sailed round the world was coming home',
    "Per un astronomo. Volgeva l'anno 1610, e": 'For an astronomer. The year was 1610, and', 'la luna mostrava le sue montagne': 'the moon was showing its mountains',
    "Per un collezionista di automobili. Volgeva l'anno 1927, e": 'For a collector of motor cars. The year was 1927, and', 'da Brescia a Roma e ritorno erano mille miglia': 'from Brescia to Rome and back was a thousand miles',
    "Per una creatrice di gioielli. Volgeva l'anno 1925, e": 'For a jewellery designer. The year was 1925, and', 'Parigi metteva in mostra il futuro': 'Paris was putting the future on show',
    // la coda (ancora di prova)
    'Otto orologi su otto.': 'Eight watches out of eight.',
    "L'orologio che sul filmato si fa trasparente e alla fine torna pieno.": 'The watch that turns transparent over the film and is solid again at the end.',
    'Le lancette e la data che tornano indietro.': 'The hands and the date that run backwards.',
    'Dopo ogni scena: il nome che arriva lungo le sue rotte, poi la confezione.': 'After each scene: the name arriving along its routes, then the box.',
    'Anno, luogo e frase sono segnaposto: si decidono con la scena. Torna su e riscorri per rivederlo.': 'Year, place and sentence are placeholders: they are settled with the scene. Go back up and scroll again to see it once more.',
    // il racconto di ogni scena (solo negli indirizzi di prova ?scorri=racconto)
    "Da due mesi Vienna resiste all'assedio.": 'For two months Vienna has held out against the siege.',
    "All'alba il re di Polonia, Jan Sobieski, la guarda dall'alto del Kahlenberg.": 'At dawn the King of Poland, Jan Sobieski, looks down on the city from the Kahlenberg.',
    'Verso sera scendono gli ussari, con le ali di piume sulle spalle:': 'Towards evening the hussars come down, with wings of feathers on their backs:', 'la più grande carica di cavalleria della storia': 'the largest cavalry charge in history',
    "Al tramonto l'assedio è rotto.": 'By sunset the siege is broken.',
    "Nella Cina dei Ming la spada non è soltanto un'arma.": 'In Ming China the sword is not only a weapon.',
    'È un esercizio: lo stesso gesto, ripetuto ogni mattina prima del sole.': 'It is a practice: the same movement, repeated every morning before sunrise.',
    'Il maestro non insegna a colpire: insegna ad aspettare.': 'The master does not teach how to strike: he teaches how to wait.',
    'un solo movimento': 'a single movement', ', e il silenzio.': ', and silence.',
    'Dover, 2 giugno 1910, poco dopo le sei e mezza di sera.': 'Dover, 2 June 1910, shortly after half past six in the evening.',
    'Charles Rolls decolla su un biplano Wright di legno e tela.': 'Charles Rolls takes off in a Wright biplane of wood and canvas.',
    'Raggiunge la costa francese, vira e torna indietro senza posarsi.': 'He reaches the French coast, turns and flies back without landing.',
    'Novantacinque minuti:': 'Ninety-five minutes:', 'la prima andata e ritorno sopra la Manica': 'the first flight across the Channel and back',
    'Da quasi due mesi camminano sul ghiaccio, con gli sci e con i cani.': 'For almost two months they have been crossing the ice, on skis and with dogs.',
    'Sono in cinque: Roald Amundsen e quattro compagni.': 'There are five of them: Roald Amundsen and four companions.',
    'Il 14 dicembre 1911, nel pomeriggio,': 'On 14 December 1911, in the afternoon,', 'ogni direzione è nord': 'every direction is north',
    'Piantano una tenda e la chiamano Polheim: la casa del Polo.': 'They pitch a tent and call it Polheim: the home at the Pole.',
    'Tre anni prima erano partite cinque navi, con circa duecentoquaranta uomini.': 'Three years earlier five ships had set out, with about two hundred and forty men.',
    'Ne torna una sola, la Victoria, con diciotto sopravvissuti.': 'Only one comes back, the Victoria, with eighteen survivors.',
    'Juan Sebastián Elcano risale il fiume fino a Siviglia.': 'Juan Sebastián Elcano sails up the river to Seville.',
    'È la prima nave che': 'She is the first ship that', 'ha fatto il giro del mondo': 'has sailed round the world',
    'Un professore di Padova costruisce un cannocchiale che ingrandisce venti volte.': 'A professor in Padua builds a telescope that magnifies twenty times.',
    'Lo punta verso la luna: non è liscia,': 'He points it at the moon: it is not smooth,', 'ha montagne e valli': 'it has mountains and valleys',
    'Il 7 gennaio, accanto a Giove, vede tre piccole stelle che si spostano.': 'On 7 January, beside Jupiter, he sees three small stars that move.',
    'A marzo racconta tutto in un libretto: il Sidereus Nuncius.': 'In March he sets it all down in a short book: the Sidereus Nuncius.',
    "Brescia, 26 marzo 1927: le automobili partono una dopo l'altra.": 'Brescia, 26 March 1927: the cars set off one after another.',
    'Fino a Roma e ritorno, di giorno e di notte:': 'To Rome and back, by day and by night:', 'mille miglia': 'a thousand miles',
    'Strade bianche, polvere, i paesi svegli a guardare.': 'Unsurfaced roads, dust, the villages awake to watch.',
    'Vince una OM costruita a Brescia, in poco più di ventun ore.': 'The winner is an OM built in Brescia, in a little over twenty-one hours.',
    'Tra il Grand Palais e gli Invalides sorge una città di padiglioni.': 'Between the Grand Palais and Les Invalides a city of pavilions rises.',
    'Al centro, la fontana di vetro di René Lalique, alta quindici metri.': 'At its centre, René Lalique’s glass fountain, fifteen metres high.',
    'Lacca, vetro, geometrie: le arti decorative guardano al futuro.': 'Lacquer, glass, geometry: the decorative arts look to the future.',
    'Da quella mostra lo stile prenderà il suo nome:': 'From that exhibition the style will take its name:', 'Art Déco': 'Art Deco',

    /* ---------- L'ATELIER · l'apertura ---------- */
    "Quattro gesti. Dodici orologi l'anno.": 'Four gestures. Twelve watches a year.',
    'Montare': 'Assembling', 'Guardare': 'Looking', 'Regolare': 'Regulating', 'Incidere': 'Engraving',
    '· Montare': '· Assembling', '· Guardare': '· Looking', '· Regolare': '· Regulating', '· Incidere': '· Engraving',
    'scorri, e i pezzi entrano nella cassa': 'scroll, and the parts go into the case', 'la lente: passa con il mouse e cerca': 'the loupe: move the mouse and look',
    "scorri: la punta sposta l'ago": 'scroll: the point moves the index', 'scorri: giri il tornio': 'scroll: you turn the rose engine',

    /* ---------- L'ATELIER · α Montare (i testi tecnici: un fatto per frase, i termini del mestiere) ---------- */
    'Duecentosettanta giorni': 'Two hundred and seventy days', 'per un orologio.': 'for one watch.',
    "Un Hora Vera comincia da una barra d'ottone. Platina, ponti, ruote, leve: più di duecento parti, tutte fatte qui, rifinite a mano e montate da chi le ha fatte. Niente arriva da fuori. Per questo ne nascono dodici l'anno.": 'A Hora Vera begins as a bar of brass. Mainplate, bridges, wheels, levers: more than two hundred parts, all made here, finished by hand and assembled by the people who made them. Nothing comes from outside. That is why twelve are made a year.',
    'giorni': 'days', 'parti': 'parts', 'persone': 'people',
    'Giorno': 'Day',
    'La platina e i ponti': 'The mainplate and bridges', "tagliati da una barra d'ottone · 9 giorni": 'cut from a bar of brass · 9 days',
    'Il bariletto': 'The barrel', 'la molla che lo carica per 72 ore': 'the mainspring that runs it for 72 hours',
    'Il bilanciere': 'The balance', 'regolato a mano per tre settimane, in sei posizioni': 'regulated by hand for three weeks, in six positions',
    'Le leve del cronografo': 'The chronograph levers', 'limate e lucidate a mano · 31 ore': 'filed and polished by hand · 31 hours',
    'Il fondello': 'The case back', 'inciso con il numero del registro': 'engraved with its number in the register',
    // la voce (testi-en.md, α · Assembling)
    "Avevo vent'anni e facevo il falegname, come mio padre.": 'I was twenty, and a carpenter like my father.',
    'Il mio primo orologio, a pendolo e alto come un uomo,': 'My first clock, a pendulum clock as tall as a man,',
    'lo feci tutto di legno.': 'I made all of wood.',
    'Le ruote di quercia, ogni dente tagliato a mano.': 'The wheels of oak, every tooth cut by hand.',
    "I perni di legno santo, che ha l'olio nelle fibre:": 'The pivots of lignum vitae, which holds its oil in the grain:',
    'quello delle botteghe si induriva tra i denti.': 'the oil of the workshops went hard between the teeth.',
    "A Londra l'avrebbero fatto d'ottone.": 'In London they would have made it of brass.',
    'Io avevo la quercia e la pialla.': 'I had oak and a plane.',
    'Lo misi in piedi nella bottega, nel 1713.': 'I stood it up in the workshop in 1713.',
    'Nessuno mi aveva insegnato come si fa.': 'No one had taught me how it is done.',
    "Per quarant'anni me l'hanno chiesto.": 'For forty years they went on asking.',
    'John Harrison · Barrow, 1713': 'John Harrison · Barrow, 1713',

    /* ---------- L'ATELIER · β Guardare ---------- */
    'Il bello': 'The beauty', 'che non si vede.': 'that goes unseen.',
    "Gli spigoli smussati con la lima, le viti azzurrate sulla fiamma, i rubini su cui girano i perni: quasi tutto questo lo vede soltanto chi apre l'orologio. Lo facciamo lo stesso. E chi lo monta incide il suo nome su un ponte, dove nessuno guarda.": 'Edges bevelled with a file, screws blued over a flame, the jewels in which the pivots turn: almost all of this is seen only by whoever opens the watch. We do it all the same. And whoever assembles it engraves their name on a bridge, where no one looks.',
    'ore di lima': 'hours of filing', 'rubini': 'jewels', 'firma': 'signature',
    'Trovato': 'Found',
    'I rubini': 'The jewels', 'i perni girano su pietre dure: non si consumano in cento anni': 'the pivots turn in hard stones: they do not wear in a hundred years',
    'Le viti azzurrate': 'The blued screws', "scaldate a mano finché l'acciaio diventa blu, una per una": 'heated by hand until the steel turns blue, one at a time',
    'La firma': 'The signature', "chi lo monta incide il suo nome dove nessuno lo vede. L'hai trovata.": 'whoever assembles it engraves their name where no one sees it. You have found it.',
    "batte 21.600 volte l'ora; regolato a mano per tre settimane": 'it beats 21,600 times an hour; regulated by hand for three weeks',
    'I ponti': 'The bridges', 'satinati e con gli spigoli smussati a mano: 14 ore di lima': 'satin-finished, the edges bevelled by hand: 14 hours of filing',
    // la voce (β · Looking)
    'Il Parlamento aveva promesso ventimila sterline': 'Parliament had promised twenty thousand pounds',
    'a chi trovava il modo di sapere, in mare, quanto si è lontani da casa.': 'to whoever found a way to know, at sea, how far one is from home.',
    'Il mio orologio da tasca, largo tredici centimetri, lo sapeva fare.': 'My watch, five inches across, could do it.',
    'Prima di pagarmi, vollero vederlo aperto.': 'Before they paid me, they wished to see it opened.',
    'Il quattordici agosto del 1765 vennero da me, a Londra:': 'On the fourteenth of August 1765 they came to my house in London:',
    "l'astronomo reale, tre orologiai, due reverendi,": 'the Astronomer Royal, three watchmakers, two reverends,',
    'un costruttore di strumenti.': 'an instrument maker.',
    'Per sei giorni lo smontai davanti a loro,': 'For six days I took it apart before them,',
    "un pezzo dopo l'altro,": 'one piece after another,',
    'e su ognuno giurai che cosa faceva.': 'and on each I swore what it did.',
    'Quelle ruote le avevo fatte per stare chiuse in una cassa.': 'I had made those wheels to live shut inside a case.',
    'Adesso erano in fila sul tavolo,': 'Now they lay in a row on the table,',
    'e sette uomini ci cercavano un trucco.': 'and seven men were looking in them for a trick.',
    'John Harrison · Londra, 1765': 'John Harrison · London, 1765',

    /* ---------- L'ATELIER · γ Regolare ---------- */
    'Sei posizioni,': 'Six positions,', 'tre settimane.': 'three weeks.',
    "Il bilanciere batte ventunmilaseicento volte l'ora. Lo regoliamo a mano, coricato e in piedi, in sei posizioni, finché sbaglia meno di due secondi al giorno. Poi un'ultima volta: sul mezzogiorno vero del luogo in cui vivrà.": 'The balance beats twenty-one thousand six hundred times an hour. We regulate it by hand, laid flat and stood upright, in six positions, until it runs to within two seconds a day. Then one last time: to the true noon of the place where it will live.',
    '21.600': '21,600', "battiti l'ora": 'beats an hour', 'posizioni': 'positions', 'secondi al giorno': 'seconds a day',
    'Marcia': 'Rate',
    "qui al rallentatore: dal vero va e viene tre volte al secondo, ventunmilaseicento battiti l'ora": 'here in slow motion: in life it swings to and fro three times a second, twenty-one thousand six hundred beats an hour',
    'Il regolatore': 'The regulator', "la punta sposta l'ago di un decimo di millimetro: la marcia cambia di secondi al giorno": 'the point moves the index a tenth of a millimetre: the rate changes by seconds a day',
    // la voce (γ · Regulating)
    'Sulla Deptford, una nave della Marina, nel novembre del 1761 salì mio figlio.': 'In November 1761 my son went aboard the Deptford, a ship of the Navy.',
    'Io avevo sessantotto anni e restai a terra.': 'I was sixty-eight, and I stayed ashore.',
    "L'orologio partì con lui, chiuso in una cassa:": 'The watch sailed with him, shut in a box:',
    'doveva caricarlo ogni giorno, senza regolarlo.': 'he was to wind it every day, and never set it.',
    'Al giorno ottantuno, in Giamaica,': 'On the eighty-first day, in Jamaica,',
    'presero il mezzogiorno vero del luogo': 'they took the true noon of the place',
    "e lo misero accanto all'ora di casa": 'and laid it beside the hour of home',
    "che l'orologio si era portato da Portsmouth.": 'that the watch had carried from Portsmouth.',
    "Un'ora di differenza, quindici gradi di mare.": 'One hour of difference, fifteen degrees of sea.',
    'Era indietro di cinque secondi: due chilometri, dopo un oceano.': 'It was five seconds slow: a mile and a half, after an ocean.',
    'Il Consiglio che teneva il premio disse che non bastava,': 'The Board that held the prize said it was not enough,',
    'e volle un altro viaggio.': 'and asked for another voyage.',
    'John Harrison · Londra, 1762': 'John Harrison · London, 1762',

    /* ---------- L'ATELIER · δ Incidere ---------- */
    'Il quadrante si incide,': 'The dial is engraved,', 'solco per solco.': 'cut by cut.',
    "Il motivo del quadrante lo traccia un tornio a rosa di fine Ottocento: una punta d'acciaio, una camma, una manovella, un solco alla volta, a pochi centesimi di millimetro dal precedente. Nessuna macchina lo ripete uguale. Come una calligrafia.": 'The pattern on the dial is traced by a rose engine of the late nineteenth century: a steel cutter, a cam, a hand crank, one cut at a time, a few hundredths of a millimetre from the last. No machine repeats it the same. Like handwriting.',
    'il tornio': 'the rose engine', 'solchi': 'cuts', "mm tra l'uno e l'altro": 'mm from one to the next',
    'Solchi': 'Cuts', 'un giro, un solco': 'one turn, one cut',
    'Il tornio a rosa': 'The rose engine', 'di fine Ottocento: la punta resta ferma, il quadrante gira': 'late nineteenth century: the cutter stays still, the dial turns',
    'La punta': 'The cutter', 'un solco a ogni giro, a otto centesimi di millimetro dal precedente': 'one cut to each turn, eight hundredths of a millimetre from the last',
    // la voce (δ · Engraving)
    'Sul quadrante del terzo orologio incisi il mio nome': 'On the dial of the third clock I cut my name',
    'e il paese: John Harrison, Barrow.': 'and the village: John Harrison, Barrow.',
    'Gli orologiai di Londra ci scrivevano Londra.': 'The London makers wrote London.',
    "Io scrissi il villaggio sull'Humber": 'I wrote the village on the Humber',
    'dove facevo il falegname.': 'where I was a carpenter.',
    'Fuori da Barrow, nessuno sapeva chi fossi.': 'Outside Barrow, no one knew who I was.',
    'Una lettera alla volta.': 'One letter at a time.',
    'Lì un errore non si poteva più togliere.': 'There a mistake could not be taken out again.',
    "Chi lo guardava sapeva l'ora,": 'Whoever looked at it knew the hour,',
    'e sapeva da dove veniva.': 'and knew where it came from.',
    'John Harrison · Barrow, 1717': 'John Harrison · Barrow, 1717',

    /* ---------- L'ATELIER · la fine ---------- */
    'La tua riga': 'Your line', 'Il prossimo numero': 'The next number', 'è il 059.': 'is 059.',
    "Ogni Hora Vera nasce su richiesta: un nome, un luogo, nove mesi di lavoro. Il registro ha ancora una riga libera quest'anno.": 'Every Hora Vera is made to order: a name, a place, nine months of work. The register still has one line free this year.'
  };
  for (const k in CITTA) F[k] = CITTA[k];

  /* la stessa parola che in un posto preciso si dice in un altro modo: [dove (selettore), { italiano: inglese }] */
  const QUI = [
    ['.apertura h1', { "L'": 'The ' }],          // «L'» + «atelier» → «The atelier»
    ['.racconto', { 'Poi': 'Then' }]
  ];

  /* le scritte che il codice compone con ore, numeri o nomi dentro: [come le riconosco, come si dicono in inglese] */
  const STAGIONI = { inverno: 'winter', primavera: 'spring', estate: 'summer', autunno: 'autumn' };
  const MOMENTI = { 'alba': 'sunrise', 'mezzogiorno vero': 'true noon', 'tramonto': 'sunset' };
  const SUCCEDE = { 'sorge il sole': 'the sun is rising', 'tramonta il sole': 'the sun is setting', 'è mezzogiorno vero': 'it is true noon' };
  const dove = c => c === 'Polo Sud' ? 'At the South Pole' : 'In ' + CITTA[c];
  const REGOLE = [
    [/^(.+) · (inverno|primavera|estate|autunno)$/, m => CITTA[m[1]] && CITTA[m[1]] + ' · ' + STAGIONI[m[2]]],                       // dentro il filmato: «Venezia · autunno»
    [/^(alba|mezzogiorno vero|tramonto) (\d{2}:\d{2})$/, m => MOMENTI[m[1]] + ' ' + m[2]],
    [/^oggi l’alba alle (\d{2}:\d{2})$/, m => 'sunrise today at ' + m[1]],
    [/^meridiano (\d+°\d{2}′) ([EO])$/, m => 'meridian ' + m[1] + ' ' + (m[2] === 'O' ? 'W' : 'E')],
    [/^A (.+) (sorge il sole|tramonta il sole|è mezzogiorno vero)\.$/, m => CITTA[m[1]] && dove(m[1]) + ' ' + SUCCEDE[m[2]] + '.'],
    [/^qui sono le (\d{2}:\d{2})$/, m => 'here it is ' + m[1]],
    [/^sono le (\d{2}:\d{2}) a (.+)$/, m => CITTA[m[2]] && 'it is ' + m[1] + ' in ' + CITTA[m[2]]],
    [/^(N\. \d+|Il protagonista) · (.+)$/, m => (m[1] === 'Il protagonista' ? 'The protagonist' : 'No.' + m[1].slice(2)) + ' · ' + (F[m[2]] || m[2])],   // «N. 036 · Wanli»
    [/^(.+), (.+)$/, m => CITTA[m[1]] && (NOMI.includes(m[2]) || F[m[2]]) ? CITTA[m[1]] + ', ' + (F[m[2]] || m[2]) : undefined],          // la casella per chi non vede: «Venezia, Patavium»
    [/^N\. (\d+)$/, m => 'No. ' + m[1]],
    [/^Ref\. (\d{4}) · N\. (\d+)$/, m => 'Ref. ' + m[1] + ' · No. ' + m[2]],
    [/^· (.+) · (\d+) di (\d+)$/, m => F[m[1]] && '· ' + F[m[1]] + ' · ' + m[2] + ' of ' + m[3]],                                     // «· Rubino e oro · 1 di 8»
    [/^(\d+) di (\d+)$/, m => m[1] + ' of ' + m[2]],
    [/^Dal (\d{4}) al (\d{4})$/, m => 'From ' + m[1] + ' to ' + m[2]],
    [/^([+±]?\d+),(\d+)$/, m => m[1] + '.' + m[2]]                                                                                    // «+18,0» → «+18.0», «0,08» → «0.08»
  ];

  /* restano come sono: il nome, HOME, i nomi degli orologi, i tempi musicali, la firma incisa sul ponte */
  const UGUALI = ['HOME', 'Hora Vera', 'HORA VERA', 'atelier', 'Largo', 'Andante', 'Allegro', 'Presto', 'E. Ferri · 058', ...NOMI];
  const uguale = s => /^[IVXL]+$/.test(s)                                                  // i numeri romani delle voci e della scala delle ore
    || NOMI.some(n => s === '· ' + n || s === n.toUpperCase() || s === n.toLocaleUpperCase('it'));

  /* il titolo della scheda */
  const TITOLI = {
    "Hora Vera · L'ora vera": 'Hora Vera · True time',
    'Hora Vera · Visioni': 'Hora Vera · Visions',
    "Hora Vera · L'atelier (alone di δ)": 'Hora Vera · The atelier'
  };

  /* gli aggiustamenti di impaginazione che servono solo in inglese (valgono solo con <html lang="en">: l'italiano non li vede).
     L'atelier, i titoli dei testi tecnici: in inglese restava una parola sola sull'ultima riga («…for one / watch.», «…that goes / unseen.»);
     con le righe bilanciate vanno a capo pari («Two hundred / and seventy days / for one watch.»). In δ no: lì va già a capo dopo la virgola
     («The dial is engraved, / cut by cut.») e bilanciato veniva peggio. */
  const STILE = 'html[lang="en"] .capitolo:not([data-c="D"]) .testi h2 { text-wrap: balance; }'
    + ' html[lang="en"] .capitolo .testi.tecnico p { text-wrap: pretty; }'    // il testo tecnico non lascia una parola sola in fondo («…are made a / year.»)
    + ' html[lang="en"] .righe::before { content: "Register"; }';             // Visioni: la parola «Registro» sopra l'elenco la scrive lo stile, non la pagina: qui il suo inglese

  window.LINGUA_EN = { frasi: F, qui: QUI, regole: REGOLE, uguali: UGUALI, uguale, titoli: TITOLI, stile: STILE,
    prima: '.capitolo .testi',              // L'atelier: i testi che la pagina spezza in righe (si traducono una volta, prima; lì un cambio di lingua ricarica)
    fuori: '.prova-scorri' };               // il pannellino delle prove dello scorrimento (uno strumento per Franco, non una parte del sito)
})();
