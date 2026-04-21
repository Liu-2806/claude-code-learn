# 高级 Prompt 技巧

基于 Anthropic 官方文档和社区实践整理的高级 prompt 技巧。这些技巧适用于 Claude Code 和 Claude API。

## 官方推荐：六大核心技巧

Anthropic 在官方文档中推荐了以下 prompt 工程最佳实践：

### 技巧 1：XML 标签结构化输入

使用 XML 标签组织复杂 prompt，让 Claude 明确区分不同部分：

```xml
<任务描述>
为当前项目实现一个用户认证模块
</任务描述>

<技术栈>
- 后端: Node.js + Express
- 数据库: PostgreSQL + Prisma ORM
- 认证: JWT + bcrypt
</技术栈>

<约束条件>
- 使用项目现有的 AppError 错误处理
- 所有 API 需要 Zod 验证
- 不要改动现有测试
</约束条件>

<输出格式>
创建以下文件:
1. src/auth/register.ts
2. src/auth/login.ts
3. src/middleware/auth.ts
4. src/tests/auth.test.ts
</输出格式>
```

**为什么有效：** XML 标签让 Claude 精确解析 prompt 结构，不会混淆不同部分的信息。这在多文档、多约束的复杂任务中效果显著。

### 技巧 2：Few-Shot 示例引导

给 Claude 看 1-3 个期望输出的示例，比任何描述都有效：

```
以下是我想要的 API 文档格式：

<example>
## POST /api/users
**描述：** 创建新用户
**请求体：** { name: string, email: string, password: string }
**响应 (201)：** { id: number, name: string, email: string }
**错误响应 (400)：** { error: string, fields: string[] }
</example>

现在为 @src/api/products.ts 生成同样格式的文档。
```

**关键要点：**
- 示例要覆盖边界情况（不只是正常场景）
- 3-5 个示例效果最好
- 示例比描述更有效——如果只能选一个，选示例

### 技巧 3：Chain-of-Thought 思维链

对复杂推理任务，要求 Claude 逐步思考：

```
分析以下架构设计的安全性。

在给出结论之前，请先：
1. 列出所有外部输入点
2. 对每个输入点，分析可能的攻击向量
3. 评估现有防护措施的有效性
4. 最后给出安全评估和修复建议

每一步都要有明确的推理依据。
```

**进阶：结构化思维链**

```
分析代码中的性能瓶颈。

先用 <analysis> 标签逐步分析：
1. 读取相关代码文件
2. 识别 CPU 密集型操作
3. 识别 IO 密集型操作
4. 计算每个操作的大致复杂度

然后在 <conclusion> 标签中给出优化建议，按影响程度排序。
```

### 技巧 4：明确行动 vs 建议

Claude 会按照字面意思理解你的指令。用词不同，行为完全不同：

| 说法 | Claude 行为 | 何时使用 |
|------|-----------|---------|
| "帮我修复这个 bug" | 直接修改代码 | 确认方案后执行 |
| "建议如何修复这个 bug" | 只给建议，不修改 | 想先看方案 |
| "分析这个 bug 的根因" | 只分析，不修改 | 想先理解问题 |
| "能修一下这个 bug 吗？" | 可能只给建议 | 不明确！避免 |

**最佳实践：** 想让它行动就说"做 XXX"，想让它分析就说"分析 XXX"。不要用疑问句（"能不能..."）。

### 技巧 5：解释原因

给约束加上原因，Claude 能更准确地应用：

```
❌ 不好：不要用 any 类型

✅ 好：不要用 any 类型。因为项目开启了 TypeScript strict mode，
   any 会导致类型检查失效，增加运行时错误风险。
```

知道原因后，Claude 在边界情况下也能做出正确判断（例如知道"为什么不用 any"后，它会在确实需要灵活类型时使用 `unknown` 而非 `any`）。

### 技巧 6：长文档放顶部

当需要在 prompt 中提供长文档或代码时，把文档放在 prompt 的**顶部**，把问题放在**底部**：

```
<documents>
  <document index="1">
    [粘贴整个文件内容]
  </document>
  <document index="2">
    [粘贴另一个文件内容]
  </document>
</documents>

分析以上代码中的安全漏洞。
```

**为什么有效：** 研究表明，将长文档放在 prompt 开头、查询放在结尾，可以提升高达 30% 的回答质量。这是因为 Claude 的注意力机制对开头和结尾的信息权重更高。

## 社区实战技巧

### CLAUDE.md 持久化上下文

将项目约定持久化到 CLAUDE.md，比每次在 prompt 中重复高效得多：

```markdown
# CLAUDE.md

## 项目信息
- 名称: My Awesome Project
- 技术栈: Next.js 15 + Prisma + PostgreSQL
- 包管理: pnpm

## 编码约定
- TypeScript strict mode，不用 any
- 组件用函数式 + hooks
- API 路由用 Zod 验证
- 错误处理用 AppError 类
- CSS 用 Tailwind

## 项目结构
- src/app/ — Next.js App Router 页面
- src/lib/ — 工具函数和业务逻辑
- src/components/ — React 组件
- prisma/ — 数据库 Schema 和迁移

## 常见坑
- 不要在 server component 中用 useState
- prisma 查询一定要 include relations
- 环境变量只在服务端读取
```

**实测数据：** 有团队通过优化 CLAUDE.md，在 SWE Bench 测试中将代码正确率提升了 **10.87%**——仅靠改进指令，无需调整模型或架构。

### 避免过度工程（Anti-Overengineering）

在 CLAUDE.md 或 prompt 中添加以下约束，防止 Claude 过度设计：

```
避免过度工程。只做直接需要的修改：
- 不要添加不必要的功能或重构
- 不要添加文档字符串或注释（除非明确要求）
- 不要为不会发生的场景添加错误处理
- 不要为一次性操作创建抽象层
- 保持解决方案简洁直接
```

### Prompt 自优化

用 AI 优化 AI 的 prompt——让 Claude 帮你改进你的 prompt：

```
这是我用来让 Claude 帮我重构代码的 prompt：

"""
重构 @src/utils/helpers.ts，让代码更干净
"""

请评估这个 prompt 的质量，指出问题并给出改进版本。
评估维度：具体性、完整性、约束性、可执行性。
```

## 常见 Prompt 问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 输出太泛/太短 | prompt 不够具体 | 添加具体的功能要求和质量期望 |
| 偏离主题 | 缺少上下文/动机 | 说明为什么要做这个任务 |
| 格式不一致 | 缺少格式规范 | 添加示例或结构化输出要求 |
| 复杂任务不可靠 | 任务太复杂 | 拆分为多个 prompt（prompt 链） |
| Claude 只建议不行动 | 用词不当 | 用"修改"而非"能修改吗？" |
| 出现幻觉（编造信息） | 未约束不确定性 | 添加"信息不足时说不确定，不要猜测" |
| 过度工程 | 未约束范围 | 添加"不要过度工程"约束 |
| 忽略项目约定 | 未提供上下文 | 把约定写进 CLAUDE.md |

## 高级 Prompt 模板

### 模板 A：系统架构设计

```xml
<task>
设计一个 [系统描述]
</task>

<requirements>
功能需求：
- [需求 1]
- [需求 2]

非功能需求：
- 预期负载：10,000 请求/分钟
- 延迟目标：p99 < 200ms
- 可用性：99.9%
</requirements>

<constraints>
- 现有栈：PostgreSQL + Redis + Node.js
- 团队 3 人，最小化运维复杂度
- 预算有限，优先开源方案
</constraints>

<output>
请输出：
1. 架构图描述（组件及交互）
2. 数据模型（关键实体和关系）
3. API 设计（主要端点）
4. 技术选型及理由
5. 方案的 trade-offs（放弃了什么）
6. 失败模式及应对措施
</output>

给出明确的技术推荐，不要说"都可以"。
```

### 模板 B：完整 PR 审查

```
以高级工程师身份审查这个 PR。直接、具体。

审查维度：
1. 正确性：逻辑错误、边界遗漏、竞态条件
2. 安全性：注入、认证、数据泄露
3. 性能：N+1 查询、不必要的计算、内存泄漏
4. 可维护性：命名、复杂度、单一职责
5. 遗漏：错误处理缺口、缺少测试

输出格式：
- 🔴 CRITICAL：合并前必须修复
- 🟡 WARNING：应该修复，可短暂延迟
- 🟢 SUGGESTION：建议改进
- ✅ GOOD：做得好的地方（至少列一个）
```

### 模板 C：Bug 诊断与修复

```
代码出现以下问题：

预期行为：[描述]
实际行为：[描述]
复现条件：[描述]

相关代码：@[文件路径]

请：
1. 先阅读相关代码文件
2. 用我的复现条件逐步追踪执行流程
3. 找出实际行为与预期行为分叉的具体行
4. 给出修复代码
5. 写一个回归测试防止复发

如果信息不足以判断，请说明需要什么信息，不要猜测。
```

## Anthropic 官方六大技术

Anthropic 发布了一份 PDF 文档，总结了 Claude 提示工程的六大核心技术：

1. **Direct & Clear** — 直接、明确地表达需求
2. **Provide Context** — 提供充分的上下文和背景
3. **Use Examples** — 用示例引导输出
4. **Structure with XML** — 用 XML 标签组织复杂输入
5. **Chain of Thought** — 引导逐步推理
6. **Tool Use** — 明确指定使用哪些工具

完整文档：https://www-cdn.anthropic.com/62df988c101af71291b06843b63d39bbd600bed8.pdf

## 参考资源

### GitHub 精选仓库

| 仓库 | 内容 | 链接 |
|------|------|------|
| langgptai/awesome-claude-prompts | 100+ prompt 分类合集 | [GitHub](https://github.com/langgptai/awesome-claude-prompts) |
| Rtur2003/Claude-Code-Promts | 28 个 Agent 模板 | [GitHub](https://github.com/Rtur2003/Claude-Code-Promts) |
| ykdojo/claude-code-tips | 45 个 Claude Code 技巧 | [GitHub](https://github.com/ykdojo/claude-code-tips) |
| ComposioHQ/awesome-claude-skills | Claude Skills 合集 | [GitHub](https://github.com/ComposioHQ/awesome-claude-skills) |
| hesreallyhim/awesome-claude-code | Claude Code 工具生态 | [GitHub](https://github.com/hesreallyhim/awesome-claude-code) |
| Piebald-AI/claude-code-system-prompts | Claude Code 系统提示词全览 | [GitHub](https://github.com/Piebald-AI/claude-code-system-prompts) |
| aws-samples/claude-prompt-generator | AWS 官方 prompt 生成器 | [GitHub](https://github.com/aws-samples/claude-prompt-generator) |

### 综合目录

- [awesomeclaude.ai](https://awesomeclaude.ai/) — Claude Code 全资源目录
- [promptingguide.ai](https://www.promptingguide.ai/) — Prompt 工程完整指南

### 博客与教程

- Anthropic 官方 Prompt Engineering 文档：https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/
- Anthropic 官方博客最佳实践：https://claude.com/blog/best-practices-for-prompt-engineering
- Arize CLAUDE.md 优化实践（+10.87% 准确率提升）：https://arize.com/blog/claude-md-best-practices-learned-from-optimizing-claude-code-with-prompt-learning/
