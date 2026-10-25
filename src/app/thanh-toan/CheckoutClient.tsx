"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, CheckCircle2, Copy, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { orderItem } from "@/lib/orders";
import { site, vnd } from "@/lib/site";

const STEPS = ["Tạo đơn", "Chờ chuyển khoản", "Đã nhận tiền", "Kích hoạt"];

function CopyRow({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-3 last:border-0">
      <div className="min-w-0">
        <div className="text-[11.5px] text-cream-mute">{label}</div>
        <div className={`truncate text-[15px] text-cream ${mono ? "font-mono" : ""}`}>{value}</div>
      </div>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setOk(true);
            setTimeout(() => setOk(false), 1500);
          } catch {
            /* trình duyệt chặn clipboard */
          }
        }}
        className="btn btn-secondary btn-sm shrink-0"
        aria-label={`Sao chép ${label}`}
      >
        {ok ? <Check size={14} className="text-jade" /> : <Copy size={14} />} {ok ? "Đã chép" : "Chép"}
      </button>
    </div>
  );
}

export function CheckoutClient() {
  const params = useSearchParams();
  const orderId = (params.get("order") ?? "TD7K2Q9M").toUpperCase().slice(0, 12);
  const item = orderItem(params.get("plan"));
  const chart = params.get("chart") ?? "mau";
  const [qr, setQr] = useState("");
  const [left, setLeft] = useState(30 * 60);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Bản thiết kế: chuỗi QR minh họa, chưa gắn tài khoản thật. Production: chuỗi VietQR (EMVCo) do server tạo.
    QRCode.toString(`DEMO-VIETQR|${orderId}|${item.amount}`, { type: "svg", margin: 0, color: { dark: "#05050aff", light: "#00000000" } }).then(setQr);
  }, [orderId, item.amount]);

  useEffect(() => {
    if (step >= 2) return;
    const t = setInterval(() => setLeft((v) => Math.max(v - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const simulate = () => {
    setStep(2);
    setTimeout(() => setStep(3), 1400);
  };

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
      <div className="glass-strong min-w-0 rounded-3xl p-5 sm:p-8">
        {/* Các bước */}
        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => {
            const done = i < step || step === 3;
            const active = i === step && step < 3;
            return (
              <li key={s} className="flex flex-col gap-2">
                <div className={`h-1 rounded-full ${done ? "bg-jade" : active ? "bg-gold-400" : "bg-white/10"}`} />
                <span className={`text-[11px] sm:text-xs ${done ? "text-jade" : active ? "text-gold-300" : "text-cream-mute"}`}>{s}</span>
              </li>
            );
          })}
        </ol>

        {step < 3 ? (
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-[240px_1fr] sm:items-center">
            <div className="mx-auto w-full max-w-[240px]">
              <div className="relative rounded-2xl bg-[#f6f1e6] p-4 shadow-[0_20px_60px_-20px_rgb(231_192_122/0.45)]">
                <div className="aspect-square w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} />
                {step === 2 && (
                  <div className="absolute inset-0 grid place-items-center rounded-2xl bg-ink-950/70 backdrop-blur-sm">
                    <Loader2 className="animate-spin text-gold-300" size={28} />
                  </div>
                )}
              </div>
              <div className="mt-2 text-center font-mono text-[10.5px] text-cream-mute">QR minh họa · bản thiết kế</div>
            </div>
            <div className="min-w-0">
              <div className="text-sm text-cream-dim">Quét bằng app ngân hàng bất kỳ</div>
              <div className="mt-1 font-serif text-4xl text-gold-gradient">{vnd(item.amount)}</div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-3 py-1 font-mono text-[12px] text-cream-dim">
                {step === 2 ? (
                  <>
                    <Loader2 size={12} className="animate-spin text-gold-300" /> Đã nhận báo có, đang kích hoạt…
                  </>
                ) : (
                  <>
                    Mã hết hạn sau <span className={left < 300 ? "text-ember" : "text-cream"}>{mm}:{ss}</span>
                  </>
                )}
              </div>
              <div className="mt-5">
                <CopyRow label="Số tài khoản" value={site.business.bank} mono={false} />
                <CopyRow label="Số tiền" value={String(item.amount)} />
                <CopyRow label="Nội dung chuyển khoản (bắt buộc đúng)" value={orderId} />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <CheckCircle2 size={48} className="mx-auto text-jade" />
            <h2 className="mt-4 font-serif text-3xl text-cream">Đã kích hoạt {item.name}</h2>
            <p className="mx-auto mt-2 max-w-md text-cream-dim">Biên nhận đã gửi qua email. Nội dung của lá số được mở khóa ngay bây giờ.</p>
            <Link href={`/la-so?id=${chart}&plan=chuyen-sau&tab=luan-giai`} className="btn btn-primary btn-lg mt-8">
              <Sparkles size={18} /> Mở lá số đã mở khóa
            </Link>
          </div>
        )}

        {step < 2 && (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--line-strong)] p-4 text-xs text-cream-mute">
            Trang tự chuyển khi nhận tiền (Supabase Realtime). Bản thiết kế:{" "}
            <button onClick={simulate} className="text-gold-300 underline-offset-4 hover:underline">
              giả lập ngân hàng báo có
            </button>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="card p-6">
          <div className="eyebrow">Đơn hàng</div>
          <div className="mt-3 flex items-baseline justify-between gap-3">
            <span className="font-serif text-xl text-cream">{item.name}</span>
            <span className="font-mono text-cream">{vnd(item.amount)}</span>
          </div>
          <div className="mt-1 text-sm text-cream-dim">{item.note}</div>
          <div className="hairline my-4" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-cream-mute">Mã đơn</dt>
              <dd className="font-mono text-cream">{orderId}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cream-mute">Lá số</dt>
              <dd className="text-cream">{chart === "mau" ? "Lá số mẫu" : "Lá của bạn"}</dd>
            </div>
          </dl>
        </div>
        <div className="card space-y-3 p-6 text-sm text-cream-dim">
          <div className="flex gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-jade" />
            Chuyển dư: phần dư cộng vào ví xu. Chuyển thiếu hoặc sai nội dung: đơn chuyển xử lý tay, chúng tôi liên hệ lại.
          </div>
          <div className="flex gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-jade" />
            <span>
              Hoàn 100% nếu chưa dùng lượt nào và báo trong 7 ngày.{" "}
              <Link href="/hoan-tien" className="text-gold-300 hover:underline">
                Chi tiết
              </Link>
            </span>
          </div>
          <div className="flex gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-jade" />
            Tài khoản nhận tiền đứng tên {site.business.legalName}. Có xuất hóa đơn điện tử.
          </div>
        </div>
      </aside>
    </div>
  );
}
