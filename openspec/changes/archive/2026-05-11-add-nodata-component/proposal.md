# Proposal: Add NoData Component

## Summary

在 `@ai-workflow/components` 包中添加一个 `NoData` 组件，用于在列表、表格或其他数据容器为空时展示友好的无数据状态提示。

## Problem Statement

当前项目中缺少统一的无数据状态展示组件，导致：
- 各页面自行实现无数据提示，样式不统一
- 重复开发，代码冗余
- 维护困难

## Solution

创建一个可复用的 `NoData` 组件，提供：
- 简洁的无数据状态展示
- 支持自定义文本描述
- 支持可选的图标
- 良好的视觉层次和用户体验

## Benefits

1. **统一性**: 所有无数据状态使用一致的视觉表现
2. **可复用性**: 通过 props 配置即可适配不同场景
3. **开发效率**: 无需重复编写无数据提示代码
4. **可维护性**: 集中管理，修改一处即可全局生效

## Non-Goals

- 不支持复杂自定义布局（保持简单通用）
- 不支持动画效果（保持轻量）

## Impact

- 新增文件: `packages/components/src/components/NoData.vue`
- 修改文件: `packages/components/src/index.ts`（导出组件）
- 新增文档: `docs/components/nodata.md`
- 无破坏性变更，完全向后兼容
