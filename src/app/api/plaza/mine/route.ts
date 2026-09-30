import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { plazaOn, unpublishOwned } from "@/lib/share-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  let user;
  try { user = await getSessionUser(); }
  catch { return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  const source = new URL(req.url).searchParams.get("source") || "";
  return NextResponse.json({ on: plazaOn(source, user.id) });
}

export async function DELETE() {
  let user;
  try { user = await getSessionUser(); }
  catch { return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  return NextResponse.json({ n: unpublishOwned(user.id) });
}
