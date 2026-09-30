import { clearSessionCookie } from "@/lib/session-cookie";
import { publicOrigin } from "@/lib/google-oauth";

export const runtime = "nodejs";

export function GET(req: Request) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${publicOrigin(req)}/login`,
      "Set-Cookie": clearSessionCookie(),
    },
  });
}
