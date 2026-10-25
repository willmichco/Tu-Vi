import type { BirthInput } from "./engine";

/**
 * Bản thiết kế chưa có database: id lá số = dữ liệu sinh mã hóa base64url.
 * Khi nối Supabase, id sẽ là charts.id (uuid) và trang /la-so?id= đọc từ API.
 */
export const SAMPLE_ID = "mau";

export const SAMPLE_INPUT: BirthInput = {
  name: "Lá số mẫu",
  gender: "nu",
  calendar: "duong",
  day: 12,
  month: 3,
  year: 1994,
  leap: false,
  hour: 4,
  lateTy: false,
  tz: 7,
  viewYear: 2027,
};

export function encodeChartId(i: BirthInput): string {
  const raw = [
    1,
    i.gender === "nam" ? 1 : 0,
    i.calendar === "am" ? 1 : 0,
    i.day,
    i.month,
    i.year,
    i.leap ? 1 : 0,
    i.hour ?? -1,
    i.lateTy ? 1 : 0,
    i.tz,
    i.viewYear,
    i.name,
  ];
  const bytes = new TextEncoder().encode(JSON.stringify(raw));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeChartId(id: string): BirthInput | null {
  if (id === SAMPLE_ID) return SAMPLE_INPUT;
  try {
    const b64 = id.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const r = JSON.parse(new TextDecoder().decode(bytes));
    if (!Array.isArray(r) || r[0] !== 1) return null;
    return {
      gender: r[1] ? "nam" : "nu",
      calendar: r[2] ? "am" : "duong",
      day: Number(r[3]),
      month: Number(r[4]),
      year: Number(r[5]),
      leap: Boolean(r[6]),
      hour: r[7] === -1 ? null : Number(r[7]),
      lateTy: Boolean(r[8]),
      tz: r[9] === 8 ? 8 : 7,
      viewYear: Number(r[10]),
      name: String(r[11] ?? "").slice(0, 40),
    };
  } catch {
    return null;
  }
}
