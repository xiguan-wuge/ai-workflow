# HelloWorld 示例组件

用于演示的基础 Hello World 组件。

## 示例

```vue
<template>
  <HelloWorld msg="你好！" />
</template>

<script setup>
import { HelloWorld } from '@ai-workflow/components'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| msg | string | 'Hello' | 要显示的消息内容 |
