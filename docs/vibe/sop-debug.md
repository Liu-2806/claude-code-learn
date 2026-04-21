# SOP：调试排障

用 Vibe Coding 定位和修复 bug 的标准流程。

## 适用场景

- 生产环境或测试中发现了 bug
- 代码行为与预期不符
- 性能问题、异常崩溃、逻辑错误

## 前置条件

- 能复现 bug（有明确的触发条件）
- 有相关的代码文件路径
- 最好有错误日志或测试失败信息

## 流程步骤

### 步骤 1：描述 bug

**不要只说"这里有问题"——用结构化的方式描述 bug。**

直接复制模板填写：

```markdown
## Bug 描述

**现象：** [发生了什么，如"用户登录后偶尔 500 错误"]

**触发条件：** [如何复现，如"快速连续登录 3 次"]

**预期行为：** [应该发生什么，如"每次登录都返回 200"]

**相关文件：** [涉及哪些文件，如"src/auth/login.ts, src/middleware/jwt.ts"]

**错误信息：** [日志/报错原文，如"Mongoose timeout: connection exceeded 30s"]

**影响范围：** [影响多少用户/功能，如"约 5% 的登录请求"]
```

然后告诉 Claude：

```
用 Plan Mode 分析这个 bug。先不要修改任何代码。
读取 @src/auth/login.ts 和 @src/middleware/jwt.ts，找出根因。
列出所有可能的原因和修复方案。
```

::: tip 为什么先分析再修复？
调试中最常见的反模式是"还没找到根因就开始改代码"。Plan Mode 强制 Claude 先分析再执行，避免盲目修改引入新问题。
:::

### 步骤 2：定位根因

**用根因分析 checklist 辅助判断：**

| 分析维度 | 检查什么 |
|---------|---------|
| **错误类型** | 是逻辑错误、类型错误、网络错误还是资源错误？ |
| **出现频率** | 是必现还是偶发？偶发 → 可能是竞态/超时/缓存问题 |
| **最近变更** | 最后一次正常是什么时候？之后改了什么？ |
| **代码路径** | 错误发生在哪个函数调用链上？ |
| **数据状态** | 出错时输入数据是什么？是否包含边界值？ |
| **依赖状态** | 外部依赖（数据库/API）是否正常？ |

让 Claude 做这个分析：

```
按以下维度分析根因：
1. 错误类型和出现频率
2. 最近变更是否可能引入此 bug
3. 完整的代码调用链
4. 出错时可能的输入数据状态
5. 依赖服务是否正常

在 plan.md 中写出分析结果和修复方案。
```

### 步骤 3：修复验证

根因确认后，退出 Plan Mode 开始修复：

```
按 plan.md 的方案修复。修复后：
1. 运行相关模块的测试
2. 手动验证 bug 是否消除（用触发条件复测）
3. 如果测试失败，最多尝试修复两次，不要无限循环
```

**断点排查流程（Claude 循环卡住时）：**

```
如果 Claude 在修复中反复循环：
1. Ctrl+C 终止当前会话
2. /compact 压缩历史
3. 重新描述任务，加上额外约束："只修改 [具体文件]，只改 [具体位置]，不要改其他代码"
4. 如果仍循环，降低 maxTurns 到 30-50
```

### 步骤 4：防复发

修复确认后，防止同样的 bug 再次出现：

```
为这个 bug 添加一个回归测试，确保未来不会再出现。
测试名：test-[bug简述]。
放在 [对应测试文件] 中。
```

同时在 CLAUDE.md 或 decision-log 中记录：

```markdown
## Bug 记录：[bug 简述]

**根因：** [根因描述]
**修复：** [修复方式]
**防复发：** [添加的回归测试名]
**教训：** [经验总结，如"异步操作必须处理超时"]
```

## 实战案例：生产环境登录 Bug 修复

以下是一个真实的调试案例，完整展示了 SOP 调试流程。

**背景：** 一个 Node.js + Express 的认证系统，生产环境偶尔出现用户登录后返回 500 错误。

### 步骤 1：描述 Bug

```
## Bug 描述

现象：用户点击登录后，约 5% 的请求返回 500 错误
触发条件：不确定，偶发，无明显规律
预期行为：登录成功返回 JWT token + 用户信息
相关文件：src/auth/login.ts, src/middleware/auth.ts, src/db/connection.ts
错误信息：TypeError: Cannot read properties of undefined (reading 'password')
影响范围：所有用户，高峰期更频繁
```

### 步骤 2：Claude 分析根因

```
你：用 Plan Mode 分析以下 bug：

[粘贴 bug 描述]

先不要修改任何代码。
读取 @src/auth/login.ts 和相关文件，找出根因。
列出所有可能的原因，按可能性排序。

Claude：[Plan Mode 分析中...]

  1. [Read] src/auth/login.ts
  2. [Read] src/middleware/auth.ts
  3. [Read] src/db/connection.ts
  4. [Grep] 搜索 password 字段的使用

  分析结果：

  最可能的根因：login.ts 第 35 行，从 req.body 中读取 password，
  但 auth.ts 中间件在处理某些请求时会修改 req.body 结构，
  将 { email, password } 改为 { user: { email, password } }。

  当 auth 中间件先于 login handler 执行时，req.body.password
  变为 undefined → 触发 TypeError。

  为什么偶发：取决于请求到达时中间件的执行顺序，
  并发高时可能出现竞态条件。

  修复方案：
  方案 A：在 login.ts 中兼容两种 body 结构
  方案 B：修复 auth.ts 中间件，不修改原始 body 结构
  推荐方案 B（治本）
```

### 步骤 3：修复验证

```
你：（退出 Plan Mode）
    按方案 B 修复。完成后运行 npm test 验证。

Claude：
  1. [Edit] 修改 src/middleware/auth.ts — 不再修改 req.body
  2. [Edit] 在 login.ts 中添加防御性检查
  3. [Bash] npm test → 1 个测试失败
  4. [Read] 读取失败测试 — auth 中间件的 mock 需要更新
  5. [Edit] 修复测试中的 mock 数据
  6. [Bash] npm test → 全部通过 ✓
```

### 步骤 4：防复发

```
你：为这个 bug 添加回归测试。

Claude：
  1. [Edit] 创建 test/auth/login-race-condition.test.ts
  2. 测试用例：
     - 模拟并发登录请求（10 个同时发出）
     - 验证所有请求都正确返回 200
     - 验证 req.body 结构不被中间件篡改
  3. [Bash] npm test → 通过 ✓
```

**最终记录：**

```markdown
## Bug 记录：登录偶发 500 错误

根因：auth 中间件修改了 req.body 结构，login handler 读取 req.body.password 时变为 undefined
修复：中间件不再修改原始 body + login handler 添加防御性检查
防复发：test/auth/login-race-condition.test.ts
教训：中间件不应修改请求对象的原始结构；对 req.body 的字段读取要添加防御性检查
```

::: tip 关键经验
这个案例展示了 SOP 调试流程的价值：
1. **先分析再修复** — Plan Mode 准确定位了竞态条件根因，避免了盲目修改
2. **自愈循环** — Claude 自己发现测试失败并修复了 mock 数据
3. **回归测试** — 并发测试确保同样的 bug 不会复发
:::

## 可复用模板

### Bug 描述模板

```markdown
## Bug 描述

**现象：** [发生了什么]
**触发条件：** [如何复现]
**预期行为：** [应该发生什么]
**相关文件：** [涉及的文件路径]
**错误信息：** [日志/报错原文]
**影响范围：** [影响评估]
```

### Bug 记录模板

```markdown
## Bug 记录：[简述]

**根因：** [根因]
**修复：** [修复方式]
**防复发：** [回归测试名]
**教训：** [经验总结]
```

## 常见问题

**Q：bug 无法复现怎么办？**
A：让 Claude 分析可能的原因并添加更详细的日志。"在 [关键位置] 添加详细日志，记录 [变量名] 的值和执行路径。不要修改业务逻辑。"

**Q：多个 bug 同时出现怎么处理？**
A：逐个处理——每个 bug 单独一个会话。不要让 Claude 在一个会话中修复多个 bug，上下文会混乱。

**Q：根因分析不确定怎么办？**
A：让 Claude 提出多个假设和验证方法。"列出 3 个最可能的根因假设，对每个假设给出验证方法（如加什么日志、跑什么测试）。"

## 与其他 SOP 的关系

- **前置 SOP：** 无（调试通常是被动触发）
- **后续 SOP：** [SOP：审查发布](/vibe/sop-review)（修复后准备发布）
- **配合技巧：** [反模式 4：无限修复循环](/vibe/anti-patterns#反模式-4无限修复循环infinite-fix-loop)、[失败复盘](/examples/failure-recovery)