# PetPics Web — MVP 骨架

Next.js 15 (App Router) + TypeScript + 8 语 i18n + 引擎抽象层（OpenRouter Nano Banana / Mock 双模）。

## 启动

```bash
cd web
npm install
cp .env.example .env.local   # 不配任何 Key 也能跑（自动 Mock 引擎）
npm run dev                  # http://localhost:3000
```

配置 `OPENROUTER_API_KEY` 后，锚点/批量生成/日记自动切换为真实 Nano Banana 调用（技术调研 §1.1）。

## 已实现（对齐 MVP 需求 v1.3 + 链路文档 v1.4 意图先行）

| 链路 | 路由 | 状态 |
|---|---|---|
| 选宠物（单宠自动跳过） | `/pets` | ✅ |
| 档案 30 秒（4 必填 + 性格标签 + profileDone 判定） | `/pet/new` | ✅ |
| 物品选做（三类） | `/pet/items` | ✅ |
| 创作页（6 模板 + 自定义描述 + 风格入口） | `/create` | ✅ |
| 18 风格（性格推荐重排） | `/styles` | ✅ |
| 上传（意图过渡横幅） | `/upload` | ✅ 模拟上传 |
| 锚点生成/确认（👍/👎，免费重画×1） | `/anchor` | ✅ 真实/Mock |
| 预览付费墙（日记预告 + 双档） | `/preview` | ✅ Mock 结账 |
| 处理庆典 | `/processing` | ✅ |
| 作品库 | `/library` | ✅ |
| 礼物编排 + 收礼人页 | `/gift` `/gift/open` | ✅ |
| 宠物日记（LLM 文案） | `/diary` | ✅ 真实/Mock |
| 账户 | `/account` | ✅ |
| 落地页 | `/` | 骨架（从原型 HTML 移植完整版） |

## 接入点（生产化清单）

| 模块 | 文件 | 状态 | 生产动作 |
|---|---|---|---|
| 用户体系 | `src/auth.ts` + `/login` | ✅ 已接 | 配 `GOOGLE_CLIENT_ID/SECRET` + `AUTH_SECRET` + `NEXT_PUBLIC_AUTH_ENABLED=true` → Google OAuth + 邮箱 magic link 生效；未配置自动 Demo 登录 |
| 数据层 | `src/lib/db.ts` + `/api/state` | ✅ 已接 | Supabase 建表（`supabase/schema.sql`）+ 填 3 个环境变量 → 服务端持久化；未配置用本地 `.data/` 文件（仅本地开发） |
| 图片存储 | `src/lib/engine/*` 返回 data-URL | 骨架 | R2 直传（`putObject` 后回 URL） |
| 支付 | `src/app/api/paddle/webhook` | 骨架 | 校验签名 + 驱动订单状态；前端接 Paddle.js overlay |
| 邮件 | 新增 `lib/mail.ts` | 骨架 | Resend（7 封触发邮件，见链路文档 §5） |
| 队列 | `api/generate/batch` | 骨架 | 迁 Inngest（50/100 张分片 + 断点续传） |
| 分析 | `layout.tsx` | 骨架 | PostHog 漏斗埋点（链路文档 §6 事件字典） |

## 用户体系与数据流（v1.5 已接）

```
/login（Google / 邮箱 / Demo）→ Auth.js JWT 会话
    → 所有页面经 (app) 路由组 AppData 网关：未登录 → /login
    → GET /api/state 拉取服务端数据（按用户隔离）
    → 页面操作写 localStorage（即时）+ debounce 800ms PUT /api/state（服务端持久化）
    → 刷新/换设备 syncFromServer 自动恢复
```

- 数据访问只在服务端 API（SERVICE_ROLE，绕过 RLS），前端永远不直接碰数据库
- 双模降级：不配 Supabase → `.data/*.json` 文件（仅本地）；不配 Google → Demo 邮箱登录

## 与文档的关系

- 链路/交互以《完整链路与交互逻辑.md》为准（意图先行 v1.4）
- 生成成本与降级预案见《技术方案调研.md》§1.4
- 设计 tokens 见 `src/lib/tokens.css`（与设计文档 §2.1 一致）
