<script setup lang="ts">
// The logo spread drifting up and to the right. Drawn on a canvas from the clock
// each frame, because Firefox runs a CSS transform this large off the compositor
// and the drift jitters there.
const TILE_W = 520
const TILE_H = 340
const LOOP_MS = 30_000

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const colorMode = useColorMode()

onMounted(() => {
  const el = canvas.value!
  const ctx = el.getContext('2d')!
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  const images: Record<string, HTMLImageElement> = {}
  let pattern: CanvasPattern | null = null
  let frame = 0

  const image = (theme: string) => {
    images[theme] ??= Object.assign(new Image(), { src: `/pattern-${theme}.webp` })
    return images[theme]
  }

  const draw = (now: number) => {
    if (pattern) {
      const dpr = devicePixelRatio
      const p = still ? 0 : (now % LOOP_MS) / LOOP_MS
      const img = image(colorMode.value === 'light' ? 'light' : 'dark')
      pattern.setTransform(new DOMMatrix()
        .scale(dpr)
        .translate(TILE_W * p, -TILE_H * p)
        .scale(TILE_W / img.naturalWidth))
      ctx.clearRect(0, 0, el.width, el.height)
      ctx.fillStyle = pattern
      ctx.fillRect(0, 0, el.width, el.height)
    }
    if (!still) frame = requestAnimationFrame(draw)
  }

  const usePattern = () => {
    const img = image(colorMode.value === 'light' ? 'light' : 'dark')
    img.decode().then(() => {
      pattern = ctx.createPattern(img, 'repeat')
      if (still) draw(0)
    }, () => {})
  }

  const resize = () => {
    el.width = Math.round(innerWidth * devicePixelRatio)
    el.height = Math.round(innerHeight * devicePixelRatio)
    if (still) draw(0)
  }

  resize()
  usePattern()
  addEventListener('resize', resize)
  const stopTheme = watch(() => colorMode.value, usePattern)
  if (!still) frame = requestAnimationFrame(draw)

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    removeEventListener('resize', resize)
    stopTheme()
  })
})
</script>

<template>
  <canvas ref="canvas" class="sheet-pattern" aria-hidden="true" />
</template>

<style>
.sheet-pattern {
  position: fixed;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: 0.07;
  pointer-events: none;
}
</style>
