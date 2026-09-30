import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

const LOCALE_COOKIE = "paw_locale";

/**
 * 语言路由：
 * - 带语言前缀的路径（/es/...）直接放行；
 * - 无前缀路径（默认语言区）：若用户之前选过语言（paw_locale cookie），302 重定向到该语言；
 *   否则内部改写为 /en/...，URL 保持干净（爬虫无 cookie，SEO 不受影响）。
 * cookie 由语言切换器在用户主动切换时写入（本地保留一年）。
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const seg = pathname.split("/")[1];
  if ((LOCALES as readonly string[]).includes(seg)) return NextResponse.next();

  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const remembered = cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const rest = pathname === "/" ? "" : pathname;

  if (remembered !== DEFAULT_LOCALE) {
    return NextResponse.redirect(new URL(`/${remembered}${rest}`, req.url));
  }
  return NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}${rest}`, req.url));
}

export const config = {
  // 排除 API、Next 内部资源与一切带扩展名的静态文件（og.jpg / icon.svg / robots.txt 等）
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
