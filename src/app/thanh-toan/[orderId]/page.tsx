import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = { title: "Thanh toán VietQR", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <div className="container-x py-10 sm:py-14">
      <span className="eyebrow">Thanh toán</span>
      <h1 className="h-display mt-3 text-3xl sm:text-4xl">Chuyển khoản VietQR</h1>
      <p className="mt-2 text-cream-dim">Kích hoạt tự động trong 1–3 phút sau khi ngân hàng báo có.</p>
      <div className="mt-8">
        <Suspense>
          <CheckoutClient orderId={orderId.toUpperCase().slice(0, 12)} />
        </Suspense>
      </div>
    </div>
  );
}
