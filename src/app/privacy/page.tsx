import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy — PetsDaily",
  description: "How PetsDaily uses the photos and account details you give us.",
};

export default function PrivacyPage() {
  return <LegalDoc kind="privacy" />;
}
