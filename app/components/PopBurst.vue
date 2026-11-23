<script setup lang="ts">
/**
 * A one-off pop of little pastel hearts or dots from the middle of its parent, which
 * needs to be positioned. Each new `trigger` value plays it again; 0 shows nothing.
 * Decorative, and skipped under reduced motion.
 */
const props = withDefaults(defineProps<{ trigger: number, shape?: 'heart' | 'dot', count?: number }>(), {
  shape: 'dot',
  count: 8,
})

const { reduced } = useMotionPreference()
const tints = ['var(--pastel-lilac)', 'var(--sky)', 'var(--mint)', 'var(--pastel-peach)', 'var(--pastel-butter)']
const bits = computed(() => Array.from({ length: props.count }, (_, i) => ({
  // Evenly round, nudged back and forth so it doesn't look like a clock face.
  '--angle': `${(360 / props.count) * i + (i % 2 ? 14 : -14)}deg`,
  '--distance': `${1.2 + (i % 3) * 0.4}em`,
  'color': tints[i % tints.length],
})))
</script>

<template>
  <span v-if="trigger && !reduced" :key="trigger" class="burst" aria-hidden="true">
    <!-- U+FE0E keeps the heart a text glyph rather than an emoji. -->
    <span v-for="(style, i) in bits" :key="i" class="burst-bit" :class="`is-${shape}`" :style="style">{{ shape === 'heart' ? '♥︎' : '' }}</span>
  </span>
</template>

<style>
.burst {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.burst-bit {
  grid-area: 1 / 1;
  font-size: 0.75em;
  line-height: 1;
  animation: burst-out 700ms cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
}

.burst-bit.is-dot {
  width: 0.4em;
  height: 0.4em;
  border-radius: 50%;
  background: currentColor;
}

@keyframes burst-out {
  from {
    opacity: 1;
    scale: 0.3;
  }
  70% {
    opacity: 1;
  }
  to {
    opacity: 0;
    scale: 1;
    translate: calc(cos(var(--angle)) * var(--distance)) calc(sin(var(--angle)) * var(--distance));
  }
}
</style>
