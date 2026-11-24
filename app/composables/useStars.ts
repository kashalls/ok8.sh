const STORAGE_KEY = 'kashall-stars'

/** The swatch stars from the character sheet, one hidden somewhere on the site for each. */
export const STAR_TINTS = {
    sky: 'var(--sky)',
    mint: 'var(--mint)',
    lilac: 'var(--lilac)',
    orange: 'var(--orange)',
    gold: 'var(--gold)',
    violet: 'var(--violet)',
    indigo: 'var(--indigo)',
} as const

export type StarId = keyof typeof STAR_TINTS

/**
 * The stars this visitor has caught, kept in their browser. Pages are prerendered, so
 * they're read once the app has mounted; everything starts uncaught until then.
 */
export const useStars = () => {
    const found = useState<StarId[]>('stars-found', () => [])
    const loaded = useState('stars-loaded', () => false)
    const total = Object.keys(STAR_TINTS).length

    onMounted(() => {
        if (loaded.value) return
        loaded.value = true
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
            if (Array.isArray(saved)) found.value = saved.filter((id): id is StarId => id in STAR_TINTS)
        }
        catch {}
    })

    function catchStar(id: StarId) {
        if (found.value.includes(id)) return
        found.value = [...found.value, id]
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(found.value))
        }
        catch {}
    }

    return { found, total, all: computed(() => found.value.length === total), catchStar }
}
