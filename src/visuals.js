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
function poseSprite(pose,label){const who=(typeof H!=='undefined'&&H&&PG[H.pg])?H.pg:'marco',withPoles=pose==='walk'&&typeof S!=='undefined'&&S&&S.kit&&has('bastoncini');
 const heldPoles=pose==='stand'&&typeof S!=='undefined'&&S&&S.kit&&has('bastoncini');
 const base=pose==='walk'?`<span class="pose-art walk-art" data-poles="${withPoles?'yes':'no'}" style="background-image:url('${SPRITE_ROOT}${withPoles?'walk-poles':'walk'}/${who}.png')"></span>`:`<img class="pose-art" data-poles="${heldPoles?'yes':'no'}" src="${SPRITE_ROOT}${heldPoles?'pose-poles/'+who+'.png':'pose/'+who+'-'+pose+'.png'}" alt="">`;
 return `<span class="pose-sprite pose-figure pose-${pose}" role="img" aria-label="${esc(label||'')}">${base}</span>`}

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
function eventCard(ev){const p=eventPortrait(ev);if(p)return p;if(ev._icon&&PORTRAIT[ev._icon])return ev._icon;let txt='';try{txt=tx(ev.text)}catch(e){}for(const [re,k] of ICON_KEYS)if(re.test(ev.title||'')||re.test(txt))return 'i_'+k;return 'i_taccuino'}

const GEAR_BASE=['zainoClassico','zainoUL','saccoPiuma','saccoSint','quiltPiuma','quiltSint','matGonfiabile','matSchiuma','trail','scarponi','basse','guscio','pile','ghette','bastoncini','sandali','rete','cappello','filtro','mappa','orologio','faro','kit','fornello','tenda','carte'];
function gearSvg(id,size){const it=ITEM_BY[id],base=it?(it.base||it.id):id,index=GEAR_BASE.indexOf(base);if(index<0)return '';return `<img class="sprite gear-sprite" src="${SPRITE_ROOT}gear/${base}.png" alt="${esc(it?(it.model||it.name):base)}" style="width:${size||56}px;height:${size||56}px">`}
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
function assetImage(asset){const root=asset.startsWith('scene/')?SPRITE_ROOT:asset.startsWith('backgrounds/')?'assets/':'';return `<img class="scene-bg" src="${root+asset}" alt="">`}
function routeOverlay(stage,total,done){const c=document.createElement('canvas');c.width=780;c.height=520;const g=c.getContext('2d'),samples=sampleMapRoute(stage,40),points=MAP_ROUTE_POINTS[stage%MAP_ROUTE_POINTS.length];
 const completed=Math.max(0,Math.min(total,done)),progress=total>1?Math.max(0,(completed-1)/(total-1)):0,last=Math.round(progress*(samples.length-1));
 if(completed>1){g.beginPath();for(let i=0;i<=last;i++){const p=samples[i],x=p[0]*c.width,y=p[1]*c.height;i?g.lineTo(x,y):g.moveTo(x,y)}g.lineCap='round';g.lineJoin='round';g.strokeStyle='#A33E22';g.lineWidth=10;g.stroke()}
 if(completed>0){const p=points[Math.min(completed-1,points.length-1)],x=p[0]*c.width,y=p[1]*c.height;g.beginPath();g.arc(x,y,15,0,Math.PI*2);g.fillStyle='#E1A640';g.fill();g.strokeStyle='#49382D';g.lineWidth=5;g.stroke()}
 return `<img class="route-progress" src="${c.toDataURL('image/png')}" alt="" data-stage="${stage+1}" data-events="${total}" data-done="${done}">`}
function trekScene(background,label,weather){const t=TAPPE[S.tappa],route=routeOverlay(S.tappa,t.terr.length,Math.min(S.seg,t.terr.length)),moving=!!S.walking;return `<div class="scene raster-scene trek-scene wx-${weather||'sole'}" role="img" aria-label="${esc(label||'')}">${background}<span class="stage-map"><img class="stage-map-bg" src="assets/maps/stage-map-${S.tappa+1}.png" alt="Mappa illustrata della tappa">${route}<span class="map-hiker ${moving?'is-walking':'is-still'}">${poseSprite(moving?'walk':'stand',moving?'Escursionista in cammino':'Escursionista al punto di interesse')}</span></span>${weatherLayer(weather)}</div>`}
function sceneMode(){const ev=S.current;if(!ev)return null;if(ev.id==='traversataLago')return 'lago';const k=eventCard(ev);return k==='i_acqua'&&/guado|torrent|ruscell|fium|corrente/i.test((ev.title||'')+' '+(typeof ev.text==='string'?ev.text:''))?'guado':null}
const TERR_SCENE={valle:0,betulle:1,torbiera:2,lago:3,altopiano:4,passo:5,gola:6};
function scene(t){const start=S.tappa===0&&S.seg<=1&&S.current&&['treno','bilancia','stazioneArrivo'].includes(S.current.id);const row=POI[S.tappa]||POI[0],entry=start?['Lavvuby — Il primo segnavia','scene/trail-station.png']:row[poiIndex(S.tappa,S.seg)];return trekScene(assetImage(entry[1]),entry[0],S.wx)}
const EVENING=['evening-vuolle','evening-gaskas','evening-biegga','evening-sallo','evening-guovda','evening-gaisi-station','evening-gaisi-return'];
function hutScene(t,saunaOn){const file=EVENING[S.tappa]||EVENING[0];return `<div class="scene raster-scene evening-scene ${saunaOn?'sauna-on':''}" role="img" aria-label="${esc(t.to+', la sera')}"><img class="scene-bg" src="${BACKGROUND_ROOT+file}.jpg" alt="">${saunaOn?'<span class="sauna-glow"></span><span class="sauna-smoke s1"></span><span class="sauna-smoke s2"></span>':''}${weatherLayer(S.wx)}</div>`}
const MORNING=['vuolle','gaskas','biegga','sallo','guovda'];
function morningScene(){let place;if(S.tappa<=4)place=MORNING[S.tappa];else place=S.tappa===5?'gaisi-summit':'gaisi-njalla';const kind=S.lastSleep==='tenda'?'tent':'refuge';return `<div class="scene raster-scene morning-scene" role="img" aria-label="Il mattino dopo"><img class="scene-bg" src="${BACKGROUND_ROOT}morning-${place}-${kind}.jpg" alt="">${weatherLayer(S.forecast.shown)}</div>`}
function endKind(){if(S.endKind)return S.endKind;if(S.timbri.includes('Via delle Renne completata'))return 'completo';return 'altro'}
function endScene(){const k=endKind(),win=k==='completo';if(win)return `<div class="scene raster-scene" role="img" aria-label="Cammino completato"><img class="scene-bg" src="${BACKGROUND_ROOT}final-njalla-bench.jpg" alt="">${weatherLayer(S.wx)}</div>`;return atlasScene('trail-scenes.png',4,3,11,'Fine del cammino',k==='energia'||k==='morale'?'sit':'stand',S.wx)}
function figure(){return `<div class="pack-figure">${poseSprite('stand','Escursionista con lo zaino')}<span>${packKg().toFixed(1).replace('.',',')} kg</span></div>`}
function calendar(){return atlasScene('home-scenes.png',4,2,0,MONTHS[H.mese-1],null,'sereno')}
function trekKm(){let km=0;for(let i=0;i<S.tappa;i++){if(TAPPE[i].extra&&!S.timbri.includes('La vetta del Gáisi'))continue;km+=TAPPE[i].km}const t=TAPPE[S.tappa];if(t)km+=endKind()==='completo'?t.km:Math.round(t.km*Math.min(S.seg,t.terr.length)/t.terr.length);return km}

function hdr(visual,title,sub,timeVal){const st=(v,l,low)=>`<div class="ostat ${low?'low':''}"><b>${v}</b><span>${l}</span></div>`;const tags=[...S.stati].map(s=>`<span class="tag">${STATO[s]}</span>`).join('')+(S.fame?`<span class="tag">${['','Appetito','Affamato','Molto affamato','Sfinito dalla fame'][S.fame]}</span>`:'');const dev=`telefono ${inv('batteria')}%${has('orologio')?' · orologio '+S.bat.orologio+'%':''}${has('faro')?' · faro '+S.bat.faro+'%':''}`;return `<div class="hdr"><div class="pic">${visual}<div class="ov-top"><h2>${esc(title)}</h2>${sub?`<span>${esc(sub)}</span>`:''}</div><div class="ov-bot">${st(hhmm(timeVal),'ora',S.screen==='tappa'&&S.clock>960)}${st(Math.round(S.energia),'energia',S.energia<30)}${st(Math.round(S.morale),'morale',S.morale<30)}${st(S.ferie,'ferie',S.ferie<=2)}${st(S.soldi+' €','soldi',S.soldi<HUT)}</div></div><div class="info"><div class="irow"><span class="wx">${WX[S.wx]}</span><span>zaino ${packKg().toFixed(1).replace('.',',')} kg · ${speed().toFixed(1).replace('.',',')} km/h</span></div><div class="irow small">${[['pasti',inv('pasti')],['barrette',inv('barrette')],['gas',inv('gas')],['cerotti',inv('cerotti')],['repellente',inv('repellente')],['calze',inv('calze')]].map(([k,v])=>`<span>${k} <b>${v}</b></span>`).join('')}<span>${dev}</span>${inv('powerbank')?`<span>powerbank <b>${inv('powerbank')}</b></span>`:''}</div>${tags?`<div class="tags">${tags}</div>`:''}</div></div>`}

const HOME_LABEL={ufficio:'In ufficio',straordinari:'Straordinari, la sera tardi',palestra:'In palestra',gita:'Weekend in montagna con Paolo',divano:'Sul divano davanti alla televisione',letto:'A letto con la febbre',ritorno:'Di ritorno dal cammino',negozio:'Al negozio'};
const HOME_SCENE={ufficio:0,straordinari:1,palestra:2,gita:3,divano:4,letto:5,ritorno:6,negozio:7};
function homeScene(kind){return atlasScene('home-scenes.png',4,2,HOME_SCENE[kind]??0,HOME_LABEL[kind]||'',null,H&&H.voglia<30?'pioggia':'sereno')}
function homeHdr(kind,title,sub){const st=(v,l,low)=>`<div class="ostat ${low?'low':''}"><b>${v}</b><span>${l}</span></div>`;return `<div class="hdr"><div class="pic">${homeScene(kind)}<div class="ov-top"><h2>${esc(title)}</h2>${sub?`<span>${esc(sub)}</span>`:''}</div><div class="ov-bot">${st(H.soldi+' €','soldi',H.soldi<100)}${st(H.ferie,'ferie',H.ferie<TREK_DAYS)}${st(H.forma,'forma',H.forma<40)}${st(H.voglia,'voglia',H.voglia<30)}${st(H.completati,'cammini')}</div></div><div class="info"><div class="irow"><span class="wx">${esc(HOME_LABEL[kind]||'')}</span><span>${H.voglia<30?'tutto sembra grigio':H.voglia<55?'la testa è altrove':'hai voglia di partire'}</span></div></div></div>`}

const GEN_WORDS='stanco|sfinito|fradicio|bagnato|zuppo|sudato|arrivato|partito|rimasto|salito|sceso|caduto|seduto|sdraiato|perso|pronto|contento|felice|solo|convinto|sicuro|svegliato|addormentato|scivolato|fermato|riposato|riuscito|tornato|nato|preoccupato|deluso|orgoglioso|grato|tentato|ubriaco|esausto|distrutto|congelato|gelato|infreddolito|ustionato|ritrovato|abituato|pentito|innamorato|commosso|emozionato';
const GEN_RE=new RegExp('\\b(sei|ti senti|ti sei|resti|rimani|arrivi|sembri|torni|riparti|ti ritrovi|ti svegli|sei già|sei ancora|sei tutto|sei davvero|ti scopri|ti trovi)\\s+((?:'+GEN_WORDS+'))\\b','gi');
function gtxt(s){if(typeof s!=='string'||pg().sex!=='f')return s;return s.replace(GEN_RE,(m,a,w)=>a+' '+w.replace(/o$/,'a').replace(/O$/,'A'))}
