# Database equipaggiamento

> **Stato:** specifica implementata nel prototipo 0.1.17 per il catalogo iniziale di 51 prodotti. La tabella estesa successiva descrive invece categorie previste per versioni future.

Ogni oggetto ha quattro statistiche: peso, comfort, resistenza, prezzo. Ogni marchio ha una linea classica e una ultralight. Le statistiche numeriche sono da definire in fase di bilanciamento.

Marchi: A = Alvenheim, S = Sentivo, Sh = Shanwu, D = Dirtbag Stitchworks.

## Catalogo, prima versione

51 prodotti dei quattro marchi, già nel prototipo. Ogni prodotto ha caratteristiche da 0 a 3, peso, prezzo, livello minimo per comprarlo, durata in chilometri ed eventualmente un tratto speciale. I prodotti migliori si sbloccano salendo di livello (un livello ogni 100 di esperienza). La tabella più in basso resta come mappa di tutte le categorie previste, comprese quelle non ancora nel gioco.

**Regole dei marchi**

- **Alvenheim**: caro e durevole. Garanzia: un oggetto rotto viene sostituito gratis una volta. Si rivende al 65%.
- **Sentivo**: economico e sempre in negozio, si consuma in fretta.
- **Shanwu**: ottimo prezzo, ma all'acquisto il gioco tira in segreto la qualità: 72% normale, 18% difettoso (si consuma il doppio, la caratteristica principale scende di 1), 10% esemplare eccellente (la caratteristica principale sale di 1). Si scopre dopo il primo cammino.
- **Dirtbag Stitchworks**: si ordina e arriva in tre mesi, leggerissimo, si ripara al 15% del prezzo invece del 30%.

**Usura**: dopo ogni cammino i chilometri percorsi si sommano a ogni oggetto portato. Stati: nuovo, usato, consumato (tutte le caratteristiche −1), rotto (nessun effetto). Al negozio si ripara recuperando il 60% della durata. Si rivende a metà prezzo, ridotto in base allo stato.

**Assortimento**: Sentivo sempre disponibile; ogni mese ogni prodotto Shanwu c'è con il 70% di probabilità e ogni Alvenheim con il 60%; Dirtbag sempre ordinabile.

**Partenza**: Sentivo Gita 40, Rifugio 10°, Zigzag, Cresta Low, Pile Base, Cappello a tesa.

**Simulazione su tre anni**, giocatore che compra l'essenziale e i prodotti migliori quando può: circa 5 cammini, completati circa la metà; soldi a fine periodo intorno ai 300 € invece dei quasi 1.900 di prima; in media 6 oggetti consumati o rotti. Il "dal secondo anno hai tutto" è sparito.

| Marchio | Modello | Tipo | Linea | Peso | Prezzo | Livello | Durata | Caratteristiche | Tratto |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sentivo | Gita 40 | Zaino | classica | 1,9 kg | 90 € | 0 | 220 km | portanza 2 | — |
| Sentivo | Sentiero 55 | Zaino | classica | 2,1 kg | 120 € | 0 | 260 km | portanza 3 | — |
| Shanwu | AirPeak UL 45 | Zaino | ultralight | 0,95 kg | 110 € | 1 | 320 km | portanza 1 | Tasche sulla cintura: +3 energia a ogni tappa |
| Alvenheim | Fjellvind 50 | Zaino | classica | 1,7 kg | 260 € | 2 | 900 km | portanza 3 | Tasche sulla cintura |
| Dirtbag Stitchworks | The Mule | Zaino | ultralight | 0,7 kg | 240 € | 3 | 420 km | portanza 2, asciugatura 1 | Tasca a rete esterna |
| Alvenheim | Fjellvind Lite 40 | Zaino | ultralight | 1 kg | 330 € | 4 | 750 km | portanza 2 | Tasche sulla cintura |
| Sentivo | Rifugio 10° | Sacco sintetico | classica | 1,7 kg | 60 € | 0 | 260 km | calore notturno 1, umido 3 | — |
| Shanwu | SynthQuilt X | Quilt sintetico | ultralight | 0,9 kg | 80 € | 0 | 320 km | calore notturno 1, umido 3 | — |
| Shanwu | DownCocoon 600 | Sacco in piuma | classica | 1 kg | 140 € | 1 | 420 km | calore notturno 2, umido 0 | — |
| Dirtbag Stitchworks | Sasquatch Quilt | Quilt in piuma | ultralight | 0,55 kg | 260 € | 2 | 600 km | calore notturno 2, umido 0 | Si ripara con poco |
| Alvenheim | Polarnatt −5 | Sacco in piuma | classica | 0,9 kg | 380 € | 3 | 1300 km | calore notturno 3, umido 1 | — |
| Sentivo | Zigzag | Materassino in schiuma | classica | 0,4 kg | 20 € | 0 | 2000 km | comfort 1 | — |
| Shanwu | PuffPad | Materassino gonfiabile | ultralight | 0,5 kg | 45 € | 0 | 260 km | comfort 2 | — |
| Dirtbag Stitchworks | Pancake | Materassino in schiuma | ultralight | 0,25 kg | 35 € | 1 | 1500 km | comfort 1 | Fa anche da sedile: +3 morale a ogni tappa |
| Alvenheim | Dunvik Air | Materassino gonfiabile | classica | 0,45 kg | 170 € | 2 | 800 km | comfort 3 | — |
| Sentivo | Cresta Low | Scarpe basse | classica | 1,1 kg | 70 € | 0 | 300 km | asciugatura 2, caviglia 2, aderenza 1, suola 1, piedi asciutti 1 | — |
| Sentivo | Vetta Mid | Scarponi | classica | 1,8 kg | 140 € | 0 | 450 km | asciugatura 1, caviglia 3, aderenza 2, suola 2, piedi asciutti 2 | — |
| Shanwu | CloudStep X3 | Scarpe da trail | ultralight | 0,8 kg | 75 € | 0 | 350 km | asciugatura 3, caviglia 1, aderenza 2, suola 1 | — |
| Alvenheim | Stigfinner | Scarpe basse | classica | 1,2 kg | 190 € | 1 | 800 km | asciugatura 2, caviglia 2, aderenza 3, suola 2, piedi asciutti 2 | — |
| Alvenheim | Gletscher GTX | Scarponi | classica | 1,6 kg | 260 € | 2 | 1200 km | asciugatura 1, caviglia 3, aderenza 3, suola 3, fango 1, piedi asciutti 3 | — |
| Sentivo | Antipioggia | Guscio | classica | 0,45 kg | 45 € | 0 | 150 km | impermeabile 1, antivento 1 | — |
| Shanwu | StormShell | Guscio | ultralight | 0,3 kg | 90 € | 0 | 320 km | impermeabile 2, antivento 2 | — |
| Dirtbag Stitchworks | Poncho Tarp | Guscio | ultralight | 0,35 kg | 110 € | 1 | 320 km | impermeabile 2, antivento 1, riparo 1 | Anche riparo d'emergenza |
| Alvenheim | Regnskydd 3L | Guscio | classica | 0,38 kg | 290 € | 3 | 950 km | impermeabile 3, antivento 3 | Colore sgargiante |
| Sentivo | Pile Base | Strato caldo | classica | 0,45 kg | 25 € | 0 | 600 km | calore 2, antivento 1 | — |
| Shanwu | PuffLite | Strato caldo | ultralight | 0,3 kg | 70 € | 0 | 320 km | calore 2 | — |
| Alvenheim | Ullvarm | Strato caldo | classica | 0,42 kg | 150 € | 1 | 900 km | calore 2, antivento 1 | Lana che non puzza: +2 morale ogni sera |
| Alvenheim | Varmekjerne | Strato caldo | ultralight | 0,33 kg | 240 € | 2 | 900 km | calore 3, antivento 1 | — |
| Sentivo | Campeggio 2 | Tenda | classica | 2,6 kg | 90 € | 0 | 400 km | riparo 2 | — |
| Shanwu | SkyDome 1 | Tenda | ultralight | 1,2 kg | 150 € | 1 | 320 km | riparo 2 | — |
| Dirtbag Stitchworks | Pyramid Tarp | Tenda | ultralight | 0,6 kg | 300 € | 2 | 600 km | riparo 2 | Si ripara con poco |
| Alvenheim | Tundra 2 | Tenda | classica | 2 kg | 450 € | 3 | 1600 km | riparo 3 | — |
| Sentivo | Trek | Bastoncini | classica | 0,55 kg | 30 € | 0 | 500 km | appoggio 1 | — |
| Shanwu | CarbonLite | Bastoncini | ultralight | 0,38 kg | 60 € | 0 | 350 km | appoggio 2 | — |
| Alvenheim | Stav Carbon | Bastoncini | ultralight | 0,35 kg | 160 € | 2 | 1200 km | appoggio 3 | — |
| Sentivo | Ghette Fango | Ghette | classica | 0,25 kg | 20 € | 0 | 300 km | fango 1 | — |
| Dirtbag Stitchworks | Ghost Gaiters | Ghette | ultralight | 0,08 kg | 35 € | 1 | 300 km | fango 2 | Si ripara con poco |
| Alvenheim | Myrvakt | Ghette | classica | 0,3 kg | 90 € | 2 | 1000 km | fango 3 | — |
| Sentivo | Fornello Base | Fornello | classica | 0,35 kg | 25 € | 0 | 800 km | cucina 1 | — |
| Shanwu | RapidFlame | Fornello | ultralight | 0,3 kg | 45 € | 0 | 500 km | cucina 2 | — |
| Dirtbag Stitchworks | Ramen Pot | Fornello | ultralight | 0,15 kg | 50 € | 1 | 900 km | cucina 1 | Si ripara con poco |
| Sentivo | Pastiglie | Acqua | classica | 0,05 kg | 15 € | 0 | 200 km | acqua sicura 1 | — |
| Alvenheim | Klarvann | Acqua | ultralight | 0,1 kg | 55 € | 1 | 1200 km | acqua sicura 3 | — |
| Sentivo | Rete antizanzare | Rete | classica | 0,05 kg | 10 € | 0 | 300 km | antinsetti 3 | — |
| Sentivo | Cappello a tesa | Cappello | classica | 0,1 kg | 25 € | 0 | 600 km | ombra 2 | — |
| Sentivo | Sandali da guado | Sandali | classica | 0,4 kg | 40 € | 0 | 500 km | guado 2 | — |
| Sentivo | Kit riparazione | Kit | classica | 0,15 kg | 20 € | 0 | — | riparazione 2 | — |
| Sentivo | Mazzo di carte | Svago | classica | 0,1 kg | 5 € | 0 | — | svago 1 | — |
| Sentivo | Mappa e bussola | Orientamento | classica | 0,15 kg | 25 € | 0 | — | orientamento 2 | — |
| Shanwu | TrailWatch 2 | Orologio GPS | ultralight | 0,07 kg | 180 € | 1 | — | orientamento 2 | — |
| Alvenheim | Fyr SOS | Faro satellitare | classica | 0,15 kg | 350 € | 2 | — | — | Previsioni, messaggi, SOS |

Tutti i nomi di prodotto sono inventati: vanno verificati contro i marchi registrati prima del lancio.

| Zona | Slot | Oggetto | Varianti | Effetto di gioco | Marchi |
| --- | --- | --- | --- | --- | --- |
| Abbigliamento | Testa, copricapo | Berretto | Lana, sintetico | Protegge dal freddo | A, S, Sh |
| Abbigliamento | Testa, copricapo | Cappello a tesa larga | — | Riduce danni da sole e caldo | A, S, Sh |
| Abbigliamento | Testa, copricapo | Scaldacollo | — | Piccolo bonus contro freddo e vento | A, S, Sh |
| Abbigliamento | Testa, accessorio | Rete antizanzare | — | Annulla gli eventi zanzara; si indossa sopra il copricapo | S, Sh |
| Abbigliamento | Busto, base | Maglia | Sintetica, merino | Sintetica asciuga veloce ma puzza; merino non puzza e scalda bagnata | A, S, Sh |
| Abbigliamento | Busto, intermedio | Strato caldo | Pile, piumino, imbottita sintetica | Calore; il piumino è inutile da bagnato | A, S, Sh |
| Abbigliamento | Busto, esterno | Guscio | Impermeabile, antivento, poncho | Pioggia e vento; il poncho copre lo zaino ma soffre il vento | A, S, Sh |
| Abbigliamento | Gambe | Pantaloni | Trekking, convertibili, pantaloncini, calzamaglia termica | Comfort, caldo o freddo; i pantaloncini espongono a zanzare e graffi | A, S, Sh |
| Abbigliamento | Gambe, esterno | Sovrapantaloni impermeabili | — | Pioggia battente | A, S, Sh |
| Abbigliamento | Piedi | Calzature | Scarponi alti, scarpe basse, scarpe da trail | Protezione caviglie contro leggerezza e asciugatura; si consumano con i km | A, S, Sh |
| Abbigliamento | Piedi | Calze | Lana, sintetiche, impermeabili | Vesciche, piedi bagnati | A, S, Sh |
| Abbigliamento | Piedi, accessorio | Ghette | Basse, alte | Contro fango, neve e piedi bagnati | A, S |
| Abbigliamento | Piedi, accessorio | Ramponcini | — | Nevai e ghiaccio | A, S |
| Abbigliamento | Mani | Guanti | Leggeri, muffole, impermeabili | Freddo e pioggia | A, S, Sh |
| Abbigliamento | Bastoncini | Bastoncini | Alluminio, carbonio | Meno fatica in discesa, aiuto nei guadi; prerequisito per la tenda da bastoncini | A, S, Sh |
| Abbigliamento | Occhi | Occhiali | Da sole, da ghiacciaio | Sole, neve, ghiacciai | A, S, Sh |
| Zaino | Zaino | Zaino | 35 L, 50 L, 65 L; con o senza telaio | Capacità; il telaio rende comodi i carichi pesanti | A, S, Sh, D |
| Zaino | Protezione | Coprizaino, sacca interna, dry bag | — | Proteggono il contenuto da pioggia e guadi | A, S, Sh, D |
| Riparo | Tenda | Tenda | Doppio telo, telo singolo, da bastoncini | Robustezza contro peso; quella da bastoncini richiede i bastoncini | A, S, Sh, D |
| Riparo | Tenda, accessorio | Base sotto tenda | — | Protegge il fondo e rallenta l'usura; aggiunge peso | A, S, Sh, D |
| Riparo | Alternativa | Tarp, sacco da bivacco, amaca | — | Minimo peso, poca protezione; l'amaca solo con alberi | S, Sh, D |
| Dormire | Sacco | Sacco a pelo | Piuma, sintetico; estate, tre stagioni, inverno | La piuma soffre l'umidità | A, S, Sh, D |
| Dormire | Sacco | Quilt | Piuma, sintetico; estate, tre stagioni, inverno | Leggerissimo, meno caldo | Sh, D |
| Dormire | Sacco, accessorio | Sacco lenzuolo | — | Obbligatorio in alcuni rifugi | A, S |
| Dormire | Materassino | Materassino | Gonfiabile light, gonfiabile ultralight, schiuma | Il gonfiabile può bucarsi; l'ultralight isola meno; la schiuma è indistruttibile | A, S, Sh, D |
| Dormire | Comfort | Cuscino gonfiabile | — | Comfort e morale | A, S, Sh |
| Cucina | Fornello | Fornello | Cartuccia, integrato, alcol, multicombustibile | Velocità contro peso; il multicombustibile serve dove le cartucce mancano | A, S, Sh |
| Cucina | Accessori | Pentolino, posata, accendino | Alluminio, titanio | Necessari per i pasti caldi | A, S, Sh |
| Acqua | Contenitore | Borraccia, sacca idrica | — | Scorta d'acqua | A, S, Sh |
| Acqua | Trattamento | Filtro, pastiglie | — | Eliminano il rischio di stare male; le pastiglie sono lente | A, S, Sh |
| Orientamento | Mappa | Mappa e bussola | — | Base, nessuna batteria | S |
| Orientamento | GPS | GPS | Da orologio, palmare | Precisione; batteria limitata, il palmare pesa di più | A, Sh |
| Orientamento | Telefono | App sul telefono | — | GPS anche senza copertura con mappe scaricate; consuma batteria, soffre pioggia e freddo | — |
| Elettronica | Sicurezza | Faro satellitare | Alvenheim Fyr, Shanwu | Previsioni, SOS, messaggi a casa; abbonamento mensile | A, Sh |
| Elettronica | Energia | Powerbank | Piccolo, grande | Ricarica dispositivi | S, Sh |
| Elettronica | Energia | Pannello solare | — | Ricarica col sole, inutile nella nebbia | Sh |
| Elettronica | Foto | Action camera | — | Ricordi e piccola fama | Sh |
| Elettronica | Foto | Corredo fotografico | Light, medium, large | Morale, fama, soldi; animali rari solo con medium e large | Da definire |
| Sicurezza | Luce | Frontale | — | Cammino al buio | A, S, Sh |
| Sicurezza | Kit | Pronto soccorso | Base, completo | Cura stati e infortuni | A, S |
| Sicurezza | Kit | Riparazione | — | Nastro, toppe, ago e filo: ripara tenda e materassino | S |
| Sicurezza | Varie | Coltellino, fischietto, coperta termica | — | Piccoli bonus di emergenza | S, Sh |
| Igiene | Cura | Crema solare, burrocacao, repellente | — | Sole e zanzare | S |
| Igiene | Piedi | Cerotti per vesciche, nastro, talco | — | Prevengono e curano le vesciche | S |
| Igiene | Pulizia | Asciugamano | Microfibra, compresso | Il compresso occupa pochissimo ma serve acqua | S, Sh |
| Igiene | Pulizia | Sapone biodegradabile, paletta | — | Igiene in natura | S |
| Igiene | Comfort | Bidet portatile | — | Costa e pesa, alza comfort e morale; nome di fantasia da inventare | Sh |
| Cibo | Pasti | Liofilizzati | — | Leggeri e cari | A, S |
| Cibo | Pasti | Pasta e riso | — | Economici e pesanti, servono gas e acqua | S |
| Cibo | Snack | Barrette, frutta secca, cioccolato | — | Energia veloce; il cioccolato dà morale | S |
| Cibo | Extra | Caffè solubile, cibo fresco, sali minerali | — | Morale al mattino; fresco pesante ma ottimo i primi giorni; sali col caldo | S |
| Comfort | Campo | Ciabatte da campo, sedia ultralight | — | Recupero e morale la sera | S, Sh, D |
| Comfort | Svago | Libro o lettore, mazzo di carte, ukulele, fiaschetta | — | Morale; le carte aprono eventi sociali; l'ukulele è pesante e ridicolo | S |
| Speciale | Ferrata | Casco e kit da ferrata | — | Necessari sulle Dolomiti | A, S |
| Speciale | Sole | Ombrello da trekking | — | Sole sui cammini caldi, inutile col vento | Sh, D |

Dirtbag Stitchworks produce solo zaini, ripari, sacchi, quilt, materassini e pochi accessori, per restare riconoscibile.
