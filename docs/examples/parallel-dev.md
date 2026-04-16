# 并行开发多个功能

**背景：** 项目需要同时推进两个功能——重构 API 层和开发新用户模块。用 Git Worktree 让两个 Claude 实例并行工作。

## 第一步：设置 Worktree

```bash
# 为不同任务创建 worktree
git worktree add ../api-refactor refactor-branch
git worktree add ../new-feature feature-branch

# 在每个 worktree 中安装依赖
cd ../api-refactor && npm install
cd ../new-feature && npm install
```

## 第二步：同时启动两个 Claude

```bash
# 两个终端同时运行
cd ../api-refactor && claude   # Agent A：重构 API
cd ../new-feature && claude    # Agent B：开发新功能
```

**Agent A 的 prompt：**

```
重构 src/api/ 下的路由处理逻辑：
- 将重复的错误处理抽取为公共 middleware
- 将参数验证统一用 Zod schema
- 对外接口不变

完成后运行 npm test 确认没有引入新错误。
```

**Agent B 的 prompt：**

```
在 src/modules/ 下添加用户偏好设置模块：
- 新增 UserPreferences 数据模型
- 新增 /api/preferences CRUD 路由
- 遵循 @CLAUDE.md 中的项目约定

完成后运行 npm test 确认通过。
```

## 第三步：合并结果

```bash
# 先合并第一个分支（通常顺利）
git checkout main
git merge refactor-branch

# 合并第二个分支（可能有冲突）
git merge feature-branch
```

如果出现冲突：

```
帮我解决 src/api/router.ts 的 merge conflict。
refactor 分支改了错误处理中间件的位置，
feature 分支新增了 /preferences 路由。
两个修改不矛盾，都需要保留。
```

**关键：** 告诉 Claude 每一边的修改意图，让它做出正确的合并决策。

## 第四步：清理

```bash
# 清理 worktree
git worktree remove ../api-refactor
git worktree remove ../new-feature
```

## 并行开发的关键原则

| 原则 | 说明 |
|------|------|
| **各 agent 只改自己的文件** | 减少合并冲突的概率 |
| **所有 agent 共享同一份 CLAUDE.md** | 保持约定一致性 |
| **合并前先检查重叠文件** | `git diff main..branch --name-only` 预判冲突区域 |
| **合并冲突必须人工审查** | AI 的自动合并可能遗漏语义冲突 |

::: tip 关键经验
- 并行开发最适合模块边界清晰的项目——每个 agent 只修改自己负责的文件集合
- 如果两个 agent 必须修改同一文件，先在 Plan Mode 中规划各自修改的区域（如不同函数、不同行范围），减少冲突
- 详见[Git Worktree 并行开发](/advanced/git-worktree)
:::