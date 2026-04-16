# Claude Code 使用教程

> Claude Code 是 Anthropic 推出的官方 CLI 工具，让 Claude 直接在你的终端中辅助编程。它采用 **Agentic Coding**（自主编码）模式——不是简单的单次问答生成，而是通过多步迭代循环自主完成任务：理解需求 → 制定计划 → 执行操作（编辑/运行/搜索） → 观察结果 → 修正迭代，直到任务完成。它能够理解整个代码库、编辑文件、运行命令，并自主完成多步骤编码任务。

---

## 5 分钟快速上手

如果你是第一次使用 Claude Code，跟着这三步走，5 分钟内就能体验到 AI 辅助编程：

```bash
# 第一步：安装
npm install -g @anthropic-ai/claude-code

# 第二步：认证
claude /login        # 用浏览器登录 Anthropic 账户（推荐）
# 或者：export ANTHROPIC_API_KEY="your-api-key"

# 第三步：在你的项目中启动
cd your-project
claude
```

启动后你会看到 Claude Code 的交互界面，直接输入你的需求即可：

```
> 帮我在 src/utils.ts 里加一个 formatDate 函数，把 ISO 时间字符串转成 "YYYY-MM-DD" 格式
```

Claude Code 会自动：读取文件 → 理解现有代码 → 编辑文件 → 展示修改结果。每一步修改前都会询问你是否同意（Normal Mode 默认行为）。

按 `Ctrl+C` 退出会话。

**恭喜！你已经成功使用了 Claude Code。** 接下来可以继续阅读下面的完整教程，了解更多高级用法。

---

## 目录

- [5 分钟快速上手](#5-分钟快速上手)
- [安装](#安装)
- [Windows 用户专项指引](#windows-用户专项指引)
- [认证](#认证)
- [基本使用](#基本使用)
- [三种操作模式](#三种操作模式)
- [斜杠命令](#斜杠命令)
- [CLAUDE.md 项目记忆](#claudemd-项目记忆)
- [权限管理](#权限管理)
- [Hooks 钩子](#hooks-钩子)
- [MCP 服务器集成](#mcp-服务器集成)
- [IDE 集成](#ide-集成)
- [CI/CD 与自动化](#cicd-与自动化)
- [上下文管理技巧](#上下文管理技巧)
- [高级调试与性能调优](#高级调试与性能调优)
- [Agentic Coding 工作原理](#agentic-coding-工作原理)
- [安全与合规](#安全与合规)
- [模型选择策略](#模型选择策略)
- [Git Worktree 并行开发](#git-worktree-并行开发)
- [spec → plan → tasks 结构化工作流](#spec--plan--tasks-结构化工作流)
- [多会话协作策略](#多会话协作策略)
- [什么时候不该用 Claude Code](#什么时候不该用-claude-code)
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

## Windows 用户专项指引

如果你在 Windows 上使用 Claude Code，以下是需要特别注意的事项：

### 推荐使用 WSL2

Windows 原生终端（PowerShell / CMD）可以运行 Claude Code，但**强烈建议使用 WSL2**（Windows Subsystem for Linux），因为：

- `/sandbox` 沙盒模式**仅支持 macOS/Linux/WSL2**，Windows 原生不支持
- 许多 Claude Code 社区推荐的 shell 命令和工具链都是 Linux 生态
- Git Worktree 并行开发在 WSL2 中体验更好

安装 WSL2：

```powershell
wsl --install
```

安装后重启电脑，在 WSL2 中安装 Node.js 和 Claude Code 即可。

### PowerShell vs Bash

Claude Code 在 Windows 原生终端中**默认使用 PowerShell**。一些关键差异：

| 事项 | PowerShell | Bash（WSL2/Git Bash） |
|------|-----------|---------------------|
| 环境变量 | `$env:ANTHROPIC_API_KEY="xxx"` | `export ANTHROPIC_API_KEY="xxx"` |
| 路径格式 | `C:\Users\project` | `/mnt/c/Users/project`（WSL2） |
| 命令执行 | 部分 Linux 命令不兼容 | 完全兼容 |

### 常见 Windows 问题

- **npm 全局安装路径问题**：如果 `claude` 命令找不到，可能需要将 npm 全局路径加入 PATH。运行 `npm config get prefix` 查看路径，然后加入系统 PATH。
- **Node.js 版本**：确保 Node.js 18+。推荐用 `fnm`（Fast Node Manager）管理版本。
- **终端编码**：如果中文显示乱码，设置终端编码为 UTF-8。

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

## CI/CD 与自动化

Claude Code 不只是交互式工具，它也可以嵌入自动化流程中。

### 非交互模式

```bash
# 单次执行任务后退出，适合脚本和 CI/CD
claude -p "检查 src/ 下所有 TypeScript 文件，列出未处理的 Promise"

# 指定输出格式为 JSON，方便程序解析
claude -p "分析这个仓库的测试覆盖率" --output-format json

# 指定模型
claude -p "审查 PR 的安全风险" --model opus
```

### GitHub Actions 示例

以下是一个在 CI 中自动审查 PR 的 workflow：

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: AI Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "审查这个 PR 的代码变更，指出潜在的 bug、安全风险和性能问题。输出格式为 Markdown。" \
            --output-format json > review-result.json

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const result = JSON.parse(fs.readFileSync('review-result.json', 'utf8'));
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: result.result || result.message
            });
```

> **注意：** API Key 必须通过 GitHub Secrets 存储，不要硬编码在 workflow 文件中。

### Claude Code SDK

除了 CLI，Claude Code 还提供 SDK 方式嵌入你的 Node.js 应用：

```javascript
import { query } from '@anthropic-ai/claude-code';

const result = await query({
  prompt: "修复 auth.ts 中的类型错误",
  options: {
    model: "sonnet",
    allowedTools: ["Read", "Edit", "Bash"]
  }
});

console.log(result);
```

SDK 方式适合构建自定义 AI 辅助工具、内部开发平台、或批量自动化任务。

### 自动化场景举例

| 场景 | 命令 |
|------|------|
| PR 自动审查 | `claude -p "审查 PR 的安全风险" --model opus --output-format json` |
| 依赖升级检查 | `claude -p "检查 package.json 中的过期依赖，建议升级版本"` |
| 文档自动生成 | `claude -p "为 src/api/ 下所有端点生成 API 文档"` |
| 代码风格统一 | `claude -p "统一 src/ 下所有文件的 import 排序规则"` |
| 发布前检查 | `claude -p "检查即将发布的变更中是否有 console.log 残留"` |

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

## 高级调试与性能调优

### `--verbose` 深度调试

当你想了解 Claude Code 内部的决策逻辑时，使用 `--verbose` 模式：

```bash
claude --verbose
```

这会显示 Claude 的完整工具调用过程，包括：
- 每次工具调用的参数和返回值（如读取了什么文件、搜索了什么关键词）
- Claude 选择某个工具的原因（而非直接展示最终结果）
- 请求和响应的 token 数量明细

**典型用途：**
- Claude 反复做错同一件事 → 用 verbose 看它每次读取了什么、推断出什么结论
- Claude 没找到某个文件 → 用 verbose 看它的搜索策略是否合理
- 性能异常慢 → 用 verbose 查看是否存在不必要的重复工具调用

### `.claudeignore` 排除无关文件

类似 `.gitignore`，`.claudeignore` 让 Claude Code 跳过不需要处理的文件和目录，减少无效的上下文消耗：

```gitignore
# 排除大型生成文件
dist/
build/
*.min.js
*.bundle.js

# 排除数据文件
*.csv
*.json.bak
data/seeds/

# 排除无关目录
docs/archive/
vendor/
node_modules/
```

**什么时候需要 `.claudeignore`？**
- 仓库很大（超过 1000 个文件）→ 排除不相关的目录
- 有大型数据文件 → 排除以免浪费上下文窗口
- 有敏感数据文件 → 排除以免 Claude 读取

### 大仓库上下文优化

在大型项目中使用 Claude Code 时，以下策略帮助保持上下文质量：

| 策略 | 说明 |
|------|------|
| **目录级 CLAUDE.md** | 在子目录放置 CLAUDE.md，只描述该模块的上下文，减少全局噪音 |
| **精准引用文件** | 告诉 Claude 具体文件路径，而不是让它全仓库搜索 |
| **限制搜索范围** | 描述任务时指定目录，如"在 src/api/ 下查找..." |
| **分模块会话** | 每个会话只处理一个模块，结束后 `/clear` 开始新模块 |
| **定期 `/compact`** | 每 15-20 分钟压缩一次，防止历史膨胀 |

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

## 安全与合规

在企业或团队环境中使用 Claude Code，必须关注以下安全问题：

### API Key 泄露风险

- **绝不把 API Key 硬编码在任何文件中**，包括 CLAUDE.md、配置文件、脚本
- 使用环境变量 `ANTHROPIC_API_KEY`，并将 `.env` 加入 `.gitignore`
- OAuth 登录方式（`/login`）比 API Key 更安全——token 自动管理，不会泄露到代码中
- 在 CI/CD 中使用 GitHub Secrets 或环境变量注入，不要写入 workflow 文件

### 数据隐私

- Claude Code 会将你的代码和对话发送到 Anthropic API 进行处理
- Anthropic 的数据政策：API 调用的内容**默认不会用于模型训练**
- 但仍需注意：不要让 Claude 处理包含真实用户数据、密码、密钥的文件
- 生产数据库连接字符串、真实客户数据等应通过 deny 权限禁止 Claude 访问

### deny 权限最佳实践

以下命令建议始终设为 deny，防止 Claude 执行危险操作：

```json
{
  "permissions": {
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(rm -r:*)",
      "Bash(dropdb:*)",
      "Bash(drop table:*)",
      "Bash(curl*production*)",
      "Bash(ssh:*)",
      "Bash(sudo:*)",
      "Bash(chmod 777:*)"
    ]
  }
}
```

企业级管理员可以在 `/etc/claude-code/settings.json` 中强制配置 deny 规则，用户无法覆盖。

### MCP 服务器安全边界

- MCP 服务器扩展了 Claude 的能力，但也引入了新的安全边界——每个 MCP 服务器都可以让 Claude 访问新的数据源和执行新操作
- 仅安装你信任的 MCP 服务器，审查其代码和权限范围
- 不要将包含敏感凭据的 MCP 配置提交到 Git（使用 `.claude/settings.local.json` 存放本地配置，不提交）
- 团队共享的 MCP 配置（`.mcp.json`）中不应包含 `env` 中的 API Key 等敏感值

### 企业部署建议

| 推荐措施 | 说明 |
|----------|------|
| 企业级 deny 规则 | 在 `/etc/claude-code/settings.json` 强制禁止危险命令 |
| OAuth 认证 | 遣弃 API Key 方式，使用组织账户 OAuth 登录 |
| 代码审查 | 即使 Claude 自动编辑，仍需人工审查变更后再合并 |
| 敏感文件排除 | 在 `.claudeignore` 中排除含敏感数据的文件和目录 |

---

## 模型选择策略

Claude Code 支持三种 Claude 模型，不同场景适合不同选择：

| 模型 | 特点 | 适用场景 | 启动方式 |
|------|------|----------|----------|
| **Opus 4** | 深度推理能力强，慢，贵 | 复杂架构设计、大规模代码迁移、疑难 bug | `claude --model opus` |
| **Sonnet 4** | 性价比最优，速度与能力平衡 | 日常编码、重构、调试 | 默认或 `claude --model sonnet` |
| **Haiku 3.5** | 快速低成本 | 快速补全、格式化、简单问答 | `claude --model haiku` |

### 定价参考

Claude Code 使用 Anthropic API，按 token 计费（截至当前，具体价格可能调整，请以[官方定价页](https://docs.anthropic.com/en/docs/about-claude/pricing)为准）：

| 模型 | 输入价格 | 输出价格 | 相对成本 |
|------|----------|----------|----------|
| **Opus 4** | $15 / 百万 token | $75 / 百万 token | 最贵，约为 Sonnet 的 5x |
| **Sonnet 4** | $3 / 百万 token | $15 / 百万 token | 性价比最优 |
| **Haiku 3.5** | $0.80 / 百万 token | $4 / 百万 token | 最便宜，约为 Sonnet 的 1/4 |

> **成本控制建议：** 日常编码用 Sonnet 4 即可；只在真正需要深度推理时才用 Opus 4。一个复杂任务用 Opus 可能花费 $1-5，同样的任务用 Sonnet 通常 $0.2-1。Batch API 提供 50% 折扣，适合非实时的批量任务。

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

### ⚠️ 风险与注意事项

| 风险 | 说明 | 建议 |
|------|------|------|
| **合并冲突** | 多个 agent 修改同一文件时必然冲突 | 尽量让各 worktree 修改不同文件；合并前先在 Plan Mode 中规划修改范围 |
| **`.gitignore` 同步** | 每个 worktree 共享主仓库的 `.gitignore`，但 `.claudeignore` 和 `.claude/settings.local.json` 需各自配置 | 在 CLAUDE.md 中记录这些配置需求，所有 worktree 共享同一份 |
| **依赖安装** | 各 worktree 的 `node_modules` 需独立安装 | 每个 worktree 启动后先让 Claude 运行 `npm install` |
| **同时修改同一文件** | 两个 agent 修改同一行的不同部分 → 合并时冲突 | 用 `git diff` 预判冲突区域，或让 Claude 先检查其他 worktree 的变更 |

> **关键原则：** 每个 agent 尽量只修改自己负责的文件集合，避免重叠。合并时务必人工审查冲突解决结果。

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

## 什么时候不该用 Claude Code

Claude Code 很强大，但它不是万能的。以下场景不适合或需要特别注意：

### 不适合的场景

| 场景 | 原因 | 替代方案 |
|------|------|----------|
| **精确到字符级别的修改** | AI 编辑难以做到像素级精确（如调整 CSS 像素值、JSON 中改一个字段名） | 手动编辑或用精准的 find-and-replace 工具 |
| **超大型仓库全量重构** | 上下文窗口有限，无法同时理解 10 万行代码 | 拆分为模块级小任务，每次只处理一个模块 |
| **涉及真实生产数据** | 安全风险——代码和对话会发送到 Anthropic API | 使用测试数据或 mock 数据，或在 deny 规则中禁止访问生产数据文件 |
| **需要 100% 确定性的操作** | AI 有概率产生幻觉或遗漏 | 关键操作人工复核，不要 Auto-Accept |
| **频繁的细碎格式调整** | 每次 Claude 调整格式都消耗 API token，成本不划算 | 用 linter/formatter（Prettier、ESLint）自动处理 |

### 需要特别注意的场景

- **合并多 agent 并行结果时**：多个 Claude 实例修改同一文件会导致冲突，必须人工审核合并
- **数据库 schema 变更**：Claude 可能生成不安全的 SQL（如缺少 WHERE 的 DELETE），务必审查
- **依赖版本升级**：Claude 可能选择不兼容的版本，升级后需人工跑完整测试
- **安全相关代码**：认证、加密、权限逻辑必须人工审查，AI 容易遗漏边界情况

### 合理的期望

- Claude Code 是**辅助工具**，不是替代开发者——你需要审查和验证它的输出
- 简单任务（格式化、加注释、小 bug 修复）成功率接近 100%
- 复杂任务（跨多文件重构、架构设计）成功率约 70-80%，需要人工兜底
- 把它当作"一个速度很快但偶尔犯错的同事"

---

## 常见问题

### Q: 安装后 `claude` 命令找不到？

确认 Node.js 18+ 已安装，全局 npm 包路径正确。可能需要重启终端或重新加载 shell 配置。

**排查步骤：**
1. 运行 `node -v` 确认 Node.js 版本 ≥ 18
2. 运行 `npm config get prefix` 查看全局安装路径
3. 确认该路径在你的 `PATH` 环境变量中
4. Windows 用户可能需要重启终端或手动添加 npm 全局路径到 PATH

### Q: 认证失败？

运行 `/doctor` 检查认证状态。如果是 API Key 方式，确认 `ANTHROPIC_API_KEY` 环境变量设置正确。

### Q: Claude Code 编辑文件时需要我确认？

这是权限模型的正常行为。你可以在 `.claude/settings.json` 中将 `Edit` 加入 `allow` 列表来自动允许文件编辑。

### Q: 会话变得很慢或很贵？

使用 `/compact` 压缩历史，或 `/clear` 清除后重新开始。用 `/cost` 查看 token 消耗情况。

**降低成本的技巧：**
- 日常任务用 Sonnet 4（默认模型），只在需要深度推理时才用 `--model opus`
- 复杂任务先用 Plan Mode 规划，避免 Claude 反复试错浪费 token
- 利用 CLAUDE.md 存储重复指令，不用每次重新描述

### Q: 如何在 CI/CD 中使用 Claude Code？

使用非交互模式 `claude -p "任务描述"`，配合 API Key 环境变量认证。详见[CI/CD 与自动化](#cicd-与自动化)章节。

### Q: /sandbox 在 Windows 上不支持？

沙盒模式目前仅支持 macOS、Linux 和 WSL2。Windows 原生环境无法使用。如果你在 Windows 上，可以安装 WSL2 来获得沙盒支持。

### Q: /memory 打开的编辑器不是我想要的？

`/memory` 默认使用系统编辑器。设置 `$EDITOR` 或 `$VISUAL` 环境变量来指定你喜欢的编辑器，例如：

```bash
export EDITOR="code"    # VS Code
export EDITOR="vim"     # Vim
```

### Q: 连接 Anthropic API 失败（ECONNREFUSED / 超时）？

常见原因：
- **网络代理未配置**：如果你使用代理，需要设置 `HTTP_PROXY` / `HTTPS_PROXY` 环境变量
- **防火墙拦截**：确认 `api.anthropic.com` 的 443 端口未被拦截
- **DNS 问题**：尝试 `curl -I https://api.anthropic.com` 测试连通性

```bash
# 设置代理示例
export HTTPS_PROXY="http://your-proxy:port"
claude
```

### Q: 上下文窗口溢出（对话太长导致质量下降）？

当对话历史超过模型的上下文窗口时，Claude Code 会自动压缩历史，但可能丢失细节。

**预防措施：**
- 定期 `/compact` 压缩历史
- 超过 30 分钟的复杂会话，建议拆分为多个短会话
- 用 CLAUDE.md 存储关键上下文，而不是依赖对话历史
- 使用 spec→plan→tasks 工作流，把中间结果落地为文件

### Q: npm 全局安装权限不足？

Linux/macOS 上可能遇到权限问题：

```bash
# 方案一：修改 npm 全局路径（推荐）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# 方案二：使用 nvm/fnm 管理 Node.js 版本（推荐，避免权限问题）
nvm install 20
npm install -g @anthropic-ai/claude-code
```

### Q: Claude Code 修改了不该修改的文件？

- 在 `.claude/settings.json` 的 `deny` 列表中禁止访问特定路径和命令
- 使用 `.claudeignore` 文件排除不想让 Claude 读取的目录和文件（类似 `.gitignore` 格式）
- 敏感项目建议始终使用 Normal Mode，不要切换到 Auto-Accept

---

## 实战案例

### 案例 1：从零搭建项目（完整 walkthrough）

**背景：** 你要创建一个新的 Express + MongoDB 后端项目。

**第一步：启动 Claude Code**

```bash
cd ~/projects
mkdir my-app && cd my-app
git init
claude
```

**第二步：描述任务**

```
帮我搭建一个 Express + MongoDB 的后端项目，包含用户注册、登录和 CRUD 接口。用 TypeScript，项目结构按模块划分。
```

**Claude 的典型执行过程：**

```
▶ Claude 正在搜索项目结构...
  → 发现是空目录，没有现有代码

▶ Claude 正在制定计划...
  → 规划目录结构：src/routes, src/models, src/middleware, src/utils
  → 规划文件列表：app.ts, routes/user.ts, models/User.ts, middleware/auth.ts

▶ Claude 正在编辑文件...
  → 创建 package.json（请求确认 ✓）
  → 创建 tsconfig.json（请求确认 ✓）
  → 创建 src/app.ts（请求确认 ✓）
  → 创建 src/routes/user.ts（请求确认 ✓）
  → 创建 src/models/User.ts（请求确认 ✓）
  → 创建 src/middleware/auth.ts（请求确认 ✓）

▶ Claude 正在运行命令...
  → npm install express mongoose bcrypt jsonwebtoken（请求确认 ✓）
  → npm install -D typescript @types/express @types/mongoose（请求确认 ✓）

▶ 完成！项目结构如下：
  my-app/
  ├── package.json
  ├── tsconfig.json
  └── src/
      ├── app.ts           # Express 入口
      ├── routes/
      │   └── user.ts      # 用户路由（注册、登录、CRUD）
      ├── models/
      │   └── User.ts      # Mongoose 用户模型
      └── middleware/
      │   └── auth.ts      # JWT 认证中间件
```

**第三步：验证**

```
帮我运行一下，确认启动没问题
```

Claude 会运行 `npm run dev`，观察输出，如果报错会自动修复。

### 案例 2：调试遗留代码（完整 walkthrough）

**背景：** auth 模块有 bug，用户登录后偶尔 500 错误。

**第一步：用 Plan Mode 先分析**

```
这个 auth 模块有 bug，用户登录后偶尔会 500 错误。先不要修改，帮我分析原因。
```

（按 Ctrl+P 进入 Plan Mode，让 Claude 只分析不修改）

**Claude 的典型分析过程：**

```
▶ Claude 正在读取文件...
  → 读取 src/auth/auth.ts（发现 42 行有类型推断问题）
  → 读取 src/auth/auth.test.ts（发现缺少 500 错误的测试覆盖）

▶ Claude 分析结果：
  1. 第 42 行的 try-catch 缺少对 Mongoose 连接超时的处理
  2. JWT verify 在 token 格式异常时抛出未捕获的 SyntaxError
  3. 缺少对 null 用户对象的防御性检查
  
  建议修复方案：
  - 在 catch 块中区分 Mongoose 超时和 JWT 错误
  - 用 jwt.verify 的回调形式替代同步调用
  - 添加 null 检查防护
```

**第二步：退出 Plan Mode，执行修复**

（按 Ctrl+P 退出 Plan Mode）

```
按上面的方案修复这三个问题
```

Claude 逐条修复，每次修改请求你确认。

**第三步：验证修复**

```
帮我运行 auth 模块的测试，确认修复没问题
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
claude -p "检查 PR #42 的代码变更，指出潜在的安全问题和性能风险" --model opus --output-format json
```

### 案例 6：spec→plan→tasks 结构化开发

```bash
# 你先写好 spec.md
cat > spec.md << 'EOF'
# 项目：博客系统 API
## 需求
- 文章 CRUD、评论系统、用户认证
- 支持 Markdown 渲染
## 约束
- Node.js + Express + SQLite
- 无外部认证服务
EOF

# 让 Claude 生成 plan.md
claude -p "读取 spec.md，生成 plan.md 实施计划"
# 审查 plan.md（建议在新会话中）

# 让 Claude 生成 tasks.md
claude -p "读取 plan.md，生成 tasks.md 任务清单"

# 逐条执行
claude
> 开始执行 tasks.md 中的任务 1-3：搭建项目结构和数据模型
```

---

## 参考资源

- [Anthropic 官方文档](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Code GitHub 仓库](https://github.com/anthropics/claude-code)
- [Claude Code 斜杠命令参考](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Claude Code 反馈与问题](https://github.com/anthropics/claude-code/issues)
- [知乎：Claude Code 使用教程](https://zhuanlan.zhihu.com/p/2009744974980331332)