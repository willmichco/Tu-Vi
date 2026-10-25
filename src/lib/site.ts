/**
 * Cấu hình thương hiệu và giá — đổi ở đây, toàn site cập nhật theo.
 * "Tinh Đồ" là tên tạm (working name) cho bản thiết kế.
 */
/** Tiền tố đường dẫn khi chạy dưới thư mục con (GitHub Pages: "/Tu-Vi"); rỗng trên Vercel. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Bản xem trước trên GitHub Pages: chặn công cụ tìm kiếm index. */
export const IS_PREVIEW = BASE_PATH !== "";

export const site = {
  name: "Tinh Đồ",
  tagline: "Tử vi Nam phái, đọc bằng dữ liệu",
  description:
    "Lập lá số tử vi Nam phái miễn phí, xem bàn sao 3D và lá 2D truyền thống, đọc luận giải AI có dẫn nguồn từ kho tri thức duyệt tay. Công cụ tra cứu và học tử vi, không phải dịch vụ bói toán.",
  url: "https://tinhdo.vn",
  email: "hotro@tinhdo.vn",
  /** Tiền tố mã chuyển khoản: tiền tố + 6 ký tự, bỏ 0/O/1/I (mục 8 đặc tả). */
  orderPrefix: "TD",
  /**
   * Giá gạch neo giá. Mặc định TẮT: hiển thị giá gốc không có thật là rủi ro
   * theo quy định khuyến mại — chỉ bật khi có chương trình khuyến mại đã thông báo.
   */
  showAnchorPrice: false,
  business: {
    legalName: "Hộ kinh doanh [Tên chủ thể]",
    taxCode: "[MST — cập nhật sau khi đăng ký]",
    address: "[Địa chỉ đăng ký kinh doanh]",
    bank: "[Ngân hàng] · [Số tài khoản đứng tên hộ kinh doanh]",
  },
  stats: {
    kbApproved: 612,
    kbTarget: 1200,
    goldenCharts: 200,
    sources: 3,
  },
} as const;

export const nav = [
  { href: "/lap-la-so", label: "Lập lá số" },
  { href: "/tu-vi-audio", label: "Tử vi Audio" },
  { href: "/tu-vi-tinh-duyen", label: "Tình duyên" },
  { href: "/lich-van-han", label: "Lịch vận hạn" },
  { href: "/hoc-tu-vi", label: "Học tử vi" },
  { href: "/bang-gia", label: "Bảng giá" },
] as const;

export type PlanCode = "free" | "co-ban" | "chuyen-sau" | "gia-dinh";

export interface Plan {
  code: PlanCode;
  name: string;
  price: number;
  anchor?: number;
  charts: number;
  qaPerChart: number;
  pitch: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

export const plans: Plan[] = [
  {
    code: "free",
    name: "Miễn phí",
    price: 0,
    charts: 1,
    qaPerChart: 0,
    pitch: "Xem ngay, không cần đăng nhập. Đăng nhập chỉ để lưu lá.",
    features: [
      "Lá số 3D tương tác + lá 2D truyền thống",
      "Luận giải AI cung Mệnh, có nguồn",
      "Audio mở đầu ~2 phút, hai giọng",
      "Bảng đại vận, tiểu vận trọn đời",
      "Xuất PDF lá số",
    ],
    cta: "Lập lá số miễn phí",
  },
  {
    code: "co-ban",
    name: "Cơ bản",
    price: 129_000,
    anchor: 199_000,
    charts: 1,
    qaPerChart: 50,
    pitch: "Đọc trọn lá số của bạn.",
    features: ["Mọi thứ của gói Miễn phí", "Luận giải AI đủ 12 cung", "Luận vận hạn theo năm", "50 lượt hỏi đáp AI"],
    cta: "Chọn gói Cơ bản",
  },
  {
    code: "chuyen-sau",
    name: "Chuyên sâu",
    price: 299_000,
    anchor: 499_000,
    charts: 1,
    qaPerChart: 1_000,
    pitch: "Gấp 20 lần lượt hỏi, thêm podcast riêng cho lá của bạn.",
    features: [
      "Mọi thứ của gói Cơ bản",
      "1.000 lượt hỏi đáp AI",
      "Podcast 25–30 phút, hai giọng AI",
      "Hỗ trợ ưu tiên",
    ],
    highlight: true,
    cta: "Chọn gói Chuyên sâu",
  },
  {
    code: "gia-dinh",
    name: "Gia đình",
    price: 750_000,
    anchor: 1_500_000,
    charts: 3,
    qaPerChart: 1_000,
    pitch: "Quyền lợi Chuyên sâu cho 3 lá số: bạn và người thân.",
    features: ["Như gói Chuyên sâu, cho 3 lá", "1.000 lượt hỏi mỗi lá", "Podcast cho từng lá", "Hỗ trợ ưu tiên"],
    cta: "Chọn gói Gia đình",
  },
];

export const compareRows: { label: string; values: (string | boolean)[] }[] = [
  { label: "Lá số 3D + 2D", values: [true, true, true, true] },
  { label: "Xuất PDF", values: [true, true, true, true] },
  { label: "Luận giải cung Mệnh", values: [true, true, true, true] },
  { label: "Luận giải đủ 12 cung", values: [false, true, true, true] },
  { label: "Luận vận hạn theo năm", values: [false, true, true, true] },
  { label: "Lượt hỏi đáp / lá", values: ["—", "50", "1.000", "1.000"] },
  { label: "Audio mở đầu ~2 phút", values: [true, true, true, true] },
  { label: "Podcast 25–30 phút", values: [false, false, true, true] },
  { label: "Số lá số", values: ["1", "1", "1", "3"] },
  { label: "Hỗ trợ ưu tiên", values: [false, false, true, true] },
];

export const addons = {
  tinhDuyen: [
    { code: "td-doc", name: "Bản đọc", price: 50_000, features: ["Bản đối chiếu 6 phần, ~20 phút đọc"] },
    {
      code: "td-audio",
      name: "Bản đọc + audio",
      price: 129_000,
      features: ["Bản đối chiếu 6 phần", "Audio hai giọng để nghe cùng nhau", "10 lượt hỏi đáp về hai lá"],
    },
    {
      code: "td-tron",
      name: "Trọn gói",
      price: 199_000,
      features: ["Bản đối chiếu 6 phần", "Audio hai giọng", "100 lượt hỏi đáp về hai lá"],
    },
  ],
  lichVanHan: [
    { code: "lvh-thang", name: "Theo tháng", xu: 89, period: "tháng" },
    { code: "lvh-nam", name: "Theo năm", xu: 599, period: "năm" },
  ],
  topupQa: [
    { code: "qa-20", turns: 20, xu: 29 },
    { code: "qa-100", turns: 100, xu: 99 },
  ],
  xuPacks: [50, 100, 200, 500],
};

export const vnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;
