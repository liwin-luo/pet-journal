import { googleProfile, publicOrigin, readOauthState } from "@/lib/google-oauth";
import { sessionCookie, signSession } from "@/lib/session-cookie";
import { upsertGoogleUser } from "@/lib/accounts";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const origin = publicOrigin(req);
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const next = state ? readOauthState(state) : null;
  if (url.searchParams.get("error") || !code || !next) {
    return Response.redirect(new URL("/login?error=google", origin));
  }
  try {
    const profile = await googleProfile(code, req);
    const user = await upsertGoogleUser({ googleSub: profile.sub, email: profile.email, name: profile.name });
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${origin}${next}`,
        "Set-Cookie": sessionCookie(signSession(user.id)),
      },
    });
  } catch (cause) {
    console.error("google callback failed", cause);
    return Response.redirect(new URL("/login?error=google", origin));
  }
}
