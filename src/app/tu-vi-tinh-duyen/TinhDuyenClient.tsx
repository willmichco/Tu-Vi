"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { STAR_AT_MENH } from "@/content/kb";
import { HOURS } from "@/lib/tuvi/constants";
import { buildChart, findPalace, type BirthInput, type Chart } from "@/lib/tuvi/engine";
import { addons, vnd } from "@/lib/site";
import { ELEMENT_COLOR } from "@/components/chart/starStyle";

const YEARS = Array.from({ length: 2008 - 1940 + 1 }, (_, i) => 2008 - i);

function PersonForm({ label, value, onChange }: { label: string; value: BirthInput; onChange: (v: BirthInput) => void }) {
  const set = (patch: Partial<BirthInput>) => onChange({ ...value, ...patch });
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 flex w-full items-center justify-between">
        <span className="font-serif text-lg text-cream">{label}</span>
        <div className="seg grid-cols-2 !p-0.5 text-xs">
          <button type="button" className="!h-8 px-3" aria-pressed={value.gender === "nam"} onClick={() => set({ gender: "nam" })}>
            Nam
          </button>
          <button type="button" className="!h-8 px-3" aria-pressed={value.gender === "nu"} onClick={() => set({ gender: "nu" })}>
            Nữ
          </button>
        </div>
      </legend>
      <input className="input" placeholder="Tên gọi (không bắt buộc)" value={value.name} onChange={(e) => set({ name: e.target.value })} maxLength={30} />
      <div className="grid grid-cols-3 gap-2">
        <select aria-label="Ngày" className="input" value={value.day} onChange={(e) => set({ day: +e.target.value })}>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <select aria-label="Tháng" className="input" value={value.month} onChange={(e) => set({ month: +e.target.value })}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              Th {i + 1}
            </option>
          ))}
        </select>
        <select aria-label="Năm" className="input" value={value.year} onChange={(e) => set({ year: +e.target.value })}>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <select aria-label="Giờ sinh" className="input" value={value.hour ?? "x"} onChange={(e) => set({ hour: e.target.value === "x" ? null : +e.target.value })}>
        {HOURS.map((h) => (
          <option key={h.value} value={h.value}>
            Giờ {h.label} ({h.range})
          </option>
        ))}
        <option value="x">Không nhớ giờ</option>
      </select>
      <p className="text-[11.5px] text-cream-mute">Ngày sinh dương lịch (theo giấy khai sinh).</p>
    </fieldset>
  );
}

const base = (p: Partial<BirthInput>): BirthInput => ({
  name: "",
  gender: "nu",
  calendar: "duong",
  day: 1,
  month: 1,
  year: 1995,
  leap: false,
  hour: 4,
  lateTy: false,
  tz: 7,
  viewYear: 2026,
  ...p,
});

function Portrait({ c, who }: { c: Chart; who: string }) {
  const menh = findPalace(c, "Mệnh");
  const pt = findPalace(c, "Phu Thê");
  const first = menh.major[0];
  return (
    <div className="card p-5">
      <div className="eyebrow">{who}</div>
      <div className="mt-2 font-serif text-xl text-cream">{c.input.name || who}</div>
      <div className="mt-1 text-xs text-cream-dim">
        {c.labels.amDuong} · {c.labels.banMenh} · {c.labels.cuc}
      </div>
      <div className="mt-4 text-[11px] tracking-wider text-cream-mute uppercase">Mệnh</div>
      <div className="mt-1 flex flex-wrap gap-2">
        {menh.major.length ? (
          menh.major.map((s) => (
            <span key={s.name} className="font-serif text-lg" style={{ color: ELEMENT_COLOR[s.element] }}>
              {s.name}
            </span>
          ))
        ) : (
          <span className="text-cream-dim italic">Vô chính diệu</span>
        )}
      </div>
      {first && <p className="mt-2 text-sm leading-relaxed text-cream-dim">{STAR_AT_MENH[first.name].split(". ").slice(0, 2).join(". ")}.</p>}
      <div className="mt-4 text-[11px] tracking-wider text-cream-mute uppercase">Phu Thê · hình dung về người bạn đời</div>
      <div className="mt-1 text-[15px] text-cream">{pt.major.map((s) => s.name).join(", ") || "Vô chính diệu"}</div>
    </div>
  );
}

function DualTimeline({ a, b }: { a: Chart; b: Chart }) {
  const years = Array.from({ length: 21 }, (_, i) => 2026 + i);
  const palaceAt = (c: Chart, y: number) => {
    const age = y - c.lunar.year + 1;
    return c.palaces.find((p) => age >= p.daiVanStart && age < p.daiVanStart + 10);
  };
  const row = (c: Chart, tone: string) => {
    const segs: { name: string; from: number; to: number }[] = [];
    years.forEach((y) => {
      const p = palaceAt(c, y);
      const name = p?.name ?? "—";
      const last = segs[segs.length - 1];
      if (last && last.name === name) last.to = y;
      else segs.push({ name, from: y, to: y });
    });
    return (
      <div className="flex h-11 gap-0.5">
        {segs.map((s) => (
          <div
            key={s.from}
            className={`flex min-w-0 items-center justify-center rounded-md border px-1 text-[11.5px] ${tone}`}
            style={{ flex: s.to - s.from + 1 }}
            title={`${s.from}–${s.to}: đại vận ${s.name}`}
          >
            <span className="truncate">{s.name}</span>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="eyebrow">Trục đại vận chồng theo năm · 2026–2046</span>
        <span className="text-xs text-cream-mute">Ghép theo năm dương lịch, không theo tuổi</span>
      </div>
      <div className="mt-5 space-y-2">
        <div className="text-xs text-cream-dim">{a.input.name || "Người thứ nhất"}</div>
        {row(a, "border-gold-400/30 bg-gold-400/[0.08] text-gold-200")}
        <div className="pt-2 text-xs text-cream-dim">{b.input.name || "Người thứ hai"}</div>
        {row(b, "border-rose/30 bg-rose/[0.08] text-rose")}
        <div className="flex justify-between pt-1 font-mono text-[10.5px] text-cream-mute">
          <span>2026</span>
          <span>2031</span>
          <span>2036</span>
          <span>2041</span>
          <span>2046</span>
        </div>
      </div>
    </div>
  );
}

export function TinhDuyenClient() {
  const [a, setA] = useState(base({ name: "Minh", gender: "nam", day: 21, month: 6, year: 1993, hour: 6 }));
  const [b, setB] = useState(base({ name: "Lan", gender: "nu", day: 9, month: 11, year: 1995, hour: 3 }));
  const [agree, setAgree] = useState(false);
  const [shown, setShown] = useState(false);
  const ca = buildChart(a);
  const cb = buildChart(b);

  return (
    <div>
      <div className="glass-strong rounded-3xl p-5 sm:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <PersonForm label="Người thứ nhất" value={a} onChange={setA} />
          <PersonForm label="Người thứ hai" value={b} onChange={setB} />
        </div>
        <label className="mt-6 flex items-start gap-3 text-[13px] leading-relaxed text-cream-dim">
          <input type="checkbox" className="mt-0.5 size-4 accent-[#e7c07a]" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          Tôi đồng ý với Điều khoản và Chính sách dữ liệu, và đã được người còn lại đồng ý cho dùng ngày giờ sinh của họ.
        </label>
        <button
          className="btn btn-primary btn-lg mt-5 w-full md:w-auto"
          onClick={() => agree && ca && cb && setShown(true)}
          aria-disabled={!agree || !ca || !cb}
        >
          Xem bản đối chiếu miễn phí <ArrowRight size={18} />
        </button>
        {(!ca || !cb) && <p className="mt-2 text-sm text-ember">Ngày sinh chưa hợp lệ.</p>}
      </div>

      {shown && ca && cb && (
        <div id="ket-qua" className="mt-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-jade" />
            <span className="font-mono text-[11px] tracking-wider text-cream-dim uppercase">Bản xem thử · miễn phí · không cần đăng nhập</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Portrait c={ca} who="Người thứ nhất" />
            <Portrait c={cb} who="Người thứ hai" />
          </div>
          <DualTimeline a={ca} b={cb} />
          <div className="relative overflow-hidden rounded-2xl">
            <div className="locked-blur grid gap-4 md:grid-cols-3">
              {["Chỗ giống nhau", "Chỗ khác nhau", "Việc làm được ngay tuần này"].map((t) => (
                <div key={t} className="card p-5">
                  <div className="font-serif text-lg text-cream">{t}</div>
                  <p className="mt-2 text-sm text-cream-dim">
                    Hai lá số cùng có điểm nhấn ở trục Quan Lộc – Phu Thê, nên công việc và chuyện hai người hay đan vào nhau…
                  </p>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 grid place-items-center bg-ink-950/40 p-4">
              <div className="glass-strong max-w-lg rounded-2xl p-6 text-center">
                <Lock size={18} className="mx-auto text-gold-400" />
                <div className="mt-3 font-serif text-xl text-cream">Đọc trọn 6 phần của bản đối chiếu</div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  {addons.tinhDuyen.map((t) => (
                    <Link key={t.code} href={`/thanh-toan/TD7K2Q9M?plan=${t.code}`} className="rounded-xl border border-[var(--line-strong)] p-3 hover:border-gold-400/50">
                      <div className="text-cream-dim">{t.name}</div>
                      <div className="mt-1 font-serif text-lg text-gold-300">{vnd(t.price)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
