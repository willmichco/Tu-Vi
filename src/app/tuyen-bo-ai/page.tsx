import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { tuyenBoAi } from "@/content/legal";

export const metadata: Metadata = {
  title: "Tuyên bố về AI",
  description: "Chúng tôi không xin bạn tin AI. Đây là cách nội dung được làm ra để bạn tự đánh giá.",
  alternates: { canonical: "/tuyen-bo-ai" },
};

export default function Page() {
  return <LegalPage eyebrow="Chính sách" title="Tuyên bố về AI" updated="24/10/2026" intro="Chúng tôi không xin bạn tin AI. Đây là cách nội dung được làm ra để bạn tự đánh giá." body={tuyenBoAi} />;
}
