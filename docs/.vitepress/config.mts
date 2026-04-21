import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Claude Code 中文教程',
  description: 'Anthropic 官方 CLI 工具的完整中文使用指南',
  base: '/claude-code-learn/',
  appearance: true,
  head: [
    ['meta', { name: 'og:title', content: 'Claude Code 中文教程' }],
    ['meta', { name: 'og:description', content: 'Anthropic 官方 CLI 工具的完整中文使用指南' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Claude Code 中文教程' }],
    ['meta', { name: 'twitter:description', content: 'Anthropic 官方 CLI 工具的完整中文使用指南' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/claude-code-learn/badges.svg' }],
    ['meta', { name: 'theme-color', content: '#E8713A' }],
  ],

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/quickstart', activeMatch: '/guide/' },
      { text: 'Vibe Coding', link: '/vibe/what-is-vibe-coding', activeMatch: '/vibe/' },
      { text: '进阶', link: '/advanced/agentic-coding', activeMatch: '/advanced/' },
      { text: '案例', link: '/examples/scaffold-project', activeMatch: '/examples/' },
      { text: '常见问题', link: '/faq' },
      {
        text: '更多',
        items: [
          { text: '参考资源', link: '/resources' },
          { text: 'GitHub', link: 'https://github.com/Liu-2806/claude-code-learn' },
          { text: 'Anthropic 官方文档', link: 'https://docs.anthropic.com/en/docs/claude-code' },
        ]
      }
    ],

    sidebar: {
      '/vibe/': [
        {
          text: '入门',
          collapsed: false,
          items: [
            { text: '什么是 Vibe Coding', link: '/vibe/what-is-vibe-coding' },
            { text: '思维转变', link: '/vibe/mindset-shift' },
            { text: '核心原则', link: '/vibe/core-principles' },
          ]
        },
        {
          text: '反模式与陷阱',
          collapsed: false,
          items: [
            { text: '7 大反模式与对策', link: '/vibe/anti-patterns' },
          ]
        },
        {
          text: 'SOP 标准操作流程',
          collapsed: false,
          items: [
            { text: '项目搭建 SOP', link: '/vibe/sop-scaffold' },
            { text: '调试排障 SOP', link: '/vibe/sop-debug' },
            { text: '重构迁移 SOP', link: '/vibe/sop-refactor' },
            { text: '审查发布 SOP', link: '/vibe/sop-review' },
          ]
        },
        {
          text: '实操工具箱',
          collapsed: false,
          items: [
            { text: 'Prompt 配方库', link: '/vibe/prompt-recipes' },
            { text: '决策日志', link: '/vibe/decision-log' },
          ]
        },
        {
          text: '高级技巧',
          collapsed: false,
          items: [
            { text: '多 Agent 协作 / TDD 融合 / 大仓库策略', link: '/vibe/advanced-techniques' },
          ]
        },
      ],
      '/guide/': [
        {
          text: '开始',
          collapsed: false,
          items: [
            { text: '学习路径', link: '/guide/learning-path' },
            { text: '5 分钟快速上手', link: '/guide/quickstart' },
            { text: '安装', link: '/guide/installation' },
            { text: '认证', link: '/guide/authentication' },
            { text: '基本使用', link: '/guide/basic-usage' },
          ]
        },
        {
          text: '核心概念',
          collapsed: false,
          items: [
            { text: '三种操作模式', link: '/guide/modes' },
            { text: '斜杠命令', link: '/guide/slash-commands' },
            { text: 'CLAUDE.md 与 MEMORY.md', link: '/guide/claude-md' },
            { text: 'Skills 技能系统', link: '/guide/skills' },
            { text: '自定义斜杠命令', link: '/guide/custom-commands' },
            { text: '权限管理与配置', link: '/guide/permissions' },
          ]
        },
        {
          text: '高效使用',
          collapsed: false,
          items: [
            { text: 'Prompt 工程与技巧', link: '/guide/prompt-engineering' },
            { text: '上下文管理与性能调优', link: '/guide/context-management' },
          ]
        },
        {
          text: '扩展能力',
          collapsed: false,
          items: [
            { text: 'Hooks 钩子', link: '/guide/hooks' },
            { text: 'MCP 服务器集成', link: '/guide/mcp' },
            { text: 'IDE 集成', link: '/guide/ide-integration' },
            { text: 'CI/CD 与自动化', link: '/guide/cicd' },
          ]
        },
        {
          text: '安全与选型',
          collapsed: false,
          items: [
            { text: '安全与合规', link: '/guide/security' },
            { text: '模型选择与定价', link: '/guide/model-selection' },
            { text: 'Claude Code vs 其他工具', link: '/guide/comparison' },
          ]
        },
      ],
      '/advanced/': [
        {
          text: '进阶用法',
          collapsed: false,
          items: [
            { text: 'Agentic Coding 工作原理', link: '/advanced/agentic-coding' },
            { text: 'Git Worktree 并行开发', link: '/advanced/git-worktree' },
            { text: 'spec → plan → tasks 工作流', link: '/advanced/spec-plan-tasks' },
            { text: '多会话协作策略', link: '/advanced/multi-session' },
            { text: '什么时候不该用', link: '/advanced/when-not-to-use' },
          ]
        },
      ],
      '/faq': [
        {
          text: '常见问题',
          collapsed: false,
          items: [
            { text: '常见问题', link: '/faq' },
          ]
        },
      ],
      '/resources': [
        {
          text: '参考资源',
          collapsed: false,
          items: [
            { text: '参考资源', link: '/resources' },
          ]
        },
      ],
      '/examples/': [
        {
          text: '实战案例',
          collapsed: false,
          items: [
            { text: '从零搭建项目', link: '/examples/scaffold-project' },
            { text: '调试遗留代码', link: '/examples/debug-legacy' },
            { text: '代码审查与重构', link: '/examples/code-review' },
            { text: '并行开发多个功能', link: '/examples/parallel-dev' },
            { text: 'CI/CD 自动化', link: '/examples/cicd-auto' },
            { text: 'spec→plan→tasks 实战', link: '/examples/spec-workflow' },
            { text: '失败复盘与问题恢复', link: '/examples/failure-recovery' },
          ]
        },
      ],
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Liu-2806/claude-code-learn' },
    ],

    footer: {
      message: '基于 MIT 协议发布',
      copyright: '© 2025-present Claude Code 中文教程贡献者',
    },

    editLink: {
      pattern: 'https://github.com/Liu-2806/claude-code-learn/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    lastUpdated: {
      text: '最后更新于',
    },
  },
})