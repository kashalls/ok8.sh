<script setup lang="ts">
definePageMeta({ viewTransition: true })

const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
    queryCollection('blog').path(route.path).where('draft', '=', false).first(),
)

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useSeoMeta({
    title: `𑣲${post.value.title} 𑄝੭`,
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
        <div class="read-progress" />
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
                    <NuxtLink v-for="tag in post.tags" :key="tag" :to="{ path: '/blog', query: { q: tag } }" class="chip" :style="{ '--tint': tagTint(tag) }">{{ tag }}</NuxtLink>
                </span>
                <HiddenStar id="mint" />
            </p>
        </header>

        <ContentRenderer :value="post" class="doc-body" />

        <footer class="post-footer">
            <NuxtLink :to="editUrl" target="_blank" class="post-edit">
                <UIcon name="i-ph-pencil-simple" />
                Edit this page on GitHub
            </NuxtLink>

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
    color: var(--heading);
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

/* How far through the post you are: the dividers' wavy pastel line along the top of the
   window, filling as you scroll. Decorative, so browsers without scroll-driven animations
   simply don't show it. */
.read-progress {
    display: none;
}

@media (prefers-reduced-motion: no-preference) {
    @supports (animation-timeline: scroll()) {
        .read-progress {
            position: fixed;
            z-index: 50;
            top: 0;
            left: 0;
            display: block;
            width: 100%;
            height: 6px;
            background: linear-gradient(90deg, rgb(178 218 241 / 0.9), rgb(170 104 204 / 0.9), rgb(177 237 217 / 0.85), rgb(219 136 73 / 0.85));
            mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='6'%3E%3Cpath d='M0 3Q4 0 8 3T16 3' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E") 0 0 / 16px 6px repeat-x;
            transform-origin: 0 50%;
            pointer-events: none;
            animation: read-progress auto linear;
            animation-timeline: scroll(root);
        }
    }
}

/* The site's own reduced motion setting, on top of the system one. */
html.reduce-motion .read-progress {
    display: none;
}

@keyframes read-progress {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
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
    color: var(--heading);
}

.post-comments {
    padding-top: 2rem;
    border-top: 1px solid var(--rule);
}
</style>
