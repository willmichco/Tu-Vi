import { AlertTriangle } from "lucide-react";
import { Markdown, headingsOf } from "@/components/ui/Markdown";

export function LegalPage({ eyebrow, title, updated, intro, body }: { eyebrow: string; title: string; updated: string; intro: string; body: string }) {
  const toc = headingsOf(body);
  return (
    <div className="container-x py-12 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,720px)_1fr]">
        <article>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="h-display mt-3 text-4xl sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-cream-dim">{intro}</p>
          <div className="mt-4 font-mono text-[11.5px] text-cream-mute">Cập nhật {updated}</div>
          <div className="mt-6 flex gap-3 rounded-xl border border-gold-400/30 bg-gold-400/[0.06] p-4 text-sm text-gold-200">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            Bản nháp cho bản thiết kế — phải được rà soát theo văn bản pháp luật hiện hành trước khi đăng.
          </div>
          <div className="hairline my-8" />
          <Markdown source={body} />
        </article>
        <aside className="hidden lg:block">
          <div className="card sticky top-24 p-5">
            <div className="eyebrow">Mục lục</div>
            <ol className="mt-3 space-y-2 text-sm">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="text-cream-dim hover:text-gold-200">
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
