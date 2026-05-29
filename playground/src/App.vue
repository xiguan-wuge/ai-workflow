<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { File, Repl, mergeImportMap, useStore, useVueImportMap } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
import '@vue/repl/style.css'

const mainFile = 'src/App.vue'

const welcomeCode = `<script setup lang="ts">
<\/script>

<template>
  <main class="demo">
    <section>
      <HelloWorld msg="Hello from AI Workflow Playground!" />
    </section>

    <section>
      <Calculator />
    </section>

    <section>
      <NoData
        text="No results"
        description="Try editing this file to preview your component changes."
      />
    </section>
  </main>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 24px;
  padding: 24px;
}

section {
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}
</style>
`

const localVueRuntimeUrl = `${window.location.origin}/src/repl-vue-runtime.ts`
const vueRuntimeUrl = import.meta.env.VITE_VUE_RUNTIME_URL || (import.meta.env.DEV ? localVueRuntimeUrl : undefined)
const componentLibraryUrl = import.meta.env.VITE_COMPONENTS_IMPORT_URL
  || (import.meta.env.DEV
    ? `${window.location.origin}/src/repl-package-entry.ts`
    : 'https://cdn.jsdelivr.net/npm/@ai-workflow/components/dist/index.js')

const { importMap: vueImportMap, vueVersion } = useVueImportMap(
  vueRuntimeUrl
    ? {
        runtimeDev: vueRuntimeUrl,
        runtimeProd: vueRuntimeUrl,
      }
    : undefined,
)

const builtinImportMap = computed(() => {
  return mergeImportMap(vueImportMap.value, {
    imports: {
      '@ai-workflow/components': componentLibraryUrl,
    },
  })
})

const files = ref({
  [mainFile]: new File(mainFile, welcomeCode),
  'src/auto-components.d.ts': new File(
    'src/auto-components.d.ts',
    `declare module 'vue' {
  export interface GlobalComponents {
    Calculator: any
    HelloWorld: any
    NoData: any
  }
}
`,
    true,
  ),
})

const store = useStore(
  {
    files,
    mainFile: ref(mainFile),
    activeFilename: ref(mainFile),
    builtinImportMap,
    vueVersion,
    showOutput: ref(true),
    outputMode: ref('preview'),
  },
  location.hash,
)

watchEffect(() => {
  history.replaceState({}, '', store.serialize())
})
</script>

<template>
  <Repl
    class="ai-workflow-repl"
    theme="dark"
    :store="store"
    :editor="Monaco"
    :show-compile-output="true"
    :show-import-map="true"
    :show-ts-config="true"
    :show-ssr-output="true"
    :clear-console="false"
    :preview-options="{
      headHTML: '<style>body{margin:0;font-family:Inter,system-ui,sans-serif;}</style>',
      customCode: {
        importCode: `import { registerAll } from '@ai-workflow/components'`,
        useCode: `registerAll(app)`,
      },
    }"
  />
</template>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
}

body {
  overflow: hidden;
  background: #1a1a1a;
}

.ai-workflow-repl {
  width: 100vw;
  height: 100vh;
}
</style>
