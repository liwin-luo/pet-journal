import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import { TemplateCard } from "@/components/TemplateCard";
import { pageMeta } from "@/lib/seo";
import { CATS, TEMPLATES, templateById, tplImg } from "@/lib/templates";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tpl = templateById(slug);
  if (!tpl) return pageMeta({ title: "Template not found", noindex: true });
  return pageMeta({
    title: `${tpl.name} pet portrait — free AI template`,
    description: `${tpl.blurb} Copy the exact ${tpl.name.toLowerCase()} prompt and turn your cat or dog into it in ~30 seconds. Free, no account needed.`,
    path: `/templates/${tpl.id}`,
    ogImage: tplImg(tpl.id),
  });
}

export default async function TemplateDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tpl = templateById(slug);
  if (!tpl) notFound();
  const cat = CATS.find((c) => c.id === tpl.cat)!;
  const related = TEMPLATES.filter((t) => t.cat === tpl.cat && t.id !== tpl.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="text-sm text-coffee" aria-label="Breadcrumb">
        <Link href="/templates" className="hover:text-coral">Template center</Link>
        <span className="mx-2 text-fog">/</span>
        <Link href={`/templates?cat=${tpl.cat}`} className="hover:text-coral">{cat.name}</Link>
        <span className="mx-2 text-fog">/</span>
        <span className="text-ink">{tpl.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tplImg(tpl.id)}
            alt={`${tpl.name} — AI pet portrait template example`}
            width={512}
            height={683}
            fetchPriority="high"
            className="w-full rounded-big object-cover shadow-lift"
          />
          <figcaption className="mt-3 text-xs text-fog">
            Example made with this template · every result is AI-generated
          </figcaption>
        </figure>

        <div>
          <h1 className="h-display text-3xl md:text-4xl">{tpl.name} pet portrait</h1>
          <p className="mt-3 text-coffee">{tpl.blurb}</p>

          <div className="mt-6 card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-fog">The prompt — free to copy</p>
            <p className="mt-2 rounded-xl bg-parchment/70 p-4 font-mono text-sm leading-relaxed">{tpl.prompt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton text={tpl.prompt} />
              <Link href={`/?tpl=${tpl.id}#create`} className="btn-primary !py-2 text-sm">
                Use this template
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold">How to use it</h2>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-coffee">
              <li>Copy the prompt above, or just tap “Use this template”.</li>
              <li>Attach one clear photo of your pet — face visible, good light.</li>
              <li>
                Optional: add your twist in the message, e.g. “with a tiny scarf” or “more golden light”.
              </li>
              <li>Generate, download, and share. Not perfect? Regenerate for free.</li>
            </ol>
          </div>

          <p className="mt-6 rounded-xl bg-sage-soft px-4 py-3 text-sm text-sage">
            💡 Tip: works for cats, dogs, birds, fish, rabbits — any pet with a face. Results keep your pet&apos;s
            real fur markings and eye color.
          </p>
        </div>
      </div>

      <section className="mt-14" aria-labelledby="related">
        <h2 id="related" className="h-display text-2xl">More {cat.name.toLowerCase()} templates</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {related.map((t) => (
            <TemplateCard key={t.id} tpl={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
