# Proposal: Fix NoData Demo Plugin Vue Compiler Error

## What
Fix the Vue compiler error in `docs/components/nodata.md` caused by improper attribute escaping in the demo plugin.

## Why
When VitePress renders the nodata.md documentation page, the demo plugin generates HTML with unescaped double quotes in attributes, causing the Vue compiler to fail with:
```
createCompilerError ... at Tokenizer.handleInAttrValueDoubleQuotes
```

The error occurs at line 7, column 17 where `nodata/basic` is the demo source path.

## Root Cause
In `docs/.vitepress/plugins/demo.ts`, line 42-43:
```js
const descriptionEscaped = md.render(description).replace(/"/g, '&quot;')
const res = `<Demo ... description="${descriptionEscaped}">`
```

The issue is that `md.render()` may produce HTML containing double quotes that break the attribute parsing, and the escaping only handles literal quotes, not HTML entities from the rendered description.

## Solution
Escape HTML special characters properly before embedding in HTML attributes. Use proper HTML entity encoding for all special characters that could break attribute parsing.
