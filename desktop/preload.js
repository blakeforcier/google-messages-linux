// Preload script for Messages Desktop App
window.addEventListener('DOMContentLoaded', () => {
  function cleanupBrand() {
    try {
      document.querySelectorAll('h1.logo, .logo-link, [data-e2e-messages-title], .logo.no-margin').forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
      });
    } catch (_) {}
  }

  cleanupBrand();

  const observer = new MutationObserver(cleanupBrand);
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
});
