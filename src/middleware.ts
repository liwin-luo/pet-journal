import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const LOCALE_COOKIE = "paw_locale";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // www → 裸域 308（规范域名不含 www）。hostname 要从 Host 头取（nextUrl 不反映它）。
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const wwwHost = `www.${new URL(SITE_URL).hostname}`;
  if (host === wwwHost) {
    return NextResponse.redirect(`${SITE_URL}${pathname}${search}`, 308);
  }

  const seg = pathname.split("/")[1];
  // 默认语言的 /en/* 前缀 URL 308 归一到根路径，避免重复收录
  if (seg === DEFAULT_LOCALE) {
    return NextResponse.redirect(new URL(`${pathname.slice(DEFAULT_LOCALE.length + 1) || "/"}${search}`, req.url), 308);
  }
  if ((LOCALES as readonly string[]).includes(seg)) return NextResponse.next();

  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const remembered = cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const rest = pathname === "/" ? "" : pathname;

  if (remembered !== DEFAULT_LOCALE) {
    return NextResponse.redirect(new URL(`/${remembered}${rest}${search}`, req.url));
  }
  // 改写必须带上查询串，否则页面的 searchParams（徽章/分类/物种筛选）全部失效
  return NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}${rest}${search}`, req.url));
}

export const config = {
  // 排除 API、Next 内部资源与一切带扩展名的静态文件（og.jpg / icon.svg / robots.txt 等）
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
