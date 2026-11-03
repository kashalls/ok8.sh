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
        // Policies for other projects, served at /legal/<project>/<page> and not linked from the site.
        legal: defineCollection({
            type: 'page',
            source: 'legal/**/*.md',
            schema: z.object({
                updated: z.date(),
            }),
        }),
    },
})
