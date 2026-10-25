import Link from "next/link";
import { Check } from "lucide-react";
import { plans, site, vnd } from "@/lib/site";

export function PricingCards() {
  return (
    <div data-stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {plans.map((p) => (
        <div
          key={p.code}
          className={`card-lift relative flex flex-col rounded-3xl p-7 transition-[transform,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            p.highlight ? "ring-anim spotlight glass-strong shadow-[0_40px_100px_-30px_rgb(231_192_122/0.4)] xl:-my-3 xl:py-10" : "card"
          }`}
        >
          {p.highlight && (
            <>
              <span className="ring-anim-border" />
              <span className="absolute -top-3 left-7 z-10 rounded-full bg-gradient-to-b from-gold-200 to-gold-400 px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-950 uppercase shadow-[0_6px_20px_-4px_rgb(231_192_122/0.7)]">
                Được chọn nhiều nhất
              </span>
            </>
          )}
          <h3 className="font-serif text-2xl text-cream">{p.name}</h3>
          <span className="mt-1 font-mono text-[11px] text-cream-mute">
            {p.charts} lá số{p.qaPerChart ? ` · ${p.qaPerChart.toLocaleString("vi-VN")} lượt hỏi/lá` : " · không cần đăng nhập"}
          </span>
          <p className="mt-2 min-h-[44px] text-sm leading-relaxed text-cream-dim">{p.pitch}</p>
          <div className="mt-5 flex items-baseline gap-2">
            <span className={`font-serif text-[40px] leading-none ${p.highlight ? "text-gold-gradient" : "text-cream"}`}>
              {p.price ? vnd(p.price) : "0đ"}
            </span>
            {site.showAnchorPrice && p.anchor && <span className="text-sm text-cream-mute line-through">{vnd(p.anchor)}</span>}
          </div>
          <div className="mt-1 text-xs text-cream-mute">{p.price ? "Trả một lần · không tự gia hạn" : "Mãi mãi"}</div>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-cream/90">
                <Check size={16} className={`mt-0.5 shrink-0 ${p.highlight ? "text-gold-400" : "text-jade"}`} />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href={p.price ? `/thanh-toan?order=TD7K2Q9M&plan=${p.code}` : "/lap-la-so"}
            className={`btn mt-7 w-full ${p.highlight ? "btn-primary" : "btn-secondary"}`}
          >
            {p.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
