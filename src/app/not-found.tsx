import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <div className="font-mono text-sm text-gold-400">404 · vô chính diệu</div>
        <h1 className="h-display mt-4 text-4xl sm:text-5xl">Cung này chưa có sao nào</h1>
        <p className="mt-4 text-cream-dim">Trang bạn tìm không tồn tại hoặc đã đổi địa chỉ.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-secondary">
            Về trang chủ
          </Link>
          <Link href="/lap-la-so" className="btn btn-primary">
            Lập lá số
          </Link>
        </div>
      </div>
    </div>
  );
}
