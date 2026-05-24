import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Demo from '../components/Demo.vue'
import { registerAll } from '@ai-workflow/components'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册 Demo 组件
    app.component('Demo', Demo)

    // 注册所有业务组件
    registerAll(app)

    // 使用 import.meta.glob 注册示例组件（eager: true 确保 SSR 正确解析）
    const modules = import.meta.glob('../../examples/**/*.vue', { eager: true })
    for (const [path, mod] of Object.entries(modules)) {
      const name = path
        .replace('../../examples/', '')
        .replace('.vue', '')
        .replace(/\//g, '-')
      app.component(`ep-${name}`, (mod as any).default)
    }
  }
} as Theme