import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { chinhSachDuLieu } from "@/content/legal";

export const metadata: Metadata = {
  title: "Chính sách dữ liệu cá nhân",
  description: "Ngày giờ sinh là dữ liệu cá nhân. Đây là cách chúng tôi thu thập, dùng, chia sẻ và xóa nó.",
  alternates: { canonical: "/chinh-sach-du-lieu" },
};

export default function Page() {
  return <LegalPage eyebrow="Chính sách" title="Chính sách dữ liệu cá nhân" updated="24/10/2026" intro="Ngày giờ sinh là dữ liệu cá nhân. Đây là cách chúng tôi thu thập, dùng, chia sẻ và xóa nó." body={chinhSachDuLieu} />;
}
