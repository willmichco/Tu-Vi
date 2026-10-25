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

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-[var(--line)] bg-ink-950/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center gap-6">
        <Logo />
        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Điều hướng chính">
          {nav.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active ? "bg-white/[0.06] text-cream" : "text-cream-dim hover:text-cream"
                }`}
              >
                {item.label}
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
            className="grid size-10 place-items-center rounded-full text-cream lg:hidden"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-ink-950/95 backdrop-blur-xl lg:hidden">
          <nav className="container-x flex flex-col py-6" aria-label="Điều hướng di động">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-baseline gap-4 border-b border-[var(--line)] py-4 text-xl font-serif text-cream"
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
