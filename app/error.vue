<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const meta = computed(() => statusMeta(props.error?.statusCode))

useHead({ title: () => `${meta.value.code} — ${meta.value.title}` })

defineOgImage('Default', {
    title: `${meta.value.code} — ${meta.value.title}`,
    description: meta.value.description,
    badge: 'Error',
})

// Where to go next. A server error might pass, so reloading comes first there.
const reload = () => { if (import.meta.client) window.location.reload() }
const next = computed(() => [
    ...(meta.value.code >= 500 ? [{ name: 'Reload', text: 'Try the page again.', go: reload }] : []),
    { name: 'Home', text: 'Who I am and the projects I work on.', go: () => clearError({ redirect: '/' }) },
    { name: 'Blog', text: 'Posts about my homelab, Kubernetes and the tools I build.', go: () => clearError({ redirect: '/blog' }) },
])
</script>

<template>
    <UApp>
        <NuxtLayout name="sheet">
            <main>
                <div class="row-top">
                    <h1 class="doc-title">{{ meta.title }}</h1>
                    <span class="error-code">{{ meta.code }}</span>
                </div>
                <p v-if="meta.code === 404" class="error-text">
                    What you are looking for could not be found. Here are some other things for you to look at.
                </p>
                <p v-else class="error-text">{{ meta.description }}</p>

                <ul class="rows error-next">
                    <li v-for="item in next" :key="item.name">
                        <button type="button" class="row" @click="item.go">
                            <span class="row-name">{{ item.name }}</span>
                            <span class="row-text">{{ item.text }}</span>
                        </button>
                    </li>
                </ul>
            </main>
        </NuxtLayout>
    </UApp>
</template>

<style scoped>
.error-code {
    font-size: 0.9rem;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
}

.error-text {
    margin-top: 1rem;
}

.error-next {
    margin-top: 2rem;
}

.error-next .row {
    width: 100%;
    text-align: left;
}
</style>
