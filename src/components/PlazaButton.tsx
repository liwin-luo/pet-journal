"use client";
import { useEffect, useState } from "react";
import { useI18n } from "./I18n";
import { SharePayload } from "./ShareBar";

export function PlazaButton({ source, payload }: { source: string; payload: SharePayload }) {
  const { t } = useI18n();
  const [on, setOn] = useState<boolean | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch("/api/plaza/mine?source=" + encodeURIComponent(source))
      .then((r) => r.json())
      .then((d) => setOn(!!d.on))
      .catch(() => setOn(false));
  }, [source]);

  const toggle = async () => {
    setNote("");
    const res = await fetch("/api/plaza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source, on: !on }),
    });
    if (!res.ok) { setNote(t("plaza.fail")); return; }
    const data = await res.json();
    setOn(!!data.on);
    setNote(data.on ? t("plaza.published") : t("plaza.removed"));
  };

  if (on === null) return null;
  return (
    <div className="share-acts">
      <button type="button" className={on ? "btn bs" : "btn bp"} onClick={toggle}>
        {on ? t("plaza.remove") : t("plaza.publish")}
      </button>
      {note ? <p className="hint">{note}</p> : null}
    </div>
  );
}
