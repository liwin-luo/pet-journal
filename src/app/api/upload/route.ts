import { NextResponse } from "next/server";
import { storeImage } from "@/lib/store";

const MAX_BYTES = 5 * 1024 * 1024;
const OK_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  if (files.length > 4) return NextResponse.json({ error: "Up to 4 photos" }, { status: 400 });

  const ids: string[] = [];
  for (const file of files) {
    if (!OK_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG or WebP photos" }, { status: 415 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Each photo must be under 5 MB" }, { status: 413 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    ids.push(await storeImage(bytes, "uploads", file.type));
  }
  return NextResponse.json({ ids, urls: ids.map((id) => `/api/media/${id}`) });
}
