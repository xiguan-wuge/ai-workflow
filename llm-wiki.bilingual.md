# LLM Wiki 中英逐段对照

> 说明：本文件用于对照核验翻译，按“英文原文 + 中文对应”组织。

---

## Title

**EN**: `# LLM Wiki`

**ZH**: `# LLM Wiki（中文整理版）`

---

## Intro

**EN**: `A pattern for building personal knowledge bases using LLMs.`

**ZH**: 一种用 LLM 构建个人知识库的模式。

**EN**: `This is an idea file... Its goal is to communicate the high level idea...`

**ZH**: 这是一份“思路文档”，用于传达高层模式；可复制给你的 LLM 代理（如 Claude Code、Codex 等），再由你与代理共同落地具体实现。

---

## The core idea

**EN (summary)**: Most document+LLM workflows are RAG: retrieve chunks at query time, re-synthesize every time, no accumulation.

**ZH**: 多数文档问答流程是 RAG：每次提问时临时检索、临时拼装，知识不沉淀。

**EN (key difference)**: Instead of only retrieval, the LLM incrementally builds and maintains a persistent wiki between you and raw sources.

**ZH**: 与其仅做检索，不如让 LLM 在原始资料与用户之间持续维护一个持久化 wiki（结构化、互链的 Markdown 页面集合）。

**EN**: New sources are integrated into existing pages, contradictions are tracked, synthesis is updated.

**ZH**: 新资料会被整合进既有页面，冲突会被标注，综合结论会持续更新。

**EN**: The wiki is a persistent compounding artifact.

**ZH**: wiki 是可复利的长期资产。

**EN**: Human focuses on sourcing/exploration/questions; LLM handles summarization, cross-referencing, filing, bookkeeping.

**ZH**: 人负责选资料、探索与提问；LLM 负责总结、互链、归档与维护账务。

**EN metaphor**: Obsidian is IDE, LLM is programmer, wiki is codebase.

**ZH**: Obsidian 像 IDE，LLM 像程序员，Wiki 像代码库。

---

## Example contexts

**EN**: Personal / Research / Reading a book / Business-team / Competitive analysis, due diligence, trip planning, etc.

**ZH**: 个人成长、研究、读书伴随、团队知识库、竞品分析/尽调/旅行规划等长期知识积累场景都适用。

---

## Architecture

**EN**: Three layers: Raw sources / The wiki / The schema.

**ZH**: 三层：原始资料层 / Wiki 知识页层 / Schema 规则层。

**EN - Raw sources**: immutable source-of-truth inputs.

**ZH**: 原始资料只读不可改，是事实源。

**EN - Wiki**: LLM-generated markdown pages; LLM owns creation, updates, cross-reference, consistency.

**ZH**: Wiki 由 LLM 生成并维护：建页、更新、互链、一致性维护。

**EN - Schema**: CLAUDE.md/AGENTS.md-like config that defines structure/conventions/workflows.

**ZH**: 用规则文档定义结构、规范与流程，使 LLM 成为“纪律化维护者”。

---

## Operations

### Ingest

**EN**: Add source → LLM reads/discusses/summarizes/updates index & related pages/log. One source may touch 10-15 pages.

**ZH**: 新资料入库后，LLM 读取、讨论重点、写摘要、更新索引与关联页、追加日志；一份来源可影响 10–15 页。

### Query

**EN**: Ask against wiki; LLM synthesizes with citations; outputs can be pages/tables/slides/charts/canvas.

**ZH**: 围绕 wiki 提问，LLM 基于页面并带引用综合回答；输出可为页面、表格、幻灯片、图表等。

**EN**: Valuable answers should be filed back into wiki as new pages.

**ZH**: 高价值问答应回写 wiki，形成持续复利。

### Lint

**EN**: Periodic health checks: contradictions, stale claims, orphan pages, missing concept pages/cross-references, data gaps.

**ZH**: 定期巡检：矛盾、过时结论、孤儿页、概念页缺失、互链缺失、可补齐的数据缺口。

---

## Indexing and logging

### index.md

**EN**: Content-oriented catalog with links + one-line summaries (+ optional metadata), read first for query routing.

**ZH**: 内容导向目录：链接+一句话摘要（可含元数据），查询时先读 index 再下钻。

### log.md

**EN**: Append-only chronological record for ingests/queries/lints; consistent heading prefix helps unix parsing.

**ZH**: 时间导向追加日志；统一前缀便于命令行解析与回溯演化过程。

---

## Optional CLI tools

**EN**: At scale, add search tooling. qmd is suggested for local markdown hybrid search + re-ranking.

**ZH**: 规模增大后可加站内搜索；示例是 qmd（本地 Markdown 混合检索 + 重排）。

---

## Tips and tricks

**EN**: Obsidian Web Clipper, local image downloads, graph view, Marp, Dataview, git benefits.

**ZH**: 建议使用 Obsidian Web Clipper、图片本地化、图谱视图、Marp、Dataview，并利用 Git 的版本与协作能力。

---

## Why this works

**EN**: Human bottleneck is bookkeeping, not thinking. LLM removes maintenance burden and keeps wiki current.

**ZH**: 人类瓶颈在维护账务而非思考；LLM 能低成本执行跨页维护，让 wiki 长期保持新鲜一致。

**EN**: Human role = curation + direction + questions + interpretation.

**ZH**: 人类角色应聚焦：资料筛选、方向设定、问题设计与最终判断。

---

## Note

**EN**: This is intentionally abstract: pattern, not implementation. Structure/schema/tooling/output should be customized by domain and preferences.

**ZH**: 本文刻意抽象，只讲模式不绑实现；目录、规则、模板、工具与输出都应按你的场景定制。

**EN**: Share this pattern with your LLM agent and instantiate a tailored version.

**ZH**: 最佳用法是把该模式交给 LLM 代理，再共同实例化成你的专属工作流版本。
