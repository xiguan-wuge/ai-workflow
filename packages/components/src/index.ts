// @ai-workflow/components - Vue 3 Component Library
import type { App } from 'vue'
import Calculator from './components/Calculator.vue'
import HelloWorld from './components/HelloWorld.vue'
import NoData from './components/NoData.vue'

export { Calculator, HelloWorld, NoData }

const components = {
  Calculator,
  HelloWorld,
  NoData,
}

export function registerAll(app: App) {
  for (const [name, component] of Object.entries(components)) {
    app.component(name, component)
  }
}
