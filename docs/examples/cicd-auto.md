# CI/CD 自动化

**背景：** 团队希望在每个 PR 提交时自动审查代码变更，找出潜在的安全和性能问题。

## 方案：GitHub Actions + Claude Code

完整的 workflow 配置和参数说明见[CI/CD 与自动化](/guide/cicd)章节。这里只讲实际部署中的关键决策。

### 需要提前准备的

- 在 GitHub 仓库的 Settings → Secrets 中添加 `ANTHROPIC_API_KEY`
- 确认仓库已有基本的测试套件（AI 审查的价值建立在代码本身有测试的基础上）

### 审查 prompt 的选择

不同场景用不同的审查 prompt：

| 场景 | 推荐审查 prompt |
|------|----------------|
| 通用 PR 审查 | `"审查代码变更，指出潜在的 bug、安全风险和性能问题"` |
| 安全专项审查 | `"重点检查注入、泄露、未授权访问等安全风险"` |
| 性能专项审查 | `"重点检查 N+1 查询、内存泄漏、不必要的同步操作"` |

prompt 写得越具体，审查结果越有价值。笼统的"审查代码"会产出泛泛的评论。

### 审查结果如何处理

AI 审查输出的 JSON 中包含 `result` 字段，里面是 Markdown 格式的审查报告。实际使用中：

- **不是所有发现都要修** — 按 🔴 严重 / 🟡 中等 / 🟢 低风险分级，只修严重的
- **AI 审查 + 人工审查结合** — AI 扫量大（安全、性能），人审关键（业务逻辑）
- **审查结果不要自动合并** — 应作为 PR 评论发布，让开发者自己决定是否修复

## 手动单次审查

不在 CI 中也可以手动审查一个 PR：

```bash
claude -p "审查 PR #42 的安全风险" --model opus --allowedTools Read,Grep --output-format json
```

## SDK 集成

如果想在自己的工具中嵌入 Claude Code，可以使用 SDK 方式调用。详见[CI/CD 与自动化 - Claude Code SDK](/guide/cicd#claude-code-sdk)。

::: tip 关键经验
- 非交互模式 `-p` 让 Claude Code 执行完直接退出，适合 CI/CD
- `--output-format json` 输出结构化数据，方便程序解析
- 审查 prompt 要具体，不要笼统写"审查代码"
- AI 审查发现不是所有都要修——按严重程度分级处理
