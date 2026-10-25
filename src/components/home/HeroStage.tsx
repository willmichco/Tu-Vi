"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Hand, Play } from "lucide-react";
import { Chart3DLazy } from "@/components/chart/Chart3DLazy";
import { SAMPLE_ID, SAMPLE_INPUT } from "@/lib/tuvi/codec";
import { buildChart } from "@/lib/tuvi/engine";

const sample = buildChart(SAMPLE_INPUT)!;

export function HeroStage({ poster }: { poster: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(sample.menhChi);

  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
          (idle ?? ((cb: () => void) => setTimeout(cb, 600)))(() => setLive(true));
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative aspect-[640/430] w-full lg:aspect-[640/560]">
      <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>{poster}</div>
      {live && (
        <Chart3DLazy
          chart={sample}
          selected={selected}
          onSelect={setSelected}
          interactive
          zoom={false}
          autoRotate
          quiet
          onReady={() => setReady(true)}
          className={`!absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
        {!live ? (
          <button onClick={() => setLive(true)} className="btn btn-secondary btn-sm backdrop-blur">
            <Play size={14} /> Xoay thử bàn sao 3D
          </button>
        ) : (
          <span className="chip bg-ink-950/70 text-cream-dim backdrop-blur">
            <Hand size={13} /> Kéo để xoay · chạm một cung
          </span>
        )}
        <Link href={`/la-so?id=${SAMPLE_ID}`} className="chip bg-ink-950/70 text-gold-300 backdrop-blur hover:text-gold-200">
          Mở lá số mẫu →
        </Link>
      </div>
    </div>
  );
}
