import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getUserData, putUserData } from "@/lib/db";
import { readWallet } from "@/lib/accounts";

export const runtime = "nodejs";

// 聚合状态接口：客户端唯一的数据同步端点
// GET  → 当前用户的 { pets, orders, diary }
// PUT  → 整体替换（客户端 debounce 后全量推送；MVP 单用户单写者足够）
export async function GET() {
  try {
    const user = await getSessionUser();
    const data = await getUserData(user.id);
    return NextResponse.json({ ...data, ...await readWallet(user.id) });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    throw e;
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser();
    const body = await req.json();
    await putUserData(user.id, {
      pets: Array.isArray(body.pets) ? body.pets : [],
      orders: Array.isArray(body.orders) ? body.orders : [],
      diary: Array.isArray(body.diary) ? body.diary : [],
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    throw e;
  }
}
