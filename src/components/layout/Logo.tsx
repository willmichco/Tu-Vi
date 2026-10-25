import Link from "next/link";
import { site } from "@/lib/site";

/** Dấu hiệu: lưới 12 cung của lá số, ô giữa là thiên bàn với một ngôi sao. */
export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id="lg-gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f8e8c4" />
          <stop offset="1" stopColor="#cfa356" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="29" height="29" rx="7" fill="none" stroke="url(#lg-gold)" strokeWidth="1.5" />
      <path d="M9 1.5v29M23 1.5v29M1.5 9h29M1.5 23h29" stroke="url(#lg-gold)" strokeWidth="1" opacity="0.45" />
      <rect x="9" y="9" width="14" height="14" fill="#09090f" />
      <path
        d="M16 10.5l1.4 4.1 4.1 1.4-4.1 1.4-1.4 4.1-1.4-4.1-4.1-1.4 4.1-1.4z"
        fill="url(#lg-gold)"
        className="origin-center transition-transform duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)] [transform-box:fill-box] group-hover:rotate-90"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${site.name} — trang chủ`}>
      <LogoMark />
      <span className="font-serif text-[19px] font-medium tracking-tight text-cream">{site.name}</span>
    </Link>
  );
}
