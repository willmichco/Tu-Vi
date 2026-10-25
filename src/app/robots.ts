import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/la-so/", "/thanh-toan/", "/tai-khoan", "/dang-nhap", "/admin/", "/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
