# CI/CD 与自动化

Claude Code 不只是交互式工具，它也可以嵌入自动化流程中。

## 非交互 / Headless 模式

使用 `-p`（print 模式）让 Claude Code 非交互执行任务。完整的参数说明见[基本使用 - 非交互模式参数](/guide/basic-usage#非交互-headless-模式参数)和[基本使用 - 输出格式](/guide/basic-usage#输出格式-output-format)。

### 常用 CI/CD 命令速查

```bash
# 单次执行任务后退出
claude -p "检查 src/ 下所有 TypeScript 文件，列出未处理的 Promise"

# 输出 JSON 格式，方便程序解析
claude -p "分析这个仓库的测试覆盖率" --output-format json

# 指定模型和工具范围
claude -p "审查 PR 的安全风险" --model opus --allowedTools Read,Grep,Bash
```

### 会话恢复

在 CI/CD 中继续之前交互会话的工作：

```bash
claude --continue --print                          # 继续最近会话 + headless
claude --resume <session-id> --print               # 恢复指定会话 + headless
claude --continue --print --output-format json     # 继续会话 + JSON 输出
```

更多会话恢复用法见[基本使用 - 会话管理](/guide/basic-usage#会话管理)。

::: tip 什么时候用 --continue？
当你在一个交互会话中做了部分工作，想让 CI/CD 继续完成剩余步骤时。例如：交互会话中调试了 bug，确认修复方向后，用 `--continue --print` 在 CI 中自动跑完测试和提交。
:::

## GitHub Actions 示例

以下是一个在 CI 中自动审查 PR 的 workflow：

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: AI Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "审查这个 PR 的代码变更，指出潜在的 bug、安全风险和性能问题。输出格式为 Markdown。" \
            --output-format json > review-result.json

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const result = JSON.parse(fs.readFileSync('review-result.json', 'utf8'));
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: result.result || result.message
            });
```

::: warning 注意
API Key 必须通过 GitHub Secrets 存储，不要硬编码在 workflow 文件中。
:::

## Claude Code SDK

除了 CLI，Claude Code 还提供 SDK 方式嵌入你的 Node.js 应用：

```javascript
import { query } from '@anthropic-ai/claude-code';

// 基本调用
const result = await query({
  prompt: "修复 auth.ts 中的类型错误",
  options: {
    model: "sonnet",
    allowedTools: ["Read", "Edit", "Bash"]
  }
});

console.log(result);
```

SDK 方式适合：
- 构建自定义 AI 辅助工具
- 内部开发平台
- 批量自动化任务
- 将 Claude Code 作为子代理嵌入多 agent 系统中

## 自动化场景举例

| 场景 | 命令 |
|------|------|
| PR 自动审查 | `claude -p "审查 PR 的安全风险" --model opus --output-format json` |
| 依赖升级检查 | `claude -p "检查 package.json 中的过期依赖，建议升级版本"` |
| 文档自动生成 | `claude -p "为 src/api/ 下所有端点生成 API 文档"` |
| 代码风格统一 | `claude -p "统一 src/ 下所有文件的 import 排序规则"` |
| 发布前检查 | `claude -p "检查即将发布的变更中是否有 console.log 残留"` |
| 继续上次调试 | `claude --continue --print --output-format json` |