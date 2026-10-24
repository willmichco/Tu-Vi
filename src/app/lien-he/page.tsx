import type { Metadata } from "next";
import { Mail, Receipt, Flag } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: `Liên hệ ${site.name}: hỗ trợ thanh toán, hoàn tiền, báo nội dung sai, thông tin chủ thể kinh doanh.`,
  alternates: { canonical: "/lien-he" },
};

export default function Page() {
  const b = site.business;
  return (
    <div className="container-x py-12 sm:py-16">
      <span className="eyebrow">Liên hệ</span>
      <h1 className="h-display mt-3 text-4xl sm:text-5xl">Một người vận hành, trả lời trong 1–2 ngày làm việc</h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form className="card space-y-4 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-cream-dim">Email của bạn</span>
              <input type="email" className="input" placeholder="ban@email.com" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-cream-dim">Chủ đề</span>
              <select className="input">
                <option>Thanh toán, kích hoạt gói</option>
                <option>Hoàn tiền</option>
                <option>Báo nội dung sai</option>
                <option>Lỗi kỹ thuật</option>
                <option>Góp ý</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm text-cream-dim">Mã đơn (nếu có)</span>
            <input className="input font-mono" placeholder="TD7K2Q9M" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-cream-dim">Nội dung</span>
            <textarea className="input min-h-36 py-3" placeholder="Mô tả ngắn vấn đề bạn gặp…" />
          </label>
          <button type="button" className="btn btn-primary">
            Gửi yêu cầu
          </button>
        </form>
        <div className="space-y-4">
          {[
            [Mail, "Email hỗ trợ", site.email],
            [Receipt, "Thanh toán thiếu, sai nội dung", "Gửi kèm mã đơn — đối soát tay trong giờ làm việc"],
            [Flag, "Nội dung luận giải sai", "Dùng nút “Báo nội dung sai” dưới bài để gửi kèm mã mẩu tri thức"],
          ].map(([I, t, d]) => {
            const Icon = I as typeof Mail;
            return (
              <div key={t as string} className="card flex gap-4 p-5">
                <Icon size={20} className="mt-0.5 shrink-0 text-gold-400" />
                <div>
                  <div className="text-cream">{t as string}</div>
                  <div className="text-sm text-cream-dim">{d as string}</div>
                </div>
              </div>
            );
          })}
          <div className="card p-5 text-sm leading-relaxed text-cream-dim">
            <div className="eyebrow">Chủ thể kinh doanh</div>
            <p className="mt-3">
              {b.legalName}
              <br />
              MST: {b.taxCode}
              <br />
              {b.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
