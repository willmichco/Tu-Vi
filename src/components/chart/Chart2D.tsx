"use client";

import { CHI } from "@/lib/lunar";
import { palaceLabel, relationsOf, type Chart, type Palace, type PlacedStar } from "@/lib/tuvi/engine";
import { BRIGHTNESS_OPACITY, BRIGHTNESS_SHORT, ELEMENT_COLOR, GRID_POS, HOA_COLOR } from "./starStyle";

interface Props {
  chart: Chart;
  selected: number;
  onSelect: (chi: number) => void;
  showLuu?: boolean;
  showLines?: boolean;
}

/** Tâm ô (theo % của lưới) để vẽ đường quan hệ giữa các cung. */
function cellCenter(chi: number): [number, number] {
  const [r, c] = GRID_POS[chi];
  return [c * 25 + 12.5, r * 25 + 12.5];
}

function edgePoint(chi: number): [number, number] {
  // Kéo điểm neo vào phía thiên bàn để đường không đè chữ
  const [x, y] = cellCenter(chi);
  return [x + (50 - x) * 0.2, y + (50 - y) * 0.2];
}

export function StarName({ s, size = "md" }: { s: PlacedStar; size?: "md" | "lg" }) {
  const op = s.brightness ? BRIGHTNESS_OPACITY[s.brightness] : 1;
  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
      <span
        className={`font-serif font-semibold ${size === "lg" ? "text-[15px] uppercase tracking-wide" : "text-[11.5px] sm:text-[13.5px] sm:uppercase sm:tracking-wide"}`}
        style={{ color: ELEMENT_COLOR[s.element], opacity: op, textShadow: op > 0.9 ? `0 0 12px ${ELEMENT_COLOR[s.element]}55` : undefined }}
      >
        {s.name}
      </span>
      {s.brightness && (
        <span className="hidden font-mono text-[9.5px] text-cream-mute sm:inline" title="Miếu · Vượng · Đắc · Bình · Hãm">
          {BRIGHTNESS_SHORT[s.brightness]}
        </span>
      )}
      {s.hoa && (
        <>
          <span className="size-1.5 shrink-0 self-center rounded-full sm:hidden" style={{ background: HOA_COLOR[s.hoa] }} title={`Hóa ${s.hoa}`} />
          <span
            className="hidden rounded px-1 font-mono text-[9px] leading-[14px] font-medium text-ink-950 sm:inline"
            style={{ background: HOA_COLOR[s.hoa] }}
          >
            {s.hoa}
          </span>
        </>
      )}
    </span>
  );
}

function MinorList({ stars, align }: { stars: PlacedStar[]; align: "left" | "right" }) {
  return (
    <ul className={`space-y-[1px] ${align === "right" ? "text-right" : ""}`}>
      {stars.map((s) => (
        <li
          key={s.name}
          className="truncate text-[10.5px] leading-[14px]"
          style={{ color: s.kind === "hoa" ? HOA_COLOR[s.name.replace("Hóa ", "")] : ELEMENT_COLOR[s.element], opacity: s.kind === "vong" ? 0.55 : 0.85 }}
        >
          {s.name}
        </li>
      ))}
    </ul>
  );
}

function Cell({
  p,
  chart,
  selected,
  related,
  onSelect,
  showLuu,
}: {
  p: Palace;
  chart: Chart;
  selected: boolean;
  related: boolean;
  onSelect: () => void;
  showLuu: boolean;
}) {
  const [r, c] = GRID_POS[p.chi];
  const good = p.minor.filter((s) => s.kind === "cat" || s.kind === "hoa" || (s.kind === "trung" && s.element !== "hoa"));
  const bad = p.minor.filter((s) => s.kind === "sat" || (s.kind === "trung" && s.element === "hoa"));
  const ring = p.minor.filter((s) => s.kind === "vong");
  const isDaiVan = chart.view.daiVanChi === p.chi;
  const isTieuVan = chart.view.tieuVanChi === p.chi;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Cung ${p.name} tại ${CHI[p.chi]}`}
      style={{ gridRow: r + 1, gridColumn: c + 1 }}
      className={`group relative flex min-h-[112px] flex-col overflow-hidden rounded-lg p-1.5 text-left transition sm:min-h-[200px] sm:rounded-xl sm:p-2.5 lg:min-h-[228px] ${
        selected
          ? "bg-gold-400/[0.09] ring-1 ring-gold-400/70"
          : related
            ? "bg-white/[0.035] ring-1 ring-gold-400/25"
            : "bg-white/[0.02] ring-1 ring-[var(--line)] hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <div
            className={`truncate text-[10px] font-semibold tracking-[0.08em] uppercase sm:text-[11px] ${
              p.isMenh ? "text-gold-300" : "text-cream-dim"
            }`}
          >
            {p.name}
            {p.isThan && <span className="ml-1 rounded bg-silver/20 px-1 text-[9px] text-silver normal-case">Thân</span>}
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-cream-mute">
            <span className="hidden sm:inline">{palaceLabel(p)}</span>
            {p.tuan && <span className="rounded bg-cream/10 px-1 font-sans text-[9px] text-cream/70">Tuần</span>}
            {p.triet && <span className="rounded bg-ember/15 px-1 font-sans text-[9px] text-ember/80">Triệt</span>}
          </div>
        </div>
        <div className="font-mono text-[10px] text-cream-mute sm:text-[11px]">
          <span className={isDaiVan ? "rounded bg-gold-400/20 px-1 text-gold-300" : ""}>{p.daiVanStart}</span>
        </div>
      </div>

      <div className="mt-1 flex flex-col gap-0.5 sm:mt-2 sm:items-center sm:text-center">
        {p.major.length ? (
          p.major.map((s) => (
            <div key={s.name} className="max-w-full overflow-hidden">
              <StarName s={s} />
            </div>
          ))
        ) : (
          <span className="text-[10px] text-cream-mute italic sm:text-[11px]">Vô chính diệu</span>
        )}
      </div>

      <div className="mt-2 hidden flex-1 grid-cols-2 gap-x-2 sm:grid">
        <MinorList stars={good} align="left" />
        <MinorList stars={bad} align="right" />
      </div>

      <div className="mt-auto hidden items-end justify-between gap-1 pt-1 sm:flex">
        <span className="whitespace-nowrap text-[10px] text-cream-mute">{p.trangSinh}</span>
        <span className="hidden min-w-0 flex-1 truncate text-center text-[9.5px] text-cream-mute/80 xl:block">{ring.map((s) => s.name).slice(0, 2).join(" · ")}</span>
        <span className={`shrink-0 font-mono text-[10px] ${isTieuVan ? "rounded bg-silver/20 px-1 text-silver" : "text-cream-mute"}`}>
          {CHI[p.tieuVanChi]}
        </span>
      </div>

      <div className="mt-auto pt-1 text-[10px] text-cream-mute sm:hidden">
        +{p.minor.length} sao
      </div>

      {showLuu && p.luu.length > 0 && (
        <div className="mt-1 hidden flex-wrap gap-x-1.5 border-t border-dashed border-silver/20 pt-1 sm:flex">
          {p.luu.map((s) => (
            <span key={s.name} className="text-[9.5px] text-silver/90">
              {s.name}
            </span>
          ))}
        </div>
      )}

    </button>
  );
}

export function Chart2D({ chart, selected, onSelect, showLuu = false, showLines = true }: Props) {
  const rel = relationsOf(selected);
  const relatedSet = new Set([...rel.tamHop, rel.xungChieu]);
  const [sx, sy] = edgePoint(selected);
  const [a, b] = rel.tamHop.map(edgePoint);
  const [xx, xy] = edgePoint(rel.xungChieu);
  const l = chart.labels;
  const i = chart.input;

  return (
    <div className="relative">
      <div className="relative grid grid-cols-4 grid-rows-4 gap-1 sm:gap-1.5">
        {chart.palaces.map((p) => (
          <Cell
            key={p.chi}
            p={p}
            chart={chart}
            selected={p.chi === selected}
            related={relatedSet.has(p.chi)}
            onSelect={() => onSelect(p.chi)}
            showLuu={showLuu}
          />
        ))}

        {/* Thiên bàn */}
        <div
          style={{ gridRow: "2 / span 2", gridColumn: "2 / span 2" }}
          className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg p-2 text-center ring-1 ring-[var(--line)] sm:rounded-xl sm:p-4"
        >
          <div className="pointer-events-none absolute inset-0 glow-gold opacity-70" />
          <div className="relative w-full">
            <div className="eyebrow hidden sm:block">Thiên bàn</div>
            <div className="truncate font-serif text-[15px] text-cream sm:mt-1 sm:text-2xl">{i.name || "Lá số"}</div>
            <div className="mt-0.5 text-[10px] text-cream-dim sm:mt-1 sm:text-[13px]">
              {l.amDuong} · {chart.solar.day}/{chart.solar.month}/{chart.solar.year}
            </div>
            <dl className="mx-auto mt-2 hidden max-w-[300px] grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-left text-[12px] sm:grid">
              <dt className="text-cream-mute">Âm lịch</dt>
              <dd className="text-cream/90">
                {chart.lunar.day}/{chart.lunar.month}
                {chart.lunar.leap ? " nhuận" : ""} · {l.year}
              </dd>
              <dt className="text-cream-mute">Giờ</dt>
              <dd className="text-cream/90">{l.hour ?? "Chưa rõ giờ"}</dd>
              <dt className="text-cream-mute">Bản mệnh</dt>
              <dd className="text-cream/90">{l.banMenh}</dd>
              <dt className="text-cream-mute">Cục</dt>
              <dd className="text-cream/90">{l.cuc}</dd>
              <dt className="text-cream-mute">Sinh khắc</dt>
              <dd className="text-cream/90">{l.menhCucRelation}</dd>
              <dt className="text-cream-mute">Chủ mệnh</dt>
              <dd className="text-cream/90">
                {l.chuMenh} · Chủ thân {l.chuThan}
              </dd>
              <dt className="text-cream-mute">Thân cư</dt>
              <dd className="text-cream/90">{l.thanCu}</dd>
            </dl>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-silver/25 bg-silver/10 px-2 py-0.5 font-mono text-[9.5px] text-silver sm:mt-3 sm:text-[11px]">
              {chart.view.year} · {chart.view.label} · {chart.view.age} tuổi
            </div>
          </div>
        </div>

        {showLines && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <polygon
              points={`${sx},${sy} ${a[0]},${a[1]} ${b[0]},${b[1]}`}
              fill="rgb(231 192 122 / 0.04)"
              stroke="rgb(231 192 122 / 0.55)"
              strokeWidth="0.25"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={sx}
              y1={sy}
              x2={xx}
              y2={xy}
              stroke="rgb(185 193 255 / 0.6)"
              strokeWidth="0.25"
              strokeDasharray="1.2 1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
