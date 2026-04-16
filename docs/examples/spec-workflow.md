# spec→plan→tasks 实战

```bash
# 你先写好 spec.md
cat > spec.md << 'EOF'
# 项目：博客系统 API

## 需求
- 文章 CRUD、评论系统、用户认证
- 支持 Markdown 渲染

## 约束
- Node.js + Express + SQLite
- 无外部认证服务
EOF

# 让 Claude 生成 plan.md
claude -p "读取 spec.md，生成 plan.md 实施计划"

# 审查 plan.md（建议在新会话中）
# 让 Claude 生成 tasks.md
claude -p "读取 plan.md，生成 tasks.md 任务清单"

# 逐条执行
claude
> 开始执行 tasks.md 中的任务 1-3：搭建项目结构和数据模型
```

详见[spec → plan → tasks 结构化工作流](/advanced/spec-plan-tasks)和[多会话协作策略](/advanced/multi-session)。