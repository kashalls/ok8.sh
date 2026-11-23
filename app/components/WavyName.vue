<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'

/**
 * A name that waves letter by letter on hover (or when a link around it has keyboard
 * focus) and squishes on click. A transformed letter drops out of its parent's
 * background-clip, so each letter paints its own slice of the gradient, offset by where
 * it sits in the word, and the slices shimmer together.
 */
const props = defineProps<{ text: string, gradient?: string }>()

const letters = computed(() => [...props.text])
const word = ref<HTMLElement | null>(null)
function measure() {
  const el = word.value
  if (!el) return
  el.parentElement!.style.setProperty('--name-w', `${el.offsetWidth}px`)
  for (const letter of el.children as HTMLCollectionOf<HTMLElement>) letter.style.setProperty('--x', `${letter.offsetLeft}px`)
}
useResizeObserver(word, measure)
onMounted(() => document.fonts.ready.then(measure))

const squishing = ref(false)
</script>

<template>
  <span class="wavy" :class="{ 'has-gradient': gradient }" :style="{ '--name-gradient': gradient }" @click="squishing = true">
    <span class="sr-only">{{ text }}</span>
    <span ref="word" class="wavy-word" :class="{ 'is-squishing': squishing }" aria-hidden="true"
      @animationend.self="squishing = false">
      <span v-for="(letter, i) in letters" :key="i" class="wavy-letter" :style="{ '--i': i }">{{ letter }}</span>
    </span>
  </span>
</template>

<style>
/* Registered so the shimmer can animate it. */
@property --name-shift {
  syntax: '<length>';
  inherits: true;
  initial-value: 0px;
}

.wavy {
  display: inline-block;
}

.wavy-word {
  position: relative;
  display: inline-block;
  transform-origin: 50% 100%;
}

.wavy-letter {
  display: inline-block;
}

/* Twice the name's width, sliding to one end and back so the last colour never blends
   into the first. Reduced motion stops it through the global .reduce-motion class. */
.wavy.has-gradient {
  animation: wavy-shimmer 4s ease-in-out infinite alternate;
}

.wavy.has-gradient .wavy-letter {
  background-image: var(--name-gradient);
  background-size: calc(var(--name-w, 100%) * 2) 100%;
  background-position: calc(-1 * var(--x, 0px) - var(--name-shift)) 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@keyframes wavy-shimmer {
  to { --name-shift: var(--name-w, 0px); }
}

.wavy:hover .wavy-letter,
:focus-visible > .wavy .wavy-letter {
  animation: wavy-hop 500ms ease-in-out calc(var(--i) * 45ms) both;
}

@keyframes wavy-hop {
  35% { translate: 0 -0.2em; }
  70% { translate: 0 0.02em; }
}

.wavy-word.is-squishing {
  animation: wavy-squish 450ms ease-out;
}

@keyframes wavy-squish {
  25% { scale: 1.12 0.84; }
  55% { scale: 0.94 1.08; }
  80% { scale: 1.02 0.98; }
}
</style>
