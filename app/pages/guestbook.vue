<script setup lang="ts">
definePageMeta({ layout: 'sheet', viewTransition: true })
useHead({ title: 'Guestbook — Kashall' })
</script>

<template>
  <main>
    <h1 class="doc-title">Guestbook</h1>
    <p class="mt-4">Passing through? Say hello, or leave a note for the next visitor.</p>
    <BlogComments path="/guestbook" guestbook class="mt-8" />
  </main>
</template>
