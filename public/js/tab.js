(function(){
  // attach tabToken from sessionStorage or URL to internal links/forms so per-tab sessions work on navigation
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const qsToken = urlParams.get('tabToken');
    const stored = sessionStorage.getItem('tabSessionId');
    const tabId = stored || qsToken;
    if (!tabId) return;
    if (!stored && qsToken) sessionStorage.setItem('tabSessionId', qsToken);

    const isInternal = (href) => {
      try { const u = new URL(href, location.href); return u.origin === location.origin; } catch { return false; }
    }

    const appendToken = (href) => {
      if (!href) return href;
      if (href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')) return href;
      try {
        const u = new URL(href, location.href);
        if (u.origin !== location.origin) return href;
        if (u.searchParams.has('tabToken')) return href;
        u.searchParams.set('tabToken', tabId);
        return u.pathname + (u.search?u.search:'') + (u.hash?u.hash:'');
      } catch (e) { return href; }
    }

    document.querySelectorAll('a[href]').forEach(a => {
      try {
        if (isInternal(a.getAttribute('href'))) a.setAttribute('href', appendToken(a.getAttribute('href')));
      } catch(e){}
    });

    document.querySelectorAll('form[action]').forEach(f => {
      try {
        const action = f.getAttribute('action') || window.location.pathname;
        if (isInternal(action)) f.setAttribute('action', appendToken(action));
      } catch(e){}
    });

    // intercept clicks to ensure dynamic links also get token
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!isInternal(href)) return;
      const newHref = appendToken(href);
      if (newHref !== href) a.setAttribute('href', newHref);
      // if user clicks logout link, clear tabSessionId from sessionStorage
      if (newHref && newHref.split('?')[0].endsWith('/logout')) {
        try { sessionStorage.removeItem('tabSessionId') } catch(e){}
      }
    }, true);
  } catch (e) {
    console.error('tab.js error', e);
  }
})();
