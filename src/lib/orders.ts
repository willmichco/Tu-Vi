import { addons, plans } from "./site";

export interface OrderItem {
  code: string;
  name: string;
  amount: number;
  note: string;
}

export function orderItem(code: string | null): OrderItem {
  const p = plans.find((x) => x.code === code && x.price > 0);
  if (p) return { code: p.code, name: `Gói ${p.name}`, amount: p.price, note: `${p.charts} lá · ${p.qaPerChart.toLocaleString("vi-VN")} lượt hỏi/lá` };
  const t = addons.tinhDuyen.find((x) => x.code === code);
  if (t) return { code: t.code, name: `Tình duyên · ${t.name}`, amount: t.price, note: "Đối chiếu hai lá số" };
  const xu = code?.match(/^xu-(\d+)$/);
  if (xu) return { code: code!, name: `Nạp ${xu[1]} xu`, amount: Number(xu[1]) * 1000, note: "Cộng vào ví xu" };
  const def = plans.find((x) => x.code === "chuyen-sau")!;
  return { code: def.code, name: `Gói ${def.name}`, amount: def.price, note: `1 lá · 1.000 lượt hỏi` };
}

/** Mã chuyển khoản: tiền tố + 6 ký tự, bỏ 0/O/1/I để khỏi nhầm khi gõ tay. */
export const SAFE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export function isTransferCode(s: string, prefix: string) {
  return new RegExp(`^${prefix}[${SAFE_CHARS}]{6}$`).test(s);
}
