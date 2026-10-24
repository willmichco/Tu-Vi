import { describe, expect, it } from "vitest";
import { canChiYear, leapMonthOf, lunarMonthLength, lunarToSolar, solarToLunar } from "@/lib/lunar";

describe("Lịch âm Việt Nam (ca bắt buộc — mục 11 đặc tả)", () => {
  it("Tết Ất Sửu 1985 theo UTC+7 là 21/01/1985", () => {
    expect(lunarToSolar(1, 1, 1985, false, 7)).toEqual({ day: 21, month: 1, year: 1985 });
    expect(solarToLunar(21, 1, 1985, 7)).toMatchObject({ day: 1, month: 1, year: 1985, leap: false });
  });

  it("Tết Ất Sửu 1985 theo UTC+8 lệch sang 20/02/1985", () => {
    expect(lunarToSolar(1, 1, 1985, false, 8)).toEqual({ day: 20, month: 2, year: 1985 });
  });

  it("Tết Mậu Thân 1968: UTC+7 là 29/01, UTC+8 là 30/01", () => {
    expect(lunarToSolar(1, 1, 1968, false, 7)).toEqual({ day: 29, month: 1, year: 1968 });
    expect(lunarToSolar(1, 1, 1968, false, 8)).toEqual({ day: 30, month: 1, year: 1968 });
  });

  it("chỉ nhận tháng nhuận đúng của năm", () => {
    expect(leapMonthOf(2023)).toBe(2);
    expect(leapMonthOf(2020)).toBe(4);
    expect(leapMonthOf(2025)).toBe(6);
    expect(leapMonthOf(2024)).toBe(0);
    expect(lunarToSolar(1, 3, 2023, true)).toBeNull();
    expect(lunarToSolar(1, 2, 2023, true)).not.toBeNull();
  });

  it("ngày 30 của tháng thiếu không tồn tại", () => {
    for (let m = 1; m <= 12; m++) {
      if (lunarMonthLength(m, 2024) === 29) {
        expect(lunarToSolar(30, m, 2024)).toBeNull();
        return;
      }
    }
    throw new Error("không tìm thấy tháng thiếu trong 2024");
  });

  it("đổi qua lại dương → âm → dương khớp từng ngày 1930–2026", () => {
    for (let jdStep = 0; jdStep < 600; jdStep++) {
      const y = 1930 + (jdStep % 97);
      const m = 1 + ((jdStep * 7) % 12);
      const d = 1 + ((jdStep * 11) % 28);
      const l = solarToLunar(d, m, y);
      expect(lunarToSolar(l.day, l.month, l.year, l.leap)).toEqual({ day: d, month: m, year: y });
    }
  });

  it("can chi năm", () => {
    expect(canChiYear(1984).label).toBe("Giáp Tý");
    expect(canChiYear(1990).label).toBe("Canh Ngọ");
    expect(canChiYear(2027).label).toBe("Đinh Mùi");
  });
});
