"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Chart } from "@/lib/tuvi/engine";

const Chart3D = dynamic(() => import("./Chart3D"), { ssr: false, loading: () => null });

function Poster({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex flex-col items-center gap-3 text-sm text-cream-dim">
        <div className="relative size-16">
          <div className="absolute inset-0 animate-spin rounded-full border border-gold-400/20 border-t-gold-400" />
          <div className="absolute inset-3 rounded-full glow-gold" />
        </div>
        {label}
      </div>
    </div>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Chart3DLazy({
  className = "",
  onFallback,
  onReady,
  quiet = false,
  ...props
}: {
  chart: Chart;
  selected: number;
  onSelect: (chi: number) => void;
  showLuu?: boolean;
  interactive?: boolean;
  zoom?: boolean;
  autoRotate?: boolean;
  className?: string;
  onFallback?: () => void;
  onReady?: () => void;
  /** Ẩn vòng chờ (khi bên dưới đã có poster tĩnh). */
  quiet?: boolean;
}) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = hasWebGL();
    setOk(v);
    if (!v) onFallback?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (ok === false) {
    return (
      <div className={`relative grid place-items-center ${className}`}>
        <p className="max-w-xs text-center text-sm text-cream-dim">Thiết bị chưa hỗ trợ 3D (WebGL). Lá số 2D vẫn đầy đủ thông tin.</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!ready && !quiet && <Poster label="Đang dựng bàn sao…" />}
      {ok && (
        <Chart3D
          {...props}
          className="absolute inset-0"
          onReady={() => {
            setReady(true);
            onReady?.();
          }}
        />
      )}
    </div>
  );
}
