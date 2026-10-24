"use client";

import { BookOpen, Lock } from "lucide-react";
import { CHI } from "@/lib/lunar";
import { BRIGHTNESS_LABEL, ELEMENT_LABEL, PALACE_TOPIC } from "@/lib/tuvi/constants";
import { palaceLabel, relationsOf, type Chart, type PlacedStar } from "@/lib/tuvi/engine";
import { ELEMENT_COLOR, HOA_COLOR } from "../chart/starStyle";

function Group({ title, stars, tone }: { title: string; stars: PlacedStar[]; tone?: string }) {
  if (!stars.length) return null;
  return (
    <div>
      <div className="mb-1.5 font-mono text-[10.5px] tracking-wider text-cream-mute uppercase">
        {title} <span className="text-cream-mute/60">· {stars.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {stars.map((s) => (
          <span
            key={s.name}
            className="rounded-md border border-[var(--line)] bg-white/[0.02] px-2 py-0.5 text-[12px]"
            style={{ color: tone ?? (s.kind === "hoa" ? HOA_COLOR[s.name.replace("Hóa ", "")] : ELEMENT_COLOR[s.element]) }}
          >
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PalaceInspector({
  chart,
  chi,
  onSelect,
  onRead,
  unlocked,
}: {
  chart: Chart;
  chi: number;
  onSelect: (chi: number) => void;
  onRead: () => void;
  unlocked: boolean;
}) {
  const p = chart.palaces[chi];
  const rel = relationsOf(chi);
  const free = p.isMenh || unlocked;
  const good = p.minor.filter((s) => s.kind === "cat" || s.kind === "trung");
  const bad = p.minor.filter((s) => s.kind === "sat");
  const hoa = p.minor.filter((s) => s.kind === "hoa");
  const ring = p.minor.filter((s) => s.kind === "vong");

  return (
    <aside className="card flex flex-col gap-5 p-5" aria-label={`Chi tiết cung ${p.name}`}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow">
            Cung · {palaceLabel(p)}
          </span>
          <span className="font-mono text-[11px] text-cream-mute">
            Đại vận {p.daiVanStart}–{p.daiVanStart + 9}
          </span>
        </div>
        <h3 className="mt-2 font-serif text-[28px] leading-tight text-cream">{p.name}</h3>
        <p className="mt-1 text-sm text-cream-dim">{PALACE_TOPIC[p.name]}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.isMenh && <span className="chip text-gold-300">Mệnh</span>}
          {p.isThan && <span className="chip text-silver">Thân cư</span>}
          {p.tuan && <span className="chip text-cream/70">Tuần án ngữ</span>}
          {p.triet && <span className="chip text-ember/80">Triệt án ngữ</span>}
          {chart.view.daiVanChi === chi && <span className="chip text-gold-300">Đại vận hiện tại</span>}
          {chart.view.tieuVanChi === chi && <span className="chip text-silver">Tiểu vận {chart.view.year}</span>}
        </div>
      </div>

      <div className="hairline" />

      <div>
        <div className="mb-2 font-mono text-[10.5px] tracking-wider text-cream-mute uppercase">Chính tinh</div>
        {p.major.length ? (
          <ul className="space-y-2">
            {p.major.map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: ELEMENT_COLOR[s.element], boxShadow: `0 0 10px ${ELEMENT_COLOR[s.element]}` }} />
                  <span className="font-serif text-lg font-medium" style={{ color: ELEMENT_COLOR[s.element] }}>
                    {s.name}
                  </span>
                  {s.hoa && (
                    <span className="rounded px-1.5 font-mono text-[10px] font-medium text-ink-950" style={{ background: HOA_COLOR[s.hoa] }}>
                      Hóa {s.hoa}
                    </span>
                  )}
                </span>
                <span className="text-right font-mono text-[11px] text-cream-dim">
                  {s.brightness ? BRIGHTNESS_LABEL[s.brightness] : ""} · {ELEMENT_LABEL[s.element]}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-cream-dim">
            Vô chính diệu — mượn chính tinh cung xung chiếu{" "}
            <button className="text-gold-300 hover:underline" onClick={() => onSelect(rel.xungChieu)}>
              {chart.palaces[rel.xungChieu].name}
            </button>
            .
          </p>
        )}
      </div>

      <div className="space-y-3.5">
        <Group title="Tứ hóa" stars={hoa} />
        <Group title="Cát tinh" stars={good} />
        <Group title="Sát tinh" stars={bad} />
        <Group title="Vòng sao" stars={ring} tone="#827c70" />
        <div className="flex items-center gap-2 font-mono text-[11px] text-cream-mute">
          Vòng Tràng Sinh: <span className="text-cream-dim">{p.trangSinh}</span>
        </div>
      </div>

      <div className="hairline" />

      <div>
        <div className="mb-2 font-mono text-[10.5px] tracking-wider text-cream-mute uppercase">Tam phương tứ chính</div>
        <div className="grid grid-cols-3 gap-1.5">
          {[...rel.tamHop, rel.xungChieu].map((c, i) => {
            const pp = chart.palaces[c];
            return (
              <button
                key={c}
                onClick={() => onSelect(c)}
                className={`rounded-lg border p-2 text-left transition hover:bg-white/[0.05] ${i === 2 ? "col-span-3 border-silver/25" : "border-gold-400/25"}`}
              >
                <div className="text-[11px] text-cream-mute">
                  {i === 2 ? "Xung chiếu" : "Tam hợp"} · {CHI[c]}
                </div>
                <div className="truncate text-sm text-cream">{pp.name}</div>
                <div className="truncate text-[11px] text-cream-dim">{pp.major.map((s) => s.name).join(", ") || "Vô chính diệu"}</div>
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={onRead} className={`btn w-full ${free ? "btn-primary" : "btn-secondary"}`}>
        {free ? <BookOpen size={16} /> : <Lock size={16} />}
        {free ? `Đọc luận giải cung ${p.name}` : `Mở khóa luận giải cung ${p.name}`}
      </button>
    </aside>
  );
}
