# AI Workflow Playground

`playground` 使用 Vue 官方 `@vue/repl` 搭建，定位是类似 Element Plus Playground 的通用 Vue3 组件库在线调试环境，而不是普通的静态 demo 页面。

## 设计方案

核心能力：

- 在线编辑 `App.vue`
- 实时编译并预览组件效果
- 查看 `JS`、`CSS`、`SSR`、`Import Map`、`tsconfig.json`
- 开发环境直接加载当前仓库组件源码
- 预览沙箱默认全量注册组件库组件
- 线上环境可通过环境变量切换到发布后的组件库入口

核心文件：

- `src/App.vue`：REPL 主入口
- `src/repl-package-entry.ts`：开发环境组件库入口
- `src/repl-vue-runtime.ts`：开发环境 Vue runtime 入口
- `../packages/components/src/index.ts`：组件库导出与 `registerAll` 全量注册

## 运行机制

开发环境下，REPL 使用 import map 映射本地资源：

```ts
'@ai-workflow/components' -> '/src/repl-package-entry.ts'
'vue' -> '/src/repl-vue-runtime.ts'
```

这样可以避免 REPL 沙箱和组件源码使用两份不同的 Vue runtime。

预览沙箱启动时会在 `app.mount()` 前自动执行：

```ts
import { registerAll } from '@ai-workflow/components'

registerAll(app)
```

因此在 REPL 的 `App.vue` 中可以直接使用组件：

```vue
<template>
  <Calculator />
  <NoData text="No Data" description="暂无数据" />
  <HelloWorld msg="Hello Playground" />
</template>
```

## 本地使用

启动 playground：

```bash
pnpm --filter playground dev
```

访问：

```text
http://127.0.0.1:3000/
```

修改组件源码：

```text
packages/components/src/components/*.vue
```

REPL 会通过本地源码入口加载当前组件库，适合在发布前验证组件行为。

## 按需引入测试

默认情况下组件已经全局注册，不需要手动 import。

如果需要验证按需引入，也可以这样写：

```vue
<script setup lang="ts">
import { NoData } from '@ai-workflow/components'
</script>

<template>
  <NoData text="No Data" />
</template>
```

## 线上配置

线上部署时，默认可以通过环境变量把组件库入口切换到发布后的 ESM 地址：

```bash
VITE_COMPONENTS_IMPORT_URL=https://cdn.jsdelivr.net/npm/@ai-workflow/components/dist/index.js
```

如果线上需要指定 Vue runtime，也可以配置：

```bash
VITE_VUE_RUNTIME_URL=https://cdn.jsdelivr.net/npm/vue/dist/vue.runtime.esm-browser.js
```

## 调试提示

- `Import Map` 面板可以确认 `@ai-workflow/components` 当前指向的入口。
- `JS`、`CSS`、`SSR` 面板可以查看 REPL 编译产物。
- URL hash 会保存当前代码；如果要回到默认示例，清空地址栏里的 `#...` 后刷新。
- `@vue/repl + Monaco` 构建体积较大，这是成熟在线 playground 的常见取舍。

