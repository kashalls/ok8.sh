<script setup lang="ts">
// My Discord presence, as Discord's own user panel draws it.
const statusHints: Record<string, string> = {
  online: 'Around!',
  idle: 'Probably snacking',
  dnd: 'In the zone, shh',
  offline: 'Asleep, probably',
}
const lanyard = useLanyard()
const custom = computed(() => lanyard.value?.activities.find(a => a.type === ActivityType.Custom))
const game = computed(() => lanyard.value?.activities.find(a => a.type === ActivityType.Playing))
// A little something on the avatar for what I'm up to: notes for music, a pulse for a game,
// or z's when idle. It plays when that changes and again on hover.
const mood = computed(() => {
  if (lanyard.value?.listening_to_spotify) return 'music'
  if (game.value) return 'game'
  if (lanyard.value?.discord_status === 'idle') return 'sleep'
  return undefined
})
const moodPlays = ref(0)
const presenceHint = computed(() => {
  const spotify = lanyard.value?.spotify
  if (lanyard.value?.listening_to_spotify && spotify) return `Vibing to ${spotify.song} by ${spotify.artist}`
  if (game.value) return `Playing ${game.value.name}`
  return statusHints[lanyard.value?.discord_status ?? 'offline'] ?? statusHints.offline
})
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
  <div class="frame-presence">
    <!-- Its spot is held while Lanyard connects, so the page doesn't jump when it arrives. -->
    <Transition name="frame-fade">
      <section v-if="lanyard" class="frame-card">
        <Transition name="frame-fade">
          <NuxtImg v-if="nameplate" :src="nameplateUrl(nameplate.asset, nameplateAnimated)" alt="" width="448" height="84"
            class="frame-nameplate" />
        </Transition>
        <UTooltip :text="presenceHint" v-bind="sheetTooltip">
          <span class="frame-avatar" @pointerenter="moodPlays++">
            <NuxtImg :src="avatarUrl(lanyard.discord_user.id, lanyard.discord_user.avatar)" alt="" width="36" height="36" />
            <NuxtImg v-if="decoration" :src="decorationUrl(decoration.asset, decorationAnimated)" alt="" width="44"
              height="44" class="frame-decoration" />
            <span class="frame-dot" :style="{ background: statusColor(lanyard.discord_status) }" />
            <span v-if="mood" :key="`${mood}-${moodPlays}`" class="frame-mood" :class="`is-${mood}`"
              :style="{ '--status': statusColor(lanyard.discord_status) }" aria-hidden="true">
              <template v-if="mood === 'sleep'"><span>z</span><span>z</span><span>z</span></template>
              <template v-else-if="mood === 'music'"><span>♪</span><span>♫</span></template>
            </span>
          </span>
        </UTooltip>
        <div class="frame-who">
          <WavyName text="Kashall" :gradient="nameGradient" class="frame-name" />
          <p class="frame-custom">
            <span class="sr-only">{{ STATUS[lanyard.discord_status]?.label ?? 'Offline' }} on Discord.{{ mood === 'music' || mood === 'game' ? ` ${presenceHint}.` : '' }}</span>
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
</template>

<style>
/* The card's rendered height (its name and status line, padded), held before it loads. */
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

/* Drawn over the avatar's corner (top right), or around the dot for a game. */
.frame-mood {
  position: absolute;
  bottom: 70%;
  left: 78%;
  display: flex;
  align-items: flex-end;
  gap: 0.05rem;
  font-family: var(--font-sniglet);
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
  text-shadow: 0 1px 2px rgb(26 25 24 / 0.7);
}

.frame-mood > span {
  display: inline-block;
}

.frame-mood.is-sleep {
  color: var(--sky);
}

.frame-mood.is-sleep > span:nth-child(1) { font-size: 0.45rem; }
.frame-mood.is-sleep > span:nth-child(2) { font-size: 0.55rem; margin-bottom: 0.2rem; }
.frame-mood.is-sleep > span:nth-child(3) { font-size: 0.65rem; margin-bottom: 0.45rem; }

.frame-mood.is-music {
  gap: 0.15rem;
  font-size: 0.7rem;
  color: var(--mint);
}

.frame-mood.is-music > span:nth-child(2) {
  margin-bottom: 0.35rem;
}

.frame-mood.is-game {
  inset: auto -1px -1px auto;
  width: 11px;
  height: 11px;
}

.frame-mood.is-game::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px solid var(--status);
  border-radius: 50%;
  opacity: 0;
}

/* Three short plays (under five seconds all told), and then it rests: the z's and notes
   stay put, the pulse fades away. */
html:not(.reduce-motion) .frame-mood > span {
  animation: frame-mood-drift 1.4s ease-out 3 backwards;
}

html:not(.reduce-motion) .frame-mood > span:nth-child(2) { animation-delay: 150ms; }
html:not(.reduce-motion) .frame-mood > span:nth-child(3) { animation-delay: 300ms; }

html:not(.reduce-motion) .frame-mood.is-music > span {
  animation-name: frame-mood-bop;
}

html:not(.reduce-motion) .frame-mood.is-game::before {
  animation: frame-mood-pulse 1.2s ease-out 3;
}

@keyframes frame-mood-drift {
  from { opacity: 0; translate: -3px 5px; scale: 0.5; }
}

@keyframes frame-mood-bop {
  from { opacity: 0; translate: -2px 6px; rotate: -20deg; }
  60% { rotate: 10deg; }
}

@keyframes frame-mood-pulse {
  from { opacity: 0.9; scale: 1; }
  to { opacity: 0; scale: 2.4; }
}

.frame-who {
  min-width: 0;
}

/* Only as wide as the name, so the whole gradient shows across it (see WavyName). */
.frame-name {
  display: inline-block;
  font-family: var(--font-sniglet);
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--heading);
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

html.light .frame-card {
  background: linear-gradient(90deg, rgb(170 104 204 / 0.12), rgb(170 104 204 / 0.28));
}

html.light .frame-custom {
  text-shadow: none;
}

html.light .frame-mood {
  text-shadow: none;
}

html.light .frame-mood.is-sleep {
  color: oklch(from var(--sky) 0.5 calc(c * 2.2) h);
}

html.light .frame-mood.is-music {
  color: oklch(from var(--mint) 0.5 calc(c * 2.2) h);
}
</style>
