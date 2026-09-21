import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/login") return NextResponse.next();
  if (req.cookies.get("pj_user")?.value) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|generated|favicon.ico).*)"],
};
