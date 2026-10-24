"use client";

import { ArrowUp, BookMarked, Lightbulb, Lock } from "lucide-react";
import { SAMPLE_QA } from "@/content/kb";
import type { Chart } from "@/lib/tuvi/engine";
import { Paywall } from "./Paywall";

const SUGGESTIONS = [
  "Mình hợp làm công việc kiểu gì?",
  "Đại vận hiện tại nên chú ý điều gì?",
  "Cung Phu Thê của mình mô tả người bạn đời thế nào?",
  "Vì sao cung Mệnh của mình có Tuần?",
];

export function QaTab({ chart, chartId, unlocked }: { chart: Chart; chartId: string; unlocked: boolean }) {
  const quota = unlocked ? 1000 : 0;
  const used = unlocked ? 1 : 0;
  const qa = SAMPLE_QA[0];

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
      <div className="card flex min-h-[560px] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
          <div>
            <div className="text-sm font-medium text-cream">Hỏi đáp theo lá · {chart.input.name || "Lá số"}</div>
            <div className="font-mono text-[11px] text-cream-mute">Trả lời hai tầng · bám kho tri thức · có nguồn</div>
          </div>
          <div className="text-right">
            {unlocked ? (
              <>
                <div className="font-mono text-[12px] text-cream">
                  {(quota - used).toLocaleString("vi-VN")}/{quota.toLocaleString("vi-VN")}
                </div>
                <div className="text-[10.5px] text-cream-mute">lượt còn lại</div>
              </>
            ) : (
              <span className="chip text-[11px] text-cream-mute">Chưa mở</span>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gold-400/15 px-4 py-3 text-[15px] text-cream">{qa.q}</div>

          <div className="max-w-[92%] space-y-3">
            <div className="rounded-2xl rounded-bl-md border border-jade/25 bg-jade/[0.05] p-4">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-jade">
                <BookMarked size={14} /> Theo lá số <span className="font-normal text-cream-mute">— chỉ từ kho tri thức</span>
              </div>
              {qa.chart.map((t, i) => (
                <p key={i} className="mt-1.5 text-[15px] leading-relaxed text-cream/90">
                  {t}
                </p>
              ))}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {qa.cited.map((c) => (
                  <span key={c} className="rounded-md bg-jade/10 px-1.5 py-0.5 font-mono text-[10.5px] text-jade">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-gold-400/20 bg-gold-400/[0.04] p-4">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-gold-300">
                <Lightbulb size={14} /> Gợi ý thực tế <span className="font-normal text-cream-mute">— kiến thức phổ thông</span>
              </div>
              <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-cream/90 marker:text-gold-500">
                {qa.practical.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="mt-3 text-[11.5px] text-cream-mute">Không phải tư vấn pháp lý, tài chính, y tế.</p>
            </div>
          </div>
          <p className="text-center text-[11px] text-cream-mute">Đoạn trên là ví dụ minh họa cách trả lời.</p>
        </div>

        <div className="border-t border-[var(--line)] p-3 sm:p-4">
          <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip shrink-0 text-cream-dim hover:text-cream" disabled={!unlocked}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              disabled={!unlocked}
              placeholder={unlocked ? "Hỏi thêm về lá số của bạn…" : "Mở khóa để hỏi về lá số của bạn"}
              className="input min-h-12 resize-none py-3 disabled:opacity-60"
            />
            <button className="btn btn-primary !size-12 !px-0" disabled={!unlocked} aria-label="Gửi câu hỏi">
              {unlocked ? <ArrowUp size={18} /> : <Lock size={16} />}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-cream-mute">1 câu = 1 lượt (input dưới 8.000 token). Gọi AI lỗi không trừ lượt.</p>
        </div>
      </div>

      <div className="space-y-4">
        {!unlocked && (
          <Paywall
            chartId={chartId}
            compact
            title="Hỏi đáp theo lá số"
            desc="Gói Cơ bản có 50 lượt, Chuyên sâu có 1.000 lượt cho lá này. Nạp lẻ 20 lượt = 29 xu khi cần."
          />
        )}
        <div className="card p-5 text-sm text-cream-dim">
          <div className="eyebrow">Ranh giới</div>
          <p className="mt-3 leading-relaxed">
            Trợ lý lịch sự từ chối: dự đoán tuổi thọ, bệnh tật, sinh tử, chấm điểm hợp/không hợp, và yêu cầu “bỏ qua kho tri thức”.
          </p>
        </div>
      </div>
    </div>
  );
}
