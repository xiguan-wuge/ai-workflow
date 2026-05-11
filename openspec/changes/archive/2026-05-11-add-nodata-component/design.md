# Design: NoData Component

## Overview

`NoData` 是一个轻量级的无数据状态展示组件，用于在列表、表格或其他数据容器为空时显示友好的提示信息。

## Component Design

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `'No Data'` | 无数据提示文本 |
| `description` | `string` | `''` | 可选的描述文本 |
| `icon` | `string` | `'📭'` | 显示的图标（支持 emoji 或 SVG 路径） |

### Slots

| Slot | Description |
|------|-------------|
| `default` | 自定义内容区域（可放置自定义图标） |

### Basic Usage

```vue
<template>
  <NoData text="No Results" description="Try adjusting your filters" />
</template>

<script setup>
import { NoData } from '@ai-workflow/components'
</script>
```

## Visual Design

### Layout

- 垂直居中布局
- 图标在上方（大号 emoji 或 48x48 SVG）
- 主文本在图标下方（标题样式）
- 描述文本在主文本下方（副文本样式）
- 整体居中于父容器

### Typography

- 主文本: 16px, font-weight: 500, color: #666
- 描述文本: 14px, font-weight: 400, color: #999

### Spacing

- 图标与文本间距: 12px
- 组件内边距: 24px

## File Structure

```
packages/components/src/
├── components/
│   └── NoData.vue          # 新增组件
└── index.ts                # 修改：添加导出
```

## Implementation Notes

1. 使用 `<script setup lang="ts">` 语法
2. 组件样式使用 `<style scoped>` 避免污染
3. 遵循项目中现有组件的风格（如 HelloWorld.vue）
4. 支持 TypeScript 类型推导
