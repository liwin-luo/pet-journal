import type { Metadata, Viewport } from "next";
import { LocaleProvider } from "@/components/locale-provider";
import { Shell } from "@/components/shell";
import { htmlLang } from "@/lib/i18n.ts";
import { readLocale } from "@/lib/locale.ts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petsdaily",
  description: "A journal for the one at home",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await readLocale();
  return (
    <html lang={htmlLang(locale)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+KR:wght@400;700&family=Noto+Sans+SC:wght@400;700&family=Noto+Serif+SC:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <Shell>{children}</Shell>
        </LocaleProvider>
      </body>
    </html>
  );
}
