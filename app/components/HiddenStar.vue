<script setup lang="ts">
/** One of the swatch stars hidden around the site (useStars). */
const props = defineProps<{ id: StarId }>()

const { found, total, catchStar } = useStars()
const caught = computed(() => found.value.includes(props.id))
const bursts = ref(0)
const hint = computed(() => {
  if (!caught.value) return 'Ooh, a star!'
  return found.value.length === total ? `All ${total} stars! (ﾉ◕ヮ◕)ﾉ` : `Caught! ${found.value.length} of ${total} stars`
})

function onClick() {
  catchStar(props.id)
  bursts.value++
}
</script>

<template>
  <span class="star-spot">
    <UTooltip :text="hint" v-bind="sheetTooltip">
      <button type="button" class="star" :class="{ 'is-caught': caught }" :style="{ '--tint': STAR_TINTS[id] }"
        :aria-label="caught ? `The ${id} star, caught` : 'A little star'" @click="onClick">
        <span aria-hidden="true">{{ caught ? '✦' : '✧' }}</span>
        <PopBurst :trigger="bursts" :count="6" />
      </button>
    </UTooltip>
    <span class="sr-only" role="status">{{ bursts ? hint : '' }}</span>
  </span>
</template>

<style>
.star {
  /* Violet and indigo are too deep to see on the black, so each tint is lifted to at least
     the pastels' lightness. */
  --star: oklch(from var(--tint) max(l, 0.75) c h);
  position: relative;
  display: inline-grid;
  place-items: center;
  /* A bigger target than the glyph, without moving the text around it. */
  padding: 0.25em;
  margin: -0.25em;
  font-size: 0.95em;
  line-height: 1;
  color: var(--muted);
  opacity: 0.6;
  transition: color 200ms, opacity 200ms;
}

.star:is(:hover, :focus-visible),
.star.is-caught {
  color: var(--star);
  opacity: 1;
}

.star > span {
  display: inline-block;
}

/* A four-point star: a quarter turn lands it back on the same shape. */
html:not(.reduce-motion) .star > span {
  transition: rotate 450ms cubic-bezier(0.3, 1.6, 0.5, 1), scale 450ms cubic-bezier(0.3, 1.6, 0.5, 1);
}

html:not(.reduce-motion) .star:is(:hover, :focus-visible) > span {
  rotate: 90deg;
  scale: 1.25;
}

/* On cream, the same hue at 0.5 lightness, like the other hovers. */
html.light .star {
  --star: oklch(from var(--tint) 0.5 calc(c * 2.2) h);
}
</style>
