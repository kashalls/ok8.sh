import type { NuxtConfig } from 'nuxt/schema'

const description =
    "Hi, I'm Kashall! A platform engineer in Oregon who keeps Kubernetes clusters happy and builds tools that make platforms easier to extend."

// og:image and twitter:card come from defineOgImage on each page.
export default {
    // Pages opt in with definePageMeta.
    viewTransition: false,
    head: {
        title: 'Kashall',
        link: [
            { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
            { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon-192.png' },
            { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        ],
        meta: [
            // Both themes, so the browser can theme its own UI before the CSS arrives.
            { name: "color-scheme", content: "light dark" },
            { name: "description", content: description },
            { property: "og:type", content: "website" },
            { property: "og:site_name", content: "Kashall" },
            { property: "og:description", content: description },
        ]
    }
} satisfies NuxtConfig['app']
