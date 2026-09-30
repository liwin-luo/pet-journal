import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({ id: user.id, email: user.email ?? "", name: user.name ?? "" });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    throw e;
  }
}
