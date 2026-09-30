import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet picture templates — PetsDaily",
  description: "100 pet picture templates: side-eye, desk shot, delivery, stickers, costumes, and covers. Use one with your own pet.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
