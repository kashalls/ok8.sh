export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      title: 'waifulabs - Home Infrastructure',
      meta: [
        { name: 'description', content: 'waifulabs home infrastructure landing page' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  ui: {
    theme: {
      colors: ['primary']
    }
  }
})
