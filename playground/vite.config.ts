import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    conditions: ['source'],
    alias: {
      '@ai-workflow/components': resolve(__dirname, '../packages/components/src/index.ts'),
    },
  },
  server: {
    port: 3000
  }
})