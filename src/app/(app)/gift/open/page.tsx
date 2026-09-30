"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadState } from "@/lib/store";

// 旧入口：转到已保存的收礼链接，没有则回礼物编排。
export default function GiftOpenRedirect() {
  const router = useRouter();
  useEffect(() => {
    const token = loadState().orders.find((o) => o.gift?.token)?.gift?.token;
    router.replace(token ? "/g/" + token : "/gift");
  }, [router]);
  return null;
}
