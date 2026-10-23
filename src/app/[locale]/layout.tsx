import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { getDict, isLocale, LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Fraunces, Geist } from "next/font/google";
import "../globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["SOFT", "WONK"] });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  // 只给默认标题；子页面的标题由 pageMeta 统一追加品牌后缀
  return { title: `${SITE_NAME} — ${getDict(raw as Locale).home.heroHl}` };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  return (
    <html lang={LOCALE_META[locale].hreflang.split("-")[0]} className={`${fraunces.variable} ${geist.variable}`}>
      <body>
        <JsonLd
          data={[
            { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: SITE_NAME,
              url: SITE_URL,
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
          ]}
        />
        <Header locale={locale} t={t} />
        <main>{children}</main>
        <Footer locale={locale} t={t} />
        <Analytics />
      </body>
    </html>
  );
}
