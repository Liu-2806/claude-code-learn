# 并行开发多个功能

**背景：** 项目需要同时推进两个功能——重构 API 层和开发新用户模块。用 Git Worktree 让两个 Claude 实例并行工作。

Worktree 的概念和完整配置说明见[Git Worktree 并行开发](/advanced/git-worktree)。这里只讲实际并行开发中的关键操作和 prompt 设计。

## 第一步：设置 Worktree 并启动 Claude

```bash
# 为不同任务创建 worktree（分支需提前创建）
git worktree add ../api-refactor refactor-branch
git worktree add ../new-feature feature-branch

# 在每个 worktree 中安装依赖
cd ../api-refactor && npm install
cd ../new-feature && npm install

# 两个终端同时启动 Claude
cd ../api-refactor && claude   # Agent A
cd ../new-feature && claude    # Agent B
```

## 第二步：给每个 Agent 写明确的 prompt

并行开发最关键的是**让每个 agent 只改自己负责的文件**。prompt 要明确指定范围：

**Agent A（重构 API）的 prompt：**

```
重构 src/api/ 下的路由处理逻辑：
- 将重复的错误处理抽取为公共 middleware
- 将参数验证统一用 Zod schema
- 对外接口不变

只修改 src/api/ 下的文件，不要改其他目录。
完成后运行 npm test 确认没有引入新错误。
```

**Agent B（新功能）的 prompt：**

```
在 src/modules/ 下添加用户偏好设置模块：
- 新增 UserPreferences 数据模型
- 新增 /api/preferences CRUD 路由
- 遵循 @CLAUDE.md 中的项目约定

只修改 src/modules/ 下的文件，不要改 src/api/。
完成后运行 npm test 确认通过。
```

## 第三步：合并时的冲突处理

```bash
git checkout main
git merge refactor-branch    # 通常顺利
git merge feature-branch     # 可能有冲突
```

如果出现冲突，告诉 Claude 每一边的修改意图：

```
帮我解决 src/api/router.ts 的 merge conflict。
refactor 分支改了错误处理中间件的位置，
feature 分支新增了 /preferences 路由。
两个修改不矛盾，都需要保留。
```

**关键：** 不要只说"解决冲突"——Claude 不知道该保留哪边。要描述每一边做了什么。

## 第四步：清理

```bash
git worktree remove ../api-refactor
git worktree remove ../new-feature
```

::: tip 关键经验
- 并行开发最适合模块边界清晰的项目——每个 agent 只修改自己负责的文件集合
- prompt 中明确写"只修改 [目录]"比笼统描述任务更有效
- 合并冲突必须人工审查——AI 的自动合并可能遗漏语义冲突
- 完整的风险和注意事项见[Git Worktree 并行开发](/advanced/git-worktree)
