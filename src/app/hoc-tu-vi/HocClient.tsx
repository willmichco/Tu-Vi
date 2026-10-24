"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import type { Article } from "@/content/articles";
import { ELEMENT_COLOR } from "@/components/chart/starStyle";
import { ELEMENT_LABEL, type Element } from "@/lib/tuvi/constants";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

export function HocClient({
  articles,
  stars,
  palaces,
}: {
  articles: Article[];
  stars: { name: string; element: Element; desc: string }[];
  palaces: { name: string; desc: string }[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const cats = [...new Set(articles.map((a) => a.category))];
  const nq = norm(q.trim());
  const fa = useMemo(
    () => articles.filter((a) => (!cat || a.category === cat) && (!nq || norm(a.title + " " + a.excerpt).includes(nq))),
    [articles, cat, nq],
  );
  const fs = stars.filter((s) => !nq || norm(s.name + s.desc).includes(nq));
  const fp = palaces.filter((p) => !nq || norm(p.name + p.desc).includes(nq));

  return (
    <div>
      <div className="relative max-w-xl">
        <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-cream-mute" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input !h-14 !pl-11 text-base"
          placeholder="Tìm bài viết, sao, cung… (gõ không dấu cũng được)"
          aria-label="Tìm kiếm"
        />
      </div>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-2xl text-cream">Bài viết ({fa.length})</h2>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setCat(null)} className={`chip ${!cat ? "border-gold-400/60 text-gold-200" : "text-cream-dim"}`}>
              Tất cả
            </button>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`chip ${cat === c ? "border-gold-400/60 text-gold-200" : "text-cream-dim"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fa.map((a) => (
            <Link key={a.slug} href={`/bai-viet/${a.slug}`} className="group card flex flex-col p-6 transition hover:bg-white/[0.045]">
              <div className="font-mono text-[10.5px] tracking-wider text-gold-500 uppercase">{a.category}</div>
              <div className="mt-2 font-serif text-xl leading-snug text-cream group-hover:text-gold-200">{a.title}</div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-cream-dim">{a.excerpt}</p>
              <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-cream-mute">
                <span>{a.minutes} phút đọc</span>
                <ArrowRight size={14} className="transition group-hover:translate-x-1 group-hover:text-gold-300" />
              </div>
            </Link>
          ))}
          {!fa.length && <p className="text-cream-dim">Chưa có bài phù hợp.</p>}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-cream">Từ điển · 14 chính tinh</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fs.map((s) => (
            <div key={s.name} className="card p-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg" style={{ color: ELEMENT_COLOR[s.element] }}>
                  {s.name}
                </span>
                <span className="font-mono text-[10.5px] text-cream-mute">{ELEMENT_LABEL[s.element]}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-cream-dim">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-cream">Từ điển · 12 cung</h2>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {fp.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4 rounded-xl border border-[var(--line)] px-4 py-3">
              <span className="font-mono text-[11px] text-gold-500">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="text-[15px] text-cream">{p.name}</div>
                <div className="text-[13px] text-cream-dim">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
