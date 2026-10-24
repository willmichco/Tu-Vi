import type { Metadata } from "next";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { LogoMark } from "@/components/layout/Logo";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Đăng nhập", robots: { index: false } };

export default function Page() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 starfield opacity-60" />
      <div className="pointer-events-none absolute top-0 left-1/2 size-[640px] -translate-x-1/2 glow-gold" />
      <div className="container-x relative grid min-h-[72vh] place-items-center py-14">
        <div className="glass-strong w-full max-w-md rounded-3xl p-7 sm:p-9">
          <LogoMark size={36} />
          <h1 className="mt-6 font-serif text-3xl text-cream">Đăng nhập để lưu lá số</h1>
          <p className="mt-2 text-sm leading-relaxed text-cream-dim">Xem lá số không cần đăng nhập. Đăng nhập để lưu lá, mua gói và dùng ví xu.</p>
          <button className="btn btn-lg mt-7 w-full bg-cream text-ink-950 hover:bg-white">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.1 5.5c4.2-3.9 7.2-9.6 7.2-16.9z" />
              <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2.2 1.5-5 2.3-8.8 2.3-6.2 0-11.5-4.1-13.4-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
            </svg>
            Tiếp tục với Google
          </button>
          <ul className="mt-7 space-y-2.5 text-sm text-cream/90">
            {["Lá số đã lập khi chưa đăng nhập được gộp vào tài khoản", "Mở lại lá cũ không tốn lượt", "Xóa lá số hoặc tài khoản bất kỳ lúc nào"].map((t) => (
              <li key={t} className="flex gap-2">
                <Check size={15} className="mt-0.5 shrink-0 text-jade" /> {t}
              </li>
            ))}
          </ul>
          <p className="mt-7 flex gap-2 border-t border-[var(--line)] pt-5 text-xs leading-relaxed text-cream-mute">
            <Lock size={13} className="mt-0.5 shrink-0" />
            <span>
              Chúng tôi chỉ nhận email và tên hiển thị từ Google. Mua gói từ 18 tuổi. Xem{" "}
              <Link href="/chinh-sach-du-lieu" className="text-gold-300 hover:underline">
                Chính sách dữ liệu
              </Link>{" "}
              của {site.name}.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
