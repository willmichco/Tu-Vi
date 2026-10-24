import type { Metadata } from "next";
import { AccountClient } from "./AccountClient";

export const metadata: Metadata = { title: "Tài khoản", robots: { index: false } };

export default function Page() {
  return (
    <div className="container-x py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Tài khoản</span>
          <h1 className="h-display mt-3 text-3xl sm:text-4xl">Chào Minh Anh</h1>
        </div>
        <span className="chip font-mono text-[11px] text-cream-mute">Dữ liệu minh họa · bản thiết kế</span>
      </div>
      <div className="mt-8">
        <AccountClient />
      </div>
    </div>
  );
}
