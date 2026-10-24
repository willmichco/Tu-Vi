import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { hoanTien } from "@/content/legal";

export const metadata: Metadata = {
  title: "Hoàn tiền & khiếu nại",
  description: "Quy tắc hoàn tiền đơn giản, viết rõ trước khi bạn trả tiền.",
  alternates: { canonical: "/hoan-tien" },
};

export default function Page() {
  return <LegalPage eyebrow="Chính sách" title="Hoàn tiền & khiếu nại" updated="24/10/2026" intro="Quy tắc hoàn tiền đơn giản, viết rõ trước khi bạn trả tiền." body={hoanTien} />;
}
