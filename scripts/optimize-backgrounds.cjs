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
  const page = await browser.newPage({ viewport: { width: 780, height: 448 }, deviceScaleFactor: 1 });
  await page.setContent('<style>*{box-sizing:border-box}html,body{margin:0;width:780px;height:448px;overflow:hidden}img{display:block;width:780px;height:448px;object-fit:cover}</style><img>');

  for (const { source, target } of pairs) {
    const absoluteSource = path.resolve(source);
    const absoluteTarget = path.resolve(target);
    fs.mkdirSync(path.dirname(absoluteTarget), { recursive: true });
    const data = fs.readFileSync(absoluteSource).toString('base64');
    await page.locator('img').evaluate((img, src) => { img.src = src; }, `data:image/png;base64,${data}`);
    await page.locator('img').evaluate((img) => img.decode());
    await page.screenshot({ path: absoluteTarget, type: 'jpeg', quality: 82 });
  }

  await browser.close();
  console.log(`Ottimizzati ${pairs.length} sfondi a 780x448.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
