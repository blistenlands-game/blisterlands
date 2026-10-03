const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const rig = path.join(root, 'assets', 'sprites', 'rig');

async function normalizeStrip(source, destination) {
  const image = sharp(source);
  const meta = await image.metadata();
  const frames = [];
  for (let frame = 0; frame < 4; frame++) {
    const left = Math.round(meta.width * frame / 4);
    const right = Math.round(meta.width * (frame + 1) / 4);
    const buffer = await image.clone()
      .extract({ left, top: 0, width: right - left, height: meta.height })
      .resize({ width: 256, height: 256, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
      .toBuffer();
    frames.push({ input: buffer, left: frame * 256, top: 0 });
  }
  await sharp({ create: { width: 1024, height: 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(frames)
    .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
    .toFile(destination);
}

async function gearIcon(source, destination) {
  const cell = await sharp(source).extract({ left: 0, top: 0, width: 256, height: 256 }).png().toBuffer();
  const buffer = await sharp(cell).trim({
    background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8
  }).resize({ width: 192, height: 192, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 }).toBuffer();
  await sharp(buffer).toFile(destination);
}

(async () => {
  for (const folder of ['base', 'gear']) {
    const dir = path.join(rig, folder);
    for (const name of fs.readdirSync(dir).filter((file) => file.endsWith('-source.png'))) {
      await normalizeStrip(path.join(dir, name), path.join(dir, name.replace('-source', '')));
    }
  }
  await gearIcon(path.join(rig, 'gear', 'hat-wool.png'), path.join(root, 'assets', 'sprites', 'gear', 'cappelloLana.png'));
  await gearIcon(path.join(rig, 'gear', 'gloves.png'), path.join(root, 'assets', 'sprites', 'gear', 'guanti.png'));
  console.log('Rig raster normalizzato: quattro fotogrammi da 256 px.');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
