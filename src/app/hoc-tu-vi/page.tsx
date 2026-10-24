import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/content/articles";
import { dictPalaces, dictStars } from "@/content/dictionary";
import { HocClient } from "./HocClient";

export const metadata: Metadata = {
  title: "Học tử vi — bài viết nền tảng và từ điển sao, cung",
  description: "Học tử vi đẩu số Nam phái từ cơ bản: 12 cung, 14 chính tinh, đại vận, tiểu vận, cách nhập ngày sinh âm lịch. Từ điển tra cứu nhanh từng sao, từng cung.",
  alternates: { canonical: "/hoc-tu-vi" },
};

export default function Page() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] grid-bg" />
      <div className="container-x relative py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cream-mute">
          <Link href="/" className="hover:text-cream">
            Trang chủ
          </Link>{" "}
          / <span className="text-cream-dim">Học tử vi</span>
        </nav>
        <h1 className="h-display mt-4 text-4xl sm:text-5xl">Học tử vi</h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-cream-dim">
          Bài viết nền tảng và từ điển tra cứu, viết theo cùng tinh thần của sản phẩm: dẫn nguồn, không phán định. Đọc xong, mở lá số của chính
          bạn để đối chiếu.
        </p>
        <div className="mt-10">
          <HocClient articles={articles} stars={dictStars} palaces={dictPalaces} />
        </div>
      </div>
    </div>
  );
}
