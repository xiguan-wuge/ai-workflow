# NoData 无数据状态组件

用于在列表、表格或其他数据容器为空时展示友好的无数据状态提示。

## 示例

```vue
<template>
  <NoData text="No Results" description="Try adjusting your filters" />
</template>

<script setup>
import { NoData } from '@ai-workflow/components'
</script>
```

## 自定义图标

```vue
<template>
  <NoData :icon="'📬'" text="No Messages" description="Your inbox is empty" />
</template>
```

## 使用默认插槽

```vue
<template>
  <NoData text="No Data Available">
    <template #default>
      <svg width="48" height="48" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#999" stroke-width="2"/>
      </svg>
    </template>
  </NoData>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | string | 'No Data' | 无数据提示主文本 |
| description | string | '' | 可选的描述文本 |
| icon | string | '📭' | 显示的图标（支持 emoji） |

## 样式预览

组件采用垂直居中布局：
- 图标尺寸：48px
- 主文本：16px, 500 weight, 颜色 #666
- 描述文本：14px, 400 weight, 颜色 #999
- 内边距：24px