<script setup lang="ts">
const props = withDefaults(defineProps<{
    title?: string
    description?: string
    badge?: string
}>(), {
    title: 'Kashall',
    description: 'Platform engineer',
    badge: '',
})
// The name already heads the card when the page is the home page.
const showName = computed(() => props.title !== 'Kashall')
</script>

<template>
    <!-- Satori renders this to a 1200x600 PNG, in the sheet layout's palette and type.
         Vertical padding is added on top of the height and pushes content off the
         canvas, so the bottom spacing is a margin instead. -->
    <div class="relative flex size-full flex-col px-[90px] font-karla" style="background:#1a1918;color:#fcf6ed;">
        <!-- The Discord banner across the top, fading into the background behind the text. -->
        <img src="/banner.png" width="1200" height="480" class="absolute top-0 left-0"
            style="width:1200px;height:480px;object-fit:cover;object-position:50% 60%;">
        <div class="absolute top-0 left-0 flex"
            style="width:1200px;height:600px;background-image:linear-gradient(180deg, rgba(26,25,24,0.15) 0%, rgba(26,25,24,0.6) 40%, #1a1918 78%), radial-gradient(700px circle at 100% 100%, rgba(82,67,156,0.55), transparent 70%);" />
        <div class="relative mt-auto mb-[72px] flex flex-col">
            <div v-if="showName || badge" class="flex items-center">
                <div v-if="showName" class="flex font-sniglet text-[40px] font-extrabold"
                    style="background-image:linear-gradient(90deg,#b2daf1,#aa68cc);background-clip:text;color:transparent;">
                    Kashall
                </div>
                <div v-if="badge" class="flex rounded-[10px] px-4 py-1 text-[26px]"
                    :class="showName ? 'ml-5' : ''"
                    style="background:#34323b;border:2px solid rgba(170,104,204,0.35);color:#f6c252;">
                    {{ badge }}
                </div>
            </div>
            <!-- The home page's title is the name, set like the header's. -->
            <div v-if="!showName" class="mt-4 flex font-sniglet text-[96px] leading-[1.05] font-extrabold"
                style="background-image:linear-gradient(90deg,#b2daf1,#aa68cc);background-clip:text;color:transparent;">
                {{ title }}
            </div>
            <div v-else class="mt-4 flex max-w-[1020px] font-display text-[84px] leading-[1.05]">
                {{ title }}
            </div>
            <!-- Satori supports the plain line-clamp property, not Tailwind's -webkit-box version. -->
            <div class="mt-5 block max-w-[1000px] text-[32px] leading-[1.35]" style="line-clamp:2;color:rgba(252,246,237,0.7);">
                {{ description }}
            </div>
        </div>
    </div>
</template>
