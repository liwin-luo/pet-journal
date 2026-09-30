"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminActions({ id, texts }: { id: string; texts: { approve: string; remove: string } }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "approve" | "remove") {
    setBusy(true);
    const key = new URLSearchParams(window.location.search).get("key") ?? "";
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, id, action }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="mt-3 flex gap-2">
      <button className="btn-primary !px-4 !py-2 text-sm" disabled={busy} onClick={() => act("approve")}>
        {texts.approve}
      </button>
      <button className="btn-ghost !py-2 text-sm" disabled={busy} onClick={() => act("remove")}>
        {texts.remove}
      </button>
    </div>
  );
}
