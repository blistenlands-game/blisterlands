/* =========== IDENTITA VISIVA RASTER =========== */
const VERSION=GAME_CONFIG.version;
const ART_ROOT='assets/art/';
const SPRITE_ROOT='assets/sprites/';
const BACKGROUND_ROOT='assets/backgrounds/';
function updatePaperWear(){
 const atHome=typeof H!=='undefined'&&H&&H.screen;
 const active=!atHome&&typeof S!=='undefined'&&S&&Number.isInteger(S.tappa);
 const stage=active?Math.max(1,Math.min(8,S.tappa+1)):1;
 const t=active&&typeof TAPPE!=='undefined'?TAPPE[S.tappa]:null;
 const total=t&&t.terr?t.terr.length:6;
 let wear=active?Math.max(1,Math.min(4,Math.floor(Math.max(0,S.seg||0)*4/Math.max(1,total))+1)):1;
 if(active&&(S.screen==='sera'||S.screen==='mattino'||S.screen==='fine'))wear=4;
 document.documentElement.style.setProperty('--paper-image',`url('assets/paper/paper-stage-${stage}-${wear}.jpg')`);
 document.body.dataset.paperStage=String(stage);
 document.body.dataset.paperLevel=String(wear);
 document.body.dataset.paperWear=!active||stage===1&&wear===1?'clean':stage<4?'light':stage<7?'travelled':'worn';
}
const PG={
 marco:{sex:'m',label:'Aspetto 1',row:0},
 davide:{sex:'m',label:'Aspetto 2',row:1},
 sara:{sex:'f',label:'Aspetto 3',row:2},
 elena:{sex:'f',label:'Aspetto 4',row:3}
};
function pg(){return PG[(typeof H!=='undefined'&&H&&H.pg)||'marco']||PG.marco}
function pgName(){const n=typeof H!=='undefined'&&H&&typeof H.nome==='string'?H.nome.trim():'';return n||'Escursionista'}
function sprite(file,cols,rows,index,cls,label,w,h){
 const col=index%cols,row=Math.floor(index/cols),x=cols===1?0:col*100/(cols-1),y=rows===1?0:row*100/(rows-1);
 return `<span class="sprite ${cls||''}" role="img" aria-label="${esc(label||'')}" style="width:${w||'100%'};height:${h||'100%'};background-image:url('${ART_ROOT+file}');background-size:${cols*100}% ${rows*100}%;background-position:${x}% ${y}%"></span>`
}
function equippedItem(base){if(typeof S==='undefined'||!S||!S.kit)return null;for(const id of S.kit){const it=typeof ITEM_BY!=='undefined'&&ITEM_BY[id];if(id===base||(it&&it.base===base))return it||{id,base:id}}return null}
function gearColor(item,fallback){return item&&item.brand&&BRANDS[item.brand]?BRANDS[item.brand].color:fallback}
function rigLayer(file,layer,tint){const url=`${SPRITE_ROOT}rig/${file}.png`,style=`background-image:url('${url}')${tint?`;--rig-tint:${tint};--rig-mask:url('${url}')`:''}`;return `<span class="rig-strip rig-${layer}${tint?' is-tinted':''}" style="${style}"></span>`}
function rigSprite(pose,label){const who=(typeof H!=='undefined'&&H&&PG[H.pg])?H.pg:'marco',pack=equippedItem('zainoUL')||equippedItem('zainoClassico'),shoe=equippedItem('trail')||equippedItem('basse')||equippedItem('scarponi'),shell=equippedItem('guscio'),wool=equippedItem('cappelloLana'),sun=equippedItem('cappello'),net=equippedItem('rete'),gloves=equippedItem('guanti'),poles=equippedItem('bastoncini');
 const packType=pack&&((pack.base||pack.id)==='zainoUL')?'ul':'classic',shoeBase=shoe&&(shoe.base||shoe.id),shoeType=shoeBase==='scarponi'?'boot':shoeBase==='basse'?'low':'trail',hat=wool?'wool':sun?'sun':'none';
 const layers=[rigLayer(`base/${who}`,'base'),rigLayer(`gear/shoe-${shoeType}`,'shoes',gearColor(shoe,'#70523d'))];
 if(shell)layers.push(rigLayer('gear/shell','shell',gearColor(shell,'#667352')));
 if(gloves)layers.push(rigLayer('gear/gloves','gloves'));
 if(!net&&hat!=='none')layers.push(rigLayer(`gear/hat-${hat}`,'hat'));
 if(net)layers.push(rigLayer('gear/net','net'));
 if(pack)layers.push(rigLayer(`gear/pack-${packType}`,'pack',gearColor(pack,'#7b4b36')));
 if(poles)layers.push(rigLayer('gear/poles','poles'));
 return `<span class="pose-sprite pose-figure pose-${pose} rig-character" role="img" aria-label="${esc(label||'')}" data-pack="${packType}" data-pack-brand="${pack&&pack.brand||'base'}" data-shoes="${shoeType}" data-shoe-brand="${shoe&&shoe.brand||'base'}" data-hat="${hat}" data-net="${net?'yes':'no'}" data-shell="${shell?'yes':'no'}" data-gloves="${gloves?'yes':'no'}" data-poles="${poles?'yes':'no'}">${layers.join('')}</span>`}
function poseSprite(pose,label){if(pose==='walk'||pose==='stand')return rigSprite(pose,label);const who=(typeof H!=='undefined'&&H&&PG[H.pg])?H.pg:'marco';return `<span class="pose-sprite pose-figure pose-${pose}" role="img" aria-label="${esc(label||'')}"><img class="pose-art" src="${SPRITE_ROOT}pose/${who}-${pose}.png" alt=""></span>`}

const PORTRAIT={
 pg_marco:{name:'Aspetto 1',sheet:'protagonists.png',cols:2,rows:2,index:0},
 pg_davide:{name:'Aspetto 2',sheet:'protagonists.png',cols:2,rows:2,index:1},
 pg_sara:{name:'Aspetto 3',sheet:'protagonists.png',cols:2,rows:2,index:2},
 pg_elena:{name:'Aspetto 4',sheet:'protagonists.png',cols:2,rows:2,index:3},
 capo:{name:'Il capo',sheet:'story-cast.png',cols:4,rows:3,index:0},
 marta:{name:'Marta',sheet:'story-cast.png',cols:4,rows:3,index:1},
 paolo:{name:'Paolo',sheet:'story-cast.png',cols:4,rows:3,index:2},
 negoziante:{name:'Il negoziante',sheet:'story-cast.png',cols:4,rows:3,index:3},
 giulia:{name:'Giulia',sheet:'story-cast.png',cols:4,rows:3,index:4},
 gatto:{name:'Il gatto',sheet:'story-cast.png',cols:4,rows:3,index:5},
 custode:{name:'Il custode',sheet:'story-cast.png',cols:4,rows:3,index:6},
 jonas:{name:'Jonas',sheet:'story-cast.png',cols:4,rows:3,index:7},
 renna:{name:'La renna',sheet:'story-cast.png',cols:4,rows:3,index:8},
 barcaiolo:{name:'Il barcaiolo',sheet:'story-cast.png',cols:4,rows:3,index:9},
 guardiaparco:{name:'La guardiaparco',sheet:'story-cast.png',cols:4,rows:3,index:10},
 erik:{name:'Erik',sheet:'story-cast.png',cols:4,rows:3,index:11}
};
const ICON_NAMES={rifugio:'Il rifugio',impronte:'Tracce',sole:'Il caldo',cerotto:'Un acciacco',zanzara:'Insetti',scarpone:'Le scarpe',pioggia:'Pioggia',vento:'Vento',bussola:'Orientamento',acqua:'Acqua',cibo:'Cibo',tenda:'La notte',zaino:'Lo zaino',bivio:'Il sentiero',soldi:'Soldi',meraviglia:'Una meraviglia',taccuino:'Pensieri',persona:'Un incontro',lemming:'Un lemming',corvo:'Un corvo'};
const ICON_ORDER=Object.keys(ICON_NAMES);
ICON_ORDER.forEach((k,i)=>PORTRAIT['i_'+k]={name:ICON_NAMES[k],sheet:'event-icons.png',cols:5,rows:4,index:i});
PORTRAIT.inga=PORTRAIT.custode;PORTRAIT.fotografo=PORTRAIT.erik;PORTRAIT.alce=PORTRAIT.renna;PORTRAIT.lemming=PORTRAIT.i_lemming;PORTRAIT.corvo=PORTRAIT.i_corvo;
function portraitFile(k){const alias={inga:'custode',fotografo:'erik',alce:'renna',lemming:'lemming',corvo:'corvo'};if(k.startsWith('pg_'))return `portrait/${k.slice(3)}.png`;if(k.startsWith('i_'))return `event/${k.slice(2)}.png`;return PORTRAIT['i_'+k]?`event/${k}.png`:`cast/${alias[k]||k}.png`}
function portraitSvg(k,w,h){const p=PORTRAIT[k];if(!p)return '';return `<img class="sprite portrait-sprite" src="${SPRITE_ROOT+portraitFile(k)}" alt="${esc(p.name)}" style="width:${w||120}px;height:${h||130}px">`}
function pdefs(){return ''}
function tapedCard(k,w,h,cls){const p=PORTRAIT[k];if(!p)return '';return `<figure class="${cls}">${portraitSvg(k,w,h)}<figcaption>${esc(p.name)}</figcaption></figure>`}

const PKEYS=[[/barcaiolo|barca a motore/i,'barcaiolo'],[/guardiaparc|ranger/i,'guardiaparco'],[/ultralight|ultraleggero|zaino da 3/i,'erik'],[/anzian|settant|signora/i,'inga'],[/fotograf/i,'fotografo'],[/lemming/i,'lemming'],[/corv/i,'corvo'],[/\balc[ei]\b/i,'alce'],[/jonas|tedesc/i,'jonas'],[/custode|gestore/i,'custode'],[/\brenn[ae]\b/i,'renna']];
function eventPortrait(ev){if(ev.portrait!==undefined)return ev.portrait;const t=ev.title||'';let txt='';try{txt=typeof ev.text==='function'?'':ev.text||''}catch(e){}for(const [re,k] of PKEYS)if(re.test(t)||re.test(txt))return k;return null}
const CARD_PORTRAIT={appennino:'paolo',compleanno:'paolo',saldi:'negoziante',mercatino:'negoziante',ordine:'negoziante',racconti:'marta',stagione:'marta',corso:'giulia',ferieScadenza:'capo',promozione:'capo',burnout:'gatto',pioggia:'gatto',bolletta:'gatto',malanno:'gatto',documentario:'gatto'};
{const OV={traversataLago:'barcaiolo',barcaLago:'barcaiolo',stufato:'jonas',muschioRenna:'renna',volontari:'guardiaparco',allemansratten:'guardiaparco',confineparco:'guardiaparco'};EV.forEach(e=>{if(OV[e.id])e.portrait=OV[e.id]})}
const ICON_KEYS=[[/rifugio|baita|capanna|stazione/i,'rifugio'],[/ghiotton|cane|zecca|uccell|volpe|aquila|pesc|lepre|lontra|gabbian|pernic|piviere|gufo|civett|impront|tracce di/i,'impronte'],[/afa|caldo|scottat|troppo sole|sole a picco|sudore/i,'sole'],[/zanzar|insett|moscer|vesp|tafan|calabron/i,'zanzara'],[/vescic|tallone|cerott|ginocch|cavigli|storta|ferit|crampo|febbre|malessere|stanchez/i,'cerotto'],[/scarp|scarpon|calz|lacc|suola|sandal/i,'scarpone'],[/pioggia|temporal|grandin|acquazzon|piove|nuvol|fulmin/i,'pioggia'],[/vento|raffic|bufera/i,'vento'],[/nebbia|perdi la traccia|disorient/i,'bussola'],[/guado|torrent|ruscell|fium|lago|acqua|ponte|palude|pozza/i,'acqua'],[/pranzo|cena|cibo|pasto|barrett|mirtill|bacche|fame|caff|stufato|biscott|funghi|panin|cioccolat/i,'cibo'],[/tenda|notte|bivacc|dormi|buio|stelle/i,'tenda'],[/zaino|cinghi|fibbia|materassin|fornell|borracc|bastonc|attrezzatur|batteria|telefono|faro|powerbank/i,'zaino'],[/bivio|mappa|ometto|sentiero|segnavia|tracce|scorciatoi|cartello|deviazion|variante/i,'bivio'],[/soldi|portafoglio|euro|prezzo|pagare|spacci/i,'soldi'],[/aurora|vista|panoram|tramonto|mezzanotte|colori|cima|vetta|arcobaleno|silenzio|luce/i,'meraviglia'],[/casa|pensier|ricord|messaggio|felice|nostalg|solitudin|canzon|musica/i,'taccuino'],[/escursionist|gruppo|ragazz|coppia|famiglia|bambin|uomo|donna|viaggiator/i,'persona']];
function eventCard(ev){const p=eventPortrait(ev);if(p)return p;if(ev._icon&&PORTRAIT[ev._icon])return ev._icon;let txt='';try{txt=tx(ev.text)}catch(e){}for(const [re,k] of ICON_KEYS)if(re.test(ev.title||''))return 'i_'+k;for(const [re,k] of ICON_KEYS)if(re.test(txt))return 'i_'+k;return 'i_taccuino'}

const GEAR_BASE=['zainoClassico','zainoUL','saccoPiuma','saccoSint','quiltPiuma','quiltSint','matGonfiabile','matSchiuma','trail','scarponi','basse','guscio','pile','pantaloni','ghette','bastoncini','sandali','rete','cappello','cappelloLana','guanti','filtro','mappa','orologio','faro','kit','fornello','tenda','carte'];
function gearSvg(id,size){const it=ITEM_BY[id],base=it?(it.base||it.id):id,index=GEAR_BASE.indexOf(base);if(index<0)return '';const file=it&&it.brand?`${base}-${it.brand}`:base;return `<img class="sprite gear-sprite" src="${SPRITE_ROOT}gear/${file}.png" alt="${esc(it?(it.model||it.name):base)}" style="width:${size||56}px;height:${size||56}px">`}
function brandLogo(k,size=34){const b=BRANDS[k];return b?`<img class="brand-logo" src="${SPRITE_ROOT}brand/${k}.png" alt="Logo ${esc(b.name)}" width="${size}" height="${size}">`:''}

function weatherLayer(weather){const w=weather||'sole';if(w==='sole')return '<span class="weather-layer"><i class="weather-sun"></i></span>';if(w==='nuvole')return '<span class="weather-layer"><i class="cloud c1"></i><i class="cloud c2"></i></span>';if(w==='pioggia')return '<span class="weather-layer"><i class="cloud c1"></i><i class="cloud c2"></i>'+Array.from({length:15},(_,i)=>`<i class="rain-drop" style="--i:${i}"></i>`).join('')+'</span>';if(w==='vento')return '<span class="weather-layer">'+Array.from({length:7},(_,i)=>`<i class="wind-mark" style="--i:${i}"></i>`).join('')+'<i class="wind-leaf l1"></i><i class="wind-leaf l2"></i></span>';if(w==='nebbia')return '<span class="weather-layer"><i class="fog f1"></i><i class="fog f2"></i><i class="fog f3"></i></span>';return '<span class="weather-layer"></span>'}
function atlasScene(file,cols,rows,index,label,pose,weather){return `<div class="scene raster-scene wx-${weather||'sole'}" role="img" aria-label="${esc(label||'')}">${sprite(file,cols,rows,index,'scene-bg','',null,null)}${pose?poseSprite(pose,label):''}${weatherLayer(weather)}</div>`}
const EVENT_SCENE={};
for(const [scene,ids] of Object.entries({
 waterfall:['cascata','cascatella','dietrocascata','bagnopozza'],
 'suspension-bridge':['ponte','ponteTibetano','passerella'],
 ford:['guado','ruscello','pietrespostate','guadogelido','guadocorda','guadoTreBracci','pienaDisgelo','torrenteLatte','torrenteRombante','torrenteGuovda'],
 spring:['sorgente','sorgenteFerrosa','sorgentesecca','ultimaacqua'],
 'fisherman-lake':['pescatore','pescatoreSami','pesciSalto','lontra','aquilaMare'],
 'stream-camp':['tendate','tendacrollata','bivaccoAbbandonato'],
 'lake-boat':['barca','barcaLago','traversataLago','saunaLago','isolaLago','alceBagno','ghiacciolago'],
 'double-rainbow':['arcobaleno','riverbero','specchioLago','panorama','brezza'],
 'broken-bridge':['chiuso','pontePortato','pontesosta','tronco','offertaPonte'],
 'deep-mud':['fango','fangoprofondo','sentieroruscello','impronte'],
 'bog-boardwalk':['passerelle','assebagnate','treccia'],
 'boulder-field':['pietraia','sassoappuntito','lastricato','greto'],
 landslide:['frana','franaattiva','franalontana'],
 'flower-meadow':['prato','eriofori','fioriArtici','valleFiori','pausainterrotta'],
 'blueberry-slope':['mirtilli','camemoro','raccoglitori','ruska'],
 snowfield:['nevaio','nevaioGrande','nevaioZanzare','ultimoNevaio','ghiacciaio','pontedineve'],
 'moose-birches':['alce','scricciolo','civetta','ultimaRenna'],
 'forest-smoke':['fuoco'],
 'reindeer-corral':['allevatore','recinto','marchiatura','renne','renneCorsa','caneRenne','vitellino','nebbiaRenne'],
 'sacred-boulder':['sieidi','licheni','corna','muschioRenna'],
 'turf-hut':['kata','duodji','rovina','bivacco','cartecapanna','scambiolibri','pioggiaPerfetta','capannaRossa','legna','scatolasoccorso','biscotti','fantasmi','solitariocarte','caffeprivato'],
 'ridge-routes':['duesentieri','cresta','vettaCresta','scorciatoia'],
 'summit-panorama':['cima','vettaCima','vistaGaisi','discesaPasso','cartelloGaisi','partenzaGuovda'],
 'narrow-canyon':['eco','golaGaisi','rondoni'],
 'evening-refuge':['rifugioinvista','menu','fumolegna','rifugioPieno','staffetta','bieggaVista','salitaFinale','rifugioPienoRenne'],
 'aurora-camp':['aurora'],
 'trail-station':['treno','bilancia','stazioneArrivo','vettaRitorno','colazioneStazione','genteDelGiorno','escursionistiGiornalieri']
}))for(const id of ids)EVENT_SCENE[id]=scene;
function eventLandscape(ev){return ev&&EVENT_SCENE[ev.id]}
const POI=[
 [
  ['La Cascata di Lavvu','scene/waterfall.png'],['La Sorgente Fredda','scene/spring.png'],['Le Betulle dell’Alce','scene/moose-birches.png'],
  ['La Costa dei Mirtilli','scene/blueberry-slope.png'],['La Baia del Pescatore','scene/fisherman-lake.png'],['Il Belvedere di Vuolle','backgrounds/poi-t1-06-vuolle-overlook.jpg']
 ],
 [
  ['Il Ponte di Vuolle','scene/suspension-bridge.png'],['La Torbiera delle Assi','scene/bog-boardwalk.png'],['Il Recinto delle Renne','scene/reindeer-corral.png'],
  ['Il Sieidi delle Corna','scene/sacred-boulder.png'],['La Piana degli Eriofori','scene/flower-meadow.png'],['Il Campo dei Massi','scene/boulder-field.png']
 ],
 [
  ['Il Nevaio di Gaskas','scene/snowfield.png'],['La Frana dei Tre Picchi','scene/landslide.png'],['Il Lago del Vento','scene/lake-boat.png'],
  ['Il Pantano Nero','scene/deep-mud.png'],['Gli Ometti della Nebbia','backgrounds/poi-t3-05-mist-cairns.jpg'],['I Tre Tetti di Biegga','backgrounds/poi-t3-06-biegga-three-roofs.jpg']
 ],
 [
  ['La Cresta del Corvo','scene/ridge-routes.png'],['Il Riparo del Passo','scene/turf-hut.png'],['Il Ponte Spazzato','scene/broken-bridge.png'],
  ['I Denti del Corvo','backgrounds/poi-t4-04-raven-teeth.jpg'],['La Valle Verde','backgrounds/poi-t4-05-green-valley.jpg'],['Sállo dall’Alto','backgrounds/poi-t4-06-sallo-from-above.jpg']
 ],
 [
  ['Il Prato del Silenzio','backgrounds/poi-t5-01-silent-meadow.jpg'],['Il Campo del Ruscello','scene/stream-camp.png'],['La Passerella delle Gru','backgrounds/poi-t5-03-cranes-boardwalk.jpg'],
  ['Il Guado di Guovda','scene/ford.png'],['La Pozza Gelida','backgrounds/poi-t5-05-icy-pool.jpg'],['Il Fumo di Guovda','backgrounds/poi-t5-06-guovda-smoke.jpg']
 ],
 [
  ['Le Betulle del Gáisi','backgrounds/poi-t6-01-gaisi-birches.jpg'],['La Gola del Gáisi','scene/narrow-canyon.png'],['La Cengia del Torrente','backgrounds/poi-t6-03-torrent-ledge.jpg'],
  ['Il Colle della Stazione','backgrounds/poi-t6-04-station-hill.jpg'],['La Parete del Gáisi','backgrounds/poi-t6-05-gaisi-wall.jpg'],['L’Ultimo Tornante','backgrounds/poi-t6-06-last-switchback.jpg']
 ],
 [
  ['Il Cartello della Vetta','backgrounds/poi-t7-01-summit-marker.jpg'],['Il Pendio delle Lastre','backgrounds/poi-t7-02-stone-slabs.jpg'],['La Lingua di Neve','backgrounds/poi-t7-03-snow-tongue.jpg'],
  ['La Spalla del Gáisi','backgrounds/poi-t7-04-gaisi-shoulder.jpg'],['L’Ometto Falso','backgrounds/poi-t7-05-false-cairn.jpg'],['La Cima del Gáisi','scene/summit-panorama.png']
 ],
 [
  ['La Prima Strada','backgrounds/poi-t8-01-first-road.jpg'],['Il Bosco del Ritorno','backgrounds/poi-t8-02-return-forest.jpg'],['Il Lago di Njalla','backgrounds/poi-t8-03-njalla-lake.jpg'],
  ['Il Bivio della Barca','backgrounds/poi-t8-04-boat-fork.jpg'],['La Passerella delle Canne','backgrounds/poi-t8-05-reed-boardwalk.jpg'],['I Tetti di Njalla','backgrounds/poi-t8-06-njalla-roofs.jpg']
 ]
];
function poiIndex(stage,seg){const row=POI[stage]||POI[0];return Math.max(0,Math.min((seg||1)-1,row.length-1))}
function poiName(stage,seg){const row=POI[stage]||POI[0];return row[poiIndex(stage,seg)][0]}
const STAGE_ONE_ISOMETRIC=[
 'poi-t1-01-cascata-isometric.png','poi-t1-02-sorgente-isometric.png','poi-t1-03-betulle-isometric.png',
 'poi-t1-04-mirtilli-isometric.png','poi-t1-05-baia-isometric.png','poi-t1-06-belvedere-isometric.png'
];
const STAGE_ONE_COPY=[
 'L’acqua rompe il silenzio della valle. Il sentiero risale accanto alla cascata.',
 'Una vena d’acqua gelida emerge fra le pietre e attraversa il sentiero.',
 'Il sentiero sale tra le betulle basse. Più avanti iniziano le tracce dell’alce.',
 'Il pendio si apre fra rocce, bacche scure e vento che arriva dal lago.',
 'Il sentiero scende verso l’acqua, un pontile e un piccolo capanno rosso.',
 'Dall’ultimo dosso compare Vuolle. Il rifugio è ormai dall’altra parte del lago.'
];
const TRAIL_COPY=[STAGE_ONE_COPY,
 [
  'Il ponte lascia Vuolle alle spalle e porta sulla riva più silenziosa del lago.',
  'Le assi attraversano una torbiera color rame, sospesa tra acqua e cielo.',
  'Campanacci lontani annunciano il recinto delle renne prima ancora di vederlo.',
  'Un masso sacro emerge fra licheni e corna lasciate dal passaggio delle mandrie.',
  'Gli eriofori ondeggiano nella piana e indicano la direzione del vento.',
  'Il sentiero si perde fra grandi massi, poi ridiscende verso Gaskas.'
 ],[
  'La neve resiste nelle pieghe del monte e rende ogni passo più attento.',
  'Una frana recente taglia il pendio e costringe il sentiero a cercare un varco.',
  'Il Lago del Vento compare sotto il passo, scuro e increspato.',
  'Il terreno diventa nero e molle: ogni impronta si riempie subito d’acqua.',
  'Gli ometti affiorano dalla nebbia uno alla volta, abbastanza vicini da non perdersi.',
  'Tre tetti rossi compaiono in fondo alla valle: Biegga è finalmente vicina.'
 ],[
  'La cresta sale netta sopra la valle. I corvi girano senza battere le ali.',
  'Un piccolo riparo di pietra spezza il vento che attraversa il passo.',
  'Il ponte è stato portato via: resta il rumore dell’acqua sotto le travi spezzate.',
  'Le rocce formano denti scuri contro il cielo e obbligano a rallentare.',
  'Oltre la cresta si apre una valle verde, inattesa e quasi immobile.',
  'Sállo appare dall’alto, raccolto vicino all’acqua e protetto dai pendii.'
 ],[
  'Il prato assorbe ogni suono. Restano soltanto vento e passi nell’erba.',
  'Il campo segue un ruscello limpido, abbastanza piano da invitare a una sosta.',
  'Una lunga passerella attraversa i canneti frequentati dalle gru.',
  'Il Guovda divide la valle in tre bracci freddi e veloci.',
  'Una pozza color ghiaccio riflette le nuvole e le rocce chiare.',
  'Una colonna di fumo sale oltre le betulle: il rifugio è vicino.'
 ],[
  'Le betulle del Gáisi diventano più basse mentre il sentiero prende quota.',
  'La gola stringe il torrente tra pareti scure e amplifica ogni rumore.',
  'Una cengia segue l’acqua dall’alto, stretta ma aperta sulla valle.',
  'Dal colle si intravedono i binari e il piccolo edificio della stazione.',
  'La parete del Gáisi domina l’orizzonte e nasconde la cima.',
  'L’ultimo tornante porta alla stazione, alle luci e alla fine della tappa.'
 ],[
  'Il cartello della vetta indica un sentiero più ripido e molto meno frequentato.',
  'Lastre di pietra inclinate salgono verso la spalla del monte.',
  'Una lingua di neve attraversa il percorso anche in piena estate.',
  'Dalla spalla del Gáisi la valle sembra ormai lontanissima.',
  'Un ometto inganna per qualche minuto: la cima vera è ancora più avanti.',
  'La cima del Gáisi apre il panorama in ogni direzione.'
 ],[
  'La prima strada sterrata ricorda che il cammino sta tornando verso i villaggi.',
  'Il bosco del ritorno è più alto e fitto di quelli attraversati all’andata.',
  'Il Lago di Njalla accompagna il sentiero con acqua calma e rive basse.',
  'Al bivio della barca compaiono i primi segni della vita del villaggio.',
  'Una passerella attraversa le canne nell’ultima zona umida del cammino.',
  'I tetti di Njalla emergono oltre il lago: la Via delle Renne finisce qui.'
 ]];
function stageLabel(t){return t.extra?'VETTA':`TAPPA ${t.label||t.n}`}
function stageAsset(stage,index){return stage===0?`assets/godot/${STAGE_ONE_ISOMETRIC[index]}`:`assets/godot/poi-t${stage+1}-${String(index+1).padStart(2,'0')}-isometric-hd-v2.png`}
function stageVisual(stage,index){const image=stageAsset(stage,index);return `<img class="scene-bg" src="${image}" alt="">${stage===0?`<span class="diorama-canvas" data-src="${image}" data-poi="${index}" aria-hidden="true"></span>`:''}`}
function journeyStatState(kind,value,total=100){
 if(kind==='time'){const pct=Math.max(0,Math.min(100,(1200-value)/780*100));return value>=1080?['critical',pct,'buio vicino']:value>=960?['negative',pct,'tardi']:value>=840?['neutral',pct,'regolare']:['positive',pct,'in anticipo']}
 if(kind==='distance'){const ratio=total?value/total:0,pct=(1-ratio)*100;return value<=0?['positive',100,'arrivo']:ratio<=.25?['positive',pct,'vicino']:ratio<=.6?['neutral',pct,'a metà']:['negative',pct,'lontano']}
 return homeStatState(kind,value)
}
function journeyStats(entries,extra=''){const meter=([kind,icon,value,label,raw,total])=>{const [state,pct,note]=journeyStatState(kind,raw,total);return `<div class="home-stat state-${state}" title="${esc(note)}"><span class="sicon ${kind}">${icon}</span><span class="home-stat-copy"><b>${value}</b><small>${label}<em>${esc(note)}</em></small><i class="home-stat-track"><u style="width:${Math.max(4,Math.min(100,pct))}%"></u></i></span></div>`};return `<div class="stage-one-stats dynamic-stats ${extra}">${entries.map(meter).join('')}</div>`}
function stageToolIcon(kind){const file=kind==='book'?'taccuino':'zaino';return `<img src="${SPRITE_ROOT}event/${file}.png" alt="">`}
function stageOneDistance(t){return Math.max(0,Math.round(t.km*(1-Math.min(S.seg,t.terr.length)/t.terr.length)))}
function stageOneHero(t){const stage=S.tappa,index=poiIndex(stage,S.seg),name=poiName(stage,S.seg),done=Math.min(t.terr.length,Math.max(1,S.seg||1)),route=routeOverlay(stage,t.terr.length,Math.min(S.seg,t.terr.length));
 const dots=Array.from({length:t.terr.length},(_,i)=>`<i class="${i<done?'done':''}"></i>`).join('');
 return `<section class="stage-one-hero stage-${stage+1}"><div class="stage-one-heading"><span class="stage-one-mark">ᐱ</span><b>${stageLabel(t)}</b><span class="stage-one-rule"></span><h2>${esc(name)}</h2><div class="stage-one-progress"><strong>${done} / ${t.terr.length}</strong><span>${dots}</span></div></div>
 <div class="stage-one-diorama wx-${S.wx}" role="img" aria-label="${esc(name)}">${stageVisual(stage,index)}${weatherLayer(S.wx)}</div>
 <details class="stage-one-map"><summary>Mappa</summary><div class="stage-one-map-sheet"><img src="assets/maps/stage-map-${stage+1}.png" alt="Mappa della tappa ${t.label||t.n}">${route}</div></details>
 ${journeyStats([['time','☀',hhmm(S.clock),'ORA',S.clock],['energy','ϟ',Math.round(S.energia),'ENERGIA',S.energia],['morale','♥',Math.round(S.morale),'MORALE',S.morale],['distance','●',stageOneDistance(t)+' km','DISTANZA',stageOneDistance(t),t.km]])}</section>`}
function stageOneTools(){const entries=S.log.slice(0,8).map(line=>`<li>${esc(line)}</li>`).join('')||'<li>La prima pagina è ancora vuota.</li>';
 const supplies=[['Pasti',inv('pasti')],['Barrette',inv('barrette')],['Cerotti',inv('cerotti')],['Calze',inv('calze')],['Batteria',inv('batteria')+'%']].map(([k,v])=>`<span>${k} <b>${v}</b></span>`).join('');
 return `<div class="stage-one-tools"><details><summary>${stageToolIcon('book')}<span>TACCUINO</span></summary><div class="stage-tool-pop"><ul>${entries}</ul></div></details><details><summary>${stageToolIcon('pack')}<span>ZAINO</span></summary><div class="stage-tool-pop stage-pack-pop">${supplies}</div></details></div>`}
function stageOneTravelPanel(t){const stage=S.tappa,index=poiIndex(stage,S.seg),nextIndex=Math.min(t.terr.length-1,index+1),finished=S.seg>=t.terr.length,next=finished?t.to:POI[stage][nextIndex][0],notes=S.notes.map(n=>`<p class="stage-note">${esc(n)}</p>`).join(''),outcome=S.outcome?`<div class="stage-outcome ${S.outcome.bad?'bad':''}">${esc(tx(S.outcome.txt))}</div>`:'',endCopy=t.finale?'Il villaggio è davanti a te. Restano soltanto gli ultimi passi.':t.extra?'La traccia ridiscende verso la stazione e il sentiero principale.':`Le luci di ${t.to.replace(/^Rifugio /,'')} compaiono oltre l’ultima curva.`;
 return `<section class="stage-one-paper"><div class="stage-weather"><span>☼</span><b>${esc(WX[S.wx])}</b><i>·</i><span>${S.wx==='pioggia'?'6':S.wx==='vento'?'7':'8'}°</span></div>${outcome}${notes}<div class="stage-next"><small>${finished?'FINE TAPPA':'PROSSIMO PUNTO DI INTERESSE'}</small><h2>${esc(next)}</h2><p>${esc(finished?endCopy:TRAIL_COPY[stage][nextIndex])}</p></div><div class="stage-one-actions">${stageOneTools()}<button class="stage-continue" onclick="step()"><span>${finished?(t.finale?'CONCLUDI':'ARRIVA'):'CONTINUA'}</span><b>»</b></button></div></section>`}
function eventChoiceIcon(label,index){const s=String(label).toLowerCase();let key;if(/guard|osserv|foto|panoram|ascolt/.test(s))key='meraviglia';else if(/cerott|cura|medic/.test(s))key='cerotto';else if(/mang|barrett|cibo|pranz/.test(s))key='cibo';else if(/bevi|acqua|guado/.test(s))key='acqua';else if(/mappa|bussola|sentier|traccia|strada|scorci/.test(s))key='bivio';else if(/ripar|tenda|rifug|aspet|fermi|sosta/.test(s))key='tenda';else if(/corri|proseg|vai|attravers|sali|scendi|cammin/.test(s))key='scarpone';else key=['meraviglia','scarpone','rifugio','taccuino'][index%4];return `<img src="${SPRITE_ROOT}event/${key}.png" alt="">`}
function eventArt(ev){return `${SPRITE_ROOT}${portraitFile(eventCard(ev))}`}
function eventKind(ev){const card=eventCard(ev),key=card.replace(/^i_/,''),people=!card.startsWith('i_');
 if(people||['persona','lemming','corvo','impronte'].includes(key))return{label:'INCONTRO',icon:'✥',cls:'encounter'};
 if(['pioggia','vento','sole','zanzara'].includes(key))return{label:'METEO',icon:'☼',cls:'weather'};
 if(['meraviglia','taccuino'].includes(key))return{label:'SCOPERTA',icon:'✦',cls:'discovery'};
 if(['cibo','tenda','rifugio'].includes(key))return{label:'SOSTA',icon:'⌂',cls:'rest'};
 if(key==='cerotto')return{label:'INCIDENTE',icon:'✚',cls:'danger'};
 return{label:'IMPREVISTO',icon:'◆',cls:'obstacle'}}
function stageOneEventPanel(ev){const options=opts(ev),result=S.cardResult,kind=eventKind(ev),hasLongChoice=options.some(op=>lab(op.l).trim().length>20),choices=options.map((op,i)=>{const ok=!op.req||op.req(),risk=riskOf(op),meta=optMeta(op),selected=result&&result.choice===i;return `<button class="stage-event-choice choice-${i%4} ${selected?'selected':''}" ${ok&&!result?'':'disabled'} onclick="choose(${i})"><span class="choice-icon">${eventChoiceIcon(op.l,i)}</span><span class="choice-copy"><b>${esc(lab(op.l))}</b><small>${ok?(meta||risk&&risk[0]||'nessun costo immediato'):'Non hai quello che serve'}</small></span><strong>›</strong></button>`}).join('');
 const resultRibbon=result?`<button class="event-result ${result.bad?'bad':'good'}" onclick="dismissEvent()"><span class="result-mark">${result.bad?'◆':'✦'}</span><span class="result-copy"><small>ESITO</small><b>${esc(tx(result.txt))}</b></span><strong>CONTINUA ›</strong></button>`:'';
 return `<section class="stage-one-event ${result?'is-resolved':''}" aria-label="Carta evento: ${esc(ev.title)}"><button type="button" class="event-scene-toggle" aria-pressed="false" onclick="toggleEventScene()">SCENA</button><div class="event-deck-card back-left" aria-hidden="true"></div><div class="event-deck-card back-right" aria-hidden="true"></div><article class="event-card-shell kind-${kind.cls}"><div class="event-card-face"><header class="event-card-kind"><span class="event-compass">${kind.icon}</span><b>${kind.label}</b></header><figure class="event-card-art"><img src="${eventArt(ev)}" alt="${esc(ev.title)}"><span class="event-art-vignette"></span></figure><div class="event-card-copy"><h2>${esc(ev.title)}</h2><i><span></span><b>▲</b><span></span></i><p>${esc(tx(ev.text))}</p></div><div class="stage-event-choices choices-${Math.min(options.length,4)} ${hasLongChoice?'has-long':''}">${choices}</div>${resultRibbon}</div></article>${stageOneTools()}</section>`}
function arrivalAsset(stage,saunaOpen){if(stage===0)return `assets/godot/${saunaOpen?'poi-t1-vuolle-refuge-isometric-v1.png':'poi-t1-vuolle-refuge-isometric-closed-v1.png'}`;return `${BACKGROUND_ROOT+(EVENING[stage]||EVENING[0])}.jpg`}
function stageOneArrivalHero(t,saunaOpen){const stage=S.tappa,image=arrivalAsset(stage,saunaOpen),saunaText=t.sauna?`sauna ${saunaOpen?'aperta':'chiusa'}`:'rifugio senza sauna';
 return `<section class="stage-one-hero stage-one-arrival-hero stage-${stage+1}"><div class="stage-one-heading stage-one-arrival-heading"><span class="stage-one-mark">ᐱ</span><b>${stageLabel(t)}</b><span class="stage-one-rule"></span><h2>${esc(t.to)}</h2><div class="stage-one-progress"><strong>FINE TAPPA</strong></div></div><div class="stage-one-diorama arrival-diorama" role="img" aria-label="${esc(t.to)} alla sera, ${saunaText}"><img class="scene-bg" src="${image}" alt=""><span class="diorama-canvas" data-src="${image}" data-poi="4" aria-hidden="true"></span>${saunaOpen?'<span class="arrival-glow"></span><span class="arrival-smoke s1"></span><span class="arrival-smoke s2"></span>':''}</div>${journeyStats([['time','☀',hhmm(S.arrive),'ORA',S.arrive],['energy','ϟ',Math.round(S.energia),'ENERGIA',S.energia],['morale','♥',Math.round(S.morale),'MORALE',S.morale],['soldi','●',S.soldi+' €','SOLDI',S.soldi]],'arrival-stats')}</section>`}
function arrivalChoice(icon,title,meta,action,disabled=false,featured=false){return `<button class="arrival-choice ${featured?'featured':''}" ${disabled?'disabled':''} onclick="${action}"><span class="arrival-choice-icon">${icon}</span><span><b>${esc(title)}</b><small>${esc(meta)}</small></span><strong>›</strong></button>`}
function arrivalServices(t){const shop=t.shop&&!S.closed?`<details class="arrival-service"><summary>SPACCIO</summary><div><button ${S.soldi<12?'disabled':''} onclick="buy('pasti',12)">Pasto <b>12 €</b></button><button ${S.soldi<3?'disabled':''} onclick="buy('barrette',3)">Barretta <b>3 €</b></button><button ${S.soldi<4?'disabled':''} onclick="buy('cerotti',4)">Cerotto <b>4 €</b></button></div></details>`:'';
 const power=inv('powerbank')>0?`<button class="arrival-service-button" onclick="ricarica()">POWERBANK · ${inv('powerbank')}</button>`:'';
 const news=(S.arrMsg||[]).length?`<details class="arrival-service"><summary>NOTIZIE · ${S.arrMsg.length}</summary><div class="arrival-news">${S.arrMsg.map(m=>`<p>${esc(m)}</p>`).join('')}</div></details>`:'';
 return shop||power||news?`<div class="arrival-services">${shop}${power}${news}</div>`:''}
function stageOneArrivalPanel(t,saunaOpen,late){const intro=S.closed?'Il rifugio è chiuso per la stagione. Il locale invernale resta accessibile senza custode.':late?'Arrivi tardi: i letti sono già tutti occupati.':'C’è ancora un letto libero.';
 const sauna=!t.sauna?'':saunaOpen?arrivalChoice(`<img src="${arrivalAsset(S.tappa,true)}" alt="">`,'Sauna e tuffo nel torrente',S.didSauna?'Fatto · vestiti asciutti e corpo caldo':'Morale ed energia · asciughi tutto',"sauna()",S.didSauna,true):`<div class="arrival-closed"><span>SAUNA CHIUSA</span><b>Luci spente, nessun fumo dal camino.</b></div>`;
 const refugeIcon=portraitSvg('i_rifugio',52,52),floorIcon=gearSvg('matSchiuma',52),tentIcon=gearSvg('tenda',52),choices=[arrivalChoice(refugeIcon,'Letto nel rifugio',late?'Pieno':`${hutPrice(t)} € · recupero pieno`,"sleep('letto')",late||S.soldi<hutPrice(t)),arrivalChoice(floorIcon,S.closed?'Locale invernale':'Pavimento',`${S.closed?'Gratis':floorPrice(t)+' €'} · recupero ridotto`,"sleep('pavimento')",S.soldi<floorPrice(t)),arrivalChoice(tentIcon,'Tenda',(att('riparo')>=1)?'Gratis · dipende dal meteo':'Non hai la tenda',"sleep('tenda')",!(att('riparo')>=1))];
 if(!(att('riparo')>=1)&&S.soldi<FLOOR)choices.push(arrivalChoice(floorIcon,'All’aperto, nel sacco','Gratis · recupero minimo',"sleep('tenda')"));
 return `<section class="stage-one-paper stage-one-arrival-paper"><div class="arrival-intro"><small>ARRIVO · ${hhmm(S.arrive)}</small><h2>Dove dormi?</h2><p>${esc(intro)} ${esc(forecastWho())} domani ${esc(WX[S.forecast.shown].toLowerCase())}.</p></div>${arrivalServices(t)}<div class="arrival-choices">${sauna}${choices.join('')}</div>${stageOneTools()}</section>`}
function stageOneArrivalScreen(t,saunaOpen,late){const state=t.sauna?(saunaOpen?'sauna-open':'sauna-closed'):'no-sauna';return `<div class="stage-one-ui arrival stage-${S.tappa+1} ${state}">${stageOneArrivalHero(t,saunaOpen)}${stageOneArrivalPanel(t,saunaOpen,late)}</div>`}
function morningAsset(){let place;if(S.tappa<=4)place=MORNING[S.tappa];else place=S.tappa===5?'gaisi-summit':'gaisi-njalla';return `${BACKGROUND_ROOT}morning-${place}-${S.lastSleep==='tenda'?'tent':'refuge'}.jpg`}
function stageMorningScreen(cur,next,station){const image=morningAsset(),title=cur.to.replace(/^Rifugio /,''),summitIcon=portraitSvg('i_meraviglia',48,48),sunIcon=portraitSvg('i_sole',48,48),foodIcon=portraitSvg('i_cibo',48,48),hutIcon=portraitSvg('i_rifugio',48,48),vreq=`Serve esperienza ${VETTA_XP} (ne hai ${S.xp}), aderenza 3 e calore 1`,choices=[];
 if(station)choices.push(arrivalChoice(summitIcon,'Sali sul Gáisi',vettaOk()?'Giorno extra · la vetta più alta della regione':vreq,"nextDay('vetta')",!vettaOk(),true));
 choices.push(arrivalChoice(sunIcon,'Partenza alle 6:30','Più tempo davanti · Energia −8',"nextDay('presto')"),arrivalChoice(sunIcon,'Partenza alle 8:00','Ritmo normale',"nextDay('normale')"),arrivalChoice(foodIcon,'Colazione lunga','Partenza 9:30 · Energia +6 · Morale +3',"nextDay('tardi')"),arrivalChoice(hutIcon,'Giorno di riposo','Costa un giorno di ferie · Energia +30',"nextDay('riposo')"));
 const night=(S.night||[]).length?`<details class="arrival-service morning-notes"><summary>LA NOTTE · ${S.night.length}</summary><div class="arrival-news">${S.night.map(m=>`<p>${esc(m)}</p>`).join('')}</div></details>`:'';
 return `<div class="stage-one-ui morning stage-${S.tappa+1}"><section class="stage-one-hero stage-morning-hero"><div class="stage-one-heading"><span class="stage-one-mark">ᐱ</span><b>MATTINO</b><span class="stage-one-rule"></span><h2>${esc(title)}</h2><div class="stage-one-progress"><strong>${next?stageLabel(next):'ULTIMO GIORNO'}</strong></div></div><div class="stage-one-diorama morning-diorama" role="img" aria-label="Mattino a ${esc(cur.to)}"><img class="scene-bg" src="${image}" alt=""><span class="diorama-canvas" data-src="${image}" data-poi="2" aria-hidden="true"></span>${weatherLayer(S.forecast.shown)}</div>${journeyStats([['time','☀','07:00','ORA',420],['energy','ϟ',Math.round(S.energia),'ENERGIA',S.energia],['morale','♥',Math.round(S.morale),'MORALE',S.morale],['ferie','◇',S.ferie,'FERIE',S.ferie]],'morning-stats')}</section><section class="stage-one-paper stage-morning-paper"><div class="arrival-intro"><small>${esc(WX[S.forecast.shown].toUpperCase())}</small><h2>Come parti?</h2><p>${esc(forecastWho(true))} oggi ${esc(WX[S.forecast.shown].toLowerCase())}.${next?` Prossima tappa: ${esc(next.to)}, ${next.km} km.`:''}</p></div>${night}<div class="arrival-choices morning-choices">${choices.join('')}</div>${stageOneTools()}</section></div>`}
function stageFinalScreen(kind,title,km,days){const win=kind==='completo',image=win?`${BACKGROUND_ROOT}final-njalla-bench.jpg`:stageAsset(Math.min(S.tappa,POI.length-1),poiIndex(Math.min(S.tappa,POI.length-1),S.seg)),subtitle=win?'La Via delle Renne è tua':'Il cammino finisce qui';
 return `<div class="stage-one-ui trail-final ${win?'completed':'interrupted'}"><section class="stage-one-hero stage-final-hero"><div class="stage-one-heading"><span class="stage-one-mark">ᐱ</span><b>FINE CAMMINO</b><span class="stage-one-rule"></span><h2>${win?'Villaggio di Njalla':'Sul sentiero'}</h2><div class="stage-one-progress"><strong>${win?'COMPLETATO':'INTERROTTO'}</strong></div></div><div class="stage-one-diorama final-diorama" role="img" aria-label="${esc(subtitle)}"><img class="scene-bg" src="${image}" alt="">${weatherLayer(S.wx)}</div></section><section class="stage-one-paper stage-final-paper"><div class="arrival-intro"><small>${esc(subtitle.toUpperCase())}</small><h2>${esc(title)}</h2><p>${esc(tx(S.end))}</p></div><div class="trail-summary"><div><b>${km}</b><span>KM</span></div><div><b>${days}</b><span>GIORNI</span></div><div><b>${S.xp}</b><span>ESPERIENZA</span></div><div><b>${S.timbri.length}</b><span>TIMBRI</span></div></div><div class="final-stamps">${S.timbri.slice(-5).map(t=>`<span>${esc(t)}</span>`).join('')}</div><button class="stage-continue final-restart" onclick="S=newState();render()"><span>RICOMINCIA</span><b>»</b></button></section></div>`}
function assetImage(asset){const root=asset.startsWith('scene/')?SPRITE_ROOT:asset.startsWith('backgrounds/')?'assets/':'';return `<img class="scene-bg" src="${root+asset}" alt="">`}
function routeOverlay(stage,total,done){const c=document.createElement('canvas');c.width=780;c.height=520;const g=c.getContext('2d'),samples=sampleMapRoute(stage,40),points=MAP_ROUTE_POINTS[stage%MAP_ROUTE_POINTS.length];
 const completed=Math.max(0,Math.min(total,done)),progress=total>1?Math.max(0,(completed-1)/(total-1)):0,last=Math.round(progress*(samples.length-1));
 if(completed>1){g.beginPath();for(let i=0;i<=last;i++){const p=samples[i],x=p[0]*c.width,y=p[1]*c.height;i?g.lineTo(x,y):g.moveTo(x,y)}g.lineCap='round';g.lineJoin='round';g.strokeStyle='#A33E22';g.lineWidth=10;g.stroke()}
 if(completed>0){const p=points[Math.min(completed-1,points.length-1)],x=p[0]*c.width,y=p[1]*c.height;g.beginPath();g.arc(x,y,15,0,Math.PI*2);g.fillStyle='#E1A640';g.fill();g.strokeStyle='#49382D';g.lineWidth=5;g.stroke()}
 return `<img class="route-progress" src="${c.toDataURL('image/png')}" alt="" data-stage="${stage+1}" data-events="${total}" data-done="${done}">`}
function trekScene(background,label,weather){const t=TAPPE[S.tappa],route=routeOverlay(S.tappa,t.terr.length,Math.min(S.seg,t.terr.length));return `<div class="scene raster-scene trek-scene wx-${weather||'sole'}" role="img" aria-label="${esc(label||'')}">${background}<span class="stage-map"><img class="stage-map-bg" src="assets/maps/stage-map-${S.tappa+1}.png" alt="Mappa illustrata della tappa">${route}</span>${weatherLayer(weather)}</div>`}
const MAP_ALPHA_BOTTOM_GAPS=[28,14,27,29,25,24,28,28];
function positionTrekMap(){const map=document.querySelector('.trek-scene .stage-map'),stats=document.querySelector('.hdr .ov-bot');if(!map||!stats)return;
 const apply=()=>{if(!map.isConnected||!stats.isConnected)return;const gap=map.getBoundingClientRect().height*(MAP_ALPHA_BOTTOM_GAPS[S.tappa]||28)/520;map.style.setProperty('--map-alpha-gap',`${gap}px`);map.style.bottom=`${Math.max(0,stats.getBoundingClientRect().height+3-gap)}px`};
 apply();requestAnimationFrame(apply);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(apply)}
function sceneMode(){const ev=S.current;if(!ev)return null;if(ev.id==='traversataLago')return 'lago';const k=eventCard(ev);return k==='i_acqua'&&/guado|torrent|ruscell|fium|corrente/i.test((ev.title||'')+' '+(typeof ev.text==='string'?ev.text:''))?'guado':null}
const TERR_SCENE={valle:0,betulle:1,torbiera:2,lago:3,altopiano:4,passo:5,gola:6};
function scene(t){const start=S.tappa===0&&S.seg<=1&&S.current&&['treno','bilancia','stazioneArrivo'].includes(S.current.id);const row=POI[S.tappa]||POI[0],entry=start?['Lavvuby — Il primo segnavia','scene/trail-station.png']:row[poiIndex(S.tappa,S.seg)];return trekScene(assetImage(entry[1]),entry[0],S.wx)}
const EVENING=['evening-vuolle','evening-gaskas','evening-biegga','evening-sallo','evening-guovda','evening-gaisi-station','evening-gaisi-return'];
function hutScene(t,saunaOn){const file=EVENING[S.tappa]||EVENING[0],isometric=S.tappa===0,src=isometric?`assets/godot/${saunaOn?'poi-t1-vuolle-refuge-isometric-v1.png':'poi-t1-vuolle-refuge-isometric-closed-v1.png'}`:`${BACKGROUND_ROOT+file}.jpg`;return `<div class="scene raster-scene evening-scene stage-${S.tappa+1} ${isometric?'isometric-refuge':''} ${saunaOn?'sauna-on':''}" role="img" aria-label="${esc(t.to+', la sera')}"><img class="scene-bg" src="${src}" alt="">${saunaOn?'<span class="sauna-glow"></span><span class="sauna-smoke s1"></span><span class="sauna-smoke s2"></span>':''}${weatherLayer(S.wx)}</div>`}
const MORNING=['vuolle','gaskas','biegga','sallo','guovda'];
function morningScene(){let place;if(S.tappa<=4)place=MORNING[S.tappa];else place=S.tappa===5?'gaisi-summit':'gaisi-njalla';const kind=S.lastSleep==='tenda'?'tent':'refuge';return `<div class="scene raster-scene morning-scene" role="img" aria-label="Il mattino dopo"><img class="scene-bg" src="${BACKGROUND_ROOT}morning-${place}-${kind}.jpg" alt="">${weatherLayer(S.forecast.shown)}</div>`}
function endKind(){if(S.endKind)return S.endKind;if(S.timbri.includes('Via delle Renne completata'))return 'completo';return 'altro'}
function endScene(){const k=endKind(),win=k==='completo';if(win)return `<div class="scene raster-scene" role="img" aria-label="Cammino completato"><img class="scene-bg" src="${BACKGROUND_ROOT}final-njalla-bench.jpg" alt="">${weatherLayer(S.wx)}</div>`;return atlasScene('trail-scenes.png',4,3,11,'Fine del cammino',k==='energia'||k==='morale'?'sit':'stand',S.wx)}
function figure(){return `<div class="pack-figure">${poseSprite('stand','Escursionista con lo zaino')}<span>${packKg().toFixed(1).replace('.',',')} kg</span></div>`}
function calendar(){return atlasScene('home-scenes-isometric-v2.png',4,2,0,MONTHS[H.mese-1],null,'sereno')}
function trekKm(){let km=0;for(let i=0;i<S.tappa;i++){if(TAPPE[i].extra&&!S.timbri.includes('La vetta del Gáisi'))continue;km+=TAPPE[i].km}const t=TAPPE[S.tappa];if(t)km+=endKind()==='completo'?t.km:Math.round(t.km*Math.min(S.seg,t.terr.length)/t.terr.length);return km}

function hdr(visual,title,sub,timeVal){const st=(v,l,low)=>`<div class="ostat ${low?'low':''}"><b>${v}</b><span>${l}</span></div>`;const tags=[...S.stati].map(s=>`<span class="tag">${STATO[s]}</span>`).join('')+(S.fame?`<span class="tag">${['','Appetito','Affamato','Molto affamato','Sfinito dalla fame'][S.fame]}</span>`:'');const dev=`telefono ${inv('batteria')}%${has('orologio')?' · orologio '+S.bat.orologio+'%':''}${has('faro')?' · faro '+S.bat.faro+'%':''}`;return `<div class="hdr"><div class="pic">${visual}<div class="ov-top"><h2>${esc(title)}</h2>${sub?`<span>${esc(sub)}</span>`:''}</div><div class="ov-bot">${st(hhmm(timeVal),'ora',S.screen==='tappa'&&S.clock>960)}${st(Math.round(S.energia),'energia',S.energia<30)}${st(Math.round(S.morale),'morale',S.morale<30)}${st(S.ferie,'ferie',S.ferie<=2)}${st(S.soldi+' €','soldi',S.soldi<HUT)}</div></div><div class="info"><div class="irow"><span class="wx">${WX[S.wx]}</span><span>zaino ${packKg().toFixed(1).replace('.',',')} kg · ${speed().toFixed(1).replace('.',',')} km/h</span></div><div class="irow small">${[['pasti',inv('pasti')],['barrette',inv('barrette')],['gas',inv('gas')],['cerotti',inv('cerotti')],['repellente',inv('repellente')],['calze',inv('calze')]].map(([k,v])=>`<span>${k} <b>${v}</b></span>`).join('')}<span>${dev}</span>${inv('powerbank')?`<span>powerbank <b>${inv('powerbank')}</b></span>`:''}</div>${tags?`<div class="tags">${tags}</div>`:''}</div></div>`}

const HOME_LABEL={ufficio:'In ufficio',straordinari:'Straordinari, la sera tardi',palestra:'In palestra',gita:'Weekend in montagna con Paolo',divano:'Sul divano davanti alla televisione',letto:'A letto con la febbre',ritorno:'Di ritorno dal cammino',negozio:'Al negozio'};
const HOME_SCENE={ufficio:0,straordinari:1,palestra:2,gita:3,divano:4,letto:5,ritorno:6,negozio:7};
function homeScene(kind){return atlasScene('home-scenes-isometric-v2.png',4,2,HOME_SCENE[kind]??0,HOME_LABEL[kind]||'',null,null)}
function homeStatState(kind,value){if(kind==='soldi')return value<80?['critical',Math.min(100,value/2),'in rosso']:value<180?['negative',value/6,'stretti']:value>=500?['positive',Math.min(100,value/7),'solidi']:['neutral',Math.min(100,value/5),'stabili'];if(kind==='ferie'){const need=TREK_DAYS;return inSeason()&&value<need?['critical',value/need*100,'non bastano']:value<6?['negative',value/FERIE_MAX*100,'poche']:value>=14?['positive',value/FERIE_MAX*100,'ottime']:['neutral',value/FERIE_MAX*100,'disponibili']}if(value<25)return['critical',value,'critico'];if(value<45)return['negative',value,'in calo'];if(value>=75)return['positive',value,'ottimo'];return['neutral',value,'stabile']}
function homeStats(){const st=(kind,icon,v,label,raw)=>{const [state,pct,note]=homeStatState(kind,raw);return `<div class="home-stat state-${state}" title="${esc(note)}"><span class="sicon">${icon}</span><span class="home-stat-copy"><b>${v}</b><small>${label}<em>${esc(note)}</em></small><i class="home-stat-track"><u style="width:${Math.max(4,Math.min(100,pct))}%"></u></i></span></div>`};return `<div class="stage-one-stats home-stats">${st('soldi','●',H.soldi+' €','SOLDI',H.soldi)}${st('ferie','◇',H.ferie,'FERIE',H.ferie)}${st('forma','ϟ',H.forma,'FORMA',H.forma)}${st('voglia','♥',H.voglia,'VOGLIA',H.voglia)}</div>`}
function homeHdr(kind,title,sub){return `<section class="home-hero"><div class="stage-one-heading"><span class="stage-one-mark">ᐱ</span><b>CASA</b><span class="stage-one-rule"></span><h2>${esc(title)}</h2><div class="stage-one-progress"><strong>${esc(sub||'')}</strong></div></div><div class="home-diorama">${homeScene(kind)}</div>${homeStats()}</section>`}
function homeCompactHeader(title){return `<header class="home-compact"><button onclick="H.screen='casa';render()" aria-label="Indietro">‹</button><div><small>CASA · ${esc(MONTHS[H.mese-1].toUpperCase())}</small><h2>${esc(title)}</h2></div><strong>${H.soldi} €</strong></header>`}
function packOverview(){const pack=equippedItem('zainoUL')||equippedItem('zainoClassico'),id=pack?pack.id:'zainoClassico',kg=packKg(),heavy=kg>10;return `<header class="pack-hero"><div class="pack-title"><small>PREPARAZIONE</small><h2>Lo zaino</h2><p>Solo ciò che serve. Ogni scelta pesa sul cammino.</p></div><div class="pack-summary ${heavy?'heavy':''}"><span class="pack-product">${gearSvg(id,112)}</span><span><b>${kg.toFixed(1).replace('.',',')} kg</b><small>${speed().toFixed(1).replace('.',',')} km/h</small></span></div></header>`}

const GEN_WORDS='stanco|sfinito|fradicio|bagnato|zuppo|sudato|arrivato|partito|rimasto|salito|sceso|caduto|seduto|sdraiato|perso|pronto|contento|felice|solo|convinto|sicuro|svegliato|addormentato|scivolato|fermato|riposato|riuscito|tornato|nato|preoccupato|deluso|orgoglioso|grato|tentato|ubriaco|esausto|distrutto|congelato|gelato|infreddolito|ustionato|ritrovato|abituato|pentito|innamorato|commosso|emozionato';
const GEN_RE=new RegExp('\\b(sei|ti senti|ti sei|resti|rimani|arrivi|sembri|torni|riparti|ti ritrovi|ti svegli|sei già|sei ancora|sei tutto|sei davvero|ti scopri|ti trovi)\\s+((?:'+GEN_WORDS+'))\\b','gi');
function gtxt(s){if(typeof s!=='string'||pg().sex!=='f')return s;return s.replace(GEN_RE,(m,a,w)=>a+' '+w.replace(/o$/,'a').replace(/O$/,'A'))}
