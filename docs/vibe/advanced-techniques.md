# 高级技巧

掌握了核心原则和 SOP 后，以下高级技巧帮你进一步提升 Vibe Coding 效率。

## 多 Agent 协作编排

复杂项目可以用多个 Claude Code 实例并行工作——每个实例负责一个独立子任务。

### 编排模式

**模式 1：流水线（Pipeline）**

```
Agent A → 输出 spec.md → Agent B → 输出 plan.md → Agent C → 执行实现
```

适合：需要规划→审查→执行三个阶段的项目。每个 agent 上下文干净，不受前一个 agent 的思维惯性影响。

**模式 2：并行分工（Parallel）**

```
Agent A：开发 API 层 → 输出 api 分支
Agent B：开发前端组件 → 输出 frontend 分支
Agent C：写测试 → 输出 tests 分支
```

适合：模块边界清晰的项目。每个 agent 只修改自己负责的文件集合。

**模式 3：主从（Orchestrator + Worker）**

```
主 Agent：分析需求，拆解任务，分配给子 Agent
子 Agent A：实现模块 1（通过 claude -p "..." --print）
子 Agent B：实现模块 2（通过 claude -p "..." --print）
主 Agent：审查结果，合并
```

适合：需要中央决策的项目。主 agent 维护全局上下文，子 agent 只做局部实现。

### 编排的关键约束

| 约束 | 原因 |
|------|------|
| 各 agent 只修改自己负责的文件 | 避免合并冲突 |
| 所有 agent 共享同一份 CLAUDE.md | 保持约定一致性 |
| 输出结果落地为文件（plan.md、tasks.md） | 新 agent 可以读取恢复上下文 |
| 合并时人工审查冲突解决 | AI 的自动合并可能遗漏语义冲突 |

详见 [Git Worktree 并行开发](/advanced/git-worktree) 和 [多会话协作策略](/advanced/multi-session)。

## TDD + Vibe Coding 融合

TDD（测试驱动开发）和 Vibe Coding 天然互补——先写测试定义期望行为，再让 AI 实现。

### 融合流程

```
1. 你描述期望行为（自然语言）→ 让 AI 写测试
2. 运行测试 → 确认失败（因为还没实现）
3. 让 AI 实现功能代码 → 运行测试 → 通过
4. 审查实现代码 → 确认与意图一致
```

### 为什么 TDD + Vibe Coding 特别有效？

| 维度 | 纯 Vibe Coding | TDD + Vibe Coding |
|------|---------------|-------------------|
| 验证方式 | AI 运行测试确认 | 测试先定义期望，AI 实现后再确认 |
| 审查负担 | 需要人工判断实现是否正确 | 测试就是规格——通过即正确 |
| AI 生成质量 | AI 可能遗漏边界 | 测试明确列出所有边界 |
| 回归保护 | 无 | 任何未来变更破坏行为都会被测试捕获 |

### 示例 prompt 流程

```
第一步：写测试
先为 "用户登录功能" 写测试，不要写实现代码。

测试覆盖：
- 正常登录返回 token
- 密码错误返回 401
- 用户不存在返回 404
- 同一用户连续登录 5 次后锁定 30 分钟

第二步：确认测试失败
运行测试，确认全部失败（因为还没实现）。列出失败测试名。

第三步：实现
现在实现用户登录功能，让所有测试通过。
完成后运行测试确认。
```

## 大仓库分层策略

在大型项目中（1000+ 文件），全局上下文会拖垮 AI 质量。分层策略保持上下文精准。

### 目录级 CLAUDE.md

在每个模块目录放置独立的 CLAUDE.md，只描述该模块的上下文：

```
src/api/CLAUDE.md    → API 层约定（路由格式、验证规则、错误处理）
src/models/CLAUDE.md → 数据模型约定（字段命名、关系定义）
src/auth/CLAUDE.md   → 认证模块约定（token 格式、刷新策略）
```

当 Claude 进入该目录时自动加载对应的 CLAUDE.md。不需要时不加载，节省上下文空间。

### 精准引用策略

告诉 Claude 具体文件路径，而不是让它全仓库搜索：

```
读取 @src/api/userHandler.ts 和 @src/models/User.ts，
添加 [功能描述]。
不要搜索其他文件。
```

### 模块隔离会话

每个会话只处理一个模块，结束后 `/clear` 开始新模块：

```
本次会话只处理 src/auth/ 模块。
完成后 /clear，下一个会话处理 src/api/ 模块。
```

### `.claudeignore` 大仓库配置

```text
# 排除不相关的目录
docs/archive/
vendor/
node_modules/
dist/
build/

# 排除大型数据文件
*.csv
*.sql.dump
data/seeds/

# 排除不相关的测试
e2e/              # 如果只做单元测试
```

## AI 禁区划定

有些代码区域对安全或业务至关重要，不应该让 AI 自行修改。

### 禁区清单模板

在 CLAUDE.md 中定义：

```markdown
## AI 禁区

以下区域不允许 AI 自行修改，必须由人工全权负责：

1. **认证逻辑**（src/auth/）— 安全敏感，AI 可能遗漏边界
2. **支付流程**（src/payments/）— 涉及资金，不能有任何风险
3. **数据库迁移**（migrations/）— 影响生产数据，必须人工审查
4. **权限配置**（.claude/settings.json 的 deny 规则）— 安全配置
```

### 禁区的权限配置

在 `.claude/settings.json` 中 enforce 禁区：

```json
{
  "permissions": {
    "deny": [
      "Edit(src/auth/*)",
      "Edit(src/payments/*)",
      "Edit(migrations/*)",
      "Write(src/auth/*)",
      "Write(src/payments/*)"
    ]
  }
}
```

AI 完全无法编辑这些区域的文件——只能读取和分析。

### 禁区的使用原则

| 原则 | 说明 |
|------|------|
| **AI 可以读，但不可以写** | 让 AI 分析禁区代码、提出建议，但修改由你执行 |
| **禁区大小要适度** | 只对真正敏感的区域设禁区，不要过度限制 |
| **禁区用 deny 权限而非 prompt 约束** | deny 权限是硬性阻断，prompt 约束是软性建议。安全敏感区域用硬性阻断 |

## 从 Vibe Coding 到系统化工程

Vibe Coding 的终极形态不是"凭感觉写代码"，而是"系统化的 AI 辏助工程"：

| 层级 | 内容 | 对应工具 |
|------|------|---------|
| **L1 意图表达** | 清晰描述做什么 | spec.md + Prompt 配方 |
| **L2 约束定义** | 明确边界和规则 | CLAUDE.md + AI 禁区 |
| **L3 迭代验证** | 小步快跑每步检查 | SOP 流程 + checkpoint commit |
| **L4 决策留痕** | 记录为什么这样做 | decision-log.md |
| **L5 并行协作** | 多 agent 分工 | Git Worktree + 多会话策略 |
| **L6 自动化** | CI/CD + 自动审查 | headless 模式 + GitHub Actions |

每一层都有对应的 SOP 和工具支撑。从 L1 开始，逐步升级到更高层级——这就是从"凭感觉 Vibe"到"系统化工程"的路径。