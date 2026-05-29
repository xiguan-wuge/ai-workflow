<script setup lang="ts">
interface Props {
  text?: string
  description?: string
  icon?: string
}

const { text = 'No Data', description = '', icon = '📭' } = defineProps<Props>()
</script>

<template>
  <div class="nodata">
    <div class="nodata-icon">{{ icon }}</div>
    <div class="nodata-text">{{ text }}</div>
    <div v-if="description" class="nodata-description">{{ description }}</div>
    <slot />
  </div>
</template>

<style scoped>
.nodata {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.nodata-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.nodata-text {
  font-size: 16px;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

.nodata-description {
  font-size: 14px;
  font-weight: 400;
  color: #999;
}
</style>
