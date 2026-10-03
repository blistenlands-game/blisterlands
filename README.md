# Blisterborn

Gioco di ruolo a scelte sul trekking a lunga distanza. La nuova linea di sviluppo usa **Godot 2D 4.7.2**; il prototipo web precedente resta disponibile come riferimento per regole e contenuti.

## Godot 2D

Aprire `project.godot` dalla radice della repository. La vertical slice `0.2.0` comprende schermata iniziale, preparazione, salvataggio nativo e la prima tappa con sei POI animati. I dettagli sono in `godot/README.md`.

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

## Versioni

Godot `0.2.0`.

Prototipo `0.1.28` (web legacy).

Il personaggio conserva il protagonista scelto e usa una vera animazione alternativa quando porta i bastoncini, impugnati e sincronizzati col passo. I colori di vestiti e zaino restano parte del disegno del protagonista; i quattro marchi conservano gli emblemi raster nel negozio e nel catalogo. Le otto tratte dispongono di 48 POI nominati e di 48 sfondi distinti; arrivi serali, mattine dopo il rifugio o la tenda e traguardo di Njalla hanno scene dedicate. Ogni tappa ha inoltre una mappa piegata semplificata con una curva incorporata nel raster e coerente con i sei landmark; l'avanzamento colora la stessa curva. Il taccuino ha quattro livelli di usura raster per tappa. Ventisette paesaggi specifici restano disponibili per futuri sfondi legati agli imprevisti.

I raster destinati al gioco sono ottimizzati in tavolozza durante la generazione degli sprite, per mantenere più leggeri pubblicazione, cache offline e aggiornamenti della PWA.

Ogni cambiamento al gioco incrementa la versione visibile nella home e il nome della cache nel service worker. Il validatore dei contenuti controlla che i due valori coincidano.

Una partita può essere riprodotta aggiungendo `?seed=NUMERO` all'indirizzo del gioco. Il seed viene mostrato nella schermata finale e nel riepilogo del ritorno a casa.
