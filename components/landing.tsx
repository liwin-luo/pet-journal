"use client";

import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/legal.ts";
import { LocaleSwitch } from "./locale-switch";
import { useI18n } from "./locale-provider";

export function Landing({ inApp }: { inApp: boolean }) {
  const { m } = useI18n();

  return (
    <div className="relative z-1 min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5">
        <div>
          <p className="stamp">{m.stamp}</p>
          <p className="display mt-2 text-xl leading-none">{m.brand}</p>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitch />
          {inApp ? (
            <Link href="/today" className="btn">{m.nav.open}</Link>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm underline underline-offset-4 sm:inline">{m.landing.ctaLogin}</Link>
              <Link href="/login" className="btn">{m.landing.cta}</Link>
            </>
          )}
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-mute uppercase">{m.landing.kicker}</p>
          <h1 className="display mt-4 whitespace-pre-line text-5xl leading-[0.95] sm:text-6xl">{m.landing.heroTitle}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-mute">{m.landing.heroBody}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={inApp ? "/today" : "/login"} className="btn">
              {inApp ? m.landing.ctaApp : m.landing.cta}
            </Link>
            <Link href="/pricing" className="btn btn-ghost">{m.landing.priceTitle}</Link>
          </div>
        </div>
        <div className="card overflow-hidden p-6">
          <p className="stamp">TODAY</p>
          <p className="display mt-6 text-3xl leading-none">{m.pages.today.title}</p>
          <p className="mt-3 text-sm leading-7 text-mute">{m.pages.today.desc}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {m.landing.steps.map((step) => (
              <div key={step.title} className="rounded-2xl bg-paper/80 p-3">
                <p className="display text-lg">{step.title}</p>
                <p className="mt-1 text-xs leading-5 text-mute">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="display text-3xl">{m.landing.stepsTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {m.landing.steps.map((step, index) => (
            <article key={step.title} className="card p-5">
              <p className="text-xs tracking-[0.16em] text-mute">0{index + 1}</p>
              <h3 className="display mt-2 text-2xl leading-none">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-mute">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="display text-3xl">{m.landing.featuresTitle}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {m.landing.features.map((item) => (
            <article key={item.title} className="card p-5">
              <h3 className="display text-2xl leading-none">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-mute">{item.body}</p>
            </article>
          ))}
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
