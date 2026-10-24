import type { Metadata } from "next";
import Link from "next/link";
import { Check, Coins, Minus, QrCode, Undo2 } from "lucide-react";
import { PricingCards } from "@/components/PricingCards";
import { Faq } from "@/components/ui/Faq";
import { SectionHead } from "@/components/ui/Section";
import { pricingFaq } from "@/content/faq";
import { addons, compareRows, plans, vnd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bảng giá — niêm yết công khai mọi gói, thuê bao và nạp lẻ",
  description: "Lập lá số miễn phí. Gói Cơ bản 129.000đ, Chuyên sâu 299.000đ, Gia đình 750.000đ, trả một lần. Ví xu, nạp lẻ lượt hỏi và thuê bao Lịch vận hạn đều niêm yết công khai.",
  alternates: { canonical: "/bang-gia" },
};

export default function Page() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 size-[760px] -translate-x-1/2 glow-gold opacity-60" />
      <div className="container-x relative py-12 sm:py-16">
        <SectionHead
          as="h1"
          align="center"
          eyebrow="Bảng giá niêm yết"
          title={<>Mọi mức giá đều nằm ở trang này</>}
          desc="Không phải nhắn tin hỏi giá. Gói trả một lần cho từng lá, không tự gia hạn. Thuê bao và nạp lẻ trả bằng xu, cũng niêm yết đầy đủ."
        />
        <div className="mt-12">
          <PricingCards />
        </div>

        {/* Bảng so sánh */}
        <section className="mt-20">
          <SectionHead eyebrow="So sánh chi tiết" title="Gói nào có gì" />
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--line)]">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="px-5 py-4 text-left font-normal text-cream-mute">Quyền lợi</th>
                  {plans.map((p) => (
                    <th key={p.code} className={`px-4 py-4 text-center font-medium ${p.highlight ? "text-gold-300" : "text-cream"}`}>
                      {p.name}
                      <div className="font-mono text-[11px] font-normal text-cream-mute">{p.price ? vnd(p.price) : "0đ"}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr key={r.label} className="border-t border-[var(--line)]">
                    <td className="px-5 py-3.5 text-cream/90">{r.label}</td>
                    {r.values.map((v, i) => (
                      <td key={i} className={`px-4 py-3.5 text-center ${plans[i].highlight ? "bg-gold-400/[0.04]" : ""}`}>
                        {v === true ? (
                          <Check size={16} className="mx-auto text-jade" />
                        ) : v === false ? (
                          <Minus size={16} className="mx-auto text-cream-mute/60" />
                        ) : (
                          <span className="font-mono text-cream">{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Ví xu, nạp lẻ, thuê bao */}
        <section className="mt-20 grid gap-4 lg:grid-cols-3">
          <div className="glass-strong rounded-2xl p-6 lg:row-span-2">
            <div className="flex items-center gap-2 text-gold-300">
              <Coins size={18} />
              <span className="eyebrow">Ví xu</span>
            </div>
            <div className="mt-4 font-serif text-4xl text-cream">1 xu = 1.000đ</div>
            <ul className="mt-5 space-y-2.5 text-sm text-cream/90">
              {[
                "Nạp bằng VietQR, dùng mua gói, thuê bao, nạp lẻ lượt hỏi",
                "Xu không hết hạn",
                "Không chuyển tài khoản, không đổi ngược ra tiền",
                "Mọi biến động có trong lịch sử ví (sổ cái)",
                "Chuyển khoản dư khi mua gói: phần dư tự cộng vào ví",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check size={15} className="mt-0.5 shrink-0 text-jade" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-4 gap-2">
              {addons.xuPacks.map((x) => (
                <Link key={x} href={`/thanh-toan/TD7K2Q9M?plan=xu-${x}`} className="rounded-xl border border-[var(--line-strong)] py-3 text-center hover:border-gold-400/50">
                  <div className="font-serif text-lg text-cream">{x}</div>
                  <div className="font-mono text-[10px] text-cream-mute">xu</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <div className="eyebrow">Nạp lẻ lượt hỏi</div>
            <div className="mt-4 space-y-3">
              {addons.topupQa.map((t) => (
                <div key={t.code} className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
                  <span className="text-cream">{t.turns} lượt</span>
                  <span className="font-mono text-gold-300">{t.xu} xu</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-cream-dim">Lượt gắn với từng lá số. Gọi AI lỗi không trừ lượt.</p>
          </div>
          <div className="card p-6">
            <div className="eyebrow">Lịch vận hạn · thuê bao theo lá</div>
            <div className="mt-4 space-y-3">
              {addons.lichVanHan.map((t) => (
                <div key={t.code} className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
                  <span className="text-cream">{t.name}</span>
                  <span className="font-mono text-gold-300">
                    {t.xu} xu/{t.period}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-cream-dim">Không đủ xu thì tạm dừng, bật lại không truy thu.</p>
          </div>
          <div className="card p-6 lg:col-span-2">
            <div className="eyebrow">Tình duyên · đối chiếu hai lá</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {addons.tinhDuyen.map((t) => (
                <div key={t.code} className="rounded-xl border border-[var(--line)] px-4 py-3">
                  <div className="text-sm text-cream-dim">{t.name}</div>
                  <div className="mt-1 font-serif text-2xl text-cream">{vnd(t.price)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            <div className="card p-6">
              <QrCode size={20} className="text-jade" />
              <div className="mt-3 font-medium text-cream">Thanh toán VietQR</div>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">
                Quét mã bằng app ngân hàng bất kỳ. Nội dung chuyển khoản là mã đơn duy nhất; hệ thống nhận báo có và kích hoạt trong 1–3 phút.
                Tài khoản nhận tiền đứng tên chủ thể kinh doanh, có xuất hóa đơn.
              </p>
            </div>
            <div className="card p-6">
              <Undo2 size={20} className="text-gold-400" />
              <div className="mt-3 font-medium text-cream">Hoàn tiền</div>
              <ul className="mt-2 space-y-1.5 text-sm text-cream-dim">
                <li>• Hoàn 100% nếu chưa dùng lượt nào và báo trong 7 ngày.</li>
                <li>• Xu chưa tiêu hoàn trong 7 ngày.</li>
                <li>• Nội dung đã sinh (bài luận, PDF, audio) không hoàn.</li>
              </ul>
              <Link href="/hoan-tien" className="mt-3 inline-block text-sm text-gold-300 hover:underline">
                Chính sách đầy đủ →
              </Link>
            </div>
          </div>
          <div>
            <SectionHead eyebrow="Hỏi về thanh toán" title="Câu hỏi thường gặp" />
            <div className="mt-8">
              <Faq items={pricingFaq} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
