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
---

<div class="home-section-title">核心亮点</div>

<div class="custom-features-grid">

<FeatureCard icon="🔄" title="Agentic Coding" details="不是单次问答，而是自主迭代循环 — 理解→规划→执行→观察→修正，直到任务完成" link="/claude-code-learn/advanced/agentic-coding.html" />

<FeatureCard icon="🛡️" title="三层权限模型" details="Allow / Deny / Ask，支持 glob 模式匹配，企业级管理员强制配置" link="/claude-code-learn/guide/permissions.html" />

<FeatureCard icon="📝" title="CLAUDE.md 持久记忆" details="三级放置（全局 / 项目 / 目录），让 Claude 跨会话保持项目上下文" link="/claude-code-learn/guide/claude-md.html" />

<FeatureCard icon="🧠" title="Vibe Coding 方法论" details="意图优于语法、迭代验证、人做守门员 — 体系化的 AI 辅助开发方法论" link="/claude-code-learn/vibe/what-is-vibe-coding.html" />

<FeatureCard icon="📋" title="可复用 SOP" details="项目搭建、调试排障、重构迁移、审查发布 — 四大场景标准化操作流程" link="/claude-code-learn/vibe/sop-scaffold.html" />

<FeatureCard icon="🧪" title="Prompt 配方库" details="20+ 即用 prompt 模板，覆盖搭建/调试/重构/审查/文档/测试/安全" link="/claude-code-learn/vibe/prompt-recipes.html" />

</div>

<div class="home-cta-section">
  <a class="home-cta-btn" href="/claude-code-learn/guide/learning-path.html">查看完整学习路径 →</a>
</div>

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