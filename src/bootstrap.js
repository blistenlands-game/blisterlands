document.title = GAME_CONFIG.name;

const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
if (!standalone) {
  let installPrompt = null;
  const installBar = document.createElement('aside');
  installBar.className = 'pwa-install';
  installBar.hidden = true;
  installBar.innerHTML = '<div><b>Installa Blisterborn</b><span></span></div><button type="button" class="pwa-install-action">Installa</button><button type="button" class="pwa-install-close" aria-label="Chiudi">×</button>';
  document.body.append(installBar);
  const message = installBar.querySelector('span');
  const action = installBar.querySelector('.pwa-install-action');
  const close = installBar.querySelector('.pwa-install-close');
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const mobile = ios || /android/i.test(navigator.userAgent);
  close.addEventListener('click', () => { installBar.hidden = true; });
  action.addEventListener('click', async () => {
    if (!installPrompt) return;
    installBar.hidden = true;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
  });
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    message.textContent = 'Salvala sul telefono e usala anche offline.';
    action.hidden = false;
    installBar.hidden = false;
  });
  window.addEventListener('appinstalled', () => { installBar.hidden = true; installPrompt = null; });
  if (ios) {
    message.textContent = 'Apri in Safari, poi Condividi → Aggiungi alla schermata Home.';
    action.hidden = true;
    installBar.hidden = false;
  } else if (mobile) {
    setTimeout(() => {
      if (installPrompt || standalone) return;
      message.textContent = 'Apri questo link in Chrome, poi usa ⋮ → Installa app.';
      action.hidden = true;
      installBar.hidden = false;
    }, 1800);
  }
}

if ('serviceWorker' in navigator) {
  let registration;
  const hadController = !!navigator.serviceWorker.controller;
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || refreshing) return;
    refreshing = true;
    location.reload();
  });
  const update = () => registration && registration.update().catch(() => {});
  window.addEventListener('load', async () => {
    try {
      registration = await navigator.serviceWorker.register(`sw.js?v=${encodeURIComponent(GAME_CONFIG.version)}`, { updateViaCache: 'none' });
      await update();
    } catch (error) {}
  });
  window.addEventListener('pageshow', update);
  window.addEventListener('online', update);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') update(); });
}
