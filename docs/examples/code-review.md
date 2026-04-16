# 代码审查与重构

**背景：** 项目中 `src/utils/` 目录下有多个工具函数文件，存在重复逻辑，需要审查并重构。

## 第一步：让 Claude 发现问题

```
读取 src/utils/ 下所有文件，找出重复的逻辑。不要直接修改，先在 plan.md 中写出重构方案。
```

## Claude 的典型分析过程

```
▶ Claude 正在读取文件...
  → 读取 src/utils/format.ts（发现 formatDate、parseDate、toISOString 三处时间处理）
  → 读取 src/utils/validate.ts（发现 validateEmail 和 format.ts 中的正则重复）
  → 读取 src/utils/logger.ts（发现多处 console.log 封装模式重复）

▶ Claude 分析结果：
  1. format.ts 中 formatDate 和 parseDate 都包含 ISO 时间解析逻辑，可合并
  2. validate.ts 中的 email 正则与 format.ts 中的 email 格式化使用了同一正则
  3. logger.ts 中三种日志级别（info/warn/error）的封装结构几乎相同，可抽取为通用函数

  建议重构方案：
  - 提取公共时间解析函数到 src/utils/date.ts
  - 提取公共正则到 src/utils/patterns.ts
  - 重构 logger 为基于配置的单函数实现
```

## 第二步：审查方案

确认 Claude 的方案是否合理：
- 是否真的需要拆出 `patterns.ts`？如果正则只被两个文件用，保持原位可能更简单
- 重构后对外接口是否不变？调用方不需要改代码

## 第三步：执行重构

```
按 plan.md 的方案重构。重构后运行 npm test，确认所有测试通过。
对外接口不变——调用方不需要修改。
```

Claude 按计划逐文件重构，每步请求你确认。

## 第四步：验证

```
运行完整测试套件，确认重构没有引入新问题。
搜索是否有残留的旧代码引用（import 旧路径、调用旧函数名）。
```

::: tip 关键经验
- 重构前必须有测试覆盖——没有测试就先让 Claude 补写测试
- 先让 Claude 在 plan.md 中写出方案，审查后再执行
- 每次只重构 2-3 个文件，完成后 checkpoint commit
- 详见[多会话协作策略](/advanced/multi-session)和[SOP：重构迁移](/vibe/sop-refactor)
:::