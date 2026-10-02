/* =========== DATI BASE =========== */
const ITEMS=[
 {id:'zainoClassico',name:'Zaino classico con telaio',kg:1.8,note:'Pesante, ma scarica il peso sui fianchi: i chili si sentono meno',a:{portanza:3},group:'zaino'},
 {id:'zainoUL',name:'Zaino ultralight',kg:0.8,note:'Leggerissimo, ma senza telaio: oltre i 9 kg ti sega le spalle',a:{portanza:1},group:'zaino'},
 {id:'saccoPiuma',name:'Sacco a pelo in piuma',kg:0.9,note:'Caldissimo e leggero, ma se si bagna non scalda più',a:{sonno:3,umido:0},group:'sacco'},
 {id:'saccoSint',name:'Sacco a pelo sintetico',kg:1.5,note:'Pesante, ma scalda anche umido',a:{sonno:2,umido:3},group:'sacco'},
 {id:'quiltPiuma',name:'Quilt in piuma',kg:0.6,note:'Il più leggero, meno caldo, teme l\'umidità',a:{sonno:2,umido:0},group:'sacco'},
 {id:'quiltSint',name:'Quilt sintetico',kg:1.0,note:'Leggero e tollerante all\'umido, ma il meno caldo',a:{sonno:1,umido:3},group:'sacco'},
 {id:'matGonfiabile',name:'Materassino gonfiabile',kg:0.5,note:'Comodissimo e isolante, ma può bucarsi',a:{comfort:3},group:'materassino',fragile:true},
 {id:'matSchiuma',name:'Materassino in schiuma',kg:0.4,note:'Duro e ingombrante, ma indistruttibile',a:{comfort:1},group:'materassino'},
 {id:'trail',name:'Scarpe da trail',kg:0.7,note:'Passo più veloce, asciugano in fretta, poca protezione per le caviglie',a:{asciugatura:3,caviglia:1,aderenza:2,suola:1},group:'scarpe'},
 {id:'scarponi',name:'Scarponi alti',kg:1.5,note:'Caviglie protette, si bagnano meno ma restano fradici a lungo, più vesciche',a:{asciugatura:1,caviglia:3,aderenza:3,suola:3,fango:1,piediAsciutti:2},group:'scarpe'},
 {id:'basse',name:'Scarpe da trekking basse',kg:1.0,note:'Il compromesso: abbastanza protezione, abbastanza leggerezza',a:{asciugatura:2,caviglia:2,aderenza:2,suola:2,piediAsciutti:1},group:'scarpe'},
 {id:'guscio',name:'Guscio impermeabile',kg:0.4,note:'Sotto la pioggia perdi poco morale',a:{impermeabile:2,antivento:2}},
 {id:'pile',name:'Pile',kg:0.45,note:'Contro vento e freddo',a:{calore:2,antivento:1}},
 {id:'ghette',name:'Ghette',kg:0.2,note:'Riducono molto il rischio di piedi bagnati',a:{fango:3}},
 {id:'bastoncini',name:'Bastoncini',kg:0.5,note:'Meno fatica, guadi e nevai più sicuri',a:{appoggio:2}},
 {id:'sandali',name:'Sandali da guado',kg:0.4,note:'Guadi senza bagnare le scarpe, ma ci vuole tempo',a:{guado:2}},
 {id:'rete',name:'Rete antizanzare',kg:0.05,note:'Zanzare innocue',a:{antinsetti:3}},
 {id:'cappello',name:'Cappello a tesa larga',kg:0.1,note:'Contro sole e caldo',a:{ombra:2}},
 {id:'filtro',name:"Filtro per l'acqua",kg:0.1,note:'Acqua sicura dai torrenti',a:{acquaSicura:2}},
 {id:'mappa',name:'Mappa e bussola',kg:0.15,note:'Ritrovi la traccia senza batteria',a:{orientamento:2}},
 {id:'orologio',name:'Orologio GPS',kg:0.07,note:'Orientamento senza tirare fuori il telefono. Ha la sua batteria',a:{orientamento:2},dev:true},
 {id:'faro',name:'Faro satellitare',kg:0.15,note:'Previsioni affidabili, messaggi a casa, SOS. Abbonamento 15 € al mese, batteria propria',a:{},dev:true},
 {id:'kit',name:'Kit di riparazione',kg:0.15,note:'Nastro, cordino, ago e filo',a:{riparazione:2}},
 {id:'fornello',name:'Fornelletto',kg:0.35,note:'Pasti caldi. Il gas si consuma',a:{cucina:2}},
 {id:'tenda',name:'Tenda',kg:1.8,note:'Dormi gratis anche se il rifugio è pieno',a:{riparo:2}},
 {id:'carte',name:'Mazzo di carte',kg:0.1,note:'Serate sociali nei rifugi',a:{svago:1}}
];
const CONSUM=[
 {id:'pasti',name:'Pasti',kg:0.6,max:6,note:'Pranzo o cena. Negli spacci di Gaskas e Sállo costano 12 €'},
 {id:'barrette',name:'Barrette',kg:0.06,max:10,note:'Energia veloce'},
 {id:'gas',name:'Cariche di gas',kg:0.07,max:8,note:'Un pasto caldo ciascuna'},
 {id:'cerotti',name:'Cerotti',kg:0.01,max:8,note:'Vesciche e piccole ferite'},
 {id:'repellente',name:'Repellente',kg:0.03,max:5,note:'Zanzare tranquille per una tappa'},
 {id:'calze',name:'Calze di ricambio',kg:0.08,max:4,note:'Un paio asciutto'},
 {id:'powerbank',name:'Cariche di powerbank',kg:0.1,max:6,note:'Ogni carica ridà 60% a un dispositivo'}
];
const BASE_KG=1.6,HUT=30,FLOOR=15;
const TAPPE=[
 {n:1,from:'Lavvuby',to:'Rifugio Vuolle',km:14,shop:false,sauna:true,terr:['gola','gola','betulle','betulle','lago','lago']},
 {n:2,from:'Rifugio Vuolle',to:'Rifugio Gaskas',km:20,shop:true,sauna:true,terr:['lago','torbiera','valle','valle','altopiano','valle']},
 {n:3,from:'Rifugio Gaskas',to:'Rifugio Biegga',km:13,shop:false,sauna:false,terr:['valle','altopiano','altopiano','lago','torbiera','altopiano']},
 {n:4,from:'Rifugio Biegga',to:'Rifugio Sállo',km:12,shop:true,sauna:false,terr:['altopiano','altopiano','passo','passo','altopiano','valle']},
 {n:5,from:'Rifugio Sállo',to:'Rifugio Guovda',km:12,shop:false,sauna:true,terr:['valle','valle','torbiera','valle','lago','valle']},
 {n:6,from:'Rifugio Guovda',to:'Stazione del Gáisi',km:14,shop:true,sauna:true,hut:45,floor:25,terr:['valle','betulle','valle','gola','valle','valle']},
 {n:7,extra:true,name:'Vetta del Gáisi',from:'Stazione del Gáisi',to:'Stazione del Gáisi',km:10,shop:true,sauna:true,hut:45,floor:25,terr:['altopiano','passo','passo','passo','passo','altopiano']},
 {n:8,label:7,from:'Stazione del Gáisi',to:'Villaggio di Njalla',km:19,shop:false,sauna:false,finale:true,terr:['valle','betulle','lago','lago','betulle','valle']}
];
const TERR={gola:'la gola del fiume',betulle:'il bosco di betulle',lago:'la riva del lago',torbiera:'la torbiera',valle:'la valle larga',altopiano:"l'altopiano",passo:'il passo'};
const WX={sole:'Sereno',nuvole:'Nuvoloso',pioggia:'Pioggia',vento:'Vento forte',nebbia:'Nebbia'};
const MESI={
 giugno:{label:'Giugno',prezzi:0.8,posti:120,wx:{sole:2.5,nuvole:3,pioggia:2.5,vento:2,nebbia:1.5},insetti:0.8,note:'Bassa stagione: rifugi semivuoti e più economici. Ma neve tardiva e torrenti in piena per il disgelo.'},
 luglio:{label:'Luglio',prezzi:1,posti:0,wx:{sole:2.5,nuvole:3,pioggia:3.5,vento:1.8,nebbia:1.4},insetti:1.3,note:'Il cuore dell\'estate: luce infinita e zanzare al massimo.'},
 agosto:{label:'Agosto',prezzi:1.2,posti:-60,wx:{sole:2.5,nuvole:3,pioggia:4,vento:1.5,nebbia:1.5},insetti:0.7,note:'Alta stagione: rifugi pieni presto e più cari. Bacche, funghi, meno insetti, più pioggia.'},
 settembre:{label:'Settembre',prezzi:1,posti:60,wx:{sole:2,nuvole:3,pioggia:3.5,vento:2.5,nebbia:2},insetti:0.15,note:'Fine stagione: molti rifugi senza spaccio hanno già chiuso. Colori, gelo, buio presto. Forse l\'aurora.'}};
const wxW=()=>MESI[S.mese].wx;
const WX_W={sole:2.5,nuvole:3,pioggia:3.5,vento:1.8,nebbia:1.4};
const STATO={bagnati:'Piedi bagnati',vesciche:'Vesciche',freddo:'Freddo',malessere:'Mal di pancia',storta:'Caviglia dolorante',ginocchio:'Ginocchio dolorante',scottato:'Scottatura'};
const QUIET=['Un tratto tranquillo. Solo il rumore dei passi e del vento.','Passerelle di legno, una dopo l\'altra.','Il sentiero sale piano tra le betulle nane.','Nessuno in vista per chilometri.','Un ometto di pietra dopo l\'altro, fino all\'orizzonte.'];

