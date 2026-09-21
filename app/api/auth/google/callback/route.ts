import { upsertGoogleUser } from "@/lib/db/users.ts";
import { googleProfile, verifyOauthState } from "@/lib/google-oauth.ts";
import { sessionCookie, signSession } from "@/lib/session-cookie.ts";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  if (error) return Response.redirect(new URL("/login?error=google", url.origin));
  if (!code || !state || !verifyOauthState(state)) {
    return Response.redirect(new URL("/login?error=state", url.origin));
  }
  try {
    const profile = await googleProfile(code);
    const user = await upsertGoogleUser({
      googleSub: profile.sub,
      email: profile.email,
      name: profile.name,
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "http://127.0.0.1:3000/",
        "Set-Cookie": sessionCookie(signSession(user.id)),
      },
    });
  } catch (cause) {
    console.error("google callback failed", cause);
    return Response.redirect(new URL("/login?error=callback", url.origin));
  }
}
