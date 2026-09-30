import Link from "next/link";
import type { Tpl } from "@/lib/templates";
import { tplImg } from "@/lib/templates";
import { BadgeChip } from "./BadgeChip";
import { CopyButton } from "./CopyButton";

export function TemplateCard({ tpl, priority = false }: { tpl: Tpl; priority?: boolean }) {
  return (
    <article className="group card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/templates/${tpl.id}`} className="relative block" aria-label={`${tpl.name} template`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tplImg(tpl.id)}
          alt={`${tpl.name} — AI pet portrait template`}
          width={512}
          height={683}
          loading={priority ? "eager" : "lazy"}
          className="aspect-[3/4] w-full object-cover"
        />
        {tpl.badge && (
          <span className="absolute left-2 top-2">
            <BadgeChip badge={tpl.badge} />
          </span>
        )}
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <Link href={`/templates/${tpl.id}`} className="font-semibold font-display hover:text-coral">
            {tpl.name}
          </Link>
          <Link
            href={`/?tpl=${tpl.id}#create`}
            className="shrink-0 rounded-full bg-coral-soft px-3 py-1 text-xs font-semibold text-coral-deep transition-colors hover:bg-coral hover:text-white"
          >
            Try it
          </Link>
        </div>
        <p className="mt-1 line-clamp-2 min-h-10 text-sm text-coffee">{tpl.blurb}</p>
        <CopyButton text={tpl.prompt} className="mt-3 w-full !justify-center" />
      </div>
    </article>
  );
}
