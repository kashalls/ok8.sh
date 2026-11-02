import type { NuxtConfig } from 'nuxt/schema'

const description =
    "Platform engineer based in Oregon, building Kubernetes infrastructure and the tooling around it."

// og:image and twitter:card come from defineOgImage on each page.
export default {
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
