<script setup lang="ts">
const props = withDefaults(defineProps<{
    title?: string
    description?: string
}>(), {
    title: 'Kashall',
    description: 'Platform engineer',
})
// The home page's card is the logo itself; other pages put their title under it.
const isHome = computed(() => props.title === 'Kashall')
</script>

<template>
    <!-- Satori renders this to a 1200x600 PNG, in the site's palette and the page's type:
         Sniglet titles and Nunito text.
         Satori can't decode WebP, so the logo and pattern come from PNG copies in /og.
         Vertical padding is added on top of the height and pushes content off the
         canvas, so vertical spacing is margins instead. -->
    <div class="relative flex size-full flex-col px-[90px] font-nunito" style="background:#1a1918;color:#fcf6ed;">
        <!-- The site's logo spread, as faint as it sits behind the page. -->
        <div class="absolute flex flex-wrap" style="top:-40px;left:-80px;width:1560px;height:680px;opacity:0.08;">
            <img v-for="n in 6" :key="n" src="/og/pattern.png" width="520" height="340" style="width:520px;height:340px;">
        </div>
        <div class="absolute top-0 left-0 flex"
            style="width:1200px;height:600px;background-image:radial-gradient(640px circle at 50% 42%, rgba(82,67,156,0.5), transparent 70%);" />

        <div v-if="isHome" class="relative my-auto flex flex-col items-center">
            <img src="/og/logo.png" width="720" height="353" style="width:720px;height:353px;">
            <div class="mt-6 block max-w-[920px] text-center text-[32px] leading-[1.35]" style="line-clamp:2;color:rgba(252,246,237,0.75);">
                {{ description }}
            </div>
        </div>

        <template v-else>
            <div class="relative mt-[56px] flex">
                <img src="/og/logo.png" width="320" height="157" style="width:320px;height:157px;">
            </div>
            <div class="relative mt-auto mb-[72px] flex flex-col">
                <div class="flex max-w-[1020px] font-sniglet text-[84px] leading-[1.05] tracking-[-0.01em]">
                    {{ title }}
                </div>
                <!-- Satori supports the plain line-clamp property, not Tailwind's -webkit-box version. -->
                <div class="mt-5 block max-w-[1000px] text-[32px] leading-[1.35]" style="line-clamp:2;color:rgba(252,246,237,0.7);">
                    {{ description }}
                </div>
            </div>
        </template>
    </div>
</template>
