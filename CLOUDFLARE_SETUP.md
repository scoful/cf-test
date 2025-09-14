# Cloudflare D1 和触发器设置指南

本指南将帮助你设置 Cloudflare D1 数据库和触发器功能。

## 前置条件

1. 安装 Wrangler CLI（已完成）
2. 登录 Cloudflare 账户

```bash
pnpm wrangler login
```

## 步骤 1: 创建 D1 数据库

```bash
# 创建 D1 数据库
pnpm run cf:d1:create

# 这将输出数据库 ID，复制它并更新 wrangler.toml 中的 database_id
```

## 步骤 2: 更新配置文件

1. 将步骤 1 中获得的数据库 ID 更新到 `wrangler.toml` 和 `wrangler-trigger.toml` 中：

```toml
[[d1_databases]]
binding = "DB"
database_name = "cf-test-db"
database_id = "your-actual-database-id-here"  # 替换为实际的 ID
```

## 步骤 3: 运行数据库迁移

```bash
# 本地迁移（用于测试）
pnpm run cf:d1:migrate

# 生产环境迁移
pnpm run cf:d1:migrate:prod
```

## 步骤 4: 本地开发测试

```bash
# 启动本地开发服务器
pnpm dev

# 在另一个终端预览 Cloudflare Workers 环境
pnpm run cf:preview
```

访问 `http://localhost:3000/test-d1` 测试数据库功能。

## 步骤 5: 部署主应用

```bash
# 构建并部署到 Cloudflare Pages
pnpm run cf:deploy
```

## 步骤 6: 部署触发器 Worker

```bash
# 使用触发器配置文件部署 Worker
pnpm wrangler deploy --config wrangler-trigger.toml
```

## 步骤 7: 设置触发器路由（可选）

如果你想通过 HTTP 请求触发 Worker：

1. 在 Cloudflare Dashboard 中设置自定义域名
2. 更新 `wrangler-trigger.toml` 中的路由配置
3. 重新部署触发器 Worker

## 环境变量

### 本地开发 (.dev.vars)
```
NEXTJS_ENV=development
NODE_ENV=development
DATABASE_URL=file:./db.sqlite
```

### 生产环境
在 Cloudflare Dashboard 中设置环境变量，或使用 wrangler：

```bash
pnpm wrangler secret put DATABASE_URL
```

## 可用的脚本

- `pnpm run cf:preview` - 本地预览 Cloudflare 环境
- `pnpm run cf:deploy` - 部署到 Cloudflare Pages
- `pnpm run cf:upload` - 上传新版本
- `pnpm run cf:typegen` - 生成 Cloudflare 类型定义
- `pnpm run cf:d1:create` - 创建 D1 数据库
- `pnpm run cf:d1:migrate` - 本地数据库迁移
- `pnpm run cf:d1:migrate:prod` - 生产环境数据库迁移
- `pnpm run cf:d1:console` - D1 数据库控制台

## 测试功能

1. **数据库操作**: 访问 `/test-d1` 页面测试 CRUD 操作
2. **API 端点**: 测试 `/api/posts` 端点
3. **触发器**: 部署后可通过 `/trigger/*` 端点测试触发器

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 确保 D1 数据库 ID 正确配置
   - 检查 wrangler.toml 中的绑定名称

2. **本地开发问题**
   - 确保 `.dev.vars` 文件存在
   - 检查 SQLite 数据库文件权限

3. **部署失败**
   - 确保已登录 Cloudflare 账户
   - 检查 wrangler 版本（需要 3.99.0+）

### 调试命令

```bash
# 检查 D1 数据库状态
pnpm wrangler d1 info cf-test-db

# 查看 Worker 日志
pnpm wrangler tail

# 测试本地 Worker
pnpm wrangler dev
```

## 下一步

1. 根据业务需求扩展数据库 schema
2. 添加更多触发器逻辑
3. 配置 R2 存储用于文件上传
4. 设置 KV 存储用于缓存
5. 添加认证和授权
