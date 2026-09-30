import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PawIcon, SparkIcon } from "@/components/icons";
import { pageMeta } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { readDb } from "@/lib/store";
import { templateById } from "@/lib/templates";

export const dynamic = "force-dynamic";

async function getShare(token: string) {
  const db = await readDb();
  return db.shares[token];
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const share = await getShare(token);
  if (!share) return pageMeta({ title: "Picture not found", noindex: true });
  const tpl = templateById(share.templateId);
  return pageMeta({
    title: share.message ? `Someone made this: “${share.message.slice(0, 60)}”` : "An AI pet portrait",
    description: `AI pet portrait${tpl ? ` made with the ${tpl.name} template` : ""}. Make one of your pet — free, ~30 seconds.`,
    ogImage: share.image.startsWith("data:") ? undefined : `${SITE_URL}${share.image}`,
    noindex: true,
  });
}

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const share = await getShare(token);
  if (!share) notFound();
  const tpl = templateById(share.templateId);

  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center">
      <p className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-1.5 text-xs font-semibold text-coffee shadow-soft">
        <PawIcon className="h-3.5 w-3.5 text-coral" />
        Made in the AI pet studio · AI-generated
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={share.image}
        alt={share.message || "AI-generated pet portrait"}
        className="mx-auto mt-6 w-full max-w-md rounded-big shadow-lift"
      />
      {share.message && <p className="mt-4 text-coffee">“{share.message}”</p>}
      {tpl && (
        <p className="mt-1 text-sm text-fog">
          Template:{" "}
          <Link href={`/templates/${tpl.id}`} className="font-semibold text-coral hover:underline">
            {tpl.name}
          </Link>
        </p>
      )}
      <div className="mt-8 rounded-big bg-coral px-6 py-8 text-white shadow-lift">
        <h1 className="h-display text-2xl">Make one of YOUR pet</h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-coral-soft">One photo + one sentence. Free to try, no account.</p>
        <Link
          href="/#create"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-coral-deep transition-transform hover:-translate-y-0.5"
        >
          <SparkIcon className="h-4 w-4" /> Create mine
        </Link>
      </div>
    </div>
  );
}
