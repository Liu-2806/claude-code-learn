# 模型选择与定价

Claude Code 支持三种 Claude 模型，不同场景适合不同选择：

| 模型 | 特点 | 适用场景 | 启动方式 |
|------|------|----------|----------|
| **Opus 4.6** | 深度推理能力强，慢，贵 | 复杂架构设计、大规模代码迁移、疑难 bug | `claude --model opus` |
| **Sonnet 4.6** | 性价比最优，速度与能力平衡 | 日常编码、重构、调试 | 默认或 `claude --model sonnet` |
| **Haiku 4.5** | 快速低成本 | 快速补全、格式化、简单问答 | `claude --model haiku` |

::: info 模型版本说明
Claude 模型持续更新。以上版本号为当前最新（Opus 4.6 / Sonnet 4.6 / Haiku 4.5）。使用 `claude --model opus` 时会自动使用对应系列的最新版本，无需指定完整版本号。
:::

## 定价参考

Claude Code 使用 Anthropic API，按 token 计费。以下为当前定价（**截至 2026年4月**，具体价格可能调整，请以[官方定价页](https://docs.anthropic.com/en/docs/about-claude/pricing)为准）：

| 模型 | 输入价格 | 输出价格 | 相对成本 |
|------|----------|----------|----------|
| **Opus 4.6** | $15 / 百万 token | $75 / 百万 token | 最贵，约为 Sonnet 的 5x |
| **Sonnet 4.6** | $3 / 百万 token | $15 / 百万 token | 性价比最优 |
| **Haiku 4.5** | $0.80 / 百万 token | $4 / 百万 token | 最便宜，约为 Sonnet 的 1/4 |

::: tip 成本控制建议
- 日常编码用 Sonnet 4.6 即可；只在真正需要深度推理时才用 Opus 4.6
- 一个复杂任务用 Opus 可能花费 $1-5，同样的任务用 Sonnet 通常 $0.2-1
- Batch API 提供 50% 折扣，适合非实时的批量任务
- 复杂任务先用 Plan Mode 规划，避免 Claude 反复试错浪费 token
- Prompt Caching 可减少重复上下文的 token 消耗（详见[上下文管理与性能调优](/guide/context-management#prompt-caching)）
:::

## 快速模式

快速模式使用同模型但输出更快，不会切换到更低级的模型。

启动时使用 `--fast`，或在会话中使用 `/fast` 切换。