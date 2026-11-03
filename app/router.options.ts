import type { RouterConfig } from '@nuxt/schema'

// The default layout scrolls inside #content-frame and the sheet layout scrolls
// the window, so scrolling is done here once the new page is in place. It runs
// straight away on page:finish so a view transition captures the new page at
// the top.
export default <RouterConfig>{
    scrollBehavior(to, from) {
        const scroll = () => {
            const target = to.hash && document.getElementById(decodeURIComponent(to.hash.slice(1)))
            if (target) target.scrollIntoView({ block: 'start' })
            else if (to.path !== from.path) (document.getElementById('content-frame') ?? window).scrollTo({ top: 0 })
        }
        if (to.path === from.path) scroll()
        else useNuxtApp().hooks.hookOnce('page:finish', scroll)
        return false
    },
}
