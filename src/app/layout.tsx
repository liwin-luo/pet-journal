import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/I18n";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.petsdaily.live"),
  title: "PetsDaily — Turn your pet into a meme",
  description: "One clear photo. A meme that still looks like your pet. Side-eye, desk shot, delivery, or a sticker.",
  openGraph: {
    title: "PetsDaily — Turn your pet into a meme",
    description: "One clear photo. A meme that still looks like your pet.",
    url: "https://www.petsdaily.live",
    siteName: "PetsDaily",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,600&family=Inter:wght@400;500;600&family=Caveat:wght@500&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
