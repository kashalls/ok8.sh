/**
 * The past year of GitHub contributions, for the Stats page. The contribution
 * calendar is only in the GraphQL API, which needs a token (NUXT_GITHUB_TOKEN).
 */
// GitHub's own shading for a day, the same steps its profile graph uses.
type Level = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE'
const LEVELS: Level[] = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE']

interface Calendar {
    data?: {
        user: {
            contributionsCollection: {
                contributionCalendar: {
                    totalContributions: number
                    weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: Level }[] }[]
                }
            }
        }
    }
}

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`

export default defineCachedEventHandler(async (event) => {
    const { githubToken, public: { github } } = useRuntimeConfig(event)
    if (!githubToken) throw createError({ statusCode: 503, message: 'GitHub is not configured' })

    const result = await $fetch<Calendar>('https://api.github.com/graphql', {
        method: 'POST',
        headers: { authorization: `Bearer ${githubToken}`, 'user-agent': 'ok8.sh' },
        body: { query: QUERY, variables: { login: github } },
    }).catch(() => null)
    const calendar = result?.data?.user.contributionsCollection.contributionCalendar
    if (!calendar) throw createError({ statusCode: 502, message: 'GitHub is unreachable' })

    return {
        total: calendar.totalContributions,
        weeks: calendar.weeks.map(week => week.contributionDays.map(day => ({ date: day.date, count: day.contributionCount, level: Math.max(0, LEVELS.indexOf(day.contributionLevel)) }))),
    }
}, {
    name: 'stats',
    // Renamed when the response gained levels, so copies cached without them are skipped.
    getKey: () => 'github-calendar',
    maxAge: 60 * 60,
    staleMaxAge: 24 * 60 * 60,
    swr: true,
})
