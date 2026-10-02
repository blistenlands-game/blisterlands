const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const art = path.join(root, 'assets', 'art');
const out = path.join(root, 'assets', 'sprites');

const sheets = [
  ['gear.png', 6, 5, 'gear', ['zainoClassico','zainoUL','saccoPiuma','saccoSint','quiltPiuma','quiltSint','matGonfiabile','matSchiuma','trail','scarponi','basse','guscio','pile','ghette','bastoncini','sandali','rete','cappello','filtro','mappa','orologio','faro','kit','fornello','tenda','carte','pasti','barrette','gas','calze']],
  ['protagonists.png', 2, 2, 'portrait', ['marco','davide','sara','elena']],
  ['story-cast.png', 4, 3, 'cast', ['capo','marta','paolo','negoziante','giulia','gatto','custode','jonas','renna','barcaiolo','guardiaparco','erik']],
  ['event-icons.png', 5, 4, 'event', ['rifugio','impronte','sole','cerotto','zanzara','scarpone','pioggia','vento','bussola','acqua','cibo','tenda','zaino','bivio','soldi','meraviglia','taccuino','persona','lemming','corvo']],
  ['brand-marks.png', 2, 2, 'brand', ['A','S','Sh','D']],
];
const people = ['marco','davide','sara','elena'];
const poses = ['walk','stand','sit','victory'];
const sceneSheets = [
  ['event-scenes-water.png', ['waterfall','suspension-bridge','ford','spring','fisherman-lake','stream-camp','lake-boat','double-rainbow','broken-bridge']],
  ['event-scenes-terrain.png', ['deep-mud','bog-boardwalk','boulder-field','landslide','flower-meadow','blueberry-slope','snowfield','moose-birches','forest-smoke']],
  ['event-scenes-places.png', ['reindeer-corral','sacred-boulder','turf-hut','ridge-routes','summit-panorama','narrow-canyon','evening-refuge','aurora-camp','trail-station']],
];

async function removeTinyComponents(buffer){const {data,info}=await sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});const seen=new Uint8Array(info.width*info.height),groups=[];for(let p=0;p<seen.length;p++){if(seen[p]||data[p*4+3]<20)continue;const stack=[p],group=[];seen[p]=1;while(stack.length){const q=stack.pop();group.push(q);const x=q%info.width,y=Math.floor(q/info.width);for(const n of [q-1,q+1,q-info.width,q+info.width])if(n>=0&&n<seen.length&&!seen[n]&&data[n*4+3]>=20&&Math.abs(n%info.width-x)+Math.abs(Math.floor(n/info.width)-y)===1){seen[n]=1;stack.push(n)}}groups.push(group)}const largest=Math.max(1,...groups.map(g=>g.length));for(const group of groups){const ys=group.map(p=>Math.floor(p/info.width)),minY=Math.min(...ys),maxY=Math.max(...ys),edgeScrap=(minY===0&&maxY<info.height*.18)||(maxY===info.height-1&&minY>info.height*.82);if(group.length<largest*.035||edgeScrap)for(const p of group)data[p*4+3]=0}return sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).png().toBuffer()}
async function cell(file, cols, rows, index, destination, size, clean=false) {
  const image = sharp(path.join(art, file));
  const meta = await image.metadata();
  const col = index % cols;
  const row = Math.floor(index / cols);
  const left = Math.round(meta.width * col / cols)+(clean&&col>0?7:0);
  const top = Math.round(meta.height * row / rows)+(clean&&row>0?18:0);
  const right = Math.round(meta.width * (col + 1) / cols)-(clean&&col<cols-1?7:0);
  const bottom = Math.round(meta.height * (row + 1) / rows)-(clean&&row<rows-1?18:0);
  let cropped = await image.extract({ left, top, width: right - left, height: bottom - top }).png().toBuffer();
  await sharp(cropped).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
    .resize({ width: size, height: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toFile(destination);
}

function rgbToHsv(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d){if(max===r)h=60*(((g-b)/d)%6);else if(max===g)h=60*((b-r)/d+2);else h=60*((r-g)/d+4)}if(h<0)h+=360;return[h,max?d/max:0,max]}
const JACKET_HUE={marco:92,davide:42,sara:215,elena:10};
const JACKET_RGB={marco:[116,132,88],davide:[220,151,38],sara:[52,96,151],elena:[172,72,54]};
const hueDistance=(a,b)=>Math.min(Math.abs(a-b),360-Math.abs(a-b));
async function colorMask(input,destination,person,pose,kind,isStrip=false){
  const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const out=Buffer.alloc(data.length);const frameW=isStrip?info.width/4:info.width;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
    const i=(y*info.width+x)*4,a=data[i+3];if(a<12)continue;
    const localX=(x%frameW)/frameW,localY=y/info.height,[h,s,v]=rgbToHsv(data[i],data[i+1],data[i+2]);let on=false;
    if(kind==='jacket'){
      const zone=pose==='walk'?(localY>.2&&localY<.79&&(localX<.27||localX>.67)):
        pose==='stand'?(localX>.36&&localY>.18&&localY<.82):
        pose==='sit'?(localX>.27&&localY>.25&&localY<.83):(localX>.25&&localY>.13&&localY<.87);
      const faceZone=pose!=='walk'&&localX>.55&&localY<.44;
      const target=JACKET_RGB[person],distance=(data[i]-target[0])**2+(data[i+1]-target[1])**2+(data[i+2]-target[2])**2;
      on=zone&&!faceZone&&localY>.28&&s>.16&&v>.16&&(hueDistance(h,JACKET_HUE[person])<42||distance<12500);
    }else{
      const zone=pose==='walk'?(localX>.08&&localX<.92&&localY>.18&&localY<.68):(localX<.67&&localY>.16&&localY<.72);
      const hairZone=pose!=='walk'&&localX>.44&&localY<.34;
      on=zone&&!hairZone&&v<.48&&s<.34;
    }
    if(on){out[i]=out[i+1]=out[i+2]=255;out[i+3]=Math.round(a*.88)}
  }
  fs.mkdirSync(path.dirname(destination),{recursive:true});
  await sharp(out,{raw:{width:info.width,height:info.height,channels:4}}).png().toFile(destination);
}

(async () => {
  for (const [file, cols, rows, folder, names] of sheets) {
    const dir = path.join(out, folder);
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < names.length; i++) await cell(file, cols, rows, i, path.join(dir, `${names[i]}.png`), folder === 'gear' ? 192 : 256, folder === 'gear');
  }

  const poseDir = path.join(out, 'pose');
  fs.mkdirSync(poseDir, { recursive: true });
  for (let row = 0; row < people.length; row++) {
    for (let col = 0; col < poses.length; col++) {
      await cell('protagonist-poses.png', 4, 4, row * 4 + col, path.join(poseDir, `${people[row]}-${poses[col]}.png`), 320);
    }
  }
  const posePolesDir = path.join(out, 'pose-poles');
  fs.mkdirSync(posePolesDir, { recursive: true });
  for (let row = 0; row < people.length; row++) await cell('walk-cycle-poles.png', 4, 4, row * 4, path.join(posePolesDir, `${people[row]}.png`), 320);

  const walkDir = path.join(out, 'walk');
  fs.mkdirSync(walkDir, { recursive: true });
  for (const [source, folder] of [['walk-cycle-v2.png','walk'],['walk-cycle-poles.png','walk-poles']]) {
    const sourcePath = path.join(art, source), meta = await sharp(sourcePath).metadata(), dir = path.join(out, folder);
    fs.mkdirSync(dir, { recursive: true });
    for (let row = 0; row < people.length; row++) {
      const top = Math.round(meta.height * row / people.length);
      const bottom = Math.round(meta.height * (row + 1) / people.length);
      await sharp(sourcePath).extract({ left: 0, top, width: meta.width, height: bottom - top })
        .resize({ width: 1024, height: 256, fit: 'fill' }).png({compressionLevel:9,palette:true,quality:90,effort:10}).toFile(path.join(dir, `${people[row]}.png`));
    }
  }

  const sceneDir = path.join(out, 'scene');
  fs.mkdirSync(sceneDir, { recursive: true });
  for (const [source, names] of sceneSheets) {
    const sourcePath = path.join(art, source), meta = await sharp(sourcePath).metadata();
    for (let i = 0; i < names.length; i++) {
      const col=i%3,row=Math.floor(i/3),x0=Math.round(meta.width*col/3),x1=Math.round(meta.width*(col+1)/3),y0=Math.round(meta.height*row/3),y1=Math.round(meta.height*(row+1)/3),pad=8;
      await sharp(sourcePath).extract({left:x0+pad,top:y0+pad,width:x1-x0-pad*2,height:y1-y0-pad*2})
        .resize({width:780,height:448,fit:'cover',position:'centre'}).png({compressionLevel:9,palette:true,quality:82,effort:10}).toFile(path.join(sceneDir,`${names[i]}.png`));
    }
  }
  console.log('Sprite raster individuali rigenerati.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
