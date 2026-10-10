import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

// 博客文章注册表：Markdown 文件（src/content/blog/*.md）+ 简易 frontmatter，
// 无数据库、无 CMS，与全站 JSON 文件库哲学一致。新增文章 = 丢一个 .md 进目录。

const DIR = path.join(process.cwd(), "src", "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO 日期
  cover: string; // 封面图路径
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
  readingTime: number; // 分钟
}

export interface Post extends PostMeta {
  html: string;
}

interface RawPost {
  meta: PostMeta;
  body: string;
}

const cache: { posts?: RawPost[] } = {};

function parseFrontmatter(slug: string, raw: string): RawPost {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) throw new Error(`Blog post ${slug} is missing frontmatter`);
  const fields: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) fields[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const body = raw.slice(m[0].length);
  const words = body.split(/\s+/).length;
  return {
    meta: {
      slug,
      title: fields.title ?? slug,
      description: fields.description ?? "",
      date: fields.date ?? "",
      cover: fields.cover ?? "/tpl/royal.jpg",
      tags: (fields.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      ctaLabel: fields.ctaLabel ?? "Make yours free",
      ctaHref: fields.ctaHref ?? "/#create",
      readingTime: Math.max(1, Math.round(words / 200)),
    },
    body,
  };
}

function loadAll(): RawPost[] {
  if (cache.posts) return cache.posts;
  cache.posts = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseFrontmatter(f.replace(/\.md$/, ""), fs.readFileSync(path.join(DIR, f), "utf-8")))
    .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
  return cache.posts;
}

export function getAllPosts(): PostMeta[] {
  return loadAll().map((p) => p.meta);
}

export function getPost(slug: string): Post | undefined {
  const found = loadAll().find((p) => p.meta.slug === slug);
  if (!found) return undefined;
  // marked.parse 同步返回 string（async: false）
  const html = marked.parse(found.body, { async: false }) as string;
  return { ...found.meta, html };
}

/** 站内链接按语言加前缀（Markdown 内写的是根路径）。public 静态资产（/tpl、/land）不路由，不加前缀。 */
export function localizePostHtml(html: string, localePrefix: string): string {
  if (!localePrefix) return html;
  return html.replace(/(href|src)="\/((?!\/)[^"]*)"/g, (_m, attr, rest) =>
    STATIC_PREFIXES.test(rest) ? _m : `${attr}="${localePrefix}/${rest}"`
  );
}

const STATIC_PREFIXES = /^(?:tpl|land)\//;
