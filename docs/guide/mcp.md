# MCP 服务器集成

MCP（Model Context Protocol）允许 Claude Code 连接外部工具和数据源，扩展其能力。可以把 MCP 理解为 Claude Code 的"插件系统"——接入什么服务器，Claude 就能做什么新操作。

## 配置位置

可在三个位置配置 MCP 服务器：

| 位置 | 作用范围 | 是否可提交 Git |
|------|----------|---------------|
| `~/.claude/settings.json` | 全局（所有项目） | 否 |
| `.claude/settings.json` | 项目级 | 可以，但注意敏感值 |
| `.mcp.json`（项目根目录） | 项目级 | 可以，推荐团队共享用这个 |

## 配置格式

```json
{
  "mcpServers": {
    "server-name": {
      "command": "执行命令",
      "args": ["参数1", "参数2"],
      "env": {
        "ENV_VAR": "值"
      }
    }
  }
}
```

| 字段 | 说明 |
|------|------|
| `command` | 启动 MCP 服务器的命令（如 `npx`、`python3`、`node`） |
| `args` | 命令参数（如包名、脚本路径） |
| `env` | 环境变量（API Key 等敏感值放这里，不要写明文提交 Git） |

## 常见 MCP 服务器

| 服务器 | 功能 | 配置示例 |
|--------|------|----------|
| **GitHub** | 搜索仓库、管理 Issue/PR、读取代码 | `command: "npx", args: ["-y", "@modelcontextprotocol/server-github"]` |
| **PostgreSQL** | 查询数据库、执行 SQL | `command: "npx", args: ["-y", "@modelcontextprotocol/server-postgres"]` |
| **Filesystem** | 安全的文件读写（受限路径） | `command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem", "/path"]` |
| **Slack** | 搜索消息、发送通知 | `command: "npx", args: ["-y", "@modelcontextprotocol/server-slack"]` |
| **Puppeteer** | 浏览器自动化、网页截图 | `command: "npx", args: ["-y", "@modelcontextprotocol/server-puppeteer"]` |
| **Memory** | 持久化知识图谱 | `command: "npx", args: ["-y", "@modelcontextprotocol/server-memory"]` |

## 完整配置示例

**`.mcp.json`（项目级，团队共享）：**

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost:5432/mydb"]
    }
  }
}
```

::: tip 敏感值处理
在 `.mcp.json` 中用 `${ENV_VAR}` 引用环境变量，不要写明文。这样文件可以安全提交 Git，各开发者本地设置自己的环境变量值。
:::

**`.claude/settings.local.json`（本地配置，不提交 Git）：**

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxx实际值xxxxx"
      }
    }
  }
}
```

实际 API Key 只放在 `.claude/settings.local.json` 中（被 `.gitignore` 排除）。

::: warning 安全边界
- 仅安装你信任的 MCP 服务器，审查其代码和权限范围
- 不要将包含明文敏感凭据的 MCP 配置提交到 Git
- 每个 MCP 服务器都扩展了 Claude 的能力边界——接入越多服务器，Claude 能做的事越多，但也引入更多安全风险

详见[安全与合规](/guide/security)章节。
:::