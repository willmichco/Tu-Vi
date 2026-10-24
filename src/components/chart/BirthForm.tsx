"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Info, Moon, Sun } from "lucide-react";
import { HOURS } from "@/lib/tuvi/constants";
import { buildChart, type BirthInput, type Chart } from "@/lib/tuvi/engine";
import { encodeChartId } from "@/lib/tuvi/codec";
import { canChiYear, leapMonthOf, lunarMonthLength, lunarToSolar, solarToLunar, weekday } from "@/lib/lunar";

const THIS_YEAR = 2026;
const YEARS = Array.from({ length: THIS_YEAR - 1930 + 1 }, (_, i) => THIS_YEAR - i);
const VIEW_YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

type Variant = "full" | "hero";

export function BirthForm({
  variant = "full",
  onPreview,
}: {
  variant?: Variant;
  onPreview?: (chart: Chart | null) => void;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"nam" | "nu">("nu");
  const [calendar, setCalendar] = useState<"duong" | "am">(params.get("lunar") === "1" ? "am" : "duong");
  const [day, setDay] = useState(Number(params.get("d")) || 15);
  const [month, setMonth] = useState(Number(params.get("m")) || 8);
  const [year, setYear] = useState(Number(params.get("y")) || 1995);
  const [leap, setLeap] = useState(params.get("leap") === "1");
  const [hour, setHour] = useState<number | null | undefined>(undefined);
  const [lateTy, setLateTy] = useState(false);
  const [south, setSouth] = useState(false);
  const [viewYear, setViewYear] = useState(THIS_YEAR);
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState(false);

  const leapMonth = calendar === "am" ? leapMonthOf(year) : 0;
  const canLeap = calendar === "am" && leapMonth === month;
  const tz = south && year >= 1968 && year <= 1975 ? 8 : 7;

  useEffect(() => {
    if (!canLeap && leap) setLeap(false);
  }, [canLeap, leap]);

  const input: BirthInput = {
    name: name.trim(),
    gender,
    calendar,
    day,
    month,
    year,
    leap: canLeap && leap,
    hour: hour === undefined ? 4 : hour,
    lateTy: hour === 0 && lateTy,
    tz,
    viewYear,
  };

  const error = useMemo(() => {
    if (calendar === "am") {
      const len = lunarMonthLength(month, year, canLeap && leap, tz);
      if (day > len) return `Tháng ${month}${leap ? " nhuận" : ""} âm năm ${canChiYear(year).label} chỉ có ${len} ngày.`;
    } else {
      const dim = new Date(year, month, 0).getDate();
      if (day > dim) return `Tháng ${month}/${year} chỉ có ${dim} ngày.`;
    }
    return null;
  }, [calendar, day, month, year, leap, canLeap, tz]);

  const inputKey = JSON.stringify(input);
  // Ngày sinh thật (trước khi dời ngày vì giờ Tý muộn) để hiển thị đúng điều người dùng vừa nhập
  const birthSolar = calendar === "am" && !error ? lunarToSolar(day, month, year, canLeap && leap, tz) : null;
  const birthLunar = calendar === "duong" && !error ? solarToLunar(day, month, year, tz) : null;
  const chart = useMemo(() => (error ? null : buildChart(JSON.parse(inputKey) as BirthInput)), [error, inputKey]);

  useEffect(() => {
    onPreview?.(chart);
  }, [chart, onPreview]);

  const hourMissing = hour === undefined;
  const canSubmit = !error && !hourMissing && agree && chart;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    router.push(`/la-so/${encodeChartId(input)}`);
  }

  const isHero = variant === "hero";

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {!isHero && (
        <div>
          <label htmlFor="ten" className="mb-2 block text-sm text-cream-dim">
            Tên lá số <span className="text-cream-mute">(không bắt buộc — để bài luận gọi đúng tên)</span>
          </label>
          <input id="ten" className="input" placeholder="Ví dụ: Minh Anh" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-2 text-sm text-cream-dim">Giới tính</div>
          <div className="seg grid-cols-2" role="group" aria-label="Giới tính">
            <button type="button" aria-pressed={gender === "nam"} onClick={() => setGender("nam")}>
              Nam
            </button>
            <button type="button" aria-pressed={gender === "nu"} onClick={() => setGender("nu")}>
              Nữ
            </button>
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm text-cream-dim">Lịch ngày sinh</div>
          <div className="seg grid-cols-2" role="group" aria-label="Loại lịch">
            <button type="button" aria-pressed={calendar === "duong"} onClick={() => setCalendar("duong")}>
              <span className="inline-flex items-center gap-1.5">
                <Sun size={14} /> Dương
              </span>
            </button>
            <button type="button" aria-pressed={calendar === "am"} onClick={() => setCalendar("am")}>
              <span className="inline-flex items-center gap-1.5">
                <Moon size={14} /> Âm
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[0.9fr_1.3fr_1.2fr] gap-2 sm:gap-3 [&_select]:pr-8 [&_select]:pl-3 sm:[&_select]:pl-4">
        <div>
          <label htmlFor="ngay" className="mb-2 block text-sm text-cream-dim">
            Ngày
          </label>
          <select id="ngay" className="input" value={day} onChange={(e) => setDay(Number(e.target.value))}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {String(d).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="thang" className="mb-2 block text-sm text-cream-dim">
            Tháng
          </label>
          <select id="thang" className="input" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                Tháng {m}
                {calendar === "am" && m === leapMonth ? " (có nhuận)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nam" className="mb-2 block text-sm text-cream-dim">
            Năm
          </label>
          <select id="nam" className="input" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {canLeap && (
        <label className="flex items-center gap-3 rounded-xl border border-silver/25 bg-silver/[0.06] px-4 py-3 text-sm">
          <input type="checkbox" className="size-4 accent-[#b9c1ff]" checked={leap} onChange={(e) => setLeap(e.target.checked)} />
          <span>
            Sinh vào <b className="font-medium text-silver">tháng {month} nhuận</b> năm {canChiYear(year).label}
          </span>
        </label>
      )}

      {year >= 1968 && year <= 1975 && (
        <label className="flex items-start gap-3 rounded-xl border border-[var(--line)] px-4 py-3 text-sm text-cream-dim">
          <input type="checkbox" className="mt-0.5 size-4 accent-[#e7c07a]" checked={south} onChange={(e) => setSouth(e.target.checked)} />
          <span>
            Sinh ở miền Nam trước 1975? <span className="text-cream-mute">Khi đó miền Nam dùng lịch UTC+8, một số ngày âm lệch 1 ngày.</span>
          </span>
        </label>
      )}

      <fieldset>
        <legend className="mb-2 flex w-full items-center justify-between text-sm text-cream-dim">
          <span>Giờ sinh</span>
          {touched && hourMissing && <span className="text-ember">Chọn giờ sinh hoặc “Không nhớ giờ”</span>}
        </legend>
        {isHero ? (
          <select
            aria-label="Giờ sinh"
            className="input"
            value={hour === undefined ? "" : hour === null ? "x" : String(hour)}
            onChange={(e) => setHour(e.target.value === "" ? undefined : e.target.value === "x" ? null : Number(e.target.value))}
          >
            <option value="">Chọn giờ sinh</option>
            {HOURS.map((h) => (
              <option key={h.value} value={h.value}>
                Giờ {h.label} ({h.range})
              </option>
            ))}
            <option value="x">Không nhớ giờ sinh</option>
          </select>
        ) : (
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
            {HOURS.map((h) => (
              <button
                key={h.value}
                type="button"
                aria-pressed={hour === h.value}
                onClick={() => setHour(h.value)}
                className={`rounded-xl border px-1 py-2 text-center transition ${
                  hour === h.value
                    ? "border-gold-400/70 bg-gold-400/15 text-gold-200"
                    : "border-[var(--line-strong)] bg-white/[0.02] text-cream hover:bg-white/[0.05]"
                }`}
              >
                <div className="text-sm font-medium">{h.label}</div>
                <div className="font-mono text-[10px] text-cream-mute">{h.range}</div>
              </button>
            ))}
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 empty:hidden">
          {!isHero && (
          <button
            type="button"
            aria-pressed={hour === null}
            onClick={() => setHour(null)}
            className={`chip ${hour === null ? "border-gold-400/60 text-gold-200" : "text-cream-dim"}`}
          >
            Không nhớ giờ sinh
          </button>
          )}
          {hour === 0 && (
            <div className="seg grid-cols-2 text-xs">
              <button type="button" aria-pressed={!lateTy} onClick={() => setLateTy(false)} className="!h-8 px-3 !text-xs">
                Tý sớm 0–1h
              </button>
              <button type="button" aria-pressed={lateTy} onClick={() => setLateTy(true)} className="!h-8 px-3 !text-xs">
                Tý muộn 23–24h
              </button>
            </div>
          )}
        </div>
        {hour === null && (
          <p className="mt-2 flex gap-2 text-xs leading-relaxed text-cream-dim">
            <Info size={14} className="mt-0.5 shrink-0 text-gold-400" />
            Không có giờ sinh, vị trí cung Mệnh, Thân và các sao an theo giờ sẽ chưa chính xác. Lá số vẫn lập được để bạn tham
            khảo phần an theo năm, tháng, ngày.
          </p>
        )}
      </fieldset>

      {!isHero && (
        <div>
          <label htmlFor="namxem" className="mb-2 block text-sm text-cream-dim">
            Năm xem hạn
          </label>
          <select id="namxem" className="input max-w-[200px]" value={viewYear} onChange={(e) => setViewYear(Number(e.target.value))}>
            {VIEW_YEARS.map((y) => (
              <option key={y} value={y}>
                {y} · {canChiYear(y).label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Đổi lịch tức thì */}
      <div
        aria-live="polite"
        className={`rounded-xl border px-4 py-3 text-sm ${error ? "border-ember/40 bg-ember/[0.06]" : "border-jade/20 bg-jade/[0.04]"}`}
      >
        {error ? (
          <span className="text-ember">{error}</span>
        ) : chart ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-mono text-[11px] tracking-wider text-jade uppercase">Đã đổi lịch</span>
            {birthLunar ? (
              <span className="text-cream/90">
                Âm lịch: <b className="font-medium">{birthLunar.day}/{birthLunar.month}{birthLunar.leap ? " nhuận" : ""}</b> năm{" "}
                <b className="font-medium">{canChiYear(birthLunar.year).label}</b>
              </span>
            ) : (
              birthSolar && (
                <span className="text-cream/90">
                  Dương lịch: <b className="font-medium">{weekday(birthSolar.day, birthSolar.month, birthSolar.year)}, {birthSolar.day}/{birthSolar.month}/{birthSolar.year}</b>
                </span>
              )
            )}
            {input.lateTy && (
              <span className="w-full text-xs text-silver">
                Giờ Tý muộn: an sao theo ngày hôm sau ({chart.lunar.day}/{chart.lunar.month}{chart.lunar.leap ? " nhuận" : ""} âm).
              </span>
            )}
            <span className="text-cream-dim">
              {chart.labels.amDuong} · {chart.labels.banMenh}
            </span>
          </div>
        ) : null}
      </div>

      <label className="flex items-start gap-3 text-[13px] leading-relaxed text-cream-dim">
        <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[#e7c07a]" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>
          Tôi đồng ý với{" "}
          <Link href="/dieu-khoan" className="text-gold-300 underline-offset-4 hover:underline">
            Điều khoản
          </Link>
          ,{" "}
          <Link href="/chinh-sach-du-lieu" className="text-gold-300 underline-offset-4 hover:underline">
            Chính sách dữ liệu
          </Link>{" "}
          và{" "}
          <Link href="/tuyen-bo-ai" className="text-gold-300 underline-offset-4 hover:underline">
            Tuyên bố AI
          </Link>
          . Nếu lập lá cho người khác, tôi đã được họ đồng ý.
        </span>
      </label>
      {touched && !agree && <p className="-mt-3 text-xs text-ember">Vui lòng đánh dấu đồng ý để lập lá số.</p>}

      <button type="submit" className={`btn btn-primary btn-lg w-full ${canSubmit ? "" : "opacity-80"}`}>
        An sao lập lá số <ArrowRight size={18} />
      </button>
      <p className="text-center text-xs text-cream-mute">Miễn phí · không cần đăng nhập · lá số hiện ngay, tính tại máy của bạn</p>
    </form>
  );
}
