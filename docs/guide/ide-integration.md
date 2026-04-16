# IDE 集成

Claude Code 提供两种主流 IDE 扩展，都基于 CLI 后端运行，支持自主多步骤编码工作流。

## VS Code

在 VS Code 扩展市场搜索 "Claude Code" 安装，或在命令面板中运行：

```
ext install anthropic.claude-code
```

### 功能

| 功能 | 说明 |
|------|------|
| 内联代码建议 | 在编辑器中直接获得 Claude 的代码建议 |
| 侧边栏对话 | 在侧边栏面板与 Claude 对话，不影响编辑区域 |
| 多文件上下文感知 | 自动理解项目结构，跨文件引用 |
| 终端命令协助 | 在 VS Code 内置终端中直接运行 Claude 命令 |
| `/` 斜杠命令 | 支持所有内置斜杠命令 |
| 会话恢复 | 支持 `--continue` / `--resume` 恢复之前的会话 |

### 配置与快捷键

安装后，Claude Code 会在 VS Code 的侧边栏显示一个面板。点击即可打开对话界面。

常用操作：
- `Ctrl+Shift+P` → 输入 "Claude" 查看所有相关命令
- 侧边栏面板支持拖拽调整位置
- 选中代码右键可选择"Ask Claude"对选中片段提问

### 与 CLI 版本的功能边界

VS Code 扩展与 CLI 版本功能基本一致，但：
- **完全支持**：所有斜杠命令、权限管理、CLAUDE.md、Skills、Hooks
- **不支持**：`--verbose` 详细日志模式（仅在终端中可用）
- **优势**：在 IDE 内操作更方便，代码建议可直接 inline 插入

## JetBrains

在 JetBrains IDE（IntelliJ IDEA、PyCharm、WebStorm 等）的插件市场搜索 "Claude Code" 安装。

### 功能

| 功能 | 说明 |
|------|------|
| AI 辅助代码补全 | 在编辑器中获得智能代码补全建议 |
| 对话面板 | 侧边栏与 Claude 对话 |
| 重构建议 | Claude 主动提出重构方案 |
| 错误检测和修复推荐 | 发现错误后推荐修复方案 |
| `/` 斜杠命令 | 支持所有内置斜杠命令 |

### 与 CLI 版本的功能边界

JetBrains 扩展与 CLI 版本功能基本一致。部分高级功能（如 Git Worktree 并行开发）在 IDE 中不如 CLI 直接操作方便。

## 两种 IDE 对比

| | VS Code | JetBrains |
|---|---------|-----------|
| **安装方式** | 扩展市场 | 插件市场 |
| **对话界面** | 侧边栏面板 | 侧边栏对话面板 |
| **代码建议** | 内联 + 侧边栏 | 内联补全 + 对话面板 |
| **斜杠命令** | 完全支持 | 完全支持 |
| **后端** | Claude Code CLI | Claude Code CLI |
| **适用 IDE** | VS Code | IntelliJ IDEA、PyCharm、WebStorm、GoLand 等 |

## 共通的后端架构

两种 IDE 扩展都基于 Claude Code CLI 后端运行。这意味着：
- IDE 中的 Claude 和终端中的 Claude 使用**相同的权限配置、CLAUDE.md、Skills**
- IDE 中的操作和 CLI 中的操作共享**同一份会话历史**
- 在 IDE 中设置的权限规则同样适用于终端模式

::: tip 选择建议
- 如果你已经深度使用 VS Code 或 JetBrains → 用对应的 IDE 扩展，体验更流畅
- 如果你需要精细控制（verbose 日志、headless 模式、CI/CD） → 用 CLI 终端模式
- 两者可以同时使用——IDE 做日常编码，CLI 自动化任务
:::