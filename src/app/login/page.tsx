"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18n";

export default function LoginPage() {
  const { lang } = useI18n();
  const [error, setError] = useState("");
  const [href, setHref] = useState("/api/auth/google");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const next = q.get("next");
    setHref("/api/auth/google?next=" + encodeURIComponent(next && next.startsWith("/") && !next.startsWith("//") ? next : "/create"));
    const kind = q.get("error");
    if (kind === "config") setError(lang === "zh" ? "还没配 Google 登录。" : "Google sign-in is not configured.");
    else if (kind) setError(lang === "zh" ? "Google 登录没完成，再试一次。" : "Google sign-in didn't finish. Try again.");
  }, [lang]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ padding: 32, maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div className="logo" style={{ justifyContent: "center", display: "flex", marginBottom: 18, fontSize: 26 }}>
          Pets<i style={{ color: "var(--primary)", fontStyle: "normal" }}>Daily</i>
        </div>
        <h1 className="ptitle" style={{ marginBottom: 6 }}>
          {lang === "zh" ? "登录 PetsDaily" : lang === "ja" ? "ログイン" : "Sign in"}
        </h1>
        <p className="psub" style={{ marginBottom: 22 }}>
          {lang === "zh" ? "用 Google 账号登录，和 PetsDaily 是同一个。" : "Sign in with the same Google account as PetsDaily."}
        </p>
        <a className="btn bp" style={{ width: "100%" }} href={href}>
          Continue with Google
        </a>
        {error && <p style={{ fontSize: 13, color: "var(--error)", marginTop: 14 }}>{error}</p>}
      </div>
    </div>
  );
}
