# 调试遗留代码

**背景：** auth 模块有 bug，用户登录后偶尔 500 错误。

## 第一步：用 Plan Mode 先分析

```
这个 auth 模块有 bug，用户登录后偶尔会 500 错误。先不要修改，帮我分析原因。
```

（按 Ctrl+P 进入 Plan Mode，让 Claude 只分析不修改）

## Claude 的典型分析过程

```
▶ Claude 正在读取文件...
  → 读取 src/auth/auth.ts（发现 42 行有类型推断问题）
  → 读取 src/auth/auth.test.ts（发现缺少 500 错误的测试覆盖）

▶ Claude 分析结果：
  1. 第 42 行的 try-catch 缺少对 Mongoose 连接超时的处理
  2. JWT verify 在 token 格式异常时抛出未捕获的 SyntaxError
  3. 缺少对 null 用户对象的防御性检查
  
  建议修复方案：
  - 在 catch 块中区分 Mongoose 超时和 JWT 错误
  - 用 jwt.verify 的回调形式替代同步调用
  - 添加 null 检查防护
```

## 第二步：退出 Plan Mode，执行修复

（按 Ctrl+P 退出 Plan Mode）

```
按上面的方案修复这三个问题
```

Claude 逐条修复，每次修改请求你确认。

## 第三步：验证修复

```
帮我运行 auth 模块的测试，确认修复没问题
```

::: tip 关键经验
调试遗留代码时，先用 Plan Mode 分析，再执行修复，避免 Claude 在不了解全局的情况下乱改代码。
:::