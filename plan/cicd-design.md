# AI Workflow Monorepo CI/CD 设计方案

## 1. 目标

在 monorepo 下实现发布自动化，核心能力包括：

- 根据 git commit 自动生成各子包 changelog。
- 发布时自动拉取代码、构建、版本升级、npm 发布。
- 自动创建并推送 git tag 与 release commit。
- 支持多子包独立发布，不互相强制升级。

## 2. 设计原则

- 路径归属驱动：根据 commit 修改文件路径判断变更属于哪个包。
- 包级发布：每个包独立计算版本、独立 changelog、独立 tag。
- 最小影响：只发布发生源码变更的包。
- CI 可追溯：发布清单写入 manifest，供后续步骤使用。

## 3. 关键组件

- 发布脚本：`scripts/release.ts`
- 发布工作流：`.github/workflows/release.yml`
- 根脚本配置：`package.json`
- 包级 changelog：
  - `packages/components/CHANGELOG.md`
  - `packages/utils/CHANGELOG.md`
- 认证说明：
  - `GITHUB_TOKEN` 由 GitHub Actions 内置提供。
  - `NPM_TOKEN` 需要在仓库 Secrets 中配置。

## 4. Changelog 归属规则

- `packages/components/**` -> `@ai-workflow/components`
- `packages/utils/**` -> `@ai-workflow/utils`
- 一个 commit 命中多个包路径时，会同时记入多个包 changelog。
- 非包源码路径（如 `docs/`、`playground/`）不触发 npm 包发布。

## 5. 版本策略

基于 conventional commit：

- `feat` -> `minor`
- `fix`/`perf` -> `patch`
- `type!` 或 body 含 `BREAKING CHANGE` -> `major`
- 其他类型默认记入 `Other Changes`，并按 `patch` 处理

同一包多条 commit 取最高级别：`major > minor > patch`。

## 6. Tag 策略

采用包级 tag：

- `components-vx.y.z`
- `utils-vx.y.z`

每个包的下次发布会从该包最近 tag 继续计算变更。

## 7. CI/CD 流程

`workflow_dispatch` 触发 `Release` 工作流后执行：

1. Checkout 完整历史（含 tags）。
2. 安装依赖。
3. 执行 `pnpm release:ci` 生成 changelog/版本变更与 manifest。
4. 若无包变更则退出。
5. 构建（包 + 文档）。
6. 提交 `package.json` 和 `CHANGELOG.md`。
7. 按 manifest 创建并推送 tag。
8. 仅发布发生版本变化的包到 npm。

## 8. 运行产物

- `.release-manifest.json`：记录本次发布包与 tag，供 workflow 后续步骤读取。
- 已加入忽略：`.gitignore`

## 9. 风险与约束

- commit message 不规范会降低 changelog 可读性。
- `pnpm build` 受 workspace 全量包影响，若 playground 异常可能干扰全量构建。
- npm 发布依赖 `NPM_TOKEN`，缺失时 workflow 会在发布步骤失败。

## 10. Changelog 示例

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
