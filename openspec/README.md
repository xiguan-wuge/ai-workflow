# OPSX 命令指南

OPSX 是基于 OpenSpec 的工程化工作流命令集，用于管理变更提案、实施和归档的完整流程。

## 命令列表

| 命令 | 用途 | 描述 |
|------|------|------|
| `/opsx:propose` | 提案创建 | 创建新变更提案，自动生成工件 |
| `/opsx:apply` | 实施执行 | 根据任务清单实施代码变更 |
| `/opsx:archive` | 归档管理 | 将已完成的变更归档 |
| `/opsx:explore` | 探索模式 | 深度思考、调研问题、澄清需求 |

---

## 1. /opsx:propose

创建变更提案并生成所有必需的工件。

**语法：**
```
/opsx:propose <变更描述或名称>
```

**示例：**
```
/opsx:propose add-nodata-component
/opsx:propose 在 components 包中添加 NoData 无数据状态组件
```

**生成的工件：**
- `proposal.md` - 变更的目的和原因
- `design.md` - 具体设计方案
- `tasks.md` - 实施步骤清单

**使用场景：**
- 开始一个新功能或修复
- 将想法结构化、文档化
- 为实施阶段做准备

---

## 2. /opsx:apply

实施已规划好的变更。

**语法：**
```
/opsx:apply <变更名>
```

**示例：**
```
/opsx:apply add-nodata-component
```

**执行流程：**
1. 读取提案、设计、任务文件
2. 逐个完成任务清单中的项
3. 更新任务状态为已完成
4. 完成后提示可归档

**使用场景：**
- 在提案被确认后执行实施
- 按照 `tasks.md` 中的清单逐步实现

---

## 3. /opsx:archive

归档已完成的变更。

**语法：**
```
/opsx:archive <变更名>
```

**示例：**
```
/opsx:archive add-nodata-component
```

**功能：**
- 检查工件完整性
- 检查任务完成度
- 处理 delta specs 同步
- 移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`

**使用场景：**
- 变更实施完成且验证通过后
- 将变更从活跃状态移至归档状态

---

## 4. /opsx:explore

探索模式，用于深度思考和调研。

**语法：**
```
/opsx:explore <问题描述>
```

**示例：**
```
/opsx:explore 我们需要添加一个 NoData 组件吗？
/opsx:explore 认证系统目前的设计是否合理？
```

**特点：**
- 只读不写（不实现代码）
- 可以自由提问、画图、分析
- 洞察成熟后可提议创建提案

**使用场景：**
- 需求不明确，需要澄清
- 技术方案不确定，需要讨论
- 调研问题根因
- 探索代码库

---

## 典型工作流

```
1. 构思 → /opsx:propose "add-xxx-component"
2. 确认 → 检查 proposal/design/tasks 是否完整
3. 实施 → /opsx:apply add-xxx-component
4. 完成 → /opsx:archive add-xxx-component
```

或者在不确定时先探索：

```
/opsx:explore "我们需要添加一个 XXX 功能吗？"
```

---

## 文件结构

```
openspec/
├── config.yaml              # 配置文件
├── README.md                # 本文档
├── changes/
│   ├── add-nodata-component/  # 变更目录
│   │   ├── .openspec.yaml     # 变更元数据
│   │   ├── proposal.md        # 提案
│   │   ├── design.md          # 设计
│   │   └── tasks.md           # 任务清单
│   └── archive/               # 已归档变更
└── specs/                     # 规格说明
```

---

## 注意事项

- 所有 OPSX 命令都需要在 Claude Code 会话中调用
- `propose` 会自动创建变更目录和初始化工件
- `apply` 会按照 tasks.md 中的清单逐项实施
- `archive` 会检查工件和任务的完成状态
- `explore` 模式下不会修改任何代码文件