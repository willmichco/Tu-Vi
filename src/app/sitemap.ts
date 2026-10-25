import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/lap-la-so", "/tu-vi-audio", "/tu-vi-tinh-duyen", "/lich-van-han", "/hoc-tu-vi", "/bang-gia", "/dieu-khoan", "/chinh-sach-du-lieu", "/hoan-tien", "/tuyen-bo-ai", "/lien-he"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...articles.map((a) => ({ url: `${site.url}/bai-viet/${a.slug}`, lastModified: a.updated, priority: 0.6 })),
  ];
}
