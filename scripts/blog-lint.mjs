#!/usr/bin/env node
// 用法：npm run blog:lint            检查 src/content/blog/ 全部已发布文章
//       npm run blog:lint -- --draft content/drafts/xxx.md   宽松检查草稿
// E-E-A-T 与结构门禁：任何 error 不得发布；warning 需人工确认。
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUB = path.join(ROOT, "src", "content", "blog");
const AUTHORITATIVE = ["avma.org", "vcahospitals.com", "akc.org", "aspca.org", "cornell.edu", "petmd.com", "humanesociety.org"];
const HEALTH_TERMS = /\b(vet|veterinar|health|nutrit|toxic|poison|vaccin|disease|parasite|age |human years|lifespan)\b/i;
const draftArgIdx = process.argv.indexOf("--draft");
const draftPath = draftArgIdx > -1 ? path.resolve(ROOT, process.argv[draftArgIdx + 1]) : null;

function parsePost(file) {
  const raw = fs.readFileSync(file, "utf-8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const fields = {};
  for (const line of m ? m[1].split(/\r?\n/) : []) {
    const i = line.indexOf(":");
    if (i > 0) fields[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { raw, fields, body: raw.slice(m ? m[0].length : 0) };
}

function check(file, { draft = false } = {}) {
  const rel = path.relative(ROOT, file);
  const errors = [];
  const warnings = [];
  const { raw, fields, body } = parsePost(file);

  // frontmatter 完整性
  for (const key of ["title", "description", "date", "cover", "ctaLabel", "ctaHref"]) {
    if (!fields[key] || /^TODO/.test(fields[key])) errors.push(`frontmatter.${key} 缺失或为占位`);
  }
  if (fields.title && (fields.title.length > 70 || fields.title.length < 20)) warnings.push(`title ${fields.title.length} 字符（建议 20–70）`);
  if (fields.description && (fields.description.length > 160 || fields.description.length < 50)) warnings.push(`description ${fields.description.length} 字符（建议 50–160）`);
  if (fields.cover && !/^TODO/.test(fields.cover) && !fs.existsSync(path.join(ROOT, "public", fields.cover))) errors.push(`封面文件不存在: public${fields.cover}`);

  // 结构
  const words = body.split(/\s+/).filter(Boolean).length;
  if (!draft && words < 600) errors.push(`正文 ${words} 词（发布门槛 600）`);
  const h2s = (body.match(/^## /gm) ?? []).length;
  if (h2s < 3) errors.push(`H2 只有 ${h2s} 个（需 ≥3）`);
  if (/TODO|FIXME/.test(raw)) errors.push("存在 TODO/FIXME 残留");

  // 内链与产品漏斗
  const internal = [...body.matchAll(/\]\((\/[^)\s]+)\)/g)].map((m) => m[1]);
  if (!draft && internal.length < 3) errors.push(`内链只有 ${internal.length} 条（需 ≥3：相关文 + 工具/模板）`);
  if (!internal.some((h) => /^\/(tools|templates)|^\/#create/.test(h))) errors.push("没有指向产品页的内链（/tools、/templates 或 /#create）");

  // E-E-A-T：健康话题强制权威外源（玩笑提及不算——标题/小节命中或正文 ≥3 次才触发）
  const headingText = (body.match(/^##+ .*$/gm) ?? []).join("\n");
  const healthHits = (body.match(HEALTH_TERMS) ?? []).length;
  const healthTopic = HEALTH_TERMS.test(headingText) || healthHits >= 3;
  const outbound = [...body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
  const hasAuthority = outbound.some((u) => AUTHORITATIVE.some((d) => u.includes(d)));
  if (healthTopic && !hasAuthority) {
    (draft ? warnings : errors).push(`涉及健康/年龄/营养话题（命中 ${healthHits} 处）但无权威外源（AVMA/VCA/AKC/ASPCA/Cornell/PetMD）`);
  }
  if (!healthTopic && outbound.length === 0 && !draft) warnings.push("无外源链接——如有数据/事实断言请补一手来源说明或权威源");

  // E-E-A-T：涉 AI 内容必须披露
  if (/\bAI\b/.test(`${fields.title} ${body}`) && !body.includes("/ai-disclosure")) {
    warnings.push("内容涉及 AI 但未链接 /ai-disclosure（信任披露）");
  }

  return { rel, errors, warnings };
}

const files = draftPath
  ? [draftPath]
  : fs.readdirSync(PUB).filter((f) => f.endsWith(".md")).map((f) => path.join(PUB, f));

let failed = false;
for (const f of files) {
  const r = check(f, { draft: !!draftPath });
  const icon = r.errors.length ? "✗" : r.warnings.length ? "!" : "✓";
  console.log(`${icon} ${r.rel}`);
  for (const e of r.errors) { console.log(`   ERROR ${e}`); failed = true; }
  for (const w of r.warnings) console.log(`   WARN  ${w}`);
}
console.log(failed ? "\nLint FAILED — 存在 error，不得发布。" : "\nLint passed（warnings 需人工确认）。");
process.exit(failed ? 1 : 0);
