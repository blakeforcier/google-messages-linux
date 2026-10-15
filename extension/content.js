// Google Messages Polished Theme Content Script (True Black OLED)
(function () {
  'use strict';

  const transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAAElFTkSuQmCC';

  // 1. Sync System Color Scheme
  function applyRootClasses() {
    const root = document.documentElement;
    if (!root) return;
    root.classList.add('polished-theme-active');
    root.classList.add('oled-black-theme');
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

      // Strategy 0: Exact selectors found in DOM
      root.querySelectorAll('h1.logo, .logo-link, [data-e2e-messages-title], .logo.no-margin').forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
      });

      // Strategy A: Find the hamburger menu button and hide adjacent logo / title siblings
      const allButtons = root.querySelectorAll('button, [role="button"]');
      allButtons.forEach((btn) => {
        const isMenu =
          btn.getAttribute('aria-label')?.toLowerCase().includes('menu') ||
          btn.querySelector('mat-icon, svg, [data-mat-icon-name*="menu"]') ||
          (btn.textContent && btn.textContent.trim() === 'menu');

        if (isMenu) {
          // Look at next sibling elements in the top navigation bar
          let sib = btn.nextElementSibling;
          while (sib) {
            // Stop if it's the search input, user avatar, or end container
            if (sib.querySelector('input') || sib.querySelector('img[src*="googleusercontent"]')) {
              break;
            }
            sib.style.setProperty('display', 'none', 'important');
            sib.style.setProperty('visibility', 'hidden', 'important');
            sib = sib.nextElementSibling;
          }
        }
      });

      // Strategy B: Any element whose textContent is "Google Messages"
      const candidates = root.querySelectorAll('span, div, h1, h2, a, p');
      candidates.forEach((el) => {
        if (el.closest('[role="log"], mw-conversation-list-item, .mat-mdc-list-item, .msg-bubble')) {
          return;
        }
        const txt = (el.textContent || '').trim().replace(/\s+/g, ' ');
        if (txt === 'Google Messages' || txt === 'Messages') {
          // Only hide if it's in the top header area
          const isTopBar = el.closest('header, [role="banner"], mw-main-nav, .header, nav, mw-app > div');
          const isActionButton = el.closest('button, [role="button"]');
          if (isTopBar && !isActionButton) {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
          }
        }
      });

      // Strategy C: Target explicit Google logo / branding attributes
      root.querySelectorAll('[aria-label="Google Messages"], [title="Google Messages"], [aria-label*="Google Messages"]').forEach((el) => {
        if (!el.closest('[role="log"], mw-conversation-list-item')) {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
        }
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
        subtree: true,
        characterData: true
      });
    } else {
      domObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
