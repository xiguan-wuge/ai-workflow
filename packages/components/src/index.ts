// @ai-workflow/components - Vue 3 Component Library
import type { App } from 'vue'
export { default as Calculator } from './components/Calculator.vue'
export { default as HelloWorld } from './components/HelloWorld.vue'
export { default as NoData } from './components/NoData.vue'

const components = {
  Calculator: () => import('./components/Calculator.vue').then(m => m.default),
  HelloWorld: () => import('./components/HelloWorld.vue').then(m => m.default),
  NoData: () => import('./components/NoData.vue').then(m => m.default),
}

export function registerAll(app: App) {
  for (const [name, component] of Object.entries(components)) {
    app.component(name, component as any)
  }
}