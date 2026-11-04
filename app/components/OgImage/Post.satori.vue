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
    <!-- Satori renders this to a 1200x600 PNG, in the sheet layout's palette and type.
         Vertical padding is added on top of the height and pushes the footer off the
         canvas, so the top and bottom spacing are margins instead. -->
    <div class="relative flex size-full flex-col px-[90px] font-karla" style="background:#1a1918;color:#fcf6ed;">
        <!-- A strip of the Discord banner along the top, fading out before the title. -->
        <img src="/banner.png" width="1200" height="300" class="absolute top-0 left-0"
            style="width:1200px;height:300px;object-fit:cover;object-position:50% 58%;">
        <div class="absolute top-0 left-0 flex"
            style="width:1200px;height:600px;background-image:linear-gradient(180deg, rgba(26,25,24,0.35) 0%, rgba(26,25,24,0.8) 30%, #1a1918 50%), radial-gradient(700px circle at 100% 100%, rgba(82,67,156,0.55), transparent 70%);" />
        <div class="relative mt-[150px] flex items-center text-[30px]">
            <div class="flex font-sniglet text-[40px] font-extrabold"
                style="background-image:linear-gradient(90deg,#b2daf1,#aa68cc);background-clip:text;color:transparent;">
                Kashall
            </div>
            <div class="ml-4 flex" style="color:rgba(252,246,237,0.6);">/ Blog</div>
        </div>
        <div class="relative mt-6 flex max-w-[1020px] font-display leading-[1.08]"
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
