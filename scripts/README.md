# `scripts/release.ts` 功能说明

## 用途

monorepo 自动化发布工具。基于 Conventional Commits 规范，扫描 pnpm 工作区下各包自上一次 tag 以来的提交记录，自动决定语义化版本号升级类型（major/minor/patch），生成 CHANGELOG，并更新 `package.json` 版本号。设计目标是配合 CI（如 GitHub Actions）完成「自动发版」流程。

## 执行流程

1. **解析 CLI 参数**：识别 `--dry-run`、`--changelog`、`--ci`、`--from <tag>`、`--package <name>` 等选项。
2. **发现工作区包**：读取 `pnpm-workspace.yaml`，扫描匹配目录下的 `package.json`，过滤掉 `private: true` 的包。
3. **定位上一次 tag**：按 `<shortName>-v*` 模式查询 git tag，取最新的一个；或使用 `--from` 显式指定。
4. **收集提交**：执行 `git log <tag>..HEAD`，解析每个 commit 涉及的文件，仅保留命中目标包路径的 commit，并排除 `chore(release):` 自身的发布提交。
5. **解析 Conventional Commits**：根据 `feat`/`fix`/`perf`/`BREAKING CHANGE` 等关键字归类，决定 bump 类型。
6. **计算最终版本**：取所有 entries 中最高级别的 bump 应用到当前版本。
7. **写入产物**：更新 `CHANGELOG.md`、写新版本号到 `package.json`、生成根目录 `.release-manifest.json`、向 `$GITHUB_OUTPUT` 输出步骤变量。

## 核心函数

| 函数 | 职责 |
|---|---|
| `discoverPackages()` | 扫描工作区，返回非私有包的元信息列表 |
| `latestTagFor(pkg)` | 查询包对应的最新 git tag |
| `commitsSince(tag)` | 拉取指定 tag 之后的 commit 列表（含文件清单） |
| `commitsForPackage(pkg, commits)` | 过滤出影响该包路径的 commit |
| `parseCommit(commit)` | 解析 Conventional Commit，输出 `ChangelogEntry` |
| `maxBump(entries)` | 取多条变更中最高的 bump 等级 |
| `bumpVersion(version, bump)` | 计算下一个 semver 版本号 |
| `changelogSection(pkg, release)` | 生成本次版本的 changelog 片段（按分组） |
| `updateChangelog(pkg, release)` | 把新片段插到 `CHANGELOG.md` 顶部 |
| `updatePackageVersion(pkg, version)` | 写回 `package.json` 的 `version` 字段 |
| `planReleases()` | 编排上述所有步骤，输出 `PackageRelease[]` |
| `writeGithubOutput(releases)` | 写 `changed/packages/tags` 到 `$GITHUB_OUTPUT` |
| `main()` | 入口：打印计划、按选项落盘、生成 manifest |

## 输入

- **CLI 参数**
  - `--dry-run`：打印发布计划，不更新包内 `CHANGELOG.md` 和 `package.json`；仍会生成 `.release-manifest.json`，若存在 `GITHUB_OUTPUT` 也会写入步骤输出
  - `--changelog`：只更新 CHANGELOG，不改 `package.json` 版本
  - `--ci`：CI 标识（当前代码已读入但未额外分支处理）
  - `--from <tag>`：手动指定起始 tag，跳过自动探测
  - `--package <name>`：仅处理指定包（支持完整名或短名）
- **环境变量**
  - `GITHUB_OUTPUT`：CI 步骤输出文件路径（可选）
- **仓库状态**：`pnpm-workspace.yaml`、各包 `package.json`、git tag 与 commit 历史

## 输出

- **标准输出**：发布计划摘要（包名、版本变更、tag、变更条数）
- **`<root>/.release-manifest.json`**：`{ changed: boolean, releases: PackageRelease[] }`
- **`<package>/CHANGELOG.md`**：在头部插入新版本段落
- **`<package>/package.json`**：`version` 字段被更新（除非 `--changelog`）
- **`$GITHUB_OUTPUT`**（若存在）：追加 `changed=`、`packages=`、`tags=` 三行

## 副作用

- 写入文件系统：`CHANGELOG.md`、`package.json`、`.release-manifest.json`、`$GITHUB_OUTPUT`
- 执行外部 `git` 命令（只读，`tag --list`、`log`、`show`）
- **不会**自动执行 `git commit`、`git tag`、`git push`、`npm publish`，这些动作需由调用方（通常是 release workflow）完成

## 依赖命令

- 系统命令：`git`（`tag`、`log`、`show`）
- 运行时：`tsx`（脚本 shebang 为 `#!/usr/bin/env tsx`）
- Node 内置模块：`child_process`、`fs`、`path`、`url`
- 仓库约定：Conventional Commits、pnpm workspace、tag 命名 `<shortName>-v<semver>`

## 使用示例

```bash
# 1. 预演本次会发什么版本，不更新包内 CHANGELOG 和 package.json
pnpm tsx scripts/release.ts --dry-run

# 2. 仅更新所有包的 CHANGELOG（保留旧版本号）
pnpm tsx scripts/release.ts --changelog

# 3. 只为 components 包计算并写入新版本
pnpm tsx scripts/release.ts --package @ai-workflow/components

# 4. 从指定 tag 开始统计变更
pnpm tsx scripts/release.ts --from components-v1.2.0

# 5. CI 中执行（写 manifest 和 GITHUB_OUTPUT，供后续步骤消费）
pnpm tsx scripts/release.ts --ci
```
