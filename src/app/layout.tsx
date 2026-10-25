import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Fraunces, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Motion } from "@/components/motion/Motion";
import { IS_PREVIEW, site } from "@/lib/site";
import "./globals.css";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

// Fraunces: serif biến thiên có trục opsz — chữ lớn sắc nét, chữ nhỏ vẫn dễ đọc; nghiêng giữ đúng dấu tiếng Việt.
const serif = Fraunces({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Lập lá số tử vi miễn phí, luận giải AI có nguồn | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
  ...(IS_PREVIEW && { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = {
  themeColor: "#05050a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Đánh dấu có JS trước khi vẽ: phần tử data-reveal chỉ ẩn khi chắc chắn sẽ được hiện lại */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] btn btn-primary btn-sm">
          Bỏ qua tới nội dung
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <div className="grain" aria-hidden="true" />
        <Motion />
      </body>
    </html>
  );
}
