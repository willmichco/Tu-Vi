/**
 * Schema mẩu tri thức (bảng kb_items, đặc tả mục 7.2) — dùng chung cho trang admin, import và test.
 * Ràng buộc "approved" ở đây khớp CHECK constraint trong supabase/migrations/20261026000001_kb_items.sql;
 * DB vẫn là lớp chặn cuối, file này để báo lỗi sớm và rõ cho người duyệt.
 */
import {
  BAC_SI_RING,
  BRIGHTNESS_LABEL,
  HOA_NAMES,
  MAJOR_STARS,
  MINOR_STARS,
  PALACE_NAMES,
  THAI_TUE_RING,
  TRANG_SINH_RING,
  type Brightness,
} from "@/lib/tuvi/constants";

export const KB_TYPES = ["sao_tai_cung", "sao_dac_ham", "cach_cuc", "tam_phuong", "tu_hoa", "van_han"] as const;
export type KbType = (typeof KB_TYPES)[number];

export const KB_TYPE_LABEL: Record<KbType, string> = {
  sao_tai_cung: "Sao tại cung",
  sao_dac_ham: "Sao đắc hãm",
  cach_cuc: "Cách cục",
  tam_phuong: "Tam phương",
  tu_hoa: "Tứ Hóa",
  van_han: "Vận hạn",
};

export const KB_SCHOOLS = ["nam_phai", "bac_phai_tu_hoa"] as const;
export type KbSchool = (typeof KB_SCHOOLS)[number];
export const KB_SCHOOL_LABEL: Record<KbSchool, string> = { nam_phai: "Nam phái", bac_phai_tu_hoa: "Bắc phái (Tứ Hóa)" };

export type KbStatus = "draft" | "approved";

export const WORDS_MIN = 80;
export const WORDS_MAX = 250;
export const SOURCES_MIN = 3;
/** Mục tiêu MVP (mục 7.2) và nhịp duyệt (mục 14). */
export const KB_TARGET = 600;
export const DAILY_TARGET = 25;

export interface KbSource {
  book: string;
  page?: string;
}

/** Phần người soạn/duyệt sửa được. */
export interface KbDraft {
  type: KbType;
  keys: Record<string, string>;
  content: string;
  sources: KbSource[];
  school: KbSchool;
}

export interface KbItem extends KbDraft {
  id: string;
  status: KbStatus;
  kb_version: number;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
  updated_at: string;
}

const STAR_NAMES = [
  ...MAJOR_STARS.map((s) => s.name),
  ...Object.keys(MINOR_STARS).filter((n) => !n.startsWith("Hóa ")),
  ...BAC_SI_RING.map((s) => s.name),
  ...THAI_TUE_RING.map((s) => s.name),
  ...TRANG_SINH_RING,
  "Tuần",
  "Triệt",
];
export const MAJOR_STAR_NAMES = MAJOR_STARS.map((s) => s.name);
export const BRIGHTNESS_CODES = Object.keys(BRIGHTNESS_LABEL) as Brightness[];
export const VAN_HAN_KINDS = ["dai_van", "tieu_han", "luu_nien", "luu_nguyet"] as const;
const VAN_HAN_LABEL: Record<string, string> = { dai_van: "Đại vận", tieu_han: "Tiểu hạn", luu_nien: "Lưu niên", luu_nguyet: "Lưu nguyệt" };

export interface KeyField {
  name: string;
  label: string;
  required: boolean;
  /** Không có options = nhập tự do. */
  options?: readonly string[];
  optionLabel?: (v: string) => string;
}

const sao = (required: boolean): KeyField => ({ name: "sao", label: "Sao", required, options: STAR_NAMES });
const cung = (required: boolean): KeyField => ({ name: "cung", label: "Cung", required, options: PALACE_NAMES });
const trangThai = (required: boolean): KeyField => ({
  name: "trang_thai",
  label: "Trạng thái",
  required,
  options: BRIGHTNESS_CODES,
  optionLabel: (v) => BRIGHTNESS_LABEL[v as Brightness] ?? v,
});

/** Khóa truy xuất theo loại mẩu — khớp cách engine trả tên sao/cung để RAG tra bằng keys @> {...}. */
export const KEY_SPEC: Record<KbType, KeyField[]> = {
  sao_tai_cung: [sao(true), cung(true), trangThai(false)],
  sao_dac_ham: [sao(true), trangThai(true)],
  cach_cuc: [{ name: "cach", label: "Tên cách", required: true }, cung(false)],
  tam_phuong: [cung(true)],
  tu_hoa: [{ name: "hoa", label: "Hóa", required: true, options: HOA_NAMES }, sao(false), cung(false)],
  van_han: [
    { name: "loai", label: "Loại hạn", required: true, options: VAN_HAN_KINDS, optionLabel: (v) => VAN_HAN_LABEL[v] ?? v },
    cung(false),
    sao(false),
  ],
};

/**
 * Lời phán / dọa hạn trái định vị sản phẩm (mục 1). Chỉ cảnh báo, không chặn:
 * sách cổ có thể dùng từ này trong ngữ cảnh chấp nhận được, người duyệt quyết.
 */
export const RISKY_PHRASES = [
  "chết",
  "tử vong",
  "yểu",
  "chết yểu",
  "giải hạn",
  "cúng sao",
  "dâng sao",
  "bùa",
  "chắc chắn sẽ",
  "định mệnh",
  "tai họa",
  "tai ương",
  "khắc chồng",
  "khắc vợ",
  "sát phu",
  "ly hôn",
  "phá sản",
  "ung thư",
  "tù tội",
];

export function kbWordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Chuẩn hóa trước khi lưu: bỏ khoảng trắng thừa, khóa rỗng, nguồn rỗng. */
export function normalizeDraft(d: KbDraft): KbDraft {
  const keys: Record<string, string> = {};
  for (const f of KEY_SPEC[d.type] ?? []) {
    const v = d.keys[f.name]?.trim();
    if (v) keys[f.name] = v;
  }
  return {
    type: d.type,
    keys,
    content: d.content.replace(/ /g, " ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(),
    sources: d.sources
      .map((s) => ({ book: s.book.trim(), ...(s.page?.trim() ? { page: s.page.trim() } : {}) }))
      .filter((s) => s.book),
    school: d.school,
  };
}

/** Chữ ký bộ khóa — hai mẩu cùng chữ ký không thể cùng approved (unique index). */
export function keySignature(d: Pick<KbDraft, "type" | "school" | "keys">): string {
  const sorted = Object.keys(d.keys)
    .sort()
    .map((k) => [k, d.keys[k]]);
  return `${d.type}|${d.school}|${JSON.stringify(sorted)}`;
}

export function keysSummary(d: Pick<KbDraft, "type" | "keys">): string {
  return (KEY_SPEC[d.type] ?? [])
    .filter((f) => d.keys[f.name])
    .map((f) => (f.optionLabel ? f.optionLabel(d.keys[f.name]) : d.keys[f.name]))
    .join(" · ");
}

export interface KbIssue {
  level: "error" | "warning";
  message: string;
}

function hasPhrase(text: string, phrase: string): boolean {
  const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<!\\p{L})${esc}(?!\\p{L})`, "iu").test(text);
}

/**
 * Kiểm tra một mẩu. "error" = không được duyệt (DB cũng sẽ từ chối hoặc truy xuất sẽ sai);
 * "warning" = người duyệt tự cân nhắc. Bản nháp được lưu dù còn lỗi, trừ lỗi cấu trúc khóa.
 */
export function validateDraft(d: KbDraft): KbIssue[] {
  const issues: KbIssue[] = [];
  const err = (message: string) => issues.push({ level: "error", message });
  const warn = (message: string) => issues.push({ level: "warning", message });

  const spec = KEY_SPEC[d.type];
  if (!spec) {
    err(`Loại mẩu không hợp lệ: ${d.type}`);
    return issues;
  }
  if (!KB_SCHOOLS.includes(d.school)) err(`Trường phái không hợp lệ: ${d.school}`);

  for (const f of spec) {
    const v = d.keys[f.name]?.trim();
    if (!v) {
      if (f.required) err(`Thiếu khóa “${f.label}”.`);
      continue;
    }
    if (f.options && !f.options.includes(v)) err(`“${v}” không phải ${f.label.toLowerCase()} hợp lệ — sai tên sẽ không bao giờ được truy xuất.`);
  }
  const allowed = new Set(spec.map((f) => f.name));
  for (const k of Object.keys(d.keys)) if (!allowed.has(k) && d.keys[k]?.trim()) err(`Khóa “${k}” không thuộc loại ${KB_TYPE_LABEL[d.type]}.`);

  const words = kbWordCount(d.content);
  if (words < WORDS_MIN) err(`Nội dung ${words} chữ — cần tối thiểu ${WORDS_MIN}.`);
  if (words > WORDS_MAX) err(`Nội dung ${words} chữ — tối đa ${WORDS_MAX}.`);

  const books = d.sources.filter((s) => s.book.trim());
  if (books.length < SOURCES_MIN) err(`Có ${books.length} nguồn — cần ít nhất ${SOURCES_MIN} nguồn đồng thuận.`);
  const distinct = new Set(books.map((s) => s.book.trim().toLowerCase()));
  if (distinct.size < books.length) warn("Có nguồn trùng sách — 3 nguồn đồng thuận nên là 3 sách khác nhau.");
  if (books.some((s) => !s.page?.trim())) warn("Có nguồn chưa ghi trang — khó đối chiếu khi có người báo sai.");

  const risky = RISKY_PHRASES.filter((p) => hasPhrase(d.content, p));
  if (risky.length) warn(`Từ cần cân nhắc (dễ thành phán/dọa): ${risky.join(", ")}.`);

  return issues;
}

export function canApprove(issues: KbIssue[]): boolean {
  return !issues.some((i) => i.level === "error");
}

/**
 * Đọc một mẩu từ JSON nhập vào (bản nháp do AI soạn). Chấp nhận nguồn dạng chuỗi hoặc {book, page}.
 * Trả null kèm lý do nếu không đủ cấu trúc tối thiểu (type hợp lệ, keys là object).
 */
export function parseImportItem(raw: unknown): { draft: KbDraft } | { error: string } {
  if (!raw || typeof raw !== "object") return { error: "không phải object" };
  const r = raw as Record<string, unknown>;
  if (!KB_TYPES.includes(r.type as KbType)) return { error: `type không hợp lệ: ${String(r.type)}` };
  if (!r.keys || typeof r.keys !== "object" || Array.isArray(r.keys)) return { error: "keys phải là object" };
  const keys = Object.fromEntries(Object.entries(r.keys as Record<string, unknown>).map(([k, v]) => [k, String(v ?? "")]));
  const sources: KbSource[] = Array.isArray(r.sources)
    ? r.sources.map((s) =>
        typeof s === "string"
          ? { book: s }
          : { book: String((s as KbSource)?.book ?? ""), page: (s as KbSource)?.page != null ? String((s as KbSource).page) : undefined },
      )
    : [];
  const school = KB_SCHOOLS.includes(r.school as KbSchool) ? (r.school as KbSchool) : "nam_phai";
  return { draft: normalizeDraft({ type: r.type as KbType, keys, content: String(r.content ?? ""), sources, school }) };
}
