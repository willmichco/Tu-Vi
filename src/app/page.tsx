import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  BookMarked,
  Box,
  CalendarRange,
  Check,
  Database,
  FileDown,
  Filter,
  Grid3x3,
  Headphones,
  Lightbulb,
  MessagesSquare,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { BirthForm } from "@/components/chart/BirthForm";
import { HeroPoster } from "@/components/home/HeroPoster";
import { HeroStage } from "@/components/home/HeroStage";
import { PricingCards } from "@/components/PricingCards";
import { Faq } from "@/components/ui/Faq";
import { SectionHead } from "@/components/ui/Section";
import { articles } from "@/content/articles";
import { homeFaq } from "@/content/faq";
import { addons, site } from "@/lib/site";
import { SAMPLE_INPUT } from "@/lib/tuvi/codec";
import { buildChart } from "@/lib/tuvi/engine";

const sample = buildChart(SAMPLE_INPUT)!;

const pipeline = [
  { icon: Sparkles, title: "An sao bằng code", desc: "Engine TypeScript, 200 lá golden test chạy mỗi lần sửa", tag: "engine" },
  { icon: Database, title: "Kho tri thức duyệt tay", desc: `${site.stats.kbApproved} mẩu, mỗi mẩu ≥${site.stats.sources} nguồn đồng thuận`, tag: "kb_items" },
  { icon: ScanSearch, title: "Truy xuất theo khóa", desc: "15–25 mẩu đúng sao, cung, đắc hãm của lá bạn", tag: "retrieve" },
  { icon: BookMarked, title: "AI viết từ mẩu được cấp", desc: "Không được dùng kiến thức ngoài kho", tag: "generate" },
  { icon: Filter, title: "Kiểm tra trước khi hiện", desc: "Loại câu trích nguồn sai, chặn từ phán định", tag: "verify" },
];

const notDo = [
  "Phán tuổi thọ, bệnh tật, sinh tử",
  "Dọa hạn, bán lễ giải hạn, cúng sao, vật phẩm",
  "Chấm điểm hợp tuổi, “hợp 87%”",
  "Chọn giờ sinh mổ",
];

const compare = [
  ["Nguồn luận giải", "Đoạn văn mẫu gắn theo tên sao, ai cũng giống ai", "Mẩu tri thức duyệt tay, ghép đúng dữ kiện lá bạn, ghi nguồn từng đoạn"],
  ["Hiển thị", "Lá 2D chữ dày đặc, khó đọc trên điện thoại", "Bàn sao 3D + lá 2D gọn trên mobile, chạm cung để mở chi tiết"],
  ["Lịch âm", "Hay dùng lịch Trung Quốc, lệch ở năm 1985, 1968…", "Lịch Việt Nam UTC+7, tùy chọn UTC+8 cho miền Nam 1968–1975"],
  ["AI", "Chatbot tự suy diễn, có thể bịa", "AI chỉ viết từ kho, server kiểm tra trích dẫn trước khi hiện"],
  ["Giá", "Mập mờ, phải nhắn tin hỏi", "Niêm yết mọi giá — kể cả thuê bao và nạp lẻ"],
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 starfield opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] grid-bg" />
        <div className="pointer-events-none absolute top-40 right-[-10%] size-[720px] glow-gold opacity-60" />
        <div className="container-x relative grid items-start gap-10 pt-8 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8 lg:pt-14 lg:pb-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-cream-dim">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-jade" />
              Nam phái · {site.stats.kbApproved} mẩu tri thức đã duyệt
            </div>
            <h1 className="h-display mt-5 text-[38px] leading-[1.1] sm:text-[52px] xl:text-[56px]">
              Lá số tử vi của bạn,
              <br />
              <span className="text-gold-gradient">sáng rõ từng vì sao.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-cream-dim">
              Lập lá số miễn phí trong 30 giây. Xem bàn sao 3D, lá 2D truyền thống và bài luận AI chỉ viết từ kho tri thức duyệt tay
              — câu nào cũng truy được về nguồn.
            </p>
            <div className="card mt-8 p-5 sm:p-6 lg:max-w-[520px]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-cream">Lập lá số ngay</span>
                <span className="font-mono text-[11px] text-cream-mute">miễn phí · không cần đăng nhập</span>
              </div>
              <Suspense>
                <BirthForm variant="hero" />
              </Suspense>
            </div>
          </div>
          <div className="relative lg:sticky lg:top-20">
            <HeroStage poster={<HeroPoster chart={sample} className="h-full w-full" />} />
          </div>
        </div>
      </section>

      {/* SỐ LIỆU MINH BẠCH */}
      <section className="border-y border-[var(--line)] bg-ink-900/50">
        <div className="container-x grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
          {[
            [site.stats.kbApproved.toLocaleString("vi-VN"), "mẩu tri thức duyệt tay", `mục tiêu ${site.stats.kbTarget.toLocaleString("vi-VN")}+`],
            [`≥${site.stats.sources}`, "nguồn đồng thuận mỗi mẩu", "chỗ sách mâu thuẫn thì ghi rõ"],
            [String(site.stats.goldenCharts), "lá golden test", "đối chiếu 2 công cụ độc lập"],
            [String(sample.starCount), "sao trên một lá số", "an đủ chính tinh, phụ tinh, vòng sao"],
          ].map(([n, l, s]) => (
            <div key={l} className="px-2 md:border-l md:border-[var(--line)] md:px-6 md:first:border-l-0">
              <div className="font-serif text-4xl text-gold-gradient sm:text-5xl">{n}</div>
              <div className="mt-2 text-sm text-cream">{l}</div>
              <div className="mt-0.5 font-mono text-[11px] text-cream-mute">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TÍNH NĂNG — BENTO */}
      <section className="container-x py-20 sm:py-28" id="tinh-nang">
        <SectionHead
          eyebrow="Một lá số · sáu cách xem"
          title="Từ bầu trời 3D tới bài luận có nguồn"
          desc="Quen lá giấy có lưới 2D. Thích chiêm nghiệm có bầu trời 3D. Muốn hỏi thêm có trợ lý bám kho tri thức. Muốn nghe có podcast hai giọng."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <Link href="/la-so/mau" className="card group relative overflow-hidden p-6 md:col-span-4 md:row-span-2">
            <div className="flex items-center gap-2 text-gold-300">
              <Box size={18} />
              <span className="eyebrow">Bàn sao 3D</span>
            </div>
            <h3 className="mt-3 font-serif text-2xl text-cream">Mỗi sao bay về đúng cung vị của nó</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-cream-dim">
              Sao miếu vượng rực sáng, sao hãm mờ đi. Màu theo ngũ hành. Đường tam hợp, xung chiếu là quan hệ thật giữa các cung.
              Tuần, Triệt phủ thành màn sương đúng vị trí.
            </p>
            <div className="mt-4 -mb-10 transition duration-500 group-hover:scale-[1.02]">
              <HeroPoster chart={sample} className="w-full" />
            </div>
          </Link>
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-gold-300">
              <Grid3x3 size={18} />
              <span className="eyebrow">Lá 2D truyền thống</span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-1">
              {Array.from({ length: 16 }, (_, i) => {
                const center = [5, 6, 9, 10].includes(i);
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded ${center ? "bg-transparent" : i === 15 ? "bg-gold-400/25 ring-1 ring-gold-400/60" : "bg-white/[0.04] ring-1 ring-[var(--line)]"}`}
                  />
                );
              })}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-dim">Đối chiếu quen mắt với lá giấy. Trên điện thoại hiện gọn, chạm cung mở chi tiết.</p>
          </div>
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-jade">
              <ShieldCheck size={18} />
              <span className="eyebrow !text-jade">Luận giải có nguồn</span>
            </div>
            <p className="mt-4 font-serif text-[15px] leading-relaxed text-cream/90">
              “Thiên Tướng ở thế đắc địa — coi trọng công bằng, trách nhiệm…”
              <span className="ml-1 align-super font-mono text-[10px] text-jade">[1]</span>
              <span className="align-super font-mono text-[10px] text-jade">[2]</span>
            </p>
            <div className="mt-3 font-mono text-[10.5px] text-cream-mute">[1] kb-thien-tuong-menh · [2] kb-dac-ham</div>
          </div>
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-gold-300">
              <MessagesSquare size={18} />
              <span className="eyebrow">Hỏi đáp hai tầng</span>
            </div>
            <div className="mt-4 space-y-2 text-[13px]">
              <div className="rounded-lg border border-jade/25 bg-jade/[0.05] px-3 py-2 text-cream/90">
                <span className="font-medium text-jade">Theo lá số</span> — chỉ từ kho, có nguồn
              </div>
              <div className="rounded-lg border border-gold-400/25 bg-gold-400/[0.05] px-3 py-2 text-cream/90">
                <span className="font-medium text-gold-300">Gợi ý thực tế</span> — tách nhãn riêng
              </div>
            </div>
          </div>
          <Link href="/tu-vi-audio" className="card group p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-silver">
              <Headphones size={18} />
              <span className="eyebrow !text-silver">Audio · Podcast</span>
            </div>
            <div className="mt-5 flex h-12 items-center gap-[3px]">
              {Array.from({ length: 34 }, (_, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    height: `${25 + Math.abs(Math.sin(i * 0.7) * 60 + Math.sin(i * 2.1) * 15)}%`,
                    background: i % 2 ? "var(--color-gold-400)" : "var(--color-silver)",
                    opacity: i < 20 ? 0.9 : 0.25,
                  }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-dim">Hai giọng AI trò chuyện về đúng lá số của bạn. Mở đầu 2 phút miễn phí.</p>
          </Link>
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-gold-300">
              <CalendarRange size={18} />
              <span className="eyebrow">Đại vận trọn đời</span>
            </div>
            <div className="mt-5 flex gap-1">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className={`h-8 flex-1 rounded ${i === 3 ? "bg-gold-400/70" : "bg-white/[0.06]"}`} />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-dim">12 kỳ mười năm, tiểu vận từng năm, sao lưu niên phủ ánh bạc.</p>
          </div>
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-gold-300">
              <FileDown size={18} />
              <span className="eyebrow">PDF mang đi</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-dim">
              Trọn 12 cung hoặc từng cung, font tiếng Việt chuẩn. In tặng bố mẹ hay gửi người thân đều đẹp.
            </p>
          </div>
        </div>
      </section>

      {/* PIPELINE AI */}
      <section className="relative border-y border-[var(--line)] bg-ink-900/60">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div className="container-x relative py-20 sm:py-28">
          <SectionHead
            eyebrow="Vì sao không hỏi chatbot miễn phí"
            title="AI có kỷ luật: không tự an sao, không nói ngoài kho"
            desc="Chatbot đa dụng không an sao chính xác được và có thể bịa kiến thức nghe rất trôi. Ở đây, AI là bước thứ tư trong năm bước — và bị kiểm tra ở bước thứ năm."
          />
          <ol className="mt-12 grid gap-3 md:grid-cols-5">
            {pipeline.map((s, i) => (
              <li key={s.title} className="card relative p-5">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-lg bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/30">
                    <s.icon size={17} />
                  </span>
                  <span className="font-mono text-[11px] text-cream-mute">0{i + 1}</span>
                </div>
                <div className="mt-4 text-[15px] font-medium text-cream">{s.title}</div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-cream-dim">{s.desc}</p>
                <div className="mt-3 font-mono text-[10.5px] text-jade/80">{s.tag}()</div>
                {i < pipeline.length - 1 && (
                  <ArrowRight size={16} className="absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 text-gold-500 md:block" />
                )}
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <pre className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-ink-950/80 p-5 font-mono text-[12.5px] leading-relaxed text-cream-dim">
              <span className="text-cream-mute">{"// output bắt buộc của bước 04 — server kiểm cited_ids ở bước 05\n"}</span>
              {"{\n  "}
              <span className="text-silver">&quot;sections&quot;</span>
              {": [{\n    "}
              <span className="text-silver">&quot;heading&quot;</span>
              {": "}
              <span className="text-gold-300">&quot;Thiên Tướng tại cung Mệnh&quot;</span>
              {",\n    "}
              <span className="text-silver">&quot;body&quot;</span>
              {": "}
              <span className="text-gold-300">&quot;Thiên Tướng là ấn tinh…&quot;</span>
              {",\n    "}
              <span className="text-silver">&quot;cited_ids&quot;</span>
              {": ["}
              <span className="text-jade">&quot;kb-0142&quot;</span>
              {", "}
              <span className="text-jade">&quot;kb-0388&quot;</span>
              {"]\n  }]\n}"}
            </pre>
            <div className="card flex flex-col justify-center p-6">
              <div className="eyebrow">Những điều chúng tôi không làm</div>
              <ul className="mt-4 space-y-2.5">
                {notDo.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[15px] text-cream/90">
                    <X size={16} className="mt-1 shrink-0 text-ember" /> {t}
                  </li>
                ))}
              </ul>
              <Link href="/tuyen-bo-ai" className="mt-5 text-sm text-gold-300 hover:underline">
                Đọc Tuyên bố về AI →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 BƯỚC */}
      <section className="container-x py-20 sm:py-28">
        <SectionHead align="center" eyebrow="Ba bước" title="30 giây từ giờ sinh tới bầu trời của bạn" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ["Nhập giờ sinh", "Dương hay âm lịch, tháng nhuận, giờ Tý sớm/muộn — ô xanh hiện ngay ngày đã đổi để bạn kiểm tra."],
            ["Ngắm bàn sao", `${sample.starCount} sao an theo phép Nam phái, tính ngay trên máy bạn. Xoay 3D hoặc xem lá 2D.`],
            ["Đọc luận có nguồn", "Cung Mệnh miễn phí. Mỗi đoạn có số nguồn, cuối bài liệt kê mẩu tri thức đã dùng."],
          ].map(([t, d], i) => (
            <div key={t} className="card p-6">
              <div className="font-serif text-5xl text-gold-gradient">{i + 1}</div>
              <div className="mt-4 text-lg font-medium text-cream">{t}</div>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SO SÁNH */}
      <section className="container-x pb-20 sm:pb-28">
        <SectionHead eyebrow="Khác biệt" title="Khác gì những trang xem tử vi quen thuộc?" />
        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--line)]">
          <div className="hidden grid-cols-[180px_1fr_1fr] bg-white/[0.03] px-5 py-3 font-mono text-[11px] tracking-wider text-cream-mute uppercase md:grid">
            <span />
            <span>Cách làm phổ biến</span>
            <span className="text-gold-300">{site.name}</span>
          </div>
          {compare.map(([k, a, b]) => (
            <div key={k} className="grid gap-2 border-t border-[var(--line)] px-5 py-4 md:grid-cols-[180px_1fr_1fr] md:gap-6">
              <div className="text-sm font-medium text-cream">{k}</div>
              <div className="flex gap-2 text-sm text-cream-mute">
                <X size={15} className="mt-0.5 shrink-0 md:hidden" />
                {a}
              </div>
              <div className="flex gap-2 text-sm text-cream/90">
                <Check size={15} className="mt-0.5 shrink-0 text-jade" />
                {b}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BẢNG GIÁ */}
      <section id="bang-gia" className="relative overflow-hidden border-t border-[var(--line)] py-20 sm:py-28">
        <div className="pointer-events-none absolute top-0 left-1/2 size-[680px] -translate-x-1/2 glow-gold opacity-50" />
        <div className="container-x relative">
          <SectionHead
            align="center"
            eyebrow="Bảng giá niêm yết"
            title="Lập lá luôn miễn phí. Trả tiền khi muốn đọc sâu."
            desc="Trả một lần cho từng lá, không tự gia hạn. Mọi giá đều công khai — kể cả thuê bao và nạp lẻ."
          />
          <div className="mt-12">
            <PricingCards />
          </div>
          <div className="mt-6 grid gap-3 text-sm text-cream-dim md:grid-cols-3">
            <div className="card flex items-center justify-between gap-3 px-5 py-4">
              <span>Tình duyên · đối chiếu hai lá</span>
              <span className="font-mono text-cream">từ 50.000đ</span>
            </div>
            <div className="card flex items-center justify-between gap-3 px-5 py-4">
              <span>Lịch vận hạn · thuê bao theo lá</span>
              <span className="font-mono text-cream">
                {addons.lichVanHan[0].xu} xu/tháng · {addons.lichVanHan[1].xu} xu/năm
              </span>
            </div>
            <div className="card flex items-center justify-between gap-3 px-5 py-4">
              <span>Nạp lẻ lượt hỏi</span>
              <span className="font-mono text-cream">20 lượt = 29 xu</span>
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-cream-mute">
            1 xu = 1.000đ · Thanh toán VietQR, tự kích hoạt 1–3 phút ·{" "}
            <Link href="/hoan-tien" className="text-gold-300 hover:underline">
              Hoàn 100% nếu chưa dùng, trong 7 ngày
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ + BÀI VIẾT */}
      <section className="container-x grid gap-16 py-20 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionHead eyebrow="Hỏi nhanh" title="Câu hỏi thường gặp" />
          <div className="mt-8">
            <Faq items={homeFaq} />
          </div>
        </div>
        <div>
          <SectionHead eyebrow="Học tử vi" title="Bài nên đọc khi mới xem" />
          <div className="mt-8 grid gap-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/bai-viet/${a.slug}`}
                className="group card flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[0.04]"
              >
                <div>
                  <div className="font-mono text-[10.5px] tracking-wider text-gold-500 uppercase">{a.category}</div>
                  <div className="mt-1 text-[15px] text-cream group-hover:text-gold-200">{a.title}</div>
                </div>
                <ArrowRight size={16} className="shrink-0 text-cream-mute transition group-hover:translate-x-1 group-hover:text-gold-300" />
              </Link>
            ))}
            <Link href="/hoc-tu-vi" className="mt-2 text-sm text-gold-300 hover:underline">
              Xem tất cả bài viết và từ điển →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA CUỐI */}
      <section className="container-x pb-8">
        <div className="relative overflow-hidden rounded-3xl border border-gold-400/25 px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 starfield opacity-80" />
          <div className="pointer-events-none absolute -bottom-40 left-1/2 size-[560px] -translate-x-1/2 glow-gold" />
          <div className="relative">
            <Lightbulb size={22} className="mx-auto text-gold-400" />
            <h2 className="h-display mx-auto mt-4 max-w-2xl text-3xl sm:text-5xl">Bầu trời ngày bạn sinh ra trông như thế nào?</h2>
            <p className="mx-auto mt-4 max-w-lg text-cream-dim">Miễn phí, không cần đăng nhập, lá số hiện ngay.</p>
            <Link href="/lap-la-so" className="btn btn-primary btn-lg mt-8">
              Lập lá số miễn phí <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
