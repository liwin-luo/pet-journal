import Link from "next/link";
import { SITE_MAIL, SITE_NAME, UPDATED } from "@/lib/site";
import { PawIcon } from "./icons";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-sand/70 bg-parchment/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 text-lg font-semibold font-display">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral text-white">
              <PawIcon className="h-4 w-4" />
            </span>
            {SITE_NAME}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-coffee">
            Upload a photo, say what you want, and get a picture that still looks like your pet. Every image is
            AI-generated.
          </p>
          <p className="mt-4 text-sm text-coffee">
            Questions?{" "}
            <a href={`mailto:${SITE_MAIL}`} className="font-medium text-coral hover:underline">
              {SITE_MAIL}
            </a>
          </p>
        </div>
        <nav aria-label="Product">
          <p className="text-sm font-semibold uppercase tracking-wide text-fog">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-coffee">
            <li><Link href="/#create" className="hover:text-coral">Create</Link></li>
            <li><Link href="/templates" className="hover:text-coral">Template center</Link></li>
            <li><Link href="/gallery" className="hover:text-coral">Gallery &amp; reviews</Link></li>
            <li><Link href="/faq" className="hover:text-coral">FAQ</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <p className="text-sm font-semibold uppercase tracking-wide text-fog">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-coffee">
            <li><Link href="/privacy" className="hover:text-coral">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:text-coral">Terms of service</Link></li>
            <li><Link href="/ai-disclosure" className="hover:text-coral">AI disclosure</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-sand/70 py-5 text-center text-xs text-fog">
        © {new Date().getFullYear()} {SITE_NAME} — all portraits are AI-generated · Last updated {UPDATED}
      </div>
    </footer>
  );
}
