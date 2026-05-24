# Demo 插件修复与增强计划

## 1. 安装依赖

- [x] 在 docs 包安装 `markdown-it-container`
- [x] 在 docs 包安装 `@prettier/sync`、`typescript`

## 2. 修复 config.ts — 注册容器插件

- [x] `config.ts` 中引入 `markdown-it-container`，将 `demoPlugin(md)` 改为 `md.use(mdContainer, 'demo', demoPlugin(md))`

## 3. 修复 ts2js.ts — 缺失 prettier 配置容错

- [x] `.prettierrc` 不存在时降级使用默认 prettier 选项

## 4. 重写 Demo.vue — 折叠 + 复制

- [x] 新增 `sourceVisible` 状态控制代码展开/收起
- [x] 新增「展开源码」按钮替换当前 TS/JS 切换按钮
- [x] 新增「复制代码」按钮，用 `navigator.clipboard.writeText` 复制 `rawSources[0]`
- [x] 折叠动画（CSS v-show transition）
- [x] 去掉 TS/JS 相关逻辑，只展示 Vue 源码（`sources[0]`）

## 5. 修复 theme/index.ts — SSR 异步组件

- [x] `import.meta.glob` 加 `{ eager: true }` 确保 SSR 正确解析示例组件

## 6. 验证

- [x] build 成功，`:::demo` 块渲染正常：描述、组件预览、代码折叠、复制按钮、语法高亮均可用

## 7. 后续待办 — markdown-transform Vite 插件

- [ ] 参考 Element Plus 的 `markdown-transform.ts`，实现编译期自动注入静态 import
- [ ] 替代当前 `import.meta.glob({ eager: true })` 方案，实现按页面按需加载示例组件
- [ ] 不再需要 `eager: true`，消除所有示例组件全部打入主 bundle 的问题
- [ ] 当示例组件数量增长到几十个以上时考虑实施
