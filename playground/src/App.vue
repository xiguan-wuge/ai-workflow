<script setup lang="ts">
import { ref } from 'vue'
import { Calculator, HelloWorld } from '@ai-workflow/components'

const selectedComponent = ref<'calculator' | 'helloworld'>('calculator')
</script>

<template>
  <div class="playground">
    <h1>Component Playground</h1>

    <div class="selector">
      <button
        :class="{ active: selectedComponent === 'calculator' }"
        @click="selectedComponent = 'calculator'"
      >
        Calculator
      </button>
      <button
        :class="{ active: selectedComponent === 'helloworld' }"
        @click="selectedComponent = 'helloworld'"
      >
        HelloWorld
      </button>
    </div>

    <div class="component-display">
      <Calculator v-if="selectedComponent === 'calculator'" />
      <HelloWorld v-else msg="Hello from Playground!" />
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f0f0f0;
  min-height: 100vh;
}

.playground {
  padding: 40px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.selector {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 30px;
}

.selector button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.selector button.active {
  background: #4CAF50;
  color: white;
}

.component-display {
  display: flex;
  justify-content: center;
}
</style>