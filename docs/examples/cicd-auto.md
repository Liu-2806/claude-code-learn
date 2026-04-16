# CI/CD 自动化

**背景：** 团队希望在每个 PR 提交时自动审查代码变更，找出潜在的安全和性能问题。

## 第一步：设置 GitHub Actions

创建 `.github/workflows/ai-review.yml`：

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

**注意：** API Key 必须通过 GitHub Secrets 存储，不要硬编码在 workflow 文件中。

## 第二步：单次手动审查

不在 CI 中也可以手动审查：

```bash
claude -p "检查 src/ 下所有 TypeScript 文件，列出未处理的 Promise" --output-format json

claude -p "审查 PR #42 的安全风险" --model opus --allowedTools Read,Grep --output-format json
```

## 第三步：SDK 集成（进阶）

如果想在自己的工具中嵌入 Claude Code：

```javascript
import { query } from '@anthropic-ai/claude-code';

const result = await query({
  prompt: "审查 auth.ts 中的安全风险",
  options: {
    model: "sonnet",
    allowedTools: ["Read", "Grep"]
  }
});
```

SDK 方式适合构建内部 AI 辅助工具、批量自动化任务，或将 Claude Code 作为子代理嵌入多 agent 系统。

## 其他自动化场景

| 场景 | 命令 |
|------|------|
| 依赖升级检查 | `claude -p "检查 package.json 中的过期依赖，建议升级版本"` |
| 文档自动生成 | `claude -p "为 src/api/ 下所有端点生成 API 文档"` |
| 发布前检查 | `claude -p "检查即将发布的变更中是否有 console.log 残留"` |
| 继续上次调试 | `claude --continue --print --output-format json` |

::: tip 关键经验
- 非交互模式 `-p` 让 Claude Code 执行完直接退出，适合 CI/CD
- `--output-format json` 输出结构化数据，方便程序解析
- `--allowedTools` 限制工具范围，控制权限边界
- 详见[CI/CD 与自动化](/guide/cicd)章节