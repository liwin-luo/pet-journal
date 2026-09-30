import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { FAQS } from "@/lib/faq";
import { pageMeta } from "@/lib/seo";
import { SITE_MAIL } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "FAQ — questions about our AI pet portrait generator",
  description:
    "How it works, photo tips, what happens to your uploads, free limits, AI labeling and more — everything about turning your pet's photo into AI art.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="h-display text-4xl">Frequently asked questions</h1>
        <p className="mt-3 text-coffee">Short answers about the studio. Anything else? Mail us at{" "}
          <a href={`mailto:${SITE_MAIL}`} className="font-semibold text-coral hover:underline">{SITE_MAIL}</a>.
        </p>
      </header>
      <div className="mt-10">
        <FaqAccordion items={FAQS} />
      </div>
      <div className="mt-10 text-center">
        <Link href="/#create" className="btn-primary">Make my first picture</Link>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </div>
  );
}
