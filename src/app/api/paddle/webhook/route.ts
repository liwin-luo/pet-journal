import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Paddle webhook（技术调研 §3）：MVP 骨架仅回执 200 并打日志。
// 生产：校验 PADDLE_WEBHOOK_SECRET 签名 → 按 event 写订单状态（paid/generating/done）→ 触发生成队列。
// 事件映射：transaction.completed → 订单 paid；退款 refund.created → 订单 refunded。
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  console.log("[paddle webhook]", body?.event_type ?? "unknown", body?.data?.id ?? "");
  return NextResponse.json({ received: true });
}
