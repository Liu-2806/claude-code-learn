# 安全与合规

在企业或团队环境中使用 Claude Code，必须关注以下安全问题：

## API Key 泄露风险

- **绝不把 API Key 硬编码在任何文件中**，包括 CLAUDE.md、配置文件、脚本
- 使用环境变量 `ANTHROPIC_API_KEY`，并将 `.env` 加入 `.gitignore`
- OAuth 登录方式（`/login`）比 API Key 更安全——token 自动管理，不会泄露到代码中
- 在 CI/CD 中使用 GitHub Secrets 或环境变量注入，不要写入 workflow 文件

## 数据隐私

- Claude Code 会将你的代码和对话发送到 Anthropic API 进行处理
- Anthropic 的数据政策：API 调用的内容**默认不会用于模型训练**
- 但仍需注意：不要让 Claude 处理包含真实用户数据、密码、密钥的文件
- 生产数据库连接字符串、真实客户数据等应通过 deny 权限禁止 Claude 访问

## deny 权限最佳实践

以下命令建议始终设为 deny，防止 Claude 执行危险操作。完整配置示例见[权限管理与配置](/guide/permissions#安全建议)：

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

## MCP 服务器安全边界

- MCP 服务器扩展了 Claude 的能力，但也引入了新的安全边界——每个 MCP 服务器都可以让 Claude 访问新的数据源和执行新操作
- 仅安装你信任的 MCP 服务器，审查其代码和权限范围
- 不要将包含敏感凭据的 MCP 配置提交到 Git（使用 `.claude/settings.local.json` 存放本地配置，不提交）
- 团队共享的 MCP 配置（`.mcp.json`）中不应包含 `env` 中的 API Key 等敏感值

## 企业部署建议

| 推荐措施 | 说明 |
|----------|------|
| 企业级 deny 规则 | 在 `/etc/claude-code/settings.json` 强制禁止危险命令 |
| OAuth 认证 | 遣弃 API Key 方式，使用组织账户 OAuth 登录 |
| 代码审查 | 即使 Claude 自动编辑，仍需人工审查变更后再合并 |
| 敏感文件排除 | 在 `.claudeignore` 中排除含敏感数据的文件和目录 |