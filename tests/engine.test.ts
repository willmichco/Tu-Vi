import { describe, expect, it } from "vitest";
import { buildChart, tuViPosition, type BirthInput } from "@/lib/tuvi/engine";
import { MAJOR_STARS, PALACE_NAMES } from "@/lib/tuvi/constants";

const base: BirthInput = {
  name: "Mẫu",
  gender: "nam",
  calendar: "duong",
  day: 15,
  month: 8,
  year: 1990,
  leap: false,
  hour: 4,
  lateTy: false,
  tz: 7,
  viewYear: 2027,
};

describe("Engine an sao — kiểm tra cấu trúc (golden test thật nằm ở đợt 2)", () => {
  it("vị trí Tử Vi theo bảng cục", () => {
    expect(tuViPosition(2, 1)).toBe(1); // Thủy nhị cục, mùng 1 → Sửu
    expect(tuViPosition(3, 1)).toBe(4); // Mộc tam cục, mùng 1 → Thìn
    expect(tuViPosition(4, 1)).toBe(11); // Kim tứ cục, mùng 1 → Hợi
    expect(tuViPosition(5, 1)).toBe(6); // Thổ ngũ cục, mùng 1 → Ngọ
    expect(tuViPosition(6, 1)).toBe(9); // Hỏa lục cục, mùng 1 → Dậu
  });

  it("mỗi chính tinh xuất hiện đúng một lần, 12 cung không trùng tên", () => {
    for (let i = 0; i < 400; i++) {
      const chart = buildChart({
        ...base,
        day: 1 + (i % 28),
        month: 1 + (i % 12),
        year: 1950 + (i % 70),
        hour: i % 12,
        gender: i % 2 ? "nam" : "nu",
      })!;
      const majors = chart.palaces.flatMap((p) => p.major.map((s) => s.name));
      expect(majors.sort()).toEqual(MAJOR_STARS.map((s) => s.name).sort());
      expect(new Set(chart.palaces.map((p) => p.name)).size).toBe(12);
      expect(chart.palaces.find((p) => p.isMenh)!.name).toBe(PALACE_NAMES[0]);
      const hoa = chart.palaces.flatMap((p) => p.minor).filter((s) => s.kind === "hoa");
      expect(hoa).toHaveLength(4);
    }
  });

  it("đầu vào âm lịch và dương lịch tương đương cho cùng một lá", () => {
    const fromSolar = buildChart(base)!;
    const fromLunar = buildChart({
      ...base,
      calendar: "am",
      day: fromSolar.lunar.day,
      month: fromSolar.lunar.month,
      year: fromSolar.lunar.year,
      leap: fromSolar.lunar.leap,
    })!;
    expect(fromLunar.palaces).toEqual(fromSolar.palaces);
  });

  it("giờ Tý muộn tính sang ngày hôm sau", () => {
    const som = buildChart({ ...base, hour: 0, lateTy: false })!;
    const muon = buildChart({ ...base, hour: 0, lateTy: true })!;
    expect(muon.lunar.day).not.toBe(som.lunar.day);
  });

  it("ngày dương không tồn tại trả về null", () => {
    expect(buildChart({ ...base, day: 31, month: 2 })).toBeNull();
  });
});
