# CLAUDE.md 与 MEMORY.md 项目记忆

Claude Code 有两层记忆系统：**CLAUDE.md**（你写的指令）和 **MEMORY.md**（Claude 自动维护的记忆）。两者配合使用，让 Claude 跨会话保持上下文。

## CLAUDE.md — 你写的指令

CLAUDE.md 是你手动编写的项目指令文件，每次会话开始时自动读取。

### 三级放置

| 位置 | 作用范围 | 用途 |
|------|----------|------|
| `~/.claude/CLAUDE.md` | 全局（所有项目） | 个人偏好、通用编码风格 |
| `./CLAUDE.md`（项目根目录） | 项目级 | 项目约定、架构说明、技术栈 |
| `./src/CLAUDE.md`（子目录） | 目录级 | 模块特定规则、局部模式 |

三个级别的文件会在会话开始时**合并加载**，目录级文件只在 Claude 进入该目录时读取。

### 写什么、不写什么

**应该写的：**
- 项目架构概述和关键入口点
- 编码约定（命名、格式化、导入风格）
- 测试要求和框架
- 重要的架构决策和原因
- 常用命令（build、test、lint）

**不应该写的：**
- 每个文件的详细列表（可以由 Claude 自行探索）
- 通用开发实践（如"写清晰的错误消息"）
- 可以从代码本身推导出的信息

### 示例

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## 架构
- Next.js 14 App Router
- Prisma ORM + PostgreSQL
- 认证使用 NextAuth.js

## 约定
- 使用命名导出，不用默认导出
- 优先 async/await，不用 .then()
- API 路由必须用 Zod 验证输入

## 测试
- Vitest 单元测试，Playwright e2e 测试
- 测试文件与源文件同目录：Component.test.tsx

## 常用命令
- 构建：npm run build
- 测试：npm test
- lint：npm run lint
```

使用 `/init` 自动生成初始 CLAUDE.md，使用 `/memory` 编辑已有内容。

## MEMORY.md — Claude 自动维护的记忆

MEMORY.md 是 Claude Code **自动维护**的持久记忆系统，用于记录它在会话中学到的偏好、决策和重要信息。

### 和 CLAUDE.md 的区别

| | CLAUDE.md | MEMORY.md |
|---|-----------|-----------|
| **谁来写** | 你手动编写 | Claude 自动写入 |
| **内容** | 项目指令和约定 | Claude 学到的偏好、纠正、关键决策 |
| **更新频率** | 你需要时才改 | Claude 发现重要信息时自动追加 |
| **位置** | 项目根目录 / 子目录 | `~/.claude/projects/<project>/memory/`（项目级） |

### 记忆的实际结构

MEMORY.md 不是简单的追加文件，而是**索引文件 + 独立记忆文件**的组合：

- **`MEMORY.md`** — 记忆索引，每条记录一行链接，自动加载到会话上下文
- **`*.md` 独立文件** — 每条记忆存储在独立的 Markdown 文件中，包含 frontmatter 元数据

### 记忆文件的 Frontmatter 格式

每个记忆文件使用 YAML frontmatter 定义元数据：

```markdown
---
name: 记忆名称
description: 一行描述 — 用于判断是否相关
type: user | feedback | project | reference
---

记忆内容正文
```

**type 类型说明：**

| 类型 | 说明 | 示例 |
|------|------|------|
| `user` | 用户角色、偏好、知识 | "用户偏好 TypeScript，不喜欢默认导出" |
| `feedback` | 用户对 Claude 行为的纠正或确认 | "不要 mock 数据库，之前因为 mock 导致迁移失败" |
| `project` | 项目状态、决策、进度 | "认证模块重写是因为合规要求" |
| `reference` | 外部系统中的信息引用 | "pipeline bugs 在 Linear 项目 INGEST 中追踪" |

### 自动记忆触发时机

Claude 会自动保存记忆，当：
- 你表达了偏好（如"我更喜欢 TypeScript"、"用 conventional commits"）
- 你纠正了 Claude 的理解（如"不对，我们用的是 React 不是 Vue"）
- 你做出了重要架构决策
- Claude 发现了项目中的关键模式

你也可以主动要求 Claude 记住某个信息：

```
请记住：这个项目的数据库密码不在代码里，而是从 AWS Secrets Manager 读取
```

### 记忆内容结构

对于 `feedback` 和 `project` 类型，正文建议包含以下结构：

```
规则/事实

**Why:** 原因（过去的教训、用户给出的理由）

**How to apply:** 在什么场景下应用这条规则
```

这样未来 Claude 在判断边缘情况时能根据"为什么"做出合理决策，而不仅是机械执行规则。

::: tip 管理建议
- 定期检查 MEMORY.md 和记忆文件内容，删除过时信息
- 记忆索引超过 200 行会被截断，保持每条记录简洁
- 不要把可从代码推导的信息写入记忆——记忆应该存"为什么"，而非"是什么"
- 记忆内容可能过时，遇到与当前代码冲突时优先信任代码现状，然后更新记忆
- 可以将项目级记忆文件提交到 Git，和团队共享项目记忆
:::