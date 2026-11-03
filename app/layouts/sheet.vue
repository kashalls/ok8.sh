<script setup lang="ts">
useDisplayPreferences()

const { openContact } = useContact()
const route = useRoute()
// Discord has the footer's presence bar instead.
const links = socials.filter(social => social.label !== 'Discord')
const lanyard = useLanyard()
const custom = computed(() => lanyard.value?.activities.find(a => a.type === ActivityType.Custom))
const nameplate = computed(() => lanyard.value?.discord_user.collectibles?.nameplate)
const decoration = computed(() => lanyard.value?.discord_user.avatar_decoration_data)
const nameGradient = computed(() => {
  const colors = lanyard.value?.discord_user.display_name_styles?.colors
  return colors?.length ? `linear-gradient(90deg, ${colors.map(c => `#${c.toString(16).padStart(6, '0')}`).join(', ')})` : undefined
})
// Stills show first; an animated version (tens of times the size) loads in the
// background and replaces its still once it has arrived, unless reduced motion is
// on. Keyed on the URL, since every presence update brings new objects.
const { reduced } = useMotionPreference()
function animatedOnceLoaded(url: () => string | undefined) {
  const ready = ref(false)
  watch([url, reduced], ([src, still]) => {
    ready.value = false
    if (!src || still || !import.meta.client) return
    const image = new Image()
    image.onload = () => {
      if (url() === src && !reduced.value) ready.value = true
    }
    image.src = src
  }, { immediate: true })
  return ready
}
const nameplateAnimated = animatedOnceLoaded(() => nameplate.value ? nameplateUrl(nameplate.value.asset, true) : undefined)
const decorationAnimated = animatedOnceLoaded(() => decoration.value ? decorationUrl(decoration.value.asset, true) : undefined)
</script>

<template>
  <div class="sheet">
    <div class="frame">
      <!-- Holds the spot for the logo. -->
      <header class="frame-header">
        <NuxtLink to="/" class="frame-name frame-logo" :class="{ 'is-gradient': nameGradient }"
          :style="{ backgroundImage: nameGradient }">Kashall</NuxtLink>
        <nav class="frame-nav" aria-label="Site">
          <NuxtLink to="/posts" class="frame-nav-link" :aria-current="route.path.startsWith('/posts') ? 'page' : undefined">Blog</NuxtLink>
          <ul class="frame-links">
            <li v-for="social in links" :key="social.to">
              <a :href="social.to" target="_blank" rel="noopener" :aria-label="social.label" :title="social.label">
                <UIcon :name="social.iconFill" />
              </a>
            </li>
            <li>
              <button type="button" aria-label="Email me" title="Email me" @click="openContact()">
                <UIcon name="i-ph-envelope-simple-fill" />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <slot />

      <!-- The presence bar is only on the home page; the name above still takes its colours everywhere. -->
      <footer v-if="route.path === '/'" class="frame-footer">
        <Transition name="frame-fade">
          <section v-if="lanyard" class="frame-card" aria-label="Discord presence">
            <Transition name="frame-fade">
              <NuxtImg v-if="nameplate" :src="nameplateUrl(nameplate.asset, nameplateAnimated)" alt="" width="448" height="84"
                class="frame-nameplate" />
            </Transition>
            <span class="frame-avatar">
              <NuxtImg :src="avatarUrl(lanyard.discord_user.id, lanyard.discord_user.avatar)" alt="" width="36" height="36" />
              <NuxtImg v-if="decoration" :src="decorationUrl(decoration.asset, decorationAnimated)" alt="" width="44"
                height="44" class="frame-decoration" />
              <span class="frame-dot" :style="{ background: statusColor(lanyard.discord_status) }" />
            </span>
            <div class="frame-who">
              <span class="frame-name" :class="{ 'is-gradient': nameGradient }" :style="{ backgroundImage: nameGradient }">Kashall</span>
              <p class="frame-custom">
                <span class="sr-only">{{ STATUS[lanyard.discord_status]?.label ?? 'Offline' }} on Discord.</span>
                <template v-if="custom?.state || custom?.emoji">
                  <NuxtImg v-if="custom.emoji?.id" :src="`https://cdn.discordapp.com/emojis/${custom.emoji.id}.webp?size=32`"
                    :alt="custom.emoji.name" width="14" height="14" />
                  <template v-else-if="custom.emoji">{{ custom.emoji.name }}</template>
                  <span class="truncate">{{ custom.state }}</span>
                </template>
              </p>
            </div>
          </section>
        </Transition>
      </footer>
    </div>
    <ContactDialog />
  </div>
</template>

<style>
.sheet {
  /* Nuxt UI components (legal prose) take the same palette. */
  --ui-primary: var(--gold);
  --ui-text-dimmed: var(--muted);
  --ui-text-muted: var(--text);
  --ui-text-toned: var(--text);
  --ui-text: var(--text);
  --ui-text-highlighted: var(--cream);
  --ui-bg: var(--black);
  --ui-bg-muted: var(--charcoal);
  --ui-bg-elevated: var(--charcoal);
  --ui-bg-accented: var(--charcoal);
  --ui-border: var(--rule);
  --ui-border-muted: var(--rule);
  --ui-border-accented: var(--lilac);

  min-height: 100dvh;
  color: var(--text);
  font-family: var(--font-karla);
  color-scheme: dark;
  /* The sheet's diagonal stripes, over the galaxy skirt's violets in the corner. */
  background:
    repeating-linear-gradient(-58deg, transparent 0 46px, rgb(170 104 204 / 0.06) 46px 47.5px),
    radial-gradient(60rem 36rem at 100% 100%, rgb(82 67 156 / 0.55), transparent 70%),
    radial-gradient(80rem 50rem at 85% 110%, rgb(91 63 124 / 0.6), transparent 75%),
    var(--black);
  background-attachment: fixed;
}

.sheet ::selection {
  background: var(--sky);
  color: var(--black);
}

.sheet :focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
  border-radius: 2px;
}

.frame {
  max-width: calc(36rem + 2rem);
  margin-inline: auto;
  padding: 4rem 1rem 8rem;
  line-height: 1.5;
}

.frame-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.frame-name.frame-logo {
  font-size: 1.75rem;
}

.frame-footer {
  margin-top: 3rem;
}

/* The Discord user panel: avatar, name and custom status over the nameplate. */
.frame-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  overflow: hidden;
  border-radius: 8px;
  /* The nameplate's palette (violet), under its art. */
  background: linear-gradient(90deg, rgb(91 63 124 / 0.2), rgb(91 63 124 / 0.5));
}

.frame-card > :not(.frame-nameplate) {
  position: relative;
}

.frame-nameplate {
  position: absolute;
  top: 0;
  right: 0;
  width: auto;
  height: 100%;
  pointer-events: none;
}

.frame-fade-enter-active {
  transition: opacity 300ms;
}

.frame-fade-enter-from {
  opacity: 0;
}

.frame-avatar {
  flex: none;
  width: 36px;
  height: 36px;
}

/* A ring cut out of the avatar around the dot, so the card shows through. */
.frame-avatar img {
  border-radius: 50%;
  mask: radial-gradient(circle at 31.5px 31.5px, transparent 8px, #000 8.5px);
}

/* Discord draws decorations 1.2 times the avatar's size, centred on it. The ring is
   cut from it too, at the same spot in its own box. */
.frame-avatar .frame-decoration {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  max-width: none;
  border-radius: 0;
  mask: radial-gradient(circle at 35.1px 35.1px, transparent 8px, #000 8.5px);
  pointer-events: none;
}

/* The status dot, on the avatar's corner. */
.frame-dot {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.frame-who {
  min-width: 0;
}

/* Only as wide as the name, so the whole gradient shows across it. */
.frame-name {
  display: inline-block;
  font-family: var(--font-sniglet);
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--cream);
}

.frame-name.is-gradient {
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* Twice the name's width, sliding to one end and back so the last colour never
     blends into the first. Reduced motion stops it through the global
     .reduce-motion class. */
  background-size: 200% 100%;
  animation: frame-shimmer 4s ease-in-out infinite alternate;
}

@keyframes frame-shimmer {
  to {
    background-position: 100% 0;
  }
}

.frame-custom {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  line-height: 1.3;
  color: var(--muted);
  text-shadow: 0 1px 3px rgb(26 25 24 / 0.8);
}

/* Lets a long status shrink and end in an ellipsis. */
.frame-custom > .truncate {
  min-width: 0;
}

.frame-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.frame-nav-link {
  font-size: 0.95rem;
  color: var(--muted);
  transition: color 200ms;
}

.frame-nav-link:hover,
.frame-nav-link[aria-current] {
  color: var(--cream);
}

.frame-links {
  display: flex;
  gap: 1rem;
}

.frame-links > li {
  --hover: var(--mint);
}

/* The eyes' two colours, alternating. */
.frame-links > li:nth-child(even) {
  --hover: var(--orange);
}

.frame-links :is(a, button) {
  display: flex;
  font-size: 1.1rem;
  color: var(--muted);
  transition: color 200ms, filter 200ms, translate 300ms cubic-bezier(0.3, 1.6, 0.5, 1);
}

/* A small springy hop with the glow. */
.frame-links :is(a, button):is(:hover, :focus-visible) {
  color: var(--hover);
  filter: drop-shadow(0 0 6px var(--hover));
  translate: 0 -2px;
}

/* A page's own title: a post, the blog and the legal pages. */
.doc-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--cream);
}

/* Long-form text: posts and the legal pages. */
.doc-body {
  line-height: 1.75;
}

.doc-body :is(h2, h3, h4) {
  font-family: var(--font-display);
  font-weight: 400;
  color: var(--cream);
}

/* Lists of links: projects on home, posts on the blog. */
.rows li + li {
  border-top: 1px solid var(--rule);
}

.row {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.85rem 0;
}

/* The Discord bar's violet, washing in behind the row from the left. */
.row::before {
  content: '';
  position: absolute;
  inset: 0 -0.6rem;
  z-index: -1;
  border-radius: 6px;
  background: linear-gradient(90deg, rgb(91 63 124 / 0.35), rgb(91 63 124 / 0.08));
  opacity: 0;
  transition: opacity 250ms;
}

.row:is(:hover, :focus-visible)::before {
  opacity: 1;
}

.row-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.row-name {
  color: var(--cream);
  transition: color 200ms, translate 250ms ease-out;
}

.row:is(:hover, :focus-visible) .row-name {
  color: var(--gold);
  translate: 0.25rem 0;
}

.row-meta {
  display: flex;
  flex: none;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.row-text {
  font-size: 0.9rem;
  color: var(--muted);
}
</style>
