"use client";
import { useI18n } from "./I18n";
import { SiteChrome } from "./SiteChrome";
import { siteCopy } from "@/lib/site";

export function LegalDoc({ kind }: { kind: "privacy" | "terms" }) {
  const { lang } = useI18n();
  const c = siteCopy(lang);
  const blocks = kind === "privacy" ? c.privacy : c.terms;
  return (
    <SiteChrome>
      <article className="legal">
        <h1>{kind === "privacy" ? c.privacyTitle : c.termsTitle}</h1>
        <p className="updated">{c.updated}</p>
        {blocks.map((b) => (
          <section key={b.h}>
            <h2>{b.h}</h2>
            {b.body.map((p) => <p key={p}>{p}</p>)}
          </section>
        ))}
      </article>
    </SiteChrome>
  );
}
