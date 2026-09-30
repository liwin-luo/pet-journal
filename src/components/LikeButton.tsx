"use client";

import { useState } from "react";
import { HeartIcon } from "./icons";

/** 作品点赞按钮：设备去重，点击切换（再点取消）。 */
export function LikeButton({ id, count, liked, label }: { id: string; count: number; liked: boolean; label: string }) {
  const [state, setState] = useState({ count, liked });
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    // 乐观更新
    setState((s) => ({ count: s.count + (s.liked ? -1 : 1), liked: !s.liked }));
    try {
      const res = await fetch("/api/gallery/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = (await res.json()) as { liked: boolean; count: number };
        setState(data);
      } else {
        setState((s) => ({ count: s.count + (s.liked ? 1 : -1), liked: s.liked }));
      }
    } catch {
      setState((s) => ({ count: s.count + (s.liked ? 1 : -1), liked: s.liked }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={state.liked}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${
        state.liked ? "border-coral bg-coral-soft text-coral" : "border-sand bg-white text-coffee hover:border-coral hover:text-coral"
      }`}
    >
      <HeartIcon className={`h-3.5 w-3.5 transition-transform ${state.liked ? "scale-110" : ""}`} />
      {state.count > 0 ? state.count : ""}
    </button>
  );
}
