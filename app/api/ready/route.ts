import { readyDb } from "@/lib/db/client.ts";
import { googleClient, publicOrigin } from "@/lib/google-oauth.ts";

export const runtime = "nodejs";

export async function GET(req: Request) {
  let google = false;
  try {
    googleClient();
    google = true;
  } catch {
    google = false;
  }
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
  const origin = publicOrigin(req);
  const auth = Boolean(process.env.AUTH_SECRET?.trim());
  const raw = process.env.DATABASE_URL?.trim().replace(/^['"]|['"]$/g, "");
  if (!raw) return Response.json({ sha, origin, auth, google, db: "missing" }, { status: 503 });
  try {
    const pool = await readyDb();
    await pool.query("select 1 as ok");
    return Response.json({
      sha,
      origin,
      auth,
      google,
      db: "ok",
      ark: Boolean(process.env.ARK_API_KEY?.trim()),
      hint: auth ? undefined : "Vercel 加 AUTH_SECRET 再 Redeploy",
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message.slice(0, 80) : "fail";
    return Response.json({ sha, origin, auth, google, db: "fail", message }, { status: 503 });
  }
}
