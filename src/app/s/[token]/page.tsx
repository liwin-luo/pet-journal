import type { Metadata } from "next";
import { headers } from "next/headers";
import { readShare } from "@/lib/share-store";
import { ShareCard } from "@/components/ShareCard";
import { ShareBar } from "@/components/ShareBar";

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const rec = await readShare(token);
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const title = rec?.petName ? `${rec.petName} · PetsDaily` : "PetsDaily";
  const description = rec?.text?.slice(0, 140) || "A portrait from PetsDaily";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: rec?.image ? [`${proto}://${host}/api/share/${token}/img`] : [],
    },
  };
}

export default async function PublicSharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const rec = await readShare(token);
  if (!rec) {
    return <div className="share-stage"><p className="psub">PetsDaily</p></div>;
  }
  return (
    <div className="share-stage">
      <ShareCard kind={rec.kind} petName={rec.petName} text={rec.text} image={rec.image} date={rec.date} mark={rec.mark} />
      <ShareBar image={rec.image} />
    </div>
  );
}
