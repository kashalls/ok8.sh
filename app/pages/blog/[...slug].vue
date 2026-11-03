<script setup lang="ts">
definePageMeta({ layout: 'sheet', viewTransition: true })

const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
    queryCollection('blog').path(route.path).where('draft', '=', false).first(),
)

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useSeoMeta({
    title: `${post.value.title} — Kashall`,
    description: post.value.description,
    ogDescription: post.value.description,
    ogType: 'article',
    articlePublishedTime: new Date(post.value.date).toISOString(),
    articleModifiedTime: post.value.updated && new Date(post.value.updated).toISOString(),
    articleTag: post.value.tags,
})
const date = computed(() => formatDate(postDate(post.value!.date)))
const updated = computed(() => post.value?.updated && formatDate(postDate(post.value.updated)))
const editUrl = computed(() => `${SOURCE_URL}/edit/main/content/${post.value!.stem}.${post.value!.extension}`)

defineOgImage('Post', {
    title: post.value.title,
    description: post.value.description,
    date: date.value,
    tags: post.value.tags,
})
</script>

<template>
    <main v-if="post">
        <header class="mb-10">
            <NuxtLink to="/blog" class="post-back">
                <UIcon name="i-ph-arrow-left" />
                All posts
            </NuxtLink>
            <h1 class="doc-title mt-6">
                <span class="post-title" :style="{ viewTransitionName: postTransitionName(post.path) }">{{ post.title }}</span>
            </h1>
            <p v-if="post.description" class="post-lead">{{ post.description }}</p>
            <p class="post-meta">
                <time :datetime="new Date(post.date).toISOString()">{{ date }}</time>
                <time v-if="updated" :datetime="new Date(post.updated!).toISOString()">Updated {{ updated }}</time>
                <span v-if="post.tags?.length" class="post-tags">
                    <NuxtLink v-for="tag in post.tags" :key="tag" :to="{ path: '/blog', query: { q: tag } }" class="chip">{{ tag }}</NuxtLink>
                </span>
            </p>
        </header>

        <ContentRenderer :value="post" class="doc-body" />

        <footer class="post-footer">
            <a :href="editUrl" target="_blank" rel="noopener" class="post-edit">
                <UIcon name="i-ph-pencil-simple" />
                Edit this page on GitHub
            </a>

            <BlogComments :path="post.path" class="post-comments" />
        </footer>
    </main>
</template>

<style scoped>
.post-back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--muted);
    transition: color 200ms, gap 200ms;
}

.post-back:is(:hover, :focus-visible) {
    gap: 0.6rem;
    color: var(--cream);
}

/* One box even when the title wraps, which a view transition needs. */
.post-title {
    display: inline-block;
}

.post-lead {
    margin-top: 0.75rem;
    font-size: 1.05rem;
}

.post-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem 1rem;
    margin-top: 0.75rem;
    font-size: 0.85rem;
    color: var(--muted);
}

.post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.post-footer {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 3rem;
}

.post-edit {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    align-self: flex-start;
    font-size: 0.85rem;
    color: var(--muted);
    transition: color 200ms;
}

.post-edit:hover {
    color: var(--cream);
}

.post-comments {
    padding-top: 2rem;
    border-top: 1px solid var(--rule);
}
</style>
