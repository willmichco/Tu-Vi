import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Compass, Heart, CalendarDays, BookOpen, MoveUpRight } from "lucide-react";
import { BirthForm } from "@/components/chart/BirthForm";
import { Faq } from "@/components/ui/Faq";
import { homeFaq } from "@/content/faq";
import { articles } from "@/content/articles";

const discoveries = [
  { icon: Compass, number: "01", title: "Lá số của bạn", text: "Khám phá bản mệnh qua 12 cung và những mối liên hệ giữa các vì sao.", href: "/la-so?id=mau", label: "Khám phá lá số mẫu" },
  { icon: Heart, number: "02", title: "Thấu hiểu tình duyên", text: "Một góc nhìn để lắng nghe, thấu hiểu bản thân và người đồng hành.", href: "/tu-vi-tinh-duyen", label: "Tìm hiểu tình duyên" },
  { icon: CalendarDays, number: "03", title: "Nhịp vận cuộc đời", text: "Theo dõi đại vận, tiểu vận và dành thời gian chiêm nghiệm từng chặng đường.", href: "/lich-van-han", label: "Khám phá vận hạn" },
];

function CelestialDial() {
  return <div className="celestial-art" aria-label="Minh họa vòng thiên bàn mười hai địa chi" role="img">
    <svg viewBox="0 0 600 600" aria-hidden="true">
      <defs><radialGradient id="dial-glow"><stop stopColor="#ba9b60" stopOpacity=".2"/><stop offset="1" stopColor="#ba9b60" stopOpacity="0"/></radialGradient></defs>
      <circle cx="300" cy="300" r="295" fill="url(#dial-glow)"/>
      {[110, 165, 210, 246, 260].map(r => <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="currentColor" strokeOpacity={r === 246 ? .7 : .25}/>) }
      {Array.from({length: 120}, (_, i) => <line key={i} x1="300" y1="40" x2="300" y2={i % 10 === 0 ? 57 : 46} stroke="currentColor" strokeOpacity=".6" transform={`rotate(${i * 3} 300 300)`}/>) }
      {"TÝ SỬU DẦN MÃO THÌN TỴ NGỌ MÙI THÂN DẬU TUẤT HỢI".split(" ").map((label, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        return <g key={label}><text x={300 + 228 * Math.cos(a)} y={305 + 228 * Math.sin(a)} textAnchor="middle" fill="currentColor" fontSize="12" letterSpacing="2">{label}</text><circle cx={300 + 165 * Math.cos(a)} cy={300 + 165 * Math.sin(a)} r="3" fill="currentColor"/></g>;
      })}
      <path d="M300 135 443 383 157 383Z M300 465 157 217 443 217Z" fill="none" stroke="currentColor" strokeOpacity=".35"/>
      <path d="M300 242v116M242 300h116M270 270l60 60M330 270l-60 60" stroke="currentColor" strokeWidth="1"/>
      <circle cx="300" cy="300" r="36" fill="#173b36" stroke="currentColor"/>
      <text x="300" y="311" textAnchor="middle" fill="currentColor" fontSize="32" fontFamily="serif">紫</text>
    </svg>
    <span className="dial-caption">THIÊN · ĐỊA · NHÂN</span>
  </div>;
}

export default function Home() {
  return <>
    <section className="editorial-hero">
      <div className="container-x hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">TINH ĐỒ / TỬ VI NAM PHÁI</p>
          <h1>Hiểu mình sâu hơn.<br/><em>Bước đi an nhiên.</em></h1>
          <p className="hero-description">Mỗi người là một bầu trời riêng. Khám phá lá số của bạn, tìm hiểu những vì sao và mở thêm một góc nhìn về hành trình phía trước.</p>
          <div className="flex flex-wrap gap-3 mt-8"><a href="#lap-la-so" className="btn btn-primary btn-lg">Lập lá số của bạn <ArrowRight size={17}/></a><Link href="/la-so?id=mau" className="btn btn-secondary btn-lg">Xem lá số mẫu</Link></div>
          <p className="mt-6 text-xs text-cream-dim tracking-wide">Miễn phí lập lá số <span className="mx-3 text-gold-500">✦</span> Không cần đăng nhập</p>
        </div>
        <CelestialDial/>
      </div>
      <div className="hero-bottom container-x"><span>TRI THỨC CỔ TRUYỀN · GÓC NHÌN ĐƯƠNG ĐẠI</span><span>Khám phá cùng Tinh Đồ ↓</span></div>
    </section>
    <section className="paper-section" id="lap-la-so">
      <div className="container-x birth-layout">
        <div><p className="eyebrow">KHỞI ĐẦU TỪ BẠN</p><h2>Một ngày sinh.<br/>Một bản đồ riêng.</h2><p className="section-description">Điền thông tin sinh để lập lá số tử vi. Bạn có thể chọn âm lịch hoặc dương lịch và kiểm tra ngày chuyển đổi trước khi bắt đầu.</p><div className="birth-note"><span>✦</span><p>Hiểu lá số để chiêm nghiệm.<br/>Lựa chọn cuộc sống vẫn thuộc về bạn.</p></div></div>
        <div className="birth-panel"><div className="flex items-center justify-between mb-6"><h3 className="font-serif text-2xl">Lập lá số tử vi</h3><span className="chip">Miễn phí</span></div><Suspense fallback={<p>Đang tải biểu mẫu…</p>}><BirthForm variant="hero"/></Suspense></div>
      </div>
    </section>
    <section className="container-x discovery-section" id="tinh-nang"><div className="section-heading"><div><p className="eyebrow">NHỮNG GÓC NHÌN MỚI</p><h2>Khám phá bầu trời của bạn</h2></div><p>Từ bản mệnh đến những mối quan hệ,<br/>từng bước hiểu mình rõ hơn.</p></div><div className="discovery-grid">{discoveries.map(item => <Link key={item.number} href={item.href} className="discovery-card"><div className="flex justify-between items-center"><item.icon size={27} strokeWidth={1}/><span>{item.number}</span></div><h3>{item.title}</h3><p>{item.text}</p><div className="discovery-link">{item.label}<MoveUpRight size={17}/></div></Link>)}</div></section>
    <section className="wisdom-section"><div className="container-x wisdom-inner"><span className="wisdom-symbol">✧</span><p className="eyebrow">MỘT KHOẢNG LẶNG ĐỂ CHIÊM NGHIỆM</p><h2>Biết mình để sống chủ động.<br/><em>Hiểu người để thương nhiều hơn.</em></h2><Link href="/hoc-tu-vi" className="btn btn-secondary mt-8">Bắt đầu tìm hiểu tử vi <ArrowRight size={16}/></Link></div></section>
    <section className="container-x discovery-section"><div className="section-heading"><div><p className="eyebrow">THƯ VIỆN TINH ĐỒ</p><h2>Tri thức cho người mới bắt đầu</h2></div><Link href="/hoc-tu-vi" className="flex items-center gap-2 text-sm text-gold-300">Xem thư viện <ArrowRight size={16}/></Link></div><div className="article-grid">{articles.slice(0,3).map((a,i)=><Link key={a.slug} href={`/bai-viet/${a.slug}`} className="journal-card"><div className={`journal-art journal-art-${i}`}><BookOpen size={54} strokeWidth={.7}/><span>0{i+1} / TINH ĐỒ</span></div><p className="eyebrow mt-6">{a.category}</p><h3>{a.title}</h3><span className="journal-read">Đọc bài viết <ArrowRight size={15}/></span></Link>)}</div></section>
    <section className="container-x faq-layout"><div><p className="eyebrow">GIẢI ĐÁP CÙNG BẠN</p><h2>Trước khi bắt đầu</h2><p className="section-description">Những điều bạn có thể muốn biết về lá số và cách sử dụng Tinh Đồ.</p></div><Faq items={homeFaq}/></section>
  </>;
}
