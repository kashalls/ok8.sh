<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <div class="flex-grow flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div class="container mx-auto px-4 py-16 text-center">
        <h1 class="text-6xl font-bold mb-4">waifulabs</h1>
        <p class="text-2xl text-gray-300 mb-12">Home Infrastructure</p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <UButton
            to="https://docs.ok8.sh"
            target="_blank"
            size="xl"
            color="primary"
            variant="solid"
            icon="i-heroicons-book-open"
            label="Documentation"
          />
          <UButton
            to="/blog"
            size="xl"
            color="white"
            variant="outline"
            icon="i-heroicons-newspaper"
            label="Blog"
          />
          <UButton
            to="/changelog"
            size="xl"
            color="white"
            variant="ghost"
            icon="i-heroicons-clipboard-document-list"
            label="Changelog"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-6">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; {{ new Date().getFullYear() }} waifulabs. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'waifulabs - Home Infrastructure',
  meta: [
    { name: 'description', content: 'Welcome to waifulabs home infrastructure' }
  ]
})
</script>
