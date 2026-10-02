# Blisterlands: A Wanderer's Tale — Documento di progetto

> **Stato:** documento di visione e storico delle revisioni. Le sezioni “Nel prototipo” e “Da decidere” contengono anche decisioni superate; per lo stato corrente consultare il README della cartella `docs`.

Oct 1, 2026 · @Nicola

## Visione

Un gioco per smartphone a scelte, con elementi da gioco di ruolo, sul trekking a lunga distanza. Ogni partita è una tappa di 3-5 minuti: si cammina, si affrontano imprevisti, si decide.

- **Piattaforma**: solo smartphone, Android e iOS, sviluppato in Flutter.
- **Tono**: realistico e autentico, scritto da chi i cammini li ha fatti davvero, con momenti buffi.
- **Pubblico**: escursionisti e appassionati di outdoor, e chi sogna i grandi cammini.
- **Riferimenti**: l'immediatezza di Reigns, ma senza copiarne meccaniche, swipe o barre.

## Ciclo di casa

Tra un cammino e l'altro si è a casa, e il tempo scorre un mese per carta. Ogni carta propone una scelta, e le carte che escono dipendono dallo stato del giocatore.

- **Lavoro**: ogni mese porta stipendio e giorni di ferie.
- **Preparazione**: si sceglie il cammino, il mese di partenza e si prepara lo zaino.
- **Unica schermata fuori dalle carte**: lo zaino, con l'omino da vestire.

### Malus dell'attesa

Aspettare per accumulare soldi deve sempre costare qualcosa. Sono attivi tutti questi meccanismi:

- **Tetto alle ferie**: oltre un certo numero di giorni, quelli nuovi si perdono.
- **Forma fisica**: cala con i mesi in ufficio; si mantiene spendendo tempo o soldi in allenamento.
- **Stagioni**: ogni cammino ha la sua finestra reale; se la si perde si rimanda o si parte con neve e rifugi chiusi.
- **Voglia di partire**: il morale cala a ogni mese di lavoro, fino al burnout.
- **Carriera a tempo**: modalità sfida, la partita dura un numero fisso di anni e conta il punteggio finale.

### Nel prototipo

- **Partenza**: aprile dell'anno 1, 300 €, 8 giorni di ferie, forma 60, voglia 70, attrezzatura base (zaino classico, sacco sintetico, materassino in schiuma, scarpe da trail, pile, cappello).
- **Ogni mese**: +110 € risparmiati, +2 giorni di ferie fino a un tetto di 20, forma −6, voglia −4, poi una carta con due o tre scelte. 17 carte, alcune legate alla stagione o allo stato.
- **Cammino**: possibile da giugno a settembre, il mese di partenza decide meteo ed eventi. Il cammino completo richiede circa 8 giorni di ferie. Soldi e scorte dello zaino sono quelli di casa; le scorte mancanti si comprano preparando lo zaino.
- **Forma e voglia sul sentiero**: la forma riduce la fatica per chilometro, la voglia decide il morale di partenza.
- **Ritorno**: esperienza, timbri nel diario, oggetti persi o trovati, forma +15, voglia alta se hai completato il cammino. Il mese avanza.
- **Abilità**: un punto ogni 100 di esperienza, massimo 5 per abilità. Resistenza riduce la fatica; adattamento riduce i cali di morale; orientamento e tecnica aggiungono un punto alle caratteristiche relative ogni due livelli.
- **Negozio**: prezzi indicativi da 5 a 350 €, rivendita a metà prezzo, saldi del 30% con la carta dei saldi. Ordine artigianale con consegna in tre mesi.
- **Salvataggio**: la partita di casa si salva nel browser; un cammino interrotto a metà non viene salvato.

Simulazione su tre anni con un giocatore che compra l'essenziale e parte quando può: circa 2 o 3 cammini per stagione, completati circa l'82%. L'economia è ancora generosa: da rivedere dopo i test.

**Revisione dopo i primi test.**

- **Piano del mese**: ogni mese si sceglie come viverlo. Lavoro normale (+70 €, forma −6, voglia −4), straordinari (+150 €, forma −9, voglia −11, burnout se ripetuti), lavoro e allenamento (+35 €, forma +9), gite nel weekend (0 €, forma +5, voglia +9). Poi arriva la carta.
- **Forma e voglia visibili**: a casa si vede quanta fatica in più o in meno costerà ogni chilometro e con che morale si partirebbe. L'effetto della forma è più forte: da circa +35% di fatica a forma 0 a −25% a forma 100.
- **Stagioni con un prezzo**: giugno bassa stagione, rifugi più vuoti e −20% sui prezzi; agosto alta stagione, rifugi pieni prima e +20%; settembre fine stagione, i rifugi senza spaccio possono aver già chiuso e resta solo il locale invernale.
- **Fame**: senza pranzo o senza cena la fame sale per livelli, fa aumentare la fatica del 15% per livello e cala il morale. Si recupera mangiando.
- **Prezzi rivisti**: i quilt costano meno dei sacchi equivalenti; risparmio mensile ridotto.

Simulazione del primo cammino, giocatore prudente con lo stesso criterio di acquisti: partenza a giugno 63% completato, luglio 50%, agosto 36%, settembre 55%; settembre con straordinari: attrezzatura completa ma 54%, perché si parte stanchi e senza voglia. Aspettare non conviene più sempre.

**Attraversamento dei laghi.** Dinamica ispirata ai laghi del Kungsleden, nel prototipo sulla tappa 3, Gaskas → Biegga, poco dopo metà tappa. Due modi per passare:

- **Barca a motore**: tre corse al giorno, alle 10, alle 12 e alle 14; si aspetta la corsa successiva e si pagano 30 € (con il ricarico o lo sconto del mese). In agosto la barca può essere piena e si aspetta la corsa dopo. Dopo le 14 restano i remi, una corsa straordinaria a prezzo doppio chiamando col telefono o col faro, oppure aspettare per ore che passi un pescatore.
- **Barche a remi**: su ogni lago ci sono tre barche. Con il 50% di probabilità ne trovi due sulla tua riva: ne prendi una e attraversi, mezz'ora. Altrimenti ce n'è una sola: attraversi, ne leghi una seconda alla tua, la riporti indietro e riattraversi, tre traversate e un'ora e mezza. Con il 25% di probabilità c'è un altro escursionista e si rema in due: metà fatica. Con il vento tempi e fatica aumentano del 50%.

**Niente sorprese sulle barche.** Quante barche a remi ci sono, e se c'è un altro escursionista con cui remare, si vede appena si arriva al pontile. L'opzione dei remi mostra in anticipo tempo e fatica, così chi è stanco può scegliere di aspettare la barca a motore. Resta solo un piccolo imprevisto possibile, il remo che scivola fuori dallo scalmo, con dieci minuti di ritardo.

**La piena.** Il meteo ha memoria anche per i laghi: se il giorno prima ha piovuto, con il 70% di probabilità il lago si è alzato e le barche a remi sono state strappate dagli ormeggi; con due giorni di pioggia di fila succede sempre. Resta solo la barca a motore. La sera prima il custode avverte, così il giocatore può decidere di partire presto. Nelle simulazioni la piena capita in circa una traversata su cinque.

Nei prossimi cammini lo stesso modulo può tornare su altri laghi e altri traghetti, con orari e prezzi diversi.

### Esempi di carte

- **Straordinari**: più soldi, ma morale giù e niente allenamento.
- **Weekend in Appennino**: forma fisica su, qualche soldo speso.
- **Saldi di fine stagione**: tenda leggera a prezzo scontato.
- **Ferie in scadenza**: parti subito per un cammino corto o le perdi.
- **Si apre la stagione**: prenoti ora o rischi rifugi pieni.
- **Rinnovo abbonamento satellitare**: paghi o il faro resta inutilizzabile.
- **Ordine artigianale in ritardo**: l'attrezzatura di Dirtbag Stitchworks non è pronta; parti senza o aspetti.

## Ciclo del cammino

Ogni cammino è diviso in tappe reali, e una tappa è una sessione di 3-5 minuti. La tappa è una linea: il sentiero da un rifugio all'altro, con i chilometri segnati e l'omino che avanza.

Il sentiero è uno e si va dritti. Lungo la linea compaiono tre tipi di momenti:

- **Imprevisti**: arrivano e vanno affrontati. Guado gonfio, temporale sul passo, vescica, renne sul sentiero. Due o tre opzioni.
- **Decisioni**: le prende il giocatore. Fermarsi a pranzo, riempire la borraccia, cambiarsi le calze. Piccole, ma pesano su energia, morale e tempo.
- **Deviazioni**: le uniche diramazioni vere, verso una cascata, una vetta, un panorama. Costano tempo ed energia, danno ricordi, timbri e obiettivi.

Il terreno dà il ritmo: una salita al passo ha eventi ravvicinati, una valle lunga ne ha pochi.

### La sera al rifugio

Ogni tappa si chiude con una carta serale: dove dormire, cosa mangiare, cosa riparare.

- **Rifugio**: costa soldi, recupero pieno.
- **Tenda**: gratis, recupero legato al meteo e all'attrezzatura.
- **Spaccio**: dove presente, permette di rifornirsi.
- **Previsioni del custode**: base per decidere se partire o aspettare un giorno.

## Risorse, stati e fallimento

Niente barre che fanno finire la partita: quattro risorse da gestire, più gli stati che ci si porta dietro.

| Risorsa | Cosa la consuma | Cosa la ricarica |
| --- | --- | --- |
| Energia | Chilometri, dislivello, peso dello zaino | Sonno, pasti caldi, riposo |
| Cibo | Ogni giorno di cammino | Spacci, zaino |
| Morale | Pioggia, fatica, imprevisti | Panorami, incontri, sauna, comfort |
| Giorni di ferie | Ogni giorno, anche fermi o persi | Solo il lavoro a casa |

I giorni di ferie sono l'orologio del gioco: se finiscono prima dell'arrivo, il cammino si abbandona.

**Stati persistenti**: piedi bagnati, vesciche, freddo, raffreddore, stanchezza. Passano da una tappa all'altra e peggiorano le probabilità degli eventi.

**Fallimento**: si abbandona per stanchezza, infortunio o ferie finite. Si conservano esperienza e timbri già ottenuti, quindi ogni tentativo rende più forti.

### Fama e Wanderwall

La fama è una risorsa del ciclo di casa, accanto a soldi e ferie. Cresce pubblicando su Wanderwall, il social di fantasia del gioco.

- **Pubblicare richiede connessione**: rifugi con copertura e villaggi sì, zone isolate no. Le foto aspettano nel telefono.
- **I post nascono da foto e momenti speciali**: animali rari, aurore, imprevisti raccontati bene.
- **Le foto sono carte da collezione nel diario**, non immagini generate.
- **Ricompense della fotografia**: morale, fama, soldi da concorsi e vendita; gli animali rari si fotografano bene solo col corredo medium o large.
- **Sponsor a soglie di follower**: prima barrette, poi scarpe, poi un contratto con Alvenheim.
- **La fama cala se si sparisce**: mesi senza pubblicare fanno perdere follower, un altro malus dell'attesa.
- **Carte buffe**: post virale per sbaglio, troll che abbassa il morale, marchio che chiede la foto delle sue barrette sul passo.

## Casualità

La casualità agisce su tre livelli, perché la stessa tappa non sia mai uguale due volte.

1. **Quali eventi escono.** Ogni tappa ha un mazzo di eventi più grande di quelli usati in una partita. Si pesca in base a terreno, meteo, stagione e stato del giocatore. Il mazzo ha tre strati: eventi generici, eventi d'ambiente, eventi unici del cammino.
2. **Come vanno le scelte.** Nessun esito è garantito. Le probabilità dipendono da abilità e attrezzatura. Il giocatore vede il livello di rischio, basso, medio o alto, non la percentuale. Anche un successo può avere un costo collaterale.
3. **Il meteo.** Generato giorno per giorno dai dati climatici reali di regione e mese. Ha memoria: se oggi piove, domani è più probabile che piova ancora.

### Previsioni

La sera il custode del rifugio dà le previsioni per il giorno dopo. Possono sbagliare, e sbagliano di più quanto più sono lontane. Il faro satellitare le rende più affidabili e disponibili anche in tenda.

## Eventi e contenuti

Obiettivo: circa 500 contenuti per cammino, perché ogni partita sia diversa. Il motore è stato validato con un prototipo giocabile delle prime due tappe della Via delle Renne, con 57 eventi.

### Lezioni dal prototipo

- **Nessuna opzione gratis**: se un'opzione non costa niente, la scelta è ovvia. Ogni opzione paga in una moneta diversa: tempo, energia, morale, soldi, scorte.
- **Orologio della tappa**: ogni scelta costa o fa risparmiare minuti. Dopo le 16 i letti dei rifugi iniziano a riempirsi, la sauna chiude presto. Senza orologio la prudenza vince sempre.
- **Esiti multipli e misti**: ogni opzione ha 2-4 esiti pesati, spesso con lato buono e cattivo insieme. Il livello di rischio mostrato si calcola dagli esiti.
- **Conseguenze ritardate**: saltare il pranzo o bere dal torrente presenta il conto più avanti.
- **Scorte contate**: pasti, barrette, gas, cerotti, repellente, calze di ricambio, batteria.
- **Effetti passivi a ogni tratto**: meteo, attrezzatura e stati agiscono anche fuori dagli eventi.
- **Equilibrio**: nessuno stile di gioco vince sempre. Verificato con simulazioni automatiche di migliaia di partite.

### Formato di un evento

- **Condizioni**: cammino, tappa, terreno, meteo, ora, stato del giocatore, ricordi di eventi precedenti.
- **Testo variabile**: cambia con il contesto, per esempio il guado in piena con la pioggia.
- **Opzioni**: costo in tempo, scorte usate, requisiti di attrezzatura.
- **Esiti**: peso, tono buono, misto o cattivo, testo ed effetti.
- **Catene**: un esito può lasciare un ricordo che sblocca eventi futuri, anche all'arrivo al rifugio.

### Come arrivare a 500 per cammino

Un cammino non ha bisogno di 500 eventi scritti apposta. Composizione decisa, da completare prima di andare in produzione:

| Livello | Esempi | Quota per cammino |
| --- | --- | --- |
| Eventi comuni a tutti i cammini | Vesciche, pranzo, guadi, persone incontrate | 300, condivisi |
| Eventi di regione o ambiente | Zanzare e renne in Lapponia, caldo nel Mediterraneo | 150 per regione |
| Eventi unici del cammino | Luoghi, personaggi e catene di quel percorso | 200 |

Ogni evento conta più volte grazie alle varianti di contesto e agli esiti multipli.

### Equipaggiamento negli eventi

Regola da applicare quando il database sarà completo: ogni oggetto deve avere almeno un effetto passivo visibile e comparire in un numero minimo di eventi. Una tabella di copertura segnala gli oggetti che non contano abbastanza. Nel prototipo, per esempio, cappello e scarponi hanno effetti troppo deboli.

## Personaggio

Il personaggio ha quattro abilità che crescono con l'esperienza; ogni livello dà un punto da spendere.

| Abilità | Cosa influenza |
| --- | --- |
| Resistenza | Consumo di energia, tappe lunghe, recupero |
| Orientamento | Rischio di perdersi, sentieri non segnati, nebbia |
| Tecnica di montagna | Guadi, passi, nevai, tratti esposti |
| Adattamento | Effetto di meteo, freddo, zanzare e stati negativi |

L'esperienza arriva da tappe, imprevisti superati, deviazioni e obiettivi. Alcune deviazioni e obiettivi sono bloccati fino a un certo livello, così rifare un cammino più forti ha senso.

## Equipaggiamento

L'equipaggiamento è passivo: gli oggetti sbloccano opzioni negli eventi e cambiano le probabilità. Ogni oggetto ha quattro statistiche: peso, comfort, resistenza e prezzo. Le scarpe si consumano con i chilometri, e quelle nuove danno vesciche nei primi giorni.

Elenco completo degli oggetti, con varianti, effetti e marchi: Database equipaggiamento

### Caratteristiche

Gli eventi non controllano oggetti precisi ma caratteristiche, su una scala da 0 a 3. Ogni oggetto è un insieme di valori; se ne indossi più d'uno, vale il più alto. Così marchi e linee si aggiungono come dati, senza toccare gli eventi.

| Caratteristica | Cosa influenza | Valori nel prototipo |
| --- | --- | --- |
| Impermeabilità | Morale sotto la pioggia, eventi di pioggia | guscio 2 |
| Antivento | Freddo e morale col vento | guscio 2, pile 1 |
| Calore | Recupero dal freddo, bufere | pile 2 |
| Piedi asciutti | Probabilità di bagnarsi i piedi | scarponi 2 |
| Protezione dal fango | Fango, torbiere, erba bagnata | ghette 3, scarponi 1 |
| Asciugatura | Velocità con cui si asciugano le scarpe, passo | trail 3, scarponi 1 |
| Protezione caviglia | Storte, vesciche da scarpone rigido | scarponi 3, trail 1 |
| Aderenza | Neve, placche, brina | scarponi 3, trail 2 |
| Protezione suola | Pietre appuntite | scarponi 3, trail 1 |
| Appoggio | Fatica, guadi, nevai, discese | bastoncini 2 |
| Guado | Attraversamenti con i piedi asciutti | sandali 2 |
| Antinsetti | Zanzare e moscerini | rete 3 |
| Ombra | Scottature e riverbero | cappello 2 |
| Acqua sicura | Bere da torrenti e pozze | filtro 2 |
| Orientamento | Nebbia, bivi, traccia persa | mappa e bussola 2 |
| Riparazione | Guasti all'attrezzatura | kit 2 |
| Cucina | Pasti caldi, acqua bollita | fornelletto 2 |
| Riparo | Notti e attese all'aperto | tenda 2 |
| Svago | Eventi sociali e attese | carte 1 |

**Peso base modulare.** Il peso fisso comprende solo vestiti, sacco lenzuolo e piccole cose (1,6 kg). Zaino, sacco a pelo e materassino si scelgono, uno per tipo, con quattro nuove caratteristiche:

| Caratteristica | Cosa influenza | Valori nel prototipo |
| --- | --- | --- |
| Portanza | Quanto pesa ogni chilo oltre i 7; sotto 2 e oltre 9 kg, morale che cala per le spalle | zaino classico 3, ultralight 1 |
| Calore notturno | Freddo nel sacco in tenda, in base a mese e meteo | piuma 3, sintetico 2, quilt piuma 2, quilt sintetico 1 |
| Resistenza all'umido | Sacco bagnato e condensa | sintetico 3, quilt sintetico 3, piuma 0 |
| Comfort notturno | Recupero sul pavimento e in tenda; il gonfiabile può bucarsi | gonfiabile 3, schiuma 1 |

Da fare verso la produzione: catalogo completo con marchi e linee, valori per ogni oggetto, usura.

### L'omino, cioè l'abbigliamento

- **Testa**: due slot, copricapo (berretto, cappello da sole, scaldacollo) e accessorio combinabile (rete antizanzare).
- **Busto a strati**: maglia tecnica, pile, guscio impermeabile.
- **Gambe e piedi**: pantaloni, ghette, calze, scarpe o scarponi.
- **Mani**: guanti; i bastoncini hanno uno slot separato e sono prerequisito per la tenda da bastoncini.
- **Occhi**: occhiali da sole.

### Lo zaino

Ha volume e peso massimi, e il peso totale costa energia a ogni tappa.

- **Big five senza scarpe**: zaino, tenda, sacco a pelo, materassino.
- **Cucina**: fornelletto, pentolino, gas.
- **Acqua**: borraccia e filtro.
- **Orientamento**: mappa, bussola, GPS.
- **Sicurezza**: pronto soccorso, frontale, powerbank, pannello solare, faro satellitare. Fotografia: action camera e corredo light, medium o large.
- **Cibo**: liofilizzato leggero e caro, oppure cibo normale pesante ed economico.
- **Consumabili**: cerotti per vesciche, gas, repellente.
- **Comfort**: ciabatte, cuscino, libro.

### Marchi di fantasia

| Marchio | Ispirazione | Personalità di gioco |
| --- | --- | --- |
| Alvenheim | Europeo di qualità | Caro, resistente, comodo; garanzia: se si rompe in cammino, a casa viene sostituito |
| Sentivo | Grande catena sportiva | Economico, onesto, pesante; si trova anche negli spacci lungo il percorso |
| Shanwu | Cinese economico ma valido | Leggero ed economico, con un dado di qualità: pezzo eccezionale o difettoso |
| Dirtbag Stitchworks | Laboratorio artigianale americano | Leggerissimo e carissimo; consegna dopo mesi |

Ogni marchio ha due linee: **classica**, più comfort e protezione ma più peso; **ultralight**, leggerissima ma meno comfort e resistenza.

### Faro satellitare

Versioni Alvenheim Fyr, affidabile e cara, e Shanwu, economica ma con rischio di perdere il segnale.

- **Previsioni**: disponibili ovunque e più precise.
- **SOS**: in caso di abbandono, i soccorsi arrivano prima e si risparmiano giorni di ferie.
- **Messaggi a casa**: piccolo bonus di morale.
- **Costi**: prezzo alto, batteria da ricaricare col powerbank, abbonamento mensile pagato a casa.

## Obiettivi e diario

Ogni cammino ha obiettivi fissi più tre obiettivi casuali pescati a ogni partenza. Alcuni sono bloccati da livello o attrezzatura.

| Tipo | Cosa premia | Esempio |
| --- | --- | --- |
| Highlight | Deviazioni famose | Salire sulla vetta più alta della regione |
| Tecnici | Il modo di camminare | Finire sotto un certo numero di giorni, solo in tenda, zaino leggero |
| Buffi | Momenti da raccontare | Le tre traversate a remi, cento punture di zanzara, sfida col lemming |
| Casuali | Incontri fortunati | Branco di renne, aurora, notte col sole di mezzanotte |

Completare un obiettivo dà esperienza, soldi e timbri rari.

**Il diario**: ogni tappa lascia un timbro, ogni momento speciale un ricordo. A fine cammino si ottiene un diario illustrato; completarlo è il motivo per rigiocare.

## Mondo

Regioni reali, cammini e rifugi inventati, ispirati ai grandi classici. Così restano i dati climatici veri e il fascino dei luoghi, senza vincoli su nomi e marchi.

| Cammino | Regione | Ispirato a | Carattere |
| --- | --- | --- | --- |
| La Via delle Renne | Lapponia svedese | Kungsleden | Rifugi, altopiani, passo ventoso, laghi a remi. Gratuito |
| Alta Via dei Monti Pallidi | Dolomiti | Alta Via 1 | Rifugi affollati, temporali, tratti attrezzati |
| Il Sentiero delle Ceneri | Islanda | Laugavegur | Guadi gelati, sorgenti calde, sabbia nera |
| Il Giro dei Tre Confini | Alpi occidentali | Tour du Mont Blanc | Tre paesi, ghiacciai, meteo instabile |
| La Spina di Granito | Corsica | GR20 | Il più duro: acqua scarsa, creste |
| Il Cammino della Stella | Nord della Spagna | Camino Francés | Ostelli, credenziale, compagni di viaggio |
| La Via dei Re Antichi | Costa turca | Lycian Way | Rovine, caldo, tuffi in mare |
| La Via dei Tre Santuari | Penisola di Kii, Giappone | Kumano Kodo | Foreste, templi, locande termali |
| La Traversata dei Venti | Patagonia | W Trek | Vento, ghiacciai, torri di granito |
| Il Sentiero dei Lupi | Appennino centrale | Cammino dei Briganti | Borghi abbandonati, faggete, orsi e lupi |
| La Traversata del Circolo Polare | Groenlandia occidentale | Arctic Circle Trail | Capanne senza custode, nessuno spaccio, canoa |
| Il Sentiero delle Creste di Nebbia | Isola di Skye | Skye Trail | Non segnato: l'orientamento è decisivo |

La difficoltà cresce dai cammini con rifugi e spacci a quelli in totale autonomia, bloccati fino a un certo livello. Altri candidati per pacchetti futuri: i sentieri autunnali come Fishermen's Trail, GR221, Camí de Ronda, Salento Trail, Milford Track.

## La Via delle Renne

Il cammino gratuito e il tutorial del gioco: sette tappe, circa 105 km, ogni tappa insegna una meccanica nuova. Ispirata alla sezione nord del Kungsleden.

| Tappa | Km | Insegna | Eventi e momenti chiave |
| --- | --- | --- | --- |
| 1. Lavvuby → Rifugio Vuolle | 14 | Energia e peso dello zaino | Treno in ritardo, prima zanzara, sole di mezzanotte. Obiettivo: Prima notte senza buio |
| 2. Vuolle → Rifugio Gaskas | 20 | Cibo, rifornimento, soldi | Ponte sospeso, renne sul sentiero, l'allevatore. Variante selvaggia dal livello 3 |
| 3. Gaskas → Rifugio Biegga | 13 | Orientamento e tiri di dado | Traccia sparita nella neve, lemming, piedi fradici |
| 4. Biegga → Passo del Corvo → Rifugio Sállo | 12 | Meteo e stati persistenti | Bufera sul passo, rifugio d'emergenza. Obiettivo: Il Passo col sereno |
| 5. Sállo → Rifugio Guovda | 12 | Recupero e morale | Sauna, stufato offerto, primo bivio importante. Obiettivo: Sauna e torrente |
| 6. Guovda → Stazione del Gáisi | 14 | Spendere per stare bene | Ristorante e docce. Deviazione: vetta del Gáisi, bloccata a livello |
| 7. Stazione del Gáisi → Villaggio di Njalla | 19 | Scelta finale tempo o soldi | Barca sul lago o a piedi, hamburger di renna, diario completato |

Fondo valle con betulle all'inizio e alla fine, altopiano senza alberi nel mezzo. Il passo, a circa 1.150 metri, è il punto più alto.

## Modello commerciale

Download gratuito con La Via delle Renne inclusa; ogni altro cammino si compra singolarmente, una volta sola. Niente pubblicità invasiva, niente valute di gioco a pagamento.

| Tipo di cammino | Esempi | Prezzo indicativo |
| --- | --- | --- |
| Corto | Cammini di 2-3 tappe | circa 1 € |
| Medio | Il Sentiero delle Ceneri, Il Sentiero delle Creste di Nebbia | circa 2 € |
| Grande classico | La Via dei Re Antichi, La Via dei Tre Santuari, Il Giro dei Tre Confini | circa 3 € |

Sconti temporanei a tema, tipo speciale autunno, senza pacchetti fissi.

**Contesto di mercato**: sul mobile il gioco a pagamento anticipato è una nicchia minima; il modello gratis con sblocco è la strada praticabile. Aspettativa realistica: qualche migliaio di euro, decine di migliaia con la vetrina degli store o un buon passaparola.

**Leve di visibilità**: vetrina editoriale degli store, video brevi sui social, comunità di escursionisti.

## Note legali e culturali

- **Nomi inventati**: cammini, rifugi e marchi di fantasia vanno verificati nelle banche dati dei marchi prima del lancio, per evitare coincidenze con nomi registrati.
- **Nomi reali**: le regioni reali si usano liberamente. Nessun logo o marchio di associazioni o aziende reali; nella descrizione dello store si può dire che il gioco è ispirato ai grandi cammini.
- **Meccanica**: nessuna copia di nome, grafica o stile di Reigns.
- **Grafica con IA**: se usata, va dichiarata dove richiesto.
- **Popoli e culture**: i Sami nella Via delle Renne, e le comunità locali negli altri cammini, vanno rappresentati con rispetto, senza folclore da cartolina. Utile una rilettura da parte di qualcuno della comunità.

Queste note non sostituiscono il parere di un legale.

## Da decidere

- **Stile grafico scelto: il taccuino con carattere** (strada A). Inchiostro dal tratto irregolare, acquerello che sbava, carta a righe consumata. Il protagonista è **l'escursionista**: cappuccio a punta buio dentro, due occhi chiari, naso lungo, zaino più grande di lui. Personaggi ricorrenti disegnati come carte, anche nel ciclo di casa: il capo, Marta, Paolo, il negoziante, Giulia l'istruttrice, il gatto; sul cammino il custode, Jonas, la renna.
- **Da fare più avanti: scelta del personaggio** all'inizio della partita, tra 4 o 5 escursionisti diversi solo nell'aspetto.

* [ ] Nome del gioco: Blisterlands: A Wanderer's Tale, provvisorio; sottotitolo store "Long-distance hiking RPG"; da verificare su store e marchi
* [ ] Stile grafico dell'omino, degli eventi e della linea del sentiero
* [ ] Numeri di bilanciamento: energia per chilometro, valore dei livelli, stipendio, prezzi dell'attrezzatura
* [ ] Tetto massimo dei giorni di ferie e velocità di calo della forma fisica
* [ ] Durata della modalità carriera a tempo
* [ ] Lingue: inglese al lancio; poi eventualmente italiano, francese, spagnolo, tedesco
* [ ] Ordine di uscita dei cammini a pagamento
* [ ] Elenco completo degli eventi della Via delle Renne
