-- Kho tri thức (đặc tả mục 7.2 và 8).
-- Quy tắc: chỉ mẩu approved được truy xuất; approved phải có người duyệt, ≥3 nguồn, 80–250 chữ.
-- Truy xuất ở server chạy bằng service role (bỏ qua RLS); trình duyệt chỉ admin mới đọc/ghi được.
--
-- Cấp quyền admin cho một tài khoản (chạy trong SQL editor, sau khi người đó đăng nhập lần đầu):
--   update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = 'ban@example.com';
-- app_metadata chỉ service role sửa được, người dùng không tự cấp quyền cho mình.

create type public.kb_type as enum ('sao_tai_cung', 'sao_dac_ham', 'cach_cuc', 'tam_phuong', 'tu_hoa', 'van_han');
create type public.kb_school as enum ('nam_phai', 'bac_phai_tu_hoa');
create type public.kb_status as enum ('draft', 'approved');

create or replace function public.is_admin() returns boolean
language sql stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

-- Đếm chữ theo khoảng trắng: một âm tiết tiếng Việt = một chữ. Khớp kbWordCount() ở src/lib/kb/schema.ts.
create or replace function public.kb_word_count(t text) returns integer
language sql immutable
as $$
  select case when btrim(t) = '' then 0 else array_length(regexp_split_to_array(btrim(t), '\s+'), 1) end
$$;

create sequence public.kb_items_seq;

create table public.kb_items (
  -- Mã đọc được (kb-0142) để dẫn nguồn trong readings.cited_ids và hiển thị cho người dùng.
  id text primary key default ('kb-' || lpad(nextval('public.kb_items_seq')::text, 4, '0')),
  type public.kb_type not null,
  keys jsonb not null default '{}'::jsonb,
  content text not null default '',
  -- [{"book": "Tử Vi Đẩu Số Tân Biên — Vân Đằng Thái Thứ Lang", "page": "112"}]
  sources jsonb not null default '[]'::jsonb,
  school public.kb_school not null default 'nam_phai',
  status public.kb_status not null default 'draft',
  -- Bản phát hành kho mà mẩu thuộc về; readings cache theo kb_version nên tăng khi phát hành lại.
  kb_version integer not null default 1,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint kb_keys_object check (jsonb_typeof(keys) = 'object'),
  constraint kb_sources_array check (jsonb_typeof(sources) = 'array'),
  constraint kb_approved_rules check (
    status <> 'approved'
    or (
      reviewed_at is not null
      and jsonb_array_length(sources) >= 3
      and public.kb_word_count(content) between 80 and 250
    )
  )
);

-- Mỗi bộ khóa chỉ có một mẩu approved, để truy xuất và cache luôn ra một kết quả.
create unique index kb_items_approved_keys_uniq on public.kb_items (type, school, keys) where status = 'approved';
create index kb_items_keys_gin on public.kb_items using gin (keys jsonb_path_ops);
create index kb_items_status_type on public.kb_items (status, type);

create or replace function public.kb_items_before_write() returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if new.status = 'approved' then
    -- Đóng dấu người duyệt ở server khi chuyển sang approved hoặc sửa nội dung một mẩu đã duyệt.
    if tg_op = 'INSERT' or old.status <> 'approved'
       or new.content is distinct from old.content
       or new.keys is distinct from old.keys
       or new.sources is distinct from old.sources
       or new.type is distinct from old.type
       or new.school is distinct from old.school then
      new.reviewed_by := coalesce(auth.uid(), new.reviewed_by);
      new.reviewed_at := now();
    end if;
  else
    new.reviewed_by := null;
    new.reviewed_at := null;
  end if;
  return new;
end;
$$;

create trigger kb_items_before_write
before insert or update on public.kb_items
for each row execute function public.kb_items_before_write();

-- Mẩu approved có thể đã được trích trong readings: chuyển về draft trước rồi mới xóa.
create or replace function public.kb_items_before_delete() returns trigger
language plpgsql
as $$
begin
  if old.status = 'approved' then
    raise exception 'Không xóa mẩu đã duyệt (%). Chuyển về draft trước.', old.id;
  end if;
  return old;
end;
$$;

create trigger kb_items_before_delete
before delete on public.kb_items
for each row execute function public.kb_items_before_delete();

alter table public.kb_items enable row level security;

create policy kb_items_admin_select on public.kb_items for select to authenticated using (public.is_admin());
create policy kb_items_admin_insert on public.kb_items for insert to authenticated with check (public.is_admin());
create policy kb_items_admin_update on public.kb_items for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy kb_items_admin_delete on public.kb_items for delete to authenticated using (public.is_admin());

-- Không dựa vào default privileges của project: chỉ authenticated (rồi RLS lọc admin), anon không có gì.
revoke all on public.kb_items from anon;
grant select, insert, update, delete on public.kb_items to authenticated;
grant usage on sequence public.kb_items_seq to authenticated;
