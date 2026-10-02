document.title = GAME_CONFIG.name;
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
