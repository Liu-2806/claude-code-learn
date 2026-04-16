# 并行开发多个功能

```bash
# 设置 worktree
git worktree add ../api-refactor refactor-branch
git worktree add ../new-feature feature-branch

# 两个终端同时运行
cd ../api-refactor && claude  # 重构 API
cd ../new-feature && claude   # 开发新功能
```

::: warning 注意合并冲突
并行开发时各 agent 尽量修改不同文件，合并时人工审查冲突解决结果。详见[Git Worktree 并行开发](/advanced/git-worktree)。
:::