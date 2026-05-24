<script setup lang="ts">
import { ref } from 'vue'
import { Calculator, HelloWorld } from '@ai-workflow/components'
import test1 from './components/test1.vue'
import test2 from './components/test2.vue'
import test3 from './components/test3.vue'


const selectedComponent = ref<'calculator' | 'helloworld' | 'test1' | 'test2'>('calculator')
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
      <button
        :class="{ active: selectedComponent === 'test1' }"
        @click="selectedComponent = 'test1'"
      >
        test1
      </button>
      <button
        :class="{ active: selectedComponent === 'test2' }"
        @click="selectedComponent = 'test2'"
      >
        test2
      </button>
      <button
        :class="{ active: selectedComponent === 'test3' }"
        @click="selectedComponent = 'test3'"
      >
        test3
      </button>
    </div>

    <div class="component-display">
      <Calculator v-if="selectedComponent === 'calculator'" />
      <HelloWorld v-else-if="selectedComponent === 'helloworld'" msg="Hello from Playground!" />
      <test1 v-else-if="selectedComponent === 'test1'" />
      <test2 v-else-if="selectedComponent === 'test2'" />
      <test3 v-else-if="selectedComponent === 'test3'" />
      <hr>
      <hr>
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