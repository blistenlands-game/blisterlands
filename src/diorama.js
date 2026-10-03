/* Prima tappa: piccoli movimenti ambientali disegnati sopra i fondali raster. */
let activeDiorama=null,dioramaToken=0;
function stopStageDiorama(){
 dioramaToken++;
 if(activeDiorama){try{activeDiorama.destroy(true,{children:true,texture:false,textureSource:false})}catch(e){}activeDiorama=null}
}
function coverDioramaSprite(sprite,w,h,overscan=1.055){
 const scale=Math.max(w/sprite.texture.width,h/sprite.texture.height)*overscan;
 sprite.scale.set(scale);sprite.anchor.set(.5);sprite.position.set(w/2,h/2);
}
function dioramaDot(color,alpha,radius){const g=new PIXI.Graphics();g.circle(0,0,radius).fill({color,alpha});return g}
async function mountStageDiorama(){
 stopStageDiorama();
 const host=document.querySelector('.trek-scene .diorama-canvas');
 if(!host||!window.PIXI||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const token=++dioramaToken,src=host.dataset.src,poi=Number(host.dataset.poi)||0;
 try{
  const app=new PIXI.Application();
  await app.init({resizeTo:host,backgroundAlpha:0,antialias:true,resolution:Math.min(devicePixelRatio||1,2),autoDensity:true,powerPreference:'low-power'});
  if(token!==dioramaToken||!host.isConnected){app.destroy(true,{children:true,texture:false,textureSource:false});return}
  activeDiorama=app;host.appendChild(app.canvas);
  const texture=await PIXI.Assets.load(src);
  if(token!==dioramaToken||!host.isConnected)return;
  const bg=new PIXI.Sprite(texture),w=host.clientWidth,h=host.clientHeight;
  coverDioramaSprite(bg,w,h);app.stage.addChild(bg);
  const ambient=new PIXI.Container();app.stage.addChild(ambient);
  const motes=[];
  const add=(node,x,y,kind,speed=.2)=>{node.position.set(x*w,y*h);node._originX=x*w;node._originY=y*h;node._phase=Math.random()*Math.PI*2;node._kind=kind;node._speed=speed;ambient.addChild(node);motes.push(node);return node};
  if(poi===0){
   for(let i=0;i<11;i++)add(dioramaDot(0xf2eee1,.25+Math.random()*.2,3+Math.random()*7),.12+Math.random()*.42,.38+Math.random()*.48,'mist',.18+Math.random()*.12);
   for(let i=0;i<8;i++){const g=new PIXI.Graphics();g.roundRect(0,0,2+Math.random()*2,16+Math.random()*24,2).fill({color:0xd9edf1,alpha:.28});add(g,.18+Math.random()*.35,.22+Math.random()*.45,'water',.4+Math.random()*.3)}
  }else if(poi===1){
   for(let i=0;i<8;i++){const g=new PIXI.Graphics();g.ellipse(0,0,8+Math.random()*14,2+Math.random()*3).stroke({color:0xd8eee9,width:1.4,alpha:.4});add(g,.2+Math.random()*.48,.55+Math.random()*.22,'ripple',.22+Math.random()*.12)}
  }else if(poi===2){
   for(let i=0;i<12;i++){const g=new PIXI.Graphics();g.ellipse(0,0,4+Math.random()*3,2+Math.random()*2).fill({color:i%2?0xa7863f:0x6b7541,alpha:.55});add(g,Math.random(),.05+Math.random()*.6,'leaf',.2+Math.random()*.35)}
  }else if(poi===3){
   for(let i=0;i<8;i++)add(dioramaDot(0xdce5ca,.28,2+Math.random()*3),.12+Math.random()*.72,.46+Math.random()*.35,'seed',.16+Math.random()*.18);
   for(let i=0;i<5;i++){const g=dioramaDot(0xaebbd8,.28,3);add(g,.18+Math.random()*.62,.55+Math.random()*.22,'glint',.5)}
  }else if(poi===4){
   for(let i=0;i<10;i++){const g=new PIXI.Graphics();g.roundRect(0,0,22+Math.random()*46,1.3,1).fill({color:0xe9e2c9,alpha:.22});add(g,.05+Math.random()*.72,.52+Math.random()*.3,'lake',.1+Math.random()*.08)}
  }else{
   for(let i=0;i<5;i++){const g=new PIXI.Graphics();g.ellipse(0,0,34+Math.random()*28,10+Math.random()*8).fill({color:0xeee8d7,alpha:.17});add(g,-.1-i*.18,.18+Math.random()*.23,'cloud',.08+Math.random()*.04)}
  }
  let time=0;
  app.ticker.add(ticker=>{
   const dt=ticker.deltaTime;time+=dt;
   bg.x=w/2+Math.sin(time/330)*w*.006;bg.y=h/2+Math.cos(time/440)*h*.004;bg.rotation=Math.sin(time/620)*.0015;
   for(const n of motes){const t=time*n._speed/28+n._phase;
    if(n._kind==='mist'){n.x=n._originX+Math.sin(t)*18;n.y=n._originY-Math.cos(t*.7)*8;n.alpha=.45+.2*Math.sin(t)}
    else if(n._kind==='water'){n.y+=dt*n._speed;if(n.y>h*.88)n.y=h*.18;n.alpha=.2+.2*Math.sin(t)}
    else if(n._kind==='ripple'){n.scale.set(.65+(Math.sin(t)+1)*.35);n.alpha=.18+.2*(1-Math.abs(Math.sin(t)))}
    else if(n._kind==='leaf'){n.x+=dt*n._speed;n.y+=dt*n._speed*.15;n.rotation+=dt*.018;if(n.x>w+12){n.x=-12;n.y=n._originY}}
    else if(n._kind==='seed'){n.x=n._originX+Math.sin(t)*13;n.y=n._originY-Math.sin(t*.6)*10}
    else if(n._kind==='glint'){n.alpha=.1+.45*Math.max(0,Math.sin(t))}
    else if(n._kind==='lake'){n.x=n._originX+Math.sin(t)*12;n.alpha=.08+.22*(Math.sin(t)+1)/2}
    else if(n._kind==='cloud'){n.x+=dt*n._speed;if(n.x>w+90)n.x=-90}
   }
  });
  host.closest('.trek-scene')?.classList.add('diorama-ready');
 }catch(error){console.warn('Diorama non disponibile, uso il fondale statico.',error);stopStageDiorama()}
}
