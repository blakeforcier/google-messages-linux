// Google Messages Polished Theme Content Script
(function () {
  'use strict';

  const transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAAElFTkSuQmCC';

  // 1. Sync System Color Scheme
  function applyRootClasses() {
    const root = document.documentElement;
    if (!root) return;
    root.classList.add('polished-theme-active');

    const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');
    function updateThemeClass(e) {
      if (e.matches) {
        root.classList.add('os-prefers-dark');
        root.classList.remove('os-prefers-light');
      } else {
        root.classList.add('os-prefers-light');
        root.classList.remove('os-prefers-dark');
      }
    }
    updateThemeClass(darkMatcher);
    darkMatcher.addEventListener('change', updateThemeClass);
  }

  // 2. Window Title & Top-Left Window Icon
  function enforceCleanTitleAndIcon() {
    try {
      const current = document.title || '';
      const unread = current.match(/^\((\d+)\)/);
      const target = unread ? `(${unread[1]}) Messages` : 'Messages';
      if (document.title !== target) {
        document.title = target;
      }

      document.querySelectorAll('link[rel*="icon"]').forEach((link) => {
        if (link.href !== transparentPixel) {
          link.href = transparentPixel;
        }
      });
    } catch (_) {}
  }

  // 3. Hide Redundant "Google Messages" Branding & Top Logo
  function hideRedundantHeaderBranding() {
    try {
      const root = document.body || document.documentElement;
      if (!root) return;

      root.querySelectorAll('h1.logo, .logo-link, [data-e2e-messages-title], .logo.no-margin').forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
      });
    } catch (_) {}
  }

  // 4. Lifecycle initialization & continuous observer
  function init() {
    applyRootClasses();
    enforceCleanTitleAndIcon();
    hideRedundantHeaderBranding();

    const titleEl = document.querySelector('title');
    if (titleEl) {
      const titleObserver = new MutationObserver(enforceCleanTitleAndIcon);
      titleObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }

    const domObserver = new MutationObserver(() => {
      enforceCleanTitleAndIcon();
      hideRedundantHeaderBranding();
    });

    if (document.body) {
      domObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      domObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
