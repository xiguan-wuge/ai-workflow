#!/usr/bin/env tsx

import { execFileSync } from 'child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'

type BumpType = 'major' | 'minor' | 'patch' | 'none'
type ChangeGroup = 'breaking' | 'features' | 'fixes' | 'performance' | 'other'

interface WorkspacePackage {
  name: string
  shortName: string
  version: string
  path: string
  packageJsonPath: string
  changelogPath: string
  tagPrefix: string
}

interface CommitInfo {
  hash: string
  shortHash: string
  subject: string
  body: string
  files: string[]
}

interface ChangelogEntry {
  group: ChangeGroup
  bump: BumpType
  message: string
  scope: string
  commit: string
}

interface PackageRelease {
  name: string
  path: string
  currentVersion: string
  nextVersion: string
  tag: string
  previousTag: string | null
  bump: BumpType
  entries: ChangelogEntry[]
}

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = join(rootDir, '.release-manifest.json')

const args = process.argv.slice(2)
const options = {
  changelogOnly: args.includes('--changelog'),
  dryRun: args.includes('--dry-run'),
  ci: args.includes('--ci'),
  from: getArgValue('--from'),
  packageName: getArgValue('--package')
}

function getArgValue(name: string): string | undefined {
  const index = args.indexOf(name)
  if (index === -1) return undefined
  return args[index + 1]
}

function git(commandArgs: string[]): string {
  return execFileSync('git', commandArgs, {
    cwd: rootDir,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim()
}

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T
}

function writeJson(filePath: string, value: unknown): void {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function readWorkspacePatterns(): string[] {
  const workspacePath = join(rootDir, 'pnpm-workspace.yaml')
  if (!existsSync(workspacePath)) return ['packages/*']

  return readFileSync(workspacePath, 'utf-8')
    .split('\n')
    .map(line => line.match(/^\s*-\s*['"]?([^'"]+)['"]?\s*$/)?.[1])
    .filter((pattern): pattern is string => Boolean(pattern))
}

function resolveWorkspaceDirs(pattern: string): string[] {
  if (!pattern.includes('*')) {
    return existsSync(join(rootDir, pattern, 'package.json')) ? [pattern] : []
  }

  const [prefix, suffix = ''] = pattern.split('*')
  const baseDir = join(rootDir, prefix)
  if (!existsSync(baseDir)) return []

  return readdirSync(baseDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => `${prefix}${entry.name}${suffix}`)
    .filter(packagePath => existsSync(join(rootDir, packagePath, 'package.json')))
}

function discoverPackages(): WorkspacePackage[] {
  const paths = [...new Set(readWorkspacePatterns().flatMap(resolveWorkspaceDirs))]
  const packages = paths
    .map(packagePath => {
      const packageJsonPath = join(rootDir, packagePath, 'package.json')
      const packageJson = readJson<{ name?: string; version?: string; private?: boolean }>(packageJsonPath)
      if (!packageJson.name || !packageJson.version || packageJson.private) return null

      const shortName = packageJson.name.includes('/')
        ? packageJson.name.split('/').at(-1)!
        : packageJson.name

      return {
        name: packageJson.name,
        shortName,
        version: packageJson.version,
        path: packagePath,
        packageJsonPath,
        changelogPath: join(rootDir, packagePath, 'CHANGELOG.md'),
        tagPrefix: `${shortName}-v`
      }
    })
    .filter((pkg): pkg is WorkspacePackage => Boolean(pkg))

  return options.packageName
    ? packages.filter(pkg => pkg.name === options.packageName || pkg.shortName === options.packageName)
    : packages
}

function latestTagFor(pkg: WorkspacePackage): string | null {
  if (options.from) return options.from

  try {
    const tags = git(['tag', '--list', `${pkg.tagPrefix}*`, '--sort=-v:refname'])
    return tags.split('\n').find(Boolean) ?? null
  } catch {
    return null
  }
}

function commitsSince(tag: string | null): CommitInfo[] {
  const range = tag ? `${tag}..HEAD` : 'HEAD'
  let output = ''

  try {
    output = git(['log', '--format=%H%x1f%s%x1f%b%x1e', range])
  } catch {
    return []
  }

  return output
    .split('\x1e')
    .map(record => record.trim())
    .filter(Boolean)
    .map(record => {
      const [hash, subject, body = ''] = record.split('\x1f')
      return {
        hash,
        shortHash: hash.slice(0, 7),
        subject,
        body,
        files: filesForCommit(hash)
      }
    })
    .filter(commit => !commit.subject.startsWith('chore(release):'))
}

function filesForCommit(hash: string): string[] {
  return git(['show', '--pretty=format:', '--name-only', hash])
    .split('\n')
    .map(file => file.trim())
    .filter(Boolean)
}

function commitsForPackage(pkg: WorkspacePackage, commits: CommitInfo[]): CommitInfo[] {
  const packagePrefix = `${pkg.path}/`
  return commits.filter(commit => commit.files.some(file => file === pkg.path || file.startsWith(packagePrefix)))
}

function parseCommit(commit: CommitInfo): ChangelogEntry {
  const conventional = commit.subject.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/)
  const type = conventional?.[1]
  const scope = conventional?.[2] ?? 'workspace'
  const isBreaking = Boolean(conventional?.[3]) || commit.body.includes('BREAKING CHANGE')
  const message = conventional?.[4] ?? commit.subject

  if (isBreaking) {
    return { group: 'breaking', bump: 'major', message, scope, commit: commit.shortHash }
  }

  switch (type) {
    case 'feat':
      return { group: 'features', bump: 'minor', message, scope, commit: commit.shortHash }
    case 'fix':
      return { group: 'fixes', bump: 'patch', message, scope, commit: commit.shortHash }
    case 'perf':
      return { group: 'performance', bump: 'patch', message, scope, commit: commit.shortHash }
    default:
      return { group: 'other', bump: 'patch', message, scope, commit: commit.shortHash }
  }
}

function maxBump(entries: ChangelogEntry[]): BumpType {
  if (entries.some(entry => entry.bump === 'major')) return 'major'
  if (entries.some(entry => entry.bump === 'minor')) return 'minor'
  if (entries.some(entry => entry.bump === 'patch')) return 'patch'
  return 'none'
}

function bumpVersion(version: string, bump: BumpType): string {
  const parts = version.split('.').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN) || bump === 'none') return version

  if (bump === 'major') return `${parts[0] + 1}.0.0`
  if (bump === 'minor') return `${parts[0]}.${parts[1] + 1}.0`
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`
}

function changelogSection(pkg: WorkspacePackage, release: PackageRelease): string {
  const date = new Date().toISOString().slice(0, 10)
  const lines = [`## ${release.nextVersion} - ${date}`, '']

  const groups: Array<[ChangeGroup, string]> = [
    ['breaking', 'Breaking Changes'],
    ['features', 'Features'],
    ['fixes', 'Bug Fixes'],
    ['performance', 'Performance'],
    ['other', 'Other Changes']
  ]

  for (const [group, title] of groups) {
    const entries = release.entries.filter(entry => entry.group === group)
    if (entries.length === 0) continue

    lines.push(`### ${title}`)
    for (const entry of entries) {
      lines.push(`- ${entry.message} (${entry.scope}, ${entry.commit})`)
    }
    lines.push('')
  }

  if (release.entries.length === 0) {
    lines.push(`- Initial release for ${pkg.name}.`, '')
  }

  return lines.join('\n')
}

function updateChangelog(pkg: WorkspacePackage, release: PackageRelease): void {
  const header = `# Changelog\n\n`
  const section = changelogSection(pkg, release)
  const current = existsSync(pkg.changelogPath) ? readFileSync(pkg.changelogPath, 'utf-8') : header
  const body = current.startsWith(header) ? current.slice(header.length) : current

  writeFileSync(pkg.changelogPath, `${header}${section}${body.trim() ? `\n${body.trim()}\n` : ''}`)
}

function updatePackageVersion(pkg: WorkspacePackage, version: string): void {
  const packageJson = readJson<Record<string, unknown>>(pkg.packageJsonPath)
  packageJson.version = version
  writeJson(pkg.packageJsonPath, packageJson)
}

function planReleases(): PackageRelease[] {
  return discoverPackages().flatMap(pkg => {
    const previousTag = latestTagFor(pkg)
    const commits = commitsForPackage(pkg, commitsSince(previousTag))
    const entries = commits.map(parseCommit)
    const bump = maxBump(entries)

    if (bump === 'none') return []

    const nextVersion = bumpVersion(pkg.version, bump)
    return [{
      name: pkg.name,
      path: pkg.path,
      currentVersion: pkg.version,
      nextVersion,
      tag: `${pkg.tagPrefix}${nextVersion}`,
      previousTag,
      bump,
      entries
    }]
  })
}

function writeGithubOutput(releases: PackageRelease[]): void {
  const outputPath = process.env.GITHUB_OUTPUT
  if (!outputPath) return

  const changed = releases.length > 0 ? 'true' : 'false'
  const packages = releases.map(release => release.name).join(',')
  const tags = releases.map(release => release.tag).join(',')
  writeFileSync(outputPath, `changed=${changed}\npackages=${packages}\ntags=${tags}\n`, { flag: 'a' })
}

function main(): void {
  const releases = planReleases()

  console.log('AI Workflow release plan')
  console.log(`Root: ${rootDir}`)

  if (releases.length === 0) {
    console.log('No package changes found.')
    writeJson(manifestPath, { changed: false, releases: [] })
    writeGithubOutput([])
    return
  }

  for (const release of releases) {
    console.log(`- ${release.name}: ${release.currentVersion} -> ${release.nextVersion} (${release.bump})`)
    console.log(`  tag: ${release.tag}`)
    console.log(`  changes: ${release.entries.length}`)
  }

  if (!options.dryRun) {
    const packages = discoverPackages()
    for (const release of releases) {
      const pkg = packages.find(item => item.name === release.name)
      if (!pkg) continue

      updateChangelog(pkg, release)
      if (!options.changelogOnly) {
        updatePackageVersion(pkg, release.nextVersion)
      }
    }
  }

  writeJson(manifestPath, { changed: true, releases })
  writeGithubOutput(releases)

  if (options.dryRun) {
    console.log('Dry run completed without writing package files.')
  } else if (options.changelogOnly) {
    console.log('Changelogs updated.')
  } else {
    console.log('Release files updated.')
  }
}

main()
