"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CONTACT_EMAIL, checkoutHref } from "@/lib/legal.ts";
import { LocaleSwitch } from "./locale-switch";
import { useI18n } from "./locale-provider";

export function PricingPage() {
  const { m } = useI18n();

  useEffect(() => {
    document.title = `${m.landing.priceTitle} · Petsdaily`;
  }, [m.landing.priceTitle]);

  return (
    <div className="relative z-1 min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5">
        <Link href="/">
          <p className="stamp">{m.stamp}</p>
          <p className="display mt-2 text-xl leading-none">{m.brand}</p>
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitch />
          <Link href="/login" className="btn">{m.landing.cta}</Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-6">
        <h1 className="display text-3xl">{m.landing.priceTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-mute">{m.landing.priceNote}</p>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-mute">{m.landing.priceCancel}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {m.landing.plans.map((plan) => {
            const href = checkoutHref(plan.checkout);
            const className = `mt-6 ${"featured" in plan && plan.featured ? "btn" : "btn btn-ghost"} w-full`;
            return (
              <article
                key={plan.name}
                className={`card flex flex-col p-6 ${"featured" in plan && plan.featured ? "outline outline-2 outline-ink" : ""}`}
              >
                <p className="text-xs tracking-[0.14em] text-mute uppercase">{plan.name}</p>
                <p className="display mt-3 text-4xl leading-none">
                  {plan.price}
                  <span className="ml-1 text-base text-mute">{plan.period}</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-mute">
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {href.startsWith("http") ? (
                  <a href={href} className={className}>{plan.cta}</a>
                ) : (
                  <Link href={href} className={className}>{plan.cta}</Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

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
