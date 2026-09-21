import { getMedia } from "@/lib/db/media.ts";
import { requireUserId, unauthorized } from "@/lib/session.ts";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("not found", { status: 404 });
  const file = await getMedia(id);
  if (!file) return new Response("not found", { status: 404 });
  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.mime,
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
