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
            { rel: 'icon', type: 'image/png', href: '/logo.png' }
        ],
        meta: [
            { name: "description", content: description },
            { property: "og:type", content: "website" },
            { property: "og:site_name", content: "Kashall" },
            { property: "og:description", content: description },
        ]
    }
} satisfies NuxtConfig['app']
