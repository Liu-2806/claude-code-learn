# 失败复盘与问题恢复

之前的案例都是"顺利完成"的叙事。实际上，你更需要知道**出问题时怎么处理**。

## 场景 1：Claude 反复循环不退出

**现象：** Claude 一直在重复同样的操作（如反复运行测试、反复编辑同一个文件），看不到进展。

### 排查步骤

**第一步：用 --verbose 观察内部决策**

```bash
claude --verbose
```

这会显示 Claude 每次工具调用的参数和结果。重点看：
- 它每次读取了什么文件？
- 它推断出了什么结论？
- 有没有遗漏关键信息？

**第二步：用 /compact 压缩历史**

冗长的对话历史可能让 Claude "迷失"——上下文中充满了失败尝试的回响。

```
/compact
```

压缩后再描述任务，Claude 会有更清晰的上下文。

**第三步：降低 maxTurns**

如果 Claude 在简单任务上反复循环，在 `.claude/settings.json` 中降低最大迭代次数：

```json
{
  "maxTurns": 50
}
```

**第四步：明确约束**

```
修复 auth.ts 中的 JWT 类型错误。只修改这一个文件，修改后运行测试确认通过。
如果测试失败，最多尝试修复两次，不要反复循环。
```

### 典型复盘

```
问题：让 Claude "修复所有 lint 错误"，它反复修改 → 运行 lint → 发现新错误 → 再修改，持续 20 分钟不退出。

根因：任务描述太笼统。"修复所有"让 Claude 没有明确的完成标准。

解决：改为"修复 src/auth/ 目录下的 lint 错误，完成后运行 npm run lint:auth 确认无错误。最多修改 5 次。"
```

## 场景 2：Git Worktree 合并冲突

**现象：** 两个并行 agent 修改了同一文件的不同部分，合并时出现冲突。

### 处理步骤

**第一步：预判冲突区域**

合并前先检查：

```bash
git diff main..feature-a-branch --name-only
git diff main..feature-b-branch --name-only
```

找出两个分支都修改的文件——这些必然有冲突。

**第二步：合并第一个分支**

```bash
git checkout main
git merge feature-a-branch
```

通常第一个分支能顺利合并。

**第三步：合并第二个分支（有冲突）**

```bash
git merge feature-b-branch
# Auto-merging src/auth/login.ts
# CONFLICT (content): Merge conflict in src/auth/login.ts
```

**第四步：让 Claude 解决冲突**

```
帮我解决 src/auth/login.ts 的 merge conflict。保留两边的修改：
- feature-a 分支加了 JWT 超时处理
- feature-b 分支加了 null 检查防护
两个修改不矛盾，都需要保留。
```

**关键：** 告诉 Claude 每一边的修改意图，让它做出正确的合并决策。不要只说"解决冲突"——它不知道该保留哪边。

### 预防策略

- 让各 worktree 的 agent 尽量只修改自己负责的文件集合
- 在 Plan Mode 中先规划各 agent 的修改范围，避免重叠
- 使用 `git diff` 在合并前预判冲突区域

## 场景 3：spec→plan→tasks 中 Claude 偏离计划

**现象：** Claude 在执行 tasks.md 时偏离了 plan.md 的方案，自行"创新"。

### 纠偏步骤

**第一步：用 /compact 后明确指出偏离**

```
/compact
你现在的实现偏离了 plan.md 的方案。plan.md 说"用 SQLite + Prisma"，但你用了 MongoDB。
请重新读取 plan.md，按照它的方案重新实现。
```

**第二步：必要时重新开会话**

如果偏离太远，对话历史中充满了错误方向的推理，最好重新开一个干净会话：

```bash
claude
> 读取 plan.md 和 tasks.md，按照 plan.md 的方案继续执行未完成的任务
```

新会话没有之前的错误推理，执行更客观。

**第三步：在 CLAUDE.md 中加入约束**

```markdown
## 约束
- 数据库使用 SQLite + Prisma，不要用 MongoDB
- 认证使用 NextAuth.js，不要自己实现 JWT
- 按照 plan.md 的方案执行，不要自行替换技术选择
```

CLAUDE.md 每次会话自动加载，防止 Claude 再次偏离。

### 典型复盘

```
问题：spec.md 要求"Python CLI 工具"，plan.md 规划用 argparse + JSON 存储。Claude 执行时自改为 Flask web app + PostgreSQL。

根因：没有在 CLAUDE.md 中明确技术栈约束，Claude 认为 Flask 更"现代化"。

解决：在 CLAUDE.md 中写明"本项目是 CLI 工具，不使用 web 框架"，重新开会话执行。
```

## 场景 4：Claude 修改了不该修改的文件

**现象：** Claude 编辑了生产配置文件、敏感数据文件、或你不希望它碰的文件。

### 紧急处理

**第一步：用 git 恢复**

```bash
git checkout -- path/to/sensitive-file
```

**第二步：防止再次发生**

在 `.claude/settings.json` 中 deny 对该路径的访问：

```json
{
  "permissions": {
    "deny": [
      "Read(config/production.json)",
      "Edit(config/production.json)",
      "Write(config/production.json)"
    ]
  }
}
```

或在 `.claudeignore` 中排除：

```
config/production.json
data/secrets/
.env
```

**第三步：使用 Normal Mode**

敏感项目建议始终使用 Normal Mode（默认），不要切换 Auto-Accept。每一步修改都需要你确认。

## 关键原则

| 原则 | 说明 |
|------|------|
| **具体描述优于笼统** | "反复循环"的根因通常是任务描述太笼统 |
| **偏差及时发现及时纠正** | 不要等到 Claude 做完才发现偏离了方案 |
| **约束写进 CLAUDE.md** | 一次写好，每次会话都生效 |
| **敏感操作永远手动确认** | Normal Mode + deny 规则双重保障 |
| **失败后重新开干净会话** | 比在充满错误推理的对话中纠偏更有效 |