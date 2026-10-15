// Preload script for Messages Desktop App
window.addEventListener('DOMContentLoaded', () => {
  // Hide redundant header branding
  function cleanupUI() {
    try {
      // Find hamburger menu button and hide sibling logo/title elements
      const buttons = document.querySelectorAll('button, [role="button"]');
      buttons.forEach((btn) => {
        const isMenu =
          btn.getAttribute('aria-label')?.toLowerCase().includes('menu') ||
          btn.querySelector('mat-icon, svg, [data-mat-icon-name*="menu"]') ||
          (btn.textContent && btn.textContent.trim() === 'menu');

        if (isMenu) {
          let sib = btn.nextElementSibling;
          while (sib) {
            // Stop if it's the search input or user avatar
            if (sib.querySelector('input') || sib.querySelector('img[src*="googleusercontent"]')) {
              break;
            }
            sib.style.setProperty('display', 'none', 'important');
            sib.style.setProperty('visibility', 'hidden', 'important');
            sib = sib.nextElementSibling;
          }
        }
      });

      // Also target any element whose text is "Google Messages"
      document.querySelectorAll('span, div, h1, h2, a, p').forEach((el) => {
        if (el.closest('[role="log"], mw-conversation-list-item, .mat-mdc-list-item, .msg-bubble')) {
          return;
        }
        const txt = (el.textContent || '').trim().replace(/\s+/g, ' ');
        if (txt === 'Google Messages' || txt === 'Messages') {
          const isTopBar = el.closest('header, [role="banner"], mw-main-nav, .header, nav, mw-app > div');
          if (isTopBar && !el.closest('button, [role="button"]')) {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
          }
        }
      });
    } catch (_) {}
  }

  cleanupUI();

  const observer = new MutationObserver(cleanupUI);
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
});
