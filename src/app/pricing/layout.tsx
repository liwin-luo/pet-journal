import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — PetsDaily",
  description: "Free is $0 for 1 pet and 8 pictures a month. Plus is $6 a month. Family is $12 a month.",
  alternates: { canonical: "/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
