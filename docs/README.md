# Documentazione di Blisterborn

Questa cartella raccoglie le specifiche di sviluppo versionate insieme al gioco.

## Fonti di riferimento

- `database-equipaggiamento.md`: fonte corrente per catalogo, marchi, prezzi, usura e caratteristiche. I primi 51 prodotti sono implementati; la tabella estesa è una roadmap.
- `registro-eventi.md`: inventario corrente dei 439 eventi presenti nel prototipo.
- `documento-di-progetto.md`: visione del gioco e cronologia delle decisioni. Non tutti i numeri descritti sono ancora correnti.

## Stato del prototipo 0.1.22

### Implementato

- Ciclo mensile di casa con lavoro, forma, voglia, ferie e carte.
- Via delle Renne completa, inclusa la vetta facoltativa e la traversata del lago.
- 439 eventi, stagioni, meteo, stati persistenti e conseguenze ritardate.
- Catalogo iniziale di 51 prodotti con quattro marchi, usura, qualità, garanzie e ordini.
- Due cicli di camminata per protagonista, senza bastoncini o con bastoncini realmente impugnati; emblemi raster dei quattro marchi.
- Ventisette paesaggi dedicati collegati alle carte di luogo, oltre ai fondali generici per terreno e alle condizioni atmosferiche animate.
- Raster di gioco compressi senza variazioni di risoluzione per velocizzare deploy, prima apertura e aggiornamento offline.
- Progressione, abilità, diario, timbri e quattro protagonisti.
- PWA installabile con supporto offline.

### Parziale

- Il diario registra materiale, timbri e storia, ma non gestisce ancora obiettivi casuali o fotografie.
- Il faro satellitare offre previsioni e SOS, ma l'abbonamento viene pagato alla partenza e non rinnovato mensilmente.
- Il negozio gestisce gli ordini artigianali, ma non i ritardi casuali.

### Futuro

- Modalità carriera a tempo.
- Fama, Wanderwall, fotografia, follower e sponsor.
- Obiettivi casuali e tecnici strutturati.
- Altri cammini, localizzazione e acquisti dei contenuti.

## Decisione tecnica corrente

Il prototipo resta una PWA web finché il ciclo di gioco non sarà validato. L'eventuale migrazione a Flutter è una decisione di produzione futura, non un requisito dell'attuale base di codice.
