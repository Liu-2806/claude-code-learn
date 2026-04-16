# Claude Code 使用教程

> Claude Code 是 Anthropic 推出的官方 CLI 工具，让 Claude 直接在你的终端中辅助编程。它采用 **Agentic Coding**（自主编码）模式——不是简单的单次问答生成，而是通过多步迭代循环自主完成任务：理解需求 → 制定计划 → 执行操作（编辑/运行/搜索） → 观察结果 → 修正迭代，直到任务完成。它能够理解整个代码库、编辑文件、运行命令，并自主完成多步骤编码任务。

---

## 目录

- [安装](#安装)
- [认证](#认证)
- [基本使用](#基本使用)
- [三种操作模式](#三种操作模式)
- [斜杠命令](#斜杠命令)
- [CLAUDE.md 项目记忆](#claudemd-项目记忆)
- [权限管理](#权限管理)
- [Hooks 钩子](#hooks-钩子)
- [MCP 服务器集成](#mcp-服务器集成)
- [IDE 集成](#ide-集成)
- [上下文管理技巧](#上下文管理技巧)
- [Agentic Coding 工作原理](#agentic-coding-工作原理)
- [模型选择策略](#模型选择策略)
- [Git Worktree 并行开发](#git-worktree-并行开发)
- [spec → plan → tasks 结构化工作流](#spec--plan--tasks-结构化工作流)
- [多会话协作策略](#多会话协作策略)
- [常见问题](#常见问题)
- [实战案例](#实战案例)
- [参考资源](#参考资源)

---

## 安装

**前置条件：** Node.js 18+ 和 npm

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后，在你的项目目录中运行：

```bash
claude
```

---

## 认证

有两种认证方式：

1. **OAuth 登录（推荐）** — 通过 Anthropic Console 账户登录：
   ```bash
   claude /login
   ```

2. **API Key** — 设置环境变量：
   ```bash
   export ANTHROPIC_API_KEY="your-api-key"
   ```

运行 `/doctor` 检查认证状态和配置是否正常。

---

## 基本使用

进入你的项目目录，启动 Claude Code：

```bash
cd your-project
claude
```

启动后你可以直接用自然语言描述任务，例如：

```
帮我重构 auth 模块，把 session token 的存储方式改成 JWT
```

```
这个文件里有个 bug，第 42 行的类型推断有问题，帮我修一下
```

```
给这个 API 端点加上输入验证，用 Zod schema
```

Claude Code 会自主完成：搜索代码、理解上下文、编辑文件、运行测试、提交代码等多步骤操作。

### 常用启动参数

| 参数 | 说明 |
|------|------|
| `claude -p "任务描述"` | 非交互模式，直接执行任务后退出 |
| `claude --resume` | 恢复上一次会话 |
| `claude --model opus` | 指定使用的模型（见[模型选择策略](#模型选择策略)） |
| `claude --fast` | 使用快速模式（同模型，更快输出） |
| `claude --verbose` | 开启详细日志，查看 Claude 的内部决策过程、工具调用参数和返回值 |
| `claude --sandbox` | 沙盒模式，限制文件写入范围和命令执行（仅支持 macOS/Linux/WSL2） |

---

## 三种操作模式

Claude Code 有三种操作模式，适用于不同场景：

### Normal Mode（普通模式）

默认模式，每次启动时就是这个模式。Claude 在执行需要权限的操作前会逐一询问你是否同意（编辑文件、运行命令等）。安全性最高，适合大多数日常开发场景。

### Auto-Accept Mode（自动接受模式）

Claude 不再逐一询问，所有操作自动执行。适合你信任 Claude 判断、想快速完成的简单任务。风险更高——Claude 可能做出你不预期的修改。

**切换方式：** 在会话中按 **Shift+Tab** 可在 Normal 和 Auto-Accept 之间切换。

### Plan Mode（计划模式）

Claude 只做分析和规划，不执行任何修改操作。会写出一个详细的实施计划供你审核，确认后才切换到执行模式去实际编码。适合复杂的多文件变更任务——先想清楚再动手。

**进入方式：** 按 **Ctrl+P** 或在对话中请求进入 Plan Mode。**退出方式：** 按 **Ctrl+P** 再次或确认计划后退出。

### 模式对比

| | Normal | Auto-Accept | Plan |
|---|---|---|---|
| **确认方式** | 每步都问 | 全部自动 | 先规划后执行 |
| **速度** | 较慢 | 最快 | 规划慢，执行快 |
| **安全性** | 最高 | 最低 | 中高 |
| **适用场景** | 日常开发 | 信任度高的简单任务 | 复杂重构/多步骤任务 |
| **切换方式** | 默认 | Shift+Tab | Ctrl+P |

---

## 斜杠命令

在会话中使用 `/` 前缀触发斜杠命令：

| 命令 | 说明 |
|------|------|
| `/help` | 显示可用命令和使用帮助 |
| `/compact` | 压缩对话历史，释放上下文窗口空间 |
| `/clear` | 清除对话历史，重新开始 |
| `/cost` | 显示当前会话的 token 用量和费用 |
| `/doctor` | 检查 Claude Code 的安装和配置健康状态 |
| `/init` | 初始化项目，创建 CLAUDE.md 文件 |
| `/memory` | 打开编辑器编辑 CLAUDE.md 记忆文件（默认用系统编辑器，可通过 `$EDITOR` 环境变量自定义） |
| `/config` | 打开或修改配置 |
| `/permissions` | 交互式管理权限（allow/deny 规则） |
| `/status` | 显示当前会话状态 |
| `/review` | AI 辅助代码审查（PR Review） |
| `/login` | 切换 Anthropic 账户 |
| `/logout` | 登出当前账户 |
| `/terminal-setup` | 配置终端集成（Shell、IDE） |
| `/vim` | 切换 Vim 输入模式 |
| `/sandbox` | 切换沙盒模式（目前仅支持 macOS、Linux 和 WSL2，Windows 原生不支持） |

---

## CLAUDE.md 项目记忆

CLAUDE.md 是 Claude Code 的"持久记忆"文件，每次会话开始时自动读取，用于提供项目级别的上下文和指令。

### 三级放置

| 位置 | 作用范围 | 用途 |
|------|----------|------|
| `~/.claude/CLAUDE.md` | 全局（所有项目） | 个人偏好、通用编码风格 |
| `./CLAUDE.md`（项目根目录） | 项目级 | 项目约定、架构说明、技术栈 |
| `./src/CLAUDE.md`（子目录） | 目录级 | 模块特定规则、局部模式 |

### 写什么、不写什么

**应该写的：**
- 项目架构概述和关键入口点
- 编码约定（命名、格式化、导入风格）
- 测试要求和框架
- 重要的架构决策和原因

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
```

使用 `/init` 自动生成初始 CLAUDE.md，使用 `/memory` 编辑已有内容。

---

## 权限管理

Claude Code 有三层权限模型：

| 级别 | 说明 |
|------|------|
| **Allow** | 工具始终允许执行 |
| **Deny** | 工具始终拒绝 |
| **Ask** | 每次使用时询问用户 |

在 `.claude/settings.json` 中配置权限规则：

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm test:*)",
      "Read",
      "Edit"
    ],
    "deny": [
      "Bash(rm:*)"
    ]
  }
}
```

支持 glob 模式匹配，例如 `Bash(git:*)` 允许所有 git 相关命令。

### 设置文件层级

设置文件按优先级合并（高优先级覆盖低优先级）：

1. **企业级** `/etc/claude-code/settings.json` — 管理员强制配置
2. **用户级** `~/.claude/settings.json` — 个人全局配置
3. **项目级** `.claude/settings.json` — 团队共享配置

对于 deny 权限，企业级设置始终优先。

---

## Hooks 钩子

Hooks 允许你在 Claude Code 工作流的特定节点运行自定义 shell 命令。

### 可用的 Hook 类型

| 类型 | 触发时机 |
|------|----------|
| `PreToolUse` | 工具执行前 |
| `PostToolUse` | 工具执行后 |
| `Notification` | 通知事件时 |
| `Stop` | Claude 停止响应时 |

### 配置示例

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "audit-log.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'File edited' >> changelog.txt"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "notify-done.sh"
          }
        ]
      }
    ]
  }
}
```

`matcher` 可选，用于过滤特定工具（如只对 `Bash` 或 `Edit` 工具触发）。

---

## MCP 服务器集成

MCP（Model Context Protocol）允许 Claude Code 连接外部工具和数据源，扩展其能力。

### 配置位置

可在三个位置配置 MCP 服务器：

- `~/.claude/settings.json`（全局）
- `.claude/settings.json`（项目级）
- `.mcp.json`（项目级，可提交到 Git 共享给团队）

### 配置格式

```json
{
  "mcpServers": {
    "my-server": {
      "command": "path-to-command",
      "args": ["arg1", "arg2"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

常见 MCP 服务器示例：数据库连接、Slack 集成、GitHub API 工具、自定义 API 接口等。

---

## IDE 集成

### VS Code

在 VS Code 扩展市场搜索 "Claude Code" 安装，或：

```
ext install anthropic.claude-code
```

功能包括：内联代码建议、侧边栏对话、多文件上下文感知、终端命令协助。

### JetBrains

在 JetBrains IDE（IntelliJ IDEA、PyCharm、WebStorm 等）的插件市场搜索 "Claude Code" 安装。

功能包括：AI 辅助代码补全、对话面板、重构建议、错误检测和修复推荐。

两种 IDE 扩展都基于 Claude Code CLI 后端运行，支持自主多步骤编码工作流。

---

## 上下文管理技巧

长时间会话会消耗大量上下文窗口。以下技巧帮助你高效管理：

| 技巧 | 说明 |
|------|------|
| **使用 `/compact`** | 定期压缩对话历史，保留关键信息，释放上下文空间 |
| **使用 `/clear`** | 切换任务时清除历史，避免无关上下文干扰 |
| **分拆复杂任务** | 不要在一个会话中尝试重构整个代码库 |
| **引用文件而非粘贴** | 让 Claude 直接读取文件，而不是把大段代码粘贴到对话中 |
| **利用 CLAUDE.md** | 把重复出现的指令写入 CLAUDE.md，而不是每次会话都重复 |
| **非交互模式** | 用 `claude -p "任务"` 快速执行单一任务后退出 |

---

## Agentic Coding 工作原理

Claude Code 的核心不是简单的"单次问答→代码生成"，而是 **Agentic Coding**——自主迭代循环。

### 传统 AI 编码 vs Agentic Coding

| 维度 | 传统 AI 编码 | Agentic Coding |
|------|-------------|----------------|
| 模式 | 单次问答生成 | 多步迭代，自主决策 |
| 工具使用 | 无 | 读写文件、执行命令、搜索代码 |
| 反馈循环 | 无 | 执行 → 验证 → 修正 → 再执行 |
| 上下文 | 单次输入 | 持续积累项目上下文 |
| 错误处理 | 依赖人工 | 自主识别并修复错误 |

### Agentic Loop 循环过程

```
1. 理解任务
2. 制定计划
3. 执行工具调用（编辑文件/运行命令/搜索代码）
4. 观察结果
5. 判断是否完成
   → 完成：提交结果
   → 未完成：回到步骤 3 修正
```

这意味着 Claude Code 会在遇到问题时**自动修正**，比如编译失败会自动查看错误、修改代码、再次运行，直到问题解决或判断无法修复时才停下来。

---

## 模型选择策略

Claude Code 支持三种 Claude 模型，不同场景适合不同选择：

| 模型 | 特点 | 适用场景 | 启动方式 |
|------|------|----------|----------|
| **Opus 4** | 深度推理能力强，慢，贵 | 复杂架构设计、大规模代码迁移、疑难 bug | `claude --model opus` |
| **Sonnet 4** | 性价比最优，速度与能力平衡 | 日常编码、重构、调试 | 默认或 `claude --model sonnet` |
| **Haiku 3.5** | 快速低成本 | 快速补全、格式化、简单问答 | `claude --model haiku` |

快速模式 `--fast` 使用同模型但输出更快，不会切换到更低级的模型。

---

## Git Worktree 并行开发

Git Worktree 是 Claude Code 社区推荐的"杀手级用法"——让多个 Claude 实例同时并行工作在不同功能上。

### 什么是 Git Worktree？

Git Worktree 是同一个仓库的多个独立工作目录，每个目录可以 checkout 不同分支，互不干扰。

### 设置并行开发

```bash
# 为不同任务创建 worktree
git worktree add ../feature-a feature-a-branch
git worktree add ../feature-b feature-b-branch
git worktree add ../hotfix-1 hotfix-branch

# 在每个 worktree 中启动独立的 Claude Code
cd ../feature-a && claude             # Agent A: 开发新功能
cd ../feature-b && claude             # Agent B: 开发另一功能
cd ../hotfix-1  && claude --sandbox   # Agent C: 安全测试热修复
```

### 并行 vs 串行对比

| 传统方式 | Git Worktree 并行方式 |
|---------|---------------------|
| 一个任务做完才做下一个 | 多个 agent 同时工作 |
| 分支切换频繁，上下文丢失 | 每个目录独立上下文 |
| stash 管理复杂 | 物理隔离，无需 stash |

### 完成后合并

```bash
git checkout main
git merge feature-a-branch feature-b-branch hotfix-branch

# 清理 worktree
git worktree remove ../feature-a
git worktree remove ../feature-b
git worktree remove ../hotfix-1
```

---

## spec → plan → tasks 结构化工作流

这是 Claude Code 社区广泛推荐的项目规划方法，把复杂项目从"需求"到"策略"到"执行"逐层拆解，让 Claude 按文档驱动而非凭记忆工作。

### 三个文件的角色

| 文件 | 角色 | 内容 | 由谁编写 |
|------|------|------|----------|
| `spec.md` | 需求规格 | 做什么、约束、目标、成功标准 | **你写**（人） |
| `plan.md` | 实施计划 | 怎么做、文件结构、数据模型、模块边界、实现顺序 | **Claude 写**（读 spec 后生成） |
| `tasks.md` | 任务清单 | 具体执行步骤，带状态标记 `[ ]` / `[x]` | **Claude 写**（读 plan 后拆解） |

### 执行流程

**第一步：你写 spec.md** — 用自然语言描述你要做什么，尽量具体无歧义：

```markdown
# 项目：任务追踪 CLI

## 概述
命令行工具，管理每日任务，数据持久化到 JSON。

## 需求
- 添加、列出、完成、删除任务
- 支持优先级（高/中/低）
- 按状态或优先级筛选

## 约束
- Python 3.10+，无外部依赖
```

**第二步：让 Claude 生成 plan.md** — 启动会话，告诉 Claude 读取 spec.md 并生成架构级实施计划。

**第三步：审查 plan.md（推荐用新会话）** — 重新开一个会话，让 Claude 审查计划中的风险和遗漏（见[多会话协作策略](#多会话协作策略)）。

**第四步：让 Claude 生成 tasks.md** — 审查通过后，让 Claude 把计划拆解为可逐条执行的清单：

```markdown
# Tasks

- [ ] 1. 创建项目结构（目录、__init__.py）
- [ ] 2. 实现 Task 数据模型
- [ ] 3. 编写 Task 模型测试
- [ ] 4. 实现 Storage.load/save
- [ ] 5. 编写 Storage 测试
- [ ] 6. 实现 add_task 命令
- [ ] 7. 搭建 CLI 入口（argparse）
```

**第五步：逐条执行** — 每个会话只做几条任务，完成后标记 `[x]`，提交 git：

```
任务 1-3 已完成。开始执行任务 4：实现 Storage.load/save
```

### 为什么有效

| 优势 | 说明 |
|------|------|
| **减少幻觉** | Claude 基于书面文档工作，不是凭"记忆"推断 |
| **跨会话延续** | 新会话读文件即可恢复上下文 |
| **可追溯** | 每条任务可回溯到 plan 步骤，plan 回溯到 spec 需求 |
| **容易回退** | 每条任务一个 git commit，出错就 revert 一条 |

### 变体

| 规模 | 文件组合 |
|------|----------|
| 小项目 | `spec.md` + `tasks.md` |
| 中等项目 | `spec.md` → `plan.md` → `tasks.md` |
| 大项目 | 再加 `arch.md`（架构决策）、`decisions.md`（关键决策及原因） |

---

## 多会话协作策略

对于复杂任务，推荐使用多个独立会话分工协作，避免单会话的思维惯性。

### 为什么分多个会话？

同一个会话中 Claude 审查自己的计划容易产生确认偏误——上下文里充满了支持该方案的推理，倾向于认为自己没问题。新会话从零开始，审查更客观。

### 两种常用策略

**策略一：规划 → 审查 → 执行（三个会话）**

| 会话 | 任务 | 说明 |
|------|------|------|
| 会话 A | 分析代码，制定计划，写入 plan.md | 专注"怎么做" |
| 会话 B | 读取 plan.md，审查风险和遗漏 | 专注"有什么问题"，不受 A 的思维惯性影响 |
| 会话 C | 按 plan.md 执行实现 | 上下文干净，不被前两个会话的讨论拖慢 |

每个会话结束后退出，下一个会话重新启动。

**策略二：Plan Mode + `/compact`（单会话）**

适合不想频繁切换会话的场景：

1. 进入 **Plan Mode**（Ctrl+P）— Claude 只规划不执行
2. 写好计划后 **`/compact`** — 压缩冗长的分析历史
3. 以审查者视角让 Claude 重新审视计划
4. 确认没问题后退出 Plan Mode 开始执行

不如两个独立会话那么干净（压缩后仍保留部分倾向），但更方便。

### 最佳实践

- **简单任务**：一个会话 + Plan Mode 即可
- **复杂任务**（多文件重构、架构变更）：用会话 A → 文件 → 会话 B 的模式
- 关键原则：**把中间结果落地为文件**（plan.md、tasks.md），而不是只留在对话历史里

---

## 常见问题

### Q: 安装后 `claude` 命令找不到？

确认 Node.js 18+ 已安装，全局 npm 包路径正确。可能需要重启终端或重新加载 shell 配置。

### Q: 认证失败？

运行 `/doctor` 检查认证状态。如果是 API Key 方式，确认 `ANTHROPIC_API_KEY` 环境变量设置正确。

### Q: Claude Code 编辑文件时需要我确认？

这是权限模型的正常行为。你可以在 `.claude/settings.json` 中将 `Edit` 加入 `allow` 列表来自动允许文件编辑。

### Q: 会话变得很慢或很贵？

使用 `/compact` 压缩历史，或 `/clear` 清除后重新开始。用 `/cost` 查看 token 消耗情况。

### Q: 如何在 CI/CD 中使用 Claude Code？

使用非交互模式 `claude -p "任务描述"`，配合 API Key 环境变量认证。

### Q: /sandbox 在 Windows 上不支持？

沙盒模式目前仅支持 macOS、Linux 和 WSL2。Windows 原生环境无法使用。如果你在 Windows 上，可以安装 WSL2 来获得沙盒支持。

### Q: /memory 打开的编辑器不是我想要的？

`/memory` 默认使用系统编辑器。设置 `$EDITOR` 或 `$VISUAL` 环境变量来指定你喜欢的编辑器，例如：

```bash
export EDITOR="code"    # VS Code
export EDITOR="vim"     # Vim
```

---

## 实战案例

### 案例 1：从零搭建项目

```bash
cd ~/projects
mkdir my-app && cd my-app
git init
claude
```

```
帮我搭建一个 Express + MongoDB 的后端项目，包含用户注册、登录和 CRUD 接口。用 TypeScript，项目结构按模块划分。
```

### 案例 2：调试遗留代码

```
这个 auth 模块有 bug，用户登录后偶尔会 500 错误。帮我找到原因并修复。先读取 auth.ts 和相关测试文件，理解问题，然后修复。
```

### 案例 3：代码审查与重构

```
读取 src/utils/ 下所有文件，找出重复的逻辑，提出重构建议。不要直接修改，先在 plan.md 中写出重构方案。
```

### 案例 4：并行开发多个功能

```bash
# 设置 worktree
git worktree add ../api-refactor refactor-branch
git worktree add ../new-feature feature-branch

# 两个终端同时运行
cd ../api-refactor && claude  # 重构 API
cd ../new-feature && claude   # 开发新功能
```

### 案例 5：CI/CD 自动化

```bash
claude -p "检查 PR #42 的代码变更，指出潜在的安全问题和性能风险" --model opus
```

---

## 参考资源

- [Anthropic 官方文档](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Code GitHub 仓库](https://github.com/anthropics/claude-code)
- [Claude Code 斜杠命令参考](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Claude Code 反馈与问题](https://github.com/anthropics/claude-code/issues)
- [知乎：Claude Code 使用教程](https://zhuanlan.zhihu.com/p/2009744974980331332)