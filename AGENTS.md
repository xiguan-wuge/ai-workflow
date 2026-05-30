# AGENTS.md - ai-workflow 项目

## 项目概述

- Vue 3 + TypeScript + VitePress monorepo，使用 pnpm 管理
- 包：`@ai-workflow/components`（Vue 组件）、`@ai-workflow/utils`（工具函数）
- CI：`ci.yml`（PR 检查）、`release.yml`（发布标签）、`docs.yml`（main 分支）
- 文档自动部署到 GitHub Pages（推送至 main 分支时触发）

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 以开发模式启动所有包 |
| `pnpm build` | 构建所有包 |
| `pnpm --filter @ai-workflow/components exec vue-tsc --noEmit` | 对组件进行类型检查 |
| `pnpm --filter @ai-workflow/docs dev` | 本地启动文档 |
| `pnpm --filter @ai-workflow/docs build` | 构建文档 |

## 自动化定时任务

当 Codex 会话启动时，注册以下 cron jobs：

| Cron | 频率 | 用途 |
|------|------|------|
| check-ci-failures | `*/30 * * * *` | 扫描带有 `ci-failed` 标签的 PR，尝试自动修复 |
| triage-new-issues | `0 */2 * * *` | 扫描带有 `needs-triage` 标签的 issue，进行分类和回复 |
| respond-to-issues | `0 */6 * * *` | 检查需要 AI 回复的未答问题 |
| analyze-enhancements | `3,33 * * * *` | 扫描带有 `enhancement` 标签的 issue，分析需求并评论 |
| health-check | `57 8 * * *` | 每日汇总：open PR、issues、过期项 |

## CI 失败自动修复协议

1. 使用 `mcp__plugin_everything-Codex-code_github__list_pull_requests` 列出带有 `ci-failed` 标签的 open PR
2. 对每个失败的 PR：
   a. 通过 `gh run view` 或 `gh api` 读取 CI 运行失败日志
   b. 使用 `mcp__plugin_everything-Codex-code_github__get_pull_request_files` 读取 PR 变更文件
   c. 使用 `mcp__plugin_everything-Codex-code_github__get_file_contents` 读取每个变更文件的完整内容
   d. 分析错误确定根本原因
   e. 对相关文件应用修复
   f. 使用 `mcp__plugin_everything-Codex-code_github__push_files` 推送修复
   g. 使用 `mcp__plugin_everything-Codex-code_github__create_pull_request_review` 添加 PR review 评论说明修复内容
   h. 移除 `ci-failed` 标签并添加 `auto-fixed` 标签
3. 每个 PR 最多尝试 3 次修复；若仍失败，添加 `needs-human` 标签并评论说明原因

## Issue 分类协议

分类规则：
- Bug 报告 → 添加 `bug`，验证可复现性，若缺少复现步骤则请求提供
- 功能请求 → 添加 `enhancement`，询问范围和使用场景以明确需求
- 文档问题 → 添加 `documentation`，链接到相关文档页面
- 问题咨询 → 添加 `question`，指向文档或讨论区

Bug 回复模板：
"感谢报告！我已将其标记为 bug。请确认包版本并提供最小复现案例。"

功能回复模板：
"感谢建议！为了帮助我们确定范围，想请教几个问题：[针对性的后续问题]"

## 增强分析协议

自动分析 enhancement issues 并提供结构化反馈。只读操作：不修改代码。

1. 列出带有 `enhancement` 标签的 open issues，排除已有 `analyzed`、`needs-clarification` 或 `in-progress` 标签的
2. 对每个 issue：
   a. 使用 `mcp__plugin_everything-Codex-code_github__get_issue` 读取完整 issue 内容（标题 + 正文）
   b. 从以下维度评估完整性：
      - 功能目标是否明确？
      - 是否可识别受影响的文件/包？
      - 是否定义了验收标准？
      - 是否缺少关键信息（API 签名、边界情况、使用场景）？
   c. 信息充分 → 发布分析评论并添加 `analyzed` 标签：
      ```
      ## 增强分析
      **摘要：** [对请求的一句话理解]
      **范围：** [小 / 中 / 大]
      **受影响文件：** [列表]
      **建议方案：**
      1. [步骤]
      2. [步骤]
      **下一步：** 确认后，开发者可接手实现。
      ```
   d. 信息不足 → 发布澄清问题并添加 `needs-clarification` 标签：
      ```
      ## 需要澄清
      在实现之前，请澄清：
      1. [具体问题]
      2. [具体问题]
      ```
3. 每个 issue 只分析一次（通过 `analyzed`/`needs-clarification` 标签保护）

## 源代码目录结构

```
packages/components/src/   # 可发布的 Vue 组件
packages/utils/src/         # 共享工具函数
docs/                       # VitePress 文档
playground/                 # 开发测试应用
scripts/                    # 构建/发布脚本
```

## 文档路径规范

- 在项目文档中引用文件路径时，仅使用仓库内相对路径（例如 `scripts/release.ts`）。
- 不要写本机绝对路径（例如 `/Users/...`）。
