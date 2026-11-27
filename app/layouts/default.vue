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
// Discord has the presence card on the home page instead.
const links = socials.filter(social => social.label !== 'Discord')
// Follows the system theme until the visitor picks one; Nuxt UI's color mode remembers it.
const colorMode = useColorMode()
const isLight = computed(() => colorMode.value === 'light')
const themeSpinning = ref(false)
// Switches to the opposite of what's showing. When that's the system's own theme, it goes back
// to following the system rather than pinning a theme the system might later change away from.
async function toggleTheme(event: MouseEvent) {
  const next = isLight.value ? 'dark' : 'light'
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const apply = async () => {
    colorMode.preference = next === system ? 'system' : next
    // Color mode sets the class on <html> in a watcher; the transition snapshots after this.
    await nextTick()
  }
  if (reduced.value || !document.startViewTransition) return apply()
  // Only once motion is allowed: under reduced motion the spin never runs, so animationend
  // would never clear it.
  themeSpinning.value = true
  // The new theme spills out from the toggle in a circle (see .theme-reveal in main.css).
  const { left, top, width, height } = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = left + width / 2
  const y = top + height / 2
  const root = document.documentElement
  root.style.setProperty('--reveal-x', `${x}px`)
  root.style.setProperty('--reveal-y', `${y}px`)
  root.style.setProperty('--reveal-r', `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`)
  root.classList.add('theme-reveal')
  await document.startViewTransition(apply).finished.catch(() => {})
  root.classList.remove('theme-reveal')
}
// Tints the browser's toolbar on phones to match: the cream or the black swatch.
useHead({ meta: [{ name: 'theme-color', content: () => isLight.value ? '#fcf6ed' : '#1a1918' }] })
// Every hundredth visitor gets a little celebration.
const milestone = computed(() => !!visits.value && visits.value % 100 === 0)

// What I'm probably up to, by the time in Oregon. Updated each minute; only shown in the browser.
const now = ref(new Date())
if (import.meta.client) useIntervalFn(() => { now.value = new Date() }, 60_000)
const localTime = computed(() => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit', weekday: 'short', hourCycle: 'h23',
  }).formatToParts(now.value).map(part => [part.type, part.value]))
  const hour = Number(parts.hour)
  const weekend = parts.weekday === 'Sat' || parts.weekday === 'Sun'
  const clock = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' }).format(now.value).toLowerCase()
  const doing = hour < 6 ? 'probably asleep'
    : hour < 7 ? 'probably getting ready for work'
      : hour < 16 ? (weekend ? 'probably tinkering with something' : 'probably at work')
        : hour < 22 ? 'probably tinkering with something'
          : 'probably meant to be asleep'
  return { clock, doing, night: hour < 6 || hour >= 20 }
})
// Pages are prerendered, so this is the year of the last build.
const year = new Date().getFullYear()
const socialHints: Record<string, string> = { GitHub: 'Peek at my code' }
const { all: allStars } = useStars()
const { reduced } = useMotionPreference()
</script>

<template>
  <div class="sheet">
    <SheetPattern />
    <div class="frame">
      <header class="frame-header">
        <NuxtLink to="/" aria-label="Kashall, home" class="frame-logo">
          <NuxtImg src="/logo.webp" alt="" width="360" height="176" preload draggable="false" />
        </NuxtLink>
        <nav aria-label="Site">
          <ul class="frame-links frame-nav">
            <li>
              <NuxtLink to="/blog" class="frame-pill" :aria-current="route.path.startsWith('/blog') ? 'page' : undefined">
                <UIcon name="i-ph-pen-nib-fill" />Blog
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/guestbook" class="frame-pill" :aria-current="route.path === '/guestbook' ? 'page' : undefined">
                <UIcon name="i-ph-signature-fill" />Guestbook
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/stats" class="frame-pill" :aria-current="route.path === '/stats' ? 'page' : undefined">
                <UIcon name="i-ph-chart-line-fill" />Stats
              </NuxtLink>
            </li>
            <li>
              <button type="button" class="frame-pill" @click="openContact()">
                <UIcon name="i-ph-envelope-simple-fill" />Say hi
              </button>
            </li>
            <li>
              <!-- Prerendered pages can't know the visitor's theme, so the toggle renders in the browser. -->
              <ClientOnly>
                <UTooltip :text="isLight ? 'Lights off' : 'Lights on'" v-bind="sheetTooltip">
                  <button type="button" :aria-label="isLight ? 'Switch to the dark theme' : 'Switch to the light theme'"
                    class="frame-pill frame-pill-icon" :class="{ 'is-spinning': themeSpinning }" @click="toggleTheme"
                    @animationend="themeSpinning = false">
                    <UIcon v-if="isLight" name="i-ph-moon-stars-fill" />
                    <UIcon v-else name="i-ph-sun-fill" />
                  </button>
                </UTooltip>
                <template #fallback>
                  <span class="frame-theme-slot" />
                </template>
              </ClientOnly>
            </li>
          </ul>
        </nav>
      </header>

      <p v-if="messages.maintenance" class="frame-notice" role="status">{{ messages.maintenance }}</p>

      <!-- The time in Oregon only makes sense in the browser; the fallback holds its line. -->
      <ClientOnly v-if="route.path === '/'">
        <p class="frame-localtime">
          <UIcon :name="localTime.night ? 'i-ph-moon-fill' : 'i-ph-sun-fill'" class="frame-localtime-icon" />
          It's {{ localTime.clock }} in Oregon, so I'm {{ localTime.doing }}.
        </p>
        <template #fallback>
          <p class="frame-localtime" aria-hidden="true">&nbsp;</p>
        </template>
      </ClientOnly>

      <slot />

      <footer class="frame-footer">
        <div class="frame-base">
          <ul class="frame-links">
            <li v-for="social in links" :key="social.to">
              <UTooltip :text="socialHints[social.label] ?? social.label" v-bind="sheetTooltip">
                <NuxtLink :to="social.to" target="_blank" :aria-label="social.label">
                  <UIcon :name="social.iconFill" />
                </NuxtLink>
              </UTooltip>
            </li>
          </ul>
          <div class="frame-end">
            <NuxtLink to="/legal/privacy" class="frame-legal">Privacy</NuxtLink>
            <UTooltip v-if="visits !== null" :text="milestone ? `You're friend #${visits.toLocaleString('en-US')}! (ﾉ◕ヮ◕)ﾉ` : 'Friends who stopped by'"
              v-bind="sheetTooltip">
              <p class="frame-visits" :class="{ 'is-milestone': milestone }">
                <UIcon name="i-ph-eye-fill" />
                {{ visits.toLocaleString('en-US') }}<span class="sr-only"> visitors</span>
                <PopBurst :trigger="milestone ? 1 : 0" :count="10" />
              </p>
            </UTooltip>
          </div>
        </div>
        <p class="frame-signoff">
          © {{ year }} Kashall<span class="frame-signoff-sep" aria-hidden="true">·</span>made with
          <span class="frame-heart" role="img" aria-label="love">♡</span> in Oregon <HiddenStar id="gold" />
          <span v-if="allStars" class="frame-signoff-stars">
            <span class="frame-signoff-sep" aria-hidden="true">·</span>caught every star with you
          </span>
        </p>
      </footer>
    </div>
    <ContactDialog />
  </div>
</template>

<style>
.sheet {
  /* Nuxt UI components (legal prose) take the same palette. */
  --ui-primary: var(--accent);
  --ui-text-dimmed: var(--muted);
  --ui-text-muted: var(--text);
  --ui-text-toned: var(--text);
  --ui-text: var(--text);
  --ui-text-highlighted: var(--heading);
  --ui-bg: var(--bg);
  --ui-bg-muted: var(--surface);
  --ui-bg-elevated: var(--surface);
  --ui-bg-accented: var(--surface);
  --ui-border: var(--rule);
  --ui-border-muted: var(--rule);
  --ui-border-accented: var(--lilac);

  min-height: 100dvh;
  color: var(--text);
  font-family: var(--font-nunito);
  color-scheme: dark;
  /* The galaxy skirt's violets in the corner. */
  background:
    radial-gradient(44rem 30rem at 0% 0%, rgb(178 218 241 / 0.08), transparent 70%),
    radial-gradient(36rem 26rem at 100% 0%, rgb(219 136 73 / 0.06), transparent 70%),
    radial-gradient(40rem 30rem at 0% 70%, rgb(177 237 217 / 0.05), transparent 70%),
    radial-gradient(60rem 36rem at 100% 100%, rgb(82 67 156 / 0.55), transparent 70%),
    radial-gradient(80rem 50rem at 85% 110%, rgb(91 63 124 / 0.6), transparent 75%),
    color-mix(in oklab, var(--bg) 88%, var(--violet));
  background-attachment: fixed;
  isolation: isolate;
}

.sheet ::selection {
  background: var(--sky);
  color: var(--black);
}

/* Sky barely shows on cream, so the light theme selects in lilac. */
html.light .sheet ::selection {
  background: var(--pastel-lilac);
  color: var(--heading);
}

/* The text cursor in the accent: gold on black, deep lilac on cream. */
.sheet,
.contact {
  caret-color: var(--accent);
}

.sheet :focus-visible {
  outline: 2px solid var(--pastel-lilac);
  outline-offset: 3px;
}

/* Rounds the ring on anything without its own corners; zero specificity, so a chip or
   card keeps its shape. */
:where(.sheet :focus-visible) {
  border-radius: 6px;
}

.frame {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: calc(40rem + 2rem);
  margin-inline: auto;
  padding: 4rem 1rem 2rem;
  line-height: 1.5;
}

.frame-header {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

.frame-logo {
  align-self: center;
}

.frame-logo img {
  display: block;
  width: 15rem;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
}

/* The page links as labelled pills, with the theme toggle as a round one. */
.frame-links.frame-nav {
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.frame-links .frame-pill {
  align-items: center;
  gap: 0.35em;
  padding: 0.3em 0.8em;
  /* The logo's colours: a violet fill with a lilac edge, and the accent (the
     logo's gold, or purple on the light theme) for hover and the current page. */
  border: 1px solid color-mix(in oklab, var(--lilac) 40%, transparent);
  border-radius: 999px;
  background: color-mix(in oklab, var(--surface) 75%, var(--violet));
  color: var(--text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
  transition: color 200ms, border-color 200ms, translate 300ms cubic-bezier(0.3, 1.6, 0.5, 1);
}

/* A circle as tall as the text pills: their line, padding and border. */
.frame-links .frame-pill-icon {
  justify-content: center;
  width: calc(1.9em + 2px);
  height: calc(1.9em + 2px);
  padding: 0;
}

/* Keeps the whole row on one line on a phone. */
@media (width < 26rem) {
  .frame-links.frame-nav {
    gap: 0.3rem;
  }

  .frame-links .frame-pill {
    padding-inline: 0.5em;
    font-size: 0.8125rem;
  }

  .frame-links .frame-pill-icon {
    padding: 0;
  }
}

.frame-links .frame-pill:is(:hover, :focus-visible) {
  border-color: var(--accent);
  color: var(--heading);
  filter: none;
}

.frame-links .frame-pill[aria-current] {
  border-color: color-mix(in oklab, var(--accent) 70%, transparent);
  background: color-mix(in oklab, var(--surface) 55%, var(--violet));
  color: var(--heading);
}

/* Named so it stays put while the page under it changes (see the root transition in main.css). */
.frame-header {
  view-transition-name: frame-header;
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
  color: var(--heading);
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

.frame-signoff {
  margin-top: 0.9rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--muted);
}

.frame-signoff-sep {
  margin-inline: 0.5em;
  opacity: 0.6;
}

.frame-heart {
  color: var(--orange);
}

/* Wraps as one piece on narrow screens. */
.frame-signoff-stars {
  white-space: nowrap;
}

.frame-legal {
  font-size: 0.85rem;
  color: var(--muted);
  text-underline-offset: 4px;
  transition: color 200ms;
}

.frame-legal:is(:hover, :focus-visible) {
  color: var(--heading);
  text-decoration: underline wavy var(--pastel-lilac);
}

/* Kaomoji in empty and error states: kept on one line. */
.kaomoji {
  white-space: nowrap;
}

.frame-localtime {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.6rem;
  font-size: 0.85rem;
  color: var(--muted);
}

.frame-localtime-icon {
  flex: none;
  color: var(--pastel-butter);
}

html.light .frame-localtime-icon {
  color: oklch(from var(--pastel-butter) 0.5 calc(c * 2.2) h);
}

.frame-visits.is-milestone {
  color: var(--accent);
}

.frame-visits {
  position: relative;
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

/* Holds the theme toggle's spot (an icon's size) until it renders. */
.frame-theme-slot {
  display: block;
  width: calc(0.875rem * 1.9 + 2px);
  aspect-ratio: 1;
}

.frame-links [aria-current] {
  color: var(--heading);
}

.frame-tooltip {
  background: var(--surface);
  color: var(--heading);
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

/* The sun or moon does a spin as the theme changes; after the wiggle, so it wins. */
.frame-links button.is-spinning > * {
  animation: frame-spin 550ms cubic-bezier(0.3, 1.4, 0.5, 1);
}

@keyframes frame-spin {
  from { rotate: -180deg; scale: 0.4; }
}

/* A page's own title: a post, the blog and the legal pages. */
.doc-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--heading);
}

/* Long-form text: posts and the legal pages. */
.doc-body {
  line-height: 1.75;
}

.doc-body :is(h2, h3, h4) {
  font-family: var(--font-display);
  font-weight: 400;
  color: var(--heading);
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
  background: color-mix(in oklab, var(--surface) 68%, var(--tint, var(--pastel-lilac)));
  color: var(--heading);
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
  color: var(--heading);
  transition: color 200ms, translate 250ms ease-out;
}

.row:is(:hover, :focus-visible) .row-name {
  color: var(--tint, var(--accent));
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

/* The light theme (tokens in main.css): the same swatch glows, softer, on cream. */
html.light .sheet {
  background:
    radial-gradient(44rem 30rem at 0% 0%, rgb(178 218 241 / 0.5), transparent 70%),
    radial-gradient(36rem 26rem at 100% 0%, rgb(219 136 73 / 0.16), transparent 70%),
    radial-gradient(40rem 30rem at 0% 70%, rgb(177 237 217 / 0.35), transparent 70%),
    radial-gradient(60rem 36rem at 100% 100%, rgb(170 104 204 / 0.25), transparent 70%),
    var(--bg);
  background-attachment: fixed;
}

html.light .frame-links .frame-pill {
  background: color-mix(in oklab, white 72%, var(--lilac));
}

html.light .frame-links .frame-pill:is(:hover, :focus-visible) {
  color: var(--heading);
}

html.light .frame-links .frame-pill[aria-current] {
  background: color-mix(in oklab, white 55%, var(--lilac));
}

html.light .chip {
  border-color: color-mix(in oklab, var(--tint, var(--pastel-lilac)) 55%, transparent);
  background: color-mix(in oklab, white 55%, var(--tint, var(--pastel-lilac)));
}

/* The pastels are too pale to read as text on cream, so hovers use the same hue at 0.5
   lightness (4.8:1 or more on cream for every pastel). */
html.light .frame-links :is(a, button):is(:hover, :focus-visible) {
  color: oklch(from var(--hover) 0.5 calc(c * 2.2) h);
}

html.light .row:is(:hover, :focus-visible) .row-name {
  color: oklch(from var(--tint, var(--accent)) 0.5 calc(c * 2.2) h);
}
</style>
