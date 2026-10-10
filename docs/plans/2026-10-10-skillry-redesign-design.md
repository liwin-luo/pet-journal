# PetsDaily 全站重构设计方案（参考 skillry.dev）

日期：2026-10-10 · 状态：已与需求方确认四个方向性决策

## 目标

受众为会在社媒分享宠物照片的宠物爱好者。重构围绕两条主线：

1. **免费工具获客**：SEO 自然流量 + 社媒裂变（分享水印、梗图自带传播性）
2. **增值服务变现**：订阅 Pro + Credits 加油包（本期 UI 与文案先行，支付后接）

## 已确认决策

| 决策点 | 结论 |
| --- | --- |
| 视觉基调 | 全盘 Skillry 深色复古风（暖黑底，色彩微调为宠物暖调） |
| 免费工具矩阵 | AI 写真（现有）+ 梗图生成器 + 宠物头像生成器 + 零成本 SEO 小工具集 |
| 变现模式 | 混合：Pro 订阅（月/年）+ Credits 加油包 |
| 本期范围 | 设计系统 + 首页 + 新页面（/tools、工具页、/pricing）；模板/画廊/日记等内页靠 token 换肤继承深色，渐进打磨 |

## Skillry 视觉语言 → PetsDaily 映射

- 深色暖黑底（`#191310` 系）替代暖奶油浅底
- 超大号奶油色复古标题 + 错位阴影（Fraunces 900 已具备复古衬线气质）
- 顶部柠檬黄公告条（Pro 推销 → /pricing）
- 马卡龙色圆角卡片（陶土/雾霾蓝/灰粉/鼠尾草）用于工具卡与图标墙
- 模板示例图两排 marquee 无限滚动（对应 skillry 首屏图标墙，但用真实产品图更有说服力）
- 横向滚动卡片行 + FREE/NEW 徽章 + 免费额度计数

### Token 重映射（关键实现手段）

保持现有 token 名不变、只换值，全站（含旧内页）自动换肤为深色：
`cream→暖黑页面底` `parchment→深一档分区底` `sand→暗边框` `ink→奶油主文字`
`coffee→暖灰次文字` `fog→弱文字` `coral→提亮陶土` `coral-soft→暗强调底`。
卡片语境的 `bg-white` 统一替换为新 token `surface`（暗卡面）；按钮 `text-white` 保留纯白。
新增 token：`lemon`（公告黄）、`surface/surface-2`。新增 utilities：`.headline-retro`、
`.marquee`、`.annbar`、`.no-scrollbar`、`.pill-badge`。

## 信息架构（新增部分）

```
/                  首页重构：公告条→复古 Hero+marquee 图墙→生成器→免费工具区→
                   横滚模板行→三步→画廊→评价→定价预告→FAQ→CTA
/tools             工具中心（SEO hub，内链所有工具）
/tools/meme-maker  宠物梗图生成器：纯前端 canvas，照片+顶/底文字+贴纸，
                   零上传零成本，下载带小水印（裂变钩子），Web Share 分享
/tools/pet-avatar  宠物头像生成器：复用 /api/upload+/api/generate，
                   头像风格预设（3D 卡通/Q 版/扁平插画），消耗免费额度
/tools/dog-names   狗狗起名器：前端词库随机+筛选+收藏 + 命名技巧长文（SEO）
/tools/cat-names   猫咪起名器：同上
/tools/pet-age     宠物年龄换算器：猫/狗年龄↔人类年龄，前端计算+换算表（SEO）
/pricing           Free / Pro 月&年 / Credits 三档定价 + 支付 FAQ
```

## 变现设计（本期不接支付）

- `src/lib/plans.ts` 单一数据源：FREE（3 张/天 + 模板全开放 + 工具全免费用）、
  PRO 月 $9.99 / 年 $79（无限生成、去水印、高级模板、4K 下载）、CREDITS 加油包
- /pricing 与首页定价预告；checkout 按钮为禁用占位（标 "Coming soon"），不误导付款
- 后续接 Paddle（参考 ~/petpics 实现），plans.ts 已按可落库结构设计

## 增长机制

- 梗图/头像产出默认右下角小字水印 `petsdaily.live`（纯前端 canvas 绘制，AI 写真沿用现有服务端水印）
- 每个工具页独立 title/desc + FAQPage JSON-LD + WebApplication schema；全部进 sitemap
- 工具间互推：梗图页推 AI 写真、起名器推头像工具，形成站内环
- i18n：新页面文案进 10 语言字典（Dict 类型全平行强制），SEO 长文控制篇幅

## 错误处理 / 兼容

- meme-maker 全客户端运行，无网络依赖，失败面仅剩文件类型/大小校验（前端提示）
- pet-avatar 复用现有上传/生成/限流/审核链路，错误提示沿用生成器文案
- token 换肤后旧内页如有个别硬编码浅色残留，逐个修掉（渐进打磨，不阻塞本期）

## 验证

`npm run build` 通过；dev 起服务后对首页/工具中心/meme-maker/pricing 深浅两语言
截图，交视觉验收（visual-judge），不通过则修后再验。
