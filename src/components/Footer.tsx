import Link from "next/link";
import { lp, type Dict, type Locale } from "@/lib/i18n";
import { SITE_MAIL, SITE_NAME, UPDATED } from "@/lib/site";
import { PawIcon } from "./icons";

export function Footer({ locale, t }: { locale: Locale; t: Dict }) {
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
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-coffee">{t.footer.blurb}</p>
          <p className="mt-4 text-sm text-coffee">
            {t.footer.questions}{" "}
            <a href={`mailto:${SITE_MAIL}`} className="font-medium text-coral hover:underline">
              {SITE_MAIL}
            </a>
          </p>
        </div>
        <nav aria-label="Product">
          <p className="text-sm font-semibold uppercase tracking-wide text-fog">{t.footer.product}</p>
          <ul className="mt-3 space-y-2 text-sm text-coffee">
            <li><Link href={lp(locale, "/#create")} className="hover:text-coral">{t.footer.create}</Link></li>
            <li><Link href={lp(locale, "/templates")} className="hover:text-coral">{t.footer.tplCenter}</Link></li>
            <li><Link href={lp(locale, "/gallery")} className="hover:text-coral">{t.footer.galleryReviews}</Link></li>
            <li><Link href={lp(locale, "/faq")} className="hover:text-coral">{t.footer.faq}</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <p className="text-sm font-semibold uppercase tracking-wide text-fog">{t.footer.legal}</p>
          <ul className="mt-3 space-y-2 text-sm text-coffee">
            <li><Link href={lp(locale, "/privacy")} className="hover:text-coral">{t.footer.privacy}</Link></li>
            <li><Link href={lp(locale, "/terms")} className="hover:text-coral">{t.footer.terms}</Link></li>
            <li><Link href={lp(locale, "/ai-disclosure")} className="hover:text-coral">{t.footer.ai}</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-sand/70 py-5 text-center text-xs text-fog">
        © {new Date().getFullYear()} {SITE_NAME} — {t.footer.copyright} · {t.footer.updated} {UPDATED}
      </div>
    </footer>
  );
}
