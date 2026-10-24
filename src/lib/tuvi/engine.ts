/**
 * Engine an sao Tử Vi Nam phái — code thuần, chạy được ở client lẫn server.
 * Client dùng để hiện lá ngay khi người dùng nhập; server tính lại khi lưu (chống sửa dữ liệu).
 *
 * BẢN THIẾT KẾ (ENGINE_VERSION *-design): đủ để dựng giao diện với lá số thật,
 * nhưng PHẢI qua golden test 200 lá (mục 7.1) trước khi mở bán.
 */
import {
  CAN,
  CHI,
  canChiDay,
  canChiHour,
  canChiMonth,
  canChiYear,
  jdFromDate,
  jdToDate,
  lunarToSolar,
  solarToLunar,
  type LunarDate,
  type SolarDate,
  type TimeZone,
} from "../lunar";
import {
  BAC_SI_RING,
  CUC_NAMES,
  ENGINE_VERSION,
  HOA_NAMES,
  MAJOR_BRIGHTNESS,
  MAJOR_STARS,
  MINOR_STARS,
  NAP_AM,
  PALACE_NAMES,
  THAI_TUE_RING,
  TRANG_SINH_RING,
  TU_HOA,
  type Brightness,
  type Element,
  type PalaceName,
  type StarDef,
  type StarKind,
} from "./constants";

export interface BirthInput {
  name: string;
  gender: "nam" | "nu";
  calendar: "duong" | "am";
  day: number;
  month: number;
  year: number;
  /** Chỉ dùng khi calendar = "am". */
  leap: boolean;
  /** 0 = Tý … 11 = Hợi; null = không nhớ giờ. */
  hour: number | null;
  /** Giờ Tý muộn (23h–24h) tính sang ngày hôm sau. */
  lateTy: boolean;
  tz: TimeZone;
  viewYear: number;
}

export interface PlacedStar {
  name: string;
  element: Element;
  kind: StarKind;
  brightness?: Brightness;
  /** Tứ Hóa gắn vào sao này (theo can năm sinh). */
  hoa?: "Lộc" | "Quyền" | "Khoa" | "Kỵ";
}

export interface Palace {
  chi: number;
  can: number;
  name: PalaceName;
  isMenh: boolean;
  isThan: boolean;
  major: PlacedStar[];
  minor: PlacedStar[];
  trangSinh: string;
  daiVanStart: number;
  tieuVanChi: number;
  tuan: boolean;
  triet: boolean;
  luu: PlacedStar[];
}

export interface Chart {
  engineVersion: string;
  input: BirthInput;
  solar: SolarDate;
  lunar: LunarDate;
  yearCan: number;
  yearChi: number;
  labels: {
    year: string;
    month: string;
    day: string;
    hour: string | null;
    amDuong: string;
    banMenh: string;
    banMenhElement: Element;
    cuc: string;
    cucElement: Element;
    menhCucRelation: string;
    chuMenh: string;
    chuThan: string;
    thanCu: PalaceName;
  };
  cuc: number;
  menhChi: number;
  thanChi: number;
  thuan: boolean;
  palaces: Palace[];
  tuan: [number, number];
  triet: [number, number];
  view: {
    year: number;
    label: string;
    age: number;
    daiVanChi: number;
    tieuVanChi: number;
  };
  starCount: number;
  hourUnknown: boolean;
}

export const mod = (n: number, m = 12) => ((n % m) + m) % m;

const CUC_BY_ELEMENT: Record<Element, number> = { thuy: 2, moc: 3, kim: 4, tho: 5, hoa: 6 };

function napAm(can: number, chi: number): [string, Element] {
  const n = mod(6 * can - 5 * chi, 60);
  return NAP_AM[Math.floor(n / 2)];
}

/** Vị trí Tử Vi theo cục và ngày âm. */
export function tuViPosition(cuc: number, lunarDay: number): number {
  let k = 0;
  while ((lunarDay + k) % cuc !== 0) k++;
  const q = (lunarDay + k) / cuc;
  const x = 2 + q - 1;
  return mod(k % 2 === 1 ? x - k : x + k);
}

const tamHopGroup = (chi: number) => chi % 4; // 0: Thân Tý Thìn, 1: Tỵ Dậu Sửu, 2: Dần Ngọ Tuất, 3: Hợi Mão Mùi

const SINH: Record<Element, Element> = { moc: "hoa", hoa: "tho", tho: "kim", kim: "thuy", thuy: "moc" };
const KHAC: Record<Element, Element> = { moc: "tho", tho: "thuy", thuy: "hoa", hoa: "kim", kim: "moc" };

function relation(menh: Element, cuc: Element): string {
  if (menh === cuc) return "Mệnh – Cục bình hòa";
  if (SINH[cuc] === menh) return "Cục sinh Mệnh";
  if (SINH[menh] === cuc) return "Mệnh sinh Cục";
  if (KHAC[cuc] === menh) return "Cục khắc Mệnh";
  if (KHAC[menh] === cuc) return "Mệnh khắc Cục";
  return "";
}

const CHU_MENH = ["Tham Lang", "Cự Môn", "Lộc Tồn", "Văn Khúc", "Liêm Trinh", "Vũ Khúc", "Phá Quân", "Vũ Khúc", "Liêm Trinh", "Văn Khúc", "Lộc Tồn", "Cự Môn"];
const CHU_THAN = ["Hỏa Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ"];

const LOC_TON = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
const KHOI_VIET: [number, number][] = [
  [1, 7],
  [0, 8],
  [11, 9],
  [11, 9],
  [1, 7],
  [0, 8],
  [6, 2],
  [6, 2],
  [3, 5],
  [3, 5],
];
const LUU_HA = [9, 10, 7, 8, 5, 6, 4, 3, 11, 2];
const THIEN_TRU = [5, 6, 0, 5, 6, 8, 2, 6, 9, 10];
const TRIET: [number, number][] = [
  [8, 9],
  [6, 7],
  [4, 5],
  [2, 3],
  [0, 1],
];
/** Theo nhóm tam hợp của chi năm (index = chi % 4). */
const THIEN_MA = [2, 11, 8, 5];
const DAO_HOA = [9, 6, 3, 0];
const HOA_CAI = [4, 1, 10, 7];
const KIEP_SAT = [5, 2, 11, 8];
const HOA_LINH_START: [number, number][] = [
  [2, 10],
  [3, 10],
  [1, 3],
  [9, 10],
];
const TIEU_VAN_START = [10, 7, 4, 1];
const TRANG_SINH_START: Record<number, number> = { 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 };

function normalizeDates(input: BirthInput): { solar: SolarDate; lunar: LunarDate } | null {
  let solar: SolarDate | null;
  if (input.calendar === "duong") {
    solar = { day: input.day, month: input.month, year: input.year };
    const check = jdToDate(jdFromDate(solar.day, solar.month, solar.year));
    if (check.day !== solar.day || check.month !== solar.month) return null;
  } else {
    solar = lunarToSolar(input.day, input.month, input.year, input.leap, input.tz);
  }
  if (!solar) return null;
  if (input.hour === 0 && input.lateTy) {
    solar = jdToDate(jdFromDate(solar.day, solar.month, solar.year) + 1);
  }
  const lunar = solarToLunar(solar.day, solar.month, solar.year, input.tz);
  return { solar, lunar };
}

/** Quy ước tháng nhuận: ngày 1–15 tính theo tháng chính, từ ngày 16 tính sang tháng sau. */
export function effectiveMonth(lunar: LunarDate): number {
  if (!lunar.leap) return lunar.month;
  return lunar.day <= 15 ? lunar.month : (lunar.month % 12) + 1;
}

export function buildChart(input: BirthInput): Chart | null {
  const dates = normalizeDates(input);
  if (!dates) return null;
  const { solar, lunar } = dates;
  const yc = canChiYear(lunar.year);
  const yearCan = yc.can;
  const yearChi = yc.chi;
  const hourUnknown = input.hour === null;
  const h = input.hour ?? 0;
  const m = effectiveMonth(lunar);
  const d = lunar.day;
  const isDuong = yearCan % 2 === 0;
  const isNam = input.gender === "nam";
  const thuan = isDuong === isNam;

  const menhChi = mod(2 + (m - 1) - h);
  const thanChi = mod(2 + (m - 1) + h);
  const canDan = ((yearCan % 5) * 2 + 2) % 10;
  const palaceCan = (chi: number) => (canDan + mod(chi - 2)) % 10;

  const [, menhNapAmEl] = napAm(palaceCan(menhChi), menhChi);
  const cuc = CUC_BY_ELEMENT[menhNapAmEl];
  const [banMenh, banMenhEl] = napAm(yearCan, yearChi);

  const palaces: Palace[] = Array.from({ length: 12 }, (_, chi) => ({
    chi,
    can: palaceCan(chi),
    name: PALACE_NAMES[mod(chi - menhChi)],
    isMenh: chi === menhChi,
    isThan: chi === thanChi,
    major: [],
    minor: [],
    trangSinh: "",
    daiVanStart: 0,
    tieuVanChi: 0,
    tuan: false,
    triet: false,
    luu: [],
  }));

  const putMajor = (def: StarDef, chi: number) => {
    const pos = mod(chi);
    const b = MAJOR_BRIGHTNESS[def.name]?.[pos] as Brightness | undefined;
    palaces[pos].major.push({ ...def, brightness: b });
  };
  const putMinor = (name: string, chi: number) => {
    const def = MINOR_STARS[name];
    palaces[mod(chi)].minor.push({ ...def });
  };

  // 14 chính tinh
  const tuVi = tuViPosition(cuc, d);
  const [TV, TC, TD, VK, TDg, LT, TP, TA, TL, CM, TT, TLg, TS, PQ] = MAJOR_STARS;
  putMajor(TV, tuVi);
  putMajor(TC, tuVi - 1);
  putMajor(TD, tuVi - 3);
  putMajor(VK, tuVi - 4);
  putMajor(TDg, tuVi - 5);
  putMajor(LT, tuVi - 8);
  const phu = mod(4 - tuVi);
  putMajor(TP, phu);
  putMajor(TA, phu + 1);
  putMajor(TL, phu + 2);
  putMajor(CM, phu + 3);
  putMajor(TT, phu + 4);
  putMajor(TLg, phu + 5);
  putMajor(TS, phu + 6);
  putMajor(PQ, phu + 10);

  // Lộc Tồn, Kình Dương, Đà La + vòng Bác Sĩ
  const locTon = LOC_TON[yearCan];
  putMinor("Lộc Tồn", locTon);
  putMinor("Kình Dương", locTon + 1);
  putMinor("Đà La", locTon - 1);
  putMinor("Quốc Ấn", locTon + 8);
  putMinor("Đường Phù", locTon - 7);
  putMinor("Văn Tinh", locTon + 3);
  BAC_SI_RING.forEach((s, i) => palaces[mod(locTon + (thuan ? i : -i))].minor.push({ ...s }));

  // Theo giờ
  const xuong = mod(10 - h);
  const khuc = mod(4 + h);
  putMinor("Văn Xương", xuong);
  putMinor("Văn Khúc", khuc);
  putMinor("Địa Kiếp", 11 + h);
  putMinor("Địa Không", 11 - h);
  putMinor("Thai Phụ", khuc + 2);
  putMinor("Phong Cáo", khuc - 2);

  // Theo tháng
  const taPhu = mod(4 + m - 1);
  const huuBat = mod(10 - (m - 1));
  putMinor("Tả Phù", taPhu);
  putMinor("Hữu Bật", huuBat);
  putMinor("Thiên Hình", 9 + m - 1);
  putMinor("Thiên Riêu", 1 + m - 1);
  putMinor("Thiên Y", 1 + m - 1);

  // Theo ngày
  putMinor("Tam Thai", taPhu + d - 1);
  putMinor("Bát Tọa", huuBat - (d - 1));
  putMinor("Ân Quang", xuong + d - 2);
  putMinor("Thiên Quý", khuc - d + 2);

  // Theo can năm
  const [khoi, viet] = KHOI_VIET[yearCan];
  putMinor("Thiên Khôi", khoi);
  putMinor("Thiên Việt", viet);
  putMinor("Lưu Hà", LUU_HA[yearCan]);
  putMinor("Thiên Trù", THIEN_TRU[yearCan]);

  // Theo chi năm
  const g = tamHopGroup(yearChi);
  putMinor("Thiên Mã", THIEN_MA[g]);
  putMinor("Đào Hoa", DAO_HOA[g]);
  putMinor("Hoa Cái", HOA_CAI[g]);
  putMinor("Kiếp Sát", KIEP_SAT[g]);
  putMinor("Thiên Khốc", 6 - yearChi);
  putMinor("Thiên Hư", 6 + yearChi);
  putMinor("Long Trì", 4 + yearChi);
  const phuongCac = mod(10 - yearChi);
  putMinor("Phượng Các", phuongCac);
  putMinor("Giải Thần", phuongCac);
  const hongLoan = mod(3 - yearChi);
  putMinor("Hồng Loan", hongLoan);
  putMinor("Thiên Hỷ", hongLoan + 6);
  // Dần Mão Thìn → Tỵ/Sửu · Tỵ Ngọ Mùi → Thân/Thìn · Thân Dậu Tuất → Hợi/Mùi · Hợi Tý Sửu → Dần/Tuất
  const coQua = (
    [
      [5, 1],
      [8, 4],
      [11, 7],
      [2, 10],
    ] as const
  )[Math.floor(mod(yearChi - 2) / 3)];
  putMinor("Cô Thần", coQua[0]);
  putMinor("Quả Tú", coQua[1]);
  putMinor("Thiên Đức", 9 + yearChi);
  putMinor("Nguyệt Đức", 5 + yearChi);
  putMinor("Phá Toái", [5, 1, 9][yearChi % 3]);
  putMinor("Thiên Không", yearChi + 1);
  putMinor("Đẩu Quân", yearChi - (m - 1) + h);
  putMinor("Thiên Tài", menhChi + yearChi);
  putMinor("Thiên Thọ", thanChi + yearChi);
  THAI_TUE_RING.forEach((s, i) => palaces[mod(yearChi + i)].minor.push({ ...s }));

  // Hỏa Tinh, Linh Tinh
  const [hoaStart, linhStart] = HOA_LINH_START[g];
  putMinor("Hỏa Tinh", hoaStart + (thuan ? h : -h));
  putMinor("Linh Tinh", linhStart + (thuan ? -h : h));

  // Cố định theo cung
  putMinor("Thiên La", 4);
  putMinor("Địa Võng", 10);
  putMinor("Thiên Thương", menhChi + 5);
  putMinor("Thiên Sứ", menhChi + 7);

  // Tứ Hóa
  TU_HOA[yearCan].forEach((starName, i) => {
    const label = (["Lộc", "Quyền", "Khoa", "Kỵ"] as const)[i];
    for (const p of palaces) {
      const s = [...p.major, ...p.minor].find((x) => x.name === starName);
      if (s) {
        s.hoa = label;
        p.minor.push({ ...MINOR_STARS[HOA_NAMES[i]] });
        break;
      }
    }
  });

  // Tuần, Triệt
  const n60 = mod(6 * yearCan - 5 * yearChi, 60);
  const chi0 = mod(n60 - (n60 % 10));
  const tuan: [number, number] = [mod(chi0 + 10), mod(chi0 + 11)];
  const triet = TRIET[yearCan % 5];
  tuan.forEach((c) => (palaces[c].tuan = true));
  triet.forEach((c) => (palaces[c].triet = true));

  // Vòng Tràng Sinh
  const tsStart = TRANG_SINH_START[cuc];
  TRANG_SINH_RING.forEach((name, i) => (palaces[mod(tsStart + (thuan ? i : -i))].trangSinh = name));

  // Đại vận, tiểu vận
  for (let k = 0; k < 12; k++) {
    palaces[mod(menhChi + (thuan ? k : -k))].daiVanStart = cuc + 10 * k;
  }
  const tvStart = TIEU_VAN_START[g];
  for (let a = 1; a <= 12; a++) {
    const p = mod(tvStart + (isNam ? a - 1 : -(a - 1)));
    palaces[p].tieuVanChi = mod(yearChi + a - 1);
  }

  // Lưu niên theo năm xem
  const vy = canChiYear(input.viewYear);
  const age = input.viewYear - lunar.year + 1;
  const putLuu = (name: string, chi: number, element: Element) =>
    palaces[mod(chi)].luu.push({ name, element, kind: "luu" });
  const lLoc = LOC_TON[vy.can];
  putLuu("L. Thái Tuế", vy.chi, "hoa");
  putLuu("L. Lộc Tồn", lLoc, "tho");
  putLuu("L. Kình Dương", lLoc + 1, "kim");
  putLuu("L. Đà La", lLoc - 1, "kim");
  putLuu("L. Thiên Mã", THIEN_MA[tamHopGroup(vy.chi)], "hoa");
  putLuu("L. Tang Môn", vy.chi + 2, "moc");
  putLuu("L. Bạch Hổ", vy.chi + 8, "kim");
  putLuu("L. Thiên Khốc", 6 - vy.chi, "kim");
  putLuu("L. Thiên Hư", 6 + vy.chi, "thuy");
  TU_HOA[vy.can].forEach((starName, i) => {
    const p = palaces.find((pp) => [...pp.major, ...pp.minor].some((s) => s.name === starName));
    if (p) p.luu.push({ name: `L. ${HOA_NAMES[i]}`, element: i < 2 ? "moc" : "thuy", kind: "luu" });
  });

  const daiVanPalace = palaces.find((p) => age >= p.daiVanStart && age < p.daiVanStart + 10);
  const tieuVanPalace = palaces.find((p) => p.tieuVanChi === vy.chi);

  const dayCC = canChiDay(solar.day, solar.month, solar.year);
  const monthCC = canChiMonth(lunar.month, lunar.year);
  const hourCC = hourUnknown ? null : canChiHour(dayCC.can, h).label;

  const starCount = palaces.reduce((acc, p) => acc + p.major.length + p.minor.length + 1, 0) + 2;

  return {
    engineVersion: ENGINE_VERSION,
    input,
    solar,
    lunar,
    yearCan,
    yearChi,
    labels: {
      year: yc.label,
      month: monthCC.label,
      day: dayCC.label,
      hour: hourCC,
      amDuong: `${isDuong ? "Dương" : "Âm"} ${isNam ? "Nam" : "Nữ"}`,
      banMenh,
      banMenhElement: banMenhEl,
      cuc: CUC_NAMES[cuc],
      cucElement: menhNapAmEl,
      menhCucRelation: relation(banMenhEl, menhNapAmEl),
      chuMenh: CHU_MENH[menhChi],
      chuThan: CHU_THAN[yearChi % 6],
      thanCu: palaces[thanChi].name,
    },
    cuc,
    menhChi,
    thanChi,
    thuan,
    palaces,
    tuan,
    triet,
    view: {
      year: input.viewYear,
      label: vy.label,
      age,
      daiVanChi: daiVanPalace?.chi ?? -1,
      tieuVanChi: tieuVanPalace?.chi ?? -1,
    },
    starCount,
    hourUnknown,
  };
}

/** Tam phương tứ chính & nhị hợp của một cung. */
export function relationsOf(chi: number) {
  return {
    tamHop: [mod(chi + 4), mod(chi + 8)] as [number, number],
    xungChieu: mod(chi + 6),
    nhiHop: mod(1 - chi),
  };
}

export function palaceLabel(p: Palace): string {
  return `${CAN[p.can]} ${CHI[p.chi]}`;
}

export function findPalace(chart: Chart, name: PalaceName): Palace {
  return chart.palaces.find((p) => p.name === name)!;
}
