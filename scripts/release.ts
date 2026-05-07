#!/usr/bin/env tsx
/**
 * Release Script for AI Workflow Monorepo
 *
 * This script generates changelogs and manages version bumps for packages.
 *
 * Usage:
 *   pnpm changelog    - Generate changelogs only
 *   pnpm release      - Generate changelogs and bump versions
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

interface PackageInfo {
  name: string
  version: string
  path: string
}

interface ChangelogEntry {
  type: 'major' | 'minor' | 'patch'
  scope: string
  message: string
  commit: string
}

const PACKAGES = [
  { name: '@ai-workflow/components', path: 'packages/components' },
  { name: '@ai-workflow/utils', path: 'packages/utils' }
]

function getPackageInfo(packagePath: string): PackageInfo | null {
  const pkgPath = join(rootDir, packagePath, 'package.json')
  if (!existsSync(pkgPath)) {
    return null
  }
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  return {
    name: pkg.name,
    version: pkg.version,
    path: packagePath
  }
}

function parseCommits(since: string = 'v0.0.0'): ChangelogEntry[] {
  // Simulated commit parsing - in real implementation,
  // this would use git log or conventional commits parser
  // For now, return empty array as we don't have git history
  return []
}

function determineBumpType(entries: ChangelogEntry[]): 'major' | 'minor' | 'patch' {
  let hasMajor = false
  let hasMinor = false

  for (const entry of entries) {
    if (entry.type === 'major') hasMajor = true
    if (entry.type === 'minor' || entry.type === 'major') hasMinor = true
  }

  if (hasMajor) return 'major'
  if (hasMinor) return 'minor'
  return 'patch'
}

function bumpVersion(version: string, type: 'major' | 'minor' | 'patch'): string {
  const parts = version.split('.').map(Number)
  if (parts.length !== 3) return version

  switch (type) {
    case 'major':
      parts[0]++
      parts[1] = 0
      parts[2] = 0
      break
    case 'minor':
      parts[1]++
      parts[2] = 0
      break
    case 'patch':
      parts[2]++
      break
  }

  return parts.join('.')
}

function generateChangelog(packageName: string, entries: ChangelogEntry[]): string {
  const date = new Date().toISOString().split('T')[0]
  let changelog = `# Changelog\n\n`
  changelog += `## ${packageName}\n\n`
  changelog += `### ${date}\n\n`

  if (entries.length === 0) {
    changelog += `### Features\n- Initial release\n`
  } else {
    const features = entries.filter(e => e.type === 'minor')
    const fixes = entries.filter(e => e.type === 'patch')
    const breaking = entries.filter(e => e.type === 'major')

    if (breaking.length > 0) {
      changelog += `### BREAKING CHANGES\n`
      for (const entry of breaking) {
        changelog += `- ${entry.message} (${entry.scope})\n`
      }
      changelog += `\n`
    }

    if (features.length > 0) {
      changelog += `### Features\n`
      for (const entry of features) {
        changelog += `- ${entry.message} (${entry.scope})\n`
      }
      changelog += `\n`
    }

    if (fixes.length > 0) {
      changelog += `### Bug Fixes\n`
      for (const entry of fixes) {
        changelog += `- ${entry.message} (${entry.scope})\n`
      }
      changelog += `\n`
    }
  }

  return changelog
}

function updatePackageVersion(packagePath: string, newVersion: string): void {
  const pkgPath = join(rootDir, packagePath, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  pkg.version = newVersion
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  console.log(`  Updated ${pkg.name} to ${newVersion}`)
}

async function main() {
  const args = process.argv.slice(2)
  const changelogOnly = args.includes('--changelog')

  console.log('🚀 AI Workflow Release Script\n')
  console.log(`Root directory: ${rootDir}\n`)

  for (const pkg of PACKAGES) {
    console.log(`Processing ${pkg.name}...`)

    const packageInfo = getPackageInfo(pkg.path)
    if (!packageInfo) {
      console.log(`  ⚠️  Package not found at ${pkg.path}`)
      continue
    }

    console.log(`  Current version: ${packageInfo.version}`)

    const entries = parseCommits(`v${packageInfo.version}`)
    const changelog = generateChangelog(packageInfo.name, entries)

    // Write changelog
    const changelogPath = join(rootDir, pkg.path, 'CHANGELOG.md')
    writeFileSync(changelogPath, changelog)
    console.log(`  ✓ Generated CHANGELOG.md`)

    if (!changelogOnly) {
      const bumpType = determineBumpType(entries)
      if (entries.length > 0) {
        const newVersion = bumpVersion(packageInfo.version, bumpType)
        updatePackageVersion(pkg.path, newVersion)
        console.log(`  ✓ Bumped to ${newVersion} (${bumpType})`)
      } else {
        console.log(`  ⚠️  No commits since last release, skipping version bump`)
      }
    }

    console.log('')
  }

  console.log('✅ Release process completed!')
  if (changelogOnly) {
    console.log('\n📝 Changelogs generated. Run `pnpm release` to also bump versions.')
  } else {
    console.log('\n📝 Run `git add . && git commit -m "chore: release"` and create a tag to publish.')
  }
}

main().catch(console.error)