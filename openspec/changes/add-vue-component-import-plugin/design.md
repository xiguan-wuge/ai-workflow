# Design: Vue Component Demo Plugin for VitePress

## Overview

参考 Element Plus 的实现，使用 markdown-it container 插件解析 `:::demo` 块，在文档中渲染组件预览和源码。

## Architecture

```
docs/
├── .vitepress/
│   ├── config.ts          # 注册插件
│   └── plugins/
│       └── demo.ts        # Container 插件
├── examples/              # 组件示例目录
│   └── nodata/
│       ├── basic.vue
│       └── with-icon.vue
└── components/
    └── nodata.md
```

## Plugin Structure

### 1. Container 插件 (demo.ts)

```typescript
import path from 'path'
import fs from 'fs'
import type { MarkdownRenderer } from 'vitepress'

function createDemoContainer(md: MarkdownRenderer) {
  return {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      // 1. 解析 :::demo 块，获取示例路径
      // 2. 读取 docs/examples/{path}.vue 文件
      // 3. 输出 <Demo> 组件，包含源码和渲染结果
    }
  }
}
```

### 2. 语法解析

**Markdown 语法：**
```markdown
:::demo 描述文字（可选）
nodata/basic
:::
```

**解析流程：**
1. `validate()` 验证 `:::demo` 开头
2. `render()` 在 nesting=1 时处理开标签
   - 读取 `tokens[idx + 2]` 获取示例路径（如 `nodata/basic`）
   - 读取 `docs/examples/nodata/basic.vue` 文件内容
   - 输出 Demo 组件包装

### 3. 组件注册规则

| 示例文件路径 | 全局组件名 |
|-------------|-----------|
| `docs/examples/nodata/basic.vue` | `ep-nodata-basic` |
| `docs/examples/nodata/with-icon.vue` | `ep-nodata-with-icon` |

**命名转换：**
- 路径斜杠 `/` 替换为连字符 `-`
- 保持 kebab-case 格式
- 组件名以 `ep-` 前缀区分

### 4. Demo 组件渲染

Demo 组件输出结构：
```html
<Demo :sources="[vueCode, jsCode]" path="nodata/basic">
  <template #source>
    <ep-nodata-basic />  <!-- 实际组件渲染 -->
  </template>
</Demo>
```

## File Structure

### demo.ts 完整实现逻辑

```typescript
export default function demoPlugin(md: MarkdownRenderer) {
  md.use(md.container, 'demo', {
    validate(params) {
      return params.trim().match(/^demo/)
    },

    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        // 获取示例路径（下一行的 token）
        const sourceFile = tokens[idx + 2].content
        // 读取 Vue 文件
        const source = fs.readFileSync(
          path.resolve docs/examples/${sourceFile}.vue`, 'utf-8')
        // 生成 Demo 组件
        return `<Demo ...><template #source><ep-${sourceFile.replace('/', '-')} /></template>`
      }
      return '</Demo>'
    }
  })
}
```

## Usage Syntax

### 基本用法

```markdown
:::demo 基础用法
nodata/basic
:::
```

### 带描述

```markdown
:::demo 可自定义文本和描述
nodata/with-description
:::
```

## Dependencies

- VitePress 1.x
- markdown-it-container
- Node.js fs/path 模块

## Error Handling

| 场景 | 处理方式 |
|------|----------|
| 示例文件不存在 | 抛出错误 `Incorrect source file: ${sourceFile}` |
| 文件读取失败 | 抛出错误并显示具体路径 |
| 组件注册失败 | 跳过该组件，控制台报错 |

## Limitations

1. 示例文件必须在 `docs/examples/` 目录下
2. 示例路径使用 `/` 分隔，不支持嵌套子目录
3. 需要预先注册所有示例组件为全局组件