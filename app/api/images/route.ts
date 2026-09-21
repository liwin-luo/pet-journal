import { listImages } from "@/lib/db/images.ts";
import { requireUserId, unauthorized } from "@/lib/session.ts";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();
  return Response.json({ shots: await listImages(session.userId) });
}
