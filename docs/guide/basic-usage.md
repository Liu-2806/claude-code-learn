# 基本使用

进入你的项目目录，启动 Claude Code：

```bash
cd your-project
claude
```

启动后你可以直接用自然语言描述任务，例如：

```
帮我重构 auth 模块，把 session token 的存储方式改成 JWT
```

```
这个文件里有个 bug，第 42 行的类型推断有问题，帮我修一下
```

```
给这个 API 端点加上输入验证，用 Zod schema
```

Claude Code 会自主完成：搜索代码、理解上下文、编辑文件、运行测试、提交代码等多步骤操作。

## @file 引用语法

在对话中可以用 `@文件名` 让 Claude 自动读取文件，不用手动粘贴代码：

```
帮我看看 @src/auth/login.ts 的逻辑有没有问题
```

```
对比 @src/api/old.ts 和 @src/api/new.ts，找出差异
```

支持 glob 模式引用多个文件：

```
检查 @src/**/*.test.ts 里是否有缺失的测试用例
```

::: tip 为什么要用 @file？
粘贴代码到对话中浪费上下文窗口。`@file` 让 Claude 只在需要时读取文件内容，更高效。大段代码尤其应该用 `@file` 引用而非粘贴。
:::

## 常用启动参数

### 交互模式参数

| 参数 | 说明 |
|------|------|
| `claude --resume <session-id>` | 恢复指定会话（按 ID） |
| `claude --continue` | 继续最近一次会话 |
| `claude --model opus` | 指定使用的模型（见[模型选择与定价](/guide/model-selection)） |
| `claude --fast` | 使用快速模式（同模型，更快输出） |
| `claude --verbose` | 开启详细日志，查看 Claude 的内部决策过程 |
| `claude --sandbox` | 沙盒模式，限制文件写入和命令执行（仅 macOS/Linux/WSL2） |

### 非交互 / Headless 模式参数

| 参数 | 说明 |
|------|------|
| `claude -p "任务描述"` | 非交互模式，执行完直接退出 |
| `claude -p "任务" --output-format json` | 输出 JSON 格式，适合程序解析 |
| `claude -p "任务" --output-format stream-json` | 流式 JSON 输出，适合实时处理 |
| `claude -p "任务" --allowedTools Read,Edit,Bash` | 限制可用工具，控制权限边界 |
| `claude --continue --print` | 继续上次会话 + headless 输出 |
| `claude --resume <id> --print` | 恢复指定会话 + headless 输出 |

::: tip --print 是什么？
`--print`（也叫 headless 模式）让 Claude Code 把结果输出到 stdout 而不启动交互界面，适合脚本和 CI/CD 流程中使用。可以和 `--continue` 或 `--resume` 组合使用。
:::

### 会话内切换模型

在会话中使用 `/model` 命令可以切换模型，不用重启。详见[斜杠命令 - /model](/guide/slash-commands#model-在会话中切换模型)。

## Git 集成

Claude Code 能自主执行 Git 操作——前提是你授权了 `Bash(git:*)` 权限。

### 自主提交 Commit

```
帮我修复这个 bug，完成后提交 commit。commit message 用中文，格式：fix: 简短描述。
```

Claude 会自动：
1. 编辑代码修复 bug
2. 运行测试验证修复
3. 执行 `git add` 添加变更文件
4. 执行 `git commit -m "fix: xxx"` 提交

### 创建 Pull Request

```
帮我创建一个 PR，把 feature-auth 分支合并到 main。PR 描述包含变更摘要和测试情况。
```

Claude 会使用 `gh pr create` 创建 PR，自动生成标题和描述。

### 常用 Git 操作

| 操作 | 示例 prompt |
|------|-------------|
| 提交 commit | "完成后提交 commit，格式用 conventional commits" |
| 查看 diff | "帮我看看最近的 git diff，总结变更内容" |
| 创建分支 | "创建 feature-xxx 分支，基于 main" |
| 创建 PR | "创建 PR，标题用英文，描述用中文" |
| 解决冲突 | "帮我解决 merge conflict，保留两边的修改" |
| 回滚变更 | "帮我 revert 最后一个 commit" |

::: tip 最佳实践
- 在 prompt 中**明确 commit message 格式**，否则 Claude 可能用你不喜欢的格式
- 让 Claude 提交前**先跑测试**：`"修复这个 bug，跑测试确认没问题再 commit"`
- PR 描述让 Claude **自动总结变更**，比你自己写更快更准确
- 不要让 Claude 用 `--force` 推送，这是高风险操作
:::

## 环境变量

Claude Code 支持以下环境变量：

| 变量 | 说明 |
|------|------|
| `ANTHROPIC_API_KEY` | API Key 认证（替代 OAuth） |
| `HTTP_PROXY` / `HTTPS_PROXY` | 网络代理配置 |
| `CC_NO_PROMPT` | 设为 `1` 禁用交互提示（自动化必需） |
| `EDITOR` / `VISUAL` | `/memory` 命令使用的编辑器 |
| `DISABLE_PROMPT_COLORS` | 设为 `1` 禁用终端颜色输出 |

## 输出格式（--output-format）

非交互模式下的输出格式选项：

| 格式 | 说明 | 适用场景 |
|------|------|----------|
| `text` | 纯文本（默认） | 脚本简单处理 |
| `json` | JSON 对象，包含 result/message 字段 | 程序解析、CI/CD |
| `stream-json` | 流式 JSON，逐条输出 | 长任务实时处理 |
| `markdown` | Markdown 格式 | PR 评论、文档生成 |

## 会话管理

### 获取 Session ID

恢复会话需要 session ID。两种获取方式：

1. **在交互会话中用 `/status` 查看** — 会显示当前 session ID
2. **在非交互模式中** — JSON 输出会包含 session_id 字段

```bash
# 获取 JSON 输出中的 session ID
claude -p "简单任务" --output-format json | jq '.session_id'
```

### 会话恢复场景

| 场景 | 命令 |
|------|------|
| 继续刚才的会话 | `claude --continue` |
| 继续上次会话 + headless | `claude --continue --print` |
| 恢复指定会话 | `claude --resume <session-id>` |
| 恢复指定会话 + headless | `claude --resume <session-id> --print` |

::: tip 实用技巧
- `--continue` 不需要 session ID，它自动找最近一次
- 交互会话中 `/compact` 后也可以继续——压缩不会终止会话
- 会话数据存储在本地，不跨设备同步
:::