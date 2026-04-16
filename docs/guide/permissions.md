# 权限管理与配置

Claude Code 有三层权限模型：

| 层 | 说明 |
|------|------|
| **Allow** | 工具始终允许执行，无需确认 |
| **Deny** | 工具始终拒绝，无法使用 |
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

使用 `/permissions` 命令可以交互式管理权限规则。

## settings.json 完整配置项

除了权限，settings.json 还支持其他重要配置：

| 配置项 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| `permissions.allow` | string[] | 允许的工具/命令列表 | — |
| `permissions.deny` | string[] | 拒绝的工具/命令列表 | `[]` |
| `allowedTools` | string[] | 非交互模式下允许的工具 | — |
| `blockedTools` | string[] | 禁止使用的工具 | `[]` |
| `maxTurns` | number | Agentic loop 最大迭代次数 | `200` |
| `tokenLimit` | number | 单次响应最大输出 token 数 | 模型默认 |
| `model` | string | 默认使用的模型 | 最新 Sonnet |
| `theme` | string | UI 主题：dark / light / dark-daltonism / light-daltonism | `"dark"` |

### 工具名称参考

配置权限时需要知道工具的确切名称：

| 工具名 | 说明 |
|--------|------|
| `Bash` | 执行 shell 命令 |
| `Edit` | 编辑文件（替换/插入） |
| `Read` | 读取文件 |
| `Write` | 创建/写入文件 |
| `WebSearch` | 网络搜索 |
| `WebFetch` | 获取网页内容 |
| `Glob` | 文件模式匹配搜索 |
| `Grep` | 文件内容搜索 |

::: tip maxTurns 是什么？
`maxTurns` 控制 Claude 在单次任务中最多迭代多少轮。默认 200 足够大多数任务。如果 Claude 在简单任务上反复循环不退出，可以降低 `maxTurns`（如设为 50）来强制终止。
:::

### 完整配置示例

```json
{
  "permissions": {
    "allow": ["Bash(git:*)", "Bash(npm test:*)", "Read", "Edit"],
    "deny": ["Bash(rm -rf:*)", "Bash(sudo:*)", "Bash(dropdb:*)"]
  },
  "allowedTools": ["Read", "Edit", "Bash", "Glob", "Grep"],
  "blockedTools": [],
  "maxTurns": 200,
  "tokenLimit": 16384,
  "theme": "dark",
  "model": "claude-sonnet-4-6"
}
```

## 设置文件层级

设置文件按优先级合并（高优先级覆盖低优先级）：

1. **企业级** `/etc/claude-code/settings.json` — 管理员强制配置
2. **用户级** `~/.claude/settings.json` — 个人全局配置
3. **项目级（共享）** `.claude/settings.json` — 团队共享配置，可提交 Git
4. **项目级（本地）** `.claude/settings.local.json` — 个人本地配置，**不提交 Git**

对于 deny 权限，企业级设置始终优先。

### settings.json vs settings.local.json

| 文件 | 是否提交 Git | 适合存放 | 不适合存放 |
|------|-------------|---------|-----------|
| `.claude/settings.json` | 可以 | 团队共享的权限规则、allowedTools | API Key、个人偏好 |
| `.claude/settings.local.json` | 不可以（加入 .gitignore） | API Key、个人本地权限、MCP 凭据 | 团队共享规则 |

**关键区别：** `settings.local.json` 的优先级高于 `settings.json`。你可以把团队共享规则放在 `settings.json`（提交 Git），把个人 API Key 和本地覆盖放在 `settings.local.json`（不提交）。两者内容格式相同。

```bash
# 确保 settings.local.json 不被提交
echo ".claude/settings.local.json" >> .gitignore
```

::: warning 安全建议
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

详见[安全与合规](/guide/security)章节。
:::
