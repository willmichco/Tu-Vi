"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const floating = scrolled || open;

  return (
    // Chiều cao header cố định 64px: thanh co lại thành viên nổi nhưng không đẩy nội dung
    <header className="sticky top-0 z-50 h-16">
      <div
        className={`mx-auto flex items-center gap-6 border transition-[max-width,width,margin,height,padding,background-color,border-color,box-shadow,border-radius] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          floating
            ? "mt-2.5 h-[52px] w-[calc(100%-1.5rem)] max-w-[1080px] rounded-full border-[var(--line-strong)] bg-ink-900/70 pr-2 pl-4 shadow-[0_18px_50px_-20px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.05)] backdrop-blur-xl backdrop-saturate-150 sm:pl-5"
            : "h-16 w-full max-w-[1200px] rounded-none border-transparent px-4 sm:px-6 lg:px-8"
        }`}
      >
        <Logo />
        <nav className="hidden flex-1 items-center gap-0.5 lg:flex" aria-label="Điều hướng chính">
          {nav.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-3 py-1.5 text-sm transition-colors duration-300 ${
                  active ? "bg-white/[0.07] text-cream" : "text-cream-dim hover:bg-white/[0.04] hover:text-cream"
                }`}
              >
                {item.label}
                {active && <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link href="/dang-nhap" className="btn btn-ghost btn-sm hidden sm:inline-flex">
            Đăng nhập
          </Link>
          <Link href="/lap-la-so" className="btn btn-primary btn-sm">
            <span>
              Lập lá số<span className="hidden sm:inline"> miễn phí</span>
            </span>
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-cream transition hover:bg-white/[0.06] lg:hidden"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="page-enter fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-ink-950/95 backdrop-blur-xl lg:hidden">
          <nav className="intro container-x flex flex-col py-6" aria-label="Điều hướng di động">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-baseline gap-4 border-b border-[var(--line)] py-4 font-serif text-2xl text-cream"
              >
                <span className="font-mono text-xs text-gold-500">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            ))}
            <div className="mt-8 grid gap-3">
              <Link href="/lap-la-so" className="btn btn-primary btn-lg">
                Lập lá số miễn phí
              </Link>
              <Link href="/dang-nhap" className="btn btn-secondary btn-lg">
                Đăng nhập
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
