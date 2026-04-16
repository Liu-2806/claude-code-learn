<div align="center">

# Claude Code 中文教程

[![在线文档](https://img.shields.io/badge/在线文档-访问网站-E8713A?style=for-the-badge&logo=vitepress&logoColor=white)](https://liu-2806.github.io/claude-code-learn/)
[![GitHub](https://img.shields.io/badge/GitHub-查看源码-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Liu-2806/claude-code-learn)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-badge)](LICENSE)

**Anthropic 官方 CLI 工具的完整中文使用指南 + Vibe Coding 方法论 — 从入门到精通**


</div>

---

## ✨ 什么是 Claude Code？

Claude Code 是 Anthropic 推出的官方 CLI 工具，让 Claude 直接在你的终端中辅助编程。它采用 **Agentic Coding**（自主编码）模式——不是简单的单次问答生成，而是通过多步迭代循环自主完成任务。

```
理解需求 → 制定计划 → 执行操作 → 观察结果 → 修正迭代 → 直到完成
```

它能理解整个代码库、编辑文件、运行命令，并自主完成多步骤编码任务。

---

## 🚀 核心特性

| | 特性 | 说明 |
|---|------|------|
| 🔄 | **Agentic Coding** | 自主迭代循环，不是单次问答，而是闭环反馈 |
| 🛡️ | **三层权限模型** | Allow / Deny / Ask，支持 glob 模式匹配 |
| 📝 | **CLAUDE.md 持久记忆** | 三级放置（全局 / 项目 / 目录），跨会话保持上下文 |
| 🧠 | **Vibe Coding 方法论** | 意图优于语法、迭代验证、人做守门员 |
| 📋 | **可复用 SOP** | 项目搭建、调试排障、重构迁移、审查发布 |
| 🧪 | **Prompt 配方库** | 20+ 即用模板，覆盖搭建/调试/重构/审查/文档/测试 |

---

## 📖 在线文档

**完整教程已迁移到 VitePress 文档网站，阅读体验更佳：**

👉 **[https://liu-2806.github.io/claude-code-learn/](https://liu-2806.github.io/claude-code-learn/)**

### 文档结构

- **指南** — 5 分钟快速上手、安装认证、基本使用、三种操作模式、权限管理、安全合规...
- **Vibe Coding** — 方法论入门、核心原则、7 大反模式、四大 SOP、Prompt 配方库、决策日志...
- **进阶** — Agentic Coding 原理、Git Worktree 并行开发、spec→plan→tasks 工作流、多会话协作...
- **案例** — 从零搭建项目、调试遗留代码、代码审查重构、失败复盘与问题恢复...
- **FAQ** — 常见问题分类解答

---

## ⚡ 5 分钟快速上手

```bash
# 安装
npm install -g @anthropic-ai/claude-code

# 认证
claude /login

# 启动
cd your-project && claude
```

> 详细说明见[在线文档 - 快速上手](https://liu-2806.github.io/claude-code-learn/guide/quickstart)

---

## 🤝 贡献

欢迎提交 Issue 和 PR 来完善教程内容：

1. Fork 本仓库
2. 编辑 `docs/` 下的 Markdown 文件
3. 提交 PR

本地预览文档网站：

```bash
npm install
npm run docs:dev
```

---

## 📜 License

[MIT](LICENSE)