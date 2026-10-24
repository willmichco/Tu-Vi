import { Plus } from "lucide-react";

export function Faq({ items, withSchema = true }: { items: { q: string; a: string }[]; withSchema?: boolean }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {items.map((i) => (
        <details key={i.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[16px] text-cream marker:hidden">
            {i.q}
            <Plus size={18} className="shrink-0 text-gold-400 transition group-open:rotate-45" />
          </summary>
          <p className="pb-5 pr-10 text-[15px] leading-relaxed text-cream-dim">{i.a}</p>
        </details>
      ))}
      {withSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
    </div>
  );
}
