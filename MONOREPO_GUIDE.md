# Monorepo 组件库改造方案

## 概述

本项目从单包 Vue 3 + Vite + TypeScript 应用改造为支持多子包管理的 monorepo 组件库。

## 目标结构

```
ai-workflow/
├── packages/
│   ├── components/          # 组件库子包
│   │   ├── src/
│   │   │   ├── components/  # Vue 组件
│   │   │   └── index.ts     # 导出入口
│   │   ├── package.json
│   │   └── README.md
│   └── utils/               # 共性 utils 子包
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── README.md
├── docs/                    # VitePress 文档工程
│   ├── package.json
│   └── .vitepress/config.ts
├── playground/              # 在线演练场
│   ├── package.json
│   └── src/App.vue
├── pnpm-workspace.yaml      # 工作空间配置
├── package.json            # 根 workspace 配置
├── scripts/                # CICD 脚本
│   └── release.ts          # 多包 changelog 生成与版本提升
└── .github/workflows/
    ├── release.yml          # 发布 workflow
    └── docs.yml             # 文档构建 workflow
```

## 包说明

### @ai-workflow/components

Vue 3 组件库，包含：

- `Calculator` - 计算器组件
- `HelloWorld` - 示例组件

### @ai-workflow/utils

通用工具库（预留结构，待扩展）

### playground

组件在线演练场，支持实时预览和调试组件

### @ai-workflow/docs

VitePress 文档站

## 工作流命令

```bash
# 安装所有依赖
pnpm install

# 开发所有包
pnpm dev

# 构建所有包
pnpm build

# 构建组件库
pnpm build:components

# 构建文档
pnpm build:docs

# 生成 changelog（仅生成，不升级版本）
pnpm changelog

# 完整发布（生成 changelog + 升级版本）
pnpm release
```

## 单独运行各项目

```bash
# Playground
pnpm --filter playground dev

# 文档站
pnpm --filter @ai-workflow/docs dev

# 组件库构建
pnpm --filter @ai-workflow/components build
```

## 目录结构说明

| 目录 | 说明 |
|------|------|
| `packages/` | 子包存放目录 |
| `packages/components/` | 组件库包 |
| `packages/utils/` | 工具库包 |
| `docs/` | VitePress 文档 |
| `playground/` | 组件演练场 |
| `scripts/` | 发布和部署脚本 |
| `.github/workflows/` | GitHub Actions 工作流 |

## CI/CD 流程

### release.yml

- **触发条件**: push tag (`v*`) 或手动触发
- **流程**: 安装依赖 → 构建所有包 → 生成 changelog → 发布 npm

### docs.yml

- **触发条件**: push 到 main 分支
- **流程**: 安装依赖 → 构建文档 → 部署到 GitHub Pages

## 后续开发指南

### 添加新组件

1. 在 `packages/components/src/components/` 下创建 `.vue` 文件
2. 在 `packages/components/src/index.ts` 中导出
3. 更新 `packages/components/README.md` 文档

### 添加新工具函数

1. 在 `packages/utils/src/` 下创建 `.ts` 文件
2. 在 `packages/utils/src/index.ts` 中导出
3. 更新 `packages/utils/README.md` 文档

### 发布新版本

```bash
# 1. 生成 changelog（预览）
pnpm changelog

# 2. 确认无误后，执行完整发布
pnpm release

# 3. 提交更改
git add .
git commit -m "chore: release"

# 4. 创建 tag
git tag v0.1.0
git push origin v0.1.0
```

## 依赖关系

```
ai-workflow (root)
├── @ai-workflow/components
│   └── vue
├── @ai-workflow/utils
│   └── vue (peer)
├── @ai-workflow/docs
│   ├── @ai-workflow/components
│   └── vue
└── playground
    ├── @ai-workflow/components
    └── vue
```

## 许可证

MIT