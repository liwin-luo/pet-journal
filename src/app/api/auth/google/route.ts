import { googleAuthorizeUrl, googleClient, publicOrigin, safeNext, signOauthState } from "@/lib/google-oauth";

export const runtime = "nodejs";

export function GET(req: Request) {
  try {
    googleClient();
    const next = safeNext(new URL(req.url).searchParams.get("next"));
    return Response.redirect(googleAuthorizeUrl(signOauthState(next), req));
  } catch (cause) {
    console.error("google authorize failed", cause);
    return Response.redirect(new URL("/login?error=config", publicOrigin(req)));
  }
}
