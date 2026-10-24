import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { Markdown, headingsOf } from "@/components/ui/Markdown";
import { articles, findArticle } from "@/content/articles";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = findArticle((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/bai-viet/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.excerpt },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const a = findArticle((await params).slug);
  if (!a) notFound();
  const toc = headingsOf(a.body);
  const related = articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.excerpt,
      dateModified: a.updated,
      inLanguage: "vi",
      publisher: { "@type": "Organization", name: site.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: site.url },
        { "@type": "ListItem", position: 2, name: "Học tử vi", item: `${site.url}/hoc-tu-vi` },
        { "@type": "ListItem", position: 3, name: a.title },
      ],
    },
  ];

  return (
    <div className="container-x py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cream-mute">
        <Link href="/" className="hover:text-cream">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link href="/hoc-tu-vi" className="hover:text-cream">
          Học tử vi
        </Link>{" "}
        / <span className="text-cream-dim">{a.category}</span>
      </nav>
      <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,720px)_1fr]">
        <article>
          <div className="eyebrow">{a.category}</div>
          <h1 className="h-display mt-3 text-[34px] leading-tight sm:text-[46px]">{a.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-cream-dim">{a.excerpt}</p>
          <div className="mt-5 flex items-center gap-4 font-mono text-[11.5px] text-cream-mute">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} /> {a.minutes} phút đọc
            </span>
            <span>Cập nhật {a.updated.split("-").reverse().join("/")}</span>
          </div>
          <div className="hairline my-8" />
          <Markdown source={a.body} />
          <div className="mt-12 rounded-2xl border border-gold-400/25 bg-gold-400/[0.05] p-6">
            <div className="font-serif text-xl text-cream">Đối chiếu ngay trên lá số của bạn</div>
            <p className="mt-2 text-sm text-cream-dim">Lập lá miễn phí, chạm vào từng cung để thấy những gì bài viết vừa nói.</p>
            <Link href="/lap-la-so" className="btn btn-primary mt-5">
              Lập lá số miễn phí <ArrowRight size={16} />
            </Link>
          </div>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {toc.length > 0 && (
              <div className="card p-5">
                <div className="eyebrow">Trong bài</div>
                <ol className="mt-3 space-y-2 text-sm">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-cream-dim hover:text-gold-200">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="card p-5">
              <div className="eyebrow">Đọc tiếp</div>
              <ul className="mt-3 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/bai-viet/${r.slug}`} className="text-sm leading-snug text-cream hover:text-gold-200">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
