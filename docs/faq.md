# 常见问题

## 安装与认证

### 安装后 `claude` 命令找不到？

确认 Node.js 18+ 已安装，全局 npm 包路径正确。可能需要重启终端或重新加载 shell 配置。

**排查步骤：**
1. 运行 `node -v` 确认 Node.js 版本 ≥ 18
2. 运行 `npm config get prefix` 查看全局安装路径
3. 确认该路径在你的 `PATH` 环境变量中
4. Windows 用户可能需要重启终端或手动添加 npm 全局路径到 PATH

### 认证失败？

运行 `/doctor` 检查认证状态。如果是 API Key 方式，确认 `ANTHROPIC_API_KEY` 环境变量设置正确。

### /sandbox 在 Windows 上不支持？

沙盒模式目前仅支持 macOS、Linux 和 WSL2。Windows 原生环境无法使用。如果你在 Windows 上，可以安装 WSL2 来获得沙盒支持。详见[安装 - Windows 专项指引](/guide/installation#windows-用户专项指引)。

### 连接 Anthropic API 失败（ECONNREFUSED / 超时）？

常见原因：
- **网络代理未配置**：如果你使用代理，需要设置 `HTTP_PROXY` / `HTTPS_PROXY` 环境变量
- **防火墙拦截**：确认 `api.anthropic.com` 的 443 端口未被拦截
- **DNS 问题**：尝试 `curl -I https://api.anthropic.com` 测试连通性

```bash
# 设置代理示例
export HTTPS_PROXY="http://your-proxy:port"
claude
```

## 使用与成本

### Claude Code 编辑文件时需要我确认？

这是权限模型的正常行为。你可以在 `.claude/settings.json` 中将 `Edit` 加入 `allow` 列表来自动允许文件编辑。详见[权限管理](/guide/permissions)。

### 会话变得很慢或很贵？

使用 `/compact` 压缩历史，或 `/clear` 清除后重新开始。用 `/cost` 查看 token 消耗情况。

**降低成本的技巧：**
- 日常任务用 Sonnet 4.6（默认模型），只在需要深度推理时才用 `--model opus`
- 复杂任务先用 Plan Mode 规划，避免 Claude 反复试错浪费 token
- 利用 CLAUDE.md 存储重复指令，不用每次重新描述
- 利用 Prompt Caching，保持 CLAUDE.md 稳定以提高缓存命中率（详见[上下文管理与性能调优](/guide/context-management#prompt-caching)）

### 上下文窗口溢出（对话太长导致质量下降）？

当对话历史超过模型的上下文窗口时，Claude Code 会自动压缩历史，但可能丢失细节。

**预防措施：**
- 定期 `/compact` 压缩历史
- 超过 30 分钟的复杂会话，建议拆分为多个短会话
- 用 CLAUDE.md 存储关键上下文，而不是依赖对话历史
- 使用 spec→plan→tasks 工作流，把中间结果落地为文件

### 如何恢复之前的会话？

- `claude --continue` — 继续最近一次会话，不用重新描述上下文
- `claude --resume <session-id>` — 恢复指定会话（需要知道 session ID）
- `claude --continue --print` — 继续上次会话 + headless 输出到 stdout

::: tip 使用场景
你在交互会话中调试了 bug，确认方向后想用 CI 自动跑完。用 `--continue --print --output-format json` 让 Claude 在非交互模式下继续完成测试和提交。
:::

### /memory 打开的编辑器不是我想要的？

`/memory` 默认使用系统编辑器。设置 `$EDITOR` 或 `$VISUAL` 环境变量来指定你喜欢的编辑器，例如：

```bash
export EDITOR="code"    # VS Code
export EDITOR="vim"     # Vim
```

### 如何在会话中切换模型？

使用 `/model` 命令：

```
/model opus     # 切换到 Opus（深度推理）
/model sonnet   # 切换回 Sonnet（日常编码）
```

不需要退出重启。

### Claude 总是在重复做同一件事？

这是 Agentic loop 卡住了。解决方案：
- 降低 `maxTurns`（在 settings.json 中设为 50 或更低）
- 用 `/compact` 压缩历史，减少重复信息的回响
- 在 prompt 中明确说"只执行一次，不要反复尝试"
- 用 `--verbose` 查看它每次迭代做了什么，找到卡住的原因

详见[失败复盘 - Claude 反复循环不退出](/examples/failure-recovery#场景-1-claude-反复循环不退出)。

## 安全与权限

### Claude Code 修改了不该修改的文件？

- 在 `.claude/settings.json` 的 `deny` 列表中禁止访问特定路径和命令
- 使用 `.claudeignore` 文件排除不想让 Claude 读取的目录和文件（类似 `.gitignore` 格式）
- 敏感项目建议始终使用 Normal Mode，不要切换到 Auto-Accept

详见[安全与合规](/guide/security)和[权限管理](/guide/permissions)章节。

## 网络与连接

### 连接 Anthropic API 失败？

见上方"连接 Anthropic API 失败"部分。最常见原因是网络代理未配置或防火墙拦截。

## 其他

### 如何在 CI/CD 中使用 Claude Code？

使用非交互模式 `claude -p "任务描述"`，配合 API Key 环境变量认证。详见[CI/CD 与自动化](/guide/cicd)章节。

### 如何创建自定义斜杠命令？

在 `.claude/commands/` 目录创建 `.md` 文件即可。详见[自定义斜杠命令](/guide/custom-commands)。