# 斜杠命令

在会话中使用 `/` 前缀触发斜杠命令：

## 内置命令

| 命令 | 说明 |
|------|------|
| `/help` | 显示可用命令和使用帮助 |
| `/compact` | 压缩对话历史，释放上下文窗口空间 |
| `/clear` | 清除对话历史，重新开始 |
| `/cost` | 显示当前会话的 token 用量和费用 |
| `/doctor` | 检查 Claude Code 的安装和配置健康状态 |
| `/init` | 初始化项目，创建 CLAUDE.md 文件 |
| `/memory` | 打开编辑器编辑 CLAUDE.md 记忆文件 |
| `/config` | 打开或修改配置 |
| `/permissions` | 交互式管理权限（allow/deny 规则） |
| `/status` | 显示当前会话状态 |
| `/review` | AI 辅助代码审查（PR Review） |
| `/login` | 切换 Anthropic 账户 |
| `/logout` | 登出当前账户 |
| `/terminal-setup` | 配置终端集成（Shell、IDE） |
| `/vim` | 切换 Vim 输入模式 |
| `/model` | 在会话中切换 Claude 模型（opus/sonnet/haiku） |
| `/sandbox` | 切换沙盒模式（仅 macOS/Linux/WSL2） |
| `/fast` | 切换快速模式（同模型，输出更快） |
| `/loop` | 设置循环执行模式，定期重复任务 |

## /model 在会话中切换模型

在会话中不需要退出重启就可以切换模型：

```
/model opus     # 切换到 Opus（当前任务需要深度推理）
/model sonnet   # 切换回 Sonnet（日常编码）
/model haiku    # 切换到 Haiku（快速问答）
```

这在复杂任务中非常有用：先用 Opus 规划方案，再切回 Sonnet 执行细节。

## /fast 切换快速模式

快速模式使用同模型但输出更快，不会切换到更低级的模型。在会话中使用 `/fast` 即可切换。

适用场景：
- 简单的格式化、注释添加等不需要深度推理的任务
- 需要快速产出代码草稿后再人工微调

## /loop 循环执行模式

`/loop` 让 Claude Code 按设定间隔自动重复执行任务，适合需要持续监控或定期执行的场景。

### 基本用法

```
/loop 5m 检查构建是否完成
```

5 分钟后 Claude 自动执行"检查构建是否完成"，然后继续循环。

### 间隔格式

| 格式 | 说明 |
|------|------|
| `/loop 5m 任务` | 每 5 分钟执行一次 |
| `/loop 1h 任务` | 每 1 小时执行一次 |
| `/loop 任务` | 默认每 10 分钟执行一次 |

### 适用场景

| 场景 | 示例 |
|------|------|
| 监控构建状态 | `/loop 5m 检查 npm run build 是否完成` |
| 监控部署进度 | `/loop 3m 检查 gh run view 部署状态` |
| 持续审查 PR | `/loop 30m 审查新提交的代码变更` |
| 定期检查测试 | `/loop 10m 检查 CI 测试是否通过` |

::: warning 注意
- `/loop` 执行期间会持续消耗 API token，注意成本
- 用 Ctrl+C 可以终止循环
- 不适合一次性任务（用 `-p` 模式替代）
:::

## 自定义命令

除了内置命令，你还可以创建项目专属的自定义斜杠命令。

详见[自定义斜杠命令](/guide/custom-commands)。

## 编辑器配置

`/memory` 默认使用系统编辑器。设置 `$EDITOR` 或 `$VISUAL` 环境变量来指定你喜欢的编辑器：

```bash
export EDITOR="code"    # VS Code
export EDITOR="vim"     # Vim
```