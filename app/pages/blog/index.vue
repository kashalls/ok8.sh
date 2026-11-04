<script setup lang="ts">
import { refDebounced } from '@vueuse/core'

definePageMeta({ layout: 'sheet', viewTransition: true })

const description = 'Posts about my homelab, Kubernetes and the tools I build.'
useSeoMeta({ title: 'Blog — Kashall', description, ogDescription: description })
defineOgImage('Default', { title: 'Blog', description })

const { data: posts } = await useAsyncData('blog-posts', () =>
    queryCollection('blog')
        .where('draft', '=', false)
        .order('date', 'DESC')
        .select('title', 'description', 'path', 'date', 'tags')
        .all(),
)

// The page is prerendered, so ?q= (a post's tag links here) is read in the browser.
const route = useRoute()
const router = useRouter()
const query = ref('')
onMounted(() => {
    if (typeof route.query.q === 'string') query.value = route.query.q
})
const debouncedQuery = refDebounced(query, 200)
watch(debouncedQuery, q => router.replace({ query: q.trim() ? { q: q.trim() } : {} }))

// A post matches when every word appears in its title, description or tags.
const terms = computed(() => query.value.toLowerCase().split(/\s+/).filter(Boolean))
const shown = computed(() => (posts.value ?? []).filter((post) => {
    const text = [post.title, post.description, ...(post.tags ?? [])].join(' ').toLowerCase()
    return terms.value.every(term => text.includes(term))
}))
</script>

<template>
    <main>
        <h1 class="doc-title">Blog</h1>
        <form role="search" class="blog-search" @submit.prevent>
            <input v-model="query" type="search" placeholder="Search posts" aria-label="Search posts">
            <a href="/feed.xml" target="_blank" class="blog-rss">RSS</a>
        </form>

        <ul v-if="shown.length" class="rows">
            <li v-for="post in shown" :key="post.path">
                <NuxtLink :to="post.path" class="row">
                    <span class="row-top">
                        <span class="row-name" :style="{ viewTransitionName: postTransitionName(post.path) }">{{ post.title }}</span>
                        <time :datetime="new Date(post.date).toISOString()" class="row-meta">{{ formatDate(postDate(post.date)) }}</time>
                    </span>
                    <span v-if="post.description" class="row-text">{{ post.description }}</span>
                </NuxtLink>
            </li>
        </ul>
        <p v-else class="blog-empty">Nothing matches “{{ query }}”. Try fewer words.</p>
    </main>
</template>

<style scoped>
.blog-search {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin: 1.5rem 0 1rem;
}

.blog-search input {
    flex: 1;
    min-width: 0;
    padding: 0.5rem 0.7rem;
    border: 1px solid var(--rule);
    border-radius: 6px;
    background: var(--charcoal);
    color: var(--cream);
    transition: border-color 200ms, box-shadow 200ms;
}

.blog-search input::placeholder {
    color: rgb(252 246 237 / 0.4);
}

/* The border and a ring in gold stand in for the outline. */
.blog-search input:focus {
    border-color: var(--gold);
    outline: none;
    box-shadow: 0 0 0 1px var(--gold);
}

.blog-rss {
    font-size: 0.85rem;
    color: var(--muted);
    transition: color 200ms;
}

.blog-rss:hover {
    color: var(--cream);
}

.blog-empty {
    margin-top: 1.5rem;
    color: var(--muted);
}
</style>
