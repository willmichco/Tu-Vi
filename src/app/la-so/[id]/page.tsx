import type { Metadata } from "next";
import { Suspense } from "react";
import { ChartView } from "@/components/chart-view/ChartView";

export const metadata: Metadata = {
  title: "Lá số tử vi",
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <ChartView id={id} />
    </Suspense>
  );
}
