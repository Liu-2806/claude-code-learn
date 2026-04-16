# Agentic Coding 工作原理

Claude Code 的核心不是简单的"单次问答→代码生成"，而是 **Agentic Coding**——自主迭代循环。

## 传统 AI 编码 vs Agentic Coding

| 维度 | 传统 AI 编码 | Agentic Coding |
|------|-------------|----------------|
| 模式 | 单次问答生成 | 多步迭代，自主决策 |
| 工具使用 | 无 | 读写文件、执行命令、搜索代码 |
| 反馈循环 | 无 | 执行 → 验证 → 修正 → 再执行 |
| 上下文 | 单次输入 | 持续积累项目上下文 |
| 错误处理 | 依赖人工 | 自主识别并修复错误 |

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

## 自愈机制

Agentic Coding 最强大的特性是**自愈**——Claude 在遇到问题时自动修正：

**典型自愈场景：**

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

**自愈的边界：**
- Claude 能处理**编译错误、测试失败、lint 报错**等有明确反馈的问题
- Claude **无法处理**没有反馈的问题（如性能退化、业务逻辑错误）——这些需要你人工判断

## 多层代理架构

Claude Code 可以作为**子代理**嵌入更大的 agentic 系统中：

```
主代理（Orchestrator）
  ├── 规划代理：分析需求，制定方案
  ├── Claude Code 子代理：执行代码相关任务
  │     （通过 --print --allowedTools 模式调用）
  ├── 审查代理：验证产出质量
```

**实现方式：**

```bash
# 主代理通过 headless 模式调用 Claude Code 作为子代理
claude -p "实现 XXX 功能" --print --allowedTools Read,Edit,Bash --output-format json
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
```

::: tip 核心优势
Agentic Coding 的本质是**闭环反馈**——不像传统 AI 生成代码后需要你手动验证和修改，Claude Code 自己完成"执行→验证→修正"的循环，大幅减少人工介入。
:::