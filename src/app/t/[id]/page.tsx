import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/SiteChrome";
import { CATS, TEMPLATES } from "@/lib/templates";

export function generateStaticParams() {
  return TEMPLATES.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = TEMPLATES.find((t) => t.id === id);
  if (!item) return {};
  const title = `${item.en} pet picture — PetsDaily`;
  const description = `Turn your pet into a ${item.en.toLowerCase()} picture. ${item.zh}. One clear photo, still the same pet.`;
  return {
    title,
    description,
    alternates: { canonical: `/t/${item.id}` },
    openGraph: { title, description, images: [`/tpl/${item.id}.jpg`] },
  };
}

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = TEMPLATES.find((t) => t.id === id);
  if (!item) notFound();
  const cat = CATS.find((c) => c.id === item.cat);
  const more = TEMPLATES.filter((t) => t.cat === item.cat && t.id !== item.id).slice(0, 4);
  return (
    <SiteChrome>
      <section className="block">
        <div className="container" style={{ maxWidth: 760 }}>
          <p className="sub" style={{ marginBottom: 8 }}>{cat?.en} · {cat?.zh}</p>
          <h1 className="sec-head">{item.en}</h1>
          <p className="sub">{item.zh}. One clear photo. This look, still your pet.</p>
          <img src={`/tpl/${item.id}.jpg`} alt={`${item.en} pet picture`} style={{ width: "100%", borderRadius: 18, margin: "18px 0" }} />
          <a className="btn bp" href={`/create?tpl=${item.id}`}>Use this template</a>
          <p className="sub" style={{ marginTop: 28 }}>{more.map((t) => t.en).join(" · ")}</p>
          <p>
            {more.map((t) => (
              <a key={t.id} href={`/t/${t.id}`} style={{ marginRight: 16 }}>{t.en}</a>
            ))}
            <a href="/templates">All templates</a>
          </p>
        </div>
      </section>
    </SiteChrome>
  );
}
