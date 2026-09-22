"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LocaleSwitch } from "./locale-switch";
import { Mark } from "./logo";
import { useI18n } from "./locale-provider";

export function LoginCard() {
  const { m } = useI18n();
  const error = useSearchParams().get("error");
  const hint = error
    ? m.login.errors[error as keyof typeof m.login.errors] ?? m.login.errors.other
    : "";
  return (
    <div className="login-split">
      <aside className="login-hero">
        <div>
          <Mark size={56} />
          <p className="stamp mt-5">{m.stamp}</p>
          <h1 className="display mt-8 whitespace-pre-line text-5xl leading-none">{m.login.heroTitle}</h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#5a4030]">{m.login.heroBody}</p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-sm text-[#5a4030]/80">{m.landing.footer}</p>
          <LocaleSwitch tone="hero" />
        </div>
      </aside>
      <section className="flex items-center justify-center px-6 py-16">
        <div className="card w-full max-w-md p-8">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <span className="flex items-center gap-2">
              <Mark size={28} />
              <span className="stamp">{m.stamp}</span>
            </span>
            <LocaleSwitch />
          </div>
          <p className="text-[11px] tracking-[0.16em] text-mute uppercase">{m.login.welcome}</p>
          <h2 className="display mt-3 text-3xl leading-none">{m.login.title}</h2>
          <p className="mt-3 text-sm leading-6 text-mute">{m.login.body}</p>
          {hint ? <p className="mt-4 text-sm text-stamp">{hint}</p> : null}
          <a href="/api/auth/google" className="btn mt-8 w-full">{m.login.cta}</a>
          <Link href="/" className="mt-4 block text-center text-xs text-mute underline underline-offset-4">
            {m.brand}
          </Link>
        </div>
      </section>
    </div>
  );
}
