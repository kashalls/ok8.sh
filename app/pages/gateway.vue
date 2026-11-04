<script setup lang="ts">
// Fallback page for hostnames that resolve to the gateway with no service
// configured behind them. Point the gateway's default backend here.
definePageMeta({ layout: 'sheet' })

const url = useRequestURL()
const host = computed(() => url.host)
const { openContact } = useContact()

useSeoMeta({
    title: 'Gateway — No Service Configured',
    description: 'This hostname is resolving to a gateway endpoint with no configured service.',
    ogDescription: 'This hostname is resolving to a gateway endpoint with no configured service.',
})
// Served for any unconfigured hostname, so keep it out of search indexes.
useRobotsRule(false)
</script>

<template>
    <main>
        <h1 class="doc-title">No service configured</h1>
        <p class="gateway-text">This hostname is resolving to one of my gateway endpoints, but there's no service wired up behind it yet.</p>

        <p class="gateway-label">Hostname</p>
        <p class="gateway-host">{{ host }}</p>

        <ul class="cards gateway-next">
            <li>
                <button type="button" class="row" @click="openContact">
                    <span class="row-name">Contact me</span>
                    <span class="row-text">Expected something here? Let me know.</span>
                </button>
            </li>
            <li>
                <NuxtLink to="/" class="row">
                    <span class="row-name">Home</span>
                    <span class="row-text">Who I am and the projects I work on.</span>
                </NuxtLink>
            </li>
        </ul>
    </main>
</template>

<style scoped>
.gateway-text {
    margin-top: 1rem;
}

.gateway-label {
    margin-top: 2rem;
    font-size: 0.9rem;
    color: var(--muted);
}

.gateway-host {
    margin-top: 0.25rem;
    font-family: var(--font-mono);
    color: var(--cream);
    overflow-wrap: anywhere;
}

.gateway-next {
    margin-top: 2rem;
}
</style>
