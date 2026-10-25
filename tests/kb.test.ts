import { describe, expect, it } from "vitest";
import { canApprove, kbWordCount, keySignature, normalizeDraft, parseImportItem, validateDraft, type KbDraft } from "@/lib/kb/schema";

const words = (n: number) => Array.from({ length: n }, () => "chữ").join(" ");
const SOURCES = [
  { book: "Tử Vi Đẩu Số Tân Biên", page: "112" },
  { book: "Tử Vi Đẩu Số Toàn Thư", page: "87" },
  { book: "Tử Vi Nghiệm Lý", page: "45" },
];
const good = (p: Partial<KbDraft> = {}): KbDraft => ({
  type: "sao_tai_cung",
  keys: { sao: "Tử Vi", cung: "Mệnh", trang_thai: "M" },
  content: words(120),
  sources: SOURCES,
  school: "nam_phai",
  ...p,
});
const errors = (d: KbDraft) => validateDraft(d).filter((i) => i.level === "error");

describe("kb schema", () => {
  it("mẩu đủ điều kiện thì duyệt được", () => {
    expect(validateDraft(good())).toEqual([]);
    expect(canApprove(validateDraft(good()))).toBe(true);
  });

  it("đếm chữ theo khoảng trắng, khớp kb_word_count trong SQL", () => {
    expect(kbWordCount("")).toBe(0);
    expect(kbWordCount("  Tử Vi  thủ\n Mệnh ")).toBe(4);
  });

  it("chặn duyệt khi ngoài 80–250 chữ", () => {
    expect(canApprove(validateDraft(good({ content: words(79) })))).toBe(false);
    expect(canApprove(validateDraft(good({ content: words(80) })))).toBe(true);
    expect(canApprove(validateDraft(good({ content: words(250) })))).toBe(true);
    expect(canApprove(validateDraft(good({ content: words(251) })))).toBe(false);
  });

  it("cần ≥3 nguồn", () => {
    expect(canApprove(validateDraft(good({ sources: SOURCES.slice(0, 2) })))).toBe(false);
  });

  it("thiếu khóa bắt buộc hoặc sai tên sao/cung là lỗi", () => {
    expect(errors(good({ keys: { sao: "Tử Vi" } }))).toHaveLength(1);
    expect(errors(good({ keys: { sao: "Tu Vi", cung: "Mệnh" } }))[0].message).toContain("Tu Vi");
    expect(errors(good({ keys: { sao: "Tử Vi", cung: "Mệnh", trang_thai: "X" } }))).toHaveLength(1);
    expect(errors(good({ type: "sao_dac_ham", keys: { sao: "Thiên Cơ" } }))).toHaveLength(1);
  });

  it("chấp nhận phụ tinh, vòng sao, Tuần/Triệt làm khóa sao", () => {
    for (const sao of ["Kình Dương", "Thái Tuế", "Tràng Sinh", "Triệt"]) expect(errors(good({ keys: { sao, cung: "Tài Bạch" } }))).toEqual([]);
  });

  it("cảnh báo (không chặn) từ dễ thành phán/dọa, khớp cả từ nhưng không khớp giữa từ", () => {
    const d = good({ content: `${words(100)} dễ gặp tai họa và nên giải hạn` });
    const w = validateDraft(d).filter((i) => i.level === "warning");
    expect(w).toHaveLength(1);
    expect(w[0].message).toContain("tai họa");
    expect(canApprove(validateDraft(d))).toBe(true);
    expect(validateDraft(good({ content: `${words(100)} chếtt` })).filter((i) => i.level === "warning")).toEqual([]);
  });

  it("cảnh báo nguồn trùng sách và thiếu trang", () => {
    const w = validateDraft(good({ sources: [SOURCES[0], SOURCES[0], { book: "Sách khác" }] })).filter((i) => i.level === "warning");
    expect(w).toHaveLength(2);
  });

  it("chuẩn hóa: bỏ khóa rỗng, khóa lạ, nguồn rỗng, khoảng trắng thừa", () => {
    const n = normalizeDraft(good({ keys: { sao: " Tử Vi ", cung: "Mệnh", trang_thai: "", la: "x" }, content: "  a  b  ", sources: [{ book: " A ", page: " " }, { book: "" }] }));
    expect(n.keys).toEqual({ sao: "Tử Vi", cung: "Mệnh" });
    expect(n.content).toBe("a b");
    expect(n.sources).toEqual([{ book: "A" }]);
  });

  it("chữ ký khóa không phụ thuộc thứ tự", () => {
    expect(keySignature(good({ keys: { sao: "Tử Vi", cung: "Mệnh" } }))).toBe(keySignature(good({ keys: { cung: "Mệnh", sao: "Tử Vi" } })));
    expect(keySignature(good())).not.toBe(keySignature(good({ school: "bac_phai_tu_hoa" })));
  });

  it("đọc JSON nhập: nguồn dạng chuỗi, school mặc định, từ chối type sai", () => {
    const r = parseImportItem({ type: "tam_phuong", keys: { cung: "Mệnh" }, content: "x", sources: ["Sách A", { book: "Sách B", page: 12 }] });
    expect("draft" in r && r.draft).toMatchObject({ school: "nam_phai", sources: [{ book: "Sách A" }, { book: "Sách B", page: "12" }] });
    expect(parseImportItem({ type: "bua_chu", keys: {} })).toHaveProperty("error");
    expect(parseImportItem({ type: "tam_phuong", keys: [] })).toHaveProperty("error");
  });
});
