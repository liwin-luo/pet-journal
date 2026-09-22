"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CONTACT_EMAIL, legal } from "@/lib/legal.ts";
import { LocaleSwitch } from "./locale-switch";
import { Logo } from "./logo";
import { useI18n } from "./locale-provider";

export function LegalDoc({ kind }: { kind: "privacy" | "terms" }) {
  const { locale, m } = useI18n();
  const doc = legal[locale][kind];

  useEffect(() => {
    document.title = `${doc.title} · Petsdaily`;
  }, [doc.title]);

  return (
    <div className="relative z-1 min-h-dvh">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-5">
        <Logo href="/" stamp={m.stamp} brand={m.brand} />
        <div className="flex items-center gap-3">
          <LocaleSwitch />
          <Link href="/login" className="btn">{m.landing.cta}</Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-5 pb-16">
        <h1 className="display text-4xl leading-none">{doc.title}</h1>
        <p className="mt-3 text-sm text-mute">{doc.updated}</p>
        <div className="mt-8 space-y-8">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="display text-2xl leading-none">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-7 text-mute">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </article>
      <footer className="border-t border-line/70 px-5 py-6 text-center text-xs text-mute">
        <p>{m.landing.footer}</p>
        <p className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
          <Link href="/pricing" className="underline underline-offset-4">{m.landing.pricing}</Link>
          <Link href="/privacy" className="underline underline-offset-4">{m.landing.privacy}</Link>
          <Link href="/terms" className="underline underline-offset-4">{m.landing.terms}</Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">{CONTACT_EMAIL}</a>
        </p>
      </footer>
    </div>
  );
}
