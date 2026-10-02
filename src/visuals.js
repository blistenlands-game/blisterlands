/* =========== IDENTITA VISIVA RASTER =========== */
const VERSION=GAME_CONFIG.version;
const ART_ROOT='assets/art/';
const SPRITE_ROOT='assets/sprites/';
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
const SCENE_X={waterfall:20,'suspension-bridge':49,ford:53,spring:76,'fisherman-lake':58,'stream-camp':24,'lake-boat':48,'double-rainbow':50,'broken-bridge':76,'deep-mud':48,'bog-boardwalk':49,'boulder-field':55,landslide:48,'flower-meadow':52,'blueberry-slope':55,snowfield:50,'moose-birches':52,'forest-smoke':57,'reindeer-corral':52,'sacred-boulder':45,'turf-hut':62,'ridge-routes':52,'summit-panorama':49,'narrow-canyon':52,'evening-refuge':54,'aurora-camp':18,'trail-station':76};
function eventLandscape(ev){return ev&&EVENT_SCENE[ev.id]}
function trekScene(background,label,weather,x=50,size=18){return `<div class="scene raster-scene trek-scene wx-${weather||'sole'}" role="img" aria-label="${esc(label||'')}" style="--walker-x:${x}%;--walker-size:${size}%">${background}${poseSprite('walk',label)}${weatherLayer(weather)}</div>`}
function sceneMode(){const ev=S.current;if(!ev)return null;if(ev.id==='traversataLago')return 'lago';const k=eventCard(ev);return k==='i_acqua'&&/guado|torrent|ruscell|fium|corrente/i.test((ev.title||'')+' '+(typeof ev.text==='string'?ev.text:''))?'guado':null}
const TERR_SCENE={valle:0,betulle:1,torbiera:2,lago:3,altopiano:4,passo:5,gola:6};
function scene(t){const special=eventLandscape(S.current);if(special)return trekScene(`<img class="scene-bg" src="${SPRITE_ROOT}scene/${special}.png" alt="">`,S.current.title,S.wx,SCENE_X[special]||50);const i=Math.max(0,Math.min(S.seg-1,t.terr.length-1)),mode=sceneMode(),terrain=mode==='guado'?'guado':mode==='lago'?'lago':t.terr[i],index=terrain==='guado'?7:(TERR_SCENE[terrain]??0),x=[48,53,50,36,51,55,53,56][index]||50;return trekScene(sprite('trail-scenes.png',4,3,index,'scene-bg','',null,null),`Sentiero: ${TERR[terrain]||terrain}`,S.wx,x)}
function hutScene(t){return atlasScene('trail-scenes.png',4,3,8,`${t.to}, la sera`,'stand',S.wx)}
function morningScene(){return atlasScene('trail-scenes.png',4,3,9,'Il mattino dopo','stand',S.forecast.shown)}
function endKind(){if(S.endKind)return S.endKind;if(S.timbri.includes('Via delle Renne completata'))return 'completo';return 'altro'}
function endScene(){const k=endKind(),win=k==='completo';return atlasScene('trail-scenes.png',4,3,win?10:11,win?'Cammino completato':'Fine del cammino',win?'victory':k==='energia'||k==='morale'?'sit':'stand',S.wx)}
function figure(){return `<div class="pack-figure">${poseSprite('stand','Escursionista con lo zaino')}<span>${packKg().toFixed(1).replace('.',',')} kg</span></div>`}
function calendar(){return atlasScene('home-scenes.png',4,2,0,MONTHS[H.mese-1],null,'sereno')}
function progressDots(t){let s='';for(let i=1;i<=t.terr.length;i++)s+=i<=S.seg?'●':'○';return s}
function trekKm(){let km=0;for(let i=0;i<S.tappa;i++){if(TAPPE[i].extra&&!S.timbri.includes('La vetta del Gáisi'))continue;km+=TAPPE[i].km}const t=TAPPE[S.tappa];if(t)km+=endKind()==='completo'?t.km:Math.round(t.km*Math.min(S.seg,t.terr.length)/t.terr.length);return km}

function hdr(visual,title,sub,timeVal){const st=(v,l,low)=>`<div class="ostat ${low?'low':''}"><b>${v}</b><span>${l}</span></div>`;const tags=[...S.stati].map(s=>`<span class="tag">${STATO[s]}</span>`).join('')+(S.fame?`<span class="tag">${['','Appetito','Affamato','Molto affamato','Sfinito dalla fame'][S.fame]}</span>`:'');const dev=`telefono ${inv('batteria')}%${has('orologio')?' · orologio '+S.bat.orologio+'%':''}${has('faro')?' · faro '+S.bat.faro+'%':''}`;return `<div class="hdr"><div class="pic">${visual}<div class="ov-top"><h2>${esc(title)}</h2>${sub?`<span>${esc(sub)}</span>`:''}</div><div class="ov-bot">${st(hhmm(timeVal),'ora',S.screen==='tappa'&&S.clock>960)}${st(Math.round(S.energia),'energia',S.energia<30)}${st(Math.round(S.morale),'morale',S.morale<30)}${st(S.ferie,'ferie',S.ferie<=2)}${st(S.soldi+' €','soldi',S.soldi<HUT)}</div></div><div class="info"><div class="irow"><span class="wx">${WX[S.wx]}</span><span>zaino ${packKg().toFixed(1).replace('.',',')} kg · ${speed().toFixed(1).replace('.',',')} km/h</span></div><div class="irow small">${[['pasti',inv('pasti')],['barrette',inv('barrette')],['gas',inv('gas')],['cerotti',inv('cerotti')],['repellente',inv('repellente')],['calze',inv('calze')]].map(([k,v])=>`<span>${k} <b>${v}</b></span>`).join('')}<span>${dev}</span>${inv('powerbank')?`<span>powerbank <b>${inv('powerbank')}</b></span>`:''}</div>${tags?`<div class="tags">${tags}</div>`:''}</div></div>`}

const HOME_LABEL={ufficio:'In ufficio',straordinari:'Straordinari, la sera tardi',palestra:'In palestra',gita:'Weekend in montagna con Paolo',divano:'Sul divano davanti alla televisione',letto:'A letto con la febbre',ritorno:'Di ritorno dal cammino',negozio:'Al negozio'};
const HOME_SCENE={ufficio:0,straordinari:1,palestra:2,gita:3,divano:4,letto:5,ritorno:6,negozio:7};
function homeScene(kind){const pose=kind==='divano'||kind==='letto'?'sit':kind==='ufficio'||kind==='straordinari'?'sit':'stand';return atlasScene('home-scenes.png',4,2,HOME_SCENE[kind]??0,HOME_LABEL[kind]||'',pose,H&&H.voglia<30?'pioggia':'sereno')}
function homeHdr(kind,title,sub){const st=(v,l,low)=>`<div class="ostat ${low?'low':''}"><b>${v}</b><span>${l}</span></div>`;return `<div class="hdr"><div class="pic">${homeScene(kind)}<div class="ov-top"><h2>${esc(title)}</h2>${sub?`<span>${esc(sub)}</span>`:''}</div><div class="ov-bot">${st(H.soldi+' €','soldi',H.soldi<100)}${st(H.ferie,'ferie',H.ferie<TREK_DAYS)}${st(H.forma,'forma',H.forma<40)}${st(H.voglia,'voglia',H.voglia<30)}${st(H.completati,'cammini')}</div></div><div class="info"><div class="irow"><span class="wx">${esc(HOME_LABEL[kind]||'')}</span><span>${H.voglia<30?'tutto sembra grigio':H.voglia<55?'la testa è altrove':'hai voglia di partire'}</span></div></div></div>`}

const GEN_WORDS='stanco|sfinito|fradicio|bagnato|zuppo|sudato|arrivato|partito|rimasto|salito|sceso|caduto|seduto|sdraiato|perso|pronto|contento|felice|solo|convinto|sicuro|svegliato|addormentato|scivolato|fermato|riposato|riuscito|tornato|nato|preoccupato|deluso|orgoglioso|grato|tentato|ubriaco|esausto|distrutto|congelato|gelato|infreddolito|ustionato|ritrovato|abituato|pentito|innamorato|commosso|emozionato';
const GEN_RE=new RegExp('\\b(sei|ti senti|ti sei|resti|rimani|arrivi|sembri|torni|riparti|ti ritrovi|ti svegli|sei già|sei ancora|sei tutto|sei davvero|ti scopri|ti trovi)\\s+((?:'+GEN_WORDS+'))\\b','gi');
function gtxt(s){if(typeof s!=='string'||pg().sex!=='f')return s;return s.replace(GEN_RE,(m,a,w)=>a+' '+w.replace(/o$/,'a').replace(/O$/,'A'))}
