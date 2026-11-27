<script setup lang="ts">
definePageMeta({ layout: 'sheet', viewTransition: true })

useHead({ title: '𑣲Kashall 𑄝੭' })

defineOgImage('Default', {
  title: 'Kashall',
  description: 'A platform engineer in Oregon who keeps Kubernetes clusters happy and builds tools that make platforms easier to extend.',
})

// Cached on the server; a project without a count just leaves it off.
const { data: stars } = useFetch('/api/repos', { server: false, lazy: true })
</script>

<template>
  <main class="home">
    <h1 class="sr-only">Kashall</h1>
    <p>Hi, I'm Kashall! I'm a platform engineer living in Oregon.</p>
    <p>
      By day I look after internal infrastructure and operations. That means keeping 2,000+ custom apps happy
      across 100+ Kubernetes clusters.
    </p>
    <p>
      I mostly write Go, TypeScript and JavaScript, anything from little Kubernetes tools to web apps like this one.
    </p>
    <p>
      After hours I tinker with my own
      <NuxtLink to="https://github.com/kashalls/infrastructure" target="_blank" class="chip" style="--tint: var(--mint)"><UIcon name="i-simple-icons-kubernetes" class="chip-wheel" />Kubernetes infrastructure</NuxtLink>
      and build tools that make platforms easier to extend. Thanks for stopping by! <HiddenStar id="sky" />
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

    <PresenceCard />
  </main>
</template>

<style scoped>
.home > * + * {
  margin-top: 1.5rem;
}

/* After the intro, so it outranks the spacing between paragraphs. */
.projects {
  margin-top: 3rem;
}

.projects-title {
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--heading);
}

/* The negative margin pulls the footer's wavy rule up to 1.5rem below the card. */
.home > .frame-presence {
  margin-top: 3rem;
  margin-bottom: -1.5rem;
}

/* Pops in once the count arrives. */
.row-stars {
  display: inline-block;
  animation: stars-pop 450ms cubic-bezier(0.3, 1.6, 0.5, 1);
}

@keyframes stars-pop {
  from { opacity: 0; scale: 0.5; }
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
