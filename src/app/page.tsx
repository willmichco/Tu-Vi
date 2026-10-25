import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  Box,
  CalendarRange,
  Check,
  Database,
  FileDown,
  Filter,
  Grid3x3,
  Headphones,
  MessagesSquare,
  Play,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { BirthForm } from "@/components/chart/BirthForm";
import { ELEMENT_COLOR } from "@/components/chart/starStyle";
import { HeroPoster } from "@/components/home/HeroPoster";
import { HeroStage } from "@/components/home/HeroStage";
import { MiniGrid2D, PdfStack } from "@/components/home/Minis";
import { Astrolabe } from "@/components/motion/Astrolabe";
import { CountUp } from "@/components/motion/CountUp";
import { Marquee } from "@/components/motion/Marquee";
import { Sky } from "@/components/motion/Sky";
import { SplitText } from "@/components/motion/SplitText";
import { PricingCards } from "@/components/PricingCards";
import { Faq } from "@/components/ui/Faq";
import { SectionHead } from "@/components/ui/Section";
import { articles } from "@/content/articles";
import { homeFaq } from "@/content/faq";
import { addons, site } from "@/lib/site";
import { SAMPLE_INPUT } from "@/lib/tuvi/codec";
import { ELEMENT_LABEL, MAJOR_STARS } from "@/lib/tuvi/constants";
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

const steps = [
  ["Nhập giờ sinh", "Dương hay âm lịch, tháng nhuận, giờ Tý sớm/muộn — ô xanh hiện ngay ngày đã đổi để bạn kiểm tra."],
  ["Ngắm bàn sao", `${sample.starCount} sao an theo phép Nam phái, tính ngay trên máy bạn. Xoay 3D hoặc xem lá 2D.`],
  ["Đọc luận có nguồn", "Cung Mệnh miễn phí. Mỗi đoạn có số nguồn, cuối bài liệt kê mẩu tri thức đã dùng."],
];

const LINE_1 = "Lá số tử vi của bạn,";
const LINE_2 = "sáng rõ từng vì sao.";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative -mt-16 overflow-hidden pt-16">
        <Sky />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[820px] grid-bg opacity-50" />
        {/* Thiên bàn mờ sau tiêu đề trên điện thoại */}
        <Astrolabe className="absolute -top-24 -right-48 size-[520px] opacity-40 [mask-image:radial-gradient(closest-side,#000_55%,transparent)] lg:hidden" />
        <div className="container-x relative grid items-center gap-14 pt-10 pb-20 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:gap-4 lg:pt-14 lg:pb-28">
          <div className="relative z-10">
            <div className="intro">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-cream-dim backdrop-blur">
                <span className="size-1.5 animate-pulse-dot rounded-full bg-jade" />
                Nam phái · {site.stats.kbApproved} mẩu tri thức đã duyệt
              </div>
              <h1 className="split h-display mt-6 text-[40px] leading-[1.02] tracking-[-0.03em] sm:text-[60px] lg:text-[54px] xl:text-[66px]">
                <SplitText text={LINE_1} />
                <br />
                <SplitText text={LINE_2} start={LINE_1.split(" ").length} className="h-accent text-gold-gradient" />
              </h1>
              <p className="text-pretty mt-6 max-w-[34rem] text-[17px] leading-relaxed text-cream-dim">
                Lập lá số miễn phí trong 30 giây. Xem bàn sao 3D, lá 2D truyền thống và bài luận AI chỉ viết từ kho tri thức duyệt tay
                — câu nào cũng truy được về nguồn.
              </p>
              <div className="ring-anim glass-strong mt-9 rounded-3xl p-5 shadow-[0_40px_100px_-40px_rgb(0_0_0/0.9)] sm:p-6 lg:max-w-[540px]">
                <span className="ring-anim-border opacity-70" />
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-cream">Lập lá số ngay</span>
                  <span className="font-mono text-[11px] text-cream-mute">miễn phí · không cần đăng nhập</span>
                </div>
                <Suspense>
                  <BirthForm variant="hero" />
                </Suspense>
              </div>
            </div>
          </div>
          <div className="relative">
            <Astrolabe className="absolute top-1/2 left-1/2 hidden aspect-square w-[122%] -translate-x-1/2 -translate-y-1/2 opacity-80 [mask-image:radial-gradient(closest-side,#000_62%,transparent)] lg:block" />
            <div data-reveal="scale" style={{ "--delay": "350ms" } as React.CSSProperties} className="relative">
              <HeroStage poster={<HeroPoster chart={sample} className="h-full w-full" />} />
            </div>
            <div
              data-reveal="left"
              style={{ "--delay": "900ms" } as React.CSSProperties}
              className="glass absolute top-[6%] left-[-2%] hidden animate-float items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xl md:flex"
            >
              <ShieldCheck size={16} className="text-jade" />
              <div className="leading-tight">
                <div className="text-[12.5px] text-cream">Luận giải có nguồn</div>
                <div className="font-mono text-[10px] text-cream-mute">kb-0142 · kb-0388</div>
              </div>
            </div>
            <div
              data-reveal
              style={{ "--delay": "1100ms" } as React.CSSProperties}
              className="glass absolute right-[-2%] bottom-[2%] hidden animate-float items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xl [animation-delay:-4s] md:flex"
            >
              <span className="grid size-7 place-items-center rounded-lg bg-gold-400/15 font-mono text-[11px] text-gold-300">{sample.starCount}</span>
              <div className="leading-tight">
                <div className="text-[12.5px] text-cream">sao an trên máy bạn</div>
                <div className="font-mono text-[10px] text-cream-mute">lịch Việt Nam · UTC+7</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SỐ LIỆU MINH BẠCH */}
      <section className="relative border-y border-[var(--line)] bg-ink-900/40">
        <div className="beam-line absolute inset-x-0 -top-px h-px" />
        <div data-stagger className="container-x grid grid-cols-2 gap-y-10 py-12 md:grid-cols-4">
          {(
            [
              [<CountUp key="a" value={site.stats.kbApproved} />, "mẩu tri thức duyệt tay", `mục tiêu ${site.stats.kbTarget.toLocaleString("vi-VN")}+`],
              [<CountUp key="b" value={site.stats.sources} prefix="≥" duration={900} />, "nguồn đồng thuận mỗi mẩu", "chỗ sách mâu thuẫn thì ghi rõ"],
              [<CountUp key="c" value={site.stats.goldenCharts} />, "lá golden test", "đối chiếu 2 công cụ độc lập"],
              [<CountUp key="d" value={sample.starCount} />, "sao trên một lá số", "an đủ chính tinh, phụ tinh, vòng sao"],
            ] as const
          ).map(([n, l, s]) => (
            <div key={l} className="px-2 md:border-l md:border-[var(--line)] md:px-7 md:first:border-l-0">
              <div className="font-serif text-[44px] leading-none font-light tracking-tight text-gold-gradient sm:text-[56px]">{n}</div>
              <div className="mt-3 text-sm text-cream">{l}</div>
              <div className="mt-1 font-mono text-[11px] text-cream-mute">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 14 CHÍNH TINH */}
      <section aria-label="14 chính tinh" className="border-b border-[var(--line)] py-5">
        <Marquee duration={70}>
          {MAJOR_STARS.map((s) => (
            <span key={s.name} className="flex items-center gap-3 px-7 whitespace-nowrap">
              <span className="size-1.5 rounded-full" style={{ background: ELEMENT_COLOR[s.element], boxShadow: `0 0 12px ${ELEMENT_COLOR[s.element]}` }} />
              <span className="font-serif text-xl italic text-cream/80">{s.name}</span>
              <span className="font-mono text-[10px] tracking-widest text-cream-mute uppercase">{ELEMENT_LABEL[s.element]}</span>
              <span className="ml-4 text-gold-600">✦</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* TÍNH NĂNG — BENTO */}
      <section className="container-x py-24 sm:py-32" id="tinh-nang">
        <SectionHead
          eyebrow="Một lá số · sáu cách xem"
          title={
            <>
              Từ bầu trời 3D <span className="h-accent text-gold-gradient">tới bài luận có nguồn</span>
            </>
          }
          desc="Quen lá giấy có lưới 2D. Thích chiêm nghiệm có bầu trời 3D. Muốn hỏi thêm có trợ lý bám kho tri thức. Muốn nghe có podcast hai giọng."
        />
        <div data-stagger="scale" className="mt-14 grid gap-4 md:grid-cols-6">
          <Link href="/la-so?id=mau" className="card group overflow-hidden p-7 md:col-span-4 md:row-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gold-300">
                <Box size={18} />
                <span className="eyebrow">Bàn sao 3D</span>
              </div>
              <ArrowUpRight size={18} className="text-cream-mute transition duration-500 group-hover:rotate-45 group-hover:text-gold-300" />
            </div>
            <h3 className="mt-4 max-w-md font-serif text-[28px] leading-tight text-balance text-cream">Mỗi sao bay về đúng cung vị của nó</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream-dim">
              Sao miếu vượng rực sáng, sao hãm mờ đi. Màu theo ngũ hành. Đường tam hợp, xung chiếu là quan hệ thật giữa các cung.
              Tuần, Triệt phủ thành màn sương đúng vị trí.
            </p>
            <div className="relative mt-4 -mb-10">
              <div className="pointer-events-none absolute inset-x-[15%] top-1/3 h-1/2 glow-gold" />
              <HeroPoster chart={sample} className="relative w-full transition duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
            </div>
          </Link>
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-gold-300">
              <Grid3x3 size={18} />
              <span className="eyebrow">Lá 2D truyền thống</span>
            </div>
            <MiniGrid2D />
            <p className="mt-4 text-sm leading-relaxed text-cream-dim">Quen mắt như lá giấy. Trên điện thoại hiện gọn, chạm cung mở chi tiết.</p>
          </div>
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-jade">
              <ShieldCheck size={18} />
              <span className="eyebrow !text-jade">Luận giải có nguồn</span>
            </div>
            <p className="mt-5 font-serif text-[17px] leading-relaxed text-cream/90 italic">
              “Thiên Tướng ở thế đắc địa — coi trọng công bằng, trách nhiệm…”
              <span className="ml-1 align-super font-mono text-[10px] text-jade not-italic">[1]</span>
              <span className="align-super font-mono text-[10px] text-jade not-italic">[2]</span>
            </p>
            <div className="mt-4 flex items-center gap-2 border-t border-[var(--line)] pt-3 font-mono text-[10.5px] text-cream-mute">
              <Check size={13} className="text-jade" /> cited_ids hợp lệ · kb-thien-tuong-menh
            </div>
          </div>
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-gold-300">
              <MessagesSquare size={18} />
              <span className="eyebrow">Hỏi đáp hai tầng</span>
            </div>
            <div data-stagger="left" className="mt-5 space-y-2 text-[13px]">
              <div className="rounded-xl rounded-bl-sm border border-[var(--line)] bg-white/[0.03] px-3 py-2 text-cream-dim">Năm nay công việc của tôi thế nào?</div>
              <div className="rounded-xl border border-jade/25 bg-jade/[0.06] px-3 py-2 text-cream/90">
                <span className="font-medium text-jade">Theo lá số</span> — chỉ từ kho, có nguồn
              </div>
              <div className="rounded-xl border border-gold-400/25 bg-gold-400/[0.06] px-3 py-2 text-cream/90">
                <span className="font-medium text-gold-300">Gợi ý thực tế</span> — tách nhãn riêng
              </div>
            </div>
          </div>
          <Link href="/tu-vi-audio" className="card group p-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-silver">
                <Headphones size={18} />
                <span className="eyebrow !text-silver">Audio · Podcast</span>
              </div>
              <span className="grid size-8 place-items-center rounded-full bg-silver/10 text-silver ring-1 ring-silver/30 transition duration-500 group-hover:scale-110 group-hover:bg-silver/20">
                <Play size={13} className="ml-0.5" />
              </span>
            </div>
            <div className="mt-6 flex h-12 items-center gap-[3px]">
              {Array.from({ length: 34 }, (_, i) => (
                <span
                  key={i}
                  className="flex-1 animate-eq rounded-full"
                  style={{
                    height: `${25 + Math.abs(Math.sin(i * 0.7) * 60 + Math.sin(i * 2.1) * 15)}%`,
                    background: i % 2 ? "var(--color-gold-400)" : "var(--color-silver)",
                    opacity: i < 20 ? 0.9 : 0.25,
                    animationDelay: `${-((i * 137) % 1600)}ms`,
                    animationDuration: `${1200 + ((i * 53) % 800)}ms`,
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
            <div className="relative mt-6 flex gap-1">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="h-8 flex-1 rounded bg-white/[0.06]" />
              ))}
              <div className="dai-van-cursor absolute inset-y-0 left-0 w-[calc(10%-3.6px)] rounded bg-gradient-to-b from-gold-300 to-gold-500 shadow-[0_0_20px_rgb(231_192_122/0.6)]" />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[9.5px] text-cream-mute">
              <span>6</span>
              <span>46</span>
              <span>96</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-cream-dim">12 kỳ mười năm, tiểu vận từng năm, sao lưu niên phủ ánh bạc.</p>
          </div>
          <div className="card group grid items-center gap-6 overflow-hidden p-6 sm:grid-cols-[1fr_auto] sm:p-8 md:col-span-6">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-gold-300">
                <FileDown size={18} />
                <span className="eyebrow">PDF mang đi</span>
              </div>
              <h3 className="mt-4 font-serif text-2xl text-cream">In tặng bố mẹ, gửi người thân đều đẹp</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">Trọn 12 cung hoặc từng cung, font tiếng Việt chuẩn, lá 2D in rõ nét trên khổ A4.</p>
            </div>
            <div className="flex justify-center sm:w-[320px]">
              <PdfStack />
            </div>
          </div>
        </div>
      </section>

      {/* PIPELINE AI */}
      <section className="relative overflow-hidden border-y border-[var(--line)] bg-ink-900/50">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div className="pointer-events-none absolute -top-40 left-1/2 size-[700px] -translate-x-1/2 glow-silver opacity-60" />
        <div className="container-x relative py-24 sm:py-32">
          <SectionHead
            eyebrow="Vì sao không hỏi chatbot miễn phí"
            title={
              <>
                AI có kỷ luật: <span className="h-accent text-gold-gradient">không tự an sao, không nói ngoài kho</span>
              </>
            }
            desc="Chatbot đa dụng không an sao chính xác được và có thể bịa kiến thức nghe rất trôi. Ở đây, AI là bước thứ tư trong năm bước — và bị kiểm tra ở bước thứ năm."
          />
          <ol data-stagger className="relative mt-16 grid gap-8 md:grid-cols-5 md:gap-4">
            {/* Tia sáng chạy qua 5 bước */}
            <li aria-hidden="true" className="beam-line absolute top-7 right-[10%] left-[10%] hidden h-px md:block" />
            <li aria-hidden="true" className="absolute top-7 bottom-7 left-7 w-px bg-[var(--line-strong)] md:hidden" />
            {pipeline.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 md:block md:text-center">
                <span
                  className="beam-node relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border bg-ink-900 text-gold-300 md:mx-auto"
                  style={{ "--n": i } as React.CSSProperties}
                >
                  <s.icon size={20} />
                </span>
                <div className="md:mt-6">
                  <div className="font-mono text-[11px] text-gold-500">0{i + 1}</div>
                  <div className="mt-1.5 text-[15.5px] font-medium text-cream">{s.title}</div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-cream-dim md:mx-auto md:max-w-[190px]">{s.desc}</p>
                  <div className="mt-2.5 font-mono text-[10.5px] text-jade/80">{s.tag}()</div>
                </div>
              </li>
            ))}
          </ol>
          <div data-stagger className="mt-16 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-ink-950/80 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)]">
              <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3">
                <span className="size-2.5 rounded-full bg-ember/60" />
                <span className="size-2.5 rounded-full bg-gold-400/60" />
                <span className="size-2.5 rounded-full bg-jade/60" />
                <span className="ml-3 font-mono text-[11px] text-cream-mute">generate.output.json</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-cream-dim">
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
                <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-gold-400/70" />
              </pre>
            </div>
            <div className="card flex flex-col justify-center p-7">
              <div className="kicker !text-ember">Những điều chúng tôi không làm</div>
              <ul className="mt-5 space-y-3">
                {notDo.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-cream/90">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ember/10 ring-1 ring-ember/30">
                      <X size={12} className="text-ember" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/tuyen-bo-ai" className="group mt-6 inline-flex items-center gap-1.5 text-sm text-gold-300">
                Đọc Tuyên bố về AI <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 BƯỚC */}
      <section className="container-x py-24 sm:py-32">
        <SectionHead
          align="center"
          eyebrow="Ba bước"
          title={
            <>
              30 giây từ giờ sinh <span className="h-accent text-gold-gradient">tới bầu trời của bạn</span>
            </>
          }
        />
        <ol data-stagger className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {steps.map(([t, d], i) => (
            <li key={t} className="relative">
              <div className="flex items-center gap-5">
                <span className="numeral-outline font-serif text-[88px] leading-none font-light tracking-tight sm:text-[104px]">0{i + 1}</span>
                <span className="hairline flex-1" />
              </div>
              <div className="mt-5 text-xl font-medium text-cream">{t}</div>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-cream-dim">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* SO SÁNH */}
      <section className="container-x pb-24 sm:pb-32">
        <SectionHead
          eyebrow="Khác biệt"
          title={
            <>
              Khác gì những trang <span className="h-accent text-gold-gradient">xem tử vi quen thuộc?</span>
            </>
          }
        />
        <div className="mt-12 overflow-hidden rounded-3xl border border-[var(--line)] bg-white/[0.012]">
          <div className="hidden grid-cols-[200px_1fr_1fr] font-mono text-[11px] tracking-wider uppercase md:grid">
            <span className="px-6 py-4" />
            <span className="px-6 py-4 text-cream-mute">Cách làm phổ biến</span>
            <span className="flex items-center gap-2 border-l border-gold-400/15 bg-gold-400/[0.05] px-6 py-4 text-gold-300">
              <span className="size-1.5 rounded-full bg-gold-400" /> {site.name}
            </span>
          </div>
          <div data-stagger>
            {compare.map(([k, a, b]) => (
              <div key={k} className="grid border-t border-[var(--line)] md:grid-cols-[200px_1fr_1fr]">
                <div className="px-6 pt-5 text-sm font-medium text-cream md:py-5">{k}</div>
                <div className="flex gap-2.5 px-6 py-2 text-sm text-cream-mute md:py-5">
                  <X size={15} className="mt-0.5 shrink-0 text-cream-mute/70" />
                  {a}
                </div>
                <div className="flex gap-2.5 bg-gold-400/[0.05] px-6 py-4 text-sm text-cream/90 md:border-l md:border-gold-400/15 md:py-5">
                  <Check size={15} className="mt-0.5 shrink-0 text-jade" />
                  {b}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BẢNG GIÁ */}
      <section id="bang-gia" className="relative overflow-hidden border-t border-[var(--line)] py-24 sm:py-32">
        <div className="pointer-events-none absolute top-0 left-1/2 size-[760px] -translate-x-1/2 glow-gold opacity-50" />
        <div className="container-x relative">
          <SectionHead
            align="center"
            eyebrow="Bảng giá niêm yết"
            title={
              <>
                Lập lá luôn miễn phí. <span className="h-accent text-gold-gradient">Trả tiền khi muốn đọc sâu.</span>
              </>
            }
            desc="Trả một lần cho từng lá, không tự gia hạn. Mọi giá đều công khai — kể cả thuê bao và nạp lẻ."
          />
          <div className="mt-14">
            <PricingCards />
          </div>
          <div data-stagger className="mt-6 grid gap-3 text-sm text-cream-dim md:grid-cols-3">
            <div className="card flex items-center justify-between gap-3 px-5 py-4">
              <span>Tình duyên · đối chiếu hai lá</span>
              <span className="font-mono text-cream">từ 50.000đ</span>
            </div>
            <div className="card flex items-center justify-between gap-3 px-5 py-4">
              <span>Lịch vận hạn · thuê bao theo lá</span>
              <span className="text-right font-mono text-cream">
                {addons.lichVanHan[0].xu} xu/tháng · {addons.lichVanHan[1].xu} xu/năm
              </span>
            </div>
            <div className="card flex items-center justify-between gap-3 px-5 py-4">
              <span>Nạp lẻ lượt hỏi</span>
              <span className="font-mono text-cream">20 lượt = 29 xu</span>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-cream-mute">
            1 xu = 1.000đ · Thanh toán VietQR, tự kích hoạt 1–3 phút ·{" "}
            <Link href="/hoan-tien" className="text-gold-300 hover:underline">
              Hoàn 100% nếu chưa dùng, trong 7 ngày
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ + BÀI VIẾT */}
      <section className="container-x grid gap-16 py-24 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionHead eyebrow="Hỏi nhanh" title="Câu hỏi thường gặp" />
          <div data-reveal className="mt-10">
            <Faq items={homeFaq} />
          </div>
        </div>
        <div>
          <SectionHead eyebrow="Học tử vi" title="Bài nên đọc khi mới xem" />
          <div data-stagger className="mt-10 grid gap-3">
            {articles.map((a) => (
              <Link key={a.slug} href={`/bai-viet/${a.slug}`} className="group card flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <div className="font-mono text-[10.5px] tracking-wider text-gold-500 uppercase">{a.category}</div>
                  <div className="mt-1 text-[15px] text-cream transition-colors group-hover:text-gold-200">{a.title}</div>
                </div>
                <ArrowRight size={16} className="shrink-0 text-cream-mute transition duration-500 group-hover:translate-x-1 group-hover:text-gold-300" />
              </Link>
            ))}
            <Link href="/hoc-tu-vi" className="group mt-2 inline-flex items-center gap-1.5 text-sm text-gold-300">
              Xem tất cả bài viết và từ điển <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA CUỐI */}
      <section className="container-x pb-8">
        <div data-reveal="scale" className="relative overflow-hidden rounded-[32px] border border-gold-400/20 bg-ink-900/40 px-6 py-24 text-center sm:px-12 sm:py-32">
          <Sky />
          <Astrolabe className="absolute top-1/2 left-1/2 size-[820px] -translate-x-1/2 -translate-y-1/2 opacity-50 [mask-image:radial-gradient(closest-side,#000_45%,transparent)]" />
          <div className="pointer-events-none absolute -bottom-48 left-1/2 size-[620px] -translate-x-1/2 glow-gold" />
          <div data-stagger="blur" className="relative">
            <div className="kicker justify-center">Miễn phí · 30 giây</div>
            <h2 className="h-display mx-auto mt-5 max-w-3xl text-[38px] leading-[1.05] sm:text-[64px]">
              Bầu trời ngày bạn sinh ra <span className="h-accent text-gold-gradient">trông như thế nào?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-cream-dim">Không cần đăng nhập, lá số hiện ngay, tính trên chính máy của bạn.</p>
            <div>
              <Link href="/lap-la-so" className="btn btn-primary btn-lg mt-9 h-14 px-8 text-[16px]">
                Lập lá số miễn phí <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
