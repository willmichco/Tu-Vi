import type { Metadata } from "next";
import { AdminKbClient } from "./AdminKbClient";

export const metadata: Metadata = { title: "Duyệt kho tri thức", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <div className="container-x py-8 sm:py-10">
      <AdminKbClient />
    </div>
  );
}
