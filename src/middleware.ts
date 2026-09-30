import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * 默认语言（en）不带前缀：/ 与 /templates 直接内部改写为 /en/...，URL 保持干净。
 * 其他语言走 /es/、/ja/ 前缀。API 与静态资源不做处理。
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const seg = pathname.split("/")[1];
  if ((LOCALES as readonly string[]).includes(seg)) return NextResponse.next();
  const rest = pathname === "/" ? "" : pathname;
  return NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}${rest}`, req.url));
}

export const config = {
  // 排除 API、Next 内部资源与一切带扩展名的静态文件（og.jpg / icon.svg / robots.txt 等）
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
