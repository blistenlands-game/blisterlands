const http = require('node:http');
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

const root = path.resolve(__dirname, '..');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.pck': 'application/octet-stream',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
};

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const relative = pathname === '/' || pathname === '/godot-web/'
    ? 'godot-web/index.html'
    : pathname.slice(1);
  const target = path.resolve(root, relative);

  if (!target.startsWith(root + path.sep)) {
    response.writeHead(403).end();
    return;
  }

  fs.readFile(target, (error, body) => {
    if (error) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
    response.end(body);
  });
});

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const launchOptions = { headless: true };
  if (process.platform === 'win32') {
    const installedBrowsers = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ];
    launchOptions.executablePath = installedBrowsers.find((candidate) => fs.existsSync(candidate));
  }

  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(`http://127.0.0.1:${port}/godot-web/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => !document.getElementById('status'), null, { timeout: 120000 });
  await page.waitForTimeout(2500);

  const canvas = await page.locator('#canvas').evaluate((element) => ({
    width: element.width,
    height: element.height,
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
  }));
  if (canvas.width < 300 || canvas.height < 600 || canvas.clientWidth !== 390 || canvas.clientHeight !== 844) {
    throw new Error(`Canvas mobile non valido: ${JSON.stringify(canvas)}`);
  }
  if (errors.length) throw new Error(errors.join('\n'));

  await page.screenshot({ path: path.join(process.env.TEMP || root, 'blisterborn-godot-mobile.png') });
  console.log(`Godot Web smoke test OK: ${canvas.width}x${canvas.height}, nessun errore browser`);
  await browser.close();
  server.close();
})().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});
