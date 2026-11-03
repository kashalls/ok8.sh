<script setup lang="ts">
definePageMeta({ layout: 'sheet', viewTransition: true })

defineOgImage('Default', {
  title: 'Kashall',
  description: 'Platform engineer based in Oregon, building Kubernetes infrastructure and the tooling around it.',
})

// Cached on the server; a project without a count just leaves it off.
const { data: stars } = useFetch('/api/repos', { server: false, lazy: true })
</script>

<template>
  <main class="home">
    <h1 class="sr-only">Kashall</h1>
    <p>I'm a platform engineer based in Oregon.</p>
    <p>
      I currently work at
      <a href="https://www.wwt.com" target="_blank" rel="noopener" class="chip">
        <NuxtImg src="https://www.wwt.com/apple-touch-icon.png" alt="" width="14" height="14" class="chip-logo" />World Wide Technology</a>,
      on internal infrastructure and operations. My role allows me to develop and maintain critical infrastructure for
      our 2,000+ custom applications across 100+ Kubernetes clusters.
    </p>
    <p>
      Most of the code I write is Go, TypeScript and JavaScript, from Kubernetes tooling to web apps like this site.
    </p>
    <p>
      On the side, I maintain my own
      <a href="https://github.com/waifulabs/infrastructure" target="_blank" rel="noopener" class="chip"><UIcon name="i-simple-icons-kubernetes" class="chip-wheel" />Kubernetes infrastructure</a>
      and write tooling that makes platforms more extensible.
    </p>

    <section class="projects" aria-labelledby="projects-title">
      <h2 id="projects-title" class="projects-title">Projects</h2>
      <ul class="rows">
        <li v-for="project in projects" :key="project.repo">
          <a :href="`https://github.com/${project.repo}`" target="_blank" rel="noopener" class="row">
            <span class="row-top">
              <span class="row-name">{{ project.name }}</span>
              <span class="row-meta">
                <span>{{ project.lang }}</span>
                <span v-if="stars?.[project.repo] != null"><span aria-hidden="true">★</span> {{ stars[project.repo] }}<span class="sr-only"> stars</span></span>
              </span>
            </span>
            <span class="row-text">{{ project.description }}</span>
          </a>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.home > * + * {
  margin-top: 1.5rem;
}

/* An organisation or project named in a sentence, with its logo. */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.05em 0.35em;
  border: 1px solid var(--rule);
  line-height: 1.3;
  /* Sit the chip's text on the sentence's baseline rather than the logo's bottom edge. */
  vertical-align: -0.15em;
  border-radius: 6px;
  background: var(--charcoal);
  color: var(--cream);
  transition: border-color 200ms;
}

.chip:is(:hover, :focus-visible) {
  border-color: var(--lilac);
}

.chip > :first-child {
  font-size: 0.9em;
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
