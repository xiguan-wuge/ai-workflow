# Technical Design: capitalize 字符串工具函数

## 1. 总体设计思路

- **职责单一**：一个文件对应一类工具函数，`string.ts` 专司字符串处理
- **零依赖**：纯 TypeScript 实现，不引入任何外部依赖
- **可扩展**：以模块化方式导出，后续字符串相关函数统一追加到 `string.ts`
- **符合包规范**：遵循 `@ai-workflow/utils` 作为纯工具函数库的角色定位

---

## 2. 目录结构 / 文件划分

```
packages/utils/src/
├── index.ts          # 包导出入口
└── string.ts         # 字符串工具函数模块 (新增)
```

| 文件 | 职责 |
|---|---|
| `string.ts` | 实现所有字符串工具函数，当前仅含 `capitalize` |
| `index.ts` | 作为包的公共 API 入口，统一导出各模块函数 |

---

## 3. 核心模块详细设计

### 3.1 string.ts

```typescript
// packages/utils/src/string.ts

/**
 * 将字符串首字母转为大写，其余字符保持不变
 *
 * @param str - 输入字符串
 * @returns 首字母大写后的字符串，空字符串直接返回空字符串
 *
 * @example
 * capitalize('hello')       // 'Hello'
 * capitalize('world')       // 'World'
 * capitalize('apple banana') // 'Apple banana'
 * capitalize('')             // ''
 * capitalize('a')           // 'A'
 * capitalize('123abc')     // '123abc'（数字开头不变化）
 */
export function capitalize(str: string): string {
  if (str.length === 0) return '';
  return str[0].toUpperCase() + str.slice(1);
}
```

**设计要点**：
- 先判断长度，避免对空字符串调用 `toUpperCase()` 时产生不必要的索引访问
- 使用 `slice(1)` 截取剩余字符，与 `substring(1)` 行为一致但更符合惯例

### 3.2 index.ts

```typescript
// packages/utils/src/index.ts

export { capitalize } from './string';
```

**设计要点**：
- 保持导出层级扁平，调用方使用 `import { capitalize } from '@ai-workflow/utils'` 即可

---

## 4. 数据结构 / 接口定义

```typescript
// 函数签名
function capitalize(str: string): string;

// TypeScript 类型约束：
//   输入: string 类型的任意值
//   输出: string 类型，保证非 null/undefined
```

| 输入 | 输出 |
|---|---|
| 非空字符串 `'hello'` | `'Hello'` |
| 空字符串 `''` | `''` |
| 单字符 `'a'` | `'A'` |
| 以数字开头的字符串 `'123abc'` | `'123abc'` |
| 单词首字母大写的字符串 `'Hello'` | `'Hello'`（不变） |

---

## 5. 关键实现路径

1. **新建** `packages/utils/src/string.ts`，实现 `capitalize` 函数
2. **修改** `packages/utils/src/index.ts`，添加对 `string.ts` 的导出
3. **验证**：
   - 类型检查：`pnpm --filter @ai-workflow/utils exec tsc --noEmit`
   - 构建验证：`pnpm --filter @ai-workflow/utils build`
4. **（可选）添加测试**：在 `packages/utils/src/__tests__/string.test.ts` 覆盖边界用例

---

## 6. 文件变更清单

| 操作 | 文件路径 |
|---|---|
| 新增 | `packages/utils/src/string.ts` |
| 修改 | `packages/utils/src/index.ts` |