# 三种操作模式

Claude Code 有三种操作模式，适用于不同场景。选对模式可以大幅提升效率。

## Normal Mode（普通模式）

默认模式，每次启动时就是这个模式。Claude 在执行需要权限的操作前会逐一询问你是否同意（编辑文件、运行命令等）。安全性最高，适合大多数日常开发场景。

**特点：**
- 每次编辑文件、运行命令前都会弹出确认
- 你可以看到 Claude 即将做什么，有机会阻止
- 工具调用详情完整展示，透明度高

**适用场景：**

| 场景 | 示例 |
|------|------|
| 日常功能开发 | "帮我添加用户头像上传功能" |
| 修改关键文件 | "重构 @src/payment/process.ts" |
| 不确定影响范围时 | "分析这个 bug 的根因" |
| 团队协作的代码 | 修改共享模块或公共组件 |
| 学习新框架 | 想看看 Claude 会怎么做，但需要每步确认 |

**实战示例：**

```
你：帮我重构 @src/utils/helpers.ts 中的日期格式化函数

Claude：[Read] 我要先读取 src/utils/helpers.ts 确认当前实现
→ [需要你确认：Allow / Deny]

Claude：[Grep] 我需要搜索项目中所有调用 formatDate 的地方
→ [需要你确认：Allow / Deny]

Claude：[Edit] 我建议将 formatDate 拆分为 parseDate 和 formatDate 两个函数
→ [需要你确认：Allow / Deny]

Claude：[Bash] 运行 npm test 确认修改没有破坏现有功能
→ [需要你确认：Allow / Deny]
```

::: tip 最佳实践
如果你不确定任务的影响范围，始终从 Normal Mode 开始。审查了几步确认 Claude 方向正确后，可以按 Shift+Tab 切换到 Auto-Accept 加速。
:::

## Auto-Accept Mode（自动接受模式）

Claude 不再逐一询问，所有操作自动执行。适合你信任 Claude 判断、想快速完成的简单任务。风险更高——Claude 可能做出你不预期的修改。

**特点：**
- 所有工具调用自动执行，无需确认
- 速度最快，适合信任度高的场景
- 仍然可以看到 Claude 做了什么（有日志）

**适用场景：**

| 场景 | 示例 |
|------|------|
| 格式化 / Lint | "格式化整个项目的代码" |
| 简单重命名 | "把项目中所有 userId 改为 user_id" |
| 批量操作 | "为 src/api/ 下每个文件添加 JSDoc 注释" |
| 生成文档 | "为所有 API 端点生成文档" |
| 你已经审查过方案 | Plan Mode 确认方案后切换执行 |
| 个人项目 / 实验代码 | 不怕出错的项目 |

**实战示例：**

```
你：（按 Shift+Tab 切换到 Auto-Accept）
    帮我给 src/ 下所有 TypeScript 文件添加 "use strict" 指令

Claude：[Read] src/a.ts ✓ → [Edit] ✓
        [Read] src/b.ts ✓ → [Edit] ✓
        [Read] src/c.ts ✓ → [Edit] ✓
        ...（自动处理 20 个文件，无需确认）
        完成！已为 20 个文件添加 "use strict" 指令。
```

**风险提示：**

⚠️ Auto-Accept 模式下 Claude 可能：
- 删除不该删的文件（如果理解错误）
- 运行危险的 shell 命令（如 `rm -rf`）
- 修改关键配置文件

**建议：** 在 Auto-Accept 模式下，通过权限配置限制 Claude 可执行的工具：

```json
// .claude/settings.json
{
  "permissions": {
    "deny": [
      "Bash(rm:*)",
      "Bash(git push:*)",
      "Bash(git reset:*)"
    ]
  }
}
```

::: warning 安全提醒
不要在 Auto-Accept 模式下让 Claude 操作生产环境代码或敏感配置文件。始终用权限 deny 列表兜底。
:::

## Plan Mode（计划模式）

Claude 只做分析和规划，不执行任何修改操作。会写出一个详细的实施计划供你审核，确认后才切换到执行模式去实际编码。适合复杂的多文件变更任务——先想清楚再动手。

**特点：**
- 只读模式：不编辑文件、不运行命令
- 输出详细的实施计划（通常保存在 plan.md 中）
- 确认计划后自动切换到 Normal/Auto-Accept 执行

**适用场景：**

| 场景 | 示例 |
|------|------|
| 多文件重构 | "重构整个认证模块（涉及 12 个文件）" |
| 架构变更 | "把 REST API 迁移到 GraphQL" |
| 技术栈迁移 | "把 JavaScript 全部改为 TypeScript" |
| 复杂新功能 | "实现一个完整的购物车系统" |
| 不确定影响时 | "评估删除这个公共函数的影响" |
| 需要二次意见 | "审查这个方案是否有遗漏" |

**实战示例：**

```
你：（按 Ctrl+P 进入 Plan Mode）
    我们要把项目从 Express 迁移到 Fastify。先评估影响范围。

Claude：[Plan Mode] 分析中...
  1. [Read] 扫描项目中所有 Express 相关代码
  2. [Grep] 搜索 express 导入和中间件使用
  3. 分析结果：
     - 涉及 18 个文件需要修改
     - 5 个自定义中间件需要重写
     - 2 个第三方中间件有 Fastify 替代方案
     - 路由定义需要调整语法
  4. 生成 plan.md 实施计划：
     - Phase 1: 安装 Fastify + 卸载 Express
     - Phase 2: 迁移路由（8 个文件）
     - Phase 3: 重写中间件（5 个文件）
     - Phase 4: 迁移错误处理
     - Phase 5: 测试验证

你：（审查 plan.md）
    方案没问题。请执行 Phase 1 和 Phase 2。

Claude：（自动退出 Plan Mode，开始执行）
```

**Plan Mode 的高级用法：**

**分阶段确认：**
```
你：用 Plan Mode 制定迁移计划。计划确认后，先执行 Phase 1。
   Phase 1 完成后我再确认 Phase 2。
```

**跨会话 Plan → Execute：**
```
Session 1（Plan Mode）：分析 + 生成 plan.md
Session 2（Normal Mode）：阅读 plan.md，执行 Phase 1-2
Session 3（Normal Mode）：执行 Phase 3-4
```

这种模式特别适合大项目——Plan 和 Execute 分开，每次会话只做一件事。

## 模式对比

|  | Normal | Auto-Accept | Plan |
|---|---|---|---|
| **确认方式** | 每步都问 | 全部自动 | 先规划后执行 |
| **速度** | 较慢 | 最快 | 规划慢，执行快 |
| **安全性** | 最高 | 最低 | 中高 |
| **编辑文件** | 需要确认 | 自动 | 不允许 |
| **运行命令** | 需要确认 | 自动 | 不允许 |
| **适用场景** | 日常开发 | 信任度高的批量任务 | 复杂重构/迁移 |
| **切换方式** | 默认 | Shift+Tab | Ctrl+P |

## 模式切换工作流

**推荐的高效工作流：**

```
1. 新任务 → Normal Mode 开始
   ↓（确认 Claude 方向正确，2-3 步后）
2. Shift+Tab → Auto-Accept 加速执行
   ↓（完成后检查）
3. 检查输出，如有问题 → Normal Mode 修复
```

**复杂任务工作流：**

```
1. Ctrl+P → Plan Mode 分析
   ↓（审查 plan.md）
2. Ctrl+P → 退出 Plan，切换 Auto-Accept 执行
   ↓（完成后）
3. Normal Mode 验证结果
```

## 混合场景：模式组合

实际开发中经常需要组合使用多种模式：

### 场景 1：大型重构

```
Step 1: Plan Mode — 分析影响范围，生成 plan.md
Step 2: Normal Mode — 执行第一批修改（关键文件，需要确认）
Step 3: Auto-Accept — 执行第二批修改（机械性改动，批量处理）
Step 4: Normal Mode — 运行测试，逐条修复失败项
```

### 场景 2：新功能开发

```
Step 1: Normal Mode — 讨论需求，确认技术方案
Step 2: Auto-Accept — 生成骨架代码（模型、路由、控制器）
Step 3: Normal Mode — 实现核心业务逻辑（需要逐行确认）
Step 4: Auto-Accept — 批量生成 JSDoc 注释和单元测试
```

### 场景 3：Bug 修复

```
Step 1: Normal Mode — 分析 bug 根因（只读分析）
Step 2: Auto-Accept — 应用修复（已确认方案）
Step 3: Normal Mode — 验证修复效果 + 添加回归测试
```

## 实战案例

### 案例：迁移项目到 Monorepo

这是一个真实的重构场景，展示如何组合使用三种模式。

**背景：** 项目从单仓库迁移到 Monorepo（pnpm workspace），涉及 3 个子项目、40+ 个文件。

```
你：（Plan Mode）
    我们要把这个项目迁移到 pnpm monorepo 结构。
    子项目：frontend（Next.js）、backend（Express）、shared（公共包）
    先分析当前项目结构，生成迁移计划。

Claude：[Plan Mode]
  分析完成，生成 plan.md：
  - Phase 1: 创建 workspace 结构（package.json, pnpm-workspace.yaml）
  - Phase 2: 迁移 frontend 到 packages/frontend
  - Phase 3: 迁移 backend 到 packages/backend
  - Phase 4: 提取 shared 公共代码到 packages/shared
  - Phase 5: 更新 CI/CD 配置
  - Phase 6: 测试验证

你：（审查 plan.md，确认无误）
    好，执行 Phase 1 和 Phase 2。

你：（Normal Mode，因为 Phase 1-2 涉及关键文件）
    执行 plan.md 的 Phase 1 和 Phase 2。

Claude：（逐文件迁移，每步你确认）
  [Edit] 创建 pnpm-workspace.yaml ✓
  [Edit] 创建根 package.json ✓
  [Edit] 迁移 frontend/package.json ✓
  ...

你：（Phase 1-2 完成后）
    Phase 3 和 4 用 Auto-Accept 执行吧，都是机械性迁移。

Claude：（Auto-Accept，自动处理 20+ 文件）
  [Edit] 迁移 backend... ✓
  [Edit] 提取 shared... ✓
  ...
  Phase 3-4 完成！

你：（Normal Mode）
    现在执行 Phase 5 和 6，每步我需要确认。
```

**总耗时：** ~25 分钟（如果用纯 Normal Mode 估计需要 40+ 分钟）
**关键：** 关键步骤用 Normal 确认安全，机械步骤用 Auto-Accept 提速。

::: tip 核心建议
- **日常开发用 Normal Mode**，安全性最高
- **对 Claude 输出信任时切换 Auto-Accept 加速**
- **复杂任务先用 Plan Mode 规划，再切换执行**
- **混合使用三种模式**：关键步骤 Normal + 机械步骤 Auto-Accept + 复杂任务先 Plan
:::
