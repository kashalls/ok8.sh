<script setup lang="ts">
useDisplayPreferences()

const { openContact } = useContact()
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
      </header>

      <slot />

      <footer class="frame-footer">
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
/* The character sheet's colour key, swatch for swatch. */
.sheet {
  --black: #1a1918;
  --charcoal: #34323b;
  --cream: #fcf6ed;
  --text: rgb(252 246 237 / 0.85);
  --violet: #5b3f7c;
  --indigo: #52439c;
  --lilac: #aa68cc;
  --sky: #b2daf1;
  --mint: #b1edd9;
  --orange: #db8849;
  --gold: #f6c252;
  --muted: rgb(252 246 237 / 0.6);
  --rule: rgb(170 104 204 / 0.2);

  /* Nuxt UI components (legal prose, the contact dialog) take the same palette. */
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
</style>
