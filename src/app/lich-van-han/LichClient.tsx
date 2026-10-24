"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { solarToLunar, canChiYear } from "@/lib/lunar";
import { PALACE_TOPIC } from "@/lib/tuvi/constants";
import { buildChart, mod } from "@/lib/tuvi/engine";
import { SAMPLE_INPUT } from "@/lib/tuvi/codec";
import { effectiveMonth } from "@/lib/tuvi/engine";

const DOW = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const THEME: Record<string, { label: string; color: string }> = {
  "Mệnh": { label: "Bản thân", color: "#e7c07a" },
  "Phụ Mẫu": { label: "Giấy tờ", color: "#b9c1ff" },
  "Phúc Đức": { label: "Tinh thần", color: "#86dcab" },
  "Điền Trạch": { label: "Nhà cửa", color: "#e7c07a" },
  "Quan Lộc": { label: "Công việc", color: "#86c9f6" },
  "Nô Bộc": { label: "Cộng sự", color: "#b9c1ff" },
  "Thiên Di": { label: "Ra ngoài", color: "#86c9f6" },
  "Tật Ách": { label: "Nghỉ ngơi", color: "#ff9584" },
  "Tài Bạch": { label: "Tài chính", color: "#86dcab" },
  "Tử Tức": { label: "Sáng tạo", color: "#f2a7b8" },
  "Phu Thê": { label: "Tình cảm", color: "#f2a7b8" },
  "Huynh Đệ": { label: "Anh em", color: "#b0a998" },
};

/** Lưu nguyệt theo Đẩu Quân của năm xem; lưu nhật đi thuận từ cung lưu nguyệt. Bản thiết kế. */
export function LichClient() {
  const [ym, setYm] = useState({ y: 2026, m: 10 });
  const [today, setToday] = useState({ d: 0, m: 0, y: 0 });
  useEffect(() => {
    const n = new Date();
    setToday({ d: n.getDate(), m: n.getMonth() + 1, y: n.getFullYear() });
    setYm({ y: n.getFullYear(), m: n.getMonth() + 1 });
  }, []);
  const chart = useMemo(() => buildChart({ ...SAMPLE_INPUT, viewYear: ym.y })!, [ym.y]);
  const birthMonth = effectiveMonth(chart.lunar);
  const h = chart.input.hour ?? 0;
  const [sel, setSel] = useState<number | null>(null);

  const days = useMemo(() => {
    const first = new Date(ym.y, ym.m - 1, 1);
    const n = new Date(ym.y, ym.m, 0).getDate();
    const lead = (first.getDay() + 6) % 7;
    const items = Array.from({ length: n }, (_, i) => {
      const d = i + 1;
      const l = solarToLunar(d, ym.m, ym.y);
      const yc = canChiYear(l.year).chi;
      const thangGieng = mod(yc - (birthMonth - 1) + h);
      const nguyet = mod(thangGieng + (l.month - 1));
      const nhat = mod(nguyet + (l.day - 1));
      return { d, l, palace: chart.palaces[nhat] };
    });
    return { lead, items };
  }, [ym, chart, birthMonth, h]);

  const step = (k: number) => setYm(({ y, m }) => {
    const mm = m + k;
    return mm < 1 ? { y: y - 1, m: 12 } : mm > 12 ? { y: y + 1, m: 1 } : { y, m: mm };
  });

  const selected = days.items.find((x) => x.d === (sel ?? (ym.m === today.m && ym.y === today.y ? today.d : 1)))!;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <button onClick={() => step(-1)} className="grid size-9 place-items-center rounded-full border border-[var(--line)] hover:bg-white/5" aria-label="Tháng trước">
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <div className="font-serif text-xl text-cream">Tháng {ym.m}/{ym.y}</div>
            <div className="font-mono text-[11px] text-cream-mute">Lá số mẫu · {chart.labels.amDuong}</div>
          </div>
          <button onClick={() => step(1)} className="grid size-9 place-items-center rounded-full border border-[var(--line)] hover:bg-white/5" aria-label="Tháng sau">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-1 text-center font-mono text-[10.5px] text-cream-mute">
          {DOW.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: days.lead }, (_, i) => (
            <div key={`x${i}`} />
          ))}
          {days.items.map((x) => {
            const t = THEME[x.palace.name];
            const isToday = x.d === today.d && ym.m === today.m && ym.y === today.y;
            const isSel = selected.d === x.d;
            return (
              <button
                key={x.d}
                onClick={() => setSel(x.d)}
                className={`flex aspect-square flex-col justify-between rounded-lg border p-1 text-left transition sm:aspect-[1/1.05] sm:p-1.5 ${
                  isSel ? "border-gold-400/70 bg-gold-400/10" : "border-[var(--line)] bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[13px] font-medium sm:text-sm ${isToday ? "text-gold-300" : "text-cream"}`}>{x.d}</span>
                  <span className="font-mono text-[9px] text-cream-mute">{x.l.day === 1 ? `${x.l.day}/${x.l.month}` : x.l.day}</span>
                </div>
                <span className="hidden truncate text-[10px] sm:block" style={{ color: t.color }}>
                  {t.label}
                </span>
                <span className="block h-1 w-full rounded-full sm:hidden" style={{ background: t.color, opacity: 0.6 }} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-5 sm:p-6">
          <div className="eyebrow">
            Ngày {selected.d}/{ym.m} · Âm {selected.l.day}/{selected.l.month}
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-cream">{selected.palace.name}</span>
            <span className="chip" style={{ color: THEME[selected.palace.name].color }}>
              {THEME[selected.palace.name].label}
            </span>
          </div>
          <p className="mt-2 text-sm text-cream-dim">Chủ đề của cung: {PALACE_TOPIC[selected.palace.name].toLowerCase()}.</p>
          <div className="relative mt-5 overflow-hidden rounded-xl border border-[var(--line)] p-4">
            <p className="locked-blur text-[15px] leading-relaxed text-cream/90">
              Ngày ứng với cung {selected.palace.name}, nơi có {selected.palace.major.map((s) => s.name).join(", ") || "phụ tinh"}. Kho tri thức gợi ý
              đây là ngày hợp để rà lại kế hoạch đang dở, hơn là mở đầu việc mới…
            </p>
            <div className="absolute inset-0 grid place-items-center bg-ink-950/30">
              <span className="chip bg-ink-950/80 text-gold-300">
                <Lock size={12} /> Mở thuê bao để đọc từng ngày
              </span>
            </div>
          </div>
        </div>
        <div className="card p-5 text-xs leading-relaxed text-cream-dim">
          Mỗi ngày ứng với một cung trên lá số (lưu nguyệt theo Đẩu Quân, lưu nhật đi thuận). Nội dung lấy từ kho tri thức đã duyệt, mang tính
          tham khảo, không phán kết quả, không xem ngày tốt xấu kiểu lịch vạn sự.
        </div>
      </div>
    </div>
  );
}
