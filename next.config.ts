import type { NextConfig } from "next";

// GITHUB_PAGES=true: xuất HTML tĩnh vào out/ dưới thư mục con /<repo> (xem .github/workflows/pages.yml).
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? process.env.NEXT_PUBLIC_BASE_PATH ?? "/Tu-Vi" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(pages && {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
