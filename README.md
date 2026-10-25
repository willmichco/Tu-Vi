# Tinh Đồ — Nền tảng Tử vi AI (bản thiết kế)

Website tử vi Nam phái: lập lá số miễn phí, bàn sao 3D + lá 2D, luận giải AI có dẫn nguồn, hỏi đáp, audio/podcast, Tình duyên, Lịch vận hạn, thanh toán VietQR.

Đây là **bản thiết kế dựng bằng code** theo đặc tả sản phẩm. Lịch âm và engine an sao là thật; AI, thanh toán, đăng nhập đang mô phỏng. Chi tiết: [`docs/DESIGN.md`](docs/DESIGN.md).

## Chạy thử

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # kiểm thử lịch âm + engine an sao
npm run typecheck
npm run build
```

Trang nên xem trước: `/`, `/lap-la-so`, `/la-so?id=mau` (lá số mẫu, thêm `&plan=chuyen-sau` để xem trạng thái đã mở khóa), `/tu-vi-tinh-duyen`, `/bang-gia`, `/thanh-toan?order=TD7K2Q9M&plan=chuyen-sau`.

Deploy:

- **GitHub Pages** (bản xem trước tĩnh): workflow `.github/workflows/pages.yml` tự build `GITHUB_PAGES=true next build` → `out/` và deploy. Bắt buộc vào *Settings → Pages → Source* chọn **GitHub Actions** (nếu để "Deploy from a branch", GitHub chỉ hiển thị README này).
- **Vercel**: kết nối repo, không cần biến môi trường cho bản thiết kế.

## Cấu trúc

```
src/
  app/                 # App Router — mỗi thư mục là một URL trong sitemap đặc tả
  components/
    chart/             # Lá 2D, lá 3D (react-three-fiber), form lập lá
    chart-view/        # Trang lá số: 6 tab, bảng chi tiết cung, paywall
    home/, layout/, ui/
  lib/
    lunar.ts           # Lịch âm Việt Nam UTC+7 / UTC+8
    tuvi/engine.ts     # Engine an sao (chạy client + server)
    site.ts            # Tên thương hiệu, giá, gói — sửa giá ở đây
  content/             # Kho tri thức minh họa, bài viết, FAQ, pháp lý (bản nháp)
tests/                 # Vitest
```

## Kho tri thức: `kb_items` + trang `/admin/kb`

- Schema: `supabase/migrations/20261026000001_kb_items.sql`. DB tự chặn: mẩu `approved` phải có ≥3 nguồn, 80–250 chữ, mỗi bộ khóa chỉ một mẩu approved, không xóa mẩu đã duyệt, server tự đóng dấu người duyệt. RLS: chỉ tài khoản `app_metadata.role = "admin"` đọc/ghi; anon không đọc được (truy xuất RAG chạy bằng service role ở server).
- Luật validate dùng chung cho UI/import: `src/lib/kb/schema.ts` (tên sao/cung phải khớp engine, cảnh báo từ dễ thành phán/dọa).
- Trang `/admin/kb`: duyệt từng mẩu (⌘/Ctrl+Enter duyệt & sang mẩu kế, ⌘/Ctrl+S lưu, J/K chuyển), lưới độ phủ 14 chính tinh × 12 cung, nhập JSON nháp do AI soạn.
- Không có biến môi trường → chế độ demo, lưu localStorage (bản GitHub Pages chạy chế độ này).

Nối Supabase:

1. Tạo project Supabase, chạy file migration trong SQL editor (hoặc `supabase db push`).
2. Authentication → URL Configuration: thêm URL trang admin (ví dụ `http://localhost:3000/admin/kb`, domain thật) vào Redirect URLs.
3. Chép `.env.example` thành `.env.local`, điền URL + publishable key.
4. Mở `/admin/kb`, đăng nhập bằng email (magic link), rồi cấp quyền admin bằng câu SQL trang hiện ra, đăng nhập lại.

## Đổi thương hiệu, giá

Mọi giá, gói, thuê bao, nạp lẻ và thông tin chủ thể kinh doanh nằm trong `src/lib/site.ts`. Màu, font, component trong `src/app/globals.css` và `src/app/layout.tsx`.

Font `public/fonts/BeVietnamPro-*.ttf` dùng cho nhãn 3D, giấy phép SIL OFL (`public/fonts/OFL-BeVietnamPro.txt`).
