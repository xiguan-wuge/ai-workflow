<template>
  <el-checkbox v-model="checked1" disabled>Disabled</el-checkbox>
  <el-checkbox v-model="checked2">Not disabled</el-checkbox>
  <hr>
  <el-color-picker-panel v-model="color" />
  <hr>
  <div class="demo-color-block">
    <span class="demonstration">With default value</span>
    <el-color-picker v-model="color1" />
  </div>
  <div class="demo-color-block">
    <span class="demonstration">With no default value</span>
    <el-color-picker v-model="color2" />
  </div>
</template>

<script lang="ts" setup>
import { ElColorPicker, ElColorPickerPanel, ElCheckbox } from 'element-plus'
import { ref } from 'vue'

const checked1 = ref(false)
const checked2 = ref(true)
const color = ref('#409EFF')
const color1 = ref('#409EFF')
const color2 = ref()

</script>
