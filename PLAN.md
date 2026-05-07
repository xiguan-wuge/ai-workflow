# Plan: PR & Issue 自动处理系统

## Context

为 `xiguan-wuge/ai-workflow` (VitePress + Vue 3 + pnpm monorepo) 构建自动处理 PR 和 Issue 的系统。包括：CI 失败自动修复、Issue 自动分类回复、过期 PR/Issue 自动关闭。

## 架构：双层混合模式

**Tier 1 — GitHub Actions (持久、事件驱动)：** 处理确定性的轻量任务，无需 AI。通过 schedule/event 触发，永久有效。

**Tier 2 — Claude Code Cron (智能、会话期内)：** 处理需要 AI 分析的任务，仅在 Claude Code 运行期间活跃。通过 GitHub Labels 与 Tier 1 通信。

```
GitHub Actions (持久)           Claude Code Cron (会话期)
─────────────────────           ────────────────────────
stale.yml    → 自动关闭过期项
issue-triage.yml → 关键词标签   Cron: 深度分类 + AI 回复
ci.yml       → 跑CI + 标记失败  Cron: 分析日志 + 自动修复
```

## 要创建/修改的文件

### Phase 1: 基础模板（无 AI 依赖）
1. **`CLAUDE.md`** (新建，根目录) — 自动化 agent 的上下文和指令
2. **`.github/ISSUE_TEMPLATE/bug_report.yml`** (新建)
3. **`.github/ISSUE_TEMPLATE/feature_request.yml`** (新建)
4. **`.github/ISSUE_TEMPLATE/config.yml`** (新建)
5. **`.github/PULL_REQUEST_TEMPLATE.md`** (新建)

### Phase 2: GitHub Actions 工作流（持久自动化）
6. **`.github/workflows/stale.yml`** (新建) — 每天检查，60天无活动标记为过期，14天后关闭
7. **`.github/workflows/issue-triage.yml`** (新建) — Issue 创建时关键词匹配打标签
8. **`.github/workflows/ci.yml`** (新建) — PR 触发完整构建 + 类型检查，失败时标记 `ci-failed`

### Phase 3: Claude Code 智能自动化（会话期内）
9. **`.claude/settings.local.json`** (修改) — 扩展 GitHub MCP 权限
10. 注册 Cron 任务（会话启动时通过 CLAUDE.md 指示）

### Phase 4: 可选增强
11. **`.github/dependabot.yml`** (新建) — 自动依赖更新
12. `docs/contributing.md` 更新

## 核心工作流

### CI 失败自动修复
```
PR push → ci.yml 跑 CI → 失败 → 标记 "ci-failed"
  → Cron(每30min) 检测到 → Agent 读日志+代码 → 修复 → push
  → CI 重新触发 → 通过 / 再失败重试(最多3次) → 标记 "needs-human"
```

### Issue 自动分流
```
新建 Issue → issue-triage.yml 关键词匹配打标签 + "needs-triage"
  → Cron(每2h) 检测 → Agent 深度分类 → 打标签 + 回复模板
  → Cron(每6h) 检查48h无回复 → 跟进评论 → 必要时标记 "needs-review"
```

### 过期自动关闭
```
stale.yml (每日执行) → 60天无活动 → 标记 stale + 警告
  → 14天后仍无活动 → 自动关闭（排除 pinned/security/keep/in-progress）
```

## Cron 任务定义

| 名称 | 频率 | 功能 |
|------|------|------|
| check-ci-failures | 每30分钟 | 扫描 `ci-failed` PR，尝试自动修复 |
| triage-new-issues | 每2小时 | 扫描 `needs-triage` Issue，深度分类回复 |
| respond-to-issues | 每6小时 | 检查未回复的 Issue，AI 回复 |
| health-check | 每天9am | 汇总报告：开放PR、Issue、过期项目数 |

## 需要的权限更新

`settings.local.json` 需新增:
- `push_files`, `create_or_update_file` (推送修复)
- `list_pull_requests`, `list_issues` (扫描)
- `get_pull_request` (获取 PR 详情)
- `create_pull_request_review` (提交 review)
- `add_issue_comment`, `update_issue` (Issue 操作)

## Cron 生命周期限制及应对

- **过期管理**: 完全由 GitHub Actions schedule 处理，不依赖会话
- **Issue 分流**: Tier 1 立即打基础标签，AI 深度处理在会话活跃时追补
- **CI 修复**: 失败 PR 积累 `ci-failed` 标签，下次会话启动时批量处理

---

# 执行状态

> 最后更新: 2026-05-08 | 会话: smooth-honking-gem

## Phase 1: 基础模板 ✅ 已完成

| # | 文件 | 状态 |
|---|------|------|
| 1 | `CLAUDE.md` | ✅ 已创建 |
| 2 | `.github/ISSUE_TEMPLATE/bug_report.yml` | ✅ 已创建 |
| 3 | `.github/ISSUE_TEMPLATE/feature_request.yml` | ✅ 已创建 |
| 4 | `.github/ISSUE_TEMPLATE/config.yml` | ✅ 已创建 |
| 5 | `.github/PULL_REQUEST_TEMPLATE.md` | ✅ 已创建 |

## Phase 2: GitHub Actions 工作流 ✅ 已完成

| # | 文件 | 状态 |
|---|------|------|
| 6 | `.github/workflows/stale.yml` | ✅ 已创建 |
| 7 | `.github/workflows/issue-triage.yml` | ✅ 已创建 |
| 8 | `.github/workflows/ci.yml` | ✅ 已创建 |

## Phase 3: Claude Code 智能自动化 ✅ 已完成

| # | 文件 | 状态 |
|---|------|------|
| 9 | `.claude/settings.local.json` | ✅ 已修改 (+8 权限) |
| 10 | Cron 任务 | ✅ 已注册 (4 个) |

### 已注册的 Cron 任务

| ID | 名称 | 频率 | 功能 | 有效期 |
|----|------|------|------|--------|
| `d9d422dc` | check-ci-failures | 每30分钟 | 扫描 `ci-failed` PR 自动修复 | 3天 |
| `0428f069` | triage-new-issues | 每2小时 | 扫描 `needs-triage` Issue 分类回复 | 3天 |
| `a8dae8a3` | respond-to-issues | 每6小时 | 检查未回复 Issue 跟进 | 3天 |
| `0595a207` | health-check | 每天8:57 | 汇总报告 | 3天 |

## Phase 4: 可选增强 ✅ 已完成

| # | 文件 | 状态 |
|---|------|------|
| 11 | `.github/dependabot.yml` | ✅ 已创建 |
| 12 | `docs/contributing.md` | ⏳ 未创建 (低优先级) |

## 已修改文件详情

### `.claude/settings.local.json` 新增权限
```
push_files, create_or_update_file, list_pull_requests, list_issues,
get_pull_request, create_pull_request_review, add_issue_comment, update_issue
```

---

# 下一步计划

1. **提交并推送** — 将所有文件提交到 GitHub，GitHub Actions 部分会立即生效
2. **Cron 续期** — 每次新会话启动时，参考 CLAUDE.md 指示重新注册 Cron 任务
3. **验证 CI 工作流** — 创建一个测试 PR（故意引入类型错误），确认 `ci.yml` 能跑通并标记 `ci-failed`
4. **验证 Issue Triage** — 创建一个测试 Issue，确认自动打标和回复
5. **验证 Auto-Fix** — 确认 Cron 能检测到 `ci-failed` PR 并尝试修复
6. **创建 `docs/contributing.md`** — 补充贡献指南

## 新会话快速启动

在新 Claude Code 会话中，只需：
1. 打开此项目目录
2. CLAUDE.md 会被自动加载
3. 手动注册 Cron（或说"按照 CLAUDE.md 注册 cron 任务"）
4. 即可恢复自动化能力
