import Link from "next/link";
import { PawIcon } from "@/components/icons";
import { getDict, isLocale } from "@/lib/i18n";

/** 注意：Next 会在每个路由的预渲染中附带渲染 404 边界（不传 params），因此参数必须可选。 */
export default async function NotFound({ params }: { params?: Promise<{ locale: string }> }) {
  const p = await params?.catch(() => null);
  const raw = p?.locale ?? "";
  const t = getDict(isLocale(raw) ? raw : "en");

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <PawIcon className="mx-auto h-12 w-12 text-coral" />
      <h1 className="h-display mt-4 text-3xl">{t.nf.title}</h1>
      <p className="mt-2 text-coffee">{t.nf.body}</p>
      <Link href="/" className="btn-primary mt-6">{t.nf.btn}</Link>
    </div>
  );
}
