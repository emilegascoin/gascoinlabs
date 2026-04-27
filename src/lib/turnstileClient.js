// Lazy-loads the Turnstile script and gets a token on demand. Visibility
// (invisible vs managed) is configured on the widget in Cloudflare dashboard.
let scriptPromise

function loadScript() {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.defer = true
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
  return scriptPromise
}

export async function getTurnstileToken() {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  if (!siteKey) throw new Error('VITE_TURNSTILE_SITE_KEY not set')
  await loadScript()

  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.bottom = '-9999px'
    container.style.left = '-9999px'
    document.body.appendChild(container)

    let widgetId
    const cleanup = () => {
      try { window.turnstile.remove(widgetId) } catch {}
      try { document.body.removeChild(container) } catch {}
    }

    widgetId = window.turnstile.render(container, {
      sitekey: siteKey,
      callback: (token) => { cleanup(); resolve(token) },
      'error-callback': () => { cleanup(); reject(new Error('Turnstile error')) },
      'expired-callback': () => { cleanup(); reject(new Error('Turnstile expired')) },
    })
  })
}
