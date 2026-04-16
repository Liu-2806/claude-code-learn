---
layout: home

hero:
  name: "Claude Code"
  text: "中文使用教程"
  tagline: Anthropic 官方 CLI 工具的完整中文指南 — 从入门到精通
  actions:
    - theme: brand
      text: 5 分钟快速上手
      link: /guide/quickstart
    - theme: alt
      text: GitHub
      link: https://github.com/Liu-2806/claude-code-learn

features:
  - icon: 🔄
    title: Agentic Coding
    details: 不是单次问答，而是自主迭代循环 — 理解→规划→执行→观察→修正，直到任务完成
  - icon: 🛡️
    title: 三层权限模型
    details: Allow / Deny / Ask，支持 glob 模式匹配，企业级管理员强制配置
  - icon: 📝
    title: CLAUDE.md 持久记忆
    details: 三级放置（全局 / 项目 / 目录），让 Claude 跨会话保持项目上下文
  - icon: 🌳
    title: Git Worktree 并行开发
    details: 多个 Claude 实例同时在不同分支上工作，物理隔离无需 stash
  - icon: 📋
    title: spec→plan→tasks 工作流
    details: 文档驱动而非凭记忆，减少幻觉，跨会话延续，可追溯
  - icon: 🔗
    title: MCP 服务器集成
    details: 连接外部工具和数据源，数据库、Slack、GitHub API 等
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #E8713A 10%, #F09060 50%, #FCC8A8 100%);
  --vp-home-hero-image-background-image: linear-gradient(135deg, rgba(232,113,58,0.1) 10%, rgba(240,144,96,0.05) 50%, rgba(252,200,168,0.02) 100%);
  --vp-home-hero-image-filter: blur(44px);
}
.dark {
  --vp-home-hero-image-background-image: linear-gradient(135deg, rgba(232,113,58,0.2) 10%, rgba(240,144,96,0.08) 50%, rgba(252,200,168,0.04) 100%);
}
</style>