/**
 * Lịch âm Việt Nam — port thuật toán của Hồ Ngọc Đức (tính ngày Sóc và trung khí
 * theo kinh độ Mặt Trời). Dùng chung cho form lập lá số, engine an sao và
 * trang đổi ngày âm–dương (V2).
 *
 * timeZone: 7 = lịch Việt Nam hiện hành; 8 = lịch cũ miền Nam giai đoạn 1968–1975.
 * Phạm vi hỗ trợ: 1900–2100.
 */

export type TimeZone = 7 | 8;

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: boolean;
}

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"] as const;
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"] as const;
export const CON_GIAP = ["Chuột", "Trâu", "Hổ", "Mèo", "Rồng", "Rắn", "Ngựa", "Dê", "Khỉ", "Gà", "Chó", "Lợn"] as const;
export const THU = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"] as const;

export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

export function jdToDate(jd: number): SolarDate {
  let b: number;
  let c: number;
  if (jd > 2299160) {
    const a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: b * 100 + d - 4800 + Math.floor(m / 10),
  };
}

function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let c1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  c1 = c1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  c1 = c1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  c1 = c1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  c1 = c1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  c1 = c1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  c1 = c1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  const deltat =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return jd1 + c1 - deltat;
}

function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L -= Math.PI * 2 * Math.floor(L / (Math.PI * 2));
  return L;
}

function getSunLongitude(dayNumber: number, tz: number): number {
  return Math.floor((sunLongitude(dayNumber - 0.5 - tz / 24) / Math.PI) * 6);
}

function getNewMoonDay(k: number, tz: number): number {
  return Math.floor(newMoon(k) + 0.5 + tz / 24);
}

function getLunarMonth11(yy: number, tz: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, tz);
  if (getSunLongitude(nm, tz) >= 9) nm = getNewMoonDay(k - 1, tz);
  return nm;
}

function getLeapMonthOffset(a11: number, tz: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last: number;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  } while (arc !== last && i < 14);
  return i - 1;
}

export function solarToLunar(dd: number, mm: number, yy: number, tz: TimeZone = 7): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, tz);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, tz);
  let a11 = getLunarMonth11(yy, tz);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, tz);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, tz);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let leap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, tz);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) leap = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap };
}

/** Trả về null nếu ngày âm không tồn tại (tháng nhuận sai, ngày 30 của tháng thiếu). */
export function lunarToSolar(ld: number, lm: number, ly: number, leap = false, tz: TimeZone = 7): SolarDate | null {
  let a11: number;
  let b11: number;
  if (lm < 11) {
    a11 = getLunarMonth11(ly - 1, tz);
    b11 = getLunarMonth11(ly, tz);
  } else {
    a11 = getLunarMonth11(ly, tz);
    b11 = getLunarMonth11(ly + 1, tz);
  }
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lm - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, tz);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (leap && lm !== leapMonth) return null;
    if (leap || off >= leapOff) off += 1;
  } else if (leap) {
    return null;
  }
  const monthStart = getNewMoonDay(k + off, tz);
  if (ld > daysBetweenNewMoons(monthStart, tz)) return null;
  return jdToDate(monthStart + ld - 1);
}

function daysBetweenNewMoons(monthStart: number, tz: number): number {
  const k = Math.floor((monthStart - 2415021.076998695) / 29.530588853 + 0.5);
  for (const kk of [k, k + 1, k + 2]) {
    const next = getNewMoonDay(kk, tz);
    if (next > monthStart) return next - monthStart;
  }
  return 30;
}

/** Số ngày của tháng âm (29 hoặc 30). */
export function lunarMonthLength(lm: number, ly: number, leap = false, tz: TimeZone = 7): number {
  const first = lunarToSolar(1, lm, ly, leap, tz);
  if (!first) return 0;
  const jd = jdFromDate(first.day, first.month, first.year);
  return solarToLunar(...dmy(jdToDate(jd + 29)), tz).day === 30 ? 30 : 29;
}

/** Tháng nhuận của năm âm `ly` (0 nếu không có). */
export function leapMonthOf(ly: number, tz: TimeZone = 7): number {
  for (let m = 1; m <= 12; m++) {
    if (lunarToSolar(1, m, ly, true, tz)) return m;
  }
  return 0;
}

function dmy(d: SolarDate): [number, number, number] {
  return [d.day, d.month, d.year];
}

export function canChiYear(ly: number): { can: number; chi: number; label: string } {
  const can = (ly + 6) % 10;
  const chi = (ly + 8) % 12;
  return { can, chi, label: `${CAN[can]} ${CHI[chi]}` };
}

export function canChiMonth(lm: number, ly: number): { can: number; chi: number; label: string } {
  const can = ((ly * 12 + lm + 3) % 10 + 10) % 10;
  const chi = (lm + 1) % 12;
  return { can, chi, label: `${CAN[can]} ${CHI[chi]}` };
}

export function canChiDay(dd: number, mm: number, yy: number): { can: number; chi: number; label: string } {
  const jd = jdFromDate(dd, mm, yy);
  const can = (jd + 9) % 10;
  const chi = (jd + 1) % 12;
  return { can, chi, label: `${CAN[can]} ${CHI[chi]}` };
}

export function canChiHour(dayCan: number, hourChi: number): { can: number; chi: number; label: string } {
  const can = ((dayCan % 5) * 2 + hourChi) % 10;
  return { can, chi: hourChi, label: `${CAN[can]} ${CHI[hourChi]}` };
}

export function weekday(dd: number, mm: number, yy: number): string {
  return THU[(jdFromDate(dd, mm, yy) + 1) % 7];
}

export function formatLunar(l: LunarDate): string {
  return `${l.day}/${l.month}${l.leap ? " (nhuận)" : ""} năm ${canChiYear(l.year).label}`;
}
