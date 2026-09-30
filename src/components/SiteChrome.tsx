"use client";
import { ReactNode } from "react";
import { useI18n } from "./I18n";
import { LANGS, LANG_LABEL, Lang } from "@/lib/types";
import { SITE_MAIL, siteCopy } from "@/lib/site";

export function SiteChrome({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const c = siteCopy(lang);
  return (
    <main className="land">
      <header className="land-bar">
        <a className="logo" href="/">Pets<i>Daily</i></a>
        <nav className="land-nav" aria-label="Site">
          <a href="/pricing">{c.foot.pricing}</a>
          <a href="/templates">{lang === "zh" ? "模板中心" : t("tpl.title")}</a>
          <a href="/plaza">{t("nav.plaza")}</a>
          <a href="/#faq">{c.foot.faq}</a>
        </nav>
        <div className="hright">
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
            {LANGS.map((l) => <option key={l} value={l}>{LANG_LABEL[l]}</option>)}
          </select>
          <a className="btn bp btn-sm" href="/create">{t("land.cta")}</a>
        </div>
      </header>
      {children}
      <footer className="land-foot">
        <div className="container">
          <div className="foot-grid">
            <div className="foot-brand">
              <a className="logo" href="/">Pets<i>Daily</i></a>
              <p>{c.foot.blurb}</p>
            </div>
            <div>
              <h4>{c.foot.product}</h4>
              <ul>
                <li><a href="/#how">{c.foot.how}</a></li>
                <li><a href="/#gift">{c.foot.gift}</a></li>
                <li><a href="/pricing">{c.foot.pricing}</a></li>
                <li><a href="/#faq">{c.foot.faq}</a></li>
              </ul>
            </div>
            <div>
              <h4>{c.foot.legal}</h4>
              <ul>
                <li><a href="/privacy">{c.foot.privacy}</a></li>
                <li><a href="/terms">{c.foot.terms}</a></li>
                <li><a href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</a></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom"><span>{c.foot.copy}</span></div>
        </div>
      </footer>
    </main>
  );
}
