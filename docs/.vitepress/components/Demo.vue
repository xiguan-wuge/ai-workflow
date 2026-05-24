<template>
  <div class="vp-doc-demo">
    <div v-if="decodedDescription" class="demo-description" v-html="decodedDescription" />
    <div class="demo-container">
      <div class="demo-preview">
        <slot name="source" />
      </div>
      <div class="demo-actions">
        <button class="demo-action-btn" @click="copyCode">
          <span v-if="!copied">复制代码</span>
          <span v-else>已复制</span>
        </button>
        <button class="demo-action-btn" @click="sourceVisible = !sourceVisible">
          {{ sourceVisible ? '收起代码' : '展开代码' }}
        </button>
      </div>
      <div v-show="sourceVisible" class="demo-code" v-html="decodedSource" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  sources: string[]
  rawSources: string[]
  path: string
  description?: string
}>()

const sourceVisible = ref(false)
const copied = ref(false)

const decodedSource = computed(() => decodeURIComponent(props.sources[0]))
const decodedDescription = computed(() =>
  props.description ? decodeURIComponent(props.description) : ''
)

const decodedRawSource = computed(() => decodeURIComponent(props.rawSources[0]))

async function copyCode() {
  try {
    await navigator.clipboard.writeText(decodedRawSource.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // fallback
  }
}
</script>

<style scoped>
.vp-doc-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
}

.demo-description {
  padding: 16px 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  font-size: 14px;
}

.demo-preview {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.demo-actions {
  padding: 8px 16px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.demo-action-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  color: var(--vp-c-text-2);
  transition: border-color 0.25s, color 0.25s;
}

.demo-action-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.demo-code {
  border-top: 1px solid var(--vp-c-divider);
  max-height: 400px;
  overflow: auto;
}

.demo-code :deep(div[class*='language-']) {
  margin: 0;
  border-radius: 0;
}
</style>
