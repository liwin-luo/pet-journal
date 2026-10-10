# SEO 文章程序化流水线（SOP）

日期：2026-10-10 · 适用：`/blog` 全部 SEO 文章 · 配套文件：
`content/seo-topics.json`（选题队列）、`docs/content/personas.md`（角色）、
`scripts/blog-scaffold.mjs`（脚手架）、`scripts/blog-lint.mjs`（E-E-A-T 门禁）

## 流程总览

```
① 选题/选词 ──► ② 长尾扩展 ──► ③ 角色分配+结构 ──► ④ 内容+图片+内链
   （研究）        （扩展）          （规划）            （写作）
                                                              │
   发布回流 ◄── ⑥ 数据复盘 ◄── ⑤ 审核门禁（E-E-A-T lint + 人工）◄──┘
```

## ① 选题 / 选词

输入源（按优先级）：

| 源 | 用法 | 工具 |
| --- | --- | --- |
| Google Trends | 宠物类目 Rising/Top queries；对比候选词走势；季节性验证（过去 5 年同期曲线） | WebFetch trends.google.com（指定地区 US） |
| 社媒热点 | Reddit（r/dogs、r/cats、r/pets 热帖与高赞评论）；TikTok 宠物 tag 趋势；小红书/抖音（面向中文站时） | agent-reach 技能 / WebFetch |
| 站内数据 | GSC 已曝光未点击的词（上线后）；生成器输入框的高频诉求（.data/db.json 有真实用户话语！） | SQL/脚本 |
| 季节日历 | 节日提前 6-8 周立题（圣诞/万圣节/母亲节/gotcha day） | 日历 + 队列 seasonality 字段 |
| 竞品缺口 | site:competitor.com/blog 找他们没写或写烂的 | WebFetch |

**产出：选题卡**（写入 `content/seo-topics.json`）——seedKeyword、来源与证据、季节性。
门槛：一个选题必须有"趋势证据或搜索证据"二者之一，凭感觉的题目不进队列。

## ② 长尾扩展

对 seedKeyword 做矩阵扩展：

- 修饰词 × 漏斗：`what is / how to / guide`（认知）→ `best / vs / alternative`（考虑）→
  `price / review / gift`（决策）→ `template / examples / tutorial`（实施）
- 修饰词 × 角色：`for beginners / for apartments / for seniors`（角色见 personas.md）
- 修饰词 × 品种/物种：`for golden retrievers / for cats`
- 疑问挖掘：Google PAA、Reddit 提问句式（"why does my dog…"）

**产出**：每选题 5-15 个长尾，标注 intent/stage/优先级，选出 1 个主关键词 + 2-4 个次级。
主关键词必须出现在：标题、首段、≥1 个 H2、URL slug、description。

## ③ 角色分配 + 结构

1. 从 personas.md 选主角色（决定语气/CTA/E-E-A-T 侧重），产能配比见角色文档规则。
2. 结构模板按内容型选择：
   - `how-to`：问题 → 步骤 → 常见错误 → 工具 CTA
   - `listicle`：分组 → 编号条目（每条 ≤2 行）→ 合集 CTA
   - `hub`：定义 → 全景分节 → 每节内链 spoke → FAQ
   - `comparison`：标准 → 逐项对比表 → 结论按人群推荐
   - `data`：方法 → 发现（图表）→ 局限 → 可引用结论
3. **内链规划（写作前定好，不是写完再补）**：每篇必含
   ≥1 个支柱/相关文章 + ≥2 个工具页或模板页 + 1 个 `/ai-disclosure`（涉 AI 内容）。
   队列条目的 `internalLinks` 字段预写锚文本。

## ④ 内容 + 图片 + 内链

1. `npm run blog:scaffold -- --id=<选题id>` 生成草稿到 `content/drafts/`（含大纲骨架与内链槽位）。
2. 按 persona 语气填充；每个 H2 下 ≥150 字实质内容，禁空话（"in today's world"）。
3. **图片全部用本站工具的真实产出**（模板示例图或现做的生成图）——每张图既是配图又是产品演示；
   alt 写清楚内容。每篇 ≥2 图。生成图需保留 AI 标注。
4. E-E-A-T 信号写作时植入：一手测试数字、场景细节、权威外源（健康/年龄/营养话题**必须**引用
   AVMA/VCA/AKC/ASPCA/Cornell 并留链接）、诚实披露（失败率、局限、AI 标注）。

## ⑤ 审核门禁（不过不发）

机器门禁：`npm run blog:lint` —— 校验 frontmatter 完整、标题 ≤70 字符、description 50-160、
字数 ≥600、≥3 个 H2、≥3 条内链且含 ≥1 条产品页、TODO 残留、封面文件存在、
健康话题强制权威外源、涉 AI 内容必须链 /ai-disclosure。**任何 error 不得发布。**

人工/AI 复核清单：
- [ ] 语气与 persona 一致（memorial 无推销、entertainment 无硬广）
- [ ] 事实抽查：数字、品种知识、价格
- [ ] 主关键词位置五点齐全（title/H2/首段/slug/description）
- [ ] 首段 60 字内让读者知道"这篇解决什么"
- [ ] 无未证实的医疗/安全断言
- [ ] 图片 alt 完整、无占位图

## ⑥ 发布与回流

1. 草稿通过后移入 `src/content/blog/`，`date` 设发布日 → build 自动进索引与 sitemap。
2. GSC 手动提交该 URL；社媒分发（Pinterest pin、相关 Reddit 帖、IG story）。
3. **28 天复盘**：GSC 曝光/点击回填队列 `notes`；曝光>1000 但 CTR<1.5% → 改标题/描述；
   有排名无前三 → 加内链/扩写；连续两周期无曝光 → 降级合并进相关文。
4. 每季度把 Top 5 EN 文列入翻译队列（等 i18n 确认后执行）。

## 状态机

`idea → outlined（scaffold 完成）→ drafted（内容填充完）→ reviewed（过 lint+复核）→ published → refreshed`
