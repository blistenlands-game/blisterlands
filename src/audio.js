/* Effetti sonori procedurali: nessun file esterno, funzionano anche offline. */
(() => {
  const KEY='blisterlands-audio-muted';
  let ctx=null,lastCard='',lastScreen='';
  let muted=localStorage.getItem(KEY)==='1';
  const context=()=>ctx||(ctx=new (window.AudioContext||window.webkitAudioContext)());
  function unlock(){if(muted)return;const c=context();if(c.state==='suspended')c.resume().catch(()=>{})}
  function gain(c,volume,start,duration){const g=c.createGain();g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(volume,start+.012);g.gain.exponentialRampToValueAtTime(.0001,start+duration);g.connect(c.destination);return g}
  function tone(freq,end,volume,duration,delay=0,type='sine'){
    if(muted)return;const c=context(),now=c.currentTime+delay,o=c.createOscillator(),g=gain(c,volume,now,duration);o.type=type;o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(end||freq,now+duration);o.connect(g);o.start(now);o.stop(now+duration+.02)
  }
  function noise(volume,duration,from,to,delay=0){
    if(muted)return;const c=context(),rate=c.sampleRate,size=Math.ceil(rate*duration),buffer=c.createBuffer(1,size,rate),data=buffer.getChannelData(0);for(let i=0;i<size;i++)data[i]=(Math.random()*2-1)*(1-i/size);const src=c.createBufferSource(),filter=c.createBiquadFilter(),now=c.currentTime+delay;filter.type='bandpass';filter.Q.value=.65;filter.frequency.setValueAtTime(from,now);filter.frequency.exponentialRampToValueAtTime(to,now+duration);src.buffer=buffer;src.connect(filter);filter.connect(gain(c,volume,now,duration));src.start(now)
  }
  function play(name){
    if(muted||!ctx)return;if(ctx.state==='suspended')ctx.resume().catch(()=>{});
    if(name==='tap'){tone(185,125,.022,.075,0,'triangle');return}
    if(name==='card'){noise(.07,.28,1500,380);tone(92,68,.035,.18,.03,'triangle');return}
    if(name==='scene'){noise(.055,.34,420,1500);return}
    if(name==='good'){tone(330,440,.045,.22,0,'sine');tone(494,660,.035,.28,.09,'sine');return}
    if(name==='bad'){tone(185,115,.055,.3,0,'triangle');tone(130,82,.035,.32,.08,'sine');return}
    if(name==='arrival'){tone(196,247,.025,.35,0,'sine');tone(294,392,.027,.42,.13,'sine')}
  }
  function syncButton(){const b=document.querySelector('.sound-toggle');if(!b)return;b.textContent=muted?'♩':'♪';b.setAttribute('aria-label',muted?'Attiva effetti sonori':'Disattiva effetti sonori');b.setAttribute('aria-pressed',String(!muted));b.title=muted?'Audio disattivato':'Audio attivo'}
  function toggle(){muted=!muted;localStorage.setItem(KEY,muted?'1':'0');syncButton();if(!muted){unlock();tone(330,440,.035,.18)}}
  function observe(){
    const app=document.querySelector('#app');if(!app)return;
    new MutationObserver(()=>{
      const card=document.querySelector('.stage-one-event:not(.is-resolved)');
      const cardKey=card?.getAttribute('aria-label')||'';
      if(cardKey&&cardKey!==lastCard)play('card');
      lastCard=cardKey;
      const screen=document.querySelector('.stage-one-ui.arrival')?'arrival':document.querySelector('.stage-one-ui.morning')?'morning':'';
      if(screen&&screen!==lastScreen)play('arrival');
      lastScreen=screen;
    }).observe(app,{childList:true,subtree:true})
  }
  document.addEventListener('pointerdown',event=>{const target=event.target.closest('button,input,summary');if(!target)return;unlock();if(!target.classList.contains('sound-toggle'))play('tap')},true);
  document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('button,summary')){unlock();play('tap')}},true);
  window.GameAudio={play,unlock,toggle,get muted(){return muted}};
  document.addEventListener('DOMContentLoaded',()=>{const b=document.createElement('button');b.type='button';b.className='sound-toggle';b.onclick=toggle;document.body.append(b);syncButton();observe()})
})();
