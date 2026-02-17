<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-16 max-w-4xl">
      <div class="mb-12">
        <NuxtLink to="/" class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <UIcon name="i-heroicons-arrow-left" class="mr-2" />
          Back to Home
        </NuxtLink>
        <h1 class="text-5xl font-bold text-gray-900 mb-4">Blog</h1>
        <p class="text-xl text-gray-600">Updates and articles from waifulabs</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <UIcon name="i-heroicons-pencil-square" class="text-6xl text-gray-400 mb-4" />
        <p class="text-xl text-gray-600 mb-2">Blog coming soon</p>
        <p class="text-gray-500">Stay tuned for updates and articles</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Blog - waifulabs',
  meta: [
    { name: 'description', content: 'Updates and articles from waifulabs' }
  ]
})
</script>
