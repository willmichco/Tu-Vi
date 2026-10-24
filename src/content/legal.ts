import { site } from "@/lib/site";

const b = site.business;

export const dieuKhoan = `## Phạm vi dịch vụ

${site.name} là công cụ tra cứu và học tử vi đẩu số. Chúng tôi lập lá số theo phép an sao Nam phái và cung cấp nội dung luận giải do AI viết dựa trên kho tri thức đã duyệt. Dịch vụ **không** phải bói toán, không phán định vận mệnh, không bán lễ giải hạn, cúng sao hay vật phẩm, không chấm điểm hợp tuổi.

## Tài khoản và độ tuổi

- Xem lá số không cần tài khoản. Đăng nhập bằng Google để lưu lá số và mua gói.
- Mua gói, nạp xu và thuê bao chỉ dành cho người **từ 18 tuổi**.

## Lập lá số cho người khác

Ngày giờ sinh là dữ liệu cá nhân. Khi lập lá cho người khác (bố mẹ, người yêu, cộng sự), bạn cam kết **đã có sự đồng ý** của người đó.

## Nội dung do AI tạo

- Bài luận, câu trả lời hỏi đáp, audio và podcast do mô hình AI tạo, dựa trên kho tri thức đã duyệt và ghi nguồn.
- Nội dung chỉ mang tính **tham khảo, chiêm nghiệm**; không phải tư vấn pháp lý, tài chính, y tế hay tâm lý.
- Bạn có thể báo nội dung sai bằng nút “Báo nội dung sai” dưới mỗi bài.

## Thanh toán, xu và lượt hỏi

- Thanh toán bằng chuyển khoản VietQR vào tài khoản đứng tên ${b.legalName}.
- 1 xu = 1.000đ; xu không hết hạn, không chuyển nhượng, không quy đổi ngược ra tiền.
- Lượt hỏi gắn với từng lá số. Một câu hỏi tính 1 lượt khi nội dung gửi đi dưới 8.000 token, vượt ngưỡng tính 2 lượt và được báo trước.

## Giới hạn trách nhiệm

Chúng tôi không chịu trách nhiệm cho các quyết định bạn đưa ra dựa trên nội dung tham khảo của dịch vụ. Trách nhiệm tối đa trong mọi trường hợp không vượt quá số tiền bạn đã thanh toán cho đơn hàng liên quan.

## Thông tin chủ thể kinh doanh

- ${b.legalName}
- Mã số thuế: ${b.taxCode}
- Địa chỉ: ${b.address}
- Email: ${site.email}`;

export const chinhSachDuLieu = `## Dữ liệu chúng tôi thu thập

- **Dữ liệu lá số**: tên gọi của lá (không bắt buộc), giới tính, ngày giờ sinh, năm xem hạn.
- **Tài khoản**: email và tên hiển thị từ Google khi bạn đăng nhập.
- **Giao dịch**: mã đơn, số tiền, thời điểm thanh toán, mã giao dịch ngân hàng.
- **Hỏi đáp**: nội dung câu hỏi và câu trả lời gắn với lá số.
- **Sử dụng**: sự kiện ẩn danh (mở trang, lập lá, thanh toán) để đo phễu sản phẩm.

## Mục đích sử dụng

- An sao, sinh bài luận, audio, PDF và trả lời hỏi đáp cho đúng lá số của bạn.
- Kích hoạt gói, quản lý ví xu, gửi biên nhận.
- Cải thiện sản phẩm qua số liệu tổng hợp, không bán dữ liệu cho bên thứ ba.

## Chuyển dữ liệu ra nước ngoài

Để sinh nội dung, dữ liệu lá số (không kèm email) được gửi tới nhà cung cấp mô hình AI có máy chủ ở nước ngoài. Hạ tầng lưu trữ và gửi email cũng có thể đặt ngoài Việt Nam. Chúng tôi chỉ gửi phần dữ liệu cần thiết cho từng tác vụ.

## Bên xử lý dữ liệu

- Lưu trữ, đăng nhập: Supabase · Lưu trữ web: Vercel
- AI văn bản và giọng nói: Google Gemini
- Đối soát chuyển khoản: SePay · Email: Resend
- Đo lường và lỗi: Google Analytics, PostHog, Sentry — đã che dữ liệu cá nhân, không ghi nội dung câu hỏi kèm email

## Quyền của bạn

- Xem, tải về và sửa dữ liệu lá số trong trang Tài khoản.
- **Xóa từng lá số** hoặc **xóa toàn bộ tài khoản** bất kỳ lúc nào.
- Rút lại sự đồng ý bằng cách xóa dữ liệu hoặc liên hệ ${site.email}.

## Bảo mật

Dữ liệu người dùng được phân quyền theo từng tài khoản (Row Level Security). File audio và PDF lưu ở kho riêng tư, chỉ mở bằng đường dẫn có hạn 1 giờ.`;

export const hoanTien = `## Khi nào được hoàn 100%

- Bạn **chưa dùng lượt nào** của gói và báo trong vòng **7 ngày** kể từ khi thanh toán.
- Xu **chưa tiêu** được hoàn trong vòng **7 ngày** kể từ khi nạp.

## Khi nào không hoàn

Nội dung đã được sinh riêng cho lá số của bạn — bài luận, PDF, audio, podcast — không được hoàn, vì chi phí tạo nội dung đã phát sinh.

## Chuyển khoản dư, thiếu, sai nội dung

- **Dư**: đơn được kích hoạt, phần dư tự cộng vào ví xu.
- **Thiếu**: đơn chuyển sang xử lý tay; chúng tôi liên hệ để bạn chuyển bổ sung hoặc hoàn lại.
- **Sai hoặc thiếu mã đơn**: giao dịch được giữ lại để đối soát tay trong giờ làm việc.

## Cách yêu cầu hoàn tiền

Gửi email tới ${site.email} kèm mã đơn (ví dụ TD7K2Q9M). Chúng tôi phản hồi trong 2 ngày làm việc và hoàn về đúng tài khoản đã chuyển.

## Khiếu nại

Nếu bạn chưa hài lòng với cách xử lý, hãy phản hồi lại email để được xem xét lần hai. Thông tin chủ thể kinh doanh nằm ở cuối mỗi trang.`;

export const tuyenBoAi = `## AI làm gì, không làm gì

- AI **không an sao**. Vị trí mọi sao do engine viết bằng code tính ra, kiểm chứng bằng bộ 200 lá mẫu.
- AI **viết lại** các mẩu tri thức đã duyệt cho đúng lá số của bạn và ghi nguồn từng đoạn.
- AI **không được** dùng kiến thức ngoài kho cho phần “Theo lá số”.

## Kho tri thức được làm thế nào

- Mỗi mẩu soạn từ **ít nhất ${site.stats.sources} nguồn đồng thuận**, viết lại bằng lời của chúng tôi, không chép nguyên văn.
- Người duyệt đọc và bấm duyệt từng mẩu; chỉ mẩu đã duyệt mới được dùng.
- Chỗ các sách mâu thuẫn được ghi là có nhiều quan điểm.

## Kiểm tra trước khi hiện

- Server kiểm tra mọi trích dẫn có nằm trong tập mẩu đã cấp; câu trích sai bị loại và ghi log.
- Danh sách từ cấm chặn câu dọa hạn, phán sinh tử bệnh tật.
- Ngẫu nhiên 20 bài mỗi tuần được người đọc lại.

## Hỏi đáp hai tầng

Mỗi câu trả lời tách hai khối: **Theo lá số** (chỉ từ kho, có nguồn) và **Gợi ý thực tế** (kiến thức phổ thông, kèm lưu ý không phải tư vấn chuyên môn). Trợ lý từ chối dự đoán tuổi thọ, bệnh tật, sinh tử, chấm điểm hợp tuổi.

## Giọng đọc AI

Audio và podcast dùng giọng đọc do AI tạo. Tên sao Hán-Việt được chuẩn hóa phát âm bằng từ điển riêng; nếu nghe sai, hãy báo để chúng tôi sửa.

## Giới hạn

AI có thể diễn đạt vụng hoặc nhấn sai trọng tâm. Hãy đọc kèm phần nguồn, tự chiêm nghiệm, và báo cho chúng tôi khi thấy chỗ sai.`;
