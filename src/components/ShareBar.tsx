"use client";
import { useState } from "react";
import { useI18n } from "./I18n";

export interface SharePayload {
  kind: "work" | "diary";
  petName: string;
  text: string;
  image: string;
  date: number;
  mark?: boolean;
}

export function ShareBar({ payload, image }: { payload?: SharePayload | null; image?: string }) {
  const { t } = useI18n();
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");

  const share = async () => {
    setNote("");
    let url = link || (payload ? "" : location.href);
    if (payload && !url) {
      const token = "s_" + Date.now().toString(36);
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...payload }),
      });
      if (!res.ok) { setNote(t("share.fail")); return; }
      url = location.origin + "/s/" + token;
      setLink(url);
    }
    const title = payload?.petName || document.title;
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; }
      catch (e) { if ((e as Error).name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNote(t("share.copied"));
    } catch {
      setNote(url);
    }
  };

  return (
    <div className="share-acts">
      <button type="button" className="btn bp" onClick={share}>{t("lib.share")}</button>
      {image ? <a className="btn bs" href={image} download="petpics.jpg">{t("lib.save")}</a> : null}
      {!payload ? <a className="btn bp" href="/create">{t("plan.yours")}</a> : null}
      {note ? <p className="hint">{note}</p> : null}
    </div>
  );
}
