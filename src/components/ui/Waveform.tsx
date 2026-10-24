"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function bars(n: number, seed: number) {
  return Array.from({ length: n }, (_, i) => {
    const v = Math.abs(Math.sin(i * 0.37 + seed) * 0.6 + Math.sin(i * 1.7 + seed * 2) * 0.3 + Math.sin(i * 0.09) * 0.25);
    return 0.18 + Math.min(v, 1) * 0.82;
  });
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Trình phát mô phỏng (bản thiết kế chưa gắn file audio thật). */
export function Waveform({
  duration,
  seed = 1,
  count = 72,
  label,
  disabled = false,
}: {
  duration: number;
  seed?: number;
  count?: number;
  label: string;
  disabled?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const raf = useRef<number>(0);
  const last = useRef<number>(0);
  const heights = bars(count, seed);

  useEffect(() => {
    if (!playing) return;
    const tick = (now: number) => {
      const dt = last.current ? (now - last.current) / 1000 : 0;
      last.current = now;
      setT((v) => {
        const nv = v + dt;
        if (nv >= duration) {
          setPlaying(false);
          return 0;
        }
        return nv;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [playing, duration]);

  const progress = t / duration;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setPlaying((v) => !v)}
        disabled={disabled}
        aria-label={playing ? `Tạm dừng ${label}` : `Phát ${label}`}
        className="btn btn-primary !size-14 shrink-0 !rounded-full !px-0 disabled:opacity-50"
      >
        {playing ? <Pause size={22} /> : <Play size={22} className="translate-x-0.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex h-14 items-center gap-[3px]" aria-hidden>
          {heights.map((h, i) => {
            const on = i / count < progress;
            const pulse = playing && Math.abs(i / count - progress) < 0.04;
            return (
              <span
                key={i}
                className="flex-1 rounded-full transition-[height,background] duration-150"
                style={{
                  height: `${(pulse ? Math.min(h * 1.25, 1) : h) * 100}%`,
                  background: on
                    ? i % 2
                      ? "var(--color-gold-400)"
                      : "var(--color-silver)"
                    : "rgb(239 231 214 / 0.14)",
                }}
              />
            );
          })}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[11px] text-cream-mute">
          <span>{fmt(t)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}
