/**
 * The past year of GitHub contributions, for the Stats page. The contribution
 * calendar is only in the GraphQL API, which needs a token (NUXT_GITHUB_TOKEN).
 */
interface Calendar {
    data?: {
        user: {
            contributionsCollection: {
                contributionCalendar: {
                    totalContributions: number
                    weeks: { contributionDays: { date: string; contributionCount: number }[] }[]
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
        weeks { contributionDays { date contributionCount } }
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
        weeks: calendar.weeks.map(week => week.contributionDays.map(day => ({ date: day.date, count: day.contributionCount }))),
    }
}, {
    name: 'stats',
    getKey: () => 'github',
    maxAge: 60 * 60,
    staleMaxAge: 24 * 60 * 60,
    swr: true,
})
