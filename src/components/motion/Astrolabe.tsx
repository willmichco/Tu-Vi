import { CHI } from "@/lib/lunar";

/**
 * Vòng thiên bàn trang trí (SVG tĩnh, xoay bằng CSS): vạch chia độ, 12 địa chi,
 * vòng trong quay ngược chiều. Dấu hiệu thị giác chung cho các khu vực "bầu trời".
 */
export function Astrolabe({ className = "" }: { className?: string }) {
  const R = 300;
  const ticks = Array.from({ length: 120 }, (_, i) => i * 3);
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="-320 -320 640 640" className="absolute inset-0 size-full animate-spin-slow">
        <defs>
          <linearGradient id="as-gold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f8e8c4" />
            <stop offset="1" stopColor="#9d7a3c" />
          </linearGradient>
        </defs>
        <circle r={R} fill="none" stroke="url(#as-gold)" strokeOpacity="0.55" />
        <circle r={R - 34} fill="none" stroke="url(#as-gold)" strokeOpacity="0.32" />
        {ticks.map((a) => {
          const long = a % 30 === 0;
          const mid = a % 15 === 0;
          const r1 = R - (long ? 14 : mid ? 9 : 5);
          const t = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={Math.sin(t) * R}
              y1={-Math.cos(t) * R}
              x2={Math.sin(t) * r1}
              y2={-Math.cos(t) * r1}
              stroke="#e7c07a"
              strokeOpacity={long ? 0.8 : 0.4}
            />
          );
        })}
        {CHI.map((c, i) => {
          const t = ((i * 30 + 15) * Math.PI) / 180;
          const r = R - 22;
          return (
            <text
              key={c}
              x={Math.sin(t) * r}
              y={-Math.cos(t) * r}
              transform={`rotate(${i * 30 + 15} ${Math.sin(t) * r} ${-Math.cos(t) * r})`}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              letterSpacing="2"
              fill="#e7c07a"
              fillOpacity="0.7"
              fontFamily="var(--font-jetbrains)"
            >
              {c.toUpperCase()}
            </text>
          );
        })}
      </svg>
      <svg viewBox="-320 -320 640 640" className="absolute inset-0 size-full animate-spin-rev">
        <circle r="214" fill="none" stroke="#e7c07a" strokeOpacity="0.26" strokeDasharray="2 6" />
        <circle r="150" fill="none" stroke="#b9c1ff" strokeOpacity="0.12" />
        {Array.from({ length: 12 }, (_, i) => {
          const t = (i * 30 * Math.PI) / 180;
          return (
            <line key={i} x1={Math.sin(t) * 150} y1={-Math.cos(t) * 150} x2={Math.sin(t) * 214} y2={-Math.cos(t) * 214} stroke="#e7c07a" strokeOpacity="0.1" />
          );
        })}
        {[0, 4, 8].map((i) => {
          const t = (i * 30 * Math.PI) / 180;
          return <circle key={i} cx={Math.sin(t) * 214} cy={-Math.cos(t) * 214} r="2.5" fill="#f8e8c4" fillOpacity="0.8" />;
        })}
        <polygon
          points={[0, 4, 8].map((i) => `${Math.sin((i * 30 * Math.PI) / 180) * 214},${-Math.cos((i * 30 * Math.PI) / 180) * 214}`).join(" ")}
          fill="none"
          stroke="#e7c07a"
          strokeOpacity="0.12"
        />
      </svg>
    </div>
  );
}
