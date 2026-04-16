# 从零搭建项目

**背景：** 你要创建一个新的 Express + MongoDB 后端项目。

## 第一步：启动 Claude Code

```bash
cd ~/projects
mkdir my-app && cd my-app
git init
claude
```

## 第二步：描述任务

```
帮我搭建一个 Express + MongoDB 的后端项目，包含用户注册、登录和 CRUD 接口。用 TypeScript，项目结构按模块划分。
```

## Claude 的典型执行过程

```
▶ Claude 正在搜索项目结构...
  → 发现是空目录，没有现有代码

▶ Claude 正在制定计划...
  → 规划目录结构：src/routes, src/models, src/middleware, src/utils
  → 规划文件列表：app.ts, routes/user.ts, models/User.ts, middleware/auth.ts

▶ Claude 正在编辑文件...
  → 创建 package.json（请求确认 ✓）
  → 创建 tsconfig.json（请求确认 ✓）
  → 创建 src/app.ts（请求确认 ✓）
  → 创建 src/routes/user.ts（请求确认 ✓）
  → 创建 src/models/User.ts（请求确认 ✓）
  → 创建 src/middleware/auth.ts（请求确认 ✓）

▶ Claude 正在运行命令...
  → npm install express mongoose bcrypt jsonwebtoken（请求确认 ✓）
  → npm install -D typescript @types/express @types/mongoose（请求确认 ✓）

▶ 完成！项目结构如下：
  my-app/
  ├── package.json
  ├── tsconfig.json
  └── src/
      ├── app.ts           # Express 入口
      ├── routes/
      │   └── user.ts      # 用户路由（注册、登录、CRUD）
      ├── models/
      │   └── User.ts      # Mongoose 用户模型
      └── middleware/
      │   └── auth.ts      # JWT 认证中间件
```

## 第三步：验证

```
帮我运行一下，确认启动没问题
```

Claude 会运行 `npm run dev`，观察输出，如果报错会自动修复。