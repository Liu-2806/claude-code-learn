# Agentic Coding 工作原理

Claude Code 的核心不是简单的"单次问答→代码生成"，而是 **Agentic Coding**——自主迭代循环。这是 Claude Code 区别于其他 AI 编码工具（如 GitHub Copilot、ChatGPT 代码模式）的最核心特性。

## 传统 AI 编码 vs Agentic Coding

| 维度 | 传统 AI 编码（Copilot / ChatGPT） | Agentic Coding（Claude Code） |
|------|-----------------------------------|-------------------------------|
| 模式 | 单次问答生成 | 多步迭代，自主决策 |
| 工具使用 | 无或有限 | 读写文件、执行命令、搜索代码 |
| 反馈循环 | 无 | 执行 → 验证 → 修正 → 再执行 |
| 上下文 | 单次输入 | 持续积累项目上下文 |
| 错误处理 | 依赖人工 | 自主识别并修复错误 |
| 适用场景 | 代码补全、片段生成 | 端到端任务交付 |

## Agentic Loop 循环过程

```
1. 理解任务
2. 制定计划
3. 执行工具调用（编辑文件/运行命令/搜索代码）
4. 观察结果
5. 判断是否完成
   → 完成：提交结果
   → 未完成：回到步骤 3 修正
```

### 完整 Agentic 循环示例

**任务：** 为用户注册 API 添加速率限制

```
你：帮我给 @src/api/auth/register.ts 添加速率限制。
   要求：同一 IP 每分钟最多 5 次注册请求。

Claude：
  1. [Read] 读取 register.ts 理解当前实现
  2. [Grep] 搜索项目中是否已有 rate limiting 中间件
  3. [Read] 读取 package.json 查看依赖
  4. [Edit] 安装 express-rate-limit 包
  5. [Edit] 在 register.ts 中添加速率限制中间件
  6. [Bash] 运行 npm test 验证
     → 2 个测试失败：超时设置不匹配
  7. [Read] 读取失败测试详情
  8. [Edit] 调整超时配置
  9. [Bash] 再次运行 npm test → 全部通过 ✓
  10. [Bash] 提交 git commit
  11. 完成！

总工具调用次数：11
人工干预次数：0（Auto-Accept 模式下）
```

## 自愈机制

Agentic Coding 最强大的特性是**自愈**——Claude 在遇到问题时自动修正：

### 典型自愈场景

```
你：帮我给 auth.ts 加上 JWT 验证

Claude：
  1. 编辑 auth.ts → 加入 JWT 验证代码
  2. 运行 npm test → 发现 2 个测试失败
  3. 读取失败信息 → 发现是 mock 数据格式变了
  4. 修改测试文件 → 适配新的 JWT 格式
  5. 再次运行 npm test → 全部通过 ✓
  6. 完成！
```

如果没有自愈机制，你需要自己发现测试失败、自己修复。有了自愈，Claude 自己闭环处理。

### 自愈能力矩阵

| 问题类型 | 能否自愈 | 原因 |
|----------|---------|------|
| 编译错误 / 类型错误 | ✅ 完全可以 | 有明确错误信息，Claude 能定位并修复 |
| 测试失败 | ✅ 完全可以 | 测试框架提供详细失败信息 |
| Lint 报错 | ✅ 完全可以 | ESLint 等提供行号和修复建议 |
| 运行时错误 | ⚠️ 部分可以 | 需要有错误日志或可观察的失败表现 |
| 逻辑错误 | ❌ 无法自愈 | Claude 不知道正确的业务逻辑是什么 |
| 性能退化 | ❌ 无法自愈 | 需要性能基准测试或人工观察 |
| 安全漏洞 | ⚠️ 部分可以 | 如果明确要求安全审查，可以识别 |

### 如何最大化自愈效果

**1. 在 prompt 中要求验证和自愈：**
```
帮我实现这个功能。完成后运行测试，如果测试失败：
1. 读取失败详情
2. 分析根因
3. 自动修复
4. 再次验证
最多尝试 3 次修复。
```

**2. 确保项目有测试覆盖：**
Claude 的自愈依赖反馈信号。测试覆盖率越高，自愈成功率越高。

**3. 配置 maxTurns（最大迭代轮数）：**
```bash
# 在 .claude/settings.json 中配置
{
  "maxTurns": 50
}
```

`maxTurns` 控制 Claude 最多可以进行多少轮工具调用。默认值通常够用，但对于复杂任务（如大型重构），建议调高到 50-100。

::: warning 注意
maxTurns 设置过高可能导致 Claude 在死循环中持续消耗资源。如果 Claude 陷入循环，按 Ctrl+C 中断并重新审视 prompt。
:::

## 多层代理架构

Claude Code 可以作为**子代理**嵌入更大的 agentic 系统中：

### 架构概览

```
主代理（Orchestrator）
  ├── 规划代理：分析需求，制定方案
  ├── Claude Code 子代理：执行代码相关任务
  │     （通过 --print --allowedTools 模式调用）
  ├── 审查代理：验证产出质量
  └── 部署代理：处理 CI/CD 流程
```

### 实现方式

**CLI 方式调用子代理：**

```bash
# 主代理通过 headless 模式调用 Claude Code
claude -p "实现 XXX 功能" \
  --print \
  --allowedTools Read,Edit,Bash \
  --output-format json
```

`--print` 让结果输出到 stdout，`--allowedTools` 控制权限边界，`--output-format json` 让主代理解析结果。

**SDK 方式调用子代理：**

```javascript
import { query } from '@anthropic-ai/claude-code';

// 主代理调用 Claude Code 子代理
const result = await query({
  prompt: "修复 auth.ts 中的类型错误",
  options: {
    model: "sonnet",
    allowedTools: ["Read", "Edit", "Bash"]
  }
});

console.log(result);
// { type: "result", content: "已修复 3 处类型错误..." }
```

### 权限隔离策略

当 Claude Code 作为子代理运行时，严格限制权限：

```json
{
  "permissions": {
    "allow": ["Read", "Grep", "Edit", "Bash(npm:*)", "Bash(git:*)"],
    "deny": ["Bash(rm:*)", "Bash(git push:*)", "Bash(curl:*)"]
  }
}
```

### 多代理协作模式

**模式 1：串行流水线**
```
规划代理 → Claude Code 代理 → 审查代理 → 部署代理
```
每个代理完成自己的任务后传递给下一个。适合标准化的开发流程。

**模式 2：并行分片**
```
            ┌── Claude Code 代理（模块 A）──┐
主代理 ─────┼── Claude Code 代理（模块 B）──┼──→ 合并结果
            └── Claude Code 代理（模块 C）──┘
```
多个 Claude Code 实例并行处理不同模块。适合大型项目中独立模块的并行开发。

**模式 3：递归审查**
```
Claude Code 代理（生成代码）
    ↓
Claude Code 代理（审查代码）
    ↓
发现问题 → 回到生成代理修正
    ↓
通过 → 输出最终结果
```
让 Claude Code 自我审查。适合无人值守的自动化场景。

## Agentic Coding 调优指南

### 模型选择策略

| 模型 | 适用场景 | 成本 | 速度 |
|------|---------|------|------|
| Haiku | 简单任务：格式化、重命名、添加注释 | 最低 | 最快 |
| Sonnet | 日常开发：功能实现、bug 修复、重构 | 中等 | 中等 |
| Opus | 复杂任务：架构设计、大规模重构、安全审计 | 最高 | 最慢 |

**选择建议：**
- 日常开发默认用 **Sonnet**，性价比最优
- 大型重构或架构设计切换到 **Opus**，质量更高
- 批量机械操作使用 **Haiku**，速度快成本低

```bash
# 切换模型
claude -m opus    # 用 Opus 处理复杂任务
claude -m sonnet  # 默认选择
claude -m haiku   # 快速简单任务
```

### 上下文窗口管理

Agentic 循环会持续积累上下文。当上下文接近限制时，Claude 的输出质量可能下降。

**管理策略：**

```
1. 使用 /compact 命令释放上下文
2. 大任务拆成多个小会话
3. 关键约定写进 CLAUDE.md（持久记忆），不用重复描述
4. 已完成的任务及时提交 commit（commit message 本身也包含上下文）
```

### 错误处理与恢复

即使有自愈机制，Claude 也可能遇到无法自动修复的问题。

**常见失败模式和应对：**

| 失败模式 | 原因 | 应对 |
|----------|------|------|
| Claude 在死循环中循环 | 无法解决的错误 | Ctrl+C 中断，修正 prompt 后重试 |
| 上下文窗口耗尽 | 任务太大或迭代过多 | `/compact` 或拆分会话 |
| 改了不该改的文件 | prompt 约束不够 | 增加否定约束 + 限制工具范围 |
| 测试失败无法修复 | 测试本身有问题或需要人工判断 | 人工介入分析失败原因 |
| 工具权限不足 | 未授权相关工具 | 在 settings.json 中配置权限 |

## 实战案例：Agentic 自动修复生产 Bug

**场景：** 生产环境出现用户无法登录的问题。

```
你：生产环境出现用户无法登录的问题。
   错误日志显示：TypeError: Cannot read properties of undefined (reading 'password')
   请分析并修复。

Claude（Agentic 循环）：
  ┌─ 分析阶段 ─┐
  │ [Grep] 搜索 'password' 在 auth/ 目录下的使用   │
  │ [Read] 读取 src/auth/login.ts                  │
  │ [Grep] 搜索最近的 git commit 修改了哪些文件       │
  │ [Read] 读取 src/middleware/auth.ts             │
  └────────────────────────────────────────────┘
  
  发现：昨天的一次提交修改了 login.ts，把 req.body 改为了
  req.user，但 auth 中间件还没有更新。

  ┌─ 修复阶段 ─┐
  │ [Edit] 修复 src/middleware/auth.ts 中的字段映射  │
  │ [Bash] npm test                                │
  │ → 1 个测试失败                                  │
  │ [Read] 读取失败测试                             │
  │ [Edit] 修复测试中的 mock 数据                    │
  │ [Bash] npm test → 全部通过 ✓                    │
  │ [Bash] git commit -m "fix: 修复登录字段映射错误"    │
  └────────────────────────────────────────────┘

  完成！已修复 auth.ts 中的字段映射错误。
  根因：中间件更新滞后，req.body 改 req.user 后中间件未同步。
```

::: tip 核心优势
Agentic Coding 的本质是**闭环反馈**——不像传统 AI 生成代码后需要你手动验证和修改，Claude Code 自己完成"执行→验证→修正"的循环，大幅减少人工介入。
:::

## Agentic Coding 的最佳实践总结

1. **给足约束：** 约束越明确，Claude 越不容易走偏
2. **要求验证：** 始终要求 Claude 运行测试来验证修改
3. **限制范围：** 一次只做 2-3 个文件的变更
4. **善用自愈：** 让 Claude 自己处理编译错误和测试失败
5. **适时中断：** 发现 Claude 在死循环时果断 Ctrl+C
6. **拆分会话：** 大任务拆成多个会话，保持上下文清晰
7. **持久约定：** 编码规范写进 CLAUDE.md，不用每次重复
8. **选择合适模型：** 日常用 Sonnet，复杂任务用 Opus，简单操作用 Haiku
