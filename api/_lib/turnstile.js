const ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token, ip) {
  if (!token) return false
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY not set')
    return false
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip || '' }),
    })
    if (!res.ok) return false
    const data = await res.json()
    return Boolean(data.success)
  } catch (err) {
    console.error('Turnstile verify error', err)
    return false
  }
}
