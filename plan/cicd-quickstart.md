# AI Workflow CI/CD 上手指南

## 1. 先决条件

- 已配置 GitHub Actions 权限（仓库可执行 workflow）。
- 已配置 npm 发布 token：`NPM_TOKEN`。
- 使用 `pnpm`，并可正常安装依赖。

## 2. 本地验证

在仓库根目录执行：

```bash
pnpm install
pnpm release:dry-run
pnpm --filter @ai-workflow/components build
pnpm --filter @ai-workflow/utils build
pnpm docs:build
```

预期：

- `release:dry-run` 输出待发布包、目标版本、目标 tag。
- 组件包、工具包、文档构建成功。

## 3. 提交规范建议

建议采用 conventional commit：

- `feat(components): add xxx`
- `fix(utils): correct xxx`
- `feat!: breaking API change`

说明：

- 不需要强制写 `components` 或 `utils` scope 才能分包。
- 分包归属是根据源码路径自动判定（`packages/components/**`、`packages/utils/**`）。
- scope 仅用于 changelog 展示可读性，属于可选增强信息。

## 4. GitHub Secrets 配置

在仓库 Settings -> Secrets and variables -> Actions 新增：

- `NPM_TOKEN`：用于 `pnpm publish`

`GITHUB_TOKEN` 由 Actions 自动提供，无需手工新增。

## 5. 发布操作

1. 推送代码到目标分支（通常 `main`）。
2. 进入 GitHub Actions。
3. 手动触发 `Release` workflow（`workflow_dispatch`）。
4. 等待流程完成：
   - 生成 changelog
   - 升级包版本
   - 构建包与文档
   - 生成 release commit
   - 创建并推送包级 tag
   - 发布变更包到 npm

## 6. 结果检查

发布后检查：

- Git tags 是否新增（如 `components-v0.1.0`）。
- 包内 changelog 是否更新：
  - `packages/components/CHANGELOG.md`
  - `packages/utils/CHANGELOG.md`
- npm 上目标包版本是否更新。

## 7. 常见问题

- `No package changes found`：
  - 说明最近 commit 未命中 `packages/*` 源码路径。
- npm 发布失败：
  - 优先检查 `NPM_TOKEN` 是否有效，以及包名发布权限。
- tag 冲突：
  - 说明同版本 tag 已存在，需要确认版本策略或回滚发布分支后重试。

## 8. Changelog 示例

每个包维护独立 changelog，示例结构如下：

```md
# Changelog

## 0.1.0 - 2026-05-30

### Features
- add button loading state (workspace, a1b2c3d)

### Bug Fixes
- fix debounce edge case (workspace, d4e5f6g)

### Other Changes
- update build config (workspace, h7i8j9k)
```
