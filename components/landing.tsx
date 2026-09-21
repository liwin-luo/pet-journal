"use client";

import Link from "next/link";
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
            <a href="#price" className="btn btn-ghost">{m.landing.priceTitle}</a>
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

      <section id="price" className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="display text-3xl">{m.landing.priceTitle}</h2>
        <p className="mt-2 max-w-xl text-sm text-mute">{m.landing.priceNote}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {m.landing.plans.map((plan) => (
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
              <Link href="/login" className={`mt-6 ${"featured" in plan && plan.featured ? "btn" : "btn btn-ghost"} w-full`}>
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-line/70 px-5 py-6 text-center text-xs text-mute">
        {m.landing.footer}
      </footer>
    </div>
  );
}
