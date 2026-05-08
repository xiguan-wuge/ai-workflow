# Enhancement Issue 自动分析方案（第一级）

## 目标

Claude Code session 自动扫描带 `enhancement` 标签的 issue，分析需求完整性，并通过评论给出反馈，**不写任何代码**。

## 现有基础

- `issue-triage.yml`：issue 创建时按关键词自动打标签（`bug`/`enhancement`/`documentation`/`question`）
- `triage-new-issues` cron：每2小时扫描 `needs-triage` 标签的 issue 并回复模板
- `respond-to-issues` cron：每6小时检查未回复的 issue
- CLAUDE.md 中已有 CI auto-fix protocol 作为"读 issue → 读代码 → 操作 GitHub"的参考范式

## 变更内容

### 1. CLAUDE.md 新增 cron 任务

| Cron 名称 | 频率 | 目的 |
|-----------|------|------|
| `analyze-enhancements` | `*/30 * * * *` | 扫描 `enhancement` 标签的 issue，分析需求并评论 |

### 2. CLAUDE.md 新增 Enhancement Analysis Protocol

```
1. 扫描带 `enhancement` 标签、无 `analyzed`/`needs-clarification`/`in-progress` 标签的 open issue
2. 对每个 issue：
   a. 读取完整内容（标题 + body）
   b. 分析需求完整性，检查以下维度：
      - 功能目标是否明确
      - 涉及的文件/包是否可定位
      - 验收标准是否清晰
      - 是否缺少关键信息（API 签名、边界条件、使用场景）
   c. 如果信息充分 → 评论输出结构化分析：
      - 需求理解摘要
      - 涉及文件列表
      - 预计改动范围（小/中/大）
      - 建议的实现步骤
      - 打上 `analyzed` 标签
   d. 如果信息不足 → 评论追问缺失信息，打上 `needs-clarification` 标签
3. 每条 issue 只分析一次（通过 `analyzed`/`needs-clarification` 标签防重）
```

### 3. 新增标签

| 标签 | 含义 |
|------|------|
| `analyzed` | Agent 已完成需求分析，评论中有结构化分析 |
| `needs-clarification` | 信息不足，等待 issue 作者补充 |
| `in-progress` | 有人正在开发（手动添加，agent 会跳过） |

## 不做什么

- 不写代码
- 不提 PR
- 不修改 issue 标题或 body
- 不自动分配 issue

## 风险控制

- 只读 + 评论，零代码污染风险
- `analyzed` 标签防重复分析
- 最差情况：多了一条不准确的评论，可手动删除
