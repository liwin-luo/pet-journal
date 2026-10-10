import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { localizePostHtml } from "./blog";

// 帮助中心：Markdown 文件（src/content/help/*.md）+ frontmatter。
// 与博客同一套无数据库哲学；每篇对应一个工具的使用文档，带 HowTo 结构化数据。

const DIR = path.join(process.cwd(), "src", "content", "help");

export interface HelpDoc {
  slug: string;
  title: string;
  description: string;
  tool: string; // 对应工具路径
  date: string;
  order: number;
  html: string;
  /** 第一个有序列表的条目文本（用于 HowTo 结构化数据） */
  steps: string[];
}

const cache: { docs?: HelpDoc[] } = {};

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#39;|&apos;|&#x27;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDoc(slug: string, raw: string): HelpDoc {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) throw new Error(`Help doc ${slug} is missing frontmatter`);
  const fields: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) fields[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const html = marked.parse(raw.slice(m[0].length), { async: false }) as string;
  // 第一个 <ol> 的条目即使用步骤
  const ol = html.match(/<ol>([\s\S]*?)<\/ol>/);
  const steps = ol ? [...ol[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((li) => stripTags(li[1])) : [];
  return {
    slug,
    title: fields.title ?? slug,
    description: fields.description ?? "",
    tool: fields.tool ?? "/#create",
    date: fields.date ?? "",
    order: Number(fields.order ?? 99),
    html,
    steps,
  };
}

function loadAll(): HelpDoc[] {
  if (cache.docs) return cache.docs;
  cache.docs = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseDoc(f.replace(/\.md$/, ""), fs.readFileSync(path.join(DIR, f), "utf-8")))
    .sort((a, b) => a.order - b.order);
  return cache.docs;
}

export function getAllHelpDocs(): HelpDoc[] {
  return loadAll();
}

export function getHelpDoc(slug: string): HelpDoc | undefined {
  return loadAll().find((d) => d.slug === slug);
}

export function localizeHelpHtml(html: string, localePrefix: string): string {
  return localizePostHtml(html, localePrefix);
}
