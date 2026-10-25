"use client";

import Link from "next/link";
import { useState } from "react";
import { Coins, FileText, Plus, Receipt, Settings, Star, Trash2, Wallet } from "lucide-react";
import { SAMPLE_ID } from "@/lib/tuvi/codec";
import { addons, vnd } from "@/lib/site";

const TABS = [
  { id: "la-so", label: "Lá số của tôi", icon: Star },
  { id: "goi", label: "Gói & lượt hỏi", icon: FileText },
  { id: "vi", label: "Ví xu", icon: Wallet },
  { id: "don", label: "Đơn hàng", icon: Receipt },
  { id: "cai-dat", label: "Cài đặt", icon: Settings },
] as const;

const charts = [
  { id: SAMPLE_ID, name: "Lá số mẫu", meta: "Nữ · 12/03/1994 · giờ Thìn", plan: "Chuyên sâu", used: 37, quota: 1000 },
  { id: SAMPLE_ID, name: "Bố", meta: "Nam · 02/09/1962 · giờ Dần", plan: "Miễn phí", used: 0, quota: 0 },
  { id: SAMPLE_ID, name: "Mẹ", meta: "Nữ · âm 15/7/1965 · giờ Mão", plan: "Miễn phí", used: 0, quota: 0 },
];

const ledger = [
  { at: "24/10/2026 09:12", delta: +100, reason: "Nạp xu · VietQR", ref: "TD8PZ3QA", bal: 152 },
  { at: "20/10/2026 21:40", delta: -29, reason: "Nạp lẻ 20 lượt hỏi · Lá số mẫu", ref: "QA-20", bal: 52 },
  { at: "01/10/2026 07:00", delta: -89, reason: "Gia hạn Lịch vận hạn · tháng 10", ref: "LVH", bal: 81 },
  { at: "28/09/2026 18:05", delta: +170, reason: "Phần dư chuyển khoản đơn TD5MXR2K", ref: "TD5MXR2K", bal: 170 },
];

const orders = [
  { code: "TD8PZ3QA", item: "Nạp 100 xu", amount: 100_000, status: "paid", at: "24/10/2026" },
  { code: "TD5MXR2K", item: "Gói Chuyên sâu", amount: 469_000, status: "paid", at: "28/09/2026" },
  { code: "TD3WQE7H", item: "Gói Cơ bản", amount: 129_000, status: "expired", at: "27/09/2026" },
];

const STATUS: Record<string, [string, string]> = {
  paid: ["Đã thanh toán", "text-jade bg-jade/10"],
  pending: ["Chờ chuyển khoản", "text-gold-300 bg-gold-400/10"],
  expired: ["Hết hạn", "text-cream-mute bg-white/5"],
  manual: ["Xử lý tay", "text-ember bg-ember/10"],
};

export function AccountClient() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("la-so");
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
      <nav className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0" aria-label="Tài khoản">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition ${
              tab === t.id ? "bg-gold-400/10 text-gold-200 ring-1 ring-gold-400/40" : "text-cream-dim hover:bg-white/[0.04] hover:text-cream"
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </nav>

      <div className="min-w-0">
        {tab === "la-so" && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {charts.map((c, i) => (
              <Link key={i} href={`/la-so?id=${c.id}`} className="card group p-5 transition hover:bg-white/[0.045]">
                <div className="flex items-center justify-between">
                  <span className={`chip text-[11px] ${c.plan === "Miễn phí" ? "text-cream-dim" : "text-gold-300"}`}>{c.plan}</span>
                  <span className="font-mono text-[10.5px] text-cream-mute">engine 0.1.0</span>
                </div>
                <div className="mt-4 font-serif text-2xl text-cream group-hover:text-gold-200">{c.name}</div>
                <div className="mt-1 text-sm text-cream-dim">{c.meta}</div>
                {c.quota > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between font-mono text-[11px] text-cream-mute">
                      <span>Lượt hỏi</span>
                      <span>
                        {c.quota - c.used}/{c.quota.toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-gold-400" style={{ width: `${((c.quota - c.used) / c.quota) * 100}%` }} />
                    </div>
                  </div>
                )}
              </Link>
            ))}
            <Link href="/lap-la-so" className="grid min-h-[160px] place-items-center rounded-2xl border border-dashed border-[var(--line-strong)] text-cream-dim hover:text-cream">
              <span className="flex items-center gap-2">
                <Plus size={18} /> Lập lá số mới
              </span>
            </Link>
          </div>
        )}

        {tab === "goi" && (
          <div className="card divide-y divide-[var(--line)]">
            {charts.map((c, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="text-cream">{c.name}</div>
                  <div className="text-sm text-cream-dim">
                    {c.plan}
                    {c.quota ? ` · còn ${c.quota - c.used} lượt hỏi · podcast đã sinh` : " · luận cung Mệnh, audio mở đầu, PDF"}
                  </div>
                </div>
                <div className="flex gap-2">
                  {c.quota > 0 && (
                    <Link href="/thanh-toan?order=TD7K2Q9M&plan=xu-50" className="btn btn-secondary btn-sm">
                      Nạp lẻ lượt hỏi
                    </Link>
                  )}
                  <Link href="/bang-gia" className="btn btn-primary btn-sm">
                    {c.quota ? "Nâng cấp" : "Mở khóa"}
                  </Link>
                </div>
              </div>
            ))}
            <p className="p-5 text-xs text-cream-mute">Nâng cấp gói chỉ trả phần chênh lệch và chỉ cộng phần quyền lợi còn thiếu.</p>
          </div>
        )}

        {tab === "vi" && (
          <div className="space-y-4">
            <div className="glass-strong flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
              <div>
                <div className="flex items-center gap-2 text-gold-300">
                  <Coins size={16} />
                  <span className="eyebrow">Số dư</span>
                </div>
                <div className="mt-2 font-serif text-5xl text-cream">
                  152 <span className="text-xl text-cream-dim">xu</span>
                </div>
                <div className="font-mono text-[11px] text-cream-mute">≈ 152.000đ · không hết hạn</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {addons.xuPacks.map((x) => (
                  <Link key={x} href={`/thanh-toan?order=TD7K2Q9M&plan=xu-${x}`} className="btn btn-secondary btn-sm">
                    +{x} xu
                  </Link>
                ))}
              </div>
            </div>
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="text-left text-[11px] tracking-wider text-cream-mute uppercase">
                  <tr className="border-b border-[var(--line)]">
                    <th className="px-5 py-3 font-medium">Thời gian</th>
                    <th className="px-5 py-3 font-medium">Nội dung</th>
                    <th className="px-5 py-3 text-right font-medium">Biến động</th>
                    <th className="px-5 py-3 text-right font-medium">Số dư</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((l) => (
                    <tr key={l.at} className="border-b border-[var(--line)] last:border-0">
                      <td className="px-5 py-3 font-mono text-[12.5px] text-cream-dim">{l.at}</td>
                      <td className="px-5 py-3 text-cream">
                        {l.reason} <span className="font-mono text-[11px] text-cream-mute">{l.ref}</span>
                      </td>
                      <td className={`px-5 py-3 text-right font-mono ${l.delta > 0 ? "text-jade" : "text-cream"}`}>
                        {l.delta > 0 ? "+" : ""}
                        {l.delta}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-cream-dim">{l.bal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "don" && (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="text-left text-[11px] tracking-wider text-cream-mute uppercase">
                <tr className="border-b border-[var(--line)]">
                  <th className="px-5 py-3 font-medium">Mã đơn</th>
                  <th className="px-5 py-3 font-medium">Nội dung</th>
                  <th className="px-5 py-3 font-medium">Ngày</th>
                  <th className="px-5 py-3 text-right font-medium">Số tiền</th>
                  <th className="px-5 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.code} className="border-b border-[var(--line)] last:border-0">
                    <td className="px-5 py-3 font-mono text-cream">{o.code}</td>
                    <td className="px-5 py-3 text-cream">{o.item}</td>
                    <td className="px-5 py-3 text-cream-dim">{o.at}</td>
                    <td className="px-5 py-3 text-right font-mono text-cream">{vnd(o.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11.5px] ${STATUS[o.status][1]}`}>{STATUS[o.status][0]}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {o.status === "paid" && <button className="text-[12.5px] text-gold-300 hover:underline">Yêu cầu hóa đơn</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "cai-dat" && (
          <div className="space-y-4">
            <div className="card p-6">
              <div className="eyebrow">Tài khoản</div>
              <div className="mt-3 text-cream">minhanh@gmail.com</div>
              <div className="text-sm text-cream-dim">Đăng nhập bằng Google</div>
            </div>
            <div className="card border-ember/25 p-6">
              <div className="eyebrow !text-ember">Dữ liệu cá nhân</div>
              <p className="mt-3 text-sm leading-relaxed text-cream-dim">
                Xóa lá số sẽ xóa ngày giờ sinh, bài luận, audio, PDF và lịch sử hỏi đáp của lá đó. Xóa tài khoản xóa toàn bộ dữ liệu; xu chưa
                tiêu không được hoàn sau khi xóa.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button className="btn btn-secondary btn-sm">
                  <Trash2 size={14} /> Xóa một lá số
                </button>
                <button className="btn btn-sm border border-ember/40 text-ember hover:bg-ember/10">
                  <Trash2 size={14} /> Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
