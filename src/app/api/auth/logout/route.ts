import { clearSessionCookie } from "@/lib/auth";
import { publicOrigin } from "@/lib/google-oauth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return new Response(null, {
    status: 302,
    headers: { Location: `${publicOrigin(req)}/`, "Set-Cookie": clearSessionCookie() },
  });
}
