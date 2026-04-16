# Hooks 钩子

Hooks 允许你在 Claude Code 工作流的特定节点运行自定义 shell 命令——在工具调用前后、通知事件时、或 Claude 停止响应时触发自定义逻辑。

## 可用的 Hook 类型

| 类型 | 触发时机 | 典型用途 |
|------|----------|----------|
| `PreToolUse` | 工具执行**前** | 日志审计、权限检查、拦截危险操作 |
| `PostToolUse` | 工具执行**后** | 记录变更、触发后续流程、格式检查 |
| `Notification` | 通知事件时 | 发送 Slack/DingTalk 消息、写入日志 |
| `Stop` | Claude 停止响应时 | 通知任务完成、发送汇总报告 |

## 配置格式

在 `.claude/settings.json` 或 `.claude/settings.local.json` 中配置：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "audit-log.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'File edited' >> changelog.txt"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "notify-done.sh"
          }
        ]
      }
    ]
  }
}
```

### matcher 匹配规则

`matcher` 可选，用于过滤特定工具。不设 `matcher` 则对所有工具触发。

| matcher 值 | 匹配范围 |
|------------|----------|
| `"Bash"` | 只对 Bash 工具调用触发 |
| `"Edit"` | 只对文件编辑触发 |
| `"Write"` | 只对文件创建触发 |
| `"Read"` | 只对文件读取触发 |
| 不设 matcher | 对所有工具调用触发 |

## Hook 返回值对 Claude 行为的影响

Hook 命令的退出码（exit code）会影响 Claude Code 的后续行为：

| 退出码 | 效果 |
|--------|------|
| **0** | 正常通过，Claude 继续执行 |
| **2** | **阻止**当前工具调用（PreToolUse 专用），Claude 会收到阻止信息并调整方案 |

这意味着你可以用 PreToolUse hook 实现动态权限控制——当命令返回退出码 2 时，Claude 的工具调用会被拦截。

### 动态拦截示例

**拦截对生产环境的请求：**

```bash
#!/bin/bash
# pre-tool-use-guard.sh — 拦截对生产环境的 curl 命令

# 从 stdin 读取工具调用的 JSON 输入
INPUT=$(cat)

# 检查是否包含生产环境 URL
if echo "$INPUT" | grep -q "production.example.com"; then
  echo "阻止：不允许访问生产环境 URL"
  exit 2
fi

exit 0
```

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "pre-tool-use-guard.sh"
          }
        ]
      }
    ]
  }
}
```

## 实战示例

### 示例 1：每次编辑后自动跑 lint

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix $(echo $CLAUDE_FILE_PATH)"
          }
        ]
      }
    ]
  }
}
```

### 示例 2：任务完成时发 Slack 通知

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST -H 'Content-type: application/json' --data '{\"text\":\"Claude Code 任务已完成\"}' $SLACK_WEBHOOK_URL"
          }
        ]
      }
    ]
  }
}
```

### 示例 3：审计日志

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date)] Tool: $CLAUDE_TOOL_NAME\" >> audit.log"
          }
        ]
      }
    ]
  }
}
```

::: tip 最佳实践
- Hook 命令应该**快速完成**——慢命令会阻塞 Claude 的工作流
- 不要在 hook 中执行交互式命令（需要用户输入的命令）
- PreToolUse hook 可以用退出码 2 实现动态权限拦截
- 将复杂的 hook 逻辑写成独立脚本文件，而不是 inline 命令
- Hook 中的环境变量（如 `$CLAUDE_TOOL_NAME`）提供工具调用的上下文信息
:::