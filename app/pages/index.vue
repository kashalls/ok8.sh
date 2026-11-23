<script setup lang="ts">
definePageMeta({ layout: 'sheet', viewTransition: true })

useHead({ title: '𑣲Kashall 𑄝੭' })

defineOgImage('Default', {
  title: 'Kashall',
  description: 'A platform engineer in Oregon who keeps Kubernetes clusters happy and builds tools that make platforms easier to extend.',
})

// Cached on the server; a project without a count just leaves it off.
const { data: stars } = useFetch('/api/repos', { server: false, lazy: true })

// Hovering the WWT chip again and again gets a firmer answer and a shake.
// Each hover within two seconds of the last counts towards it.
const wwtHovers = ref(0)
const wwtShaking = ref(false)
let wwtLastHover = 0
function hoverWwt() {
  const now = Date.now()
  wwtHovers.value = now - wwtLastHover < 2000 ? wwtHovers.value + 1 : 1
  wwtLastHover = now
  if (wwtHovers.value >= 3) wwtShaking.value = true
}
</script>

<template>
  <main class="home">
    <h1 class="sr-only">Kashall</h1>
    <p>Hi, I'm Kashall! I'm a platform engineer living in Oregon.</p>
    <p>
      By day I'm at
      <UTooltip :text="wwtHovers >= 3 ? 'I still work here :)' : 'I work here'" v-bind="sheetTooltip">
        <NuxtLink to="https://www.wwt.com" target="_blank" class="chip" :class="{ 'chip-shake': wwtShaking }" style="--tint: var(--sky)"
          @pointerenter="hoverWwt" @animationend="wwtShaking = false">
          <NuxtImg src="https://www.wwt.com/apple-touch-icon.png" alt="" width="14" height="14" class="chip-logo" />World Wide Technology</NuxtLink>
      </UTooltip>,
      looking after internal infrastructure and operations. That means keeping 2,000+ custom apps happy across
      100+ Kubernetes clusters.
    </p>
    <p>
      I mostly write Go, TypeScript and JavaScript, anything from little Kubernetes tools to web apps like this one.
    </p>
    <p>
      After hours I tinker with my own
      <NuxtLink to="https://github.com/kashalls/infrastructure" target="_blank" class="chip" style="--tint: var(--mint)"><UIcon name="i-simple-icons-kubernetes" class="chip-wheel" />Kubernetes infrastructure</NuxtLink>
      and build tools that make platforms easier to extend. Thanks for stopping by!
    </p>

    <section class="projects">
      <h2 class="projects-title">Projects</h2>
      <ul class="rows">
        <li v-for="project in projects" :key="project.repo">
          <NuxtLink :to="`https://github.com/${project.repo}`" target="_blank" class="row">
            <span class="row-top">
              <span class="row-name">{{ project.name }}</span>
              <span class="row-meta">
                <span>{{ project.lang }}</span>
                <span v-if="stars?.[project.repo] != null" class="row-stars"><span aria-hidden="true">★</span> {{ stars[project.repo] }}<span class="sr-only"> stars</span></span>
              </span>
            </span>
            <span class="row-text">{{ project.description }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.home > * + * {
  margin-top: 1.5rem;
}

.chip-shake {
  animation: chip-shake 400ms ease-in-out;
}

@keyframes chip-shake {
  20% { translate: -3px 0; rotate: -2deg; }
  40% { translate: 3px 0; rotate: 2deg; }
  60% { translate: -2px 0; rotate: -1deg; }
  80% { translate: 2px 0; rotate: 1deg; }
}

/* After the intro, so it outranks the spacing between paragraphs. */
.projects {
  margin-top: 3rem;
}

.projects-title {
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--cream);
}

/* Pops in once the count arrives. */
.row-stars {
  display: inline-block;
  animation: stars-pop 450ms cubic-bezier(0.3, 1.6, 0.5, 1);
}

@keyframes stars-pop {
  from { opacity: 0; scale: 0.5; }
}

/* A logo image rather than an icon, sized to match. */
.chip-logo {
  width: 0.9em;
  height: 0.9em;
  border-radius: 3px;
  transition: rotate 300ms cubic-bezier(0.3, 1.6, 0.5, 1), scale 300ms cubic-bezier(0.3, 1.6, 0.5, 1);
}

.chip:is(:hover, :focus-visible) .chip-logo {
  rotate: -10deg;
  scale: 1.1;
}

/* Kubernetes' logo is a seven-spoke wheel: a seventh of a turn lands it back on
   the same shape. */
.chip-wheel {
  transition: rotate 450ms cubic-bezier(0.3, 1.3, 0.5, 1);
}

.chip:is(:hover, :focus-visible) .chip-wheel {
  rotate: calc(360deg / 7);
}
</style>
