import { defineConfig } from 'vitepress'
import demoPlugin from './plugins/demo'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  title: 'AI Workflow',
  description: 'Vue 3 Component Library Documentation',
  base: '/ai-workflow/',
  markdown: {
    config(md) {
      demoPlugin(md)
    }
  },
  vite: {
    resolve: {
      alias: {
        '@ai-workflow/components': fileURLToPath(
          new URL('../../packages/components/src/index.ts', import.meta.url)
        )
      }
    }
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation', link: '/' },
          { text: 'Quick Start', link: '/quick-start' }
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'Calculator', link: '/components/calculator' },
          { text: 'HelloWorld', link: '/components/helloworld' },
          { text: 'NoData', link: '/components/nodata' }
        ]
      }
    ]
  },
  vue: {
    runtimeCompiler: true
  }
})