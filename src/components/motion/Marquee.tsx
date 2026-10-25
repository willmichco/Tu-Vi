/** Dải chạy ngang vô tận: nhân đôi nội dung, dịch -50%. Dừng khi rê chuột. */
export function Marquee({ children, className = "", duration = 60 }: { children: React.ReactNode; className?: string; duration?: number }) {
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track flex w-max animate-marquee" style={{ animationDuration: `${duration}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
