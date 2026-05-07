# CLAUDE.md for ai-workflow

## Repository Overview

- Vue 3 + TypeScript + VitePress monorepo, managed by pnpm
- Packages: `@ai-workflow/components` (Vue components), `@ai-workflow/utils`
- CI: `ci.yml` (PR checks), `release.yml` (tags), `docs.yml` (main branch)
- Docs auto-deploy to GitHub Pages on push to main

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all packages in dev mode |
| `pnpm build` | Build all packages |
| `pnpm --filter @ai-workflow/components exec vue-tsc --noEmit` | Type-check components |
| `pnpm --filter @ai-workflow/docs dev` | Start docs locally |
| `pnpm --filter @ai-workflow/docs build` | Build docs |

## Automation Cron Jobs

When a Claude Code session starts for this repo, register these cron jobs:

| Cron | Frequency | Purpose |
|------|-----------|---------|
| check-ci-failures | `*/30 * * * *` | Scan PRs with `ci-failed` label, attempt auto-fix |
| triage-new-issues | `0 */2 * * *` | Scan issues with `needs-triage` label, classify and respond |
| respond-to-issues | `0 */6 * * *` | Check for unanswered issues needing AI response |
| health-check | `57 8 * * *` | Daily summary: open PRs, issues, stale items |

## CI Failure Auto-Fix Protocol

1. List open PRs with label `ci-failed` using `mcp__plugin_everything-claude-code_github__list_pull_requests`
2. For each failed PR:
   a. Read the PR's CI run failure log (via `gh run view` or `gh api`)
   b. Read the PR's changed files using `mcp__plugin_everything-claude-code_github__get_pull_request_files`
   c. Read the full content of each changed file using `mcp__plugin_everything-claude-code_github__get_file_contents`
   d. Analyze the error to determine root cause
   e. Apply the fix to the relevant file
   f. Push the fix using `mcp__plugin_everything-claude-code_github__push_files`
   g. Add a PR review comment explaining the fix using `mcp__plugin_everything-claude-code_github__create_pull_request_review`
   h. Remove the `ci-failed` label and add `auto-fixed` label
3. Max 3 fix attempts per PR; if still failing, add label `needs-human` and comment explaining why

## Issue Triage Protocol

Classification rules:
- Bug reports → add `bug`, verify reproducibility, ask for reproduction steps if missing
- Feature requests → add `enhancement`, ask clarifying questions about scope and use case
- Documentation issues → add `documentation`, link to relevant docs pages
- Questions → label `question`, point to documentation or discussions

Response template for bugs:
"Thanks for the report! I've labeled this as a bug. Could you confirm the package version and provide a minimal reproduction?"

Response template for features:
"Thanks for the suggestion! A few questions to help us scope this: [tailored follow-up questions]"

## Source Code Layout

```
packages/components/src/   # Publishable Vue components
packages/utils/src/         # Shared utilities
docs/                       # VitePress documentation
playground/                 # Dev playground app
scripts/                    # Build/release scripts
```
