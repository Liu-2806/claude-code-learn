# Git Worktree 并行开发

Git Worktree 是 Claude Code 社区推荐的"杀手级用法"——让多个 Claude 实例同时并行工作在不同功能上。

## 什么是 Git Worktree？

Git Worktree 是同一个仓库的多个独立工作目录，每个目录可以 checkout 不同分支，互不干扰。

## 设置并行开发

```bash
# 为不同任务创建 worktree
git worktree add ../feature-a feature-a-branch
git worktree add ../feature-b feature-b-branch
git worktree add ../hotfix-1 hotfix-branch

# 在每个 worktree 中启动独立的 Claude Code
cd ../feature-a && claude             # Agent A: 开发新功能
cd ../feature-b && claude             # Agent B: 开发另一功能
cd ../hotfix-1  && claude --sandbox   # Agent C: 安全测试热修复
```

## 并行 vs 串行对比

| 传统方式 | Git Worktree 并行方式 |
|---------|---------------------|
| 一个任务做完才做下一个 | 多个 agent 同时工作 |
| 分支切换频繁，上下文丢失 | 每个目录独立上下文 |
| stash 管理复杂 | 物理隔离，无需 stash |

## 完成后合并

```bash
git checkout main
git merge feature-a-branch feature-b-branch hotfix-branch

# 清理 worktree
git worktree remove ../feature-a
git worktree remove ../feature-b
git worktree remove ../hotfix-1
```

## ⚠️ 风险与注意事项

| 风险 | 说明 | 建议 |
|------|------|------|
| **合并冲突** | 多个 agent 修改同一文件时必然冲突 | 尽量让各 worktree 修改不同文件；合并前先在 Plan Mode 中规划修改范围 |
| **`.gitignore` 同步** | 每个 worktree 共享主仓库的 `.gitignore`，但 `.claudeignore` 和 `.claude/settings.local.json` 需各自配置 | 在 CLAUDE.md 中记录这些配置需求，所有 worktree 共享同一份 |
| **依赖安装** | 各 worktree 的 `node_modules` 需独立安装 | 每个 worktree 启动后先让 Claude 运行 `npm install` |
| **同时修改同一文件** | 两个 agent 修改同一行的不同部分 → 合并时冲突 | 用 `git diff` 预判冲突区域，或让 Claude 先检查其他 worktree 的变更 |

::: warning 关键原则
每个 agent 尽量只修改自己负责的文件集合，避免重叠。合并时务必人工审查冲突解决结果。
:::