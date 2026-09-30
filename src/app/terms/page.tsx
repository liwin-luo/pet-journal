import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Terms — PetsDaily",
  description: "The agreement for using PetsDaily.",
};

export default function TermsPage() {
  return <LegalDoc kind="terms" />;
}
