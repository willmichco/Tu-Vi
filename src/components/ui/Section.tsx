export function SectionHead({
  eyebrow,
  title,
  desc,
  align = "left",
  as: Tag = "h2",
}: {
  as?: "h1" | "h2";
  eyebrow?: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  align?: "left" | "center";
}) {
  // Tiêu đề trang (h1) nằm sẵn trong màn hình đầu: hiện bằng CSS khi tải, không chờ JS (giữ LCP nhanh)
  const motion = Tag === "h1" ? { className: "intro" } : { "data-stagger": "blur", className: "" };
  return (
    <div {...motion} className={`${motion.className} ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <div className={`kicker ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</div>}
      <Tag className="h-display mt-4 text-[34px] leading-[1.08] sm:text-[48px]">{title}</Tag>
      {desc && <p className="text-pretty mt-5 text-[16.5px] leading-relaxed text-cream-dim">{desc}</p>}
    </div>
  );
}
