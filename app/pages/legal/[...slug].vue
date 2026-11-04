<script setup lang="ts">
definePageMeta({ layout: 'sheet', viewTransition: true })

const route = useRoute()

const { data: page } = await useAsyncData(`legal-${route.path}`, () =>
    queryCollection('legal').path(route.path).first(),
)

if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
    title: page.value.title,
    description: page.value.description,
    ogDescription: page.value.description,
})
useRobotsRule(false)

defineOgImage('Default', {
    title: page.value.title,
    description: page.value.description,
})

const updated = computed(() => formatDate(postDate(page.value!.updated)))
</script>

<template>
    <main v-if="page">
        <header class="mt-10 mb-8">
            <h1 class="doc-title">{{ page.title }}</h1>
            <p class="mt-2 text-sm text-(--muted)">
                Last updated <time :datetime="new Date(page.updated).toISOString()">{{ updated }}</time>
            </p>
        </header>
        <ContentRenderer :value="page" class="doc-body" />
    </main>
</template>
