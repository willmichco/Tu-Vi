"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { AlertTriangle, Check, CircleAlert, FileUp, Grid3x3, ListChecks, LogOut, Plus, RotateCcw, Save, Search, Trash2 } from "lucide-react";
import {
  DAILY_TARGET,
  KB_SCHOOLS,
  KB_SCHOOL_LABEL,
  KB_TARGET,
  KB_TYPES,
  KB_TYPE_LABEL,
  KEY_SPEC,
  MAJOR_STAR_NAMES,
  WORDS_MAX,
  WORDS_MIN,
  canApprove,
  kbWordCount,
  keySignature,
  keysSummary,
  parseImportItem,
  validateDraft,
  type KbDraft,
  type KbIssue,
  type KbItem,
  type KbStatus,
  type KbType,
} from "@/lib/kb/schema";
import { getSupabase, localStore, supabaseConfigured, supabaseStore, type KbStore } from "@/lib/kb/store";
import { PALACE_NAMES } from "@/lib/tuvi/constants";

type View = "duyet" | "phu" | "nhap";
type StatusFilter = KbStatus | "all";

interface Form extends KbDraft {
  note: string;
}

const emptyForm = (type: KbType = "sao_tai_cung", keys: Record<string, string> = {}): Form => ({
  type,
  keys,
  content: "",
  sources: [{ book: "" }, { book: "" }, { book: "" }],
  school: "nam_phai",
  note: "",
});

const toForm = (it: KbItem): Form => ({
  type: it.type,
  keys: { ...it.keys },
  content: it.content,
  sources: it.sources.length ? it.sources.map((s) => ({ ...s })) : [{ book: "" }, { book: "" }, { book: "" }],
  school: it.school,
  note: it.review_note ?? "",
});

const isToday = (iso: string | null) => {
  if (!iso) return false;
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
};

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

const typingTarget = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

export function AdminKbClient() {
  return supabaseConfigured() ? <SupabaseGate /> : <LocalWorkspace />;
}

function LocalWorkspace() {
  const store = useMemo(() => localStore(), []);
  return <Workspace store={store} />;
}

/** Đăng nhập bằng magic link; chỉ tài khoản có app_metadata.role = "admin" vào được (RLS chặn lần nữa ở DB). */
function SupabaseGate() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const db = getSupabase();
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const store = useMemo(() => supabaseStore(), []);

  if (session === undefined) return <p className="text-sm text-cream-mute">Đang kiểm tra phiên đăng nhập…</p>;

  if (!session)
    return (
      <div className="glass-strong mx-auto max-w-md rounded-3xl p-7">
        <span className="kicker">Admin</span>
        <h1 className="h-display mt-3 text-3xl">Duyệt kho tri thức</h1>
        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            const { error } = await getSupabase().auth.signInWithOtp({
              email,
              options: { emailRedirectTo: window.location.href },
            });
            if (error) setError(error.message);
            else setSent(true);
          }}
        >
          <input className="input" type="email" required placeholder="email admin" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn btn-primary w-full" disabled={sent}>
            {sent ? "Đã gửi link — kiểm tra email" : "Gửi link đăng nhập"}
          </button>
          {error && <p className="text-sm text-ember">{error}</p>}
        </form>
      </div>
    );

  if (session.user.app_metadata?.role !== "admin")
    return (
      <div className="glass-strong mx-auto max-w-lg rounded-3xl p-7">
        <h1 className="h-display text-2xl">Tài khoản chưa có quyền admin</h1>
        <p className="mt-3 text-sm text-cream-dim">
          {session.user.email} đã đăng nhập nhưng chưa được cấp quyền. Chạy trong SQL editor của Supabase rồi đăng nhập lại:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink-800 p-3 font-mono text-[11.5px] text-jade">
          {`update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = '${session.user.email}';`}
        </pre>
        <button className="btn btn-secondary btn-sm mt-5" onClick={() => getSupabase().auth.signOut()}>
          <LogOut size={14} /> Đăng xuất
        </button>
      </div>
    );

  return <Workspace store={store} email={session.user.email} />;
}

function Workspace({ store, email }: { store: KbStore; email?: string }) {
  const [items, setItems] = useState<KbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("duyet");
  const [status, setStatus] = useState<StatusFilter>("draft");
  const [typeFilter, setTypeFilter] = useState<KbType | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  // true = đang soạn mẩu mới có chủ đích (không tự nhảy sang mẩu đầu danh sách).
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    store
      .list()
      .then(setItems)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [store]);

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    return items.filter(
      (it) =>
        (status === "all" || it.status === status) &&
        (typeFilter === "all" || it.type === typeFilter) &&
        (!q || fold(`${it.id} ${keysSummary(it)} ${it.content}`).includes(q)),
    );
  }, [items, status, typeFilter, query]);

  const current = selected ? items.find((it) => it.id === selected) ?? null : null;

  const open = useCallback((it: KbItem | null, preset?: Form) => {
    setSelected(it?.id ?? null);
    setCreating(!it);
    setForm(it ? toForm(it) : preset ?? emptyForm());
    setError(null);
  }, []);

  const dirty = current ? JSON.stringify(toForm(current)) !== JSON.stringify(form) : Boolean(form.content.trim());

  // Chọn sẵn mẩu đầu tiên khi tải xong hoặc khi mẩu đang chọn rơi khỏi bộ lọc — không bao giờ khi còn sửa dở.
  useEffect(() => {
    if (loading || view !== "duyet" || creating || dirty) return;
    if (!filtered.some((it) => it.id === selected) && filtered[0]) open(filtered[0]);
  }, [loading, filtered, selected, view, creating, dirty, open]);

  const issues = useMemo<KbIssue[]>(() => {
    const list = validateDraft(form);
    const sig = keySignature(form);
    const twins = items.filter((it) => it.id !== selected && keySignature(it) === sig);
    const approvedTwin = twins.find((t) => t.status === "approved");
    if (approvedTwin) list.push({ level: "error", message: `Trùng bộ khóa với ${approvedTwin.id} (đã duyệt). Sửa khóa hoặc chuyển ${approvedTwin.id} về nháp.` });
    else if (twins.length) list.push({ level: "warning", message: `Cùng bộ khóa với nháp ${twins.map((t) => t.id).join(", ")} — chỉ một mẩu được duyệt.` });
    return list;
  }, [form, items, selected]);

  const approvedCount = items.filter((it) => it.status === "approved").length;
  const today = items.filter((it) => it.status === "approved" && isToday(it.reviewed_at)).length;

  const neighbour = (dir: 1 | -1) => {
    const i = filtered.findIndex((it) => it.id === selected);
    return filtered[i + dir] ?? null;
  };

  const save = async (next: KbStatus, advance = false) => {
    if (next === "approved" && !canApprove(issues)) {
      setError("Chưa duyệt được: còn lỗi đỏ bên dưới.");
      return;
    }
    setBusy(true);
    setError(null);
    // Lấy mẩu kế tiếp TRƯỚC khi lưu: sau khi duyệt, mẩu hiện tại rời bộ lọc "Nháp".
    const after = advance ? neighbour(1) : null;
    try {
      const saved = await store.save(selected, form, next, form.note.trim() || null);
      setItems((prev) => (prev.some((it) => it.id === saved.id) ? prev.map((it) => (it.id === saved.id ? saved : it)) : [...prev, saved]));
      setFlash(next === "approved" ? `Đã duyệt ${saved.id}` : `Đã lưu ${saved.id}`);
      if (after) open(after);
      else open(saved);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!current || current.status === "approved") return;
    if (!window.confirm(`Xóa nháp ${current.id}?`)) return;
    setBusy(true);
    try {
      const after = neighbour(1) ?? neighbour(-1);
      await store.remove(current.id);
      setItems((prev) => prev.filter((it) => it.id !== current.id));
      setFlash(`Đã xóa ${current.id}`);
      open(after);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  // Phím tắt: ⌘/Ctrl+Enter duyệt & sang mẩu kế, ⌘/Ctrl+S lưu nháp, J/K khi không gõ chữ.
  const saveRef = useRef(save);
  saveRef.current = save;
  const navRef = useRef(neighbour);
  navRef.current = neighbour;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "Enter") {
        e.preventDefault();
        saveRef.current("approved", true);
      } else if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current(current?.status ?? "draft");
      } else if (!mod && !typingTarget(e.target) && (e.key === "j" || e.key === "k")) {
        const it = navRef.current(e.key === "j" ? 1 : -1);
        if (it) open(it);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current?.status, open]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(t);
  }, [flash]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kicker">Admin · kho tri thức</span>
          <h1 className="h-display mt-3 text-3xl sm:text-4xl">Duyệt kho tri thức</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip font-mono text-[11px] ${store.kind === "local" ? "text-ember" : "text-jade"}`}>
            {store.kind === "local" ? "Bản demo · lưu trên trình duyệt này" : `Supabase · ${email}`}
          </span>
          {store.kind === "supabase" && (
            <button className="btn btn-ghost btn-sm" onClick={() => getSupabase().auth.signOut()}>
              <LogOut size={14} /> Thoát
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Progress label="Duyệt hôm nay" value={today} target={DAILY_TARGET} />
        <Progress label="Mẩu approved / mục tiêu MVP" value={approvedCount} target={KB_TARGET} />
      </div>

      <nav className="no-scrollbar mt-6 flex gap-1 overflow-x-auto" aria-label="Chế độ">
        {(
          [
            ["duyet", "Duyệt", ListChecks],
            ["phu", "Độ phủ", Grid3x3],
            ["nhap", "Nhập JSON", FileUp],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            aria-current={view === id}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm transition ${
              view === id ? "bg-gold-400/10 text-gold-200 ring-1 ring-gold-400/40" : "text-cream-dim hover:bg-white/[0.04] hover:text-cream"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="mt-8 text-sm text-cream-mute">Đang tải kho…</p>
      ) : view === "phu" ? (
        <Coverage
          items={items}
          onPick={(sao, cung) => {
            const hit = items.find((it) => it.type === "sao_tai_cung" && it.keys.sao === sao && it.keys.cung === cung);
            setView("duyet");
            setStatus("all");
            setTypeFilter("all");
            setQuery("");
            open(hit ?? null, emptyForm("sao_tai_cung", { sao, cung }));
          }}
        />
      ) : view === "nhap" ? (
        <Importer
          onImport={async (drafts) => {
            const n = await store.importMany(drafts);
            setItems(await store.list());
            setFlash(`Đã nhập ${n} nháp`);
            setStatus("draft");
            setView("duyet");
          }}
        />
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]">
          <aside className="min-w-0">
            <div className="seg grid-cols-3">
              {(
                [
                  ["draft", "Nháp"],
                  ["approved", "Đã duyệt"],
                  ["all", "Tất cả"],
                ] as const
              ).map(([v, l]) => (
                <button key={v} aria-pressed={status === v} onClick={() => setStatus(v)}>
                  {l} <span className="font-mono text-[11px] opacity-70">{v === "all" ? items.length : items.filter((it) => it.status === v).length}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
              <label className="relative">
                <Search size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-cream-mute" />
                <input className="input h-10 pl-9 text-sm" placeholder="Tìm mã, sao, nội dung" value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
              <select className="input h-10 w-auto text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as KbType | "all")} aria-label="Loại">
                <option value="all">Mọi loại</option>
                {KB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {KB_TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-secondary btn-sm mt-2 w-full" onClick={() => open(null)}>
              <Plus size={14} /> Mẩu mới
            </button>
            <ul className="no-scrollbar mt-3 max-h-[62vh] space-y-1.5 overflow-y-auto pr-1">
              {filtered.map((it) => {
                const errs = validateDraft(it).filter((i) => i.level === "error").length;
                return (
                  <li key={it.id}>
                    <button
                      onClick={() => open(it)}
                      aria-current={it.id === selected}
                      className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                        it.id === selected ? "bg-gold-400/10 ring-1 ring-gold-400/40" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                        <span className="text-cream-mute">
                          {it.id} · {KB_TYPE_LABEL[it.type]}
                        </span>
                        {it.status === "approved" ? (
                          <span className="text-jade">đã duyệt</span>
                        ) : errs ? (
                          <span className="text-ember">{errs} lỗi</span>
                        ) : (
                          <span className="text-gold-300">sẵn sàng</span>
                        )}
                      </div>
                      <div className="mt-0.5 truncate text-sm text-cream">{keysSummary(it) || "—"}</div>
                    </button>
                  </li>
                );
              })}
              {!filtered.length && <li className="px-3 py-6 text-center text-sm text-cream-mute">Không có mẩu nào khớp bộ lọc.</li>}
            </ul>
          </aside>

          <Editor
            form={form}
            setForm={setForm}
            current={current}
            issues={issues}
            dirty={dirty}
            busy={busy}
            onSave={() => save(current?.status ?? "draft")}
            onApprove={() => save("approved", true)}
            onUnapprove={() => save("draft")}
            onDelete={remove}
          />
        </div>
      )}

      {(error || flash) && (
        <div
          role="status"
          className={`fixed right-4 bottom-4 z-50 max-w-sm rounded-xl px-4 py-3 text-sm shadow-lg ${error ? "bg-ember/15 text-ember ring-1 ring-ember/40" : "bg-jade/15 text-jade ring-1 ring-jade/40"}`}
        >
          {error ?? flash}
        </div>
      )}
    </div>
  );
}

function Progress({ label, value, target }: { label: string; value: number; target: number }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <div className="card p-4">
      <div className="flex justify-between text-sm">
        <span className="text-cream-dim">{label}</span>
        <span className="font-mono text-cream">
          {value}/{target}
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div className={`h-full rounded-full ${value >= target ? "bg-jade" : "bg-gold-400"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Editor(props: {
  form: Form;
  setForm: (f: Form) => void;
  current: KbItem | null;
  issues: KbIssue[];
  dirty: boolean;
  busy: boolean;
  onSave: () => void;
  onApprove: () => void;
  onUnapprove: () => void;
  onDelete: () => void;
}) {
  const { form, setForm, current, issues, dirty, busy } = props;
  const words = kbWordCount(form.content);
  const patch = (p: Partial<Form>) => setForm({ ...form, ...p });
  const ok = canApprove(issues);

  return (
    <section className="card min-w-0 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-[12px] text-cream-mute">
          {current ? current.id : "Mẩu mới"}
          {current?.status === "approved" && current.reviewed_at && (
            <span className="ml-2 text-jade">· duyệt {new Date(current.reviewed_at).toLocaleString("vi-VN")}</span>
          )}
          {dirty && <span className="ml-2 text-gold-300">· chưa lưu</span>}
        </div>
        <span className="font-mono text-[10.5px] text-cream-mute">⌘/Ctrl+Enter duyệt & sang mẩu kế · ⌘/Ctrl+S lưu · J/K chuyển mẩu</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Loại mẩu">
          <select className="input h-10 text-sm" value={form.type} onChange={(e) => patch({ type: e.target.value as KbType, keys: {} })}>
            {KB_TYPES.map((t) => (
              <option key={t} value={t}>
                {KB_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Trường phái">
          <select className="input h-10 text-sm" value={form.school} onChange={(e) => patch({ school: e.target.value as Form["school"] })}>
            {KB_SCHOOLS.map((s) => (
              <option key={s} value={s}>
                {KB_SCHOOL_LABEL[s]}
              </option>
            ))}
          </select>
        </Field>
        {KEY_SPEC[form.type].map((f) => (
          <Field key={f.name} label={`${f.label}${f.required ? "" : " (tùy chọn)"}`}>
            {f.options ? (
              <select
                className="input h-10 text-sm"
                value={form.keys[f.name] ?? ""}
                onChange={(e) => patch({ keys: { ...form.keys, [f.name]: e.target.value } })}
              >
                <option value="">—</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {f.optionLabel ? f.optionLabel(o) : o}
                  </option>
                ))}
              </select>
            ) : (
              <input className="input h-10 text-sm" value={form.keys[f.name] ?? ""} onChange={(e) => patch({ keys: { ...form.keys, [f.name]: e.target.value } })} />
            )}
          </Field>
        ))}
      </div>

      <Field
        label="Nội dung"
        className="mt-4"
        aside={
          <span className={`font-mono text-[11px] ${words < WORDS_MIN || words > WORDS_MAX ? "text-ember" : "text-jade"}`}>
            {words} chữ · {WORDS_MIN}–{WORDS_MAX}
          </span>
        }
      >
        <textarea
          className="input h-auto min-h-56 py-3 text-[15px] leading-relaxed"
          value={form.content}
          onChange={(e) => patch({ content: e.target.value })}
          placeholder="Giọng chiêm nghiệm, mô tả xu hướng — không phán, không dọa."
        />
      </Field>

      <div className="mt-4">
        <div className="mb-1.5 text-xs text-cream-dim">Nguồn (≥3 sách đồng thuận)</div>
        <div className="space-y-2">
          {form.sources.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_90px_auto] gap-2">
              <input
                className="input h-10 text-sm"
                placeholder={`Sách ${i + 1}`}
                value={s.book}
                onChange={(e) => patch({ sources: form.sources.map((x, j) => (j === i ? { ...x, book: e.target.value } : x)) })}
              />
              <input
                className="input h-10 text-sm"
                placeholder="Trang"
                value={s.page ?? ""}
                onChange={(e) => patch({ sources: form.sources.map((x, j) => (j === i ? { ...x, page: e.target.value } : x)) })}
              />
              <button
                className="btn btn-ghost btn-sm px-2"
                aria-label="Bỏ nguồn"
                onClick={() => patch({ sources: form.sources.filter((_, j) => j !== i) })}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm mt-1 px-0" onClick={() => patch({ sources: [...form.sources, { book: "" }] })}>
          <Plus size={14} /> Thêm nguồn
        </button>
      </div>

      <Field label="Ghi chú duyệt (tùy chọn)" className="mt-3">
        <input className="input h-10 text-sm" value={form.note} onChange={(e) => patch({ note: e.target.value })} placeholder="Lý do sửa, chỗ còn nghi ngờ…" />
      </Field>

      {issues.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {issues.map((i, n) => (
            <li key={n} className={`flex gap-2 text-sm ${i.level === "error" ? "text-ember" : "text-gold-300"}`}>
              {i.level === "error" ? <CircleAlert size={15} className="mt-0.5 shrink-0" /> : <AlertTriangle size={15} className="mt-0.5 shrink-0" />}
              {i.message}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
        <button className="btn btn-primary btn-sm" disabled={busy || !ok} onClick={props.onApprove} title={ok ? "" : "Còn lỗi đỏ"}>
          <Check size={15} /> Duyệt{current?.status === "approved" ? " lại" : ""} & sang mẩu kế
        </button>
        <button className="btn btn-secondary btn-sm" disabled={busy || !dirty} onClick={props.onSave}>
          <Save size={14} /> {current?.status === "approved" ? "Lưu (giữ đã duyệt)" : "Lưu nháp"}
        </button>
        {current?.status === "approved" && (
          <button className="btn btn-secondary btn-sm" disabled={busy} onClick={props.onUnapprove}>
            <RotateCcw size={14} /> Chuyển về nháp
          </button>
        )}
        {current && current.status !== "approved" && (
          <button className="btn btn-ghost btn-sm ml-auto text-ember" disabled={busy} onClick={props.onDelete}>
            <Trash2 size={14} /> Xóa nháp
          </button>
        )}
      </div>
    </section>
  );
}

function Field({ label, aside, className = "", children }: { label: string; aside?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center justify-between text-xs text-cream-dim">
        {label}
        {aside}
      </span>
      {children}
    </label>
  );
}

/** Lưới 14 chính tinh × 12 cung (mẩu "sao tại cung") — phần lớn của mục tiêu 600 mẩu. */
function Coverage({ items, onPick }: { items: KbItem[]; onPick: (sao: string, cung: string) => void }) {
  const cell = (sao: string, cung: string) => {
    const hits = items.filter((it) => it.type === "sao_tai_cung" && it.keys.sao === sao && it.keys.cung === cung);
    return { approved: hits.filter((h) => h.status === "approved").length, draft: hits.filter((h) => h.status === "draft").length };
  };
  const done = MAJOR_STAR_NAMES.reduce((n, s) => n + PALACE_NAMES.filter((c) => cell(s, c).approved > 0).length, 0);

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {KB_TYPES.map((t) => {
          const of = items.filter((it) => it.type === t);
          return (
            <div key={t} className="card p-3">
              <div className="text-xs text-cream-dim">{KB_TYPE_LABEL[t]}</div>
              <div className="mt-1 font-mono text-sm text-cream">
                <span className="text-jade">{of.filter((i) => i.status === "approved").length}</span> / {of.length}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-sm text-cream-dim">
        Chính tinh × cung có ít nhất một mẩu đã duyệt: <span className="font-mono text-cream">{done}/168</span>. Bấm ô để mở hoặc tạo mẩu.
      </p>
      <div className="no-scrollbar mt-3 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th />
              {PALACE_NAMES.map((c) => (
                <th key={c} className="px-1 py-1 font-normal text-cream-mute">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MAJOR_STAR_NAMES.map((s) => (
              <tr key={s}>
                <th className="pr-2 text-left font-normal whitespace-nowrap text-cream-dim">{s}</th>
                {PALACE_NAMES.map((c) => {
                  const { approved, draft } = cell(s, c);
                  return (
                    <td key={c}>
                      <button
                        onClick={() => onPick(s, c)}
                        title={`${s} tại ${c}: ${approved} đã duyệt, ${draft} nháp`}
                        className={`h-8 w-full rounded-md font-mono transition hover:ring-1 hover:ring-gold-400/60 ${
                          approved ? "bg-jade/20 text-jade" : draft ? "bg-gold-400/10 text-gold-300" : "bg-white/[0.03] text-cream-mute"
                        }`}
                      >
                        {approved ? `✓${approved}` : draft ? `n${draft}` : "·"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const SAMPLE_JSON = `[
  {
    "type": "sao_tai_cung",
    "keys": { "sao": "Tử Vi", "cung": "Quan Lộc", "trang_thai": "M" },
    "content": "…80–250 chữ…",
    "sources": [
      { "book": "Tử Vi Đẩu Số Tân Biên — Vân Đằng Thái Thứ Lang", "page": "112" },
      { "book": "Tử Vi Đẩu Số Toàn Thư — Hi Di Trần Đoàn (bản dịch)", "page": "87" },
      { "book": "Tử Vi Nghiệm Lý — Thiên Lương", "page": "45" }
    ]
  }
]`;

function Importer({ onImport }: { onImport: (drafts: KbDraft[]) => Promise<void> }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  type Parsed = { error: string } | { ok: KbDraft[]; bad: string[]; ready: number };
  const parsed = useMemo<Parsed | null>(() => {
    if (!text.trim()) return null;
    try {
      const raw = JSON.parse(text) as unknown;
      const arr = Array.isArray(raw) ? raw : [raw];
      const ok: KbDraft[] = [];
      const bad: string[] = [];
      arr.forEach((r, i) => {
        const res = parseImportItem(r);
        if ("draft" in res) ok.push(res.draft);
        else bad.push(`#${i + 1}: ${res.error}`);
      });
      return { ok, bad, ready: ok.filter((d) => canApprove(validateDraft(d))).length };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [text]);

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-cream-dim">Dán mảng JSON nháp (AI soạn) hoặc chọn file .json — mọi mẩu vào trạng thái nháp.</span>
          <label className="btn btn-secondary btn-sm cursor-pointer">
            <FileUp size={14} /> Chọn file
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) setText(await f.text());
              }}
            />
          </label>
        </div>
        <textarea className="input mt-3 h-auto min-h-72 py-3 font-mono text-[12.5px]" value={text} onChange={(e) => setText(e.target.value)} placeholder={SAMPLE_JSON} />
        {parsed && "error" in parsed && <p className="mt-3 text-sm text-ember">JSON lỗi: {parsed.error}</p>}
        {parsed && "ok" in parsed && (
          <div className="mt-3 space-y-1 text-sm">
            <p className="text-cream">
              {parsed.ok.length} mẩu đọc được · <span className="text-jade">{parsed.ready} đủ điều kiện duyệt</span> · {parsed.ok.length - parsed.ready} cần sửa
            </p>
            {parsed.bad.map((b) => (
              <p key={b} className="text-ember">
                Bỏ qua {b}
              </p>
            ))}
          </div>
        )}
        {err && <p className="mt-3 text-sm text-ember">{err}</p>}
        <button
          className="btn btn-primary btn-sm mt-4"
          disabled={busy || !parsed || "error" in parsed || !parsed.ok.length}
          onClick={async () => {
            if (!parsed || "error" in parsed) return;
            setBusy(true);
            setErr(null);
            try {
              await onImport(parsed.ok);
              setText("");
            } catch (e) {
              setErr((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          Nhập {parsed && "ok" in parsed ? parsed.ok.length : 0} nháp
        </button>
      </div>
      <aside className="card p-5 text-sm text-cream-dim">
        <div className="text-cream">Định dạng</div>
        <pre className="no-scrollbar mt-2 overflow-x-auto rounded-xl bg-ink-800 p-3 font-mono text-[11px] text-jade">{SAMPLE_JSON}</pre>
        <ul className="mt-3 list-disc space-y-1 pl-4">
          <li>Tên sao, cung phải đúng chính tả engine (có dấu) — sai tên sẽ báo lỗi.</li>
          <li>trang_thai: M, V, D, B, H.</li>
          <li>Nguồn và số trang do AI đưa ra phải tự đối chiếu sách trước khi duyệt — AI hay bịa số trang.</li>
        </ul>
      </aside>
    </div>
  );
}
