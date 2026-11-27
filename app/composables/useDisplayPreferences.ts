/** Applies the visitor's motion choice to the page. */
export const useDisplayPreferences = () => {
    const { reduced } = useMotionPreference()
    if (import.meta.client) {
        watchEffect(() => document.documentElement.classList.toggle('reduce-motion', reduced.value))
    }
}
