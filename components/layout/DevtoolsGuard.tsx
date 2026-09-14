'use client';

import { useEffect } from 'react';

// Client-side deterrent: blocks right-click and common devtools shortcuts.
// Note: this is a UX deterrent only — real security is enforced server-side
// (auth, input validation, server-side pricing). Devtools can still be opened
// with JS disabled, so never rely on this for sensitive logic.
export function DevtoolsGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const blockContext = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    const blockKeys = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I / J / C, Ctrl+U, Cmd+Option+I
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) ||
        ((e.ctrlKey || e.metaKey) && ['U', 'u'].includes(e.key))
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', blockContext);
    document.addEventListener('keydown', blockKeys);

    // Cosmetic devtools-open detection (size delta). Non-reliable but discourages.
    let warn = false;
    const onResize = () => {
      if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        if (!warn) {
          warn = true;
          document.body.innerHTML =
            '<div style="font:16px/1.6 system-ui,sans-serif;padding:40px;max-width:560px;margin:auto">Developer tools are disabled on this site. Please close them to continue.</div>';
        }
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('contextmenu', blockContext);
      document.removeEventListener('keydown', blockKeys);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return null;
}
