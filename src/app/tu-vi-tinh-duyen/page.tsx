import type { Metadata } from "next";
import { Check, Heart, X } from "lucide-react";
import { SectionHead } from "@/components/ui/Section";
import { Faq } from "@/components/ui/Faq";
import { addons, vnd } from "@/lib/site";
import { TinhDuyenClient } from "./TinhDuyenClient";

export const metadata: Metadata = {
  title: "Xem tử vi tình duyên hai người — đối chiếu hai lá số, không chấm điểm",
  description:
    "Đối chiếu hai lá số tử vi: chân dung từng người, cung Phu Thê, trục đại vận chồng theo năm. Không chấm điểm hợp tuổi, không phán nên hay không nên. Xem thử miễn phí.",
  alternates: { canonical: "/tu-vi-tinh-duyen" },
};

const parts = [
  ["Hai người là ai", "Chân dung từ chính tinh thủ Mệnh của mỗi người, kèm đắc hãm thật — không phải mô tả cung hoàng đạo chung chung."],
  ["Hình dung về người bạn đời", "Cung Phu Thê mỗi lá mô tả một hình dung. Bản đọc đặt hình dung đó cạnh người thật đang ở bên bạn — theo cả hai chiều."],
  ["Chỗ giống nhau", "Nơi hai bạn dễ hiểu nhau — và cũng dễ cùng bỏ sót một điểm."],
  ["Chỗ khác nhau", "Nguồn va chạm, đồng thời là chỗ bù được cho nhau."],
  ["Nhịp thời gian", "Ghép đại vận theo năm: năm 2030 mỗi người đang ở giai đoạn nào."],
  ["Việc làm được ngay", "Một hai việc cụ thể rút ra từ chỗ hai lá vênh nhau, không phải lời khuyên chung chung."],
];

const faq = [
  { q: "Vì sao không có điểm phần trăm hợp nhau?", a: "Tử vi đẩu số cổ điển không có thang điểm cho việc hai lá số hợp nhau bao nhiêu. Con số “hợp 87%” không có gốc trong sách nào, nên chúng tôi không đưa ra." },
  { q: "Tam hợp, tứ hành xung có được dùng không?", a: "Không. Đó là quan niệm dân gian về tuổi, không thuộc phép luận Tử Vi Đẩu Số." },
  { q: "Người kia có cần biết không?", a: "Ngày giờ sinh là dữ liệu cá nhân của họ. Điều khoản yêu cầu bạn có sự đồng ý của người kia trước khi nhập." },
];

export default function Page() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 starfield opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-0 size-[700px] glow-rose" />
        <div className="container-x relative py-14 lg:py-20">
          <div className="max-w-3xl">
            <span className="eyebrow !text-rose">Tử vi tình duyên</span>
            <h1 className="h-display mt-4 text-[40px] leading-[1.08] sm:text-[56px]">
              Đọc hai người qua hai lá số.
              <br />
              <span className="text-gold-gradient">Không có điểm số nào ở đây.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-cream-dim">
              Đặt hai lá số cạnh nhau để thấy nhịp sống của mỗi người, chỗ dễ hiểu nhau, chỗ dễ va nhau, và mười năm tới mỗi người đang đi
              qua giai đoạn nào. Phần chân dung, cung Phu Thê và trục đại vận xem miễn phí.
            </p>
          </div>
          <div className="mt-10 scroll-mt-24" id="doi-chieu">
            <TinhDuyenClient />
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <div className="font-serif text-[88px] leading-none text-rose/80 line-through decoration-ember/70 decoration-4 sm:text-[120px]">87%</div>
            <div className="mt-2 font-mono text-[11px] tracking-widest text-cream-mute uppercase">Con số không có trong sách nào</div>
          </div>
          <div>
            <SectionHead
              title="Vì sao không chấm điểm hợp tuổi"
              desc="Tìm “xem tuổi vợ chồng” sẽ ra hàng chục trang cho một con số phần trăm. Tử vi cổ điển không có công thức nào như vậy. Thứ đọc được từ hai lá số hữu ích hơn: hai người vận hành thế nào, và đang ở đâu trên dòng thời gian."
            />
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {["Không cho điểm, không xếp hạng", "Không phán nên hay không nên gắn bó", "Không dự đoán chia tay, ly hôn", "Không dùng tam hợp, tứ hành xung dân gian"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-cream/90">
                  <X size={15} className="mt-0.5 shrink-0 text-ember" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x pb-20">
        <SectionHead eyebrow="Bản đối chiếu đầy đủ" title="Sáu phần, khoảng 20 phút đọc" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parts.map(([t, d], i) => (
            <div key={t} className="card p-6">
              <span className="font-mono text-[11px] text-rose">0{i + 1}</span>
              <div className="mt-3 font-serif text-xl text-cream">{t}</div>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-20">
        <SectionHead align="center" eyebrow="Bảng giá" title="Ba lựa chọn, giá niêm yết" />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {addons.tinhDuyen.map((t, i) => (
            <div key={t.code} className={`flex flex-col rounded-2xl p-6 ${i === 1 ? "glass-strong ring-1 ring-rose/40" : "card"}`}>
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-rose" />
                <span className="font-medium text-cream">{t.name}</span>
              </div>
              <div className="mt-4 font-serif text-4xl text-cream">{vnd(t.price)}</div>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2 text-cream/90">
                    <Check size={15} className="mt-0.5 shrink-0 text-jade" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#doi-chieu" className={`btn mt-6 w-full ${i === 1 ? "btn-primary" : "btn-secondary"}`}>
                Xem thử miễn phí trước
              </a>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-cream-mute">Lượt hỏi đáp của gói tình duyên không hết hạn.</p>
      </section>

      <section className="container-x max-w-3xl">
        <SectionHead eyebrow="Hỏi nhanh" title="Về tình duyên" />
        <div className="mt-8">
          <Faq items={faq} />
        </div>
      </section>
    </>
  );
}
