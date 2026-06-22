import { defineConfig } from 'vitepress'
import mdContainer from 'markdown-it-container'
import demoPlugin from './plugins/demo'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  title: 'AI Workflow',
  description: 'Vue 3 Component Library Documentation',
  lang: 'en-US',
  srcDir: '.',
  base: '/ai-workflow/',
  cleanUrls: true,
  sitemap: {
    hostname: 'https://xiguan-wuge.github.io/ai-workflow/'
  },
  markdown: {
    config(md) {
      md.use(mdContainer, 'demo', demoPlugin(md))
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
