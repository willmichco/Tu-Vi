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

Trang nên xem trước: `/`, `/lap-la-so`, `/la-so/mau` (lá số mẫu, thêm `?plan=chuyen-sau` để xem trạng thái đã mở khóa), `/tu-vi-tinh-duyen`, `/bang-gia`, `/thanh-toan/TD7K2Q9M?plan=chuyen-sau`.

Deploy: kết nối repo với Vercel, không cần biến môi trường cho bản thiết kế.

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

## Đổi thương hiệu, giá

Mọi giá, gói, thuê bao, nạp lẻ và thông tin chủ thể kinh doanh nằm trong `src/lib/site.ts`. Màu, font, component trong `src/app/globals.css` và `src/app/layout.tsx`.

Font `public/fonts/BeVietnamPro-*.ttf` dùng cho nhãn 3D, giấy phép SIL OFL (`public/fonts/OFL-BeVietnamPro.txt`).
