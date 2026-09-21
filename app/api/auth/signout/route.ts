import { clearSessionCookie } from "@/lib/session-cookie.ts";

export const runtime = "nodejs";

export function POST(req: Request) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": clearSessionCookie(),
    },
  });
}
