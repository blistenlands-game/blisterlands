const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require(path.join(
    process.env.USERPROFILE,
    '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright',
  )));
}

(async () => {
  const root = path.resolve(__dirname, '..');
  const source = path.join(root, 'design', 'mockups', 'tappa-1-cascata-v3.html');
  const output = path.join(root, 'design', 'mockups', 'tappa-1-cascata-v3.png');
  const launchOptions = { headless: true };
  const installedBrowsers = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  launchOptions.executablePath = installedBrowsers.find((candidate) => fs.existsSync(candidate));
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(source).href, { waitUntil: 'load' });
  await page.locator('.screen').screenshot({ path: output });
  await browser.close();
  console.log(output);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
