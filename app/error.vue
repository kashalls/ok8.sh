<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const meta = computed(() => statusMeta(props.error?.statusCode))

useHead({ title: () => `𑣲${meta.value.code} ${meta.value.title} 𑄝੭` })

defineOgImage('Default', {
    title: `𑣲${meta.value.code} ${meta.value.title} 𑄝੭`,
    description: meta.value.description,
    badge: 'Error',
})

// Where to go next. A server error might pass, so reloading comes first there.
const reload = () => window.location.reload()
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
                    This page wandered off <span class="kaomoji" aria-hidden="true">(・・？)</span> Maybe one of these has what you're after?
                </p>
                <p v-else class="error-text">{{ meta.description }} <span class="kaomoji" aria-hidden="true">(；ω；)</span></p>

                <ul class="cards error-next">
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
</style>
