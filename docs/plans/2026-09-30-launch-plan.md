# 宠物图片生成网站 — 产品设计与开发计划

日期：2026-09-30 ｜ 状态：v1.0（执行中）

## 1. 背景与目标

用户已购买域名，要做一个面向海外市场的宠物 AI 图片生成网站。参考项目 `/Users/luogangming/petpics`（PetsDaily MVP）提供：
- 大模型与生图接口及密钥（智谱 GLM 文本 + 火山方舟 Seedream 生图，备选 OpenRouter）
- 100 个模板目录（含示例图与提示词）
- 视觉规范（暖奶油 + 陶土珊瑚）、FAQ/法律页文案范式、出海调研结论

### 新站与参考项目的区别
参考项目是"档案 → 多步创作 → 付费墙"的重流程 MVP；新站是**轻量、聊天式、单页直达**的生成器，核心路径一步完成：输入诉求 + 上传宠物照片 → 出图。先不做登录、支付、宠物档案系统（保留扩展点）。

## 2. 受众与风格

- **受众**：25–45 岁欧美宠物主（女性为主，活跃于 IG/TikTok）+ 节日送礼人群；猫狗为主，兼容鸟/鱼等。
- **语言**：英文优先（EN 单语 v1，URL 结构预留多语言扩展）。
- **视觉**：暖奶油 `#FAF6EF` 底、陶土珊瑚 `#E0715C` CTA、深咖啡 `#3D2E24` 文字、鼠尾草绿/金色点缀；标题 Fraunces、正文 Inter；胶囊按钮、16/24 圆角、极轻阴影；照片是主角，移动优先。
- **语气**：温暖情感型（"还是它"），不做紫蓝渐变/玻璃拟态。

## 3. 信息架构

| 路由 | 页面 | 说明 |
|---|---|---|
| `/` | 首页 + 生成器 | 聊天框：诉求文字 + 上传 1–4 张宠物图（可选选模板）→ 生成结果卡（下载/重画/复制提示词/分享） |
| `/templates` | 模板中心 | 6 类 100 个模板，卡片=示例图+名称+场景一句话；**Copy prompt** 按钮；"Try it" 带模板跳回生成器 |
| `/templates/[slug]` | 模板详情 ×100 | 大图、完整提示词、使用方法、相关模板；程序化 SEO 承载页 |
| `/gallery` | 用户作品 + 评价 | 作品瀑布流（真实引擎产出种子 + 用户投稿）+ 评价卡 + 投稿表单（先审后显） |
| `/faq` | 常见问题 | 8–10 条，FAQPage JSON-LD |
| `/privacy` `/terms` `/ai-disclosure` | 合规页 | 无账户版隐私政策、条款、AI 内容声明 |
| `/share/[token]` | 分享落地页 | 生成结果的公开卡（og:image 社交分享，noindex） |
| `sitemap.ts` `robots.ts` `manifest.ts` | SEO 基建 | 首页/模板×100/画廊/FAQ/法律页全部入 sitemap |

## 4. 技术方案

- **栈**：Next.js 15（App Router）+ TypeScript + Tailwind CSS v4。与参考项目同栈，便于以后合并经验。
- **无登录**：设备 cookie 限流（默认 5 次/天，`FREE_DAILY_LIMIT` 可调）。
- **存储**：本地 JSON 文件库 `.data/`（uploads / generated / db.json）；README 注明上 Vercel 需换 R2/Blob。
- **生成链路**（服务端，密钥不出前端）：
  1. `POST /api/upload`：校验类型/大小（≤5MB，jpg/png/webp），存盘返回 `mediaId`
  2. `POST /api/generate`：`{message, templateId?, imageIds[], aspect?}`
     - 内容审核（关键词黑名单 + 长度限制）
     - **GLM 规划**：把用户原话 + 模板提示词 → 一条英文图像提示词（仿 petpics `planPicture`），并挑选参考图
     - **Seedream 出图**：`image` 参考图 + prompt → b64 → 存 `.data/generated/` → 返回 `/api/media/{id}`
     - 无密钥时自动 **Mock 引擎**（SVG 占位图），开发零成本
  3. 失败处理：上游超时/限流 → 友好报错 + 建议重试；提示词规划失败 → 降级用模板提示词直出

- **环境变量**（`.env.local`，从参考项目复制密钥）：`ARK_API_KEY`、`ARK_BASE`、`SEEDREAM_MODEL_ID`、`SEEDREAM_SIZE`、`TEXT_API_KEY`、`TEXT_BASE_URL`、`TEXT_MODEL`、`IMAGE_PROVIDER`、`TEXT_PROVIDER`、`NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_SITE_NAME`、`NEXT_PUBLIC_SITE_MAIL`、`FREE_DAILY_LIMIT`。
- **域名占位**：参考项目里域名未落地（localhost），域名与品牌名集中在一处配置，上线清单第一项。

## 5. SEO 方案

- 每页独立 `metadata` + canonical + OG/Twitter 卡；模板详情页 100 页静态生成。
- JSON-LD：`WebSite` + `SoftwareApplication`（首页）、`FAQPage`（/faq）、`ItemList`（/templates）。
- 画廊页：语义化 HTML、alt 文本（品种×风格关键词）。
- 诚实标注：站内与图片标注 AI 生成（合规同时是信任卖点）。
- 后续（v1.1+）：品种×风格程序化矩阵页、hreflang 多语言、博客。

## 6. 合规要点

隐私政策（无账户：照片仅用于生成、7 天自动删除、不训练/不出售、第三方处理者披露、GDPR/CCPA、儿童条款）、用户条款（上传权利、AI 图标注义务、免责）、AI 声明页。上传必经内容审核。

## 7. 里程碑（本次执行）

1. 计划文档 + git 初始化 ✅
2. 脚手架 + 设计系统
3. 引擎 + 数据层 + API（先做真实 API 冒烟测试验证密钥与接口）
4. 首页生成器（聊天框）
5. 模板中心 + 100 详情页
6. 画廊评价页 + 投稿
7. FAQ + 合规页
8. SEO 基建 + 种子内容
9. 构建 + 全路由验证 + README 上线清单

## 8. 风险与对策

| 风险 | 对策 |
|---|---|
| 生图上游慢（10–60s） | 前端进度动效 + 阶段文案；服务端 240s 超时 |
| 密钥配额耗尽 | Mock 引擎兜底；限流阀门 |
| 种子评价的真实性 | 种子数据标记 `seed:true`，README 提醒上线前替换为真实反馈 |
| Vercel 文件系统易失 | README 注明部署注意事项（R2/Blob 迁移点已隔离在存储层） |

## 9. 明确不做（v1 范围外）

登录/账户、支付、宠物档案、多语言路由、邮件、分析埋点接入（留注释位）、礼物流程。这些在参考项目有成熟实现，需要时按模块移植。
