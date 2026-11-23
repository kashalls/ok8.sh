/**
 * Recent coding activity from WakaTime, for the Stats page: the last 24 hours,
 * 7 days or 30 days (`?range=24h|7d|30d`). Reading stats needs an OAuth token
 * with `read_stats` (NUXT_WAKATIME_TOKEN); WakaTime's plugin API keys are
 * write-only.
 *
 * Days come from the daily summaries. WakaTime has nothing for a rolling 24 hours,
 * so that range is built from yesterday's and today's durations (UTC), cut to the
 * window and bucketed by hour.
 *
 * Project names come from local folder names, so only the ones in
 * PUBLIC_PROJECTS are shown; everything else is folded into one private row.
 */
const RANGES = { '24h': 'hour', '7d': 'last_7_days', '30d': 'last_30_days' } as const
type Range = keyof typeof RANGES

interface Entry { name: string; total_seconds: number }
interface Summaries {
    data: {
        grand_total: { total_seconds: number }
        range: { date: string }
        languages?: Entry[]
        editors?: Entry[]
        projects?: Entry[]
    }[]
}
type Slice = 'language' | 'editor' | 'project'
interface Durations { data: ({ time: number; duration: number } & Partial<Record<Slice, string | null>>)[] }

// WakaTime project name -> the public repo it is.
const PUBLIC_PROJECTS: Record<string, string> = {
    ...Object.fromEntries(projects.map(({ repo }) => [repo.split('/')[1]!, repo])),
    'kashall.dev': 'kashalls/ok8.sh',
}

const add = (totals: Map<string, number>, name: string | null | undefined, seconds: number) => {
    if (name && seconds > 0) totals.set(name, (totals.get(name) ?? 0) + seconds)
}

const top = (totals: Map<string, number>, count = 6) => [...totals]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([name, seconds]) => ({ name, seconds }))

function publicProjects(totals: Map<string, number>) {
    let privateSeconds = 0
    // Keyed by repo: more than one folder name can be the same repo.
    const byRepo = new Map<string, number>()
    for (const [name, seconds] of totals) {
        const repo = PUBLIC_PROJECTS[name]
        if (repo) byRepo.set(repo, (byRepo.get(repo) ?? 0) + seconds)
        else privateSeconds += seconds
    }
    const shown: { name: string; repo?: string; seconds: number }[] = [...byRepo].map(([repo, seconds]) => ({ name: repo.split('/')[1]!, repo, seconds }))
    if (privateSeconds > 0) shown.push({ name: 'Private projects', seconds: privateSeconds })
    return shown.sort((a, b) => b.seconds - a.seconds).slice(0, 6)
}

async function days(range: 'last_7_days' | 'last_30_days', headers: Record<string, string>) {
    const { data } = await $fetch<Summaries>('https://api.wakatime.com/api/v1/users/current/summaries', { headers, query: { range } })
    const languages = new Map<string, number>()
    const editors = new Map<string, number>()
    const projectTotals = new Map<string, number>()
    for (const day of data) {
        for (const entry of day.languages ?? []) add(languages, entry.name, entry.total_seconds)
        for (const entry of day.editors ?? []) add(editors, entry.name, entry.total_seconds)
        for (const entry of day.projects ?? []) add(projectTotals, entry.name, entry.total_seconds)
    }
    return {
        unit: 'day' as const,
        buckets: data.map(day => ({ start: day.range.date, seconds: day.grand_total.total_seconds })),
        languages: top(languages),
        editors: top(editors, 3),
        projects: publicProjects(projectTotals),
    }
}

async function hours(headers: Record<string, string>) {
    const end = Date.now() / 1000
    const start = end - 24 * 60 * 60
    const dates = [start, end].map(t => new Date(t * 1000).toISOString().slice(0, 10))
    const slice = async (slice_by: Slice) => (await Promise.all([...new Set(dates)].map(date =>
        $fetch<Durations>('https://api.wakatime.com/api/v1/users/current/durations', { headers, query: { date, slice_by, timezone: 'UTC' } }),
    ))).flatMap(day => day.data)
    const [languageSlices, editorSlices, projectSlices] = await Promise.all([slice('language'), slice('editor'), slice('project')])

    // Each duration's overlap with the window, and with each hour inside it.
    const firstHour = Math.floor(start / 3600) * 3600
    const buckets = Array.from({ length: 25 }, (_, i) => ({ start: firstHour + i * 3600, seconds: 0 }))
    const clip = (from: number, to: number) => Math.max(0, Math.min(to, end) - Math.max(from, start))
    const totals = (slices: Durations['data'], key: Slice) => {
        const map = new Map<string, number>()
        for (const d of slices) add(map, d[key], clip(d.time, d.time + d.duration))
        return map
    }
    for (const d of projectSlices) {
        for (const bucket of buckets) {
            bucket.seconds += Math.max(0, Math.min(d.time + d.duration, bucket.start + 3600, end) - Math.max(d.time, bucket.start, start))
        }
    }

    return {
        unit: 'hour' as const,
        buckets: buckets.map(bucket => ({ start: new Date(bucket.start * 1000).toISOString(), seconds: bucket.seconds })),
        languages: top(totals(languageSlices, 'language')),
        editors: top(totals(editorSlices, 'editor'), 3),
        projects: publicProjects(totals(projectSlices, 'project')),
    }
}

const rangeOf = (value: unknown): Range => typeof value === 'string' && value in RANGES ? value as Range : '7d'

export default defineCachedEventHandler(async (event) => {
    const { wakatimeToken } = useRuntimeConfig(event)
    if (!wakatimeToken) throw createError({ statusCode: 503, message: 'WakaTime is not configured' })

    const headers = { authorization: `Bearer ${wakatimeToken}`, 'user-agent': 'ok8.sh' }
    const range = rangeOf(getQuery(event).range)
    const source = RANGES[range]
    return await (source === 'hour' ? hours(headers) : days(source, headers))
        .catch(() => { throw createError({ statusCode: 502, message: 'WakaTime is unreachable' }) })
}, {
    name: 'stats',
    getKey: event => `wakatime-${rangeOf(getQuery(event).range)}`,
    // A rolling 24 hours goes stale faster than whole days.
    maxAge: 10 * 60,
    staleMaxAge: 24 * 60 * 60,
    swr: true,
})
