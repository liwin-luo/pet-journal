# PetsDaily — 宠物 AI 图片生成站（petsdaily.live）

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4。聊天框输入诉求 + 上传宠物照片 → AI 出图；100 个可复制提示词的模板中心；用户作品与评价页（SEO）；FAQ；隐私政策等合规页。大模型与生图接口沿用 `~/petpics` 参考项目验证过的密钥与调用方式。

## 快速开始

```bash
npm install
cp .env.example .env.local   # 已配好密钥；不配 ARK/TEXT 密钥会自动用 Mock 引擎
npm run dev                  # http://localhost:3000
```

- 配了 `ARK_API_KEY` + `TEXT_API_KEY` → 真实生成（GLM 规划提示词 → Seedream 出图，约 30–60s）
- 没配 → Mock 引擎返回占位图，全流程可跑通，零成本开发

## 生成链路

```
POST /api/upload   校验+存图（≤4张，≤5MB，jpg/png/webp）
POST /api/generate  审核 → GLM 把"原话+模板提示词"合成英文出图提示词（失败降级直拼）
                    → Seedream 参考图出图 → 存 .data/generated → 返回 /api/media/{id} + shareToken
```

- 限流：**每人每天 3 次**（`FREE_DAILY_LIMIT` 可配置）；登录按账号计，匿名按设备 cookie 计；生成成功才计数
- 登录：Google OAuth（仅下载需要登录，生成不强制）；会话为 HMAC 签名 httpOnly cookie（30 天），无数据库
- 下载保护：`/api/media/{id}` 对生成图鉴权（登录 / 分享令牌 `?st=` / 已入画廊作品三种通行）
- 审核：关键词黑名单 + **GLM 语义门控**——非宠物诉求、人物主体、色情/歧视/暴力/违法内容一律拒绝（语义门控失败时 fail-closed）
- 无数据库依赖：JSON 文件库 `.data/db.json`，图片 `.data/{uploads,generated}/`
- 生成历史：`GET /api/history` 按设备/账号返回最近 24 张；生成器面板顶部 "Your pictures" 区可随时找回（登录前后都有效）
- 审核后台：`/admin?key=ADMIN_KEY` 审批/拒绝画廊投稿（`ADMIN_KEY` 在 .env.local，上线换长随机串）

## 上线清单（按顺序）

1. **域名与品牌**：`.env.local` 里改 `NEXT_PUBLIC_SITE_URL`（你买的域名，含 https）、`NEXT_PUBLIC_SITE_NAME`、`NEXT_PUBLIC_SITE_MAIL`。全站 canonical/sitemap/OG 都从这里取。
2. **Google 登录**：`.env.local` 已带 `AUTH_GOOGLE_ID/SECRET`（与参考项目同一客户端）。上线前到 Google Cloud Console 给该客户端**补登记你域名的回调** `https://你的域名/api/auth/google/callback`；本地回调默认 `http://127.0.0.1:3000/...`（`GOOGLE_REDIRECT_URI` 可改）。确认线上 `AUTH_DEMO` 为空（演示登录必须关闭）。
3. **种子评价**：`src/lib/seed.ts` 里的评价是**示例文案**（图片为引擎真实产出），上线前替换或删除为真实用户反馈；用户投稿到 `/admin?key=ADMIN_KEY` 审批，批准后前台可见。
4. **HTTPS 与反代**：生产建议 `npm run build && npm start`（端口 3000），前面挂 Nginx/Caddy 做 TLS。
5. **robots/sitemap 提交**：域名生效后到 Google Search Console 提交 `/sitemap.xml`。
6. **Vercel 部署注意**：`.data/` 文件系统在 serverless 上不持久。要上 Vercel 需把 `src/lib/store.ts` 的几个函数换成 R2/Blob + 数据库（接口已隔离，改动集中一个文件）；放 VPS 则无需改动。
7. **可选接入**：PostHog 分析（layout.tsx 预留）、支付（参考 petpics 的 Paddle 实现）。

## 结构

```
src/
  app/            页面：/ 模板中心 /gallery /faq /privacy /terms /ai-disclosure /share/[token]
  app/api/        upload · media/[id] · generate · gallery
  components/     Generator(聊天生成器) · TemplateCard · Header/Footer · CopyButton …
  lib/engine/     glm.ts(文本) · seedream.ts(生图) · openrouter.ts(备选) · plan.ts(提示词规划) · mock.ts
  lib/            templates.ts(100模板) · store.ts(JSON库) · ratelimit.ts · moderation.ts · seed.ts
public/tpl/       100 张模板示例图
docs/plans/       产品设计与开发计划
```

## 加模板

在 `src/lib/templates.ts` 的 `TEMPLATES` 末尾加一条（id 唯一），图片放 `public/tpl/{id}.jpg`，模板中心/详情页/sitemap 自动生效。

## 与参考项目的关系

生成引擎、模板目录、设计规范（暖奶油 #FAF6EF + 陶土 #E0715C、Fraunces/Inter）取自 `~/petpics`（PetsDaily MVP）。登录、支付、礼物、宠物档案等重流程未纳入本站，需要时按模块从那边移植。
