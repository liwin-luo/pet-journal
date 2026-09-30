"use client";
// 应用数据网关：能同步就同步。模板 / 创作 / 作品 / 日记未登录也能看。
// 账户、宠物、上传这些仍要登录。未就绪前渲染骨架。
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { syncFromServer } from "@/lib/store";

const OPEN = ["/templates", "/styles", "/create", "/library", "/diary", "/upload", "/anchor", "/preview", "/processing", "/pets", "/pet", "/gift"];

function isOpen(path: string) {
  return OPEN.some((p) => path === p || path.startsWith(p + "/"));
}

export function AppData({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready && isOpen(pathname)) return;
    let cancel = false;
    (async () => {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (cancel) return;
      if (res.status === 401) {
        if (isOpen(pathname)) { setReady(true); return; }
        router.replace("/login");
        return;
      }
      await syncFromServer();
      if (!cancel) setReady(true);
    })();
    return () => { cancel = true; };
  }, [router, pathname, ready]);

  if (!ready) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-soft)" }}>
        🐾 …
      </div>
    );
  }
  return <>{children}</>;
}
