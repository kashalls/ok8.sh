import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        // Posts live in content/blog/<slug>.md and are served at /blog/<slug>.
        blog: defineCollection({
            type: 'page',
            source: 'blog/**/*.md',
            schema: z.object({
                date: z.date(),
                // Last meaningful edit; shown beside the date when set.
                updated: z.date().optional(),
                tags: z.array(z.string()).default([]),
                draft: z.boolean().default(false),
            }),
        }),
        // The site's privacy policy (/legal/privacy, linked from the footer), and policies for
        // other projects at /legal/<project>/<page>, which aren't linked from the site.
        legal: defineCollection({
            type: 'page',
            source: 'legal/**/*.md',
            schema: z.object({
                updated: z.date(),
            }),
        }),
    },
})
