import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Demo 登录：MVP 骨架用本地 session 占位。
// 生产接入 Auth.js（Google OAuth + magic link）——见 README「接入点」；本路由仅用于开发期绕过登录墙。
export async function POST() {
  return NextResponse.json({ user: { email: "demo@petpics.app", provider: "demo" } });
}
