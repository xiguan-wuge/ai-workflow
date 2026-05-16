# MCP (Model Context Protocol) 详解

## 什么是 MCP

MCP (Model Context Protocol) 是一个**开源协议标准**，用于将 AI 应用连接到外部系统。

通过 MCP，AI 应用（如 Claude、ChatGPT）可以连接到数据源（本地文件、数据库）、工具（搜索引擎、计算器）和工作流（专业提示词），从而访问关键信息并执行任务。

> 简单理解：**MCP 就像 AI 应用的 USB-C 接口** —— 正如 USB-C 提供了连接电子设备的标准化方式，MCP 提供了将 AI 应用连接到外部系统的标准化方式。

## MCP 能做什么

- **个人助手**：Agent 可以访问你的 Google Calendar 和 Notion，成为更个性化的 AI 助手
- **代码生成**：Claude Code 可以根据 Figma 设计稿生成完整的 Web 应用
- **企业聊天**：企业聊天机器人可以连接多个数据库，让用户通过聊天分析数据
- **3D 设计**：AI 模型可以在 Blender 中创建 3D 设计并直接打印

## 为什么 MCP 重要

| 角色 | 收益 |
|------|------|
| **开发者** | 减少构建或集成 AI 应用/Agent 的开发时间和复杂度 |
| **AI 应用/Agent** | 访问数据源、工具和应用生态系统，增强能力 |
| **终端用户** | 获得更强大的 AI 应用，可以访问数据并代为执行任务 |

## 广泛的支持生态

MCP 是一个开放协议，被广泛支持：
- **AI 助手**：Claude、ChatGPT
- **开发工具**：Visual Studio Code、Cursor、MCPJam
- 更多见 [clients 列表](/clients)

## 核心架构

### 客户端-服务端模型

```
┌─────────────┐     MCP      ┌─────────────┐
│   Client    │◄────────────►│   Server    │
│  (AI App)   │              │ (Data/Tools)│
└─────────────┘              └─────────────┘
```

- **Host**：用户交互的应用程序（如 Claude.ai、IDE）
- **Client**：协议级别的组件，每个服务器连接一个 Client
- **Server**：通过标准化协议接口向 AI 应用暴露特定能力

### 服务端三大核心功能

| 功能 | 说明 | 示例 | 控制方 |
|------|------|------|--------|
| **Tools** | LLM 可主动调用的函数 | 搜索航班、发送消息、创建日历事件 | Model |
| **Resources** | 提供只读访问的数据源 | 文档内容、数据库 schema、日历 | Application |
| **Prompts** | 预构建的指令模板 | 规划假期、总结会议、起草邮件 | User |

### 客户端功能

| 功能 | 说明 | 示例 |
|------|------|------|
| **Elicitation** | 服务端可请求用户特定信息 | 预订旅行时请求用户座位偏好 |
| **Roots** | 指定服务端应聚焦的目录 | 限制服务器访问特定工作目录 |
| **Sampling** | 服务端可通过客户端请求 LLM 完成 | 让 AI 分析航班选项并推荐最佳选择 |

## MCP 的优势

1. **标准化**：像 USB-C 一样，一次开发即可集成到任何支持 MCP 的平台
2. **互操作性**：AI 应用可以同时连接多个数据源和工具
3. **安全可控**：强调人类监督，通过授权对话框和操作日志确保用户控制
4. **生态丰富**：78+ 服务器覆盖 22 个分类

## 相关资源

- 官方文档：https://modelcontextprotocol.io
- 规范仓库：https://github.com/modelcontextprotocol/modelcontextprotocol
- 官方服务器列表：https://github.com/modelcontextprotocol/servers

---

*文档整理自 [Model Context Protocol 官方文档](https://modelcontextprotocol.io)，基于 2026 年 5 月最新内容。*