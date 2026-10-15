// Preload script for Messages Desktop App
window.addEventListener('DOMContentLoaded', () => {
  function cleanupBrand() {
    try {
      document.querySelectorAll('h1.logo, .logo-link, [data-e2e-messages-title], .logo.no-margin').forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
      });
    } catch (_) {}
  }

  function enableSpellcheck() {
    try {
      document.querySelectorAll('textarea, input, [contenteditable="true"]').forEach((el) => {
        if (el.getAttribute('spellcheck') !== 'true') {
          el.setAttribute('spellcheck', 'true');
        }
      });
    } catch (_) {}
  }

  function applyEnhancements() {
    cleanupBrand();
    enableSpellcheck();
  }

  applyEnhancements();

  const observer = new MutationObserver(applyEnhancements);
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
});
