import Link from "next/link";
import { Lock, QrCode } from "lucide-react";
import { plans, vnd } from "@/lib/site";

export function Paywall({
  title,
  desc,
  chartId,
  highlight = "chuyen-sau",
  compact = false,
}: {
  title: string;
  desc: string;
  chartId: string;
  highlight?: "co-ban" | "chuyen-sau";
  compact?: boolean;
}) {
  const options = plans.filter((p) => p.code === "co-ban" || p.code === "chuyen-sau");
  return (
    <div className="glass-strong relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="pointer-events-none absolute -top-24 -right-24 size-64 glow-gold" />
      <div className="relative">
        <div className="flex items-center gap-2 text-gold-300">
          <Lock size={16} />
          <span className="eyebrow">Nội dung trả phí</span>
        </div>
        <h3 className="mt-3 font-serif text-xl text-cream sm:text-2xl">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream-dim">{desc}</p>
        {!compact && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {options.map((p) => (
              <Link
                key={p.code}
                href={`/thanh-toan?order=TD7K2Q9M&plan=${p.code}&chart=${chartId}`}
                className={`group rounded-xl border p-4 transition ${
                  p.code === highlight
                    ? "border-gold-400/60 bg-gold-400/[0.07] hover:bg-gold-400/[0.11]"
                    : "border-[var(--line-strong)] bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-cream">{p.name}</span>
                  {p.code === highlight && <span className="chip !py-0.5 text-[10px] text-gold-300">Nên chọn</span>}
                </div>
                <div className="mt-1 font-serif text-2xl text-gold-300">{vnd(p.price)}</div>
                <div className="mt-1 text-xs text-cream-dim">
                  {p.qaPerChart.toLocaleString("vi-VN")} lượt hỏi · {p.code === "chuyen-sau" ? "có podcast 25–30 phút" : "đủ 12 cung + vận hạn"}
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-cream-dim">
          <span className="inline-flex items-center gap-1.5">
            <QrCode size={14} className="text-jade" /> VietQR · tự kích hoạt trong 1–3 phút
          </span>
          <Link href="/bang-gia" className="text-gold-300 hover:underline">
            So sánh các gói →
          </Link>
          <Link href="/hoan-tien" className="hover:text-cream">
            Hoàn 100% nếu chưa dùng, trong 7 ngày
          </Link>
        </div>
      </div>
    </div>
  );
}
