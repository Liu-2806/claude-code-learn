# 自定义斜杠命令（Custom Commands）

除了内置的 `/help`、`/compact` 等，你可以创建**项目专属的自定义命令**——手动触发的 prompt 模板。

::: info 和 Skills 的区别
Custom Commands 是**手动调用**的 prompt 模板（`/project:xxx`），Skills 是**按条件自动加载**的最佳实践指南。详见 [Skills 技能系统](/guide/skills)。
:::

## 创建自定义命令

在项目根目录创建 `.claude/commands/` 目录，每个 `.md` 文件就是一个命令：

```bash
mkdir -p .claude/commands
```

```
.claude/commands/
├── refactor.md        → /project:refactor
├── explain.md         → /project:explain
├── test.md            → /project:test
└── pr-review.md       → /project:pr-review
```

## 编写命令模板

在 `.md` 文件中写 prompt 模板，用 `$ARGUMENTS` 占位符接收用户输入：

**`.claude/commands/refactor.md`：**

```markdown
Refactor the following code to improve readability and performance.
Focus on reducing complexity and eliminating redundant patterns.

Code to refactor: $ARGUMENTS

Guidelines:
- Maintain existing functionality
- Add descriptive comments
- Follow the project's style guide
```

使用时：`/project:refactor src/utils/parser.ts`

`src/utils/parser.ts` 会替换 `$ARGUMENTS`。

## 实战示例

### 示例 1：代码审查命令

**`.claude/commands/review.md`：**

```markdown
Review the following code for bugs, security issues, and performance problems.
Focus on edge cases and error handling.

Code to review: $ARGUMENTS

Check for:
- Unhandled error cases
- Security vulnerabilities (OWASP top 10)
- Performance bottlenecks
- Missing type safety
```

使用：`/project:review src/auth/login.ts`

### 示例 2：测试生成命令

**`.claude/commands/test.md`：**

```markdown
Generate comprehensive tests for the following file.
Use the project's test framework (Vitest) and follow existing test patterns.

File to test: $ARGUMENTS

Requirements:
- Cover all public functions/methods
- Include edge cases and error scenarios
- Follow the project's naming convention: *.test.tsx
- Place test file next to the source file
```

使用：`/project:test src/api/userHandler.ts`

### 示例 3：数据库迁移命令

**`.claude/commands/migrate.md`：**

```markdown
Create a database migration for the following change.
Use Prisma migration format.

Change description: $ARGUMENTS

Requirements:
- Generate both up and down migrations
- Add appropriate indexes
- Consider data backfill for NOT NULL columns
- Include a comment explaining the migration reason
```

使用：`/project:migrate Add email column to users table`

## 个人命令 vs 项目命令

| 位置 | 作用 | 调用方式 |
|------|------|----------|
| `.claude/commands/` | 项目级，可提交 Git 共享给团队 | `/project:命令名` |
| `~/.claude/commands/` | 个人级，所有项目可用 | `/user:命令名` |

## 最佳实践

- 命令名保持简短描述性（如 `review`、`debug`、`migrate`）
- 模板中引用项目约定（如"遵循本项目的 style guide"）
- 可以组织子目录：`.claude/commands/testing/unit.md` → `/project:testing/unit`
- 输入 `/` 时 Claude Code 会列出所有可用的自定义命令
- 优先用 `$ARGUMENTS` 接收参数，而不是让用户在模板中手动修改