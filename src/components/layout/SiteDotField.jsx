import { useEffect, useRef } from 'react'

const NAVY = '31, 58, 95'
const SPACING = 8
const DOT_CORE_RADIUS = 0.9
const DOT_FADE_RADIUS = 1.05
const DOT_ALPHA = 0.07
const ACTIVE_RADIUS = 170
const MAX_SHIFT = 2

export default function SiteDotField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let width = 0
    let height = 0
    let activity = 0
    let dotSprite = null
    let target = null
    let cursor = null

    function createDotSprite(dpr) {
      const sprite = document.createElement('canvas')
      const size = Math.ceil((DOT_FADE_RADIUS * 2 + 2) * dpr)
      const cssSize = size / dpr
      const center = cssSize / 2
      const spriteCtx = sprite.getContext('2d')
      sprite.width = size
      sprite.height = size
      spriteCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const gradient = spriteCtx.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        DOT_FADE_RADIUS,
      )
      gradient.addColorStop(0, `rgba(${NAVY}, ${DOT_ALPHA})`)
      gradient.addColorStop(DOT_CORE_RADIUS / DOT_FADE_RADIUS, `rgba(${NAVY}, ${DOT_ALPHA})`)
      gradient.addColorStop(1, `rgba(${NAVY}, 0)`)

      spriteCtx.fillStyle = gradient
      spriteCtx.fillRect(0, 0, cssSize, cssSize)

      return { image: sprite, size: cssSize }
    }

    function gridOffset(value) {
      return ((value % SPACING) + SPACING) % SPACING
    }

    function requestDraw() {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dotSprite = createDotSprite(dpr)
      draw()
    }

    function setTarget(event) {
      if (reducedMotion) return
      target = { x: event.clientX, y: event.clientY }
      requestDraw()
    }

    function clearTarget() {
      target = null
      if (!reducedMotion) requestDraw()
    }

    function tick() {
      frame = 0
      if (target) {
        cursor = cursor
          ? {
              x: cursor.x + (target.x - cursor.x) * 0.1,
              y: cursor.y + (target.y - cursor.y) * 0.1,
            }
          : target
        activity += (1 - activity) * 0.2
      } else if (cursor) {
        activity *= 0.84
        if (activity < 0.01) {
          cursor = null
          activity = 0
        }
      }

      draw()
      if (target || cursor) frame = requestAnimationFrame(tick)
    }

    function draw() {
      if (!dotSprite) return

      ctx.clearRect(0, 0, width, height)
      const startX = SPACING / 2 - gridOffset(window.scrollX)
      const startY = SPACING / 2 - gridOffset(window.scrollY)

      for (let y = startY; y < height + SPACING; y += SPACING) {
        for (let x = startX; x < width + SPACING; x += SPACING) {
          let dx = 0
          let dy = 0

          if (cursor) {
            const distanceX = x - cursor.x
            const distanceY = y - cursor.y
            const distance = Math.hypot(distanceX, distanceY)
            const influence = Math.max(0, 1 - distance / ACTIVE_RADIUS) * activity
            if (influence > 0) {
              const shift = MAX_SHIFT * influence
              dx = distance ? (distanceX / distance) * shift : 0
              dy = distance ? (distanceY / distance) * shift : 0
            }
          }

          ctx.drawImage(
            dotSprite.image,
            x + dx - dotSprite.size / 2,
            y + dy - dotSprite.size / 2,
            dotSprite.size,
            dotSprite.size,
          )
        }
      }
    }

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', requestDraw, { passive: true })
    window.addEventListener('pointermove', setTarget, { passive: true })
    window.addEventListener('pointerleave', clearTarget)
    resize()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', requestDraw)
      window.removeEventListener('pointermove', setTarget)
      window.removeEventListener('pointerleave', clearTarget)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={canvasRef} className="site-dot-field" aria-hidden="true" />
}
