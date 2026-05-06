import * as SentryNode from '@sentry/node'

let initialised = false

function getSentry() {
  if (!process.env.SENTRY_DSN) return null
  if (!initialised) {
    SentryNode.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0 })
    initialised = true
  }
  return SentryNode
}

export function captureError(err, context = {}) {
  try {
    const s = getSentry()
    if (!s) return
    s.withScope((scope) => {
      scope.setExtras(context)
      s.captureException(err)
    })
  } catch {
    // Sentry must never take down the response
  }
}
