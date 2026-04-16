# 什么是 Vibe Coding

Vibe Coding 是一种 AI 辅助开发方式——你用自然语言描述意图，AI 负责实现细节，你负责审查和决策。它不是"偷懒"，而是**重新定义人与 AI 在编码中的分工**。

## 起源

2025 年 2 月，Andrej Karpathy（前特斯拉 AI 总监、OpenAI 联合创始人）在社交媒体上提出了这个概念：

> "I call it 'vibe coding' — when you just sit back and let the AI write all the code. You don't even really review it. You just vibe."

Karpathy 后续补充说明，Vibe Coding **不是放弃理解**。它最有效的时候，恰恰是你已经有了扎实基础的时候。他把它比作"骑一辆带电机的自行车——你仍然需要转向，只是不用那么费力蹬了"。

## 与传统编码的区别

| 维度 | 传统编码 | Vibe Coding |
|------|---------|-------------|
| **你做什么** | 手写每一行代码 | 用自然语言描述意图和约束 |
| **AI 做什么** | 无 / 仅补全下一行 | 生成完整实现、搜索代码、运行测试 |
| **核心技能** | 语法、算法、API 记忆 | 意图表达、约束定义、审查判断 |
| **错误修复** | 你发现 → 你修 | AI 发现 → AI 自修 → 你审查修复结果 |
| **产出节奏** | 逐行渐进 | 快速生成 → 审查 → 精修 |
| **上下文管理** | 你自己记忆所有细节 | CLAUDE.md + 文件驱动，AI 维护上下文 |

## 三级认知模型

不同水平的开发者对 Vibe Coding 的理解和适用方式不同：

### 新手：先学基础再 Vibe

- **理解：** "AI 能帮我写代码，我不需要学编程了"
- **实际风险：** 无法审查 AI 输出，无法判断对错，出了问题无法调试
- **正确做法：** 先掌握核心编程概念（变量、函数、条件、循环、错误处理），再用 Vibe Coding 加速。你不需要精通每个 API，但必须能**读懂代码、理解逻辑、判断正确性**

### 中级：Vibe 是加速器

- **理解：** "我可以描述意图让 AI 实现，但要审查结果"
- **适用方式：** 用 Vibe Coding 处理你熟悉领域的任务——你能判断 AI 输出是否合理。不熟悉的领域，先学习再 Vibe
- **关键技能：** 识别 AI 输出中的隐含假设和边界遗漏

### 高级：Vibe 是架构工具

- **理解：** "我用 Vibe Coding 处理实现细节，专注于架构和决策"
- **适用方式：** 写 spec 定义架构约束，让 AI 执行实现，你审查架构一致性
- **关键技能：** 设计 spec、维护决策日志、编排多 agent 协作

## 与 Agentic Coding 的关系

Agentic Coding 是 Claude Code 的核心机制——AI 自主完成"理解→规划→执行→验证→修正"的迭代循环。Vibe Coding 是开发者视角的方法论——你如何与这个 Agentic 系统协作。

| | Agentic Coding | Vibe Coding |
|---|----------------|-------------|
| **视角** | AI 的运行机制 | 人的工作方式 |
| **关注点** | 循环过程、自愈机制 | 意图表达、审查决策 |
| **关系** | AI 如何自主工作 | 你如何引导 AI 工作 |

两者是互补的：Agentic Coding 描述**引擎怎么转**，Vibe Coding 描述**方向盘怎么握**。

## 一个 Vibe Coding 会话的样子

```
你：
帮我在 src/api/userHandler.ts 里添加输入验证。
约束：用 Zod schema，验证 email 格式和 phone 可选。
不改动测试文件，改完后跑测试确认通过。

Claude：
→ 读取 userHandler.ts
→ 理解现有代码结构
→ 添加 Zod import 和 schema 定义
→ 在 handler 入口插入验证逻辑
→ 运行 npm test → 全部通过 ✓
→ 展示修改摘要

你：
审查修改 → 发现 schema 里 phone 验证允许了空字符串
→ "phone 字段不允许空字符串，只允许 null 或合法号码"

Claude：
→ 修改 schema：phone 用 union(null, string.regex)
→ 再跑测试 → 通过 ✓
```

注意：你没有写一行代码，但你做了**两个关键决策**——初始约束定义和修正审查。这就是 Vibe Coding 的核心。

## 下一步

- [思维转变](/vibe/mindset-shift) — 从"写代码"到"描述意图"的 5 个思维转变
- [核心原则](/vibe/core-principles) — Vibe Coding 的 5 大核心原则
- [反模式与陷阱](/vibe/anti-patterns) — 7 大常见反模式和对策