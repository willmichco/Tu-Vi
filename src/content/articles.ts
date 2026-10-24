/**
 * 6 bài nền tảng đầu tiên (Đợt 1). Bản thiết kế lưu dạng TS; khi vào build thật chuyển sang MDX trong repo.
 * Cú pháp thân bài: "## " tiêu đề, "- " gạch đầu dòng, **đậm**, đoạn cách nhau bằng dòng trống.
 */
export interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  minutes: number;
  updated: string;
  body: string;
}

export const articles: Article[] = [
  {
    slug: "huong-dan-lap-la-so",
    category: "Bắt đầu",
    title: "Hướng dẫn lập lá số tử vi từ A–Z cho người mới",
    excerpt: "Cần những thông tin gì, nhập âm hay dương lịch, xử lý tháng nhuận và giờ Tý thế nào — tất cả trong 5 phút đọc.",
    minutes: 5,
    updated: "2026-10-20",
    body: `Lá số tử vi là bản đồ 12 cung được dựng từ **năm, tháng, ngày, giờ sinh** và **giới tính**. Chỉ cần sai một trong năm thông tin này, vị trí sao có thể đổi hẳn. Bài này giúp bạn nhập đúng ngay lần đầu.

## Bạn cần chuẩn bị gì

- Ngày sinh: dương lịch (trên giấy khai sinh) hoặc âm lịch (gia đình hay nhớ).
- Giờ sinh: càng chính xác càng tốt. Tử vi chia ngày thành 12 canh giờ, mỗi canh 2 tiếng.
- Giới tính: dùng để xác định chiều đi của đại vận và một số vòng sao.

## Nhập âm lịch hay dương lịch?

Cả hai đều được. Hệ thống đổi ngày theo **lịch Việt Nam múi giờ UTC+7**, nên kết quả có thể khác lịch Trung Quốc ở vài năm — ví dụ Tết Ất Sửu 1985 ở Việt Nam là 21/01, còn Trung Quốc là 20/02. Nếu bạn sinh ở miền Nam giai đoạn 1968–1975, hãy chọn tùy chọn lịch cũ UTC+8.

## Tháng nhuận và giờ Tý

- **Tháng nhuận**: ô này chỉ hiện khi năm âm đó thật sự có tháng nhuận. Quy ước: ngày 1–15 an theo tháng chính, từ ngày 16 an sang tháng sau.
- **Giờ Tý** kéo dài từ 23h đến 1h, vắt qua nửa đêm. Tý sớm (0–1h) tính cho ngày sinh; Tý muộn (23–24h) tính sang ngày hôm sau.

## Sau khi bấm "An sao"

Lá số hiện ngay, tính trên máy của bạn. Bạn có thể xoay bàn sao 3D, chuyển sang lá 2D truyền thống, đọc luận giải cung Mệnh miễn phí và tải PDF. Đăng nhập chỉ để lưu lá số vào tài khoản.`,
  },
  {
    slug: "12-cung-trong-la-so",
    category: "Cấu trúc lá số",
    title: "12 cung trong lá số tử vi: mỗi cung nói về điều gì",
    excerpt: "Từ Mệnh tới Huynh Đệ — 12 cung là 12 lĩnh vực đời sống. Đọc một cung luôn phải nhìn cả tam phương tứ chính.",
    minutes: 6,
    updated: "2026-10-18",
    body: `Lá số có 12 ô xếp quanh thiên bàn ở giữa. Mỗi ô là một **cung**, ứng với một lĩnh vực đời sống, và đứng tại một **địa chi** cố định từ Tý đến Hợi.

## Danh sách 12 cung

- **Mệnh**: tính cách, khí chất, hướng đi chung.
- **Phụ Mẫu**: cha mẹ, cấp trên, giấy tờ.
- **Phúc Đức**: đời sống tinh thần, dòng họ.
- **Điền Trạch**: nhà cửa, tài sản cố định.
- **Quan Lộc**: sự nghiệp, cách làm việc.
- **Nô Bộc**: bạn bè, đồng nghiệp, cộng sự.
- **Thiên Di**: ra ngoài, môi trường xã hội.
- **Tật Ách**: sức khỏe tổng quát, áp lực.
- **Tài Bạch**: tiền bạc, cách kiếm và giữ.
- **Tử Tức**: con cái, sáng tạo.
- **Phu Thê**: hôn nhân, người bạn đời.
- **Huynh Đệ**: anh chị em, người ngang hàng.

## Cung Thân

Ngoài 12 cung, lá số còn có **Thân** — luôn trùng với một trong sáu cung Mệnh, Phúc Đức, Quan Lộc, Thiên Di, Tài Bạch hoặc Phu Thê. Truyền thống xem Mệnh là nền tảng bẩm sinh, Thân là phần thể hiện rõ dần theo tuổi.

## Tam phương tứ chính

Không cung nào được đọc một mình. Mỗi cung luôn đi cùng hai cung **tam hợp** (cách 4 cung) và một cung **xung chiếu** (đối diện). Ví dụ đọc Mệnh phải nhìn cả Quan Lộc, Tài Bạch và Thiên Di. Trên lá 3D, đường vàng nối tam hợp, đường bạc nối xung chiếu.`,
  },
  {
    slug: "14-chinh-tinh",
    category: "Cấu trúc lá số",
    title: "14 chính tinh: danh sách, ngũ hành và vai trò",
    excerpt: "Tử Vi, Thiên Phủ và 12 sao còn lại tạo khung xương của lá số. Độ sáng miếu – vượng – đắc – bình – hãm quyết định sao thể hiện mặt nào.",
    minutes: 7,
    updated: "2026-10-16",
    body: `Trong khoảng hơn 100 sao của một lá số, **14 chính tinh** là khung xương. Chúng chia làm hai chòm: chòm Tử Vi và chòm Thiên Phủ.

## Chòm Tử Vi (6 sao)

- **Tử Vi** (Thổ): sao chủ, tự trọng, dẫn dắt.
- **Thiên Cơ** (Mộc): trí tuệ linh hoạt, tính toán.
- **Thái Dương** (Hỏa): hướng ngoại, cho đi.
- **Vũ Khúc** (Kim): tài tinh, quyết đoán.
- **Thiên Đồng** (Thủy): phúc tinh, ôn hòa.
- **Liêm Trinh** (Hỏa): kỷ luật, cảm xúc mạnh.

## Chòm Thiên Phủ (8 sao)

- **Thiên Phủ** (Thổ): kho, ổn định.
- **Thái Âm** (Thủy): tinh tế, nội tâm.
- **Tham Lang** (Thủy): trải nghiệm, giao tiếp.
- **Cự Môn** (Thủy): lời nói, lập luận.
- **Thiên Tướng** (Thủy): công bằng, trách nhiệm.
- **Thiên Lương** (Mộc): che chở, nguyên tắc.
- **Thất Sát** (Kim): quyết liệt, độc lập.
- **Phá Quân** (Thủy): đổi mới, phá cũ dựng mới.

## Độ sáng: miếu, vượng, đắc, bình, hãm

Cùng một sao nhưng đứng ở địa chi khác nhau sẽ có độ sáng khác nhau. Sao **miếu, vượng** thể hiện rõ mặt tích cực; sao **hãm** dễ lộ mặt hạn chế. Trên lá 3D, sao sáng rực là miếu vượng, sao mờ là hãm. Màu sao theo ngũ hành: Kim trắng, Mộc xanh lá, Thủy xanh lam, Hỏa đỏ, Thổ vàng.

## Cung vô chính diệu

Có lá số mà một vài cung không có chính tinh nào — gọi là **vô chính diệu**. Khi đó cung được luận bằng cách mượn chính tinh ở cung xung chiếu.`,
  },
  {
    slug: "dai-van-la-gi",
    category: "Vận hạn",
    title: "Đại vận là gì? Cách đọc 12 kỳ mười năm trên lá số",
    excerpt: "Đại vận chia đời người thành các kỳ 10 năm, mỗi kỳ do một cung giữ. Khởi từ số cục, đi thuận hay nghịch theo âm dương nam nữ.",
    minutes: 5,
    updated: "2026-10-12",
    body: `**Đại vận** chia cuộc đời thành các giai đoạn 10 năm. Mỗi giai đoạn do một cung "giữ", và tinh thần của cung đó nhuộm màu cả thập kỷ.

## Đại vận bắt đầu từ tuổi nào?

Tuổi khởi đại vận đầu tiên bằng **số cục** của lá số: Thủy nhị cục khởi từ 2 tuổi, Mộc tam cục từ 3 tuổi, Kim tứ cục từ 4, Thổ ngũ cục từ 5, Hỏa lục cục từ 6. Đại vận đầu tiên luôn nằm ở cung Mệnh.

## Đi thuận hay nghịch?

- **Dương nam, âm nữ**: đại vận đi thuận chiều kim đồng hồ (Mệnh → Phụ Mẫu → Phúc Đức…).
- **Âm nam, dương nữ**: đại vận đi nghịch (Mệnh → Huynh Đệ → Phu Thê…).

Năm sinh có can Giáp, Bính, Mậu, Canh, Nhâm là năm dương; Ất, Đinh, Kỷ, Tân, Quý là năm âm.

## Đọc đại vận thế nào cho đúng tinh thần

Đại vận không phải lời tiên tri "mười năm tốt" hay "mười năm xấu". Nó gợi ý **chủ đề** nổi bật của giai đoạn — ví dụ đại vận ở Quan Lộc thường được đọc là giai đoạn công việc chiếm nhiều tâm sức. Trên trang Vận hạn, bạn xem được trọn 12 kỳ và biết mình đang ở kỳ nào.`,
  },
  {
    slug: "khong-nho-gio-sinh",
    category: "Nhập ngày giờ sinh",
    title: "Không nhớ giờ sinh, xem tử vi thế nào?",
    excerpt: "Giờ sinh quyết định cung Mệnh và hàng chục sao. Đây là những gì vẫn đọc được khi thiếu giờ, và cách tìm lại giờ sinh.",
    minutes: 4,
    updated: "2026-10-10",
    body: `Giờ sinh quyết định vị trí **cung Mệnh, cung Thân** và các sao an theo giờ như Văn Xương, Văn Khúc, Địa Không, Địa Kiếp, Hỏa Tinh, Linh Tinh. Thiếu giờ, lá số mất đi phần khung quan trọng.

## Thiếu giờ thì còn đọc được gì?

- Các sao an theo **năm**: Lộc Tồn, Thái Tuế, Thiên Mã, Tứ Hóa…
- Các sao an theo **tháng** và **ngày**: Tả Phù, Hữu Bật, Tam Thai, Bát Tọa…
- Tiểu vận theo năm.

Phần luận theo cung (Mệnh ở đâu, đại vận đi thế nào) sẽ chưa chính xác cho tới khi có giờ.

## Cách tìm lại giờ sinh

- Hỏi người thân, xem giấy chứng sinh của bệnh viện (thường ghi giờ phút).
- Nhớ lại các mốc trong ngày: sinh lúc trời tối, sau bữa trưa, gần sáng…
- Khi chỉ biết khoảng thời gian, hãy lập 2–3 lá với các canh giờ khả dĩ và so với trải nghiệm thực tế.

Chúng tôi **không** cung cấp dịch vụ "chọn giờ sinh mổ" — đó không phải mục đích của công cụ tra cứu.`,
  },
  {
    slug: "am-lich-hay-duong-lich",
    category: "Nhập ngày giờ sinh",
    title: "Nhập ngày sinh âm lịch hay dương lịch? Vì sao lịch Việt khác lịch Trung Quốc",
    excerpt: "Lịch âm Việt Nam tính theo múi giờ UTC+7 nên có năm Tết lệch cả tháng so với Trung Quốc. Nhập sai lịch là sai cả lá số.",
    minutes: 5,
    updated: "2026-10-08",
    body: `Tử vi an sao theo **ngày âm lịch**. Nếu bạn nhập dương lịch, hệ thống phải đổi sang âm — và chỗ này hay sai nhất ở các công cụ dùng lịch Trung Quốc.

## Lịch Việt và lịch Trung Quốc khác nhau ở đâu?

Lịch âm tính ngày Sóc (trăng non) và tiết khí theo **giờ địa phương**. Việt Nam dùng UTC+7, Trung Quốc dùng UTC+8. Phần lớn thời gian hai lịch trùng nhau, nhưng có những năm lệch hẳn:

- Tết Ất Sửu **1985**: Việt Nam 21/01/1985, Trung Quốc 20/02/1985.
- Tết Mậu Thân **1968**: miền Bắc 29/01/1968, miền Nam (khi đó dùng lịch UTC+8) 30/01/1968.

## Nên nhập loại nào?

- Có giấy khai sinh dương lịch: nhập **dương lịch**, hệ thống đổi theo lịch Việt Nam.
- Gia đình chỉ nhớ ngày âm: nhập **âm lịch**, chọn đúng tháng nhuận nếu có.
- Sinh ở miền Nam 1968–1975 và nhớ ngày âm theo lịch cũ: bật tùy chọn **UTC+8**.

Khi nhập, ô xanh bên dưới form luôn hiển thị ngày đã đổi để bạn kiểm tra lại trước khi an sao.`,
  },
];

export const findArticle = (slug: string) => articles.find((a) => a.slug === slug);
