# Tasks: Vue Component Demo Plugin Implementation

## Task List

### Task 1: Create Plugin Directory Structure

- [x] Create directory `docs/.vitepress/plugins/`
- [x] Create `docs/.vitepress/plugins/demo.ts`

### Task 2: Implement Demo Container Plugin (demo.ts)

- [x] Import markdown-it-container
- [x] Implement `validate()` - 检测 `:::demo` 块
- [x] Implement `render()` - 解析示例路径并读取 Vue 文件
- [x] 生成 `<Demo>` 组件 HTML 输出

### Task 3: Create Demo Component

- [x] Create `docs/.vitepress/components/Demo.vue`
- [x] 实现组件预览区域
- [x] 实现源码展示区域（Vue/JS 双版本）
- [x] 实现代码高亮和切换功能

### Task 4: Register Example Components

- [x] 创建 `docs/examples/nodata/` 目录
- [x] 创建 `docs/examples/nodata/basic.vue`
- [x] 在 config.ts 中注册所有示例组件为全局组件（ep-{path} 格式）

### Task 5: Integrate Plugin into VitePress Config

- [x] 修改 `docs/.vitepress/config.ts` 导入 demo 插件
- [x] 注册 Demo 组件为全局组件
- [x] 配置 markdown.use(demoPlugin)

### Task 6: Create Example Files

- [x] 创建 `docs/examples/nodata/basic.vue` - 基础 NoData 示例
- [x] 创建 `docs/examples/nodata/with-icon.vue` - 带图标示例
- [x] 创建 `docs/examples/nodata/with-description.vue` - 带描述示例

### Task 7: Update Documentation

- [x] 修改 `docs/components/nodata.md` 使用 `:::demo` 语法
- [x] 测试文档渲染效果

## Dependencies

- Task 2 depends on Task 1
- Task 3 is independent
- Task 4 depends on Task 1
- Task 5 depends on Tasks 2, 3, 4
- Task 6 is independent
- Task 7 depends on Task 5 and Task 6

## File Structure After Implementation

```
docs/
├── .vitepress/
│   ├── config.ts              # Modified - register plugin
│   ├── components/
│   │   └── Demo.vue           # Demo 包装组件
│   └── plugins/
│       └── demo.ts            # Container 插件
├── examples/                  # 组件示例
│   └── nodata/
│       ├── basic.vue
│       ├── with-icon.vue
│       └── with-description.vue
└── components/
    └── nodata.md              # 使用 :::demo 语法
```