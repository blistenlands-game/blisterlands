const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
let chromium;
try{({chromium}=require('playwright'))}catch{({chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')))}

const context={};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.resolve('src/map-routes.js'),'utf8'),context);

(async()=>{
 const launchOptions={headless:true};
 if(process.platform==='win32'){
  const candidates=['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'];
  launchOptions.executablePath=candidates.find(fs.existsSync);
 }
 const browser=await chromium.launch(launchOptions);
 const page=await browser.newPage({viewport:{width:780,height:520},deviceScaleFactor:1});
 await page.setContent('<style>html,body{margin:0;width:780px;height:520px;overflow:hidden;background:transparent}canvas{display:block}</style><canvas width="780" height="520"></canvas>');
 for(let stage=0;stage<8;stage++){
  const file=path.resolve(`assets/maps/stage-map-${stage+1}.png`);
  const source=`data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
  const points=context.MAP_ROUTE_POINTS[stage].map(p=>Array.from(p));
  const samples=Array.from(context.sampleMapRoute(stage,40),p=>Array.from(p));
  await page.locator('canvas').evaluate(async(canvas,{source,points,samples})=>{
   const image=new Image();image.src=source;await image.decode();
   const g=canvas.getContext('2d');g.clearRect(0,0,canvas.width,canvas.height);g.drawImage(image,0,0,canvas.width,canvas.height);
   const trace=()=>{g.beginPath();samples.forEach((p,i)=>(i?g.lineTo(p[0]*canvas.width,p[1]*canvas.height):g.moveTo(p[0]*canvas.width,p[1]*canvas.height)))};
   g.lineCap='round';g.lineJoin='round';
   trace();g.strokeStyle='rgba(247,236,207,.96)';g.lineWidth=20;g.stroke();
   trace();g.strokeStyle='#49382d';g.lineWidth=9;g.stroke();
   trace();g.strokeStyle='rgba(126,66,39,.38)';g.lineWidth=3;g.stroke();
   points.forEach((p,index)=>{
    const x=p[0]*canvas.width,y=p[1]*canvas.height,r=index===0||index===points.length-1?15:13;
    g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fillStyle='#f4e8ca';g.fill();g.strokeStyle='#49382d';g.lineWidth=5;g.stroke();
    g.beginPath();g.arc(x,y,4,0,Math.PI*2);g.fillStyle='#9a4529';g.fill();
   });
  },{source,points,samples});
  await page.locator('canvas').screenshot({path:file,type:'png',omitBackground:true});
 }
 await browser.close();
 console.log('Percorsi curvi incorporati nelle 8 cartine raster.');
})().catch(error=>{console.error(error);process.exitCode=1});
