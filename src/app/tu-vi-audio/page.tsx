import type { Metadata } from "next";
import Link from "next/link";
import { BookMarked, Check, Ear, Headphones, Mic2, Sparkles, Users, X } from "lucide-react";
import { SectionHead } from "@/components/ui/Section";
import { Waveform } from "@/components/ui/Waveform";
import { PODCAST_CHAPTERS, SAMPLE_TRANSCRIPT } from "@/content/kb";

export const metadata: Metadata = {
  title: "Tử vi Audio — nghe lá số của bạn bằng hai giọng AI",
  description:
    "Podcast 25–30 phút về đúng lá số của bạn: hai giọng AI trò chuyện, chỉ dùng kho tri thức đã duyệt. Nghe thử đoạn mở đầu miễn phí.",
  alternates: { canonical: "/tu-vi-audio" },
};

const why = [
  { icon: Sparkles, t: "Đúng lá số của bạn", d: "Kịch bản dựng riêng từ dữ kiện 12 cung, chọn 4–6 điểm nổi bật nhất của lá." },
  { icon: BookMarked, t: "Có nguồn, không bịa", d: "Mỗi đoạn kịch bản phải tham chiếu mẩu tri thức; câu dọa hạn bị chặn bằng danh sách từ cấm." },
  { icon: Users, t: "Hội thoại thật", d: "Host A tò mò đặt câu hỏi, Host B giải thích. Giọng và phong cách giữ cố định suốt bài." },
  { icon: Ear, t: "Không cần nhìn màn hình", d: "Nghe trên đường, khi nấu ăn, trước khi ngủ. Tải MP3 về máy." },
];

const rows = [
  ["Nguồn nội dung", "Tự suy diễn, có thể thêm chi tiết không có trong lá", "Chỉ từ kho tri thức đã duyệt, mỗi đoạn có nguồn"],
  ["Giọng đọc", "Một giọng đọc văn bản đều đều", "Hai giọng hỏi – đáp, chuẩn hóa phát âm tên sao Hán-Việt"],
  ["Cá nhân hóa", "Bạn phải tự biết hỏi gì", "Tự chọn điểm đáng chú ý nhất của lá"],
  ["Chi phí", "Trả theo lượt, khó đoán trước", "Mở đầu miễn phí, podcast nằm trong gói Chuyên sâu 299.000đ"],
];

export default function Page() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 starfield opacity-60" />
        <div className="pointer-events-none absolute -top-20 left-1/2 size-[760px] -translate-x-1/2 glow-silver" />
        <div className="container-x relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="eyebrow !text-silver">Tử vi Audio</span>
            <h1 className="h-display mt-4 text-[40px] leading-[1.08] sm:text-[56px]">
              Đừng chỉ đọc lá số.
              <br />
              <span className="text-gold-gradient">Hãy nghe nó kể chuyện.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-cream-dim">
              Hai giọng AI trò chuyện 25–30 phút về đúng lá số của bạn, dựng từ kho tri thức đã duyệt. Đeo tai nghe, nhắm mắt, và nghe
              bầu trời của mình.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/lap-la-so" className="btn btn-primary btn-lg">
                <Headphones size={18} /> Lập lá để nghe mở đầu miễn phí
              </Link>
              <Link href="/bang-gia" className="btn btn-secondary btn-lg">
                Gói Chuyên sâu · 299.000đ
              </Link>
            </div>
          </div>
          <div className="glass-strong rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Nghe thử · 20 giây</span>
              <span className="chip text-cream-dim">Không cần đăng nhập</span>
            </div>
            <div className="mt-6">
              <Waveform duration={20} seed={7} count={64} label="đoạn nghe thử" />
            </div>
            <div className="mt-6 space-y-3 border-t border-[var(--line)] pt-5">
              {SAMPLE_TRANSCRIPT.slice(0, 3).map((l, i) => (
                <div key={i} className="flex gap-3 text-[14px] leading-relaxed">
                  <span
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full font-mono text-[11px] ${
                      l.speaker === "A" ? "bg-silver/20 text-silver" : "bg-gold-400/20 text-gold-300"
                    }`}
                  >
                    {l.speaker}
                  </span>
                  <p className="text-cream/85">{l.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[11.5px] text-cream-mute">Đoạn giới thiệu chung. Lá số thật của bạn có nội dung riêng. Giọng do AI tạo.</p>
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <SectionHead eyebrow="Vì sao nghe khác đọc" title="Một buổi trò chuyện về chính bạn" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w) => (
            <div key={w.t} className="card p-6">
              <w.icon size={20} className="text-gold-400" />
              <div className="mt-4 font-medium text-cream">{w.t}</div>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-8 pb-20 lg:grid-cols-[1fr_1.1fr]">
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Mic2 size={18} className="text-gold-400" />
            <span className="eyebrow">Mục lục một podcast mẫu</span>
          </div>
          <ol className="mt-5 divide-y divide-[var(--line)]">
            {PODCAST_CHAPTERS.map((c) => (
              <li key={c.t} className="flex items-center gap-4 py-3 text-[15px]">
                <span className="w-14 font-mono text-[12px] text-cream-mute">{c.t}</span>
                <span className="text-cream">{c.title}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-cream-dim">
            ~3.500–4.500 chữ, 6–8 đoạn. Chạy nền khoảng 5–10 phút, xong gửi email. Hậu kỳ chuẩn hóa âm lượng −16 LUFS, MP3 96 kbps.
          </p>
        </div>
        <div>
          <SectionHead eyebrow="So sánh" title="Khác gì nghe một chatbot AI đọc?" />
          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--line)]">
            {rows.map(([k, a, b]) => (
              <div key={k} className="grid gap-2 border-b border-[var(--line)] p-4 last:border-0 sm:grid-cols-[120px_1fr_1fr] sm:gap-4">
                <div className="text-sm font-medium text-cream">{k}</div>
                <div className="flex gap-2 text-sm text-cream-mute">
                  <X size={14} className="mt-0.5 shrink-0" /> {a}
                </div>
                <div className="flex gap-2 text-sm text-cream/90">
                  <Check size={14} className="mt-0.5 shrink-0 text-jade" /> {b}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-silver/25 px-6 py-14 text-center">
          <div className="pointer-events-none absolute inset-0 glow-silver" />
          <div className="relative">
            <h2 className="h-display text-3xl sm:text-4xl">Sẵn sàng nghe câu chuyện của chính mình?</h2>
            <p className="mx-auto mt-3 max-w-md text-cream-dim">Lập lá miễn phí, nghe audio mở đầu 2 phút. Ưng mới mở khóa podcast đầy đủ.</p>
            <Link href="/lap-la-so" className="btn btn-primary btn-lg mt-8">
              Lập lá số miễn phí
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
