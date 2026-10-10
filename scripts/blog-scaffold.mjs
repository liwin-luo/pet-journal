#!/usr/bin/env node
// 用法：npm run blog:scaffold -- --id=<选题id>
// 从 content/seo-topics.json 取选题，生成带大纲骨架与内链槽位的草稿到 content/drafts/。
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const QUEUE = path.join(ROOT, "content", "seo-topics.json");
const DRAFTS = path.join(ROOT, "content", "drafts");

const argId = process.argv.find((a) => a.startsWith("--id="))?.slice(5);
if (!argId) {
  console.error("Usage: npm run blog:scaffold -- --id=<topic-id>");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(QUEUE, "utf-8"));
const topic = db.topics.find((t) => t.id === argId);
if (!topic) {
  console.error(`Topic "${argId}" not found. Available: ${db.topics.map((t) => t.id).join(", ")}`);
  process.exit(1);
}
if (!["idea", "outlined"].includes(topic.status)) {
  console.error(`Topic "${argId}" status is "${topic.status}" — only idea/outlined can be scaffolded.`);
  process.exit(1);
}
if (!topic.title || !topic.outline?.length || !topic.primaryKeyword) {
  console.error(`Topic "${argId}" is missing title/outline/primaryKeyword — finish stage ②③ first.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const slug = topic.id.replace(/^\d{4}-\d{2}-\d{2}-/, "");
const links = (topic.internalLinks ?? [])
  .map((l) => `- [${l.anchor}](${l.href})`)
  .join("\n");

const draft = `---
title: ${topic.title}
description: TODO(50–160 字符，含主关键词 "${topic.primaryKeyword}"，给搜索者一个点进来的理由)
date: ${today}
cover: TODO(/tpl/xxx.jpg 或为本篇现做的生成图)
tags: TODO(逗号分隔)
ctaLabel: ${topic.persona === "memorial" ? "Create a gentle memorial portrait" : "Make yours free"}
ctaHref: ${topic.persona === "gift-buyer" ? "/pricing" : "/#create"}
---

<!-- persona: ${topic.persona} · contentType: ${topic.contentType} · primaryKeyword: ${topic.primaryKeyword} -->
<!-- 语气与 E-E-A-T 要求见 docs/content/personas.md 对应角色行 -->

TODO(首段：60 字内讲清这篇解决什么问题；自然出现主关键词 "${topic.primaryKeyword}"。)

${topic.outline.map((h) => `## ${h}\n\nTODO(≥150 字实质内容；植入一手细节/数字，禁空话。)\n`).join("\n")}

## Further reading

${links || "TODO(至少 3 条内链：1 相关文章 + 2 工具/模板页)"}

## Sources

TODO(健康/年龄/营养/品种断言必须列权威源：AVMA / VCA / AKC / ASPCA / Cornell；
纯经验文章可写 "Tested with N photos from our studio, October 2026" 这类一手来源。)
`;

fs.mkdirSync(DRAFTS, { recursive: true });
const out = path.join(DRAFTS, `${slug}.md`);
fs.writeFileSync(out, draft);

topic.status = "outlined";
fs.writeFileSync(QUEUE, JSON.stringify(db, null, 2) + "\n");

console.log(`Draft scaffolded: ${path.relative(ROOT, out)}`);
console.log(`Topic status -> outlined`);
console.log(`Next: 填充内容（persona=${topic.persona}）→ npm run blog:lint -- --draft ${path.relative(ROOT, out)} 复查 → 移入 src/content/blog/ 发布`);
