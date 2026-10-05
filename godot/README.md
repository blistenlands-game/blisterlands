# Blisterborn — Godot 2D

Nuova linea del prototipo, versione `0.3.5`, sviluppata con Godot 4.7.2 e GDScript.

## Apertura

Aprire `project.godot` dalla radice della repository con Godot 4.7.2 e premere **F6/F5**.

La build browser viene esportata con il preset `Web` nella cartella `godot-web/` ed è pubblicata da GitHub Pages insieme al repository.
Il pacchetto web usa un nome versionato (`game-<versione>.pck`) per impedire a browser e CDN di riaprire una build precedente dalla cache.

La prima tappa adotta sei quadri isometrici coordinati. L'interfaccia non scorre: barra statistiche e taccuino formano un pannello mobile che si abbassa durante il cammino e risale automaticamente a ogni POI.

Lo styleframe artistico vincolante del primo POI è `assets/concepts/poi-t1-01-lavvu-diorama-styleframe-v1.png`. La scena Blender e il GLB conservano la sua composizione e aggiungono movimento senza degradarne il disegno.

## Vertical slice attuale

- scelta fra i quattro protagonisti e nome libero;
- schermata di preparazione con le varianti d'equipaggiamento richieste;
- salvataggio nativo in `user://blisterborn-godot.json`;
- prima tappa con sei POI e fondali isometrici distinti;
- animazione ambientale specifica e chiaramente visibile per ciascun POI;
- animazioni ambientali differenziate per acqua, vento, vegetazione, luce e fauna lontana;
- nessun personaggio sovrapposto allo scenario.

Le altre modifiche estetiche dell'equipaggiamento verranno realizzate solo a partire da personaggi completi disegnati sul medesimo rig e approvati prima dell'integrazione.
