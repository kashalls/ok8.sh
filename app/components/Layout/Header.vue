<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const menuLinks = computed<NavigationMenuItem[]>(() => [
    { label: 'Home', icon: 'i-ph-house', to: '/', active: route.path === '/' },
    { label: 'Blog', icon: 'i-ph-pen-nib', to: '/blog' },
])
</script>

<template>
    <!-- Sized by the layout's grid row rather than UHeader's own height and
         stickiness. -->
    <UHeader title="Kashall" mode="slideover" :menu="{ title: 'Menu' }" :ui="{
        root: 'static z-auto h-auto bg-transparent backdrop-blur-none bg-gradient-to-tr from-white/25 to-white/25 dark:from-[#0e0c12]/25 dark:to-[#0e0f0f]/25 [grid-area:header]',
        container: 'max-w-[96rem] px-2 sm:px-2 md:px-4 lg:px-4',
        title: 'items-center gap-2.5 rounded-md px-2.5 py-1.5 text-base font-semibold transition hover:text-primary',
        right: 'gap-1',
        content: 'max-w-xs sm:max-w-xs',
    }">
        <template #title>
            <Logo class="size-6" />
            <span class="hidden font-display sm:inline">Kashall</span>
        </template>

        <template #right>
            <LayoutCommandPalette />
            <!-- No room below lg; the menu carries them there. -->
            <LayoutDisplay />
            <LayoutSocial class="hidden lg:flex" />
        </template>

        <template #body>
            <UNavigationMenu :items="menuLinks" orientation="vertical" color="primary" />
            <USeparator class="my-6" />
            <LayoutSocial />
        </template>
    </UHeader>
</template>
