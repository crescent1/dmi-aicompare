// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'


export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    'highlight.js/styles/github-dark.css',
    '@/assets/styles/chat.css'
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    deepseek: {
      apikey: process.env.NUXT_DEEPSEEK_API_KEY
    },
    openai: {
      apikey: process.env.NUXT_OPENAI_API_KEY
    },
    anthropic: {
      apikey: process.env.NUXT_ANTHROPIC_API_KEY
    },
    openrouter: {
      apikey: process.env.NUXT_OPENROUTER_API_KEY
    },
    gemini: {
      apikey: process.env.NUXT_GEMINI_API_KEY
    },
  }
})
