<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-16 max-w-4xl">
      <!-- Header -->
      <div class="mb-12">
        <NuxtLink to="/" class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <UIcon name="i-heroicons-arrow-left" class="mr-2" />
          Back to Home
        </NuxtLink>
        <h1 class="text-5xl font-bold text-gray-900 mb-4">Changelog</h1>
        <p class="text-xl text-gray-600">Release history for waifulabs infrastructure</p>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-gray-400" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-start">
          <UIcon name="i-heroicons-exclamation-triangle" class="text-red-600 text-2xl mr-3 mt-1" />
          <div>
            <h3 class="text-lg font-semibold text-red-900 mb-2">Failed to load changelog</h3>
            <p class="text-red-700">{{ error.message }}</p>
          </div>
        </div>
      </div>

      <!-- Releases -->
      <div v-else-if="releases && releases.length > 0" class="space-y-8">
        <article
          v-for="release in releases"
          :key="release.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                <a :href="release.html_url" target="_blank" class="hover:text-primary-600">
                  {{ release.name || release.tag_name }}
                </a>
              </h2>
              <div class="flex items-center gap-4 text-sm text-gray-600">
                <span class="inline-flex items-center">
                  <UIcon name="i-heroicons-tag" class="mr-1" />
                  {{ release.tag_name }}
                </span>
                <span class="inline-flex items-center">
                  <UIcon name="i-heroicons-calendar" class="mr-1" />
                  {{ formatDate(release.published_at) }}
                </span>
                <span v-if="release.author" class="inline-flex items-center">
                  <UIcon name="i-heroicons-user" class="mr-1" />
                  {{ release.author.login }}
                </span>
              </div>
            </div>
            <UBadge v-if="release.prerelease" color="yellow" variant="subtle">
              Pre-release
            </UBadge>
            <UBadge v-else-if="releases.indexOf(release) === 0" color="green" variant="subtle">
              Latest
            </UBadge>
          </div>

          <div v-if="release.body" class="prose prose-sm max-w-none text-gray-700">
            <div v-html="renderMarkdown(release.body)"></div>
          </div>
        </article>
      </div>

      <!-- No Releases -->
      <div v-else class="bg-gray-100 rounded-lg p-12 text-center">
        <UIcon name="i-heroicons-inbox" class="text-6xl text-gray-400 mb-4" />
        <p class="text-xl text-gray-600">No releases found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

useHead({
  title: 'Changelog - waifulabs',
  meta: [
    { name: 'description', content: 'Release history for waifulabs infrastructure' }
  ]
})

// Fetch releases from GitHub API
const { data: releases, pending, error } = await useFetch('https://api.github.com/repos/waifulabs/infrastructure/releases', {
  headers: {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Render markdown
const renderMarkdown = (markdown: string) => {
  return marked(markdown)
}
</script>
