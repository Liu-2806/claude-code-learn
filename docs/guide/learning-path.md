# 学习路径

如果你是第一次接触 Claude Code，以下路径帮你从零开始循序渐进。

## 新手路径（第 1 天）

按以下顺序阅读，约 1 小时即可上手：

1. **[5 分钟快速上手](/guide/quickstart)** — 安装、认证、启动，立即体验
2. **[三种操作模式](/guide/modes)** — 了解 Normal / Auto-Accept / Plan 模式
3. **[基本使用](/guide/basic-usage)** — @file 引用、常用参数、Git 集成
4. **[CLAUDE.md 与 MEMORY.md](/guide/claude-md)** — 让 Claude 跨会话保持上下文

读完这 4 页，你就可以日常使用 Claude Code 了。

## 进阶路径（第 2-3 天）

当你熟悉基本操作后，深入学习核心机制：

5. **[Prompt 工程与技巧](/guide/prompt-engineering)** — 写好 prompt 的 8 个关键技巧
6. **[权限管理与配置](/guide/permissions)** — Allow/Deny/Ask 三层权限、settings.json 配置
7. **[斜杠命令](/guide/slash-commands)** — 内置命令速查，含 /loop 和 /fast
8. **[Agentic Coding 工作原理](/advanced/agentic-coding)** — 理解自主迭代循环和自愈机制

## 高效路径（第 4-5 天）

优化你的工作流：

9. **[上下文管理与性能调优](/guide/context-management)** — Prompt Caching、.claudeignore、/compact
10. **[spec → plan → tasks 工作流](/advanced/spec-plan-tasks)** — 文档驱动，减少幻觉
11. **[多会话协作策略](/advanced/multi-session)** — 规划→审查→执行三会话模式
12. **[Skills 技能系统](/guide/skills)** — 条件触发的最佳实践指南

## 扩展路径（按需阅读）

根据你的需求选读：

| 你的需求 | 推荐阅读 |
|---------|----------|
| **Git Worktree 并行开发** | [Git Worktree 并行开发](/advanced/git-worktree) |
| **CI/CD 自动化** | [CI/CD 与自动化](/guide/cicd) |
| **MCP 外部集成** | [MCP 服务器集成](/guide/mcp) |
| **Hooks 自定义钩子** | [Hooks 钩子](/guide/hooks) |
| **IDE 集成** | [IDE 集成](/guide/ide-integration) |
| **对比其他工具** | [Claude Code vs 其他 AI 编码工具](/guide/comparison) |
| **安全合规** | [安全与合规](/guide/security) |
| **成本控制** | [模型选择与定价](/guide/model-selection) |
| **自定义命令** | [自定义斜杠命令](/guide/custom-commands) |

## Vibe Coding 方法论路径

**如果你不仅想学会工具，还想掌握方法论——** 以下路径帮你体系化提升 AI 辅助开发能力：

| 阶段 | 内容 | 预计时间 |
|------|------|---------|
| **认知篇** | [什么是 Vibe Coding](/vibe/what-is-vibe-coding) + [思维转变](/vibe/mindset-shift) + [核心原则](/vibe/core-principles) | 30 分钟 |
| **避坑篇** | [7 大反模式与对策](/vibe/anti-patterns) | 20 分钟 |
| **实操篇** | [项目搭建 SOP](/vibe/sop-scaffold) + [调试排障 SOP](/vibe/sop-debug) + [重构迁移 SOP](/vibe/sop-refactor) + [审查发布 SOP](/vibe/sop-review) | 40 分钟 |
| **工具箱** | [Prompt 配方库](/vibe/prompt-recipes) + [决策日志](/vibe/decision-log) | 按需查阅 |
| **进阶篇** | [多 Agent 协作 / TDD 融合 / 大仓库策略](/vibe/advanced-techniques) | 20 分钟 |

**建议顺序：** 先学工具使用（指南板块），再学方法论（Vibe Coding 板块）。两者互补——工具是引擎，方法论是方向盘。

## 实战案例

理论学完后，通过案例加深理解：

| 案例 | 适合阶段 |
|------|----------|
| [从零搭建项目](/examples/scaffold-project) | 新手入门 |
| [调试遗留代码](/examples/debug-legacy) | 新手入门 |
| [代码审查与重构](/examples/code-review) | 进阶 |
| [并行开发多个功能](/examples/parallel-dev) | 进阶 |
| [spec→plan→tasks 实战](/examples/spec-workflow) | 进阶 |
| [CI/CD 自动化](/examples/cicd-auto) | 高效 |
| [失败复盘与问题恢复](/examples/failure-recovery) | 所有阶段（强烈推荐） |

## 什么时候不该用？

无论你多熟练，都需要了解 Claude Code 的边界：

👉 [什么时候不该用 Claude Code](/advanced/when-not-to-use)