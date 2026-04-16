# 安装

**前置条件：** Node.js 18+ 和 npm

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后，在你的项目目录中运行：

```bash
claude
```

运行 `/doctor` 检查安装和认证状态是否正常。

## Windows 用户专项指引

如果你在 Windows 上使用 Claude Code，以下是需要特别注意的事项：

### 推荐使用 WSL2

Windows 原生终端（PowerShell / CMD）可以运行 Claude Code，但**强烈建议使用 WSL2**（Windows Subsystem for Linux），因为：

- `/sandbox` 沙盒模式**仅支持 macOS/Linux/WSL2**，Windows 原生不支持
- 许多 Claude Code 社区推荐的 shell 命令和工具链都是 Linux 生态
- Git Worktree 并行开发在 WSL2 中体验更好

安装 WSL2：

```powershell
wsl --install
```

安装后重启电脑，在 WSL2 中安装 Node.js 和 Claude Code 即可。

### PowerShell vs Bash

Claude Code 在 Windows 原生终端中**默认使用 PowerShell**。一些关键差异：

| 事项 | PowerShell | Bash（WSL2/Git Bash） |
|------|-----------|---------------------|
| 环境变量 | `$env:ANTHROPIC_API_KEY="xxx"` | `export ANTHROPIC_API_KEY="xxx"` |
| 路径格式 | `C:\Users\project` | `/mnt/c/Users/project`（WSL2） |
| 命令执行 | 部分 Linux 命令不兼容 | 完全兼容 |

### 常见 Windows 问题

- **npm 全局安装路径问题**：如果 `claude` 命令找不到，可能需要将 npm 全局路径加入 PATH。运行 `npm config get prefix` 查看路径，然后加入系统 PATH。
- **Node.js 版本**：确保 Node.js 18+。推荐用 `fnm`（Fast Node Manager）管理版本。
- **终端编码**：如果中文显示乱码，设置终端编码为 UTF-8。

## npm 全局安装权限不足？

Linux/macOS 上可能遇到权限问题：

```bash
# 方案一：修改 npm 全局路径（推荐）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# 方案二：使用 nvm/fnm 管理 Node.js 版本（推荐，避免权限问题）
nvm install 20
npm install -g @anthropic-ai/claude-code
```