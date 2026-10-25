import { CHI } from "@/lib/lunar";

/** Vị trí 12 địa chi trên lưới 4×4 của lá số giấy (Tỵ ở góc trên trái). */
const GRID_POS: Record<number, [number, number]> = {
  5: [0, 0], 6: [0, 1], 7: [0, 2], 8: [0, 3],
  4: [1, 0], 9: [1, 3],
  3: [2, 0], 10: [2, 3],
  2: [3, 0], 1: [3, 1], 0: [3, 2], 11: [3, 3],
};

/** Lá 2D thu nhỏ: các bộ tam hợp lần lượt sáng lên (CSS, không JS). */
export function MiniGrid2D() {
  return (
    <div className="relative mt-5 grid aspect-square grid-cols-4 grid-rows-4 gap-1">
      {CHI.map((c, chi) => {
        const [r, col] = GRID_POS[chi];
        return (
          <div
            key={c}
            className="tam-hop-cell flex items-end rounded-md p-1.5 font-mono text-[9.5px] text-cream-mute ring-1 ring-[var(--line)]"
            style={{ gridRow: r + 1, gridColumn: col + 1, "--g": chi % 4 } as React.CSSProperties}
          >
            {c}
          </div>
        );
      })}
      <div className="col-span-2 col-start-2 row-span-2 row-start-2 grid place-items-center rounded-md text-center">
        <div>
          <div className="font-mono text-[9px] tracking-[0.2em] text-gold-500 uppercase">Thiên bàn</div>
          <div className="mt-1 font-serif text-sm italic text-cream/80">tam hợp</div>
        </div>
      </div>
    </div>
  );
}

/** Ba trang PDF xếp chồng, xòe ra khi rê chuột vào thẻ cha (group). */
export function PdfStack() {
  const page = (
    <>
      <div className="h-1.5 w-1/2 rounded-full bg-ink-950/70" />
      <div className="mt-1 h-1 w-1/3 rounded-full bg-gold-600/70" />
      <div className="mt-3 grid grid-cols-4 gap-0.5">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className={`aspect-square rounded-[2px] ${[5, 6, 9, 10].includes(i) ? "" : "bg-ink-950/10 ring-1 ring-ink-950/15"}`} />
        ))}
      </div>
      <div className="mt-3 space-y-1">
        {[100, 92, 96, 70].map((w, i) => (
          <div key={i} className="h-1 rounded-full bg-ink-950/20" style={{ width: `${w}%` }} />
        ))}
      </div>
    </>
  );
  return (
    <div className="relative h-44 w-full max-w-[300px]" aria-hidden="true">
      {[
        "rotate-[-9deg] -translate-x-10 group-hover:rotate-[-14deg] group-hover:-translate-x-16",
        "rotate-[7deg] translate-x-10 group-hover:rotate-[12deg] group-hover:translate-x-16",
        "rotate-0 group-hover:-translate-y-2",
      ].map((t, i) => (
        <div
          key={i}
          className={`absolute top-2 left-1/2 ml-[-64px] w-32 rounded-lg bg-[#f4ecdb] p-3 shadow-[0_20px_40px_-12px_rgb(0_0_0/0.7)] transition-transform duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${t} ${i < 2 ? "opacity-80" : ""}`}
        >
          {page}
        </div>
      ))}
    </div>
  );
}
