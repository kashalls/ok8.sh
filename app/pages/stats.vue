<script setup lang="ts">
definePageMeta({ layout: 'sheet', viewTransition: true })

const description = 'What I have been coding lately, from WakaTime and GitHub.'
useSeoMeta({ title: 'Stats 🌙 Kashall', description, ogDescription: description })
defineOgImage('Default', { title: 'Stats', description })

const ranges = [
  { label: '24 hours', value: '24h', total: 'in the last 24 hours' },
  { label: '7 days', value: '7d', total: 'in the last 7 days' },
  { label: '30 days', value: '30d', total: 'in the last 30 days' },
]
const range = ref('7d')
const rangeTotal = computed(() => ranges.find(r => r.value === range.value)!.total)

const { data: waka, status: wakaStatus } = useFetch('/api/stats/wakatime', { server: false, lazy: true, query: { range } })
const { data: github, status: githubStatus } = useFetch('/api/stats/github', { server: false, lazy: true })

// Placeholders hold each chart's shape until its data arrives (or fails).
const wakaLoading = computed(() => !waka.value && wakaStatus.value !== 'error')
const githubLoading = computed(() => !github.value && githubStatus.value !== 'error')
const placeholderDays = [70, 20, 35, 55, 10, 25, 45]
const placeholderRows = [100, 60, 35, 20]

function duration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  if (!hours) return `${minutes}m`
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`
}

const longDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

// Days are WakaTime dates; hours are instants, shown in the visitor's own time.
const hourOf = (start: string) => new Date(start).toLocaleTimeString('en-US', { hour: 'numeric' })
const bucketLabel = (start: string) => waka.value?.unit === 'hour'
  ? `${new Date(start).toLocaleDateString('en-US', { weekday: 'long' })}, ${hourOf(start)}`
  : longDate(start)
// Every bar is labelled for a week; for longer runs, enough ticks to read the axis.
const tick = (start: string, i: number) => {
  if (waka.value?.unit === 'hour') return i % 6 === 0 ? hourOf(start) : ''
  const date = new Date(`${start}T00:00:00`)
  if (range.value === '7d') return date.toLocaleDateString('en-US', { weekday: 'short' })
  return i % 5 === 0 ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
}

// From the same buckets as the chart below, so the totals match it.
const total = computed(() => (waka.value?.buckets ?? []).reduce((sum, bucket) => sum + bucket.seconds, 0))
const activeDays = computed(() => waka.value?.unit === 'day' ? waka.value.buckets.filter(day => day.seconds >= 60).length : 0)

const busiestBucket = computed(() => Math.max(1, ...(waka.value?.buckets.map(bucket => bucket.seconds) ?? [])))

// "Other" is time with no file language (agent sessions, terminals); it says nothing
// about what I wrote.
const charts = computed(() => {
  if (!waka.value) return []
  return [
    { label: 'Languages', rows: waka.value.languages.filter(lang => lang.name !== 'Other') },
    { label: 'Projects', rows: waka.value.projects.map(project => ({ ...project, private: !project.repo })) },
    { label: 'Editors', rows: waka.value.editors },
  ].filter(chart => chart.rows.length).map(chart => ({
    ...chart,
    max: Math.max(...chart.rows.map(row => row.seconds)),
  }))
})

// A month's name over the first week that starts in it.
const months = computed(() => {
  let previous: number | undefined
  return (github.value?.weeks ?? []).map((week, i) => {
    if (!week[0]) return ''
    const date = new Date(`${week[0].date}T00:00:00`)
    const label = i && date.getMonth() !== previous ? date.toLocaleDateString('en-US', { month: 'short' }) : ''
    previous = date.getMonth()
    return label
  })
})

// One tooltip for every mark, anchored to the hovered one: a tooltip per calendar
// cell would mount hundreds of them.
const tip = ref<{ text: string, el: Element }>()
const show = (text: string, event: PointerEvent) => { tip.value = { text, el: event.currentTarget as Element } }
</script>

<template>
  <main class="stats" @pointerleave="tip = undefined">
    <div class="stats-head">
      <h1 class="doc-title">Stats</h1>
      <UTabs v-model="range" :items="ranges" :content="false" size="xs" aria-label="Time range" :ui="{ list: 'w-auto' }" />
    </div>

    <p v-if="!waka && wakaStatus === 'error'" class="stats-quiet">Coding time isn't available right now.</p>

    <!-- The skeletons are only shapes; screen readers get the one line of text. -->
    <div v-if="wakaLoading" class="stats-placeholder">
      <span class="sr-only">Loading stats</span>
      <div class="stats-heroes" aria-hidden="true">
        <div v-for="n in 3" :key="n">
          <USkeleton class="h-8 w-28" />
          <USkeleton class="h-3 w-24" />
        </div>
      </div>
      <figure class="stats-figure" aria-hidden="true">
        <USkeleton class="mb-3.5 h-3 w-14" />
        <ul class="stats-days">
          <li v-for="(height, i) in placeholderDays" :key="i">
            <USkeleton class="w-full rounded-b-none" :style="{ height: `${height}%` }" />
            <USkeleton class="h-3 w-7" />
          </li>
        </ul>
      </figure>
      <figure class="stats-figure" aria-hidden="true">
        <USkeleton class="mb-3.5 h-3 w-20" />
        <ul class="stats-rows">
          <li v-for="(width, i) in placeholderRows" :key="i">
            <USkeleton class="h-3.5 w-20" />
            <span class="stats-track"><USkeleton class="h-2 rounded-l-none" :style="{ width: `${width}%` }" /></span>
            <USkeleton class="ms-auto h-3 w-10" />
          </li>
        </ul>
      </figure>
    </div>

    <dl v-if="waka || github" class="stats-heroes">
      <div v-if="waka" class="stats-total">
        <dd>{{ duration(total) }}</dd>
        <dt>coding {{ rangeTotal }}</dt>
      </div>
      <div v-if="activeDays" class="stats-average">
        <dd>{{ duration(total / activeDays) }}</dd>
        <dt>per active day</dt>
      </div>
      <div v-if="github" class="stats-contributions">
        <dd>{{ github.total.toLocaleString('en-US') }}</dd>
        <dt>contributions in the past year</dt>
      </div>
    </dl>

    <figure v-if="waka?.buckets.length" class="stats-figure">
      <figcaption>{{ waka.unit === 'hour' ? 'Per hour' : 'Per day' }}</figcaption>
      <ul class="stats-days" :style="{ '--count': waka.buckets.length }">
        <li v-for="(bucket, i) in waka.buckets" :key="bucket.start" :style="{ '--i': i }" @pointerenter="show(`${bucketLabel(bucket.start)}: ${duration(bucket.seconds)}`, $event)"
          @pointerleave="tip = undefined">
          <span class="stats-column" :style="{ height: `${(bucket.seconds / busiestBucket) * 100}%` }" />
          <span class="stats-tick">{{ tick(bucket.start, i) }}</span>
          <span class="sr-only">{{ bucketLabel(bucket.start) }}: {{ duration(bucket.seconds) }}</span>
        </li>
      </ul>
    </figure>

    <figure v-for="chart in charts" :key="chart.label" class="stats-figure">
      <figcaption>{{ chart.label }}</figcaption>
      <ul class="stats-rows">
        <li v-for="(row, i) in chart.rows" :key="row.name" :class="{ 'is-private': 'private' in row && row.private }" :style="{ '--i': i }">
          <NuxtLink v-if="'repo' in row && row.repo" :to="`https://github.com/${row.repo}`" target="_blank" class="stats-name">{{ row.name }}</NuxtLink>
          <span v-else class="stats-name">{{ row.name }}</span>
          <span class="stats-track"><span class="stats-bar" :style="{ width: `${(row.seconds / chart.max) * 100}%` }" /></span>
          <span class="stats-value">{{ duration(row.seconds) }}</span>
        </li>
      </ul>
    </figure>

    <figure v-if="github" class="stats-figure">
      <figcaption>GitHub, past year</figcaption>
      <div class="stats-calendar">
        <div class="stats-months" aria-hidden="true">
          <span v-for="(month, i) in months" :key="i">{{ month }}</span>
        </div>
        <div class="stats-cells" role="img" :aria-label="`${github.total} GitHub contributions in the past year`">
          <div v-for="(week, w) in github.weeks" :key="w" class="stats-week">
            <span v-for="day in week" :key="day.date" class="stats-cell" :data-level="day.level"
              @pointerenter="show(`${longDate(day.date)}: ${day.count} contribution${day.count === 1 ? '' : 's'}`, $event)"
              @pointerleave="tip = undefined" />
          </div>
        </div>
      </div>
    </figure>

    <figure v-if="githubLoading" class="stats-figure is-placeholder" aria-hidden="true">
      <USkeleton class="mb-3.5 h-3 w-28" />
      <USkeleton class="aspect-[53/8] w-full" />
    </figure>

    <UTooltip v-if="tip" :reference="tip.el" :text="tip.text" open v-bind="sheetTooltip" :content="{ side: 'top', sideOffset: 6 }" />
  </main>
</template>

<style scoped>
.stats > * + * {
  margin-top: 2.5rem;
}

.stats-quiet {
  color: var(--muted);
}

.stats-placeholder {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Placeholders don't fade in; only the real data does. */
.stats-placeholder :is(.stats-heroes, .stats-figure),
.stats-figure.is-placeholder {
  animation: none;
}

/* The data arrives after the page: it fades in, and the bars grow from their
   baseline one after another. */
.stats-heroes,
.stats-figure {
  animation: stats-fade 400ms ease-out backwards;
}

.stats-column {
  transform-origin: bottom;
  animation: stats-rise 600ms cubic-bezier(0.3, 0.7, 0.2, 1) backwards;
  /* The whole run takes the same time however many columns there are. */
  animation-delay: calc(var(--i) * 350ms / var(--count, 7) + 100ms);
}

.stats-bar {
  transform-origin: left;
  animation: stats-grow 600ms cubic-bezier(0.3, 0.7, 0.2, 1) backwards;
  animation-delay: calc(var(--i) * 60ms + 100ms);
}

@keyframes stats-fade {
  from { opacity: 0; }
}

@keyframes stats-rise {
  from { scale: 1 0; }
}

@keyframes stats-grow {
  from { scale: 0 1; }
}

/* Reduced motion shortens animations to nothing; the delays have to go too, or
   the bars would sit hidden until their turn. */
html.reduce-motion .stats-column,
html.reduce-motion .stats-bar {
  animation-delay: 0s;
}

.stats-heroes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 1.5rem;
}

.stats-heroes > div {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.15rem;
}

.stats-heroes dd {
  font-family: var(--font-display);
  font-size: 2rem;
  line-height: 1;
  color: var(--cream);
  font-variant-numeric: tabular-nums;
}

/* By what each number is, so a colour stays put when "per active day" drops out. */
.stats-total dd { color: var(--sky); }
.stats-average dd { color: var(--mint); }
.stats-contributions dd { color: var(--pastel-peach); }

.stats-heroes dt {
  font-size: 0.8rem;
  color: var(--muted);
}

.stats-figure figcaption {
  margin-bottom: 0.85rem;
  font-size: 0.8rem;
  color: var(--muted);
}

/* Per day: one column per day, on a shared baseline. */
.stats-days {
  display: grid;
  /* minmax(0, …) so a tick's label can't widen its column. */
  grid-template-columns: repeat(var(--count, 7), minmax(0, 1fr));
  /* Half a rem for a week, narrowing to a couple of pixels for 30 days. */
  gap: max(2px, calc(3.5rem / var(--count, 7)));
  height: 8rem;
}

.stats-days > li {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.4rem;
  cursor: default;
}

.stats-column {
  width: 100%;
  min-height: 2px;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(var(--sky), var(--pastel-lilac));
  opacity: 0.85;
  transition: opacity 150ms;
}

.stats-days > li:hover .stats-column {
  opacity: 1;
}

.stats-tick {
  min-height: 1lh;
  font-size: 0.75rem;
  color: var(--muted);
  white-space: nowrap;
}

.stats-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* Horizontal bars: name, bar, value, on the same three columns in every chart. */
.stats-rows {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.stats-rows > li {
  display: grid;
  grid-template-columns: 8rem 1fr 4rem;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
}

.stats-name {
  overflow: hidden;
  color: var(--cream);
  text-overflow: ellipsis;
  white-space: nowrap;
}

a.stats-name {
  transition: color 200ms;
}

a.stats-name:is(:hover, :focus-visible) {
  color: var(--gold);
}

.stats-bar {
  display: block;
  height: 8px;
  min-width: 2px;
  border-radius: 0 4px 4px 0;
  background: var(--tint);
}

/* Each row takes the next pastel, so neighbouring bars tell apart at a glance. */
.stats-rows > li:nth-child(6n + 1) { --tint: var(--pastel-lilac); }
.stats-rows > li:nth-child(6n + 2) { --tint: var(--sky); }
.stats-rows > li:nth-child(6n + 3) { --tint: var(--mint); }
.stats-rows > li:nth-child(6n + 4) { --tint: var(--pastel-peach); }
.stats-rows > li:nth-child(6n + 5) { --tint: var(--pastel-butter); }
.stats-rows > li:nth-child(6n + 6) { --tint: var(--cream); }

.is-private .stats-name {
  color: var(--muted);
}

/* Private work in its row's hue, hatched, so it reads as set apart without another colour. */
.is-private .stats-bar {
  background: repeating-linear-gradient(-45deg, var(--tint) 0 3px, color-mix(in oklab, var(--tint) 35%, transparent) 3px 6px);
}

.stats-value {
  text-align: right;
  color: var(--muted);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

/* GitHub's calendar: a week per column, Sunday on top. */
.stats-calendar {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.stats-months,
.stats-cells {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 2px;
}

.stats-months > span {
  overflow: visible;
  white-space: nowrap;
  font-size: 0.7rem;
  color: var(--muted);
}

.stats-week {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  gap: 2px;
}

.stats-cell {
  aspect-ratio: 1;
  border-radius: 2px;
  background: rgb(252 246 237 / 0.06);
}

.stats-cell[data-level="1"] { background: rgb(170 104 204 / 0.35); }
.stats-cell[data-level="2"] { background: rgb(170 104 204 / 0.55); }
.stats-cell[data-level="3"] { background: rgb(170 104 204 / 0.78); }
.stats-cell[data-level="4"] { background: var(--lilac); }

.stats-cell:hover {
  outline: 1px solid var(--cream);
}

</style>
