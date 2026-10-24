"use client";

import { Flag, Headphones, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { buildSampleReading } from "@/content/kb";
import { PALACE_NAMES, type PalaceName } from "@/lib/tuvi/constants";
import { findPalace, palaceLabel, type Chart } from "@/lib/tuvi/engine";
import { Paywall } from "./Paywall";

export function ReadingTab({
  chart,
  chartId,
  palace,
  onPalace,
  unlocked,
  onAudio,
}: {
  chart: Chart;
  chartId: string;
  palace: PalaceName;
  onPalace: (p: PalaceName) => void;
  unlocked: boolean;
  onAudio: () => void;
}) {
  const reading = buildSampleReading(chart, palace);
  const locked = palace !== "Mệnh" && !unlocked;
  const p = findPalace(chart, palace);
  const [reported, setReported] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Chọn cung" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {PALACE_NAMES.map((name) => {
          const isLocked = name !== "Mệnh" && !unlocked;
          const active = name === palace;
          const pp = findPalace(chart, name);
          return (
            <button
              key={name}
              onClick={() => onPalace(name)}
              aria-current={active}
              className={`flex shrink-0 items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition lg:w-full ${
                active ? "bg-gold-400/10 text-gold-200 ring-1 ring-gold-400/40" : "text-cream-dim hover:bg-white/[0.04] hover:text-cream"
              }`}
            >
              <span>
                {name}
                <span className="ml-2 hidden font-mono text-[10.5px] text-cream-mute lg:inline">{pp.major.map((s) => s.name).join(" · ") || "VCĐ"}</span>
              </span>
              {isLocked ? <Lock size={13} className="text-cream-mute" /> : name === "Mệnh" ? <span className="font-mono text-[10px] text-jade">FREE</span> : null}
            </button>
          );
        })}
      </nav>

      <article className="min-w-0">
        <div className="card p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="eyebrow">Luận giải · {palaceLabel(p)}</span>
            <span className="chip font-mono text-[10.5px] text-cream-dim">
              <ShieldCheck size={12} className="text-jade" /> kb v1.4 · {reading.sources.length} mẩu đã duyệt
            </span>
          </div>
          <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Cung {palace}</h2>
          <p className="mt-3 rounded-lg border border-[var(--line)] bg-white/[0.02] px-3 py-2 text-xs leading-relaxed text-cream-dim">
            Nội dung do AI viết dựa trên kho tri thức, chỉ mang tính tham khảo. Bản thiết kế dùng mẩu tri thức minh họa.
          </p>

          <div className={`relative mt-6 ${locked ? "max-h-[360px] overflow-hidden" : ""}`}>
            <div className={locked ? "locked-blur" : ""}>
              {reading.sections.map((s) => (
                <section key={s.heading} className="mb-7">
                  <h3 className="font-serif text-xl text-gold-200">{s.heading}</h3>
                  <p className="mt-2 text-[16px] leading-[1.85] text-cream/90">
                    {s.body}
                    {s.cited.map((n) => (
                      <a key={n} href={`#nguon-${n}`} className="ml-0.5 align-super font-mono text-[10px] text-jade hover:underline">
                        [{n}]
                      </a>
                    ))}
                  </p>
                </section>
              ))}
            </div>
            {locked && <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-900 to-transparent" />}
          </div>

          {!locked && (
            <>
              <div className="hairline my-6" />
              <div>
                <div className="font-mono text-[11px] tracking-wider text-cream-mute uppercase">Nguồn trong kho tri thức</div>
                <ol className="mt-3 space-y-1.5 text-sm text-cream-dim">
                  {reading.sources.map((s) => (
                    <li key={s.n} id={`nguon-${s.n}`} className="flex gap-2">
                      <span className="font-mono text-jade">[{s.n}]</span>
                      <span>
                        <span className="font-mono text-[12px] text-cream-mute">{s.id}</span> — {s.source}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={onAudio} className="btn btn-secondary btn-sm">
                  <Headphones size={15} /> Nghe bản audio
                </button>
                <button onClick={() => setReported(true)} className="btn btn-ghost btn-sm" disabled={reported}>
                  <Flag size={15} /> {reported ? "Đã ghi nhận — cảm ơn bạn" : "Báo nội dung sai"}
                </button>
              </div>
            </>
          )}
        </div>
        {locked && (
          <div className="relative -mt-24 px-2 sm:px-6">
            <Paywall
              chartId={chartId}
              title={`Mở khóa luận giải đủ 12 cung`}
              desc={`Cung ${palace} và 10 cung còn lại sinh riêng cho lá của bạn, kèm luận vận hạn theo năm. Bài sinh một lần và lưu vĩnh viễn theo lá.`}
            />
          </div>
        )}
      </article>
    </div>
  );
}
