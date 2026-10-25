# Thiết kế website Tử vi AI — bản 0.1 (design build)

Bản thiết kế dựng thành code chạy được, bám **Đặc tả sản phẩm — Nền tảng Tử vi AI (tham chiếu thienban.vn)**. Mục tiêu: chốt giao diện, luồng và hệ thống thiết kế cho MVP, để Đợt 1–2 chỉ còn nối backend.

> Tên thương hiệu **Tinh Đồ** là tên tạm. Đổi một chỗ ở `src/lib/site.ts`.

## 1. Đọc thienban.vn: học gì, vượt ở đâu

Khảo sát 7 trang công khai (trang chủ, Lập lá số, Tử vi Audio, Tình duyên, Lịch vận hạn, Học tử vi, bảng giá) trên desktop 1440px và mobile 390px.

| Thiên Bàn đang làm | Bản thiết kế này |
|---|---|
| Trang chủ nền tối, nhưng Lập lá số / Lịch vận hạn / Học tử vi đổi sang nền kem sáng — lệch tông giữa các trang | Một theme tối duy nhất cho toàn site, cùng bộ token màu |
| Muốn xem lá phải sang trang `/lap-la-so` | Form lập lá ngay trong hero trang chủ; trang Lập lá số có **xem trước lá 2D trực tiếp** khi đang nhập |
| Đổi âm–dương chạy ngầm | Ô xanh **“Đã đổi lịch”** hiện ngày đã đổi ngay khi chọn — người dùng tự kiểm, giảm nhập sai |
| Lá 2D chữ dày, khó đọc trên điện thoại | Lá 2D mobile chỉ hiện chính tinh + số phụ tinh, chạm cung để mở bảng chi tiết |
| Nội dung trang chủ chỉ hiện khi cuộn tới (để trống mảng lớn khi chụp/tải chậm) | Nội dung render sẵn (SSG), không phụ thuộc animation để hiện |
| 3D tải ngay trên trang chủ | Poster SVG tĩnh hiện tức thì, Three.js chỉ tải khi khối hero vào màn hình (desktop) hoặc khi bấm (mobile) — đúng yêu cầu Core Web Vitals mục 12 |
| Giá gạch 35–50% cố định | Tắt mặc định (`showAnchorPrice: false`) — xem mục Rủi ro |
| Giá thuê bao từng bị ẩn, thông tin audio không khớp | Mọi giá (gói, thuê bao, nạp lẻ, Tình duyên) đều lấy từ một file `site.ts` → không thể lệch giữa các trang |

Giữ lại tinh thần đúng của Thiên Bàn: “không chấm điểm”, ghi nguồn cuối bài, bảng so sánh, minh bạch giới hạn AI.

## 2. Hệ thống thiết kế

**Màu** (`src/app/globals.css`, khối `@theme`)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `ink-950 → ink-600` | #05050a → #252536 | Nền, bề mặt |
| `cream / cream-dim / cream-mute` | #efe7d6 / #b0a998 / #827c70 | Chữ chính / phụ / chú thích |
| `gold-200 → gold-600` | #f8e8c4 → #9d7a3c | CTA, nhấn, Mệnh |
| `jade` | #7fe0bd | “Có nguồn”, trạng thái tốt, đã duyệt |
| `silver` | #b9c1ff | Sao lưu niên, Thân, Audio |
| `rose` | #f2a7b8 | Tình duyên |
| `ember` | #ff8e7e | Lỗi, sát tinh, Triệt |
| `el-kim/moc/thuy/hoa/tho` | trắng / xanh lá / xanh lam / đỏ / vàng | Màu sao theo **ngũ hành** |

Độ sáng sao theo **miếu → hãm** = độ đậm/độ phát sáng (`BRIGHTNESS_OPACITY`). Một quy tắc dùng chung cho 2D, 3D, poster, inspector.

**Chữ**: Be Vietnam Pro (giao diện), Noto Serif (tiêu đề, tên sao), JetBrains Mono (nhãn dữ liệu, mã nguồn kb, mã đơn). Nhãn mono viết hoa giãn chữ (`.eyebrow`) là chữ ký “công nghệ” của bộ nhận diện.

**Thành phần**: `.btn-primary` (vàng gradient), `.btn-secondary`, `.card`, `.glass-strong`, `.seg` (segmented control), `.input`, `.chip`, `Paywall`, `Faq` (kèm JSON-LD), `SectionHead`, `Waveform`.

**Nguyên tắc**: mobile trước; mọi trang một CTA chính về Lập lá hoặc Bảng giá; nội dung AI luôn có dòng “Nội dung do AI viết… chỉ mang tính tham khảo” và danh sách nguồn; tôn trọng `prefers-reduced-motion`.

## 3. Sitemap đã dựng (khớp mục 5 đặc tả)

| URL | Trạng thái |
|---|---|
| `/` | Hero + form nhanh + bàn sao 3D, số liệu minh bạch, 6 cách xem, pipeline AI 5 bước, “không làm gì”, so sánh, bảng giá, FAQ (FAQPage), bài nên đọc |
| `/lap-la-so` | Form đầy đủ: âm/dương, tháng nhuận (chỉ hiện khi năm có nhuận), 12 canh giờ, Tý sớm/muộn, không nhớ giờ, UTC+8 cho miền Nam 1968–1975, năm xem hạn, đồng ý điều khoản + đồng ý của người được lập lá. Xem trước lá 2D trực tiếp |
| `/la-so?id=` | 6 tab 3D / 2D / Luận giải / Vận hạn / Hỏi đáp / Audio; bảng chi tiết cung; paywall mờ + mở khóa; thanh tab dưới cho mobile; noindex |
| `/tu-vi-audio` | Nghe thử 20 giây, 4 lý do, mục lục podcast, so sánh chatbot |
| `/tu-vi-tinh-duyen` | Form hai người → **bản xem thử tính thật** (chân dung, Phu Thê, trục đại vận chồng theo năm 2026–2046), 6 phần, 3 bậc giá |
| `/lich-van-han` | Lịch tháng: mỗi ngày một cung (lưu nguyệt theo Đẩu Quân, lưu nhật đi thuận), giá thuê bao niêm yết |
| `/hoc-tu-vi`, `/bai-viet/[slug]` | Tìm kiếm không dấu, lọc danh mục, từ điển 14 chính tinh + 12 cung; 6 bài nền tảng (Article + BreadcrumbList) |
| `/bang-gia` | 4 gói, bảng so sánh, ví xu, nạp lẻ, thuê bao, Tình duyên, VietQR, hoàn tiền, FAQ |
| `/thanh-toan?order=` | QR, số tiền, nội dung CK có nút chép, đếm ngược 30 phút, 4 bước trạng thái, màn hình kích hoạt |
| `/tai-khoan` | Lá số của tôi, gói & lượt hỏi, ví xu + sổ cái, đơn hàng + yêu cầu hóa đơn, xóa lá/xóa tài khoản |
| `/dang-nhap` | Google OAuth |
| `/dieu-khoan`, `/chinh-sach-du-lieu`, `/hoan-tien`, `/tuyen-bo-ai`, `/lien-he` | Bản nháp theo mục 4 và 13 |
| `sitemap.xml`, `robots.txt`, 404 | Có |

## 4. Cái gì thật, cái gì mô phỏng

**Thật, chạy được:**
- `src/lib/lunar.ts` — lịch âm Việt Nam (thuật toán Hồ Ngọc Đức), UTC+7/UTC+8. Qua các ca bắt buộc mục 11: Tết 1985 (21/01 VN, 20/02 TQ), Tết 1968 (29/01 / 30/01), tháng nhuận, ngày 30 tháng thiếu, 600 ngày đổi xuôi–ngược 1930–2026.
- `src/lib/tuvi/engine.ts` — engine an sao Nam phái: 14 chính tinh + đắc hãm, ~90 phụ tinh và vòng sao, Tứ Hóa, Tuần, Triệt, Tràng Sinh, đại vận, tiểu vận, sao lưu niên (lớp Tứ Hóa lưu niên tách nhãn). Chạy ở client nên lá hiện ngay.
- Lá 2D, lá 3D (react-three-fiber), lịch vận hạn, bản xem thử Tình duyên đều tính từ engine.

**Mô phỏng (chờ backend):** nội dung luận giải và kho tri thức (`src/content/kb.ts` — có nhãn “minh họa”), hỏi đáp, audio (trình phát giả lập), QR (chuỗi minh họa, chưa có tài khoản thật), đăng nhập, dữ liệu tài khoản. Công tắc **“Bản thiết kế — xem trạng thái: Miễn phí / Đã mua Chuyên sâu”** ở cuối trang lá số để duyệt cả hai trạng thái.

**Engine chưa qua golden test.** Bảng đắc hãm và vài bảng phụ tinh (Thiên Trù, Lưu Hà…) lấy theo bảng phổ biến; bắt buộc đối chiếu 200 lá với 2 công cụ độc lập (mục 7.1) trước khi mở bán. `ENGINE_VERSION = "0.1.0-design"` hiện trên mọi lá để không ai nhầm.

## 5. Chỗ lệch so với đặc tả và lý do

| Đặc tả | Bản thiết kế | Lý do |
|---|---|---|
| Lá 2D bằng SVG thuần | Lưới HTML/CSS + lớp SVG vẽ đường tam hợp/xung chiếu | Chữ tiếng Việt tự xuống dòng, chọn/copy được, đọc màn hình được. PDF dùng @react-pdf vốn có primitive riêng nên không tái dùng SVG DOM được — dùng chung lớp dữ liệu engine |
| shadcn/ui | Component tự viết theo cùng quy ước (`src/components/ui`) | Ít phụ thuộc cho bản thiết kế; có thể thay bằng shadcn khi dựng form phức tạp ở admin |
| Blog MDX | Nội dung TS (`src/content/articles.ts`) + trình hiển thị markdown tối giản | Đủ cho 6 bài; chuyển sang MDX ở Đợt 1 |
| Mã CK `TB` + 6 ký tự | Tiền tố cấu hình `orderPrefix` (mặc định `TD`) | `TB` trùng chữ viết tắt Thiên Bàn |
| Giá gạch 35–50% | Tắt mặc định | Rủi ro pháp lý, xem dưới |
| Tháng nhuận “quy ước đã công bố” | Ngày 1–15 theo tháng chính, từ 16 sang tháng sau; công bố ngay dưới form | Quy ước phổ biến; đổi ở `effectiveMonth()` nếu chọn quy ước khác |

## 6. Rủi ro cần quyết

1. **Giá gạch cố định** (học Thiên Bàn): giá gốc không có thật dễ bị xem là quảng cáo gây nhầm lẫn; giảm giá là khuyến mại phải tuân quy định (mức giảm, thời hạn, thông báo). Chỉ bật `showAnchorPrice` khi có chương trình khuyến mại thật, có thời hạn.
2. **Số liệu niềm tin** trên trang chủ (`612 mẩu`, `200 lá golden test`) đang là số mục tiêu trong `site.stats`. Chỉ đăng số thật — sai một con số là mất đúng lợi thế “minh bạch”.
3. **Engine chưa kiểm chứng** — sai an sao là mất niềm tin toàn bộ (mục 13).
4. **3D trên Android tầm trung**: đã giới hạn DPR 1.75, sprite thay mesh, poster tĩnh, tự chuyển 2D khi không có WebGL. Vẫn phải đo trên máy thật (Định nghĩa “xong” mục 14).

## 7. Từ bản thiết kế tới MVP

| Việc | File / chỗ nối |
|---|---|
| Lưu lá số, id thật | `src/lib/tuvi/codec.ts` → thay bằng `charts.id` (uuid) + `POST /api/charts` |
| Luận giải thật | `buildSampleReading()` → `GET /api/charts/:id/readings` (RAG theo khóa, kiểm `cited_ids`) |
| Hỏi đáp | `QaTab` → `POST /api/charts/:id/qa` (stream, trừ lượt khi xong) |
| Audio/podcast | `Waveform` nhận `src` từ `GET /api/media/:jobId` (signed URL) |
| Thanh toán | `CheckoutClient` → `POST /api/orders`, chuỗi VietQR từ server, Supabase Realtime thay nút giả lập |
| Đăng nhập | `/dang-nhap` → Supabase Google OAuth, gộp lá theo `anon_session_id` |
| Đo lường | Bắn các sự kiện mục 12 (`chart_created`, `paywall_viewed`, `order_paid`…) ở đúng các nút đã có |
