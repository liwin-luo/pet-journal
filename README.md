# Pawtrait — 宠物 AI 图片生成站

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

- 限流：设备 cookie，每天 5 次（`FREE_DAILY_LIMIT`）
- 无登录、无数据库依赖：JSON 文件库 `.data/db.json`，图片 `.data/{uploads,generated}/`

## 上线清单（按顺序）

1. **域名与品牌**：`.env.local` 里改 `NEXT_PUBLIC_SITE_URL`（你买的域名，含 https）、`NEXT_PUBLIC_SITE_NAME`、`NEXT_PUBLIC_SITE_MAIL`。全站 canonical/sitemap/OG 都从这里取。
2. **种子评价**：`src/lib/seed.ts` 里的评价是**示例文案**（图片为引擎真实产出），上线前替换或删除为真实用户反馈；投稿在 `.data/db.json` 的 `gallery` 里，`approved:true` 后前台可见。
3. **HTTPS 与反代**：生产建议 `npm run build && npm start`（端口 3000），前面挂 Nginx/Caddy 做 TLS。
4. **robots/sitemap 提交**：域名生效后到 Google Search Console 提交 `/sitemap.xml`。
5. **Vercel 部署注意**：`.data/` 文件系统在 serverless 上不持久。要上 Vercel 需把 `src/lib/store.ts` 的几个函数换成 R2/Blob + 数据库（接口已隔离，改动集中一个文件）；放 VPS 则无需改动。
6. **可选接入**：PostHog 分析（layout.tsx 预留）、Plausible/GA、支付（参考 petpics 的 Paddle 实现）。

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
