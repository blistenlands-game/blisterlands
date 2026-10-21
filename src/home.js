/* =========== CICLO DI CASA =========== */
const MONTHS=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const SEASON={6:'giugno',7:'luglio',8:'agosto',9:'settembre'};
const PRICE={zainoClassico:140,zainoUL:250,saccoPiuma:280,saccoSint:110,quiltPiuma:230,quiltSint:90,matGonfiabile:120,matSchiuma:30,
 trail:130,scarponi:230,basse:150,guscio:220,pile:60,pantaloni:80,ghette:40,bastoncini:80,sandali:45,rete:12,cappello:30,cappelloLana:22,guanti:24,filtro:50,mappa:25,
 orologio:350,faro:400,kit:20,fornello:45,tenda:320,carte:5};
const CPRICE={pasti:7,barrette:2,gas:3,cerotti:1,repellente:3,calze:15,powerbank:15};
const SALARY=70,FERIE_MESE=2,FERIE_MAX=20,TREK_DAYS=8;
const ABIL={resistenza:'Resistenza',orientamento:'Orientamento',tecnica:'Tecnica di montagna',adattamento:'Adattamento'};
const ABIL_NOTE={resistenza:'Meno fatica a ogni chilometro',orientamento:'Un punto di orientamento in più ogni due livelli',tecnica:'Aderenza e appoggio in più ogni due livelli',adattamento:'Meteo, insetti e acciacchi pesano meno sul morale'};
const SAVE_KEY=GAME_CONFIG.storageKey,SAVE_VERSION=3;
let H=null;
function newHome(){return{mese:4,anno:1,soldi:300,ferie:8,forma:60,voglia:70,xp:0,punti:0,abil:{resistenza:0,orientamento:0,tecnica:0,adattamento:0},
 owned:new Set(['sGita','sRifugio','sZigzag','sCresta','sPile','sPantaloni','sCappello']),catalogo:true,scorte:{pasti:2,barrette:4,gas:0,cerotti:2,repellente:1,calze:1,powerbank:0},
 timbri:[],storia:[],cardHistory:[],loadout:{},unequipped:{},fila:0,sconto:0,completati:0,vette:0,carta:null,esito:null,ritorno:null,scelta:'luglio',pg:'marco',nome:'',charTab:'equip',inspectItem:null,shopCat:'Zaini',shopItem:null,saveVersion:SAVE_VERSION}}
const lvl=()=>Math.floor(H.xp/100);
function migrateHome(o){const d=newHome(),defaultOwned=[...d.owned],oldVersion=Number(o&&o.saveVersion)||0,m=Object.assign(d,o||{});
 m.saveVersion=SAVE_VERSION;m.owned=new Set(Array.isArray(o&&o.owned)?o.owned:defaultOwned);if(oldVersion<3)m.owned.add('sPantaloni');
 m.abil=Object.assign({},newHome().abil,o&&o.abil||{});m.scorte=Object.assign({},newHome().scorte,o&&o.scorte||{});
 m.timbri=Array.isArray(m.timbri)?m.timbri:[];m.storia=Array.isArray(m.storia)?m.storia:[];m.cardHistory=Array.isArray(m.cardHistory)?m.cardHistory:[];m.loadout=m.loadout&&typeof m.loadout==='object'?m.loadout:{};m.unequipped=m.unequipped&&typeof m.unequipped==='object'?m.unequipped:{};m.ordini=Array.isArray(m.ordini)?m.ordini:[];
 return m}
function save(){try{const o=Object.assign({},H,{saveVersion:SAVE_VERSION,owned:[...H.owned]});localStorage.setItem(SAVE_KEY,JSON.stringify(o))}catch(e){}}
function load(){try{const t=localStorage.getItem(SAVE_KEY);if(!t)return null;const o=JSON.parse(t),v=Number(o.saveVersion)||0;
  if(v<SAVE_VERSION&&!localStorage.getItem(`${SAVE_KEY}-backup-v${v}`))localStorage.setItem(`${SAVE_KEY}-backup-v${v}`,t);
  return migrateHome(o)}catch(e){return null}}
const hc=(v,a,b)=>Math.max(a,Math.min(b,v));
function hfx(f){if(!f)return;if(f.soldi)H.soldi+=f.soldi;if(f.ferie)H.ferie=hc(H.ferie+f.ferie,0,FERIE_MAX);if(f.forma)H.forma=hc(H.forma+f.forma,0,100);if(f.voglia)H.voglia=hc(H.voglia+f.voglia,0,100);if(f.xp)H.xp+=f.xp;
 if(f.gift&&!H.owned.has(f.gift))H.owned.add(f.gift);if(f.scorte)for(const k in f.scorte)H.scorte[k]=(H.scorte[k]||0)+f.scorte[k];if(f.sconto)H.sconto=f.sconto;if(f.abil)H.abil[f.abil]=Math.min(5,H.abil[f.abil]+1)}

/* carte del mese: ogni carta, due o tre scelte con conseguenze */
const CARDS=[
 {id:'appennino',w:()=>3,title:'Weekend in montagna',text:'Un amico organizza due giorni sul Gran Sasso.',
  o:[{l:'Vai',f:{soldi:-60,forma:12,voglia:8},txt:'Gambe allenate, testa leggera.'},{l:'Resti a casa',f:{soldi:0},txt:'Risparmi. Il divano ringrazia, le gambe no.'}]},
 {id:'saldi',w:()=>2,title:'Saldi di fine stagione',text:'Il negozio outdoor sconta tutto del 30% per questo mese.',
  o:[{l:'Segni la data',f:{sconto:30},txt:'Questo mese nel negozio i prezzi sono scontati del 30%.'}]},
 {id:'burnout',w:()=>H.voglia<25||H.fila>=3?8:0,title:'Burnout',text:'Il lavoro ti ha svuotato. Non dormi, non hai voglia di niente.',
  o:[{l:'Ti prendi qualche giorno di ferie per riposare',f:{ferie:-3,voglia:15,forma:-2},txt:'Tre giorni di ferie bruciati, ma respiri.'},{l:'Stringi i denti',f:{voglia:-10,forma:-5},txt:'Vai avanti a fatica.'}]},
 {id:'racconti',w:()=>2,title:'Racconti di viaggio',text:'Una collega è appena tornata da un cammino in Scozia e non parla d\'altro.',
  o:[{l:'Ti fai raccontare tutto a pranzo',f:{voglia:10},txt:'Ti torna una voglia matta di partire.'},{l:'Cambi argomento',f:{voglia:-2},txt:'Un po\' d\'invidia.'}]},
 {id:'pioggia',w:()=>[11,12,1,2].includes(H.mese)?3:0.5,title:'Il mese grigio',text:'Piove da tre settimane. Esci di casa solo per lavorare.',
  o:[{l:'Pianifichi il prossimo cammino sulle mappe',f:{voglia:6,xp:5},txt:'Mappe, profili, rifugi: viaggi con la testa.'},{l:'Ti chiudi in casa',f:{voglia:-6,forma:-3},txt:'Il mese passa e basta.'}]},
 {id:'compleanno',w:()=>1.5,title:'Il tuo compleanno',text:'Gli amici vogliono farti un regalo e ti chiedono cosa vorresti.',
  o:[{l:'Qualcosa per il trekking',giftRandom:true,txt:['Hanno scelto qualcosa che non avevi ancora.','Il negoziante li ha aiutati a trovare un regalo davvero utile.']},{l:'Una cena tutti insieme',f:{voglia:10},txt:'Serata bellissima.'}]},
 {id:'bolletta',w:()=>2,title:'La bolletta',text:'Arriva una bolletta del gas molto più alta del previsto.',
  o:[{l:'Paghi',f:{soldi:-120},txt:'Addio a mezzo zaino ultralight.'},{l:'Rateizzi',f:{soldi:-50,voglia:-3},txt:'La paghi a rate, e ci pensi ogni mese.'}]},
 {id:'corso',w:()=>1.5,title:'Corso di orientamento',text:'Il CAI organizza un corso di orientamento con mappa e bussola.',
  o:[{l:'Ti iscrivi',f:{soldi:-80,abil:'orientamento',xp:10},txt:'Azimut, curve di livello, triangolazione. Orientamento +1.'},{l:'Ce la farai col telefono',f:{},txt:'Speriamo nella batteria.'}]},
 {id:'malanno',w:()=>1.5,title:'L\'influenza',text:'Una settimana a letto con la febbre.',
  o:[{l:'Ti riposi come si deve',f:{forma:-8},txt:'Guarisci in fretta, ma la forma ne risente.'},{l:'Lavori lo stesso da casa',f:{forma:-12,voglia:-5},txt:'Pessima idea: ci metti il doppio a guarire.'}]},
 {id:'mercatino',w:()=>H.owned.size>8?1.5:0,title:'Il mercatino dell\'usato',text:'Un gruppo di escursionisti organizza un mercatino dell\'attrezzatura usata.',
  o:[{l:'Vendi qualcosa che non usi',sell:true,txt:'Vendi l\'oggetto meno utile che hai, a metà prezzo.'},{l:'Vai solo a guardare',f:{voglia:4},txt:'Due chiacchiere tra appassionati.'}]},
 {id:'ferieScadenza',w:()=>H.ferie>=17?6:0,title:'Ferie in scadenza',text:'L\'ufficio ti ricorda che oltre i venti giorni le ferie nuove si perdono.',
  o:[{l:'Le prenoti per il prossimo cammino',f:{voglia:5},txt:'Ora devi partire davvero.'},{l:'Ne usi tre per un ponte lungo',f:{ferie:-3,voglia:10,forma:4},txt:'Tre giorni al mare. Non era il piano, ma ci voleva.'}]},
 {id:'promozione',w:()=>H.mese===12?2:0.4,title:'Il premio di fine anno',text:'L\'azienda distribuisce un premio di produzione.',
  o:[{l:'Lo metti da parte per l\'attrezzatura',f:{soldi:250},txt:'Un tesoretto per il negozio.'},{l:'Ti fai un regalo subito',f:{soldi:120,voglia:8},txt:'Metà spesa, metà salvata.'}]},
 {id:'documentario',w:()=>1.2,title:'Il documentario',text:'In televisione danno un documentario sulla Lapponia d\'estate.',
  o:[{l:'Lo guardi due volte',f:{voglia:8},txt:'Riconosci il tipo di rifugio. Ti batte il cuore.'},{l:'Cambi canale',f:{},txt:'Un\'altra volta.'}]},
 {id:'stagione',w:()=>H.mese===5?8:0,title:'Si apre la stagione',text:'I rifugi della Via delle Renne aprono a giugno. Gli escursionisti esperti dicono: «Prenota presto, l\'estate vola».',
  o:[{l:'Studi il percorso e prepari la lista',f:{voglia:8,xp:5},txt:'Sei pronto a partire appena puoi.'},{l:'Rimandi il pensiero',f:{},txt:'Hai tempo fino a settembre.'}]},
 {id:'ordine',w:()=>H.soldi>400?1:0,title:'Il laboratorio artigianale',text:'Un piccolo laboratorio americano vende zaini ultralight cuciti a mano. Consegna in tre mesi, ma il prezzo è basso per la qualità.',
  o:[{l:'Lo ordini',f:{soldi:-200},order:'zainoUL',txt:'Arriverà tra tre mesi. Speri prima della stagione.'},{l:'Non ora',f:{},txt:'Lo zaino dei sogni può aspettare.'}]}
];
if(typeof EXTRA_HOME_CARDS!=='undefined')CARDS.push(...EXTRA_HOME_CARDS);
function pickCard(){const recent=new Set((H.cardHistory||[]).slice(0,6)),eligible=CARDS.filter(c=>c.w()>0),fresh=eligible.filter(c=>!recent.has(c.id)),pool=fresh.length?fresh:eligible,w={};pool.forEach(c=>w[c.id]=c.w());const id=pickW(w);return CARDS.find(c=>c.id===id)}
const PLANS={
 normale:{l:'Lavoro normale',soldi:SALARY,forma:-6,voglia:-4,note:'Risparmi lo stipendio. Forma e voglia calano.'},
 straordinari:{l:'Straordinari',soldi:SALARY+80,forma:-9,voglia:-11,fila:1,note:'Molti più soldi, ma ti consumano. Troppi mesi di fila portano al burnout.'},
 allenamento:{l:'Lavoro e allenamento',soldi:SALARY-35,forma:9,voglia:-3,note:'Palestra e corse la sera: costa, ma arrivi in forma.'},
 gite:{l:'Lavoro e gite nel weekend',soldi:SALARY-70,forma:5,voglia:9,note:'Tutti i risparmi vanno in benzina e rifugi, ma la voglia di partire torna.'}};
function liveMonth(plan){const P=PLANS[plan]||PLANS.normale;H.scena={normale:'ufficio',straordinari:'straordinari',allenamento:'palestra',gite:'gita'}[plan]||'ufficio';
 const msg=[];H.soldi+=P.soldi;msg.push(`${P.l}: ${P.soldi>=0?'+':''}${P.soldi} €.`);H.fila=P.fila?H.fila+1:0;
 const before=H.ferie;H.ferie=Math.min(FERIE_MAX,H.ferie+FERIE_MESE);if(before+FERIE_MESE>FERIE_MAX)msg.push(`Hai raggiunto il tetto di ${FERIE_MAX} giorni: le ferie nuove si perdono.`);else msg.push(`Maturano ${FERIE_MESE} giorni di ferie.`);
 H.forma=hc(H.forma+P.forma,0,100);H.voglia=hc(H.voglia+P.voglia,0,100);msg.push(`Forma ${P.forma>=0?'+':''}${P.forma}, voglia ${P.voglia>=0?'+':''}${P.voglia}.`);
 eqInit();H.ordini.forEach(o=>o.m--);H.ordini.filter(o=>o.m<=0).forEach(o=>{H.owned.add(o.id);H.wear[o.id]=0;msg.push(`È arrivato il pacco da Dirtbag Stitchworks: ${ITEM_BY[o.id].name}.`)});H.ordini=H.ordini.filter(o=>o.m>0);rollStock();
 if(H.ordine){H.ordine.m--;if(H.ordine.m<=0){H.owned.add(H.ordine.id);msg.push('È arrivato lo zaino artigianale!');H.ordine=null}}
 H.sconto=0;
 H.carta=pickCard();H.cartaMsg=msg;H.screen='carta';save();render()}
const CARD_SCENE={malanno:'letto',burnout:'divano',pioggia:'divano',documentario:'divano',appennino:'gita'};
function awardRandomGear(){eqInit();const candidates=ITEMS.filter(it=>it.brand&&!H.owned.has(it.id)&&(it.lvl||0)<=lvl()+1&&!H.ordini.some(o=>o.id===it.id));if(!candidates.length){const credit=80+Math.floor(rnd()*41);H.soldi+=credit;return `Il modello giusto non c'era: ti hanno lasciato un buono da ${credit} €.`}const stocked=candidates.filter(it=>it.brand==='D'||H.stock.includes(it.id)),pool=stocked.length?stocked:candidates,it=pool[Math.floor(rnd()*pool.length)];H.owned.add(it.id);H.wear[it.id]=0;return `Nel pacco trovi ${it.name}, ${it.model||'un modello appena arrivato'} di ${BRANDS[it.brand].name}.`}
function repairRandomOwned(){eqInit();const worn=[...H.owned].map(id=>ITEM_BY[id]).filter(it=>it&&it.dur<9999&&(H.wear[it.id]||0)>0).sort((a,b)=>cond(a.id)-cond(b.id));if(!worn.length){H.soldi+=35;return 'Non c’era nulla da riparare: il laboratorio ti lascia un buono da 35 €.'}const it=worn[0];H.wear[it.id]=0;return `${it.name} torna come nuovo.`}
function randomSupplyGift(){const c=CONSUM[Math.floor(rnd()*CONSUM.length)],n=1+Math.floor(rnd()*Math.min(3,c.max));H.scorte[c.id]=(H.scorte[c.id]||0)+n;return `Ricevi ${n} ${c.name.toLowerCase()}.`}
function chooseCard(i){const c=H.carta,o=c.o[i];if(o.cost&&H.soldi<o.cost)return;if(c.id==='appennino')H.scena=i===0?'gita':'divano';else if(CARD_SCENE[c.id]&&!(c.id==='pioggia'&&i===0))H.scena=CARD_SCENE[c.id];
 if(o.f&&o.f.gift&&H.owned.has(o.f.gift)&&o.giftAlt){hfx(o.giftAlt)}else hfx(o.f);
 if(o.cost)H.soldi-=o.cost;let txt=Array.isArray(o.txt)?o.txt[Math.floor(rnd()*o.txt.length)]:o.txt;
 if(o.giftRandom)txt=`${txt} ${awardRandomGear()}`;if(o.repairRandom)txt=`${txt} ${repairRandomOwned()}`;if(o.scorteRandom)txt=`${txt} ${randomSupplyGift()}`;
 if(o.sell){const cand=[...H.owned].filter(id=>PRICE[id]).sort((a,b)=>PRICE[a]-PRICE[b]);if(cand.length){const id=cand[0];H.owned.delete(id);const v=Math.round(PRICE[id]/2);H.soldi+=v;txt=`Vendi ${ITEMS.find(x=>x.id===id).name} per ${v} €.`}}
 if(o.order)H.ordine={id:o.order,m:3};
 H.cardHistory.unshift(c.id);H.cardHistory=H.cardHistory.slice(0,12);
 H.storia.unshift(`${MONTHS[H.mese-1]} anno ${H.anno}: ${c.title}. ${txt}`);
 H.mese++;if(H.mese>12){H.mese=1;H.anno++}
 H.esito=txt;H.carta=null;H.screen='casa';save();render()}

/* negozio */

/* partenza e ritorno */
function formaMul(){return 1.35-0.6*H.forma/100}
function formaTxt(){const m=formaMul();return `Forma ${H.forma}: in cammino ogni chilometro ti costa ${m>1?'il '+Math.round((m-1)*100)+'% di fatica in più':'il '+Math.round((1-m)*100)+'% di fatica in meno'}.`}
function startMorale(){return Math.round(30+H.voglia*0.5)}
function vogliaTxt(){return `Voglia ${H.voglia}: partiresti con morale ${startMorale()} su 100.${H.voglia<25?' Attento: rischi il burnout.':''}`}
function inSeason(){return !!SEASON[H.mese]}
function packQty(id,d){const c=CONSUM.find(c=>c.id===id);const cur=inv(id),stock=H.scorte[id]||0,nv=clamp(cur+d,0,c.max);
 if(nv>cur){const need=nv-stock;if(need>0){if(S.soldi<CPRICE[id])return;S.soldi-=CPRICE[id];H.scorte[id]=(H.scorte[id]||0)+1}}
 else if(nv<cur&&cur>stock){S.soldi+=CPRICE[id];H.scorte[id]=Math.max(0,(H.scorte[id]||0)-1)}
 S.inv[id]=nv;render()}
function homeDepart(){for(const k in S.inv)if(k!=='batteria')H.scorte[k]=Math.max(0,(H.scorte[k]||0)-inv(k));
 const has_=g=>ITEMS.some(i=>i.group===g&&S.kit.has(i.id));if(!['zaino','sacco','materassino','scarpe'].every(has_)){alert('Ti servono zaino, sacco a pelo, materassino e scarpe.');return}
 S.ferie0=S.ferie;S.wx=pickW(wxW());S.tappa=0;S.start=630;if(has('faro')){S.soldi-=15;S.log.unshift('Abbonamento del faro satellitare: 15 euro.')}H.trekking=true;save();startTappa()}
function goHome(){const r={xp:S.xp,seed:S.seed,timbri:S.timbri.filter(t=>!H.timbri.includes(t)),fine:S.end,completo:S.timbri.includes('Via delle Renne completata'),vetta:S.timbri.includes('La vetta del Gáisi'),livPrima:lvl()};
 for(const k in S.inv)if(k!=='batteria')H.scorte[k]=(H.scorte[k]||0)+inv(k);
 H.soldi=S.soldi;H.ferie=Math.max(0,S.ferie);H.xp+=S.xp;H.timbri.push(...r.timbri);
 const lost=ITEMS.filter(i=>H.owned.has(i.id)&&!i.group&&!S.kit.has(i.id)&&S.log.some(l=>l.includes('Perso: '+i.name)));lost.forEach(i=>H.owned.delete(i.id));
 const gained=[...S.kit].filter(id=>!H.owned.has(id));gained.forEach(id=>H.owned.add(id));r.lost=lost.map(i=>i.name);r.gained=gained.map(id=>ITEMS.find(i=>i.id===id).name);
 r.usura=wearAfterTrek(trekKm());
 const up=lvl()-r.livPrima;H.punti+=up;r.up=up;
 H.forma=hc(H.forma+15,0,100);H.voglia=r.completo?95:60;if(r.completo)H.completati++;if(r.vetta)H.vette++;
 H.storia.unshift(`${MONTHS[H.mese-1]} anno ${H.anno}: ${r.completo?'Via delle Renne completata':'cammino interrotto'}${r.vetta?', vetta del Gáisi':''}.`);
 H.mese++;if(H.mese>12){H.mese=1;H.anno++}
 H.scena='ritorno';H.trekking=false;H.ritorno=r;H.screen='ritorno';S.screen=null;save();render()}
function spendPoint(k){if(H.punti<1||H.abil[k]>=5)return;H.punti--;H.abil[k]++;save();render()}

/* armadio, personaggio e nuovo emporio */
const GEAR_SLOTS=[
 ['zaino','Zaino','zaino'],['sacco','Sonno','sacco'],['materassino','Materassino','materassino'],['scarpe','Calzature','scarpe'],
 ['guscio','Guscio','guscio'],['pile','Strato caldo','pile'],['pantaloni','Pantaloni','pantaloni'],['bastoncini','Bastoncini','bastoncini'],
 ['ghette','Ghette','ghette'],['sandali','Guado','sandali'],['testa','Testa','rete|cappello|cappelloLana'],['guanti','Guanti','guanti'],['filtro','Acqua','filtro'],
 ['mappa','Mappa','mappa'],['orologio','Orologio','orologio'],['faro','Sicurezza','faro'],['kit','Riparazione','kit'],
 ['fornello','Cucina','fornello'],['tenda','Riparo','tenda'],['carte','Svago','carte']
];
const slotDef=id=>GEAR_SLOTS.find(s=>s[0]===id);
function itemBase(it){return it?(it.base||it.id):''}
function itemSlot(it){if(!it)return null;if(it.group)return it.group;const b=itemBase(it);return ['rete','cappello','cappelloLana'].includes(b)?'testa':b}
function bestOwnedFor(slot){const own=ITEMS.filter(it=>H.owned.has(it.id)&&itemSlot(it)===slot&&cond(it.id)>0);return own.sort((a,b)=>itPrice(b.id)-itPrice(a.id))[0]}
function initLoadout(){H.loadout=H.loadout||{};H.unequipped=H.unequipped||{};for(const [slot] of GEAR_SLOTS){const id=H.loadout[slot];if(id&&!H.owned.has(id))delete H.loadout[slot];if(!H.loadout[slot]&&!H.unequipped[slot]){const it=bestOwnedFor(slot);if(it)H.loadout[slot]=it.id}}}
function equipHome(id){eqInit();const it=ITEM_BY[id],slot=itemSlot(it);if(!it||!slot||!H.owned.has(id)||cond(id)<=0)return;H.loadout[slot]=id;delete H.unequipped[slot];H.inspectItem=id;save();render()}
function unequipHome(slot){if(!slot)return;delete H.loadout[slot];H.unequipped=H.unequipped||{};H.unequipped[slot]=true;save();render()}
function inspectGear(id){H.inspectItem=id;save();render()}
function setCharTab(tab){H.charTab=tab;save();render()}
function gearAttrs(it,owned=true){if(!it)return '';const a=owned?effAttrs(it.id):it.a||{};return Object.entries(a).filter(([,v])=>v>0).map(([k,v])=>`${ATTR[k]} ${'●'.repeat(v)}`).join(' · ')}
function gearDetail(id,mode='wardrobe'){const it=ITEM_BY[id];if(!it)return '<div class="gear-detail empty"><p>Scegli un oggetto per vederne caratteristiche e stato.</p></div>';const own=H.owned.has(id),c=own?cond(id):1,slot=itemSlot(it),equipped=H.loadout[slot]===id;
 const brand=it.brand?`<div class="detail-brand">${brandLogo(it.brand,38)}<span style="color:${BRANDS[it.brand].color}">${esc(BRANDS[it.brand].name)}</span></div>`:'';
 const actions=mode==='shop'?shopAction(it):equipped?`<button class="btn character-unequip" onclick="unequipHome('${slot}')">Disequipaggia</button>`:`<button class="btn character-equip" ${c<=0?'disabled':''} onclick="equipHome('${id}')">Equipaggia</button>`;
 return `<article class="gear-detail">${brand}<div class="gear-detail-main">${gearSvg(id,116)}<div><small>${esc((slotDef(slot)||[,'Oggetto'])[1].toUpperCase())}</small><h3>${esc(it.model||it.name)}</h3><p>${esc(it.note||'')}</p></div></div><div class="gear-specs"><span><b>${String(it.kg).replace('.',',')} kg</b>PESO</span>${own&&it.dur<9999?`<span><b>${Math.round(c*100)}%</b>${esc(condLabel(c).toUpperCase())}</span>`:''}<span><b>${it.lvl||0}</b>LIVELLO</span></div>${gearAttrs(it,own)?`<p class="gear-attrs">${gearAttrs(it,own)}</p>`:''}${it.trait?`<p class="gear-trait">${esc(TRAITS[it.trait])}</p>`:''}${actions}</article>`}
function wearableLayer(file,cls){return `<span class="character-wear ${cls} pg-${esc(H.pg)}" aria-hidden="true" style="background-image:url('assets/art/${file}')"></span>`}
function loadoutItem(slot){const id=H.loadout[slot];return id&&H.owned.has(id)?ITEM_BY[id]:null}
function brandedLayer(kind,it,cls){return it?wearableLayer(`wear-${kind}-${it.brand||'S'}-v2.png`,cls):''}
function headwearLayer(){const it=loadoutItem('testa');if(!it)return '';const base=itemBase(it),kind=base==='cappelloLana'?'hat-wool':base==='rete'?'head-net':'hat-sun';return brandedLayer(kind,it,'wear-head')}
function characterAvatar(){const pack=loadoutItem('zaino'),shoe=loadoutItem('scarpe'),shell=loadoutItem('guscio'),pile=loadoutItem('pile'),pants=loadoutItem('pantaloni'),gaiters=loadoutItem('ghette'),gloves=loadoutItem('guanti'),poles=loadoutItem('bastoncini'),packKind=pack&&itemBase(pack)==='zainoUL'?'pack-ul':'pack-classic',shoeBase=shoe&&itemBase(shoe),shoeKind=shoeBase==='scarponi'?'shoe-boot':shoeBase==='trail'?'shoe-trail':'shoe-low';return `<div class="character-avatar"><span class="character-front pg-${esc(H.pg)}"></span>${brandedLayer(shoeKind,shoe,'wear-shoes')}${brandedLayer('pants',pants,'wear-pants')}${brandedLayer('gaiters',gaiters,'wear-gaiters')}${shell?'':brandedLayer('pile',pile,'wear-pile')}${brandedLayer('shell',shell,'wear-shell')}${brandedLayer(packKind,pack,'wear-pack')}${brandedLayer('poles',poles,'wear-poles')}${brandedLayer('gloves',gloves,'wear-gloves')}${headwearLayer()}</div>`}
function characterScreen(){eqInit();initLoadout();const tab=H.charTab||'equip';if(tab==='abilita')return characterSkills();const selected=H.inspectItem&&H.owned.has(H.inspectItem)?H.inspectItem:(Object.values(H.loadout)[0]||[...H.owned][0]);H.inspectItem=selected;
 const primary=GEAR_SLOTS.slice(0,12).map(([slot,label])=>{const id=H.loadout[slot],it=ITEM_BY[id];return `<button class="equipment-slot ${id?'filled':''}" onclick="${id?`inspectGear('${id}')`:`document.querySelector('.wardrobe-card')?.focus()`}"><span>${id?gearSvg(id,42):'＋'}</span><small>${esc(label)}</small><b>${it?esc(it.model||it.name):'Vuoto'}</b></button>`}).join('');
 const wardrobe=[...H.owned].map(id=>ITEM_BY[id]).filter(Boolean).sort((a,b)=>itemSlot(a).localeCompare(itemSlot(b))||itPrice(b.id)-itPrice(a.id));
 return `${homeCompactHeader('Personaggio')}<main class="character-page">${characterTabs('equip')}<section class="character-board"><div class="equipment-slots">${primary}</div><div class="character-center" role="img" aria-label="${esc(pgName())}, equipaggiamento indossato">${characterAvatar()}<h2>${esc(pgName())}</h2><p>Livello ${lvl()} · ${Object.keys(H.loadout).length} slot preparati</p></div></section>${gearDetail(selected)}<section class="wardrobe"><div class="section-title"><small>ARMADIO</small><h2>Il tuo materiale</h2><span>${wardrobe.length} oggetti</span></div><div class="wardrobe-grid">${wardrobe.map(it=>{const slot=itemSlot(it),on=H.loadout[slot]===it.id,c=cond(it.id);return `<button class="wardrobe-card ${on?'on':''} ${c<=.33?'worn':''}" onclick="inspectGear('${it.id}')">${gearSvg(it.id,66)}<span><b>${esc(it.model||it.name)}</b><small>${esc((slotDef(slot)||[,'Oggetto'])[1])} · ${Math.round(c*100)}%</small></span>${on?'<em>IN USO</em>':''}</button>`}).join('')}</div></section></main>`}
function characterTabs(active){return `<nav class="character-tabs"><button class="${active==='equip'?'on':''}" onclick="setCharTab('equip')">EQUIPAGGIAMENTO</button><button class="${active==='abilita'?'on':''}" onclick="setCharTab('abilita')">ABILITÀ ${H.punti?`<b>${H.punti}</b>`:''}</button></nav>`}
function characterSkills(){return `${homeCompactHeader('Personaggio')}<main class="character-page">${characterTabs('abilita')}<section class="skill-hero"><small>PROGRESSIONE</small><h2>Competenze sul sentiero</h2><p>Ogni 100 punti esperienza ottieni un punto. Disponibili: <b>${H.punti}</b>.</p></section><div class="skill-tree">${Object.entries(ABIL).map(([k,v],i)=>`<article class="skill-branch skill-${i}"><span class="skill-glyph">${['ϟ','⌖','▲','✦'][i]}</span><div><h3>${v}</h3><p>${ABIL_NOTE[k]}</p><div class="skill-pips">${Array.from({length:5},(_,n)=>`<i class="${n<H.abil[k]?'on':''}"></i>`).join('')}</div></div><button ${H.punti<1||H.abil[k]>=5?'disabled':''} onclick="spendPoint('${k}')">${H.abil[k]>=5?'MAX':'+1'}</button></article>`).join('')}</div></main>`}

const SHOP_SECTIONS=[
 ['Zaini',['zainoClassico','zainoUL']],['Sonno',['saccoPiuma','saccoSint','quiltPiuma','quiltSint','matGonfiabile','matSchiuma']],['Calzature',['trail','basse','scarponi','ghette','sandali']],['Pantaloni',['pantaloni']],['Abbigliamento',['guscio','pile','rete','cappello','cappelloLana','guanti']],['Campo',['tenda','fornello','filtro']],['Tecnica',['bastoncini','mappa','orologio','faro','kit','carte']]
];
function shopItems(cat){const bases=(SHOP_SECTIONS.find(s=>s[0]===cat)||SHOP_SECTIONS[0])[1];return ITEMS.filter(it=>it.brand&&bases.includes(itemBase(it))).sort((a,b)=>bases.indexOf(itemBase(a))-bases.indexOf(itemBase(b)))}
function setShopCat(cat){H.shopCat=cat;H.shopItem=null;save();render()}
function inspectShop(id){H.shopItem=id;save();render()}
function shopAction(it){const own=H.owned.has(it.id),p=price(it.id),lock=(it.lvl||0)>lvl(),ord=H.ordini.find(o=>o.id===it.id),avail=it.brand==='D'||H.stock.includes(it.id);if(own)return `<div class="shop-actions">${H.wear[it.id]>0?`<button class="btn mini" ${H.soldi<repairCost(it.id)?'disabled':''} onclick="repairItem('${it.id}')">Ripara · ${repairCost(it.id)} €</button>`:''}<button class="btn mini quiet" onclick="sellItem('${it.id}')">Vendi · ${sellValue(it.id)} €</button></div>`;if(ord)return `<p class="shop-state">IN ARRIVO TRA ${ord.m} ${ord.m===1?'MESE':'MESI'}</p>`;if(lock)return `<p class="shop-state">SI SBLOCCA AL LIVELLO ${it.lvl}</p>`;if(!avail)return '<p class="shop-state">ESAURITO QUESTO MESE</p>';return `<button class="btn character-equip" ${H.soldi<p?'disabled':''} onclick="buyItem('${it.id}')">${it.brand==='D'?'Ordina':'Compra'} · ${p} €</button>`}
function storeScreen(){eqInit();const cat=H.shopCat&&SHOP_SECTIONS.some(s=>s[0]===H.shopCat)?H.shopCat:SHOP_SECTIONS[0][0],items=shopItems(cat),selected=H.shopItem&&items.some(it=>it.id===H.shopItem)?H.shopItem:(items.find(it=>H.owned.has(it.id))||items[0]).id;H.shopCat=cat;H.shopItem=selected;
 const shelf=items.map(it=>{const own=H.owned.has(it.id),avail=it.brand==='D'||H.stock.includes(it.id),lock=(it.lvl||0)>lvl(),type=(slotDef(itemSlot(it))||[,'Oggetto'])[1];return `<button class="shop-card ${it.id===selected?'on':''} ${(!avail||lock)&&!own?'unavailable':''}" onclick="inspectShop('${it.id}')"><span class="shop-card-art">${gearSvg(it.id,92)}</span><small>${esc(type)} · ${esc(BRANDS[it.brand].name)}</small><b>${esc(it.model)}</b><em>${own?`${Math.round(cond(it.id)*100)}% · NELL'ARMADIO`:lock?`LIVELLO ${it.lvl}`:avail?`${price(it.id)} €`:'ESAURITO'}</em></button>`}).join('');
 return `${homeHdr('negozio','Emporio del sentiero',H.sconto?`SALDI −${H.sconto}%`:`LIVELLO ${lvl()}`)}<main class="shop-page"><button class="shop-back" onclick="H.screen='casa';H.esitoNeg=null;render()">‹ <span>Torna a casa</span></button>${H.esitoNeg?`<div class="out">${esc(H.esitoNeg)}</div>`:''}<nav class="shop-categories">${SHOP_SECTIONS.map(([name])=>`<button class="${name===cat?'on':''}" onclick="setShopCat('${name}')">${name}</button>`).join('')}</nav><section class="shop-intro"><small>ASSORTIMENTO DEL MESE</small><h2>${esc(cat)}</h2><p>Prova, confronta, poi scegli. Il materiale già tuo può essere riparato o rivenduto.</p></section><div class="shop-shelf">${shelf}</div>${gearDetail(selected,'shop')}<details class="brand-book"><summary>Conosci i quattro marchi</summary>${Object.entries(BRANDS).map(([k,b])=>`<div class="brand-rule">${brandLogo(k,46)}<p><b style="color:${b.color}">${esc(b.name)}</b>: ${esc(b.rule)}</p></div>`).join('')}</details></main>`}

/* schermate di casa */
let lastHome=null;
function pickPg(k){H.pg=k;save();render()}
function beginGame(){const input=$('#nome'),name=((input&&input.value)||H.nome||'').trim();
 if(!name){if(input){input.focus();input.setCustomValidity('Scrivi il nome del personaggio.');input.reportValidity();input.setCustomValidity('')}return}
 H.nome=name;H.screen='casa';save();render()}
function homeOptionMeta(o){const f=o.f||{},parts=[];for(const [k,label] of [['soldi','€'],['ferie',' ferie'],['forma',' forma'],['voglia',' voglia'],['xp',' esperienza']])if(f[k])parts.push(`${f[k]>0?'+':''}${f[k]}${label}`);if(o.cost)parts.push(`−${o.cost} €`);if(o.giftRandom)parts.push('regalo a sorpresa');if(o.repairRandom)parts.push('riparazione');if(o.scorteRandom)parts.push('scorte a sorpresa');return parts.join(' · ')||'nessun costo immediato'}
function homeCardPortrait(c){if(CARD_PORTRAIT[c.id])return CARD_PORTRAIT[c.id];const people=['marta','paolo','giulia','gatto','capo','negoziante'];return people[[...c.id].reduce((n,ch)=>n+ch.charCodeAt(0),0)%people.length]}
const baseRender=render;
render=function(){const a=$('#app');
 stopStageDiorama();
 updatePaperWear();
 if(H&&H.screen){a.classList.add('flush');let html='';
  const st=(v,l,low)=>`<div class="stat ${low?'low':''}"><b>${v}</b><span>${l}</span></div>`;
  const top=homeCompactHeader(`${MONTHS[H.mese-1]}, anno ${H.anno}`);
  if(H.screen==='intro'){H.pg=H.pg||'marco';if(H.nome==null)H.nome='';
   html=`<h1>${esc(GAME_CONFIG.name)}</h1><p class="sub">Prototipo · versione ${VERSION}</p>
   <div class="card"><p>Hai un lavoro, uno stipendio e un sogno: la Via delle Renne, in Lapponia. I rifugi aprono da giugno a settembre.</p></div>
   <h3>Chi sei?</h3><div class="pgpick">${Object.entries(PG).map(([k,p])=>`<button class="pgcard ${H.pg===k?'on':''}" onclick="pickPg('${k}')" aria-label="Scegli ${esc(p.label)}" aria-pressed="${H.pg===k}">${portraitSvg('pg_'+k,120,130)}</button>`).join('')}</div>
   <label class="namefield">Come ti chiamano lungo il cammino?<input id="nome" type="text" maxlength="18" required autocomplete="nickname" placeholder="Scrivi il tuo nome" value="${esc(H.nome)}" oninput="H.nome=this.value"></label>
   <button class="btn primary" onclick="beginGame()">Comincia ad aprile</button>`}
  else if(H.screen==='casa'){const ok=inSeason();eqInit();
   html=homeHdr(H.scena||'ufficio',`${MONTHS[H.mese-1]}, anno ${H.anno}`,`LIVELLO ${lvl()}`)+`<section class="home-paper"><div class="home-status"><span>${esc(HOME_LABEL[H.scena||'ufficio'])}</span><b>${H.completati} ${H.completati===1?'cammino':'cammini'}</b></div><p class="note">${formaTxt()} ${vogliaTxt()}</p>`+(H.esito?`<div class="out">${esc(H.esito)}</div>`:'')+`
   <div class="tiles">
    <button class="tile ${ok?'go':''}" ${ok?'':'disabled'} onclick="prepareTrek()"><b>Parti</b><span>${ok?(H.ferie<TREK_DAYS?'poche ferie: '+H.ferie+' giorni':'la Via delle Renne'):'da giugno a settembre'}</span></button>
    <button class="tile" onclick="H.screen='negozio';render()"><b>Negozio</b><span>${H.sconto?'saldi −'+H.sconto+'%':'compra, ripara, vendi'}</span></button>
    <button class="tile" onclick="H.screen='personaggio';H.charTab='equip';render()"><b>Personaggio</b><span>${H.punti?H.punti+' punti da spendere':'equipaggiamento e abilità'}</span></button>
    <button class="tile" onclick="H.screen='diario';render()"><b>Taccuino</b><span>timbri e storia</span></button>
   </div>
   <h3>Come vivi questo mese?</h3>
   <div class="plans">${Object.entries(PLANS).map(([k,p])=>`<button class="plan" onclick="H.esito=null;liveMonth('${k}')"><b>${p.l}</b><span>${p.soldi>=0?'+':''}${p.soldi} € · forma ${p.forma>=0?'+':''}${p.forma} · voglia ${p.voglia>=0?'+':''}${p.voglia}</span></button>`).join('')}</div>
   <p class="ver">versione ${VERSION}</p></section>`}
  else if(H.screen==='diario'){eqInit();
   html=top+`<button class="btn" onclick="H.screen='casa';render()">Torna a casa</button>
   <div class="card diary-cover"><small>TACCUINO DI ${esc(pgName().toUpperCase())}</small><h2>Ricordi dalla Via delle Renne</h2><p>${H.completati} cammini · ${H.vette} vette · ${H.xp} punti esperienza</p></div>
   <div class="card"><h3>Timbri</h3><p>${H.timbri.length?H.timbri.map(t=>`<span class="stamp">${esc(t)}</span>`).join(''):'<span class="sub">La prima pagina aspetta ancora il suo timbro.</span>'}</p></div>
   ${H.storia.length?`<details class="log"><summary>Storia</summary><ul>${H.storia.slice(0,40).map(l=>`<li>${esc(l)}</li>`).join('')}</ul></details>`:''}
   <button class="btn" onclick="if(confirm('Ricominciare da capo? Perderai tutti i progressi.')){H=newHome();H.screen='intro';save();render()}">Ricomincia da capo</button>
   <p class="ver">${esc(pgName())} · versione ${VERSION}</p>`}
  else if(H.screen==='carta'){const c=H.carta;
   html=top+H.cartaMsg.map(m=>`<p class="note">${esc(m)}</p>`).join('')+`<div class="card home-event-card">${tapedCard(homeCardPortrait(c),190,196,'ritratto grande')}<small>— VITA A CASA</small><h2>${esc(c.title)}</h2><p>${esc(c.text)}</p>${c.o.map((o,i)=>`<button class="home-event-choice" ${o.cost&&H.soldi<o.cost?'disabled':''} onclick="chooseCard(${i})"><span><b>${esc(o.l)}</b><small>${esc(homeOptionMeta(o))}</small></span><strong>→</strong></button>`).join('')}</div>`}
  else if(H.screen==='negozio'){html=pdefs()+storeScreen()}
  else if(H.screen==='personaggio'||H.screen==='abilita'){if(H.screen==='abilita')H.charTab='abilita';H.screen='personaggio';html=pdefs()+characterScreen()}
  else if(H.screen==='ritorno'){const r=H.ritorno;
   html=homeHdr('ritorno','Di nuovo a casa',r.completo?'DIARIO PIENO':'RITORNO')+`<section class="home-paper"><p>${esc(r.fine)}</p><div class="card">
   <p>Esperienza guadagnata: ${r.xp}.${r.up?` <b>Sali di livello!</b> Hai ${H.punti} punti abilità da spendere.`:''}</p>
   ${r.timbri.length?`<p>Nuovi timbri: ${r.timbri.map(t=>`<span class="stamp">${esc(t)}</span>`).join('')}</p>`:'<p class="sub">Nessun timbro nuovo.</p>'}
   ${r.usura&&r.usura.length?`<div class="out">${r.usura.map(esc).join('<br>')}</div>`:''}${r.lost.length?`<p class="sub">Perso lungo il cammino: ${esc(r.lost.join(', '))}.</p>`:''}${r.gained.length?`<p class="sub">Trovato lungo il cammino: ${esc(r.gained.join(', '))}.</p>`:''}
    <p class="sub">Il cammino ti ha rimesso in forma. ${r.completo?'E la voglia di partire è alle stelle.':'La voglia di riprovarci resta.'}</p><p class="sub">Seed della partita: ${r.seed}.</p></div>
   <button class="btn primary" onclick="H.screen='casa';H.esito=null;save();render()">Torna alla vita di tutti i giorni</button></section>`}
  a.innerHTML=`<div class="home-ui home-${H.screen}">${html}</div>`;if(H.screen!==lastHome)window.scrollTo(0,0);lastHome=H.screen;return}
 lastHome=null;
 baseRender();positionTrekMap();mountStageDiorama();
 if(S.screen==='zaino')homeZainoPatch(a);
 if(S.screen==='fine'){const b=a.querySelector('.btn.primary');if(b){b.textContent='Torna a casa';b.onclick=goHome}}
};
/* zaino: solo quello che possiedi; le scorte si comprano partendo */
function homeZainoPatch(a){
 a.insertAdjacentHTML('afterbegin',pdefs());a.querySelectorAll('label.item').forEach(l=>{const inp=l.querySelector('input');const m=(inp.getAttribute('onchange')||'').match(/'(\w+)'/);if(m&&!H.owned.has(m[1]))l.remove();else if(m&&ITEM_BY[m[1]]&&ITEM_BY[m[1]].dur<9999){const c=cond(m[1]);const sm=document.createElement('small');sm.textContent=`${condLabel(c)} ${Math.round(c*100)}%`+(c<=0?' · non serve a niente':c<=0.33?' · rende meno':'');const sp=l.querySelector('span');if(sp)sp.appendChild(sm)}if(m&&H.owned.has(m[1])){const g=gearSvg(m[1],46);if(g){const inp2=l.querySelector('input');inp2.insertAdjacentHTML('afterend',g)}}});
 a.querySelectorAll('.qrow').forEach(r=>{const btns=r.querySelectorAll('button');if(btns.length===2){const m=btns[0].getAttribute('onclick').match(/'(\w+)'/);if(m){const id=m[1];btns[0].setAttribute('onclick',`packQty('${id}',-1)`);btns[1].setAttribute('onclick',`packQty('${id}',1)`);const sm=r.querySelector('small');if(sm)sm.textContent+=` · a casa ne hai ${H.scorte[id]||0}, altre a ${CPRICE[id]} €`}}});
 const go=[...a.querySelectorAll('.btn.primary')].pop();if(go){go.setAttribute('onclick','homeDepart()');go.textContent=`Parti · ${S.soldi} € nel portafoglio`}
 const lead=a.querySelector('.pack-lead');if(lead)lead.insertAdjacentHTML('beforebegin',`${att('cucina')>=1&&inv('gas')<1?'<div class="out bad">Hai il fornello ma niente gas: le cene saranno fredde. Aggiungi qualche carica di gas.</div>':''}<p class="note">${formaTxt()} ${vogliaTxt()}</p><button class="btn pack-back" onclick="H.soldi=S.soldi;H.screen='casa';save();render()">← Rimanda la partenza</button><p class="sub">Puoi portare solo quello che possiedi. Le scorte che non hai a casa le compri ora.</p>`)}
H=load();
if(!H){H=newHome();H.screen='intro'}
if(H.trekking){H.trekking=false;H.screen='casa';H.esito='Il cammino interrotto a metà non è stato salvato: sei tornato a casa.'}
if(!H.screen)H.screen='casa';
S=newState();render();
/* =========== ATTREZZATURA: usura, qualità, marchi, negozio =========== */
function eqInit(){H.wear=H.wear||{};H.qual=H.qual||{};H.known=H.known||{};H.warr=H.warr||{};H.ordini=H.ordini||[];if(!H.stock)rollStock();
 if(!H.catalogo){H.catalogo=true;if([...H.owned].every(id=>!ITEM_BY[id]||!ITEM_BY[id].brand)&&H.completati===0&&H.xp===0){H.owned=new Set(['sGita','sRifugio','sZigzag','sCresta','sPile','sCappello'])}}}
function itPrice(id){const it=ITEM_BY[id];return it&&it.price!=null?it.price:(PRICE[id]||0)}
function cond(id){const it=ITEM_BY[id];if(!it||!it.dur||it.dur>=9999)return 1;const d=it.dur*(H.qual[id]==='difetto'?0.5:1);return Math.max(0,1-(H.wear[id]||0)/d)}
function condLabel(c){return c<=0?'rotto':c<=0.33?'consumato':c<=0.66?'usato':'nuovo'}
function effAttrs(id){const it=ITEM_BY[id];if(!it||!it.a)return {};let a={...it.a};const ks=Object.keys(a).sort((x,y)=>a[y]-a[x]);
 if(H.qual[id]==='difetto'&&ks[0])a[ks[0]]=Math.max(0,a[ks[0]]-1);if(H.qual[id]==='gioiello'&&ks[0])a[ks[0]]=Math.min(3,a[ks[0]]+1);
 const c=cond(id);if(c<=0)return {};if(c<=0.33)for(const k in a)a[k]=Math.max(0,a[k]-1);return a}
function rollStock(){H.stock=ITEMS.filter(i=>i.brand).filter(i=>i.brand==='S'||i.brand==='D'||(i.brand==='Sh'&&chance(0.7))||(i.brand==='A'&&chance(0.6))).map(i=>i.id)}
function price(id){return Math.round(itPrice(id)*(1-H.sconto/100))}
function buyItem(id){eqInit();const it=ITEM_BY[id];if(!it||H.owned.has(id)||H.soldi<price(id)||(it.lvl||0)>lvl())return;
 if(it.brand!=='D'&&!H.stock.includes(id))return;if(H.ordini.some(o=>o.id===id))return;
 H.soldi-=price(id);
 if(it.brand==='D'){H.ordini.push({id,m:3});H.esitoNeg=`Ordinato: ${it.name}. Arriverà tra tre mesi.`}
 else{H.owned.add(id);H.wear[id]=0;delete H.warr[id];if(it.brand==='Sh'){const r=rnd();H.qual[id]=r<0.18?'difetto':r<0.28?'gioiello':'normale';H.known[id]=false}
  H.esitoNeg=`Comprato: ${it.name}.`}
 save();render()}
function sellValue(id){const it=ITEM_BY[id];const base=itPrice(id)*(it&&it.brand==='A'?0.65:0.5);return Math.round(base*Math.max(0.15,cond(id)))}
function sellItem(id){eqInit();if(!H.owned.has(id))return;H.soldi+=sellValue(id);H.owned.delete(id);delete H.wear[id];for(const slot in H.loadout)if(H.loadout[slot]===id)delete H.loadout[slot];if(H.inspectItem===id)H.inspectItem=null;H.esitoNeg=`Venduto: ${ITEM_BY[id]?ITEM_BY[id].name:id}.`;save();render()}
function repairCost(id){const it=ITEM_BY[id];return Math.max(5,Math.round(itPrice(id)*(it&&it.brand==='D'?0.15:0.3)))}
function repairItem(id){eqInit();const it=ITEM_BY[id];if(!it||!H.wear[id]||H.soldi<repairCost(id))return;H.soldi-=repairCost(id);H.wear[id]=Math.max(0,H.wear[id]-0.6*it.dur);H.esitoNeg=`Riparato: ${it.name}.`;save();render()}
function prepareTrek(){eqInit();initLoadout();S=newState();S.mese=SEASON[H.mese];S.kit=new Set();
 Object.values(H.loadout).forEach(id=>{if(H.owned.has(id)&&cond(id)>0)S.kit.add(id)});
 S.eff={};H.owned.forEach(id=>S.eff[id]=effAttrs(id));
 for(const k in S.inv)if(k!=='batteria')S.inv[k]=Math.min(H.scorte[k]||0,{pasti:3,barrette:4,gas:4,cerotti:3,repellente:2,calze:1,powerbank:1}[k]);
 S.soldi=H.soldi;S.ferie=H.ferie;S.morale=startMorale();S.screen='zaino';H.screen=null;render()}
/* dopo il cammino: chilometri sugli oggetti, garanzia, qualità scoperta */
function wearAfterTrek(km){eqInit();const notes=[];
 S.kit.forEach(id=>{const it=ITEM_BY[id];if(!it||!it.dur||it.dur>=9999||!H.owned.has(id))return;const before=cond(id);H.wear[id]=(H.wear[id]||0)+km;const after=cond(id);
  if(it.brand==='Sh'&&!H.known[id]){H.known[id]=true;if(H.qual[id]==='difetto')notes.push(`${it.name}: era un esemplare difettoso, si consuma il doppio e rende meno.`);else if(H.qual[id]==='gioiello')notes.push(`${it.name}: ti è capitato un esemplare eccellente!`)}
  if(after<=0&&before>0){if(it.brand==='A'&&!H.warr[id]){H.wear[id]=0;H.warr[id]=true;notes.push(`${it.name} si è rotto: la garanzia Alvenheim lo sostituisce gratis.`)}else notes.push(`${it.name} è rotto: va riparato o ricomprato.`)}
  else if(condLabel(after)!==condLabel(before))notes.push(`${it.name} ora è ${condLabel(after)}.`)});
 return notes}
