/**
 * Nơi lưu kho tri thức cho trang admin. Hai chế độ:
 * - Supabase: khi có NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Quyền do RLS (chỉ admin).
 * - Cục bộ: không có biến môi trường (bản xem trước GitHub Pages) — lưu localStorage, chỉ để thử luồng duyệt.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { STAR_AT_MENH } from "@/content/kb";
import { keySignature, normalizeDraft, type KbDraft, type KbItem, type KbStatus } from "./schema";

export interface KbStore {
  kind: "supabase" | "local";
  list(): Promise<KbItem[]>;
  save(id: string | null, draft: KbDraft, status: KbStatus, note?: string | null): Promise<KbItem>;
  importMany(drafts: KbDraft[]): Promise<number>;
  remove(id: string): Promise<void>;
}

const COLUMNS = "id,type,keys,content,sources,school,status,kb_version,reviewed_by,reviewed_at,review_note,created_at,updated_at";

let client: SupabaseClient | null = null;

export function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabase(): SupabaseClient {
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  return client;
}

/** Lỗi Postgres → câu người duyệt hiểu được. */
function explain(e: { code?: string; message: string }): Error {
  if (e.code === "23505") return new Error("Đã có một mẩu approved cùng bộ khóa. Chuyển mẩu cũ về nháp hoặc sửa khóa.");
  if (e.code === "23514") return new Error("Database từ chối: mẩu approved cần ≥3 nguồn và 80–250 chữ.");
  if (e.code === "42501") return new Error("Tài khoản không có quyền admin (RLS từ chối).");
  return new Error(e.message);
}

export function supabaseStore(): KbStore {
  const db = getSupabase();
  return {
    kind: "supabase",
    async list() {
      const { data, error } = await db.from("kb_items").select(COLUMNS).order("id").limit(5000);
      if (error) throw explain(error);
      return data as KbItem[];
    },
    async save(id, draft, status, note) {
      const row = { ...normalizeDraft(draft), status, review_note: note ?? null };
      const q = id ? db.from("kb_items").update(row).eq("id", id) : db.from("kb_items").insert(row);
      const { data, error } = await q.select(COLUMNS).single();
      if (error) throw explain(error);
      return data as KbItem;
    },
    async importMany(drafts) {
      const rows = drafts.map((d) => ({ ...normalizeDraft(d), status: "draft" as const }));
      for (let i = 0; i < rows.length; i += 200) {
        const { error } = await db.from("kb_items").insert(rows.slice(i, i + 200));
        if (error) throw explain(error);
      }
      return rows.length;
    },
    async remove(id) {
      const { error } = await db.from("kb_items").delete().eq("id", id);
      if (error) throw explain(error);
    },
  };
}

const LS_KEY = "tinhdo.kb.v1";

/** Nháp minh họa: 14 đoạn "chính tinh tại Mệnh" đang dùng cho giao diện — chưa đủ chữ, chưa có nguồn, đúng là nháp. */
function seed(): KbItem[] {
  const now = new Date().toISOString();
  return Object.entries(STAR_AT_MENH).map(([sao, content], i) => ({
    id: `kb-${String(i + 1).padStart(4, "0")}`,
    type: "sao_tai_cung",
    keys: { sao, cung: "Mệnh" },
    content,
    sources: [],
    school: "nam_phai",
    status: "draft",
    kb_version: 1,
    reviewed_by: null,
    reviewed_at: null,
    review_note: null,
    created_at: now,
    updated_at: now,
  }));
}

export function localStore(): KbStore {
  const read = (): KbItem[] => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw) as KbItem[];
    } catch {}
    return seed();
  };
  const write = (items: KbItem[]) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {}
  };
  const nextId = (items: KbItem[]) => {
    const max = items.reduce((m, it) => Math.max(m, Number(it.id.replace(/\D/g, "")) || 0), 0);
    return `kb-${String(max + 1).padStart(4, "0")}`;
  };

  return {
    kind: "local",
    async list() {
      return read();
    },
    async save(id, draft, status, note) {
      const items = read();
      const d = normalizeDraft(draft);
      // Giả lập unique index của DB để bản cục bộ báo lỗi giống bản thật.
      if (status === "approved" && items.some((it) => it.id !== id && it.status === "approved" && keySignature(it) === keySignature(d)))
        throw new Error("Đã có một mẩu approved cùng bộ khóa. Chuyển mẩu cũ về nháp hoặc sửa khóa.");
      const now = new Date().toISOString();
      const prev = id ? items.find((it) => it.id === id) : undefined;
      const changed = !prev || prev.status !== status || JSON.stringify([prev.content, prev.keys, prev.sources, prev.type, prev.school]) !== JSON.stringify([d.content, d.keys, d.sources, d.type, d.school]);
      const item: KbItem = {
        ...d,
        id: prev?.id ?? nextId(items),
        status,
        kb_version: prev?.kb_version ?? 1,
        reviewed_by: status === "approved" ? "local" : null,
        reviewed_at: status === "approved" ? (changed ? now : prev!.reviewed_at) : null,
        review_note: note ?? null,
        created_at: prev?.created_at ?? now,
        updated_at: now,
      };
      write(prev ? items.map((it) => (it.id === id ? item : it)) : [...items, item]);
      return item;
    },
    async importMany(drafts) {
      const items = read();
      const now = new Date().toISOString();
      for (const d of drafts)
        items.push({
          ...normalizeDraft(d),
          id: nextId(items),
          status: "draft",
          kb_version: 1,
          reviewed_by: null,
          reviewed_at: null,
          review_note: null,
          created_at: now,
          updated_at: now,
        });
      write(items);
      return drafts.length;
    },
    async remove(id) {
      const items = read();
      if (items.find((it) => it.id === id)?.status === "approved") throw new Error("Không xóa mẩu đã duyệt. Chuyển về nháp trước.");
      write(items.filter((it) => it.id !== id));
    },
  };
}
