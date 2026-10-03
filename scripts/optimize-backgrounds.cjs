const fs = require('node:fs');
const path = require('node:path');
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require(path.join(
    process.env.USERPROFILE,
    '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright',
  )));
}

const pairs = process.argv.slice(2).map((entry) => {
  const split = entry.indexOf('=');
  if (split < 1) throw new Error(`Argomento non valido: ${entry}`);
  return { source: entry.slice(0, split), target: entry.slice(split + 1) };
});

if (!pairs.length) {
  console.error('Uso: node scripts/optimize-backgrounds.cjs sorgente.png=destinazione.jpg [...]');
  process.exit(1);
}

(async () => {
  const launchOptions = { headless: true };
  if (process.platform === 'win32') {
    const candidates = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ];
    launchOptions.executablePath = candidates.find((candidate) => fs.existsSync(candidate));
  }
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 780, height: 1170 }, deviceScaleFactor: 1 });

  for (const { source, target } of pairs) {
    const absoluteSource = path.resolve(source);
    const absoluteTarget = path.resolve(target);
    const transparent = path.extname(absoluteTarget).toLowerCase() === '.png';
    const width = 780;
    const height = transparent ? 520 : 1170;
    await page.setViewportSize({ width, height });
    await page.setContent(`<style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:transparent}img{display:block;width:${width}px;height:${height}px;object-fit:${transparent?'contain':'cover'}}</style><img>`);
    fs.mkdirSync(path.dirname(absoluteTarget), { recursive: true });
    const data = fs.readFileSync(absoluteSource).toString('base64');
    await page.locator('img').evaluate((img, src) => { img.src = src; }, `data:image/png;base64,${data}`);
    await page.locator('img').evaluate((img) => img.decode());
    await page.screenshot(transparent
      ? { path: absoluteTarget, type: 'png', omitBackground: true }
      : { path: absoluteTarget, type: 'jpeg', quality: 78 });
  }

  await browser.close();
  console.log(`Ottimizzati ${pairs.length} asset raster.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
