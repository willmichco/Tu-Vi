export const ENGINE_VERSION = "0.1.0-design";

export type Element = "kim" | "moc" | "thuy" | "hoa" | "tho";
export type Brightness = "M" | "V" | "D" | "B" | "H";
export type StarKind = "chinh" | "cat" | "sat" | "hoa" | "trung" | "vong" | "luu";

export const ELEMENT_LABEL: Record<Element, string> = {
  kim: "Kim",
  moc: "Mộc",
  thuy: "Thủy",
  hoa: "Hỏa",
  tho: "Thổ",
};

export const BRIGHTNESS_LABEL: Record<Brightness, string> = {
  M: "Miếu",
  V: "Vượng",
  D: "Đắc",
  B: "Bình",
  H: "Hãm",
};

/** Tên 12 cung, xếp thuận chiều kim đồng hồ bắt đầu từ Mệnh. */
export const PALACE_NAMES = [
  "Mệnh",
  "Phụ Mẫu",
  "Phúc Đức",
  "Điền Trạch",
  "Quan Lộc",
  "Nô Bộc",
  "Thiên Di",
  "Tật Ách",
  "Tài Bạch",
  "Tử Tức",
  "Phu Thê",
  "Huynh Đệ",
] as const;

export type PalaceName = (typeof PALACE_NAMES)[number];

export const PALACE_SLUG: Record<PalaceName, string> = {
  "Mệnh": "menh",
  "Phụ Mẫu": "phu-mau",
  "Phúc Đức": "phuc-duc",
  "Điền Trạch": "dien-trach",
  "Quan Lộc": "quan-loc",
  "Nô Bộc": "no-boc",
  "Thiên Di": "thien-di",
  "Tật Ách": "tat-ach",
  "Tài Bạch": "tai-bach",
  "Tử Tức": "tu-tuc",
  "Phu Thê": "phu-the",
  "Huynh Đệ": "huynh-de",
};

export const PALACE_TOPIC: Record<PalaceName, string> = {
  "Mệnh": "Tính cách, khí chất, hướng đi chung",
  "Phụ Mẫu": "Cha mẹ, cấp trên, giấy tờ",
  "Phúc Đức": "Đời sống tinh thần, dòng họ",
  "Điền Trạch": "Nhà cửa, tài sản cố định",
  "Quan Lộc": "Sự nghiệp, cách làm việc",
  "Nô Bộc": "Bạn bè, đồng nghiệp, cộng sự",
  "Thiên Di": "Ra ngoài, môi trường xã hội",
  "Tật Ách": "Sức khỏe tổng quát, áp lực",
  "Tài Bạch": "Tiền bạc, cách kiếm và giữ",
  "Tử Tức": "Con cái, sáng tạo",
  "Phu Thê": "Hôn nhân, người bạn đời",
  "Huynh Đệ": "Anh chị em, người ngang hàng",
};

export interface StarDef {
  name: string;
  element: Element;
  kind: StarKind;
}

export const MAJOR_STARS: StarDef[] = [
  { name: "Tử Vi", element: "tho", kind: "chinh" },
  { name: "Thiên Cơ", element: "moc", kind: "chinh" },
  { name: "Thái Dương", element: "hoa", kind: "chinh" },
  { name: "Vũ Khúc", element: "kim", kind: "chinh" },
  { name: "Thiên Đồng", element: "thuy", kind: "chinh" },
  { name: "Liêm Trinh", element: "hoa", kind: "chinh" },
  { name: "Thiên Phủ", element: "tho", kind: "chinh" },
  { name: "Thái Âm", element: "thuy", kind: "chinh" },
  { name: "Tham Lang", element: "thuy", kind: "chinh" },
  { name: "Cự Môn", element: "thuy", kind: "chinh" },
  { name: "Thiên Tướng", element: "thuy", kind: "chinh" },
  { name: "Thiên Lương", element: "moc", kind: "chinh" },
  { name: "Thất Sát", element: "kim", kind: "chinh" },
  { name: "Phá Quân", element: "thuy", kind: "chinh" },
];

/**
 * Bảng miếu/vượng/đắc/bình/hãm của 14 chính tinh theo vị trí Tý → Hợi.
 * BẢN THIẾT KẾ: lấy theo bảng phổ biến của sách Nam phái, CHƯA qua golden test
 * (mục 7.1 đặc tả). Phải đối chiếu với 2 công cụ độc lập trước khi production.
 */
export const MAJOR_BRIGHTNESS: Record<string, string> = {
  "Tử Vi": "BDMBVMMDMBVB",
  "Thiên Cơ": "DDHMMVDDVMMH",
  "Thái Dương": "HDVVVMMDHHHH",
  "Vũ Khúc": "VMVDMHVMVDMH",
  "Thiên Đồng": "VHMDHDHHMHHD",
  "Liêm Trinh": "VDVHMHVDVHMH",
  "Thiên Phủ": "MBMBVDMDMBVD",
  "Thái Âm": "VDHHHHHDVMMM",
  "Tham Lang": "HMDHVHHMDHVH",
  "Cự Môn": "VHVMHHVHDMHD",
  "Thiên Tướng": "VDMHVDVDMHVD",
  "Thiên Lương": "VDVVMHMDVHMH",
  "Thất Sát": "MDMHHVMDMHHV",
  "Phá Quân": "MVHHDHMVHHDH",
};

const minor = (name: string, element: Element, kind: StarKind): StarDef => ({ name, element, kind });

export const MINOR_STARS: Record<string, StarDef> = Object.fromEntries(
  [
    minor("Lộc Tồn", "tho", "cat"),
    minor("Kình Dương", "kim", "sat"),
    minor("Đà La", "kim", "sat"),
    minor("Văn Xương", "kim", "cat"),
    minor("Văn Khúc", "thuy", "cat"),
    minor("Tả Phù", "tho", "cat"),
    minor("Hữu Bật", "thuy", "cat"),
    minor("Thiên Khôi", "hoa", "cat"),
    minor("Thiên Việt", "hoa", "cat"),
    minor("Địa Không", "hoa", "sat"),
    minor("Địa Kiếp", "hoa", "sat"),
    minor("Hỏa Tinh", "hoa", "sat"),
    minor("Linh Tinh", "hoa", "sat"),
    minor("Thiên Mã", "hoa", "cat"),
    minor("Hóa Lộc", "moc", "hoa"),
    minor("Hóa Quyền", "moc", "hoa"),
    minor("Hóa Khoa", "thuy", "hoa"),
    minor("Hóa Kỵ", "thuy", "hoa"),
    minor("Thiên Khốc", "kim", "sat"),
    minor("Thiên Hư", "thuy", "sat"),
    minor("Long Trì", "thuy", "cat"),
    minor("Phượng Các", "tho", "cat"),
    minor("Giải Thần", "moc", "cat"),
    minor("Hồng Loan", "thuy", "cat"),
    minor("Thiên Hỷ", "thuy", "cat"),
    minor("Đào Hoa", "moc", "trung"),
    minor("Hoa Cái", "kim", "trung"),
    minor("Kiếp Sát", "hoa", "sat"),
    minor("Cô Thần", "tho", "sat"),
    minor("Quả Tú", "tho", "sat"),
    minor("Thiên Hình", "hoa", "sat"),
    minor("Thiên Riêu", "thuy", "sat"),
    minor("Thiên Y", "thuy", "cat"),
    minor("Tam Thai", "moc", "cat"),
    minor("Bát Tọa", "moc", "cat"),
    minor("Ân Quang", "moc", "cat"),
    minor("Thiên Quý", "tho", "cat"),
    minor("Thai Phụ", "kim", "cat"),
    minor("Phong Cáo", "tho", "cat"),
    minor("Thiên Tài", "tho", "trung"),
    minor("Thiên Thọ", "tho", "trung"),
    minor("Thiên Thương", "tho", "sat"),
    minor("Thiên Sứ", "thuy", "sat"),
    minor("Thiên La", "tho", "sat"),
    minor("Địa Võng", "tho", "sat"),
    minor("Thiên Đức", "hoa", "cat"),
    minor("Nguyệt Đức", "hoa", "cat"),
    minor("Phá Toái", "hoa", "sat"),
    minor("Đẩu Quân", "hoa", "trung"),
    minor("Thiên Không", "hoa", "sat"),
    minor("Lưu Hà", "thuy", "sat"),
    minor("Thiên Trù", "tho", "cat"),
    minor("Quốc Ấn", "tho", "cat"),
    minor("Đường Phù", "moc", "cat"),
    minor("Văn Tinh", "hoa", "cat"),
  ].map((s) => [s.name, s]),
);

export const BAC_SI_RING: StarDef[] = [
  minor("Bác Sĩ", "thuy", "vong"),
  minor("Lực Sĩ", "hoa", "vong"),
  minor("Thanh Long", "thuy", "vong"),
  minor("Tiểu Hao", "hoa", "vong"),
  minor("Tướng Quân", "moc", "vong"),
  minor("Tấu Thư", "kim", "vong"),
  minor("Phi Liêm", "hoa", "vong"),
  minor("Hỷ Thần", "hoa", "vong"),
  minor("Bệnh Phù", "tho", "vong"),
  minor("Đại Hao", "hoa", "vong"),
  minor("Phục Binh", "hoa", "vong"),
  minor("Quan Phủ", "hoa", "vong"),
];

export const THAI_TUE_RING: StarDef[] = [
  minor("Thái Tuế", "hoa", "vong"),
  minor("Thiếu Dương", "hoa", "vong"),
  minor("Tang Môn", "moc", "vong"),
  minor("Thiếu Âm", "thuy", "vong"),
  minor("Quan Phù", "hoa", "vong"),
  minor("Tử Phù", "kim", "vong"),
  minor("Tuế Phá", "hoa", "vong"),
  minor("Long Đức", "thuy", "vong"),
  minor("Bạch Hổ", "kim", "vong"),
  minor("Phúc Đức", "tho", "vong"),
  minor("Điếu Khách", "hoa", "vong"),
  minor("Trực Phù", "kim", "vong"),
];

export const TRANG_SINH_RING = [
  "Tràng Sinh",
  "Mộc Dục",
  "Quan Đới",
  "Lâm Quan",
  "Đế Vượng",
  "Suy",
  "Bệnh",
  "Tử",
  "Mộ",
  "Tuyệt",
  "Thai",
  "Dưỡng",
] as const;

/** Tứ Hóa theo can năm: [Lộc, Quyền, Khoa, Kỵ] — bảng Nam phái (Nhâm: Thiên Phủ Khoa). */
export const TU_HOA: string[][] = [
  ["Liêm Trinh", "Phá Quân", "Vũ Khúc", "Thái Dương"], // Giáp
  ["Thiên Cơ", "Thiên Lương", "Tử Vi", "Thái Âm"], // Ất
  ["Thiên Đồng", "Thiên Cơ", "Văn Xương", "Liêm Trinh"], // Bính
  ["Thái Âm", "Thiên Đồng", "Thiên Cơ", "Cự Môn"], // Đinh
  ["Tham Lang", "Thái Âm", "Hữu Bật", "Thiên Cơ"], // Mậu
  ["Vũ Khúc", "Tham Lang", "Thiên Lương", "Văn Khúc"], // Kỷ
  ["Thái Dương", "Vũ Khúc", "Thái Âm", "Thiên Đồng"], // Canh
  ["Cự Môn", "Thái Dương", "Văn Khúc", "Văn Xương"], // Tân
  ["Thiên Lương", "Tử Vi", "Thiên Phủ", "Vũ Khúc"], // Nhâm
  ["Phá Quân", "Cự Môn", "Thái Âm", "Tham Lang"], // Quý
];

export const HOA_NAMES = ["Hóa Lộc", "Hóa Quyền", "Hóa Khoa", "Hóa Kỵ"] as const;

export const CUC_NAMES: Record<number, string> = {
  2: "Thủy nhị cục",
  3: "Mộc tam cục",
  4: "Kim tứ cục",
  5: "Thổ ngũ cục",
  6: "Hỏa lục cục",
};

/** 30 nạp âm theo thứ tự lục thập hoa giáp (mỗi tên ứng với 2 năm liên tiếp). */
export const NAP_AM: [string, Element][] = [
  ["Hải Trung Kim", "kim"],
  ["Lư Trung Hỏa", "hoa"],
  ["Đại Lâm Mộc", "moc"],
  ["Lộ Bàng Thổ", "tho"],
  ["Kiếm Phong Kim", "kim"],
  ["Sơn Đầu Hỏa", "hoa"],
  ["Giản Hạ Thủy", "thuy"],
  ["Thành Đầu Thổ", "tho"],
  ["Bạch Lạp Kim", "kim"],
  ["Dương Liễu Mộc", "moc"],
  ["Tuyền Trung Thủy", "thuy"],
  ["Ốc Thượng Thổ", "tho"],
  ["Tích Lịch Hỏa", "hoa"],
  ["Tùng Bách Mộc", "moc"],
  ["Trường Lưu Thủy", "thuy"],
  ["Sa Trung Kim", "kim"],
  ["Sơn Hạ Hỏa", "hoa"],
  ["Bình Địa Mộc", "moc"],
  ["Bích Thượng Thổ", "tho"],
  ["Kim Bạch Kim", "kim"],
  ["Phú Đăng Hỏa", "hoa"],
  ["Thiên Hà Thủy", "thuy"],
  ["Đại Trạch Thổ", "tho"],
  ["Thoa Xuyến Kim", "kim"],
  ["Tang Đố Mộc", "moc"],
  ["Đại Khê Thủy", "thuy"],
  ["Sa Trung Thổ", "tho"],
  ["Thiên Thượng Hỏa", "hoa"],
  ["Thạch Lựu Mộc", "moc"],
  ["Đại Hải Thủy", "thuy"],
];

export const HOURS = [
  { value: 0, label: "Tý", range: "23h – 1h" },
  { value: 1, label: "Sửu", range: "1h – 3h" },
  { value: 2, label: "Dần", range: "3h – 5h" },
  { value: 3, label: "Mão", range: "5h – 7h" },
  { value: 4, label: "Thìn", range: "7h – 9h" },
  { value: 5, label: "Tỵ", range: "9h – 11h" },
  { value: 6, label: "Ngọ", range: "11h – 13h" },
  { value: 7, label: "Mùi", range: "13h – 15h" },
  { value: 8, label: "Thân", range: "15h – 17h" },
  { value: 9, label: "Dậu", range: "17h – 19h" },
  { value: 10, label: "Tuất", range: "19h – 21h" },
  { value: 11, label: "Hợi", range: "21h – 23h" },
] as const;
