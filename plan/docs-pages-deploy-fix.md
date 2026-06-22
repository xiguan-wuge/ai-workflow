# 文档站点部署修复说明

## 1. 修改背景

仓库中的文档链接指向 `https://xiguan-wuge.github.io/ai-workflow/`，但该地址当前无法访问。排查后确认有两个主要原因：

1. GitHub Pages 配置仍然使用 `Deploy from a branch`，且未选择有效分支，导致站点没有实际发布。
2. 仓库中的文档部署流程和 issue 中引用的文档链接没有统一收口，后续容易继续发出不可访问地址。

## 2. 修改目标

1. 将文档部署方式切换为 GitHub 官方推荐的 Pages Actions 流程。
2. 保持 VitePress 站点路径与仓库项目页一致。
3. 统一 issue 和 issue template 中的文档地址来源。
4. 确保文档站点可以通过 GitHub Pages 正常自动发布。

## 3. 本次修改内容

### 3.1 调整文档部署 workflow

修改文件：`.github/workflows/docs.yml`

变更内容：

- 移除 `peaceiris/actions-gh-pages`
- 改为使用 GitHub 官方 Pages Actions：
  - `actions/configure-pages`
  - `actions/upload-pages-artifact`
  - `actions/deploy-pages`
- 增加 Pages 所需权限：
  - `contents: read`
  - `pages: write`
  - `id-token: write`
- 增加并发控制，避免重复部署冲突

目的：

- 使用 GitHub 官方推荐方式部署 Pages
- 不再依赖 `gh-pages` 分支手工发布

### 3.2 统一 issue 自动评论中的文档链接

修改文件：`.github/workflows/issue-triage.yml`

变更内容：

- 增加环境变量 `DOCS_URL`
- issue 自动欢迎评论中的文档地址改为读取 `DOCS_URL`

目的：

- 避免文档地址写死在脚本正文中
- 后续只需改一处即可更新文档链接

### 3.3 修正 issue template 中的文档入口

修改文件：`.github/ISSUE_TEMPLATE/config.yml`

变更内容：

- 保留文档地址入口
- 调整说明文案，使其更明确指向文档站点

目的：

- 让用户在提 issue 前能通过统一入口访问文档

### 3.4 补全文档站点配置

修改文件：`docs/.vitepress/config.ts`

变更内容：

- 保留 `base: '/ai-workflow/'`
- 增加：
  - `lang`
  - `srcDir`
  - `cleanUrls`
  - `sitemap.hostname`

目的：

- 保证 VitePress 构建结果与 GitHub Pages 项目站点路径一致
- 为站点生成正确的 sitemap 和链接结构

## 4. 本地验证结果

已执行：

- `pnpm docs:build`

结果：

- 文档构建成功
- 页面渲染成功
- sitemap 生成成功

说明：

- 本地构建链路已正常
- 远程是否可访问，取决于 GitHub Pages 配置和 Actions 部署是否成功

## 5. GitHub 侧需要配合的配置

在仓库 `Settings > Pages` 中执行：

1. 将 `Source` 从 `Deploy from a branch` 改为 `GitHub Actions`
2. 保存配置
3. 推送本次提交到远程仓库
4. 等待 `Docs` workflow 自动运行完成

## 6. 提交后验证步骤

### 6.1 检查 Actions

打开仓库 `Actions` 页面，查看 `Docs` workflow：

- 是否由最新提交触发
- 是否执行成功

重点检查步骤：

- `Build documentation`
- `Upload Pages artifact`
- `Deploy to GitHub Pages`

### 6.2 检查 Pages 配置页

打开 `Settings > Pages`：

- 确认 Source 显示为 `GitHub Actions`
- 确认页面提示站点由 workflow 部署

### 6.3 检查站点是否可访问

访问：

- `https://xiguan-wuge.github.io/ai-workflow/`

预期结果：

- 首页不再返回 404
- 页面样式和脚本正常加载
- 文档子页面可正常访问

### 6.4 检查 issue 文档入口

验证两个入口：

- 新建 issue 页面中的 `Documentation` 链接
- issue 自动评论中的文档链接

预期结果：

- 两处都指向可访问的文档站点地址

## 7. 本次提交涉及文件

- `.github/workflows/docs.yml`
- `.github/workflows/issue-triage.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `docs/.vitepress/config.ts`

## 8. 已创建提交

提交信息：

- `fix: 修复文档站点部署与链接配置`

提交哈希：

- `8837c2e`
