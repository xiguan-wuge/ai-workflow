# Proposal: Add Vue Component Demo Plugin for VitePress

## Summary

创建一个 VitePress 插件，支持在 Markdown 文档中使用 `:::demo` 块语法引入 Vue 组件示例，实现组件效果预览和代码展示。

## Problem Statement

当前编写组件文档时存在以下问题：
- 组件代码和属性说明混在一起，文档冗长
- 无法直观展示组件效果，需要读者自行想象
- 修改组件示例需要同时维护文档和代码

## Solution

参考 Element Plus 的实现，开发一个 VitePress Demo 插件：
- Markdown 语法：`:::demo 描述\ncomponent/path\n:::` 块级语法
- 自动读取 `docs/examples/{component}/{path}.vue` 文件
- 注册全局组件用于预览
- Demo 组件同时渲染预览和源码

## Usage Example

在 `docs/components/nodata.md` 中：

```markdown
:::demo 基础用法
nodata/basic
:::

:::demo 带图标的 NoData
nodata/with-icon
:::
```

### 示例文件内容

`docs/examples/nodata/basic.vue`:
```vue
<template>
  <NoData text="No Data" description="暂无数据" />
</template>

<script setup>
import { NoData } from '@ai-workflow/components'
</script>
```

`docs/examples/nodata/with-icon.vue`:
```vue
<template>
  <NoData text="No Messages" description="收件箱为空" icon="📬" />
</template>

<script setup>
import { NoData } from '@ai-workflow/components'
</script>
```

### 渲染效果

文档页面会同时显示：
1. **组件预览区域**：渲染后的实际组件效果
2. **源码展示区域**：Vue 源码 + JS 转换后的代码

### 路径映射规则

| 文档中引用 | 示例文件路径 | 全局组件名 |
|-----------|-------------|-----------|
| `nodata/basic` | `docs/examples/nodata/basic.vue` | `ep-nodata-basic` |
| `nodata/with-icon` | `docs/examples/nodata/with-icon.vue` | `ep-nodata-with-icon` |

对应文件结构：
```
docs/
├── examples/              # 组件示例目录
│   └── nodata/
│       ├── basic.vue      # 基础示例
│       └── with-icon.vue  # 带图标示例
└── components/
    └── nodata.md          # 文档引用示例
```

## Technical Approach

1. **Container 插件**：使用 markdown-it container 规则解析 `:::demo` 块
2. **文件读取**：在 render 阶段读取对应的 .vue 文件
3. **组件注册**：示例文件注册为全局组件（如 `nodata/basic` → `ep-nodata-basic`）
4. **Demo 组件**：VitePress 包装组件，渲染预览 + 源码（Vue/JS）

## Benefits

1. **文档简洁**：组件代码与文档分离
2. **即时预览**：文档中直接展示组件效果
3. **源码展示**：同时展示 Vue 和 JS 版本的源码
4. **易于维护**：修改示例只需更新 Vue 文件

## Impact

- 新增文件：`docs/.vitepress/plugins/demo.ts`
- 新增目录：`docs/examples/`（存放组件示例 Vue 文件）
- 修改文件：`docs/.vitepress/config.ts`（注册插件和 Demo 组件）
- 完全向后兼容