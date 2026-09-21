import { upsertGoogleUser } from "@/lib/db/users.ts";
import { googleProfile, publicOrigin, verifyOauthState } from "@/lib/google-oauth.ts";
import { sessionCookie, signSession } from "@/lib/session-cookie.ts";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const origin = publicOrigin(req);
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  if (error) return Response.redirect(new URL("/login?error=google", origin));
  if (!code || !state || !verifyOauthState(state)) {
    return Response.redirect(new URL("/login?error=state", origin));
  }
  try {
    const profile = await googleProfile(code, req);
    const user = await upsertGoogleUser({
      googleSub: profile.sub,
      email: profile.email,
      name: profile.name,
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${origin}/today`,
        "Set-Cookie": sessionCookie(signSession(user.id)),
      },
    });
  } catch (cause) {
    console.error("google callback failed", cause);
    const message = cause instanceof Error ? cause.message : "";
    const kind = /AUTH_SECRET|先设 AUTH/i.test(message)
      ? "config"
      : /DATABASE|ECONN|ENOTFOUND|ssl|certificate|password|timeout|先设 DATABASE/i.test(message)
        ? "db"
        : /token|invalid_grant|invalid_client|redirect_uri|没返回邮箱/i.test(message)
          ? "google"
          : "callback";
    return Response.redirect(new URL(`/login?error=${kind}`, origin));
  }
}
