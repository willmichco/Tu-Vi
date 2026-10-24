import type { Metadata } from "next";
import Link from "next/link";
import { Check, Coins, RefreshCcw } from "lucide-react";
import { SectionHead } from "@/components/ui/Section";
import { addons } from "@/lib/site";
import { LichClient } from "./LichClient";

export const metadata: Metadata = {
  title: "Lịch vận hạn theo lá số — mỗi ngày một cung",
  description: "Lịch tháng gắn với lá số tử vi của bạn: mỗi ngày ứng với một cung, nội dung từ kho tri thức đã duyệt. Thuê bao trả bằng xu, giá niêm yết công khai.",
  alternates: { canonical: "/lich-van-han" },
};

export default function Page() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] grid-bg" />
      <div className="container-x relative py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <span className="eyebrow">Lịch vận hạn</span>
            <h1 className="h-display mt-3 text-4xl sm:text-5xl">Mỗi ngày trong tháng, một cung trên lá số của bạn</h1>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-cream-dim">
              Lịch biết hôm nay chạm vào chủ đề nào của đời sống — công việc, tài chính, tình cảm… — kèm phép tính đằng sau. Không phán kết quả,
              không xem ngày tốt xấu.
            </p>
          </div>
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gold-300">
              <Coins size={16} />
              <span className="eyebrow">Thuê bao theo lá · giá niêm yết</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {addons.lichVanHan.map((p) => (
                <div key={p.code} className="rounded-xl border border-[var(--line-strong)] p-4">
                  <div className="text-sm text-cream-dim">{p.name}</div>
                  <div className="mt-1 font-serif text-3xl text-cream">
                    {p.xu} <span className="text-base text-cream-dim">xu</span>
                  </div>
                  <div className="font-mono text-[11px] text-cream-mute">= {(p.xu * 1000).toLocaleString("vi-VN")}đ / {p.period}</div>
                </div>
              ))}
            </div>
            <Link href="/dang-nhap" className="btn btn-primary mt-4 w-full">
              Đăng nhập để mở thuê bao
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <LichClient />
        </div>

        <section className="mt-20">
          <SectionHead eyebrow="Gia hạn minh bạch" title="Trả bằng xu, dừng là dừng" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [RefreshCcw, "Tự gia hạn bằng xu", "Đến kỳ, hệ thống trừ xu trong ví và gia hạn. Mọi lần trừ đều có trong lịch sử ví."],
              [Coins, "Không đủ xu thì tạm dừng", "Thuê bao chuyển sang hết hạn, dữ liệu lá số vẫn giữ nguyên."],
              [Check, "Bật lại không truy thu", "Kỳ mới tính từ ngày bạn bật lại. Không cộng dồn phí những ngày đã dừng."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof Check;
              return (
                <div key={t as string} className="card p-6">
                  <I size={20} className="text-gold-400" />
                  <div className="mt-4 font-medium text-cream">{t as string}</div>
                  <p className="mt-2 text-sm leading-relaxed text-cream-dim">{d as string}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
