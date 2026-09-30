"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PawIcon } from "./icons";

/** 登出前弹框确认。确认后走原生 POST /api/auth/logout（整页跳转清 cookie）。 */
export function SignOutButton() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Portal 到 body：Header 的 backdrop-blur 会把 fixed 定位裁剪在顶栏内
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-sm font-medium text-coffee transition-colors hover:text-coral">
        Sign out
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm sign out"
            onClick={() => setOpen(false)}
          >
            <div
              className="card w-full max-w-sm p-6 !rounded-big rise"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral-soft text-coral">
                <PawIcon className="h-5 w-5" />
              </span>
              <h2 className="mt-3 font-display text-xl font-semibold">Sign out?</h2>
              <p className="mt-2 text-sm leading-relaxed text-coffee">
                Your pictures stay tied to your account and this browser — sign back in anytime to download them again.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <form ref={formRef} action="/api/auth/logout" method="post">
                  <button type="submit" className="btn-primary">
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
