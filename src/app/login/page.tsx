import type { Metadata } from "next";
import Link from "next/link";
import { PawIcon } from "@/components/icons";
import { authEnabled, demoEnabled, getSessionUser } from "@/lib/auth";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Sign in", noindex: true });

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const user = await getSessionUser();
  const googleOn = authEnabled();
  const demoOn = demoEnabled();

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="h-display text-3xl">You&apos;re signed in 🎉</h1>
        <p className="mt-2 text-coffee">Signed in as {user.email}. Your downloads are unlocked.</p>
        <Link href={next && next.startsWith("/") ? next : "/"} className="btn-primary mt-6">
          Back to the studio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="card p-8 text-center !rounded-big">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white">
          <PawIcon className="h-6 w-6" />
        </span>
        <h1 className="h-display mt-4 text-3xl">Sign in to download</h1>
        <p className="mt-2 text-sm leading-relaxed text-coffee">
          Creating is free — no account needed. Sign in only when you want to keep your pictures.
        </p>
        {error && (
          <p className="mt-4 rounded-xl bg-coral-soft px-4 py-2 text-sm text-coral-deep">
            {error === "config" ? "Sign-in isn't configured on this server yet." : "Sign-in didn't go through — please try again."}
          </p>
        )}
        <div className="mt-6">
          {googleOn ? (
            <a href={`/api/auth/google?next=${encodeURIComponent(next || "/")}`} className="btn-primary w-full !bg-white !text-ink border border-sand hover:shadow-lift">
              <GoogleG /> Continue with Google
            </a>
          ) : (
            <p className="rounded-xl bg-parchment px-4 py-3 text-sm text-coffee">
              Google sign-in isn&apos;t configured yet (needs AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET).
            </p>
          )}
          {demoOn && (
            <form action={`/api/auth/demo?next=${encodeURIComponent(next || "/")}`} method="post" className="mt-3">
              <button className="btn-ghost w-full" type="submit">Demo sign-in (dev only)</button>
            </form>
          )}
        </div>
        <p className="mt-6 text-xs text-fog">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline hover:text-coral">terms</Link> and{" "}
          <Link href="/privacy" className="underline hover:text-coral">privacy policy</Link>.
        </p>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.15 3.5 2.7.24.03c2.2-2.1 3.5-5.1 3.5-8.6z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5l-.14.01-3.6 2.8-.05.13C3.4 21.3 7.4 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.01-.16-3.7-2.8-.12.06C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l3.8-3z" />
      <path fill="#EA4335" d="M12 4.6c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l3.8 3c.9-2.9 3.6-5 6.8-5z" />
    </svg>
  );
}
