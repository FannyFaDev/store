// ================= SAFE API HELPER =================

// bikin id per tab (TIDAK dipakai backend sekarang)
if (!sessionStorage.getItem('tabSessionId')) {
  sessionStorage.setItem('tabSessionId', crypto.randomUUID())
}

// helper fetch (masih pakai cookie session biasa)
window.apiFetch = (url, options = {}) => {
  const headers = options.headers || {}
  const tabId = sessionStorage.getItem('tabSessionId')
  if (tabId) headers['x-tab-token'] = tabId
  // include credentials so server-set cookies (tabToken) are stored
  return fetch(url, { ...options, headers, credentials: 'same-origin' })
}
