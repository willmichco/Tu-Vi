"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Box, CalendarRange, Download, Grid3x3, Headphones, MessagesSquare, Save, Share2, Sparkles } from "lucide-react";
import { Chart2D } from "@/components/chart/Chart2D";
import { Chart3DLazy } from "@/components/chart/Chart3DLazy";
import { decodeChartId, encodeChartId } from "@/lib/tuvi/codec";
import { buildChart } from "@/lib/tuvi/engine";
import { BASE_PATH } from "@/lib/site";
import type { PalaceName } from "@/lib/tuvi/constants";
import { AudioTab } from "./AudioTab";
import { PalaceInspector } from "./PalaceInspector";
import { QaTab } from "./QaTab";
import { ReadingTab } from "./ReadingTab";
import { VanHanTab } from "./VanHanTab";

const TABS = [
  { id: "3d", label: "3D", icon: Box },
  { id: "2d", label: "2D", icon: Grid3x3 },
  { id: "luan-giai", label: "Luận giải", icon: BookOpen },
  { id: "van-han", label: "Vận hạn", icon: CalendarRange },
  { id: "hoi-dap", label: "Hỏi đáp", icon: MessagesSquare },
  { id: "audio", label: "Audio", icon: Headphones },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ChartView() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const decoded = useMemo(() => decodeChartId(id), [id]);
  const [viewYear, setViewYear] = useState(decoded?.viewYear ?? 2026);
  const input = useMemo(() => (decoded ? { ...decoded, viewYear } : null), [decoded, viewYear]);
  const chart = useMemo(() => (input ? buildChart(input) : null), [input]);
  const [tab, setTab] = useState<TabId>((params.get("tab") as TabId) || "3d");
  const [selected, setSelected] = useState<number>(chart?.menhChi ?? 0);
  const [palace, setPalace] = useState<PalaceName>("Mệnh");
  const [showLuu, setShowLuu] = useState(false);
  const [shared, setShared] = useState(false);
  const unlocked = params.get("plan") === "chuyen-sau";

  useEffect(() => {
    const t = params.get("tab") as TabId | null;
    if (t && t !== tab) setTab(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  if (!chart || !input) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-serif text-3xl text-cream">Không đọc được lá số này</h1>
        <p className="mt-3 text-cream-dim">Đường dẫn có thể đã hỏng. Bạn lập lại lá số nhé — chỉ mất 30 giây.</p>
        <Link href="/lap-la-so" className="btn btn-primary mt-8">
          Lập lá số
        </Link>
      </div>
    );
  }

  const go = (t: TabId) => {
    setTab(t);
    const q = new URLSearchParams(params.toString());
    q.set("tab", t);
    router.replace(`?${q.toString()}`, { scroll: false });
    if (typeof window !== "undefined" && window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const readPalace = (chi: number) => {
    setPalace(chart.palaces[chi].name);
    go("luan-giai");
  };

  const share = async () => {
    const url = `${window.location.origin}${BASE_PATH}/la-so?id=${encodeChartId(input)}`;
    try {
      if (navigator.share) await navigator.share({ title: `Lá số ${input.name}`, url });
      else await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      /* người dùng hủy chia sẻ */
    }
  };

  const l = chart.labels;
  const hourLabel = input.hour === null ? "chưa rõ giờ" : `giờ ${l.hour}`;

  return (
    <div className="pb-28 lg:pb-12">
      {/* Đầu trang lá số */}
      <div className="border-b border-[var(--line)] bg-ink-900/60">
        <div className="container-x flex flex-col gap-4 py-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="eyebrow">Lá số tử vi · Nam phái</span>
              <span className="chip !py-0.5 font-mono text-[10px] text-cream-mute">engine {chart.engineVersion}</span>
            </div>
            <h1 className="mt-2 truncate font-serif text-3xl text-cream sm:text-4xl">{input.name || "Lá số của bạn"}</h1>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[12.5px]">
              <span className="chip text-cream-dim">{l.amDuong}</span>
              <span className="chip text-cream-dim">
                {chart.solar.day}/{chart.solar.month}/{chart.solar.year} · {hourLabel}
              </span>
              <span className="chip text-cream-dim">
                Âm {chart.lunar.day}/{chart.lunar.month}
                {chart.lunar.leap ? " nhuận" : ""} {l.year}
              </span>
              <span className="chip text-gold-300">{l.cuc}</span>
              <span className="chip text-cream-dim">{l.banMenh}</span>
            </div>
            {chart.hourUnknown && (
              <p className="mt-2 text-xs text-ember/90">Chưa có giờ sinh: Mệnh, Thân và các sao an theo giờ đang tạm tính theo giờ Tý.</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dang-nhap" className="btn btn-secondary btn-sm">
              <Save size={15} /> Lưu lá số
            </Link>
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              <Download size={15} /> PDF
            </button>
            <button className="btn btn-secondary btn-sm" onClick={share}>
              <Share2 size={15} /> {shared ? "Đã sao chép" : "Chia sẻ"}
            </button>
          </div>
        </div>
        {/* Tabs desktop */}
        <div className="container-x hidden lg:block">
          <div role="tablist" aria-label="Chế độ xem lá số" className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => go(t.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm transition ${
                  tab === t.id ? "text-gold-200" : "text-cream-dim hover:text-cream"
                }`}
              >
                <t.icon size={16} />
                {t.label}
                {tab === t.id && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold-400" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x pt-6">
        {(tab === "3d" || tab === "2d") && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="seg grid-cols-2 lg:hidden" role="group" aria-label="Kiểu lá">
                  <button aria-pressed={tab === "3d"} onClick={() => go("3d")} className="px-4">
                    Bầu trời 3D
                  </button>
                  <button aria-pressed={tab === "2d"} onClick={() => go("2d")} className="px-4">
                    Lá giấy 2D
                  </button>
                </div>
                <p className="hidden text-sm text-cream-dim lg:block">
                  {tab === "3d" ? "Kéo để xoay · chạm một cung để đưa ra chính diện" : "Chạm một cung để xem chi tiết · đường vàng là tam hợp, đường bạc là xung chiếu"}
                </p>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-cream-dim">
                  <input type="checkbox" className="size-4 accent-[#b9c1ff]" checked={showLuu} onChange={(e) => setShowLuu(e.target.checked)} />
                  Sao lưu niên {chart.view.year}
                </label>
              </div>
              {tab === "3d" ? (
                <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-ink-900">
                  <Chart3DLazy
                    chart={chart}
                    selected={selected}
                    onSelect={setSelected}
                    showLuu={showLuu}
                    className="h-[440px] sm:h-[560px] lg:h-[640px]"
                    onFallback={() => go("2d")}
                  />
                  <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-1.5 text-[10.5px]">
                    {[
                      ["#86dcab", "Mộc"],
                      ["#ff9584", "Hỏa"],
                      ["#e7c07a", "Thổ"],
                      ["#ebe8e2", "Kim"],
                      ["#86c9f6", "Thủy"],
                    ].map(([c, n]) => (
                      <span key={n} className="chip bg-ink-950/70 text-cream-dim backdrop-blur">
                        <span className="size-1.5 rounded-full" style={{ background: c }} /> {n}
                      </span>
                    ))}
                    <span className="chip bg-ink-950/70 text-cream-dim backdrop-blur">Sáng = miếu vượng · mờ = hãm</span>
                  </div>
                </div>
              ) : (
                <Chart2D chart={chart} selected={selected} onSelect={setSelected} showLuu={showLuu} />
              )}
            </div>
            <PalaceInspector chart={chart} chi={selected} onSelect={setSelected} onRead={() => readPalace(selected)} unlocked={unlocked} />
          </div>
        )}

        {tab === "luan-giai" && (
          <ReadingTab chart={chart} chartId={id} palace={palace} onPalace={setPalace} unlocked={unlocked} onAudio={() => go("audio")} />
        )}
        {tab === "van-han" && (
          <VanHanTab
            chart={chart}
            chartId={id}
            unlocked={unlocked}
            onViewYear={setViewYear}
            onSelectPalace={(chi) => {
              setSelected(chi);
              go("2d");
            }}
          />
        )}
        {tab === "hoi-dap" && <QaTab chart={chart} chartId={id} unlocked={unlocked} />}
        {tab === "audio" && <AudioTab chartId={id} unlocked={unlocked} />}

        {/* Công tắc trạng thái — chỉ có trong bản thiết kế để duyệt giao diện */}
        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-[var(--line-strong)] px-4 py-3 text-xs text-cream-mute">
          <Sparkles size={14} className="text-gold-400" />
          Bản thiết kế — xem trạng thái:
          <Link replace scroll={false} href={`?tab=${tab}`} className={!unlocked ? "text-gold-300" : "hover:text-cream"}>
            Miễn phí
          </Link>
          ·
          <Link replace scroll={false} href={`?tab=${tab}&plan=chuyen-sau`} className={unlocked ? "text-gold-300" : "hover:text-cream"}>
            Đã mua Chuyên sâu
          </Link>
        </div>
      </div>

      {/* Thanh tab dưới cho mobile */}
      <nav
        data-bottom-nav
        aria-label="Chế độ xem lá số"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-ink-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <div className="grid grid-cols-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              aria-current={tab === t.id}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10.5px] ${tab === t.id ? "text-gold-300" : "text-cream-mute"}`}
            >
              <t.icon size={19} />
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
