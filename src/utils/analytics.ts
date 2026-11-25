/** Anonymous operation counts. Never pass user content or persistent identifiers. */
export function trackUsage(event: 'page.view' | 'image.export'): void {
  if (import.meta.env.DEV || navigator.doNotTrack === '1') return
  try {
    if (localStorage.getItem('usage-analytics') === 'off' || localStorage.getItem('blog-analytics') === 'off') return
    const body = JSON.stringify({ project: 'wallpaper-generator', event_id: crypto.randomUUID(), event, properties: {} })
    void fetch('https://api.webkubor.online/v1/analytics/events', {
      method: 'POST', body, keepalive: true, credentials: 'omit', referrerPolicy: 'no-referrer',
      headers: { 'content-type': 'application/json' },
    }).catch(() => {})
  } catch { /* Measurement must never interrupt editing or exports. */ }
}
