/**
 * Minimal SW registration to enable offline-first caching after first load.
 * Works in production builds (vite preview / static hosting).
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[SW] registered:', reg.scope))
      .catch(err => console.warn('[SW] registration failed:', err));
  });
}
