# MCP 与 GitHub Issue 接入说明

## 1. 什么是 MCP

MCP，全称 `Model Context Protocol`，可以理解为一套让大模型安全、标准化调用外部工具和数据源的协议。

在这个协议里：

- 大模型负责理解用户意图
- MCP Server 负责暴露能力，例如读取 GitHub Issue、读取仓库文件、评论 PR
- 客户端负责把 MCP Server 注册进 AI 工具，例如 Codex、Claude、IDE 插件

对当前项目来说，MCP 的核心价值不是“写一段业务代码调用 GitHub API”，而是“让 Codex 直接拥有 GitHub 的工具能力”，从而可以在对话里自然语言操作 Issue、PR、仓库等对象。

## 2. GitHub Issue 这个 MCP 能做什么

本次接入使用的是 GitHub 官方 MCP Server：`github/github-mcp-server`。

它支持通过 `toolsets` 控制开放哪些能力。当前我们采用的是：

```toml
GITHUB_TOOLSETS = "issues"
```

这表示先只开放 GitHub Issue 相关能力，避免一次暴露过多工具，减少模型选错工具的概率，也让上下文更干净。

围绕 Issue，常见能力包括：

- 列出仓库中的 issues
- 读取单个 issue 的标题、正文、标签、状态、评论
- 按标签、状态、更新时间等条件筛选 issue
- 在有写权限时，对 issue 添加评论、更新标签、更新状态

对我们当前仓库，已经验证通过的是“读取类能力”，例如：

- 列出当前仓库的 open issues
- 读取某个具体 issue
- 按 `enhancement` 等标签过滤 issue

## 3. 当前仓库为什么要接这个 MCP

当前仓库已经有比较明确的 GitHub 自动化运营思路，相关内容散落在以下文档中：

- `AGENTS.md`
- `PLAN.md`
- `CLAUDE.md`
- `ENHANCEMENT-ANALYSIS-PLAN.md`

这些文档里已经多次提到：

- 扫描 issue
- 分类 issue
- 分析 enhancement issue
- 对 issue 进行评论或打标签

但在接入前，这些流程主要停留在“规范设计”层，没有真正把 GitHub 能力挂进 Codex 本机。  
这次接入完成后，Codex 才真正具备“直接读取仓库 issue”的能力。

## 4. 本次接入方案

### 4.1 采用的实现

本次采用的是：

- GitHub 官方 MCP Server
- 本地命令行二进制版本
- 通过 `~/.codex/config.toml` 注册到 Codex

没有采用 Docker 版，原因是本机环境中 `docker` 命令不可用。

### 4.2 为什么选本地命令版

原因有三个：

- 本机没有可用的 Docker 运行环境
- 官方提供了可直接下载的二进制 release
- 对当前“读取 issue”这个目标来说，本地命令版已经足够

### 4.3 安装的二进制版本

当前环境检测到的架构是：

```bash
uname -m
# x86_64
```

因此下载的是：

```text
github-mcp-server_Darwin_x86_64.tar.gz
```

如果未来切到 Apple Silicon 原生环境，应改为下载：

```text
github-mcp-server_Darwin_arm64.tar.gz
```

## 5. 如何接入

### 5.1 下载并放置二进制

建议把二进制放到固定路径，例如：

```text
/Users/xiguanwuge/bin/github-mcp-server
```

这样后续 `config.toml` 中的 `command` 路径稳定，不容易因为下载目录变化失效。

### 5.2 配置 Codex

在 `~/.codex/config.toml` 中添加 GitHub MCP Server 配置：

```toml
[mcp_servers.github]
command = "/Users/xiguanwuge/bin/github-mcp-server"
args = ["stdio"]
startup_timeout_sec = 120

[mcp_servers.github.env]
GITHUB_PERSONAL_ACCESS_TOKEN = "你的真实 GitHub PAT"
GITHUB_TOOLSETS = "issues"
```

配置说明：

- `command`：本地 GitHub MCP Server 二进制绝对路径
- `args = ["stdio"]`：以标准输入输出模式运行，这是 MCP 常见接入方式
- `GITHUB_PERSONAL_ACCESS_TOKEN`：GitHub Personal Access Token
- `GITHUB_TOOLSETS = "issues"`：只启用 issue 相关工具集

### 5.3 Token 说明

这里的 `GITHUB_PERSONAL_ACCESS_TOKEN` 不是项目里已有的内容，需要去 GitHub 后台手动生成。

原则：

- 不放进仓库文件
- 不提交到 Git
- 不发到聊天里
- 只保存在本机配置中

### 5.4 重启 Codex

修改完 `~/.codex/config.toml` 后，需要重启 Codex，让新的 MCP Server 配置生效。

## 6. 如何验证是否接通

最直接的验证方式，是在新会话里直接发自然语言指令：

```text
列出当前仓库的 open issues
```

如果能够返回当前仓库的 issue 列表，说明以下链路已经成立：

- GitHub MCP Server 能正常启动
- Codex 能识别这个 MCP Server
- Token 有目标仓库访问权限
- 当前 toolset 中的 issue 相关工具可用

本次已经验证成功，当前仓库 `xiguan-wuge/ai-workflow` 可以正常列出 open issues。

## 7. 如何使用

接入完成后，不需要在项目里安装 npm 包，也不需要写业务代码调用 GitHub API。  
日常使用直接在 Codex 对话中用自然语言发指令即可。

### 7.1 常用读取类指令

可直接这样使用：

```text
列出当前仓库的 open issues
```

```text
读取当前仓库第 7 个 issue 的完整内容
```

```text
列出当前仓库带 enhancement 标签的 open issues
```

```text
按最近更新时间排序列出当前仓库 issues
```

```text
总结当前仓库最近 10 个 issue 的共同问题
```

### 7.2 适合当前仓库的使用场景

结合当前仓库的流程设计，GitHub Issue MCP 特别适合下面几类任务：

- 查看待处理 enhancement issues
- 汇总 `needs-triage` 的 issue
- 读取 issue 内容后产出需求分析
- 判断 issue 是否缺少复现步骤或验收标准
- 生成 issue 分类建议和回复草稿

## 8. 后续可使用的价值

### 8.1 从“人工翻 GitHub”变成“自然语言查询”

接入前，查看 issue 通常要：

- 打开 GitHub 页面
- 手动切换标签或筛选条件
- 逐条点开 issue 阅读

接入后，可以直接让 Codex 帮忙：

- 筛选
- 汇总
- 排序
- 提炼重点

这对日常维护仓库会明显提效。

### 8.2 为仓库自动化流程提供真实能力支撑

当前仓库设计过这些自动化思路：

- issue triage
- enhancement analysis
- 回答未处理 issue
- CI 失败后的辅助分析

这些流程如果没有 GitHub MCP，只能停留在文档层面。  
接入后，Codex 至少已经具备“读取 issue”的能力，后续只要开放更高权限，就可以继续扩展成：

- 自动评论 issue
- 自动打标签
- 自动更新 issue 状态
- 自动生成结构化分析结论

### 8.3 让需求分析更贴近真实仓库上下文

单纯复制 issue 文本给 AI 分析，容易丢失上下文。  
接入 MCP 后，Codex 可以把 issue 和仓库当前代码结构、已有文档、历史变更结合起来分析，输出会更贴近真实开发场景。

### 8.4 降低工具接入成本

使用 MCP 之后，不需要单独在项目里维护一套 GitHub API 客户端逻辑，也不需要在业务代码中塞 token、处理鉴权、封装请求。  
工具能力留在 Codex 层，业务代码保持干净。

## 9. 当前接入状态

当前已经完成：

- 本地安装 GitHub MCP Server 二进制
- 在 `~/.codex/config.toml` 中注册 `mcp_servers.github`
- 配置 `GITHUB_PERSONAL_ACCESS_TOKEN`
- 配置 `GITHUB_TOOLSETS = "issues"`
- 成功通过 Codex 列出当前仓库的 open issues

当前已经具备：

- GitHub Issue 读取能力
- 基于自然语言的 issue 查询能力

当前还未展开的方向：

- issue 写操作能力验证
- PR 相关 toolset 接入
- Actions / CI 相关 toolset 接入
- labels、repos、pull_requests 等更多工具集开放

## 10. 建议的下一步

建议按下面顺序继续推进：

1. 先稳定使用 `issues` toolset，沉淀仓库的 issue 查询与分析提示词
2. 再按需要开放 `labels` 或 `pull_requests` toolset
3. 如果要做自动评论、自动打标，再确认 token 权限是否需要升级
4. 最后再把 `AGENTS.md`、`PLAN.md` 中的流程说明，和实际可用的 MCP 工具能力对齐

## 参考资料

- MCP 官方站点：<https://modelcontextprotocol.io/>
- GitHub 官方 MCP Server：<https://github.com/github/github-mcp-server>
- GitHub 关于 GitHub MCP Server 的文档：<https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server?tool=webui>
- GitHub Toolsets 配置文档：<https://docs.github.com/copilot/how-tos/provide-context/use-mcp/configure-toolsets>
- OpenAI 关于 MCP 的文档：<https://developers.openai.com/learn/docs-mcp>
