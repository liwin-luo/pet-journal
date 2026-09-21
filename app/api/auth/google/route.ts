import { googleAuthorizeUrl, signOauthState } from "@/lib/google-oauth.ts";

export const runtime = "nodejs";

export function GET() {
  return Response.redirect(googleAuthorizeUrl(signOauthState()));
}
