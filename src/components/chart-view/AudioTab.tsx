"use client";

import { Clock, Lock, Mail, Mic2 } from "lucide-react";
import { PODCAST_CHAPTERS, SAMPLE_TRANSCRIPT } from "@/content/kb";
import { Waveform } from "@/components/ui/Waveform";
import { Paywall } from "./Paywall";

export function AudioTab({ chartId, unlocked }: { chartId: string; unlocked: boolean }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="eyebrow">Audio mở đầu · miễn phí</span>
          <span className="chip font-mono text-[10.5px] text-jade">Đã sinh · cache theo lá</span>
        </div>
        <h2 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">Lá số của bạn, kể bằng hai giọng</h2>
        <p className="mt-2 text-sm leading-relaxed text-cream-dim">
          Khoảng 2 phút: Host A đặt câu hỏi, Host B giải thích — chỉ từ các mẩu tri thức được cấp cho lá này.
        </p>
        <div className="mt-6">
          <Waveform duration={124} seed={3} label="audio mở đầu" />
        </div>
        <div className="mt-6 space-y-3 border-t border-[var(--line)] pt-5">
          {SAMPLE_TRANSCRIPT.map((l, i) => (
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
        <p className="mt-5 text-[11.5px] text-cream-mute">Giọng đọc do AI tạo. Bản thiết kế dùng trình phát mô phỏng.</p>
      </div>

      <div className="space-y-4">
        <div className={`card relative overflow-hidden p-5 sm:p-7 ${unlocked ? "" : ""}`}>
          <div className="flex items-center justify-between">
            <span className="eyebrow">Podcast 25–30 phút</span>
            {unlocked ? (
              <span className="chip font-mono text-[10.5px] text-gold-300">
                <Clock size={12} /> Đang sinh · còn ~8 phút
              </span>
            ) : (
              <span className="chip text-cream-mute">
                <Lock size={12} /> Gói Chuyên sâu
              </span>
            )}
          </div>
          <h3 className="mt-3 flex items-center gap-2 font-serif text-xl text-cream">
            <Mic2 size={18} className="text-gold-400" /> 7 chương, dựng riêng theo lá
          </h3>
          <ol className="mt-4 divide-y divide-[var(--line)]">
            {PODCAST_CHAPTERS.map((c) => (
              <li key={c.t} className="flex items-center gap-4 py-2.5 text-sm">
                <span className="w-12 font-mono text-[12px] text-cream-mute">{c.t}</span>
                <span className={unlocked ? "text-cream" : "text-cream-dim"}>{c.title}</span>
              </li>
            ))}
          </ol>
          {unlocked && (
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[62%] animate-shimmer rounded-full bg-[linear-gradient(90deg,var(--color-gold-500),var(--color-gold-200),var(--color-gold-500))] bg-[length:200%_100%]" />
            </div>
          )}
          <p className="mt-4 flex items-center gap-2 text-xs text-cream-dim">
            <Mail size={13} /> Chạy nền, xong gửi email — bạn có thể đóng trang.
          </p>
        </div>
        {!unlocked && (
          <Paywall
            chartId={chartId}
            title="Nghe trọn podcast về lá số của bạn"
            desc="Gói Chuyên sâu 299.000đ: podcast 25–30 phút, đủ 12 cung, vận hạn và 1.000 lượt hỏi đáp."
          />
        )}
      </div>
    </div>
  );
}
