/* =========== STATO =========== */
let S;
function newState(){return{screen:'intro',kit:new Set(['zainoClassico','saccoPiuma','matGonfiabile','trail','guscio','pile','fornello']),
 inv:{pasti:3,barrette:4,gas:4,cerotti:3,repellente:2,calze:1,batteria:100,powerbank:1},bat:{orologio:100,faro:100},mese:'luglio',
 energia:100,morale:65,soldi:220,ferie:8,xp:0,stati:new Set(),timbri:[],flags:{},mem:new Set(),
 tappa:0,seg:0,gseg:0,clock:630,start:630,wx:'nuvole',forecast:null,later:[],notes:[],
 current:null,outcome:null,used:new Set(),log:[],end:null,arrive:0,night:[],extraKg:0}}
const has=id=>{if(S.kit.has(id))return true;for(const k of S.kit){const it=typeof ITEM_BY!=='undefined'&&ITEM_BY[k];if(it&&it.base===id)return true}return false};
/* caratteristiche: gli eventi ragionano su queste, non sui singoli oggetti */
const ATTR={impermeabile:'Impermeabilità',antivento:'Antivento',calore:'Calore',piediAsciutti:'Piedi asciutti',fango:'Protezione dal fango',asciugatura:'Asciugatura',caviglia:'Protezione caviglia',aderenza:'Aderenza',suola:'Protezione suola',appoggio:'Appoggio',guado:'Guado',antinsetti:'Antinsetti',ombra:'Ombra',acquaSicura:'Acqua sicura',orientamento:'Orientamento',riparazione:'Riparazione',portanza:'Portanza',sonno:'Calore notturno',umido:'Resistenza all\'umido',comfort:'Comfort notturno',cucina:'Cucina',riparo:'Riparo',svago:'Svago'};
function att(k){return Math.min(3,attBase(k)+skillBonus(k))}
function skillBonus(k){if(typeof H==='undefined'||!H)return 0;if(k==='orientamento')return Math.floor(H.abil.orientamento/2);if(k==='aderenza'||k==='appoggio')return Math.floor(H.abil.tecnica/2);return 0}
function attBase(k){let v=0;for(const id of S.kit){const it=ITEMS.find(i=>i.id===id);if(!it||!it.a)continue;if(it.dev&&S.bat[it.base||id]<=0)continue;const a=(S.eff&&S.eff[id])||it.a;if((a[k]||0)>v)v=a[k]}return v}
const devOn=id=>has(id)&&S.bat[id]>0;
const inv=id=>S.inv[id]||0;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=Math.random,chance=p=>rnd()<p;
function pickW(o){let t=0;for(const k in o)t+=o[k];let r=rnd()*t;for(const k in o){r-=o[k];if(r<=0)return k}return Object.keys(o)[0]}
const nextWx=c=>chance(0.55)?c:pickW(wxW());
const hhmm=m=>{m=Math.round(m);return `${Math.floor(m/60)%24}:${String(m%60).padStart(2,'0')}`};
function packKg(){let kg=BASE_KG+S.extraKg;for(const id of S.kit)kg+=ITEMS.find(i=>i.id===id)?.kg||0;for(const c of CONSUM)kg+=inv(c.id)*c.kg;return kg}
/* contesto del momento */
function C(){const t=TAPPE[S.tappa];const ter=t.terr[Math.min(S.seg,t.terr.length)-1]||t.terr[0];
 return {wx:S.wx,ter,ora:S.clock<720?'mattina':S.clock<1020?'pomeriggio':'sera',stanco:S.energia<35,rain:S.wx==='pioggia',sole:S.wx==='sole'}}

/* effetti: e energia, m morale, s soldi, xp, min tempo, add/rm stati, flag, timbro, give, later, mem, kg */
function fx(o){
 if(!o)return;
 if(o.e)S.energia=clamp(S.energia+o.e,0,100);
 if(o.m)S.morale=clamp(S.morale+o.m,0,100);
 if(o.s)S.soldi+=o.s;
 if(o.xp)S.xp+=o.xp;
 if(o.min)S.clock+=o.min;
 if(o.kg)S.extraKg=Math.max(0,S.extraKg+o.kg);
 (o.add||[]).forEach(x=>S.stati.add(x));
 (o.rm||[]).forEach(x=>S.stati.delete(x));
 if(o.flag)S.flags[o.flag]=true;
 if(o.mem)S.mem.add(o.mem);
 if(o.timbro&&!S.timbri.includes(o.timbro))S.timbri.push(o.timbro);
 if(o.give)for(const k in o.give)S.inv[k]=Math.max(0,inv(k)+o.give[k]);
 if(o.later)S.later.push({at:S.gseg+o.later.segs,txt:o.later.txt,fx:o.later.fx});
 if(o.drop){const ids=[...S.kit].filter(i=>!['trail','scarponi'].includes(i));ids.sort((a,b)=>ITEMS.find(x=>x.id===b).kg-ITEMS.find(x=>x.id===a).kg);if(ids[0]){S.kit.delete(ids[0]);S.log.unshift('Lasciato in deposito: '+ITEMS.find(x=>x.id===ids[0]).name)}}
}
function useInv(u){if(u)for(const k in u)S.inv[k]=Math.max(0,inv(k)-u[k])}
/* esito: peso, tono (g buono, m misto, b cattivo), testo, effetti */
const O=(w,t,txt,f)=>({w,t,txt,f:f||{}});
