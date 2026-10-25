import Link from "next/link";
import { site } from "@/lib/site";
import { LogoMark } from "./Logo";

const cols = [
  {
    title: "Sản phẩm",
    links: [
      ["/lap-la-so", "Lập lá số miễn phí"],
      ["/tu-vi-audio", "Tử vi Audio"],
      ["/tu-vi-tinh-duyen", "Tử vi tình duyên"],
      ["/lich-van-han", "Lịch vận hạn"],
      ["/bang-gia", "Bảng giá"],
    ],
  },
  {
    title: "Học",
    links: [
      ["/hoc-tu-vi", "Học tử vi"],
      ["/bai-viet/12-cung-trong-la-so", "12 cung trong lá số"],
      ["/bai-viet/14-chinh-tinh", "14 chính tinh"],
      ["/bai-viet/dai-van-la-gi", "Đại vận là gì"],
      ["/lien-he", "Liên hệ"],
    ],
  },
  {
    title: "Chính sách",
    links: [
      ["/dieu-khoan", "Điều khoản sử dụng"],
      ["/chinh-sach-du-lieu", "Dữ liệu cá nhân"],
      ["/hoan-tien", "Hoàn tiền & khiếu nại"],
      ["/tuyen-bo-ai", "Tuyên bố về AI"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-0 border-t border-[var(--line)] bg-ink-950">
      <div className="container-x grid gap-12 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-serif text-lg text-cream">{site.name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream-dim">
            Công cụ tra cứu và học tử vi đẩu số Nam phái. Không phán vận mệnh, không bán lễ giải hạn, không chấm điểm hợp
            tuổi. Mọi luận giải dẫn nguồn từ kho tri thức duyệt tay và chỉ mang tính tham khảo.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[11px] text-cream-dim">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-jade" />
            Tử vi Nam phái · Góc nhìn đương đại
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div className="eyebrow">{col.title}</div>
            <ul className="mt-4 space-y-2.5">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-cream-dim transition hover:text-cream">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="container-x flex flex-col gap-3 py-6 text-xs leading-relaxed text-cream-mute md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · Hiểu mình, sống an nhiên.
          </p>
          <p>Nội dung do AI viết dựa trên kho tri thức, chỉ mang tính tham khảo, chiêm nghiệm.</p>
        </div>
      </div>
    </footer>
  );
}
