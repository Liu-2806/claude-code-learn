# 5 分钟快速上手

如果你是第一次使用 Claude Code，跟着这三步走，5 分钟内就能体验到 AI 辅助编程：

## 安装

```bash
npm install -g @anthropic-ai/claude-code
```

## 认证

```bash
claude /login        # 用浏览器登录 Anthropic 账户（推荐）
```

或者使用 API Key：

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

## 启动

```bash
cd your-project
claude
```

启动后你会看到 Claude Code 的交互界面，直接输入你的需求即可：

```
> 帮我在 src/utils.ts 里加一个 formatDate 函数，把 ISO 时间字符串转成 "YYYY-MM-DD" 格式
```

Claude Code 会自动：读取文件 → 理解现有代码 → 编辑文件 → 展示修改结果。每一步修改前都会询问你是否同意（Normal Mode 默认行为）。

按 `Ctrl+C` 退出会话。

::: tip 恭喜！你已经成功使用了 Claude Code。
接下来可以继续阅读完整教程，了解更多高级用法。
:::

## 下一步

- [安装详细说明](/guide/installation) — 包含 Windows 专项指引
- [基本使用](/guide/basic-usage) — 启动参数和常用操作
- [三种操作模式](/guide/modes) — Normal / Auto-Accept / Plan 模式详解
- [CLAUDE.md 项目记忆](/guide/claude-md) — 让 Claude 跨会话保持上下文