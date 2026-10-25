import type { Metadata } from "next";
import { Suspense } from "react";
import { LapLaSoClient } from "./LapLaSoClient";

export const metadata: Metadata = {
  title: "Lập lá số tử vi miễn phí — an sao Nam phái",
  description:
    "Nhập ngày giờ sinh dương lịch hoặc âm lịch, tháng nhuận, giờ Tý sớm/muộn. Lá số tử vi Nam phái hiện ngay, xem 3D và 2D, miễn phí, không cần đăng nhập.",
  alternates: { canonical: "/lap-la-so" },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lập lá số tử vi Nam phái",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
  inLanguage: "vi",
};

export default function Page() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] grid-bg" />
      <div className="container-x relative py-10 sm:py-14">
        <div className="max-w-2xl">
          <span className="eyebrow">01 · Lập lá số</span>
          <h1 className="h-display mt-3 text-4xl sm:text-5xl">Khởi đầu hành trình hiểu mình</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-cream-dim">
            Một vài thông tin về ngày giờ sinh sẽ mở ra bản đồ 12 cung của bạn. Theo dõi lá số cập nhật ngay bên cạnh khi bạn điền thông tin.
          </p>
        </div>
        <div className="mt-10">
          <Suspense>
            <LapLaSoClient />
          </Suspense>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            ["Tháng nhuận", "Ngày 1–15 của tháng nhuận an theo tháng chính, từ ngày 16 an sang tháng sau. Ô “tháng nhuận” chỉ hiện khi năm đó thật sự có tháng nhuận."],
            ["Giờ Tý", "Tý sớm (0–1h) tính cho ngày sinh; Tý muộn (23–24h) tính sang ngày hôm sau. Bạn chọn rõ, hệ thống không đoán."],
            ["Lịch Việt Nam", "Đổi ngày theo lịch Việt Nam múi giờ UTC+7. Người sinh ở miền Nam 1968–1975 có thể chọn lịch cũ UTC+8."],
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <div className="font-serif text-lg text-gold-200">{t}</div>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{d}</p>
            </div>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }} />
    </div>
  );
}
