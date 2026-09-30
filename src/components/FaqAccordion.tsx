import type { ReactNode } from "react";

export function FaqAccordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="divide-y divide-sand/80 rounded-big border border-sand/70 bg-white shadow-soft">
      {items.map((item, i) => (
        <details key={i} className="group px-6 py-5" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="text-coral transition-transform group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="mt-3 text-sm leading-relaxed text-coffee">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
