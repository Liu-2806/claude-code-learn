# 认证

有两种认证方式：

## 1. OAuth 登录（推荐）

通过 Anthropic Console 账户登录：

```bash
claude /login
```

浏览器会打开 Anthropic Console 登录页面，完成后自动认证。这是最安全的方式——token 自动管理，不会泄露到代码中。

## 2. API Key

设置环境变量：

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

::: warning 注意
绝不把 API Key 硬编码在任何文件中，包括 CLAUDE.md、配置文件、脚本。使用环境变量，并将 `.env` 加入 `.gitignore`。
:::

## 检查认证状态

运行 `/doctor` 检查认证状态和配置是否正常：

```bash
claude /doctor
```

## 切换账户

- `/login` — 切换 Anthropic 账户
- `/logout` — 登出当前账户