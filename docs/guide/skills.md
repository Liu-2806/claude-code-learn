# Skills 技能系统

Skills 是 Claude Code 的**技能文件**——用 Markdown 定义的工作指令，让 Claude 在特定场景下自动遵循最佳实践。

## Skills vs Custom Commands vs CLAUDE.md

三者的区别很重要：

| | CLAUDE.md | Custom Commands | Skills |
|---|-----------|----------------|--------|
| **位置** | 项目根目录 `CLAUDE.md` | `.claude/commands/*.md` | `.claude/skills/*.md` |
| **何时加载** | 每次会话自动加载 | 用户手动 `/project:xxx` 调用 | 按条件自动加载或手动调用 |
| **内容** | 项目级指令和约定 | prompt 模板，接收 `$ARGUMENTS` | 条件触发的最佳实践指令 |
| **用途** | "这个项目怎么做" | "这个任务怎么执行" | "这种场景下的最佳实践" |

简单说：**CLAUDE.md 是全局规则，Custom Commands 是手动触发的模板，Skills 是智能触发的专业指南。**

## 创建 Skill

在 `.claude/skills/` 目录创建 Markdown 文件：

```bash
mkdir -p .claude/skills
```

每个 `.md` 文件的**YAML frontmatter**定义触发条件，**正文**是 Claude 要遵循的指令。

### Frontmatter 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 技能名称 |
| `description` | string | 是 | 描述技能用途，Claude 用它判断何时激活 |
| `globs` | string[] | 否 | 文件匹配模式，触发此技能的文件类型 |
| `alwaysApply` | boolean | 否 | 是否每次会话都注入此技能。默认 `false` |

### 触发机制

| 设置 | 行为 |
|------|------|
| `alwaysApply: true` | **每次会话都加载**此技能的指令到 Claude 的上下文 |
| `alwaysApply: false` + 有 `globs` | 只在用户操作涉及**匹配 glob 的文件**时才加载 |
| 两者都不设 | Claude 根据 `description` **智能判断**何时需要加载 |

## 实战示例

### 示例 1：React 组件开发规范

**`.claude/skills/react-component.md`：**

```markdown
---
name: React Component Builder
description: Best practices for building React components with TypeScript and hooks
globs:
  - "*.tsx"
  - "*.jsx"
alwaysApply: false
---

# React Component Builder

When creating React components, follow these guidelines:

1. Use functional components with TypeScript interfaces
2. Prefer hooks over class lifecycle methods
3. Keep components small and focused — one responsibility per component
4. Use descriptive prop names, avoid abbreviations

## File Structure
- Component file: ComponentName.tsx
- Test file: ComponentName.test.tsx
- Styles: ComponentName.css
```

当你在会话中提到 `.tsx` 或 `.jsx` 文件时，Claude 自动加载这些规范来指导代码生成。

### 示例 2：项目全局约定（alwaysApply）

**`.claude/skills/project-conventions.md`：**

```markdown
---
name: Project Conventions
description: Coding conventions and architectural patterns for this project
alwaysApply: true
---

# Project Conventions

- All API calls go through src/api/client.ts
- Use Zod for runtime validation on all API inputs
- Error handling uses the AppError class from src/errors/
- Database queries use the repository pattern in src/repositories/
- Never use console.log in production code — use the logging utility
```

每次会话都加载，确保 Claude 遵循项目约定。类似 CLAUDE.md 但更结构化。

### 示例 3：数据库迁移规范

**`.claude/skills/db-migration.md`：**

```markdown
---
name: Database Migration Guide
description: Guidelines for creating safe database migrations
globs:
  - "migrations/*.sql"
  - "prisma/migrations/**"
alwaysApply: false
---

# Database Migration Guide

When creating database migrations:

1. Every migration must be reversible — include a down migration
2. NEVER use DROP COLUMN without a down migration
3. Adding NOT NULL columns must use a default value for existing rows
4. Test migrations on a copy of production data before applying
5. Include a comment explaining WHY the migration is needed
```

只有涉及迁移文件时才会激活。

## 技能 vs CLAUDE.md：怎么选？

::: tip 选择建议
- **用 CLAUDE.md**：项目级全局指令（技术栈、架构、命名约定）— 这些每次都需要
- **用 Skills（alwaysApply）**：需要更结构化的全局指令，按主题拆分比一个大 CLAUDE.md 更清晰
- **用 Skills（globs）**：只针对特定文件类型或场景的规范，不用污染全局上下文
- **用 Custom Commands**：需要用户手动触发、接收参数的 prompt 模板
:::

最有效的组合：一个精简的 CLAUDE.md + 几个条件触发的 Skills + 常用 Custom Commands。

## Skill 文件层级

| 位置 | 作用范围 |
|------|----------|
| `.claude/skills/*.md` | 项目级，可提交 Git 共享给团队 |
| `~/.claude/skills/*.md` | 个人级，所有项目可用 |

## 最佳实践

- 每个 Skill 只聚焦**一个主题**（React 组件、数据库迁移、API 设计...）
- 文件名要**描述性**（如 `react-component.md`，不要用 `skill1.md`）
- 指令要**具体可执行**，不要写模糊的"写好代码"，而是写"用 Zod 验证 API 输入"
- 用 `globs` 精确控制触发条件，避免不相关的 Skill 污染上下文
- 定期审查 Skill 内容，删除过时的指令