import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { dieuKhoan } from "@/content/legal";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Những gì bạn và chúng tôi cam kết khi dùng dịch vụ.",
  alternates: { canonical: "/dieu-khoan" },
};

export default function Page() {
  return <LegalPage eyebrow="Chính sách" title="Điều khoản sử dụng" updated="24/10/2026" intro="Những gì bạn và chúng tôi cam kết khi dùng dịch vụ." body={dieuKhoan} />;
}
