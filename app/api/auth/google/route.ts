import { googleAuthorizeUrl, googleClient, publicOrigin, signOauthState } from "@/lib/google-oauth.ts";

export const runtime = "nodejs";

export function GET(req: Request) {
  try {
    googleClient();
    return Response.redirect(googleAuthorizeUrl(signOauthState(), req));
  } catch (cause) {
    console.error("google authorize failed", cause);
    return Response.redirect(new URL("/login?error=config", publicOrigin(req)));
  }
}
