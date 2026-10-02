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

Prototipo `0.1.14`.

Ogni cambiamento al gioco incrementa la versione visibile nella home e il nome della cache nel service worker. Il validatore dei contenuti controlla che i due valori coincidano.

Una partita può essere riprodotta aggiungendo `?seed=NUMERO` all'indirizzo del gioco. Il seed viene mostrato nella schermata finale e nel riepilogo del ritorno a casa.
