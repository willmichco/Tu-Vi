import { CHI } from "@/lib/lunar";
import type { Chart } from "@/lib/tuvi/engine";
import { BRIGHTNESS_OPACITY, ELEMENT_COLOR } from "../chart/starStyle";

/**
 * Poster tĩnh của bàn sao (SVG, render phía server) — hiện ngay khi tải trang,
 * Three.js chỉ tải sau đó. Dùng phép chiếu elip để giả phối cảnh 3D.
 */
export function HeroPoster({ chart, className = "" }: { chart: Chart; className?: string }) {
  const W = 640;
  const H = 520;
  const cx = W / 2;
  const cy = 330;
  const rx = 228;
  const ry = 92;
  const at = (chi: number, k = 1, lift = 0): [number, number] => {
    const t = ((chi * 30 - 15) * Math.PI) / 180;
    return [cx - rx * k * Math.sin(t), cy + ry * k * Math.cos(t) - lift];
  };

  return (
    <svg viewBox={`0 120 ${W} ${H - 150}`} className={className} role="img" aria-label="Bàn sao tử vi mẫu">
      <defs>
        <radialGradient id="hp-glow">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hp-core">
          <stop offset="0" stopColor="#e7c07a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#e7c07a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={120} ry={60} fill="url(#hp-core)" />
      {[0.35, 0.6, 1, 1.22].map((k, i) => (
        <ellipse key={k} cx={cx} cy={cy} rx={rx * k} ry={ry * k} fill="none" stroke="#e7c07a" strokeOpacity={[0.25, 0.18, 0.22, 0.1][i]} />
      ))}
      {Array.from({ length: 12 }, (_, chi) => {
        const t = ((chi * 30) * Math.PI) / 180;
        return (
          <line
            key={chi}
            x1={cx - rx * 0.6 * Math.sin(t)}
            y1={cy + ry * 0.6 * Math.cos(t)}
            x2={cx - rx * 1.22 * Math.sin(t)}
            y2={cy + ry * 1.22 * Math.cos(t)}
            stroke="#efe7d6"
            strokeOpacity="0.08"
          />
        );
      })}
      {/* Tam hợp của Mệnh */}
      <polygon
        points={[chart.menhChi, (chart.menhChi + 4) % 12, (chart.menhChi + 8) % 12].map((c) => at(c, 0.86).join(",")).join(" ")}
        fill="#e7c07a"
        fillOpacity="0.03"
        stroke="#e7c07a"
        strokeOpacity="0.55"
      />
      {chart.palaces.map((p) => {
        const [lx, ly] = at(p.chi, 1.3);
        const back = Math.cos(((p.chi * 30 - 15) * Math.PI) / 180) < -0.2;
        return (
          <g key={p.chi} opacity={back ? 0.55 : 1}>
            <text x={lx} y={ly + 4} textAnchor="middle" fontSize="11" letterSpacing="1.2" fill={p.isMenh ? "#f2d79f" : "#b0a998"} fontFamily="var(--font-be-vietnam)" fontWeight="600">
              {p.name.toUpperCase()}
            </text>
            <text x={lx} y={ly + 17} textAnchor="middle" fontSize="9" fill="#827c70" fontFamily="var(--font-jetbrains)">
              {CHI[p.chi]}
            </text>
            {p.major.map((s, i) => {
              const [x, y] = at(p.chi, 0.86, 30 + i * 34);
              const c = ELEMENT_COLOR[s.element];
              const op = s.brightness ? BRIGHTNESS_OPACITY[s.brightness] : 0.8;
              return (
                <g key={s.name}>
                  <line x1={x} y1={y} x2={x} y2={at(p.chi, 0.86)[1]} stroke={c} strokeOpacity={0.12} />
                  <circle cx={x} cy={y} r={14 * op} fill={c} opacity={0.35 * op} />
                  <circle cx={x} cy={y} r={2.6} fill="#fff" opacity={op} />
                  {!back && (
                    <text x={x} y={y - 12} textAnchor="middle" fontSize="9.5" fill={c} opacity={0.9} fontFamily="var(--font-be-vietnam)" fontWeight="600">
                      {s.name.toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}
            {p.minor
              .filter((s) => s.kind !== "vong")
              .slice(0, 8)
              .map((s, i) => {
                const [x, y] = at(p.chi, 1.04 + (i % 3) * 0.05, 10 + ((i * 37) % 90));
                return <circle key={s.name} cx={x + ((i * 13) % 17) - 8} cy={y} r={1.4} fill={ELEMENT_COLOR[s.element]} opacity={0.55} />;
              })}
          </g>
        );
      })}
      <text x={cx} y={cy - 40} textAnchor="middle" fontSize="15" fill="#f2d79f" fontFamily="var(--font-be-vietnam)" fontWeight="600">
        {chart.labels.cuc}
      </text>
      <text x={cx} y={cy - 23} textAnchor="middle" fontSize="10" fill="#b0a998" fontFamily="var(--font-be-vietnam)">
        {chart.labels.amDuong} · {chart.labels.banMenh}
      </text>
    </svg>
  );
}
