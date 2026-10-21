# Blisterborn

Prototipo mobile di un gioco di ruolo a scelte sul trekking a lunga distanza. La prima avventura disponibile è **La Via delle Renne**, un cammino di sette tappe ispirato alla Lapponia svedese.

## Avvio locale

Il progetto è una PWA statica e non richiede una compilazione. Per provarlo correttamente, inclusi manifest e modalità offline, va servito tramite un server HTTP locale invece di aprire direttamente `index.html`.

## Struttura

- `index.html`: pagina di ingresso e caricamento dei moduli.
- `styles.css`: interfaccia e stile taccuino.
- `src/data.js`: oggetti di base, consumabili, tappe, meteo e terreni.
- `src/state.js`: stato della spedizione ed effetti comuni.
- `src/content.js`: eventi, revisioni degli esiti e catalogo dei prodotti.
- `src/game.js`: motore della tappa e interfaccia del cammino.
- `src/config.js`: nome del gioco, versione e chiave del salvataggio centralizzati.
- `src/visuals.js`: atlanti raster per ritratti, equipaggiamento e scene.
- `src/home.js`: ciclo mensile, negozio, progressione, salvataggi e ritorno a casa.
- `src/bootstrap.js`: registrazione del service worker.
- `docs/`: specifiche e stato funzionale del progetto.
- `scripts/validate-content.cjs`: controllo di riferimenti, duplicati, conteggi, seed e versioni.
- `scripts/smoke-test.cjs`: controllo opzionale del flusso iniziale e dell'avvio offline; richiede Playwright e Chrome o Edge.

## Pubblicazione

GitHub Pages può pubblicare direttamente la radice del branch `main`. Il service worker mantiene in cache tutti i file necessari al funzionamento offline.

## Versione

Prototipo `0.5.6`.

Le tappe 2–8 usano 42 panorami isometrici autonomi in alta risoluzione (1254×1254), senza ritagli da atlanti condivisi.

Gli indicatori di ora, energia, morale e distanza durante il cammino mostrano stato, colore e barra dinamici. Nel paperdoll le ghette sostituiscono le scarpe, mentre pile e guscio possono essere indossati insieme nell'ordine anatomico corretto.

Il paperdoll usa ora l'asse della sagoma opaca reale: corpo, parte bassa, pile, guscio e guanti condividono lo stesso centro in tutti e quattro i personaggi. Il guscio StormShell è giallo ocra come l'icona dell'inventario e ha il cappuccio abbassato per non interferire con i copricapi. Zaino e bastoncini non attraversano più la vista frontale.

Il personaggio conserva il protagonista scelto e usa una vera animazione alternativa quando porta i bastoncini, impugnati e sincronizzati col passo. I colori di vestiti e zaino restano parte del disegno del protagonista; i quattro marchi conservano gli emblemi raster nel negozio e nel catalogo. Le otto tratte dispongono di 48 POI nominati e di 48 sfondi distinti; arrivi serali, mattine dopo il rifugio o la tenda e traguardo di Njalla hanno scene dedicate. Ogni tappa ha inoltre una mappa piegata semplificata con una curva incorporata nel raster e coerente con i sei landmark; l'avanzamento colora la stessa curva. Il taccuino ha quattro livelli di usura raster per tappa. Ventisette paesaggi specifici restano disponibili per futuri sfondi legati agli imprevisti.

La scheda personaggio usa un paper-doll raster: quattro corpi neutri e quaranta livelli trasparenti a canvas intero, con forme separate per modelli e varianti colore dei quattro marchi. `python scripts/build-character-layers.py` riallinea ogni livello agli ancoraggi anatomici ed esporta gli sprite usati dall'interfaccia.

I raster destinati al gioco sono ottimizzati in tavolozza durante la generazione degli sprite, per mantenere più leggeri pubblicazione, cache offline e aggiornamenti della PWA.

Ogni cambiamento al gioco incrementa la versione visibile nella home e il nome della cache nel service worker. Il validatore dei contenuti controlla che i due valori coincidano.

Una partita può essere riprodotta aggiungendo `?seed=NUMERO` all'indirizzo del gioco. Il seed viene mostrato nella schermata finale e nel riepilogo del ritorno a casa.
