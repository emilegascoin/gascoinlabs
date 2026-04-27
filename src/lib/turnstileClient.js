// Lazy-loads the Turnstile script and renders an invisible widget on demand.
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
    container.style.display = 'none'
    document.body.appendChild(container)
    window.turnstile.render(container, {
      sitekey: siteKey,
      size: 'invisible',
      callback: (token) => {
        resolve(token)
        document.body.removeChild(container)
      },
      'error-callback': () => {
        reject(new Error('Turnstile error'))
        document.body.removeChild(container)
      },
    })
  })
}
