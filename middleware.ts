import { NextResponse, type NextRequest } from "next/server";

const PUBLIC = new Set([
  "/",
  "/login",
  "/pricing",
  "/privacy",
  "/terms",
  "/google824e0769c16d7fbd.html",
]);

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (PUBLIC.has(path)) return NextResponse.next();
  if (req.cookies.get("pj_user")?.value) return NextResponse.next();
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|generated|favicon.ico|icon.svg|apple-icon).*)"],
};
