"use client";

import { useCallback, useState } from "react";
import { BirthForm } from "@/components/chart/BirthForm";
import { Chart2D } from "@/components/chart/Chart2D";
import type { Chart } from "@/lib/tuvi/engine";

export function LapLaSoClient() {
  const [chart, setChart] = useState<Chart | null>(null);
  const onPreview = useCallback((c: Chart | null) => setChart(c), []);
  const [sel, setSel] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-12">
      <div className="paper-section form-workbench">
        <div className="form-heading"><span className="eyebrow">THÔNG TIN CỦA BẠN</span><h2>Khởi tạo lá số</h2><p>Điền ngày và giờ sinh để khám phá thiên bàn của riêng bạn.</p></div><BirthForm onPreview={onPreview} />
      </div>
      <div className="lg:sticky lg:top-24">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-jade" />
            <span className="font-mono text-[11px] tracking-wider text-cream-dim uppercase">Xem trước trực tiếp</span>
          </div>
          <span className="text-xs text-cream-mute">Lá số cập nhật theo từng ô bạn chọn</span>
        </div>
        {chart ? (
          <div className="relative">
            <Chart2D chart={chart} selected={sel ?? chart.menhChi} onSelect={setSel} />
          </div>
        ) : (
          <div className="grid h-[420px] place-items-center rounded-2xl border border-dashed border-[var(--line-strong)] text-sm text-cream-dim">
            Ngày sinh chưa hợp lệ
          </div>
        )}
      </div>
    </div>
  );
}
