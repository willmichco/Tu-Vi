/**
 * KHO TRI THỨC MINH HỌA cho bản thiết kế.
 * Kho thật (bảng kb_items) phải soạn từ ≥3 nguồn đồng thuận và duyệt tay (mục 7.2) —
 * các mẩu dưới đây chỉ để dựng giao diện, không dùng cho production.
 */
import { PALACE_TOPIC, type PalaceName } from "@/lib/tuvi/constants";
import { findPalace, relationsOf, type Chart } from "@/lib/tuvi/engine";

export interface KbItem {
  id: string;
  type: "sao_tai_cung" | "sao_dac_ham" | "cach_cuc" | "tam_phuong" | "tu_hoa" | "van_han";
  content: string;
  sources: string[];
}

const SRC = [
  "Tử Vi Đẩu Số Tân Biên — Vân Đằng Thái Thứ Lang",
  "Tử Vi Đẩu Số Toàn Thư — Hi Di Trần Đoàn (bản dịch)",
  "Tử Vi Nghiệm Lý — Thiên Lương",
];

export const STAR_AT_MENH: Record<string, string> = {
  "Tử Vi":
    "Tử Vi là sao chủ của lá số, thường gắn với lòng tự trọng, nhu cầu được giữ vai trò dẫn dắt và sự chú ý tới danh dự. Khi đứng cùng nhiều cát tinh, sách mô tả phong thái điềm tĩnh, biết tổ chức; khi thiếu phù trợ, dễ thành một mình quyết hết mọi việc.",
  "Thiên Cơ":
    "Thiên Cơ thiên về trí tuệ linh hoạt: thích suy xét, so sánh nhiều phương án, nhạy với thay đổi. Đắc địa thì giỏi lập kế hoạch và xoay xở; hãm địa dễ nghĩ nhiều, đổi ý, cần một khung ổn định để phát huy.",
  "Thái Dương":
    "Thái Dương tượng mặt trời: hướng ngoại, rộng rãi, thích cho đi và được ghi nhận. Sáng sủa thì nhiệt huyết, có sức lan tỏa; khi hãm, sách lưu ý dễ hao tâm sức vì người khác và cần học cách giữ năng lượng cho mình.",
  "Vũ Khúc":
    "Vũ Khúc là tài tinh, gắn với tính quyết đoán, thực tế, coi trọng kết quả. Miếu vượng thì bền bỉ, quản lý tiền bạc tốt; thiếu sao hòa hoãn thì dễ cứng nhắc, ít bộc lộ cảm xúc.",
  "Thiên Đồng":
    "Thiên Đồng là phúc tinh: ôn hòa, dễ gần, thích sự thoải mái và hài hòa. Đắc địa thì lạc quan, khéo hòa giải; hãm địa dễ ngại va chạm và thiếu động lực khi không có áp lực từ bên ngoài.",
  "Liêm Trinh":
    "Liêm Trinh mang hai mặt: kỷ luật, nguyên tắc nhưng cảm xúc mạnh. Đắc địa thì chính trực, có năng lực tổ chức; hãm địa hoặc gặp sát tinh, sách khuyên chú ý cách giữ bình tĩnh và đặt ranh giới.",
  "Thiên Phủ":
    "Thiên Phủ là kho: ổn định, thận trọng, giỏi gìn giữ và tích lũy. Người có Thiên Phủ thủ Mệnh thường được mô tả là chu đáo, đáng tin; điểm cần để ý là xu hướng ngại thay đổi.",
  "Thái Âm":
    "Thái Âm tượng mặt trăng: tinh tế, giàu cảm xúc, coi trọng đời sống nội tâm và gia đình. Miếu vượng thì mềm mỏng, có óc thẩm mỹ; hãm địa dễ nhạy cảm và lo xa.",
  "Tham Lang":
    "Tham Lang gắn với mong muốn trải nghiệm, giao tiếp rộng và nhiều tài lẻ. Miếu vượng thì khéo léo, có sức hút; hãm địa dễ phân tán, cần một mục tiêu rõ để dồn năng lượng.",
  "Cự Môn":
    "Cự Môn liên quan đến lời nói, lập luận và tinh thần hoài nghi. Đắc địa thì sắc sảo, giỏi phân tích, hợp việc dùng lời; hãm địa dễ vướng thị phi, nên cân nhắc cách diễn đạt.",
  "Thiên Tướng":
    "Thiên Tướng là ấn tinh: coi trọng công bằng, trách nhiệm, sẵn lòng giúp đỡ. Miếu vượng thì có uy tín, được tin cậy; gặp Tuần Triệt hoặc sát tinh, sách lưu ý dễ ôm việc thay người khác.",
  "Thiên Lương":
    "Thiên Lương là ấm tinh: tính che chở, nguyên tắc, hay đưa lời khuyên. Đắc địa thì chín chắn, có trách nhiệm; hãm địa dễ cố chấp hoặc lo chuyện người khác quá mức.",
  "Thất Sát":
    "Thất Sát là tướng tinh: quyết liệt, độc lập, thích thử thách. Miếu vượng thì can đảm, dám làm; hãm địa dễ nóng vội, nên có phương án dự phòng trước những quyết định lớn.",
  "Phá Quân":
    "Phá Quân là hao tinh của sự đổi mới: phá cái cũ để dựng cái mới. Miếu vượng thì tiên phong, dám thử; hãm địa dễ thay đổi thất thường, cần một nền tảng ổn định đi kèm.",
};

const VO_CHINH_DIEU =
  "Cung Mệnh vô chính diệu (không có chính tinh) được luận bằng cách mượn chính tinh ở cung xung chiếu, kết hợp phụ tinh tại Mệnh và tam phương. Sách thường mô tả người dễ thích nghi, chịu ảnh hưởng nhiều từ môi trường xung quanh.";

const BRIGHT_NOTE: Record<string, string> = {
  M: "ở thế miếu địa — trạng thái phát huy tốt nhất của sao",
  V: "ở thế vượng địa — sao phát huy mạnh",
  D: "ở thế đắc địa — sao phát huy khá",
  B: "ở thế bình hòa — tốt xấu tùy sao đi cùng",
  H: "ở thế hãm địa — mặt hạn chế của sao dễ lộ ra hơn",
};

export interface ReadingSection {
  heading: string;
  body: string;
  cited: number[];
}

export interface Reading {
  palace: PalaceName;
  sections: ReadingSection[];
  sources: { n: number; id: string; source: string }[];
}

/** Ghép bài luận minh họa theo đúng dữ kiện lá — mô phỏng output JSON {sections:[{heading, body, cited_ids}]} của mục 7.4. */
export function buildSampleReading(chart: Chart, palaceName: PalaceName = "Mệnh"): Reading {
  const p = findPalace(chart, palaceName);
  const rel = relationsOf(p.chi);
  const tam = rel.tamHop.map((c) => chart.palaces[c]);
  const xung = chart.palaces[rel.xungChieu];
  const majors = p.major.length ? p.major : xung.major;
  const sections: ReadingSection[] = [];
  const sources: Reading["sources"] = [];
  const cite = (id: string, source: string) => {
    const n = sources.length + 1;
    sources.push({ n, id, source });
    return n;
  };

  if (p.major.length) {
    sections.push({
      heading: `${p.major.map((s) => s.name).join(" – ")} tại cung ${palaceName}`,
      body: p.major.map((s) => STAR_AT_MENH[s.name]).join(" "),
      cited: p.major.map((s, i) => cite(`kb-${s.name.toLowerCase().replace(/\s/g, "-")}-menh`, SRC[i % SRC.length])),
    });
  } else {
    sections.push({
      heading: `Cung ${palaceName} vô chính diệu`,
      body: `${VO_CHINH_DIEU} Ở lá này, cung xung chiếu là ${xung.name} với ${xung.major.map((s) => s.name).join(", ") || "phụ tinh"}.`,
      cited: [cite("kb-vo-chinh-dieu", SRC[0])],
    });
  }

  const bright = majors.filter((s) => s.brightness);
  if (bright.length) {
    sections.push({
      heading: "Độ sáng của sao",
      body:
        bright.map((s) => `${s.name} ${BRIGHT_NOTE[s.brightness!]}`).join("; ") +
        ". Độ sáng quyết định sao thể hiện mặt nào rõ hơn, nên cùng một sao có thể được mô tả khá khác nhau giữa hai lá số.",
      cited: [cite("kb-dac-ham-chinh-tinh", SRC[2])],
    });
  }

  sections.push({
    heading: "Tam phương tứ chính",
    body: `Cung ${palaceName} không đứng một mình mà được đọc cùng ${tam.map((t) => t.name).join(", ")} (tam hợp) và ${xung.name} (xung chiếu). ${tam
      .map((t) => `${t.name} có ${t.major.map((s) => s.name).join(", ") || "vô chính diệu"}`)
      .join("; ")}. Những cung này bổ sung cho bức tranh của ${palaceName}: ${PALACE_TOPIC[palaceName].toLowerCase()}.`,
    cited: [cite("kb-tam-phuong-tu-chinh", SRC[0])],
  });

  if (p.tuan || p.triet) {
    sections.push({
      heading: p.tuan && p.triet ? "Tuần và Triệt cùng án ngữ" : p.tuan ? "Tuần án ngữ" : "Triệt án ngữ",
      body:
        "Sách cho rằng Tuần, Triệt làm giảm bớt cả mặt tốt lẫn mặt xấu của sao trong cung, thường rõ nhất ở giai đoạn đầu đời; vì vậy đọc các sao trong cung này nên đặt kèm yếu tố thời gian.",
      cited: [cite("kb-tuan-triet", SRC[1])],
    });
  }

  if (palaceName === "Mệnh") {
    sections.push({
      heading: `Thân cư ${chart.labels.thanCu}`,
      body: `Cung Thân nằm tại ${chart.labels.thanCu}. Truyền thống xem Mệnh là nền tảng bẩm sinh, Thân là phần thể hiện rõ dần theo tuổi tác — nên lĩnh vực ${PALACE_TOPIC[chart.labels.thanCu].toLowerCase()} đáng được chú ý ở nửa sau cuộc đời.`,
      cited: [cite("kb-than-cu", SRC[0])],
    });
  }

  sections.push({
    heading: "Gợi ý chiêm nghiệm",
    body: "Thay vì hỏi “lá số nói gì về tôi”, hãy hỏi “mô tả nào ở trên khớp với trải nghiệm của tôi, và chỗ nào không”. Tử vi hữu ích nhất khi là tấm gương để tự quan sát, không phải bản án.",
    cited: [],
  });

  return { palace: palaceName, sections, sources };
}

export const SAMPLE_QA = [
  {
    q: "Mình hợp làm công việc kiểu gì?",
    chart: [
      "Câu này liên quan trực tiếp tới cung Quan Lộc và tam phương của nó. Quan Lộc của bạn được đọc cùng Mệnh và Tài Bạch, nên kho tri thức nhìn vào ba điểm: bạn làm việc theo nhịp nào, động lực đến từ đâu, và cách bạn tạo ra giá trị.",
      "Theo các mẩu tri thức được truy xuất, bộ sao ở đây thiên về việc cần phân tích, có cấu trúc và có không gian tự quyết.",
    ],
    practical: [
      "Thử liệt kê 3 dự án bạn thấy “trôi” nhất trong 2 năm qua, rồi đối chiếu xem chúng có điểm chung là tự quyết hay làm theo quy trình.",
      "Nếu đang cân nhắc đổi việc, ưu tiên phỏng vấn thông tin (coffee chat) với 2–3 người trong nghề trước khi quyết.",
    ],
    cited: ["kb-quan-loc-tam-phuong", "kb-thien-co-quan-loc"],
  },
];

export const SAMPLE_TRANSCRIPT = [
  { speaker: "A", text: "Hôm nay mình mở một lá số có cung Mệnh khá đặc biệt. Chị đọc thấy điều gì đầu tiên?" },
  { speaker: "B", text: "Điều đầu tiên là chính tinh ở Mệnh đang ở thế sáng. Sách mô tả đây là lúc sao thể hiện rõ mặt tích cực nhất." },
  { speaker: "A", text: "Nhưng mình thấy có cả Tuần ở đây nữa, vậy có làm “tắt đèn” không?" },
  { speaker: "B", text: "Không hẳn là tắt. Kho tri thức ghi rằng Tuần làm dịu cả mặt tốt lẫn mặt xấu, rõ nhất thời trẻ. Nên đọc kèm yếu tố thời gian." },
];

export const PODCAST_CHAPTERS = [
  { t: "00:00", title: "Mở đầu — bức tranh toàn lá" },
  { t: "03:40", title: "Cung Mệnh và Thân: bạn là ai, bạn trở thành ai" },
  { t: "08:15", title: "Quan Lộc – Tài Bạch: cách làm việc và giữ tiền" },
  { t: "12:50", title: "Phu Thê: hình dung về người bạn đời" },
  { t: "17:20", title: "Đại vận hiện tại: mười năm này là giai đoạn gì" },
  { t: "21:30", title: "Năm xem hạn: điểm đáng chú ý" },
  { t: "25:10", title: "Câu hỏi để tự chiêm nghiệm" },
];
