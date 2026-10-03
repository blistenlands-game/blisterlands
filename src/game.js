/* =========== MOTORE =========== */
const wv=w=>typeof w==='function'?w():w;
function opts(ev){return ev.o.filter(op=>!op.when||op.when())}
function riskOf(op){let t=0,b=0;op.out.forEach(x=>{const w=Math.max(0,wv(x.w));t+=w;if(x.t==='b')b+=w;else if(x.t==='m')b+=w*0.35});const p=t?b/t:0;
 if(op.out.length<2||p<0.08)return null;return p<0.25?['Rischio basso','r0']:p<0.5?['Rischio medio','r1']:['Rischio alto','r2']}
function speed(){let v=2.4;const kg=packKg();v-=Math.max(0,kg-9)*0.12;
 v+=0.15*att('asciugatura')-0.05*att('caviglia')+0.075*att('appoggio');
 if(S.energia<30)v*=0.75;if(S.stati.has('vesciche'))v*=0.85;if(S.stati.has('storta'))v*=1-0.2/(1+att('caviglia')*0.3);if(S.stati.has('ginocchio'))v*=0.88;if(S.stati.has('bagnati'))v*=0.95;if(S.flags.zaino)v+=0.1;
 return Math.max(1.4,v)}
function energyCost(km){let c=km*(2.5+Math.max(0,packKg()-7)*(0.3-0.045*att('portanza')));c*=1+0.15*(S.fame||0);if(typeof H!=='undefined'&&H)c*=(1.35-0.6*H.forma/100)*(1-0.05*H.abil.resistenza);
 c*=1-0.06*att('appoggio');if(S.stati.has('vesciche'))c*=1.15;if(S.stati.has('malessere'))c*=1.2;if(S.stati.has('freddo'))c*=1.1;if(S.stati.has('scottato'))c*=1.05;return c}
/* effetti passivi a ogni tratto, graduati sulle caratteristiche dell'equipaggiamento */
function passive(){const m0=S.morale;const N=passiveCore();if(typeof H!=='undefined'&&H&&S.morale<m0)S.morale=clamp(m0-(m0-S.morale)*(1-0.08*H.abil.adattamento),0,100);return N}
function passiveCore(){const N=[];const imp=att('impermeabile'),cal=att('calore'),av=att('antivento');
 if(S.wx==='pioggia'){
  S.morale-=Math.max(1,6-2*imp);if(imp<1){N.push('La pioggia ti entra nelle ossa.');if(chance(0.5))S.stati.add('freddo')}
  if(!S.stati.has('bagnati')){let p=0.45*(1-0.22*att('piediAsciutti'))*(S.mese==='giugno'?1.2:1);if(att('fango')>=2)p*=0.35;if(chance(p)){S.stati.add('bagnati');N.push('L\'acqua è arrivata ai calzini.')}}
 }else if(S.stati.has('bagnati')&&chance([0.05,0.1,0.25,0.45][att('asciugatura')])){S.stati.delete('bagnati');N.push('Le scarpe si sono asciugate camminando.')}
 if((S.wx==='sole'||S.wx==='nuvole')&&!S.flags.repel){const ins=att('antinsetti'),mi=MESI[S.mese].insetti;if(ins<3){S.morale-=Math.max(0,4-ins*1.5)*mi;if(ins<2&&mi>0.5)N.push('Le zanzare non ti mollano.')}}
 if(S.mese==='settembre'&&(S.wx==='vento'||S.wx==='nebbia'||S.clock>1080)&&att('calore')<1&&chance(0.25))S.stati.add('freddo');
 if(has('orologio')&&S.bat.orologio>0){S.bat.orologio=Math.max(0,S.bat.orologio-4);if(S.bat.orologio===0)N.push('L\'orologio GPS si è spento: batteria finita.')}
 if(has('faro')&&S.bat.faro>0){S.bat.faro=Math.max(0,S.bat.faro-2);if(S.bat.faro===0)N.push('Il faro satellitare si è spento.')}
 S.inv.batteria=Math.max(0,inv('batteria')-1);
 if(S.wx==='sole'&&S.clock>720&&!S.stati.has('scottato')&&chance(0.15*(1-0.4*att('ombra')))){S.stati.add('scottato');N.push('Il sole ti ha bruciato il collo.')}
 if(S.wx==='vento'&&av<2){S.morale-=3-av;if(chance(0.3-0.1*av))S.stati.add('freddo')}
 if(S.stati.has('freddo')){S.morale-=3;if(chance(0.25*cal)){S.stati.delete('freddo');N.push('Gli strati caldi ti rimettono in temperatura.')}}
 if(S.stati.has('vesciche'))S.morale-=4;
 if(S.fame>=2){S.morale-=S.fame;if(chance(0.4))N.push(S.fame>=3?'La fame ti svuota: ogni passo costa il doppio.':'Lo stomaco brontola. Le gambe sono più pesanti.')}
 if(att('portanza')<2&&packKg()>9){S.morale-=2;if(chance(0.3))N.push('Lo zaino senza telaio ti sega le spalle.')}
 if(S.wx==='sole')S.morale+=2;
 S.morale=clamp(S.morale-0.5,0,100);
 let hp=0.04+0.025*att('caviglia');if(S.flags.trucco)hp*=0.5;if(S.stati.has('bagnati'))hp*=3;if(packKg()>11)hp*=1.5;
 if(!S.stati.has('vesciche')&&!S.used.has('hotspot'+S.tappa)&&chance(hp))S.force='hotspot';
 return N}
function processLater(){const due=S.later.filter(l=>l.at<=S.gseg);S.later=S.later.filter(l=>l.at>S.gseg);
 return due.map(l=>{fx(l.fx);S.log.unshift(l.txt);return l.txt})}
function eligible(e,t){const c=C();return !e.forced&&!e.first&&!S.used.has(e.id)&&(!e.tappe||e.tappe.includes(t.n))&&(!e.ter||e.ter.includes(c.ter))&&(!e.need||S.mem.has(e.need))&&(!e.when||e.when())}
function draw(){const t=TAPPE[S.tappa];
 if(S.force){const e=EV.find(x=>x.id===S.force);if(S.force==='hotspot')S.used.add('hotspot'+S.tappa);S.force=null;return e}
 const pool=EV.filter(e=>eligible(e,t));if(!pool.length)return null;
 const w={};pool.forEach(e=>w[e.id]=e.w?e.w():2);const id=pickW(w);return pool.find(e=>e.id===id)}
function sosTxt(){return devOn('faro')?' Col faro satellitare chiami i soccorsi: arrivano in un\'ora e non perdi altri giorni.':''}
function fail(){
 if(S.energia<=0){S.endKind='energia';S.end='Crolli dalla stanchezza. Il cammino finisce qui.'+sosTxt();S.screen='fine';return true}
 if(S.morale<=0){S.endKind='morale';S.end='Non ne puoi più. Il cammino finisce qui.'+sosTxt();S.screen='fine';return true}
 return false}
function startTappa(){if(traitOn('tasche'))fx({e:3});if(traitOn('sedile'))fx({m:3});S.seg=0;S.clock=S.start;S.flags={};S.notes=[];S.outcome=null;S.walking=false;S.screen='tappa';
 const t=TAPPE[S.tappa];const starts=EV.filter(e=>e.first&&e.tappe.includes(t.n)&&!S.used.has(e.id));
 if(starts.length&&chance(0.5)){const f=starts[Math.floor(rnd()*starts.length)];S.used.add(f.id);S.clock+=f.pre||0;S.current=f;render()}
 else{S.current=null;step()}}
let walkTimer=null;
function step(){const t=TAPPE[S.tappa];if(S.seg>=t.terr.length)return arrive();
 const km=t.km/t.terr.length;S.clock+=km/speed()*60;S.energia=clamp(S.energia-energyCost(km),0,100);
 S.seg++;S.gseg++;S.notes=[...processLater(),...passive()];S.outcome=null;
 if(t.extra&&S.seg===5&&!S.flags.rinuncia&&!S.used.has('vettaCima'))S.force='vettaCima';
 if(t.n===3&&S.seg===4&&!S.used.has('traversataLago'))S.force='traversataLago';
 if(t.extra&&S.seg===6&&!S.used.has('vettaRitorno'))S.force='vettaRitorno';
 if(fail())return render();
 S.current=S.force?draw():(chance(0.1)?null:draw());S.walking=true;
 if(!S.current)S.notes.push(QUIET[Math.floor(rnd()*QUIET.length)]);
 render();clearTimeout(walkTimer);walkTimer=setTimeout(()=>{if(S&&S.screen==='tappa'&&S.walking){S.walking=false;render()}},1800)}
/* variazione: gli stessi effetti non sono mai identici */
function vary(f){const g=Object.assign({},f);
 ['e','m'].forEach(k=>{if(g[k])g[k]=Math.round(g[k]*(0.6+rnd()*0.8))||Math.sign(g[k])});
 if(g.min)g.min=Math.round(g.min*(0.75+rnd()*0.5));return g}
/* imprevisti di contorno: piccole svolte che rendono diverse anche le scelte uguali */
const TWISTS=[
 {t:'g',txt:'Lungo la strada trovi una barretta dimenticata su un sasso.',f:{give:{barrette:1}}},
 {t:'g',txt:'Le gambe girano da sole: hai trovato il ritmo.',f:{e:4}},
 {t:'g',when:()=>S.wx!=='pioggia',txt:'Un raggio di sole ti scalda la schiena.',f:{m:3}},
 {t:'g',txt:'Un uccellino ti accompagna saltando di sasso in sasso.',f:{m:3}},
 {t:'g',txt:'Chi incroci ti dice che il rifugio non è lontano.',f:{m:3}},
 {t:'g',when:()=>S.stati.has('bagnati')&&S.wx!=='pioggia',txt:'Il vento ti asciuga piedi e calze.',f:{rm:['bagnati']}},
 {t:'g',txt:'In fondo alla tasca ritrovi un cerotto che credevi finito.',f:{give:{cerotti:1}}},
 {t:'g',txt:'Una sorgente proprio lì accanto: bevi a sazietà.',f:{e:3}},
 {t:'g',txt:'Ti viene in mente una canzone e cammini a tempo.',f:{m:2,min:-5}},
 {t:'g',when:()=>S.stati.has('freddo'),txt:'Il movimento ti rimette in temperatura.',f:{rm:['freddo']}},
 {t:'b',txt:'Intanto un sassolino ti è entrato nella scarpa.',f:{m:-2}},
 {t:'b',txt:'Ti accorgi di averci messo più tempo del previsto.',f:{min:10}},
 {t:'b',when:()=>S.wx==='vento'||S.wx==='nuvole',txt:'Una folata gelida ti fa rabbrividire.',f:{m:-2}},
 {t:'b',when:()=>(S.wx==='sole'||S.wx==='nuvole')&&!(att('antinsetti')>=2),txt:'Gli insetti approfittano della sosta.',f:{m:-2}},
 {t:'b',when:()=>!S.stati.has('vesciche'),txt:'Il tallone comincia a sfregare.',f:{hot:true}},
 {t:'b',txt:'Inciampi su una radice. Niente di grave.',f:{e:-3}},
 {t:'b',txt:'Lo zaino sembra pesare il doppio.',f:{e:-3}},
 {t:'b',when:()=>S.wx==='nuvole',txt:'Pioviggina per qualche minuto.',f:{m:-2}},
 {t:'b',txt:'Ti si slaccia una scarpa nel momento peggiore.',f:{min:3,m:-1}},
 {t:'b',txt:'Ti accorgi di avere una sete tremenda.',f:{e:-3}}
];
function twist(single){if(!chance(single?0.3:0.15))return null;const p=TWISTS.filter(t=>!t.when||t.when());if(!p.length)return null;const t=p[Math.floor(rnd()*p.length)];fx(t.f);if(t.f.hot&&!S.used.has('hotspot'+S.tappa))S.force='hotspot';return t}
function choose(i){const ev=S.current,op=opts(ev)[i];
 useInv(op.use);S.clock+=op.min||0;
 const w={};op.out.forEach((x,k)=>w[k]=Math.max(0.0001,wv(x.w)));const r=op.out[+pickW(w)];
 fx(vary(r.f));const tw=twist(op.out.length<2);if(r.f.gain){S.kit.add(r.f.gain);S.log.unshift('Nuovo: '+ITEMS.find(x=>x.id===r.f.gain).name)}
 if(r.f.lose){const lid=[...S.kit].find(k=>k===r.f.lose||(ITEM_BY[k]&&ITEM_BY[k].base===r.f.lose));if(lid){S.kit.delete(lid);S.log.unshift('Perso: '+ITEM_BY[lid].name)}}
 if(!ev.forced)S.used.add(ev.id);
 const txt=tw?r.txt+' '+tw.txt:r.txt;S.outcome={txt,bad:r.t==='b'&&!(tw&&tw.t==='g')};S.log.unshift(`${hhmm(S.clock)} · ${ev.title}: ${txt}`);
 S.current=null;S.notes=[];if(fail())return render();render()}
function arrive(){if(TAPPE[S.tappa].finale){S.arrive=S.clock;fx({timbro:'Via delle Renne completata',xp:30});S.endKind='completo';S.end=`Arrivi a Njalla alle ${hhmm(S.clock)}. Davanti al chiosco del villaggio ordini un hamburger di renna, ti siedi su una panca e guardi le montagne da cui sei sceso. Hai completato la Via delle Renne.`;S.screen='fine';return render()}
 S.arrive=S.clock;S.screen='sera';S.didSauna=false;S.arrMsg=[];if(TAPPE[S.tappa].n===2&&S.wx==='pioggia')S.arrMsg.push('Il custode guarda la pioggia: «Con questa acqua il lago di domani si alza, e le barche a remi rischiano di andarsene. Domani conviene arrivare in tempo per la barca a motore: parte alle 10, alle 12 e alle 14.»');
 S.full=chance(clamp((S.arrive-960-MESI[S.mese].posti)/180,0,1));
 S.closed=S.mese==='settembre'&&!TAPPE[S.tappa].shop&&chance(0.45);if(S.closed){S.full=true}
 if(!S.flags.pranzo){S.fame=Math.min(4,(S.fame||0)+1)}
 if(S.full&&S.mem.has('coppia')&&S.tappa===1){S.full=false;S.arrMsg.push('Elin e Maks, la coppia a cui avevi dato l\'acqua, ti hanno tenuto un letto.');S.mem.delete('coppia')}
 if(S.mem.has('posta')&&TAPPE[S.tappa].n===2){S.mem.delete('posta');fx({s:15,kg:-1.2,m:5,xp:5});S.arrMsg.push('Consegni il pacchetto. Il custode ti dà 15 euro e un sorriso.')}
 if(S.mem.has('birra')){S.mem.delete('birra');fx({m:8});S.arrMsg.push('Il ragazzo ferito è qui: mantiene la promessa della birra.')}
 if(S.mem.has('amica')){S.mem.delete('amica');fx({m:5});S.arrMsg.push('La ragazza con cui hai camminato ti offre la cena al rifugio.');S.inv.pasti=inv('pasti')+1}
 if(S.mem.has('giacca')){S.mem.delete('giacca');fx({kg:-0.6,s:10,m:6});S.arrMsg.push('La proprietaria della giacca rossa è al rifugio: ti abbraccia e ti offre la cena, 10 euro risparmiati.')}
 if(S.mem.has('portafoglio')){S.mem.delete('portafoglio');fx({s:20,m:8,xp:6});S.arrMsg.push('Il proprietario del portafoglio è al rifugio. Ti dà 20 euro di ricompensa e non smette di ringraziarti.')}
 if(S.mem.has('volontari')){S.mem.delete('volontari');fx({m:5});S.inv.pasti=inv('pasti')+1;S.arrMsg.push('Il custode ha saputo che hai aiutato i volontari: la cena te la offre lui.')}
 if(S.mem.has('libro')){S.mem.delete('libro');fx({m:6});S.arrMsg.push('La sera leggi il libro preso nella capanna. Ti addormenti a metà capitolo.')}
 if(S.mem.has('peluche')){S.mem.delete('peluche');fx({m:10,xp:5});S.arrMsg.push('Al rifugio una bambina vede il coniglio di pezza e corre ad abbracciarlo. I genitori ti offrono il dolce.')}
 if(S.mem.has('cena')){S.mem.delete('cena');fx({m:8,e:4});S.arrMsg.push('La coppia del sentiero ti aspetta a tavola. Serata di racconti.')}
 if(S.mem.has('funghi')){S.mem.delete('funghi');fx({m:8,e:6});S.arrMsg.push('I funghi raccolti diventano una cena che il rifugio non dimenticherà.')}
 if(S.mem.has('funghiSbagliati')){S.mem.delete('funghiSbagliati');fx({m:-8,e:-10});S.arrMsg.push('Il custode guarda i tuoi funghi e scuote la testa: non sono porcini. Per fortuna li ha visti prima che li cucinassi.')}
 if(S.mem.has('aiutato')){S.mem.delete('aiutato');fx({m:6,s:10,kg:0});S.arrMsg.push('Il ragazzo che hai aiutato si è ripreso. Insiste per pagarti la cena: 10 euro risparmiati.')}
 if(S.mem.has('caneRitrovato')){S.mem.delete('caneRitrovato');S.mem.delete('canePerso');fx({m:12,s:15,xp:6});S.arrMsg.push('La famiglia del cane bianco e marrone è al rifugio. Ti abbracciano tutti, il cane per primo. Insistono per pagarti la notte.')}
 if(S.mem.has('zuppa')){S.mem.delete('zuppa');fx({m:8,e:6});S.arrMsg.push('Zuppa di salmerino e torta: valeva la corsa.')}
 if(S.mem.has('cartolina')&&!S.closed){S.mem.delete('cartolina');fx({m:6});S.arrMsg.push('La sera scrivi la cartolina. Il custode la imbuca per te.')}
 if(S.mem.has('raccolto')&&!S.closed){S.mem.delete('raccolto');fx({kg:-0.3,m:3});S.arrMsg.push('Il custode vede i rifiuti che hai raccolto e ti offre il caffè.')}
 const real=nextWx(S.wx);S.forecast={real,shown:S.flags.meteoSicuro||devOn('faro')||chance(S.closed?0.55:0.75)?real:pickW(wxW())};
 render()}
function ricarica(){if(inv('powerbank')<1)return;const o=[['telefono',inv('batteria')]].concat(['orologio','faro'].filter(has).map(d=>[d,S.bat[d]]));o.sort((a,b)=>a[1]-b[1]);const d=o[0][0];S.inv.powerbank--;if(d==='telefono')S.inv.batteria=Math.min(100,inv('batteria')+60);else S.bat[d]=Math.min(100,S.bat[d]+60);S.log.unshift('Powerbank usato per: '+d);render()}
function hutPrice(t){return Math.round((t.hut||HUT)*MESI[S.mese].prezzi)}
function floorPrice(t){return S.closed?0:Math.round((t.floor||FLOOR)*MESI[S.mese].prezzi)}
function forecastWho(morning){if(devOn('faro'))return morning?'Il faro satellitare aveva detto:':'Il faro satellitare dice:';if(S.closed)return morning?'Nessun custode. Guardando il cielo ti era sembrato:':'Nessun custode a cui chiedere. Guardi il cielo e ti sembra:';return morning?'Il custode aveva detto:':'Il custode guarda il cielo:'}
function sauna(){if(S.didSauna)return;S.didSauna=true;fx({m:12,e:6,rm:['freddo','bagnati','scottato']});if(TAPPE[S.tappa].n===5){fx({timbro:'Sauna e torrente',m:S.mem.has('tuffo')?6:0})}S.log.unshift('Sauna e tuffo nel torrente gelato.');render()}
function buy(k,p){if(S.soldi>=p){S.soldi-=p;S.inv[k]=inv(k)+1;render()}}
function sleep(where){const t=TAPPE[S.tappa],m=[];
 S.lastSleep=where;
 if(where==='letto'){fx({s:-hutPrice(t),e:40,m:10,rm:['bagnati','freddo']});S.inv.batteria=100;S.bat.orologio=100;S.bat.faro=100;m.push('Letto vero, stufa accesa, scarpe asciutte al mattino.')}
 else if(where==='pavimento'){fx({s:-floorPrice(t),e:14+4*att('comfort'),m:att('comfort')>=3?3:-1,rm:['freddo']});S.inv.batteria=Math.min(100,inv('batteria')+40);S.bat.orologio=Math.min(100,S.bat.orologio+40);S.bat.faro=Math.min(100,S.bat.faro+40);m.push('Materassino sul pavimento del locale comune. Qualcuno russa.')}
 else{const bad=S.wx==='pioggia'||S.wx==='vento';const cold=(S.mese==='settembre'?3:S.mese==='giugno'?2:1)+(bad?1:0);
  fx({e:(bad?10:18)+4*att('comfort'),m:bad?-4:8});m.push(bad?'Tenda scossa da vento e pioggia. Dormi a tratti.':'Tenda vicino al lago, luce dorata. Dormi bene.');
  if(att('sonno')<cold){fx({e:-8,m:-6});m.push('Nel sacco hai freddo tutta la notte: non è abbastanza caldo per questo tempo.')}
  if(bad&&att('umido')<2&&att('riparo')>=1&&chance(0.4)){fx({e:-6,m:-4});m.push('La condensa della tenda inumidisce la piuma del sacco.')}
  if(S.kit.has('matGonfiabile')&&chance(0.08)){if(att('riparazione')>=1){m.push('Il materassino si è bucato: lo ripari col kit.')}else{fx({e:-10,m:-6});m.push('Il materassino si è bucato: dormi sul duro.')}}
  if(bad&&S.stati.has('bagnati'))m.push('Le scarpe restano fradice.')}
 if(traitOn('lana')){fx({m:2})}
 if(devOn('faro')){fx({m:3});m.push('Col faro mandi il «tutto bene» a casa. Ti rispondono con un cuore.')}
 if(where!=='tenda'&&(att('svago')>=1)){fx({m:6,xp:3});m.push('Una partita a carte con gli altri ospiti.')}
 if(inv('pasti')>0){const hot=(att('cucina')>=1)&&inv('gas')>0;useInv(hot?{pasti:1,gas:1}:{pasti:1});fx({e:hot?12:6,m:hot?6:0});S.fame=Math.max(0,(S.fame||0)-2);m.push(hot?'Cena calda.':att('cucina')>=1?'Cena fredda: hai il fornello, ma niente gas.':'Cena fredda: niente fornello.')}
 else{S.fame=Math.min(4,(S.fame||0)+2);fx({e:-12,m:-12});m.push(S.fame>=3?'Niente da mangiare a cena, di nuovo. Il corpo comincia a consumarsi.':'Niente da mangiare a cena.')}
 if(S.flags.saccoUmido){if(att('umido')>=2){fx({e:-3});m.push('Il sacco è umido, ma il sintetico scalda lo stesso.')}else{fx({e:-12,m:-8});m.push('Il sacco in piuma si è bagnato: è una spugna fredda. Dormi malissimo.')}}
 S.stati.delete('malessere');S.stati.delete('scottato');if(S.stati.has('ginocchio')&&chance(0.4)){S.stati.delete('ginocchio');m.push('Il ginocchio va meglio.')}if(S.stati.has('storta')&&chance(0.5)){S.stati.delete('storta');m.push('La caviglia sta meglio.')}
 if(S.tappa===0&&!S.timbri.includes('Prima notte senza buio')){S.timbri.push(S.mese==='giugno'||S.mese==='luglio'?'Prima notte senza buio':'Prima notte al nord');S.xp+=5}
 S.timbri.push(t.to);fx({xp:10});S.ferie-=1;S.night=m;S.screen='mattino';render()}
const VETTA_XP=85;
function vettaOk(){return (S.xp+(typeof H!=='undefined'&&H?H.xp:0))>=VETTA_XP&&att('aderenza')>=3&&att('calore')>=1&&S.ferie>=2}
function nextIndex(from){let i=from+1;while(i<TAPPE.length&&TAPPE[i].extra)i++;return i}
function nextDay(mode){S.wxHist=S.wxHist||[];S.wxHist.push(S.wx);S.wx=S.forecast.real;
 if(mode==='riposo'){S.ferie-=1;fx({e:30,m:5});S.wxHist.push(S.wx);S.wx=nextWx(S.wx);S.log.unshift('Giorno di riposo.')}
 if(S.ferie<=0){S.endKind='ferie';S.end='Le ferie sono finite prima del traguardo.';S.screen='fine';return render()}
 if(mode==='presto'){S.start=390;fx({e:-8,m:-2})}else if(mode==='tardi'){S.start=570;fx({e:6,m:3})}else S.start=480;
 S.tappa=mode==='vetta'?TAPPE.findIndex(t=>t.extra):nextIndex(S.tappa);
 if(S.tappa>=TAPPE.length){S.end='Fine.';S.screen='fine';return render()}
 startTappa()}

/* =========== INTERFACCIA =========== */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tx=v=>{const s=typeof v==='function'?v():v;return typeof s==='string'?gtxt(s.replace(/\{nome\}/g,typeof pgName==='function'?pgName():'')):s};
function hud(){const st=(v,l,low)=>`<div class="stat ${low?'low':''}"><b>${v}</b><span>${l}</span></div>`;
 return `<div class="hud">${st(hhmm(S.screen==='tappa'?S.clock:S.arrive||S.clock),'Ora',S.screen==='tappa'&&S.clock>960)}${st(Math.round(S.energia),'Energia',S.energia<30)}${st(Math.round(S.morale),'Morale',S.morale<30)}${st(S.ferie,'Ferie',S.ferie<=2)}${st(S.soldi+'€','Soldi',S.soldi<HUT)}</div>
 <div class="top"><span class="wx">${WX[S.wx]}</span><span class="sub">zaino ${packKg().toFixed(1)} kg · passo ${speed().toFixed(1)} km/h</span></div>
 <div class="inv">Pasti ${inv('pasti')} · barrette ${inv('barrette')} · gas ${inv('gas')} · cerotti ${inv('cerotti')} · repellente ${inv('repellente')} · calze ${inv('calze')} · telefono ${inv('batteria')}%${has('orologio')?' · orologio '+S.bat.orologio+'%':''}${has('faro')?' · faro '+S.bat.faro+'%':''} · powerbank ${inv('powerbank')}</div>
 ${S.stati.size||S.fame?`<div class="tags">${[...S.stati].map(s=>`<span class="tag">${STATO[s]}</span>`).join('')}${S.fame?`<span class="tag">${['','Appetito','Affamato','Molto affamato','Sfinito dalla fame'][S.fame]}</span>`:''}</div>`:''}`}
function lab(l){if(!has('mappa')&&devOn('orologio'))return l.replace(/[Mm]appa e bussola/,'Orologio GPS').replace(/sulla tua mappa/,"sull'orologio GPS").replace(/sulla mappa/,"sull'orologio GPS").replace(/la mappa/,"l'orologio GPS").replace(/la bussola/,"l'orologio GPS");return l}
function optMeta(op){const p=[];if(op.min>0)p.push(`+${op.min} min`);if(op.min<0)p.push(`${op.min} min`);
 if(op.use)for(const k in op.use){const c=CONSUM.find(c=>c.id===k);p.push(`usa ${op.use[k]} ${c?c.name.toLowerCase():k}`)}return p.join(' · ')}
function render(){const a=$('#app');a.classList.toggle('flush',(S.screen==='tappa'||S.screen==='sera'||S.screen==='mattino'||S.screen==='fine')&&!(typeof H!=='undefined'&&H&&H.screen));
 if(S.screen==='intro'){
  a.innerHTML=`<h1>${esc(GAME_CONFIG.name)}</h1><p class="sub">Prototipo · La Via delle Renne completa: 7 tappe e la vetta del Gáisi</p>
  <div class="card"><p>Lapponia. Otto giorni di ferie, 220 euro e uno zaino da preparare. Il treno ti lascia a Lavvuby alle 10:30.</p>
  <p>Ogni scelta costa qualcosa, e nessuna ha un esito sicuro. Dopo le 16 i letti dei rifugi iniziano a riempirsi, e la sauna chiude alle 17. Le persone che incontri si ricordano di te.</p></div>
  <div class="card"><h3>In che mese parti?</h3>${Object.entries(MESI).map(([k,v])=>`<button class="btn ${S.mese===k?'primary':''}" onclick="S.mese='${k}';render()">${v.label}<span class="meta" ${S.mese===k?'style="color:#fff"':''}>${esc(v.note)}</span></button>`).join('')}</div>
  <button class="btn primary" onclick="S.screen='zaino';render()">Prepara lo zaino</button>`}
 else if(S.screen==='zaino'){const kg=packKg();
  a.innerHTML=`<h2>Lo zaino</h2><p class="sub">Vestiti, sacco lenzuolo e piccole cose pesano già ${BASE_KG} kg. Il resto lo scegli tu: oltre 7 kg ogni chilo costa energia, meno con uno zaino che porta bene; oltre 9 kg rallenta il passo.</p>
  <div class="weight ${kg>10?'heavy':''}">Peso totale: ${kg.toFixed(1)} kg · passo ${speed().toFixed(1)} km/h</div>${figure()}
  <p class="sub">${Object.keys(ATTR).filter(k=>att(k)>0).map(k=>ATTR[k]+' '+att(k)).join(' · ')||'Nessuna caratteristica'}</p>
  ${SECTIONS.map(([title,g])=>`<h3>${title}</h3><div class="items">${ITEMS.filter(it=>(it.group||null)===g).map(it=>{const radio=!!it.group;return `<label class="item"><input type="${radio?'radio':'checkbox'}" name="${radio?it.group:it.id}" ${S.kit.has(it.id)?'checked':''} onchange="toggleItem('${it.id}')"><span>${esc(it.name)}<small>${esc(it.note)}</small>${it.a&&Object.keys(it.a).length?`<small>${Object.entries(it.a).map(([k,v])=>ATTR[k]+' '+v).join(' · ')}</small>`:''}</span><span class="kg">${it.kg} kg</span></label>`}).join('')}</div>`).join('')}
  <h3>Scorte</h3>${CONSUM.map(c=>`<div class="qrow"><span>${esc(c.name)}<small>${esc(c.note)} · ${c.kg} kg</small></span><span class="qty"><button aria-label="Meno ${esc(c.name)}" onclick="qty('${c.id}',-1)">−</button><b>${inv(c.id)}</b><button aria-label="Più ${esc(c.name)}" onclick="qty('${c.id}',1)">+</button></span></div>`).join('')}
  <button class="btn primary" onclick="depart()">Parti da Lavvuby</button>`}
 else if(S.screen==='tappa'){const t=TAPPE[S.tappa];let body=S.notes.map(n=>`<p class="note">${esc(n)}</p>`).join('');
  if(S.current){const ev=S.current;
   body+=`<div class="card">${tapedCard(eventCard(ev),104,116,'ritratto')}<h2>${esc(ev.title)}</h2><p>${esc(tx(ev.text))}</p>${opts(ev).map((op,i)=>{const ok=!op.req||op.req();const r=riskOf(op);const meta=optMeta(op);
    return `<button class="btn" ${ok?'':'disabled'} onclick="choose(${i})">${esc(lab(op.l))}<span class="meta">${r&&ok?`<span class="risk ${r[1]}">${r[0]}</span>`:''}<span>${ok?(meta||'nessun costo immediato'):'Non hai quello che serve'}</span></span></button>`}).join('')}</div>`}
  else{if(S.outcome)body+=`<div class="out ${S.outcome.bad?'bad':''}">${esc(tx(S.outcome.txt))}</div>`;
   body+=`<button class="btn primary" onclick="step()">${S.seg>=t.terr.length?'Arrivi al rifugio':'Cammini'}</button>`}
  a.innerHTML=`${hdr(scene(t),t.extra?t.name:'Tappa '+(t.label||t.n),`${poiName(S.tappa,S.seg)} · ${t.from} → ${t.to} · ${t.km} km`,S.clock)}${body}${logHtml()}`}
 else if(S.screen==='sera'){const t=TAPPE[S.tappa],late=S.full,saunaOk=t.sauna&&S.arrive<=1020;
  a.innerHTML=`${hdr(hutScene(t,saunaOk&&!S.closed),t.to,'la sera',S.arrive)}<p>Arrivi alle ${hhmm(S.arrive)}. ${S.closed?'Il rifugio ha già chiuso per la fine della stagione: resta aperto solo il locale invernale, senza custode.':late?'Troppo tardi: i letti sono già tutti occupati.':'C\'è ancora un letto libero.'}</p>
  ${S.arrMsg.map(m=>`<div class="out">${esc(m)}</div>`).join('')}
  ${!S.closed&&S.tappa===0?`<p class="note">Il custode apre il registro: «Nome?». Scrive ${esc(pgName())} con una bella grafia.</p>`:!S.closed&&S.tappa>0&&(S.tappa*37)%10<4?`<p class="note">«Ah, ${esc(pgName())}! Ho saputo che arrivavi.» Le voci corrono tra i rifugi.</p>`:''}<p class="sub">${forecastWho()} domani ${WX[S.forecast.shown].toLowerCase()}.</p>
  ${t.sauna&&!S.closed?`<div class="card"><h3>Sauna</h3>${saunaOk?`<button class="btn" ${S.didSauna?'disabled':''} onclick="sauna()">Sauna e tuffo nel torrente<span class="meta">${S.didSauna?'Fatto':'Morale, energia, asciughi tutto'}</span></button>`:'<p class="sub">Chiusa alle 17. Arriva prima la prossima volta.</p>'}</div>`:''}
  ${t.shop&&!S.closed?`<div class="card"><h3>Spaccio</h3><button class="btn" ${S.soldi<12?'disabled':''} onclick="buy('pasti',12)">Un pasto<span class="meta">12 €</span></button><button class="btn" ${S.soldi<3?'disabled':''} onclick="buy('barrette',3)">Una barretta<span class="meta">3 €</span></button><button class="btn" ${S.soldi<4?'disabled':''} onclick="buy('cerotti',4)">Un cerotto<span class="meta">4 €</span></button></div>`:''}
  ${inv('powerbank')>0?`<div class="card"><h3>Dispositivi</h3><button class="btn" onclick="ricarica()">Usa una carica di powerbank<span class="meta">+60% al dispositivo più scarico · ne hai ${inv('powerbank')}</span></button></div>`:''}<div class="card"><h3>Dove dormi?</h3>
  <button class="btn" ${late||S.soldi<hutPrice(t)?'disabled':''} onclick="sleep('letto')">Letto nel rifugio<span class="meta">${late?'Pieno':hutPrice(t)+' € · recupero pieno, scarpe asciutte, batteria carica'}</span></button>
  <button class="btn" ${S.soldi<floorPrice(t)?'disabled':''} onclick="sleep('pavimento')">${S.closed?'Locale invernale':'Pavimento del locale comune'}<span class="meta">${S.closed?'Gratis':floorPrice(t)+' €'} · recupero ridotto</span></button>
  <button class="btn" ${(att('riparo')>=1)?'':'disabled'} onclick="sleep('tenda')">In tenda<span class="meta">${(att('riparo')>=1)?'Gratis · dipende dal meteo':'Non hai la tenda'}</span></button>
  ${!(att('riparo')>=1)&&S.soldi<FLOOR?`<button class="btn" onclick="sleep('tenda')">All'aperto, avvolto nel sacco<span class="meta">Gratis · dormi male</span></button>`:''}</div>${logHtml()}`}
 else if(S.screen==='mattino'){const cur=TAPPE[S.tappa],station=cur.n===6;
  const vreq=`Serve esperienza ${VETTA_XP} (ne hai ${S.xp}), aderenza 3 e calore 1`;
  const next=TAPPE[nextIndex(S.tappa)];
  a.innerHTML=`${hdr(morningScene(),'Il mattino dopo',`${next?'verso '+next.to:''}`,420)}${S.night.map(m=>`<p class="note">${esc(m)}</p>`).join('')}
  <div class="card"><p>${station?'Dalla finestra della stazione vedi il Gáisi. ':''}${forecastWho(true)} oggi ${WX[S.forecast.shown].toLowerCase()}.${next?' Prossima tappa: '+esc(next.to)+', '+next.km+' km.':''}</p>
  ${station?`<button class="btn" ${vettaOk()?'':'disabled'} onclick="nextDay('vetta')">Giorno extra: sali sul Gáisi<span class="meta">${vettaOk()?'Costa un giorno di ferie · la vetta più alta della regione':vreq}</span></button>`:''}
  <button class="btn" onclick="nextDay('presto')">Sveglia presto, partenza alle 6:30<span class="meta">Più tempo davanti · −8 energia</span></button>
  <button class="btn" onclick="nextDay('normale')">Partenza alle 8:00</button>
  <button class="btn" onclick="nextDay('tardi')">Colazione lunga, partenza alle 9:30<span class="meta">+6 energia, +3 morale · meno margine</span></button>
  <button class="btn" onclick="nextDay('riposo')">Resti un giorno al rifugio<span class="meta">Costa un giorno di ferie · +30 energia</span></button></div>`}
 else if(S.screen==='fine'){const k=endKind(),win=k==='completo',km=trekKm(),days=Math.max(1,(S.ferie0||8)-S.ferie+(win?1:0));
  const T={completo:`Ce l'hai fatta, ${pgName()}!`,energia:'Il corpo ha detto basta',morale:'La testa ha detto basta',ferie:'Le ferie sono finite',altro:'Fine del cammino'}[k];
  a.innerHTML=`${hdr(endScene(),T,win?'La Via delle Renne è tua':'Il cammino finisce qui',S.clock)}
  <p>${esc(tx(S.end))}</p>
   <div class="sum"><div><b>${km}</b><span>km percorsi</span></div><div><b>${days}</b><span>${days===1?'giorno':'giorni'}</span></div><div><b>${S.xp}</b><span>esperienza</span></div><div><b>${S.timbri.length}</b><span>timbri</span></div></div>
   <p class="sub">Seed della partita: ${S.seed}. Per rigiocarla usa <code>?seed=${S.seed}</code> nell'indirizzo.</p>
  ${win?'':`<p class="sub">${k==='energia'?'Prossima volta: mangia regolarmente, riposa un giorno quando l\'energia scende, alleggerisci lo zaino.':k==='morale'?'Prossima volta: proteggiti da pioggia e zanzare, concediti la sauna, parti con più voglia.':k==='ferie'?'Prossima volta: parti con più giorni di ferie, o riposa meno lungo la strada.':''}</p>`}
  <div class="card"><h3>Diario</h3><p>${S.timbri.length?S.timbri.map(t=>`<span class="stamp">${esc(t)}</span>`).join(''):'<span class="sub">Nessun timbro.</span>'}</p></div>
  <button class="btn primary" onclick="S=newState();render()">Ricomincia</button>${logHtml()}`}
 if(!(S.screen==='zaino'&&lastScreen==='zaino'))window.scrollTo(0,0);lastScreen=S.screen}
let lastScreen=null;
function logHtml(){return S.log.length?`<details class="log"><summary>Taccuino</summary><ul>${S.log.slice(0,20).map(l=>`<li>${esc(l)}</li>`).join('')}</ul></details>`:''}
const SECTIONS=[['Zaino','zaino'],['Sacco a pelo','sacco'],['Materassino','materassino'],['Scarpe','scarpe'],['Altra attrezzatura',null]];
function toggleItem(id){const it=ITEMS.find(i=>i.id===id);if(it.group){ITEMS.filter(i=>i.group===it.group).forEach(i=>S.kit.delete(i.id));S.kit.add(id)}else if(it.slot){const active=S.kit.has(id);ITEMS.filter(i=>i.slot===it.slot).forEach(i=>S.kit.delete(i.id));if(!active)S.kit.add(id)}else S.kit.has(id)?S.kit.delete(id):S.kit.add(id);render()}
function qty(id,d){const c=CONSUM.find(c=>c.id===id);S.inv[id]=clamp(inv(id)+d,0,c.max);render()}
function depart(){S.wx=pickW(wxW());S.tappa=0;S.start=630;if(has('faro')){S.soldi-=15;S.log.unshift('Abbonamento del faro satellitare: 15 euro.')}startTappa()}
