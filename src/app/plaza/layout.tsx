import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plaza — PetsDaily",
  description: "Pictures pet owners chose to publish. Open one to see the share page.",
  alternates: { canonical: "/plaza" },
};

export default function PlazaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
