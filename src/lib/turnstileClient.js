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

    // Safety net — if the widget never fires, fail fast so the caller can
    // proceed without a token rather than making the user wait
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('Turnstile timed out'))
    }, 7000)

    widgetId = window.turnstile.render(container, {
      sitekey: siteKey,
      callback: (token) => { clearTimeout(timeout); cleanup(); resolve(token) },
      'error-callback': () => { clearTimeout(timeout); cleanup(); reject(new Error('Turnstile error')) },
      'expired-callback': () => { clearTimeout(timeout); cleanup(); reject(new Error('Turnstile expired')) },
    })
  })
}
