<script setup lang="ts">
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core'

useDisplayPreferences()

const { openContact } = useContact()
const route = useRoute()

// Pages are prerendered, so messages load in the browser. Open pages pick up
// changes on navigation, when the tab comes back into view, and every five
// minutes while it's visible; idle hidden tabs cost nothing.
const { messages, refresh: refreshMessages } = useSiteMessages()
if (import.meta.client) {
  const visibility = useDocumentVisibility()
  onMounted(refreshMessages)
  watch(() => route.path, refreshMessages)
  watch(visibility, (state) => { if (state === 'visible') refreshMessages() })
  useIntervalFn(() => { if (visibility.value === 'visible') refreshMessages() }, 5 * 60_000)
}
// The server decides whether this page load is a new visit. Unavailable under
// `nuxt dev`, where the counter stays hidden.
const visits = ref<number | null>(null)
onMounted(async () => {
  const result = await $fetch<{ count: number }>('/api/visits', { method: 'POST' }).catch(() => null)
  if (result) visits.value = result.count
})
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
        <NuxtLink to="/" aria-label="Kashall, home" class="frame-name frame-logo" :class="{ 'is-gradient': nameGradient }"
          :style="{ backgroundImage: nameGradient }">Kashall</NuxtLink>
        <nav aria-label="Site">
          <ul class="frame-links">
            <li>
              <UTooltip text="Blog" v-bind="sheetTooltip">
                <NuxtLink to="/blog" aria-label="Blog" :aria-current="route.path.startsWith('/blog') ? 'page' : undefined">
                  <UIcon name="i-ph-pen-nib-fill" />
                </NuxtLink>
              </UTooltip>
            </li>
            <li>
              <UTooltip text="Guestbook" v-bind="sheetTooltip">
                <NuxtLink to="/guestbook" aria-label="Guestbook" :aria-current="route.path === '/guestbook' ? 'page' : undefined">
                  <UIcon name="i-ph-signature-fill" />
                </NuxtLink>
              </UTooltip>
            </li>
            <li>
              <UTooltip text="Stats" v-bind="sheetTooltip">
                <NuxtLink to="/stats" aria-label="Stats" :aria-current="route.path === '/stats' ? 'page' : undefined">
                  <UIcon name="i-ph-chart-line-fill" />
                </NuxtLink>
              </UTooltip>
            </li>
            <li>
              <UTooltip text="Email me" v-bind="sheetTooltip">
                <button type="button" aria-label="Email me" @click="openContact()">
                  <UIcon name="i-ph-envelope-simple-fill" />
                </button>
              </UTooltip>
            </li>
          </ul>
        </nav>
      </header>

      <p v-if="messages.maintenance" class="frame-notice" role="status">{{ messages.maintenance }}</p>

      <div v-if="route.path === '/'" class="frame-presence">
        <!-- The presence bar is only on the home page; the name above still takes its colours everywhere.
             Its spot is held while Lanyard connects, so the page doesn't jump when it arrives. -->
        <Transition name="frame-fade">
          <section v-if="lanyard" class="frame-card">
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
      </div>

      <slot />

      <footer class="frame-footer">
        <div class="frame-base">
          <ul class="frame-links">
            <li v-for="social in links" :key="social.to">
              <UTooltip :text="social.label" v-bind="sheetTooltip">
                <NuxtLink :to="social.to" target="_blank" :aria-label="social.label">
                  <UIcon :name="social.iconFill" />
                </NuxtLink>
              </UTooltip>
            </li>
          </ul>
          <div class="frame-end">
            <NuxtLink to="/legal/privacy" class="frame-legal">Privacy</NuxtLink>
            <UTooltip v-if="visits !== null" text="Visitors" v-bind="sheetTooltip">
              <p class="frame-visits">
                <UIcon name="i-ph-eye-fill" />
                {{ visits.toLocaleString('en-US') }}<span class="sr-only"> visitors</span>
              </p>
            </UTooltip>
          </div>
        </div>
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
  font-family: var(--font-nunito);
  color-scheme: dark;
  /* The sheet's diagonal stripes, over the galaxy skirt's violets in the corner. */
  background:
    repeating-linear-gradient(-58deg, transparent 0 46px, rgb(170 104 204 / 0.06) 46px 47.5px),
    radial-gradient(44rem 30rem at 0% 0%, rgb(178 218 241 / 0.08), transparent 70%),
    radial-gradient(36rem 26rem at 100% 0%, rgb(219 136 73 / 0.06), transparent 70%),
    radial-gradient(40rem 30rem at 0% 70%, rgb(177 237 217 / 0.05), transparent 70%),
    radial-gradient(60rem 36rem at 100% 100%, rgb(82 67 156 / 0.55), transparent 70%),
    radial-gradient(80rem 50rem at 85% 110%, rgb(91 63 124 / 0.6), transparent 75%),
    color-mix(in oklab, var(--black) 88%, var(--violet));
  background-attachment: fixed;
}

.sheet ::selection {
  background: var(--sky);
  color: var(--black);
}

.sheet :focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.frame {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: calc(36rem + 2rem);
  margin-inline: auto;
  padding: 4rem 1rem 2rem;
  line-height: 1.5;
}

.frame-header {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
}

/* A wavy thread of the pastels for the lines that frame the page. */
.frame {
  --pastel-rule: linear-gradient(90deg, rgb(178 218 241 / 0.6), rgb(170 104 204 / 0.6), rgb(177 237 217 / 0.55), rgb(219 136 73 / 0.55));
}

.frame-header::after,
.frame-base::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--pastel-rule);
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='6'%3E%3Cpath d='M0 3Q4 0 8 3T16 3' fill='none' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E") 0 0 / 16px 6px repeat-x;
  pointer-events: none;
}

.frame-header::after {
  bottom: -3px;
}

.frame-base::before {
  top: -3px;
}

.frame-name.frame-logo {
  font-size: 1.75rem;
}

/* A maintenance message from the admin page. */
.frame-notice {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
  padding: 0.6rem 0.85rem;
  border: 1px solid rgb(246 194 82 / 0.35);
  border-radius: 14px;
  background: rgb(246 194 82 / 0.08);
  font-size: 0.9rem;
  color: var(--cream);
}

.frame-notice::before {
  content: '';
  flex: none;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  transform: translateY(-0.1em);
}

/* Pinned to the bottom of the window on short pages. */
.frame-footer {
  margin-top: auto;
  padding-top: 3rem;
}

.frame-base {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
}

.frame-end {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.frame-legal {
  font-size: 0.85rem;
  color: var(--muted);
  text-underline-offset: 4px;
  transition: color 200ms;
}

.frame-legal:is(:hover, :focus-visible) {
  color: var(--cream);
  text-decoration: underline wavy var(--pastel-lilac);
}

.frame-visits {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  animation: frame-visits-in 300ms;
}

@keyframes frame-visits-in {
  from { opacity: 0; }
}

/* The card's rendered height (its name and status line, padded), held before it loads.
   No margin below: the home page already spaces its intro from what's above. */
.frame-presence {
  min-height: 4.04rem;
}

/* The Discord user panel: avatar, name and custom status over the nameplate. */
.frame-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  overflow: hidden;
  border-radius: 14px;
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

.frame-links [aria-current] {
  color: var(--cream);
}

.frame-tooltip {
  background: var(--charcoal);
  color: var(--cream);
  font-family: var(--font-nunito);
  --tw-ring-color: var(--rule);
}

/* A small springy hop with the glow, and the icon gives a wiggle. */
.frame-links :is(a, button):is(:hover, :focus-visible) {
  color: var(--hover);
  filter: drop-shadow(0 0 6px var(--hover));
  translate: 0 -2px;
}

.frame-links :is(a, button):is(:hover, :focus-visible) > * {
  animation: frame-wiggle 450ms ease-in-out;
}

@keyframes frame-wiggle {
  25% { rotate: -12deg; }
  50% { rotate: 10deg; }
  75% { rotate: -5deg; }
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

/* Something named in a sentence: an organisation or project with its logo, or a path. */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.05em 0.6em;
  border: 1px solid color-mix(in oklab, var(--tint, var(--pastel-lilac)) 35%, transparent);
  line-height: 1.3;
  /* Sit the chip's text on the sentence's baseline rather than the logo's bottom edge. */
  vertical-align: -0.15em;
  border-radius: 999px;
  /* A chip can set --tint to the pastel of what it names. */
  background: color-mix(in oklab, var(--charcoal) 68%, var(--tint, var(--pastel-lilac)));
  color: var(--cream);
  transition: border-color 200ms, translate 300ms cubic-bezier(0.3, 1.6, 0.5, 1);
}

.chip:is(:hover, :focus-visible) {
  border-color: var(--tint, var(--pastel-lilac));
  translate: 0 -1px;
}

.chip > :first-child {
  font-size: 0.9em;
}

/* Lists of links: projects on home, posts on the blog. */
.rows li + li {
  border-top: 2px dotted var(--rule);
}

/* Rows hop up a little on hover. */
.row {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.85rem 0;
  transition: translate 300ms cubic-bezier(0.3, 1.6, 0.5, 1);
}

.row:is(:hover, :focus-visible) {
  translate: 0 -2px;
}

/* Each row takes the next pastel, washing in behind it from the left on hover. */
.rows > li:nth-child(5n + 1) { --tint: var(--sky); }
.rows > li:nth-child(5n + 2) { --tint: var(--mint); }
.rows > li:nth-child(5n + 3) { --tint: var(--pastel-peach); }
.rows > li:nth-child(5n + 4) { --tint: var(--pastel-lilac); }
.rows > li:nth-child(5n + 5) { --tint: var(--pastel-butter); }

.row::before {
  content: '';
  position: absolute;
  inset: 0 -0.6rem;
  z-index: -1;
  border-radius: 12px;
  background: linear-gradient(90deg, color-mix(in oklab, var(--tint, var(--lilac)) 16%, transparent), transparent);
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
  color: var(--tint, var(--gold));
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

/* Rows as bordered cards: where to go next from the error and gateway pages. */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 0.75rem;
}

.cards .row {
  width: 100%;
  height: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--rule);
  border-radius: 14px;
  text-align: left;
  transition: border-color 250ms, translate 300ms cubic-bezier(0.3, 1.6, 0.5, 1);
}

.cards .row:is(:hover, :focus-visible) {
  border-color: rgb(170 104 204 / 0.5);
}

.cards .row::before {
  inset: 0;
  border-radius: inherit;
}
</style>
