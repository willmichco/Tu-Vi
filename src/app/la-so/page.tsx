import type { Metadata } from "next";
import { Suspense } from "react";
import { ChartView } from "@/components/chart-view/ChartView";

export const metadata: Metadata = {
  title: "Lá số tử vi",
  robots: { index: false, follow: false },
};

// Mã lá số nằm ở ?id= để trang build tĩnh được (GitHub Pages) — không cần server.
export default function Page() {
  return (
    <Suspense>
      <ChartView />
    </Suspense>
  );
}
