"use client";
// 账户：订单 / 宠物档案入口 / 隐私删除（双确认）
import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/I18n";
import { Header } from "@/components/ui";
import { loadState, updateState } from "@/lib/store";
import { PLANS, creditsLeft, planOf } from "@/lib/plan";

export default function AccountPage() {
  const { t } = useI18n();
  const s = loadState();
  const [confirm, setConfirm] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    fetch("/api/session", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((u) => {
      if (u?.email) setEmail(u.email);
    }).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        <h1 className="ptitle">{t("acc.title")}</h1>
        <div className="sec-t">{t("acc.profile")}</div>
        <div className="row card"><span className="l">{email || "—"}</span>
          <a className="link" href="/api/auth/logout">{t("acc.signout")}</a></div>
        <div className="sec-t">{t("mypet.title")}</div>
        <div className="row card"><span className="l">🐾 {curName(s)}</span>
          <Link className="link" href="/pets?manage=1">{t("acc.view")}</Link></div>
        <div className="sec-t">{t("plan.title")}</div>
        <div className="row card"><span className="l">{t(`plan.${planOf(s)}`)} · {t("plan.petsLine").replace("{n}", `${s.pets.length}/${PLANS[planOf(s)].pets}`)}<small>{planOf(s) === "free" ? t("plan.left").replace("{n}", String(creditsLeft(s))) : t("plan.packLine")}</small></span>
          <Link className="link" href="/pricing">{t("plan.change")}</Link></div>
        <div className="row card"><span className="l">{t("nav.plaza")}</span>
          <Link className="link" href="/plaza">{t("acc.view")}</Link></div>
        <div className="sec-t">{t("acc.orders")}</div>
        {s.orders.length === 0 ? (
          <div className="row card"><span className="l">—</span></div>
        ) : s.orders.map((o) => (
          <div className="row card" key={o.id}>
            <span className="l">{o.tier === "gift" ? "Gift Box" : t("plan.studio")}{o.amount ? ` · $${o.amount}` : ""}<small>{new Date(o.createdAt).toLocaleDateString()}</small></span>
            <Link className="link" href="/library">{t("acc.view")}</Link>
          </div>
        ))}
        <div className="sec-t">{t("acc.privacy")}</div>
        <div className="row card"><span className="l">{t("acc.delL")}</span>
          <button className="link danger" onClick={() => setConfirm(true)}>{t("acc.delB")}</button></div>
        {confirm && (
          <div className="modal-bg">
            <div className="modal">
              <h3>{t("acc.delT")}</h3>
              <p>{t("acc.delBd")}</p>
              <button className="btn bp" style={{ background: "var(--error)" }} onClick={() => {
                void fetch("/api/plaza/mine", { method: "DELETE" });
                updateState((s) => ({
                  pets: s.pets.map((p) => ({ ...p, hasAnchor: false, anchorImage: undefined })),
                  orders: s.orders.map((o) => ({ ...o, images: [] })),
                }));
                setConfirm(false);
              }}>{t("acc.delYes")}</button>
              <button className="btn bs" onClick={() => setConfirm(false)}>{t("common.cancel")}</button>
            </div>
          </div>
        )}
      </div></div>
    </>
  );
}
function curName(s: ReturnType<typeof loadState>) {
  return s.pets.find((p) => p.id === s.curPetId)?.name || "—";
}
