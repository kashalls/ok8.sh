<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    description?: string
    date?: string
    tags?: string[]
}>(), {
    title: 'Blog',
    description: '',
    date: '',
    tags: () => [],
})
</script>

<template>
    <!-- Satori renders this to a 1200x600 PNG, in the site's palette and the page's type:
         Sniglet titles and Nunito text.
         Satori can't decode WebP, so the logo and pattern come from PNG copies in /og.
         Vertical padding is added on top of the height and pushes the footer off the
         canvas, so the top and bottom spacing are margins instead. -->
    <div class="relative flex size-full flex-col px-[90px] font-nunito" style="background:#1a1918;color:#fcf6ed;">
        <!-- The site's logo spread, as faint as it sits behind the page. -->
        <div class="absolute flex flex-wrap" style="top:-40px;left:-80px;width:1560px;height:680px;opacity:0.08;">
            <img v-for="n in 6" :key="n" src="/og/pattern.png" width="520" height="340" style="width:520px;height:340px;">
        </div>
        <!-- A glow behind the logo. -->
        <div class="absolute top-0 left-0 flex"
            style="width:1200px;height:600px;background-image:radial-gradient(480px circle at 220px 112px, rgba(82,67,156,0.5), transparent 70%);" />
        <div class="relative mt-[48px] flex items-center text-[30px]">
            <img src="/og/logo.png" width="260" height="127" style="width:260px;height:127px;">
            <div class="ml-4 flex" style="color:rgba(252,246,237,0.6);">/ Blog</div>
        </div>
        <div class="relative mt-6 flex max-w-[1020px] font-sniglet leading-[1.08] tracking-[-0.01em]"
            :class="title.length > 50 ? 'text-[58px]' : 'text-[70px]'">
            {{ title }}
        </div>
        <!-- Satori supports the plain line-clamp property, not Tailwind's -webkit-box version. -->
        <div v-if="description" class="relative mt-5 block max-w-[1000px] text-[30px] leading-[1.35]"
            style="line-clamp:2;color:rgba(252,246,237,0.7);">
            {{ description }}
        </div>
        <div class="relative mt-auto mb-[64px] flex items-center text-[26px]" style="color:rgba(252,246,237,0.6);">
            <div v-if="date" class="flex">{{ date }}</div>
            <div class="ml-auto flex">
                <div v-for="tag in tags.slice(0, 3)" :key="tag" class="ml-3 flex rounded-[10px] px-4 py-1"
                    style="background:#34323b;border:2px solid rgba(170,104,204,0.35);color:#fcf6ed;">
                    {{ tag }}
                </div>
            </div>
        </div>
    </div>
</template>
