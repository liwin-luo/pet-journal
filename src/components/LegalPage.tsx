import Link from "next/link";
import { UPDATED } from "@/lib/site";

type Block = { h: string; body: string[] };

/** 法律页共用排版：privacy / terms / ai-disclosure 都是「标题 + 段块」。 */
export function LegalPage({ title, intro, blocks, mail }: { title: string; intro: string; blocks: Block[]; mail: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="h-display text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-fog">Last updated {UPDATED}</p>
      <p className="mt-4 text-coffee">{intro}</p>
      <div className="mt-8 space-y-8">
        {blocks.map((b) => (
          <section key={b.h}>
            <h2 className="font-display text-xl font-semibold">{b.h}</h2>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-coffee">
              {b.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm text-coffee">
        Questions about this page? Write to{" "}
        <a href={`mailto:${mail}`} className="font-semibold text-coral hover:underline">{mail}</a>. See also our{" "}
        <Link href="/faq" className="font-semibold text-coral hover:underline">FAQ</Link>.
      </p>
    </div>
  );
}
