# Playground 组件内 Element Plus 按需引入规范（无插件）

## 目标

在 **不使用自动导入插件** 的前提下，为 `playground/src/components/*.vue` 中使用的 `el-xxx` 组件补齐手动按需引入，保证：

- 组件可用、构建稳定
- 规则统一、便于后续批量补齐
- 新增组件时可直接复用同一流程

## 适用范围

- 目录：`playground/src/components/`
- 文件类型：Vue SFC（`*.vue`）
- 当前参照：`test1.vue`（已显式引入）

---

## 统一规范

### 1) 单文件显式引入

每个 `.vue` 文件中，模板出现的 `el-xxx` 组件，必须在该文件 `<script setup lang="ts">` 里显式引入。

示例（模式）：

```ts
import { ElColorPicker, ElColorPickerPanel, ElCheckbox } from 'element-plus'
```

### 2) 命名映射规则

- `el-checkbox` → `ElCheckbox`
- `el-color-picker` → `ElColorPicker`
- `el-color-picker-panel` → `ElColorPickerPanel`
- `el-cascader` → `ElCascader`
- `el-date-picker-panel` → `ElDatePickerPanel`

规则：`el-` 后每段首字母大写并拼接，整体以 `El` 开头。

### 3) 不依赖全局注册

不通过 `app.use(ElementPlus)` 做全量注册；保持“就近、显式、可追踪”的局部按需引入。

---

## 执行流程（单文件）

1. 打开目标 `.vue`
2. 收集模板中的 `el-xxx`
3. 检查 `<script setup>` 中是否已从 `element-plus` 导入对应 `ElXxx`
4. 缺失则补齐 import
5. 保存后运行 playground 验证

---

## 批量补齐流程（推荐）

1. 先扫描组件目录中所有 `el-xxx` 使用点
2. 按文件逐个补齐缺失 import
3. 每完成 3~5 个文件执行一次构建/运行验证
4. 全量完成后再做一次整体验证

---

## 示例：test2.vue 补齐项

`test2.vue` 模板中使用了：

- `el-cascader`
- `el-date-picker-panel`

应在脚本中补齐：

```ts
import { ElCascader, ElDatePickerPanel } from 'element-plus'
```

---

## 验收清单

- [ ] 每个 `el-xxx` 都有对应 `ElXxx` 导入
- [ ] 无多余未使用导入
- [ ] 页面渲染正常，无组件未注册告警

---

## 后续维护约定

- 新增 `el-xxx` 组件时，同步补齐本文件 import
- 代码评审时将“Element Plus 按需引入完整性”作为必检项
- 若后续要切换自动导入插件，需单独评估并统一迁移，不与当前规则混用
