import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI Workflow',
  description: 'Vue 3 Component Library Documentation',
  base: '/',
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
          { text: 'HelloWorld', link: '/components/helloworld' }
        ]
      }
    ]
  }
})
