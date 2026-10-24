"use client";

import { CalendarRange, Layers } from "lucide-react";
import { CHI, canChiYear } from "@/lib/lunar";
import { mod, type Chart } from "@/lib/tuvi/engine";
import { Paywall } from "./Paywall";

const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

export function VanHanTab({
  chart,
  chartId,
  unlocked,
  onViewYear,
  onSelectPalace,
}: {
  chart: Chart;
  chartId: string;
  unlocked: boolean;
  onViewYear: (y: number) => void;
  onSelectPalace: (chi: number) => void;
}) {
  const birthYear = chart.lunar.year;
  const order = [...chart.palaces].sort((a, b) => a.daiVanStart - b.daiVanStart);
  const current = chart.palaces.find((p) => p.chi === chart.view.daiVanChi);
  const decadeStart = current ? current.daiVanStart : 1;
  const decadeYears = Array.from({ length: 10 }, (_, i) => birthYear + decadeStart - 1 + i);
  const tieuVanOf = (y: number) => {
    const chi = mod(y + 8);
    return chart.palaces.find((p) => p.tieuVanChi === chi)!;
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">Đại vận · mỗi kỳ 10 năm</span>
            <h2 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">Trục đại vận trọn đời</h2>
          </div>
          <p className="text-sm text-cream-dim">
            Khởi từ {chart.labels.cuc} ({chart.cuc} tuổi), đi {chart.thuan ? "thuận" : "nghịch"} theo {chart.labels.amDuong}.
          </p>
        </div>
        <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0 lg:grid-cols-12">
          {order.map((p) => {
            const isNow = p.chi === chart.view.daiVanChi;
            return (
              <button
                key={p.chi}
                onClick={() => onSelectPalace(p.chi)}
                className={`relative w-[112px] shrink-0 rounded-xl border p-3 text-left transition sm:w-auto ${
                  isNow ? "border-gold-400/70 bg-gold-400/10" : "border-[var(--line)] bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                {isNow && <span className="absolute -top-2 left-3 rounded-full bg-gold-400 px-1.5 text-[9.5px] font-semibold text-ink-950">ĐANG Ở ĐÂY</span>}
                <div className="font-mono text-[11px] text-cream-mute">
                  {p.daiVanStart}–{p.daiVanStart + 9}
                </div>
                <div className={`mt-1 text-sm font-medium ${isNow ? "text-gold-200" : "text-cream"}`}>{p.name}</div>
                <div className="mt-0.5 truncate text-[11px] text-cream-dim">{p.major.map((s) => s.name).join(", ") || "VCĐ"}</div>
                <div className="mt-2 font-mono text-[10px] text-cream-mute">
                  {birthYear + p.daiVanStart - 1}–{birthYear + p.daiVanStart + 8}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 text-cream-dim">
            <CalendarRange size={16} className="text-gold-400" />
            <span className="eyebrow">Tiểu vận trong đại vận hiện tại</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--line)]">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-left text-[11px] tracking-wider text-cream-mute uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">Năm</th>
                  <th className="px-3 py-2 font-medium">Tuổi</th>
                  <th className="px-3 py-2 font-medium">Tiểu vận tại</th>
                </tr>
              </thead>
              <tbody>
                {decadeYears.map((y) => {
                  const tv = tieuVanOf(y);
                  const now = y === chart.view.year;
                  return (
                    <tr key={y} className={`border-t border-[var(--line)] ${now ? "bg-silver/[0.07]" : ""}`}>
                      <td className="px-3 py-2 font-mono text-[13px] text-cream">
                        {y} <span className="text-cream-mute">{canChiYear(y).label}</span>
                      </td>
                      <td className="px-3 py-2 font-mono text-[13px] text-cream-dim">{y - birthYear + 1}</td>
                      <td className="px-3 py-2">
                        <button onClick={() => onSelectPalace(tv.chi)} className={now ? "text-silver" : "text-cream hover:text-gold-200"}>
                          {tv.name} <span className="text-cream-mute">· {CHI[tv.chi]}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-silver" />
              <span className="eyebrow !text-silver">Năm xem hạn · sao lưu niên</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => onViewYear(y)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[12px] transition ${
                    y === chart.view.year ? "border-silver/60 bg-silver/15 text-silver" : "border-[var(--line)] text-cream-dim hover:text-cream"
                  }`}
                >
                  {y} · {canChiYear(y).label}
                </button>
              ))}
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-[var(--line)] p-3">
                <dt className="text-[11px] text-cream-mute">Đại vận</dt>
                <dd className="mt-1 text-cream">{current?.name ?? "—"}</dd>
              </div>
              <div className="rounded-xl border border-[var(--line)] p-3">
                <dt className="text-[11px] text-cream-mute">Tiểu vận {chart.view.year}</dt>
                <dd className="mt-1 text-cream">{chart.palaces[chart.view.tieuVanChi]?.name ?? "—"}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-cream-dim">
              Sao lưu niên hiện ánh bạc trên lá 2D/3D. Lớp Tứ Hóa lưu niên theo Bắc phái được tách nhãn “L. Hóa …” và ghi nguồn riêng.
            </p>
          </div>

          {unlocked ? (
            <div className="card p-5 sm:p-6">
              <span className="eyebrow">Luận vận hạn {chart.view.year}</span>
              <p className="mt-3 text-[15px] leading-relaxed text-cream/90">
                Năm {chart.view.year} ({chart.view.label}), tiểu vận đi vào cung {chart.palaces[chart.view.tieuVanChi]?.name}, nằm trong đại vận{" "}
                {current?.name}. Bài luận đầy đủ đọc cung tiểu vận cùng tam phương, sao lưu niên và lớp Tứ Hóa lưu niên — mỗi đoạn kèm nguồn.
              </p>
            </div>
          ) : (
            <Paywall
              chartId={chartId}
              compact
              title={`Luận vận hạn năm ${chart.view.year}`}
              desc="Bài luận theo năm: đại vận, tiểu vận, sao lưu niên. Có từ gói Cơ bản (129.000đ)."
            />
          )}
        </div>
      </section>
    </div>
  );
}
