import { demoEnabled } from "@/lib/auth";
import { sessionCookie, signSession } from "@/lib/auth";
import { publicOrigin, safeNext } from "@/lib/google-oauth";

export const runtime = "nodejs";

/** 演示登录：仅 AUTH_DEMO=1 时开放（本地开发用，线上默认关闭）。 */
export async function POST(req: Request) {
  if (!demoEnabled()) {
    return Response.redirect(new URL("/login?error=demo", publicOrigin(req)));
  }
  const next = safeNext(new URL(req.url).searchParams.get("next"));
  const token = signSession({ email: `demo-${crypto.randomUUID().slice(0, 8)}@local`, name: "Demo User" });
  return new Response(null, {
    status: 302,
    headers: { Location: `${publicOrigin(req)}${next}`, "Set-Cookie": await sessionCookie(token) },
  });
}
